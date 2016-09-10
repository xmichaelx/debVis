import * as aq21 from "./aq21";
import d3 = require("d3");
var D3 = <any>d3;

export function splitPointsFromRules(attribute:aq21.Attribute, rules:aq21.Run[]) {
    var numbersSet = new Set<number>();
    rules.forEach(run => {
        run.hypotheses.forEach( hypothesis => {
            hypothesis.sum.forEach( conjuction => {
                conjuction.clauses.forEach(clause => {
                    if (clause[0] == attribute.name) {
                        if (clause[1] == "in") {
                            clause[2].forEach( x => numbersSet.add(x));
                        } else {
                            numbersSet.add(clause[2]);
                        }
                    }
                });
            });
        })
    })

    var numbers = Array.from(numbersSet);
    numbers.sort();

    return numbers;
}




function convert(attribute:aq21.Attribute, conjuction:aq21.Conjuction) :number[] {
    switch (attribute.domain.type) {
        case "nominal" :
            var match = conjuction.clauses.filter(function(x) { return x[0] == attribute.name  });
            // no rule found
            if (match.length == 0) {
                return (<aq21.NominalDomain>attribute.domain).values.map(function(x) { return 1 });
            } else {
                var single = match[0];
                var equality = single[1] == "=";
                var values = single[2].split(",").map(x=>x.trim());
                return (<aq21.NominalDomain>attribute.domain).values.map(function(x) { 
                    if (( values.indexOf(x) > -1) && ( single[1] == "=")) {
                        return 1
                    } else  if ((values.indexOf(x) == -1) && ( single[1] == "=")) {
                        return 0;
                    }  else  if (( values.indexOf(x) > -1) && ( single[1] == "<>")) {
                        return 0;
                    } else  if (( values.indexOf(x) == -1) && ( single[1] == "<>")) {
                        return 1;
                    } else {
                        throw "something wrong"
                    }
                })
            }
        case "linear" :
            var match = conjuction.clauses.filter(function(x) { return x[0] == attribute.name  });
            // no rule found
            if (match.length == 0) {
                return (<aq21.NominalDomain>attribute.domain).values.map(function(x) { return 1 });
            } else {
                var single = match[0];
                var equality = single[1] == "=";
                var values = single[2].split(",").map(x=>x.trim());
                
                return (<aq21.NominalDomain>attribute.domain).values.map(function(x) { 
                    if (( values.indexOf(x) > -1) && ( single[1] == "=")) {
                        return 1
                    } else  if (( values.indexOf(x) == -1) && ( single[1] == "=")) {
                        return 0;
                    }  else  if (( values.indexOf(x) > -1) && ( single[1] == "<>")) {
                        return 0;
                    } else  if (( values.indexOf(x) == -1) && ( single[1] == "<>")) {
                        return 1;
                    } else {
                        throw "something wrong"
                    }
                })
            }
        case "continuous" :
            var match = conjuction.clauses.filter(function(x) { return x[0] == attribute.name  });
            // no rule found
            if (match.length == 0) {
                return attribute.splitPoints.map(function(x) { return 1 }).concat([1]); // for edge case
            } else {
                var single = match[0];
                var relation = single[1];
                var value = single[2];

                switch (relation) {
                    case "<=":
                        var output = [];
                        for (var i=0;i<attribute.splitPoints.length;i++) {
                            if (attribute.splitPoints[i] <= value) {
                                output.push(1);
                            } else {
                                output.push(0);
                            }
                        }

                        if ((<aq21.NumericDomain>attribute.domain).max <= value) {
                            output.push(1);
                        } else {
                            output.push(0);
                        }

                        return output;
                    case ">=": 
                        var output = [];
                        for (var i=attribute.splitPoints.length-1;i>=0;i--) {
                            if (attribute.splitPoints[i] >= value) {
                                output = [1].concat(output);
                            } else {
                                output = [0].concat(output);
                            }
                        }

                        if ((<aq21.NumericDomain>attribute.domain).min >= value) {
                            output = [1].concat(output);
                        } else {
                            output = [0].concat(output);
                        }

                        return output;
                    case "in":
                        var output = [];

                        if (((<aq21.NumericDomain>attribute.domain).min >= value[0]) && (attribute.splitPoints[0] <= value[1])) {
                            output.push(1);
                        } else {
                            output.push(0);
                        }

                        for (var i=1;i<attribute.splitPoints.length;i++) {
                            if ((attribute.splitPoints[i-1] >= value[0]) && (attribute.splitPoints[i] <= value[1])) {
                                output.push(1);
                            } else {
                                output.push(0);
                            }
                        }

                        if ((attribute.splitPoints[attribute.splitPoints.length-1] >= value[0]) && ((<aq21.NumericDomain>attribute.domain).max <= value[1])) {
                            output.push(1);
                        } else {
                            output.push(0);
                        }

                        return output;
                }
                
            }
        case "integer" :
            var match = conjuction.clauses.filter(function(x) { return x[0] == attribute.name  });
            // no rule found
            if (match.length == 0) {
                return attribute.splitPoints.map(function(x) { return 1 }).concat([1]); // for edge case
            } else {
                var single = match[0];
                var relation = single[1];
                var value = single[2];

                switch (relation) {
                    case "<=":
                        var output = [];
                        for (var i=0;i<attribute.splitPoints.length;i++) {
                            if (attribute.splitPoints[i] <= value) {
                                output.push(1);
                            } else {
                                output.push(0);
                            }
                        }

                        if ((<aq21.NumericDomain>attribute.domain).max <= value) {
                            output.push(1);
                        } else {
                            output.push(0);
                        }

                        return output;
                    case ">=": 
                        var output = [];
                        for (var i=attribute.splitPoints.length-1;i>=0;i--) {
                            if (attribute.splitPoints[i] >= value) {
                                output = [1].concat(output);
                            } else {
                                output = [0].concat(output);
                            }
                        }

                        if ((<aq21.NumericDomain>attribute.domain).min >= value) {
                            output = [1].concat(output);
                        } else {
                            output = [0].concat(output);
                        }

                        return output;
                    case "in":
                        var output = [];

                        if (((<aq21.NumericDomain>attribute.domain).min >= value[0]) && (attribute.splitPoints[0] <= value[1])) {
                            output.push(1);
                        } else {
                            output.push(0);
                        }

                        for (var i=1;i<attribute.splitPoints.length;i++) {
                            if ((attribute.splitPoints[i-1] >= value[0]) && (attribute.splitPoints[i] <= value[1])) {
                                output.push(1);
                            } else {
                                output.push(0);
                            }
                        }

                        if ((attribute.splitPoints[attribute.splitPoints.length-1] >= value[0]) && ((<aq21.NumericDomain>attribute.domain).max <= value[1])) {
                            output.push(1);
                        } else {
                            output.push(0);
                        }

                        return output;
                }
                
            }
    }
}


export function binarizeExperiment(experiment:aq21.Experiment) {
    var binarizedRuns = experiment.runs.map((run) => {
        var binarizedHypotheses = run.hypotheses.map(hypothesis => {
            var bh = new aq21.BinarizedHypothesis("",hypothesis.sum, hypothesis.sum.map((clauses) => experiment.attributes.map(attribute => convert(attribute, clauses))));
            bh.isSelected = hypothesis.isSelected;
            bh.consequent = hypothesis.consequent;
            return bh;
        });


        return {
            name : run.name,
            binarizedHypotheses : binarizedHypotheses
        };
    });

    return binarizedRuns;
}


function rectangles(attribute_names, clauses, conjuction:aq21.Conjuction, x_attributes, y_attributes) {
    var ruleString = conjuction.clauses.map(x => `(${x.join(" ")})`).join(" and ");
    var x_axis = x_attributes.map(function(name) {
        var index = attribute_names.indexOf(name);
        return clauses[index];
    });

    var y_axis = y_attributes.map(function(name) {
        var index = attribute_names.indexOf(name);
        return clauses[index];
    });

    var x = x_axis.reduce(tensorProduct, [1]);
    var y = y_axis.reduce(tensorProduct, [1]);
    var x_seq = findSequences(x);
    var y_seq = findSequences(y);

    return createRectangles(x_seq, y_seq,ruleString);
}

function findSequences(array) {
    var s = [];
    var counting = false;
    var start = -1;
    var width = 0;
    for (var i =0;i<array.length;i++) {
        if (array[i] && counting) {
            width++;
        } else if (array[i] && !counting) {
            start = i;
            width = 1;
            counting = true;
        } else if (!array[i] && counting) {
            s.push([start, width]);
            counting = false;
        }
    }

    if (counting) {
        s.push([start, width]);
    }

    return s;
}

function createRectangles(x,y,ruleString:string) {
    var rects : Array<{x:number,y:number, width:number, height:number, ruleString:string}> = [];
    for (var i = 0;i<x.length;i++) {
        for (var j = 0;j<y.length;j++) {
            rects.push( {
                x: x[i][0],
                width: x[i][1],
                y : y[j][0],
                height: y[j][1],
                ruleString:ruleString
            });
        }
    }

    return rects;
}


function tensorProduct(x,y) {
    var out = new Array(x.length*y.length);
    for (var i = 0;i<x.length;i++) {
        for (var j = 0;j<y.length;j++) {
            out[i*y.length+j] = x[i] * y[j];
        }
    }

    return out;
}


export function computeRectangles(experiment:aq21.Experiment,  x_attrs:string[], y_attrs:string[]) {
    var binarizedRuns = binarizeExperiment(experiment);

    var attribute_names = experiment.attributes.map(function(attribute) { return attribute.name; });
    var run_rects = binarizedRuns.map(function(run) {
        return {
            name: run.name,
            hypotheses: run.binarizedHypotheses.map((hypothesis) => {
                var name = hypothesis.consequent[0];
                var value = hypothesis.consequent[2];
                var attr = experiment.attributes.filter(x => x.name == name)[0];
                var values = (<aq21.NominalDomain>attr.domain).values;
                var colors:string[] = D3.schemeCategory20;
                var color = colors[values.indexOf(value)];

                var pairs = [];
                for (var i = 0;i<hypothesis.binarizedSum.length;i++) {
                    pairs.push({binarized: hypothesis.binarizedSum[i], original: hypothesis.sum[i]})
                }

                return {
                    color : color,
                    consequent: hypothesis.consequent,
                    isSelected : hypothesis.isSelected,
                    sum: hypothesis.sum,
                    rectangles: pairs.map((pair) => {
                        // clauses discretized_attributes
                        return rectangles(attribute_names, pair.binarized, pair.original, x_attrs, y_attrs);
                    })
                };
            })
        };
    })

    return run_rects;

}
