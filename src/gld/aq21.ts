export function extractBlocks(contents:string) {
    var blocks  =  {};
    var keywords = [ "domains", "attributes", "events", "Output_Hypotheses" ];
    var result = contents.split(/\r?\n/).map(x => x.trim());
    
    for (var i = 0;i<result.length;i++) {
       if (keywords.some((x) =>  result[i].indexOf(x) == 0)) {
           var name = result[i];
           i++;
           if (result[i] == "{") {
               i++;
               var start = i;
               while (result[i] != "}") {
                   i++;
               }
               var end = i;

               blocks[name] =  result.slice(start, end);
           }
       }
   }

   return blocks;
}

export class Domain {
    constructor(public name:string, public type:string) {

    }
}

export class NominalDomain extends Domain {
    constructor(public name:string, public type:string, public values:string[]) {
        super(name,type);
    }
}

export class NumericDomain extends Domain {
    constructor(public name:string, public type:string, public min:number, public max:number) {
        super(name,type);
    }
}


export class Attribute {
    public n  = 0;
    public discretization  = "sss";
    public splitPoints = [];

    public set splitPointsString(value:string) {
            this.splitPoints = value.split(",").map(parseFloat);
    } 

    public get splitPointsString() {
        return this.splitPoints.join(", ");
    } 



    constructor(public name:string, public domain:Domain) {

    }
}


var operators = [">=", "<=", "<", ">"];

function extractSingle(attribute:Attribute, x:string) : any[] {
    switch (attribute.domain.type) {
        case "nominal":
            var tokens = x.split(/(\<\>|=)/);
            return tokens;
        case "linear":
            var tokens = x.split(/(\<\>|=)/);
            return tokens;
        case "integer":
            for (var i =0;i<operators.length;i++) {
                if (x.indexOf(operators[i]) > -1) {
                    var tokens = x.split(operators[i]);
                    var name = tokens[0];
                    var value = parseInt(tokens[1]);
                    return [name, operators[i], value];
                }
            }

            var tokens = x.split("=");
            if (tokens[1].indexOf("..") > -1) {
                var range = tokens[1].split("..").map(function(y) { return parseInt(y);});
                return [tokens[0], "in", range];
            } else {
                return [tokens[0], "=", parseInt(tokens[1])];
            }
        case "continuous":
            for (var i =0;i<operators.length;i++) {
                if (x.indexOf(operators[i]) > -1) {
                    var tokens = x.split(operators[i]);
                    var name = tokens[0];
                    var value = parseFloat(tokens[1]);
                    return [name, operators[i], value];
                }
            }

            var tokens = x.split("=");
            if (tokens[1].indexOf("..") > -1) {
                var range = tokens[1].split("..").map(function(y) { return parseFloat(y);});
                return [tokens[0], "in", range];
            } else {
                return [tokens[0], "=", parseFloat(tokens[1])];
            }
    }
    console.log(x);
}

export function parseDomains(domains: string[]) : Domain[] {
    return domains.map((domain) => {
        var tokens = domain.split(" ");
        
        switch (tokens[1]) {
            case "nominal":
            case "linear":
                var values:string[] = [];

                if (tokens.some(x => x == "{" )) {
                    values = tokens.slice(4, tokens.length-1).map(x => x.replace(/,+$/, "") );
                } else {
                    var numValues = parseInt(tokens[2]);
                    for (var i =0;i<numValues;i++) {
                        values.push(i.toString());
                    }
                }

                return new NominalDomain(tokens[0], tokens[1],values);
            case "integer":
            case "continuous":
                var min = null;
                var max = null;

                if (tokens.length > 2) {
                    min = parseFloat(tokens[2].replace(/,+$/, ""));
                    max = parseFloat(tokens[3]);
                } 
                
                return new NumericDomain(tokens[0], tokens[1], min, max);
        }

        return <Domain>null;
    });
}

export function parseAttributes(attributes:string[], domains: Domain[]) : Attribute[] {
    var attrs = attributes.filter(x => {
        if (x.indexOf("#") == 0) {
            return false;
        }

        var tokens = x.split(" ");
        return tokens.length > 1; 
    }).map(x => {
        var tokens = x.split(" ");
        var domain = domains.filter(x=> x.name == tokens[1])[0]
        return new Attribute(tokens[0], domain);
    });

   return attrs;
}

export function parseEvents(events:string[], attributes:Attribute[]) {
    var filteredEvents = events.filter(x => (x.indexOf("#") != 0) && (x.trim() !== ""));

    var dataColumns = attributes.map(attribute => {
        var column = null;

        switch(attribute.domain.type) {
            case "nominal": 
                column = { data: new Array(filteredEvents.length), parse : x => x };
                break;
            case "linear":
                column = { data: new Uint8Array(filteredEvents.length), parse : x => (<NominalDomain>attribute.domain).values.indexOf(x)};
                break;
            case "integer":
                column = { data: new Uint32Array(filteredEvents.length), parse : parseInt };
                break;
            case "continuous":
                column = { data: new Float32Array(filteredEvents.length), parse : parseFloat };
                break;
            default:
                column = { data: new Array(filteredEvents.length), parse :  x => x } ;
                break;
        }

        return column;
    });


    for (var i = 0;i<filteredEvents.length;i++) {
        var tokens = filteredEvents[i].split(",");
        for (var j = 0;j<dataColumns.length;j++) {
            dataColumns[j].data[i] = dataColumns[j].parse(tokens[j]);
        }
    }

    return dataColumns;
}


function extractHypothesisFromRun(run:string[], attributes:Attribute[]) {
    var lines = run.filter(x => (x.indexOf("[") == 0) || (x.indexOf("<--") == 0) );
    var delimiterBetweenRules = lines[0].split("=")[0];
    var hypotheses : Array<{consequent:string, lines :string[]}> = [];

    for (var i = 0;i<lines.length;i++) {
        if ( lines[i].indexOf(delimiterBetweenRules) == 0) {
            var consequent = lines[i];
            var hypothesisLinese = [];
            i++;
            while ( (i<lines.length) && (lines[i].indexOf(delimiterBetweenRules) != 0) ) {
                if (lines[i].indexOf("<--")!= 0) {
                    hypothesisLinese[hypothesisLinese.length-1] += " " + lines[i];
                } else {
                    hypothesisLinese.push(lines[i]);
                }
                
                i++;
            }

            i--; // we go one too far

            hypotheses.push({
                consequent : consequent.replace(/(\[|\])/gi,""), // remove square brackets
                lines: hypothesisLinese
            });
        }
    }

    return hypotheses.map(hypothesis => {
        var sum =  hypothesis.lines.map(line => {  
            var conjucted = line.match(/\[[^\[\]]*\]/g).map(clause => {
                var tokens = clause.split(":");
                if (tokens.length > 1) {
                    return tokens[0].trim() + "]";
                } else {
                    return clause;
                }
            }); 
            
            var conjunction = new Conjuction(conjucted.map(x => x.replace(/(\[|\])/gi,"")));  // remove square brackets
            conjunction.extractConjuction(attributes);

            return conjunction;
        });

        var h = new Hypothesis(hypothesis.consequent,sum);
        h.extractConsequent(attributes);
        return h;
    });
}


export class Conjuction {
    public clauses: any[][] = [];
    constructor(public clausesString:string[]) {

    }

    public extractConjuction(attributes:Attribute[]) {
        this.clauses = this.clausesString.map(function(x) {
            for (var i =0;i<attributes.length;i++) {
                var attribute = attributes[i];
                if (x.indexOf(attribute.name) == 0) {
                    return extractSingle(attribute, x);
                }
            }
        });
    }
}

export class Hypothesis {
    public consequent = [];
    public isSelected = false;
    constructor(public consequentString:string, public sum:Conjuction[]) {

    }

    extractConsequent(attributes:Attribute[]) {
        for (var i =0;i<attributes.length;i++) {
            if (this.consequentString.indexOf(attributes[i].name) == 0) {
                this.consequent =  extractSingle(attributes[i], this.consequentString);
                return;
            }
        }
    }
}

export class BinarizedHypothesis extends Hypothesis {
    constructor(public consequentString:string, public sum:Conjuction[], public binarizedSum:any[]) {
        super(consequentString, sum)
    }

   
}

export class Run {
    constructor(public name:string, public hypotheses: Hypothesis[]) {

    }
}

export function parseRules(blocks , attributes:Attribute[]) {
    var runs = Object.keys(blocks).filter(x => x.indexOf("Output_Hypotheses") == 0 );
    return runs.map(run => new Run(run, extractHypothesisFromRun(blocks[run], attributes)));
}


export class Experiment {
    constructor(public attributes:Attribute[], public dataColumns:any[], public runs : Run[] ) {

    }
}