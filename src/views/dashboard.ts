import * as aq21 from "../gld/aq21";
import * as gld from "../gld/gld";
import * as discretization from "../gld/discretization";
import d3 = require("d3");
var D3 = <any>d3;


export class Dashboard {
    public experiment : aq21.Experiment = null;
    public fileLoader : HTMLInputElement;
    public canvas: HTMLDivElement;
    public xAttributes:string[] = [];
    public yAttributes:string[] = [];

    
    public set xAttributesString(value:string) {
        this.xAttributes =  value.split(",").map(x=>x.trim());
    }

    public get xAttributesString() {
        return this.xAttributes.join(",");
        
    }

    public set yAttributesString(value:string) {
        this.yAttributes =  value.split(",").map(x=>x.trim());
    }

    public get yAttributesString() {
        return this.yAttributes.join(",");
        
    }


    public attached() {
        this.fileLoader.onchange = (e) => {
            var file = (<any>e.target).files[0];
            if (!file) {
                return;
            }
            var reader = new FileReader();
            reader.onload = (e) => {
                var contents = (<any>e.target).result;
                this.displayContents(contents);
            };
            reader.readAsText(file);
        };
    }

    public compute(attribute:aq21.Attribute) {
       attribute.splitPoints = discretization.splitPointsFromRules(attribute, this.experiment.runs);
    }


    displayContents(contents:string) {
        var blocks = aq21.extractBlocks(contents);
        var domains = aq21.parseDomains(blocks["domains"]);
        var attributes = aq21.parseAttributes(blocks["attributes"],domains);

        var dataColumns = aq21.parseEvents(blocks["events"], attributes);
        var rawRules = aq21.parseRules(blocks, attributes);

        this.experiment = new aq21.Experiment(attributes, dataColumns, rawRules);
    }   

    visualise(){ 
        var xAttrs = this.xAttributes;
        var yAttrs = this.yAttributes;


        var rectangles = discretization.computeRectangles(this.experiment, xAttrs, yAttrs);
        console.log(rectangles);


        
        var g = new gld.GLD(this.experiment.attributes,xAttrs,yAttrs);

        this.canvas.innerHTML = "";
        g.initialize(this.canvas);
        
        g.draw();
        rectangles.forEach( x => {
            x.hypotheses.filter(hypothesis => hypothesis.isSelected).forEach(hypothesis => {
                hypothesis.rectangles.forEach(y => {
                    y.forEach(z => {
                        g.drawRectangle(z.x,z.y,z.width,z.height, hypothesis.color, z.ruleString);
                    })
                })
            });
        });

    }

}
