export class ColumnInfo {
    public splitPoints: number[] = [];

    constructor(public name:string) {

    }


    public computeSplitPointsEvenDistances(column: Float32Array, n:number) {
        var min = Number.MAX_VALUE;
        var max = Number.MIN_VALUE;

        for (var i = 0;i<column.length;i++) {
            if (column[i] < min) {
                min = column[i];
            }

            if (column[i] > max) {
                max = column[i];
            }
        }

        var range = max - min;
        var stepSize = range / n;

        
        for (var i = 0;i<n -1;i++) {
            this.splitPoints.push(min + (i+1)*stepSize);
        }
    }

    public computeSplitPointsEvenBins(column: Float32Array,n:number) {
       var array = new Float32Array(column.buffer.slice(0));
       array.sort();
       var stepSize = Math.floor(array.length / n);

       for (var i = 0;i<n -1;i++) {
            this.splitPoints.push((array[(i+1)*stepSize] + array[(i+1)*stepSize +1])/2);
        }
    }


    computeIndices(column: Float32Array) {
        var indices = new Uint8Array(column.length);

        for (var i = 0;i<indices.length;i++) {
            var found = false;
            for (var j =0;j< this.splitPoints.length;j++) {
                if (column[i] < this.splitPoints[j]) {
                    indices[i] = j;
                    found = true;
                    break;
                }
            }

            if (!found) {
                indices[i] = this.splitPoints.length;
            }

        }

        return indices;
    }
}


export class CSV {
    colors = [
        [31,119,180],[255,127,14],
        [44,160,44],[214,39,40],
        [148,103,189],[197,176,213],[140,86,75],[196,156,148],
        [227,119,194],[247,182,210],[127,127,127],[199,199,199],
        [188,189,34],[219,219,141],[23,190,207],[158,218,229]
    ];

    public indices : Uint8Array[] = [];
    public labels : Float32Array = null;

    // last one is assumed to be label
    constructor(contents:string, split:RegExp, public columnInfos:ColumnInfo[]) {
        var lines = contents.split(/\r?\n/);

        var columns = columnInfos.map(x => new Float32Array(lines.length));

        for (var i = 0;i<lines.length;i++) {
           var tokens = lines[i].trim().split(split);
           for (var j = 0;j<columns.length;j++) {
               columns[j][i] = parseFloat(tokens[j]);
           }
        }

        for (var i = 0;i<columnInfos.length - 1 ;i++) {
            columnInfos[i].computeSplitPointsEvenDistances(columns[i], 6);
        }

        this.labels = columns[columns.length - 1];

        this.indices =  columns.map((column,i) => 
            columnInfos[i].computeIndices(column)
        );
    }

    render(canvas:HTMLCanvasElement,xAttrs:string[], yAttrs:string[]) {
        var xAxis = xAttrs.map((x) => {
            var item = this.columnInfos.map((x,i)=> { return {x:x,i:i};}).filter(y=>y.x.name == x)[0];
            return { indices : this.indices[item.i], dimension : item.x.splitPoints.length + 1};
        });

        var yAxis = yAttrs.map((x) => {
            var item = this.columnInfos.map((x,i)=> { return {x:x,i:i};}).filter(y=>y.x.name == x)[0];
            return { indices : this.indices[item.i], dimension : item.x.splitPoints.length + 1};
        });

        var width = xAxis.reduce((x,y) => x * y.dimension , 1);
        var height = yAxis.reduce((x,y) => x * y.dimension , 1);


        var coordsX = this.computeCoords(xAxis);
        var coordsY = this.computeCoords(yAxis);
        var labels = this.labels;

        canvas.width = width;
        canvas.height = height;

        var context = canvas.getContext("2d");
        var imageData = context.getImageData(0,0,width, height);
        var data = imageData.data;

        for (var i =0;i<coordsX.length;i++) {
            var x = coordsX[i];
            var y = coordsY[i];

            // silent, tonic, bursting, irregular
            var color = this.colors[labels[i]];


            if (color == undefined) {

            }

            var ind = x + width*y;

            try {
                data[4*ind] = color[0];
                data[4*ind+1] = color[1];
                data[4*ind+2] = color[2];
                data[4*ind+3] = 255;
            } catch (e) {

            }
            
        }

        context.putImageData(imageData,0,0);


    }

    computeCoords(axis : {indices:Uint8Array, dimension:number}[]) {
        var offsets = new Uint32Array(axis[0].indices.length);

        for (var i =0;i<axis[0].indices.length;i++) {
            var value = 0;
            for (var j =0;j<axis.length-1;j++) {
                value =  (value + axis[j].indices[i]) * axis[j].dimension;
            }

            offsets[i] = value + axis[axis.length-1].indices[i];
        }

        return offsets;
    }
}