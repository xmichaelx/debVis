import d3 = require("d3");
import * as aq21 from "./aq21";

function getDimension(attributes:aq21.Attribute[], name:string) : number {
    var attrs =  attributes.filter(function(x) {
        return x.name == name;
    });

    if (attrs.length  == 0) {
        throw "No matching attribute found";
    } else {
        var attr = attrs[0];
        switch (attr.domain.type) {
            case "linear":
            case "nominal" :
                return (<aq21.NominalDomain>attr.domain).values.length;
            case "integer":
            case "continuous":
                return attr.splitPoints.length + 1;
        }
    }
}


function computeLines(dims : number[], lineWidth:number, cellSize:number) {
    var widths = new Float32Array(dims.reduce(function(x,y) { return x*y; } , 1) + 1);
    for (var i =0;i<widths.length;i++) {
        widths[i] = lineWidth;
    }

    for (var i =0;i<dims.length;i++) {
        var stepSize = dims.slice().filter(function(x,j) { return j > i; }).reduce(function(x,y) { return x*y; } , 1);

        if (stepSize == 1) {
            break;
        }

        for (var j =0;j<widths.length;j+=stepSize) {
            widths[j] *= 2;
        }
    }

    var positions = new Float32Array(widths.length);
    var prev = 0;
    
    for (var i =0;i<positions.length;i++) {
        positions[i] = prev;
        prev += cellSize + widths[i];
    }

    return {
        positions: positions,
        widths : widths
    };
}



export class GLD {
    public dimensions : { x: number[], y:number[]};
    public lines : { x: { positions: Float32Array, widths: Float32Array}, y:{ positions: Float32Array, widths: Float32Array}};
    public cellSize = {x : 8, y: 8};
    public lineWidth = 1;
    public heightForXLabels:number;
    public widthForYLabels:number;
    public labelHeight = 30;
    public width:number;
    public height:number;
    public graph:d3.Selection<any>;
    public tooltip:d3.Selection<any>;
    public xAttributes:string[];
    public yAttributes:string[];


    constructor(discretized_attributes: aq21.Attribute[],  xAttributes : string[], yAttributes:string[]) {
        this.xAttributes = xAttributes;
        this.yAttributes = yAttributes;

        this.dimensions = {
            x : xAttributes.map((name) => getDimension(discretized_attributes, name)),
            y : yAttributes.map((name) => getDimension(discretized_attributes, name))
        };

        this.lines = {
            x: computeLines(this.dimensions.x, this.lineWidth, this.cellSize.x),
            y: computeLines(this.dimensions.y, this.lineWidth, this.cellSize.y)
        } 

        this.heightForXLabels = xAttributes.length * this.labelHeight;
        this.widthForYLabels = yAttributes.length * this.labelHeight;

        this.width = this.lines.x.positions[this.lines.x.positions.length-1] + this.lines.x.widths[this.lines.x.widths.length-1] + this.widthForYLabels;
        this.height = this.lines.y.positions[this.lines.y.positions.length-1] + this.lines.y.widths[this.lines.y.widths.length-1] + this.heightForXLabels;
    }


    public initialize(element:HTMLDivElement) {
        this.tooltip = d3.select("body")
                .append("div")
                .style("background-color", "white")
                .style("position", "absolute")
                .style("z-index", "10")
                .style("visibility", "hidden")
                .text("a simple tooltip");
                
         this.graph = d3.select(element)
            .append("svg:svg")
            .attr("width", this.width)
            .attr("height", this.height); 

    }


    drawRectangle(x:number,y:number,width:number,height:number, color:string, ruleString:string) {
        var left = this.lines.x.positions[x] + this.lines.x.widths[x] /2;
        var right = this.lines.x.positions[x+width] + this.lines.x.widths[x+width] /2;

        
        var top = this.lines.y.positions[y] +  this.lines.y.widths[y] /2;
        var bottom =  this.lines.y.positions[y+height] +  this.lines.y.widths[y+height] /2;

        var rect = this.graph.append("rect")
            .attr("x", left + this.widthForYLabels)
            .attr("y", top + this.heightForXLabels)
            .attr("width", right - left)
            .attr("height", bottom - top)
            .style("fill", color)
            .style("opacity", .7);

            rect.on("mouseenter", function(){ 
                rect
                .style("stroke", "rgb(0,0,0)")
                .attr("stroke-width", 5);
             })
            .on("mouseover", () => {
                return this.tooltip.text(ruleString).style("visibility", "visible");})
            .on("mousemove", () => {
                return this.tooltip.style("top", ((<MouseEvent>event).pageY-10)+"px").style("left",((<MouseEvent>event).pageX+10)+"px");})
            .on("mouseout", () => {
                rect.style("stroke", "rgb(0,0,0)").attr("stroke-width", 0);
                return this.tooltip.style("visibility", "hidden");});
    }

    public draw() {



        // lines
        for (var j=0; j <this.lines.x.positions.length; j++) {
            var lineWidth = this.lines.x.widths[j];
            this.graph.append("svg:line")
                .attr("x1", this.widthForYLabels + this.lines.x.positions[j] + lineWidth/2)
                .attr("y1", this.heightForXLabels)
                .attr("x2", this.widthForYLabels + this.lines.x.positions[j] + lineWidth/2)
                .attr("y2", this.height + this.heightForXLabels)
                .style("stroke", "rgb(0,0,0)")
                .style("stroke-width", lineWidth);            
        }


        for (var j=0; j < this.lines.y.positions.length; j++) {
            var lineHeight = this.lines.y.widths[j];
            this.graph.append("svg:line")
                .attr("x1", this.widthForYLabels)
                .attr("y1", this.heightForXLabels + this.lines.y.positions[j] + lineHeight/2)
                .attr("x2", this.widthForYLabels + this.width)
                .attr("y2", this.heightForXLabels + this.lines.y.positions[j] + lineHeight/2)
                .style("stroke", "rgb(0,0,0)")
                .style("stroke-width", lineHeight);            
        }


        // labels
        for (var i = 0;i<this.dimensions.x.length;i++) {
            var widthCells = this.dimensions.x.slice(i+1).reduce((x,y) => x * y, 1);
            var width = this.lines.x.positions[widthCells];

            this.graph.append("svg:line")
                .attr("x1", this.widthForYLabels )
                .attr("y1", i * 30 + 15)
                .attr("x2", this.widthForYLabels + width)
                .attr("y2", i * 30 + 15)
                .style("stroke", "rgb(0,0,0)")
                .style("stroke-width", 5);     

            this.graph.append("text")
                .attr("x", this.widthForYLabels + width + 10)
                .attr("y", i * 30 + 15)
                .attr("dy", ".35em")
                .text(this.xAttributes[i]);  
        }

        for (var i = 0;i<this.dimensions.y.length;i++) {
            var heightCells = this.dimensions.y.slice(i+1).reduce((x,y) => x * y, 1);
            var height = this.lines.y.positions[heightCells];

            this.graph.append("svg:line")
                .attr("x1", i * 30 + 15 )
                .attr("y1", this.heightForXLabels)
                .attr("x2", i * 30 + 15 )
                .attr("y2", this.heightForXLabels + height)
                .style("stroke", "rgb(0,0,0)")
                .style("stroke-width", 5);     

            this.graph.append("text")
                .attr("x", i * 30 + 15)
                .attr("y", this.heightForXLabels + height+ 10)
                .text(this.yAttributes[i])
                .attr("style", "writing-mode: tb; ");  
        }
    }


}

