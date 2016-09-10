import * as csv from "../gld/csv";


export class Dashboard {
    public fileLoader : HTMLInputElement;
    public canvas : HTMLCanvasElement;
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

    displayContents(contents:string) {
        var columnInfos = [
            new csv.ColumnInfo("Na"),
            new csv.ColumnInfo("CaT"),
            new csv.ColumnInfo("CaS"),
            new csv.ColumnInfo("A"),
            new csv.ColumnInfo("KCa"),
            new csv.ColumnInfo("Kd"),
            new csv.ColumnInfo("H"),
            new csv.ColumnInfo("leak"),
            new csv.ColumnInfo("type")
        ];
        var c = new csv.CSV(contents,/ /,columnInfos);
        c.render(this.canvas, ["Kd","CaS","Na","H"],["KCa","CaT","A","leak"]);  
    }   

}
