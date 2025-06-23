// interface IDFObject {
//   name: string;
//   [key: string]: number | string;
// }
type IDFObject = Record<string, number | string>;

class IDFClass {
  name: string;
  idfObjects: IDFObject[];

  constructor(className: string) {
    this.name = className;
    this.idfObjects = [];
  }
}

export class IDF {
  // Hyperparameters
  CHECKVALID: boolean = false;
  // contains IDFClasses
  objects: Record<string, IDFClass>;

  constructor() {
    this.objects = {};
  }

  addObject(className: string, fields: string) {
    if (!(className in this.objects)) {
      this.objects[className] = new IDFClass(className);
    }
    this.objects[className].idfObjects.push( {fields: 0} );
    console.log(this.objects[className]);
    console.log(className in this.objects);
  }

  toString(indentSize: number, fieldSize: number) {
    // for (let obj of self.objects) { }
    // return "";
  }
}


function readIDF(idfString: string, idd: string) { }

function writeIDF(epts: any) { }


let test = new IDF();

console.log("started");

test.addObject("test", "f1");
test.addObject("test", "f1");
test.addObject("test", "f2");

console.log(test.CHECKVALID)
