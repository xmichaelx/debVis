import * as debvis from '../dist/cjs/debvis';
import {expect} from 'chai';
declare var require;
declare var global;
global.XMLHttpRequest = require('xhr2');

describe("Basic", () => {
    it("Basic stuff", () => {
        expect(true).is.eql(true);                 
    });
});
