"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IDF = void 0;
class IDFObject {
    constructor(name) {
    }
}
class IDFClass {
    constructor(className) {
        this.name = className;
        this.idfObjects = [];
    }
}
class IDF {
    constructor() {
        this.idfClass = {};
    }
    addObject(className, fields) {
        console.log(this.idfClass["className"]);
    }
    toString(indentSize, fieldSize) {
        // for (let obj of self.objects) { }
        // return "";
    }
}
exports.IDF = IDF;
function readIDF(idfString, idd) { }
function writeIDF(epts) { }
