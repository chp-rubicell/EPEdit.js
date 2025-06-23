//! TEMP
const idd: Record<string, string> = {
  "timestep": "Timestep",
  "buildingsurface:detailed": "BuildingSurface:Detailed"
}

// interface IDFObject {
//   name: string;
//   [key: string]: number | string;
// }
type IDFObject = Record<string, string | number | boolean>;

class IDFClass {
  name: string;
  idfObjects: IDFObject[];

  constructor(className: string) {
    this.name = className.toLowerCase();
    this.idfObjects = [];
  }
}

export class IDF {
  //* Hyperparameters
  // whether to check validity when modifying the IDF object
  CHECKVALID: boolean = false;
  // contains IDFClasses
  objects: Record<string, IDFClass>;

  constructor() {
    this.objects = {};
  }

  /**
   * Returns an IDFClass object with the corresponding className
   * @param className IDF class name (case insensitive)
   * @returns IDFClass
   */
  private getIDFClass(className: string): IDFClass {
    const classNameLower: string = className.toLowerCase();
    if (!(classNameLower in this.objects)) {
      // 만약 해당 class가 한 번도 한 생겼다면
      this.objects[classNameLower] = new IDFClass(classNameLower);
    }
    return this.objects[classNameLower];
  }

  addObject(className: string, fields: IDFObject) {
    this.getIDFClass(className).idfObjects.push(fields);
  }

  toString(classIndentSize: number = 2, fieldIndentSize: number = 4, fieldSize: number = 22): string {
    const classIndent = " ".repeat(classIndentSize);
    const fieldIndent = " ".repeat(fieldIndentSize);

    let outputString = "";

    for (const [classNameLower, idfClass] of Object.entries(this.objects)) {
      outputString += `${classIndent}${idd[classNameLower]}\n`;
      for (const idfObject of idfClass.idfObjects) {
        Object.entries(idfObject).forEach(([fieldName, fieldVal], fieldIndex) => {
          const fieldPaddingLength = fieldSize - String(fieldVal).length;
          const fieldPadding = " ".repeat(fieldPaddingLength >= 0 ? fieldPaddingLength : 0);

          const closingSymbol = (fieldIndex == Object.keys(idfObject).length - 1)? ";" : ",";

          outputString += `${fieldIndent}${fieldPadding}${fieldVal}${closingSymbol}  !- ${fieldName}\n`;
        });
      }
    }

    return outputString;
  }
}


function readIDF(idfString: string, idd: string) { }

function writeIDF(epts: any) { }


let idf = new IDF();

idf.addObject("Timestep", { "Number of Timesteps per Hour": 4 });


// console.log(idf.objects["Timestep"]);

console.log(idf.toString())
