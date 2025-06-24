import { lowercaseKeys } from './utilities';

//! TEMP
const idd: Record<string, string> = {
  "timestep": "Timestep",
  "buildingsurface:detailed": "BuildingSurface:Detailed"
}

// interface IDFObject {
//   name: string;
//   [key: string]: number | string;
// }
type IDFFieldValue = string | number | boolean;
type IDFFields = Record<string, IDFFieldValue>;


//? —— IDFObject ——————

class IDFObject {
  className: string;
  private fields: IDFFields;

  constructor(className: string, fields: IDFFields) {
    this.className = className.toLowerCase();
    this.fields = lowercaseKeys(fields);
  }

  getFields(): IDFFields {
    return this.fields;
  }

  /**
   * Get the value of a field in an IDFObject.
   * @param fieldName Name of the field to edit (case insensitive).
   * @returns Value of the field.
   */
  get(fieldName: string) {
    //TODO add try-catch
    return this.fields[fieldName.toLowerCase()];
  }
  /**
   * Change the value of a field in an IDFObject.
   * @param fieldName Name of the field to edit (case insensitive).
   * @param value Value to set the field.
   */
  set(fieldName: string, value: IDFFieldValue) {
    //TODO check validity
    this.fields[fieldName.toLowerCase()] = value;
  }
}

//? —— IDF Class ——————

class IDFClass {
  name: string;
  idfObjects: IDFObject[];
  fieldNames: Record<string, string>

  constructor(className: string) {
    this.name = className.toLowerCase();
    this.idfObjects = [];
    this.fieldNames = {
      "number of timesteps per hour": "Number of Timesteps per Hour"
    }; // TODO
  }
}

export class IDF {
  //* Hyperparameters
  // whether to check validity when modifying the IDF object
  CHECKVALID: boolean = false;
  // contains IDFClasses
  private idfClasses: Record<string, IDFClass>;

  constructor() {
    this.idfClasses = {};
  }

  //? —— Manage IDF ——————
  /**
   * Returns an IDFClass object with the corresponding className.
   * @param className IDF class name (case insensitive).
   * @returns IDFClass.
   */
  private getIDFClass(className: string): IDFClass {
    const classNameLower: string = className.toLowerCase();
    if (!(classNameLower in this.idfClasses)) {
      // 만약 해당 class가 한 번도 한 생겼다면
      this.idfClasses[classNameLower] = new IDFClass(classNameLower);
    }
    return this.idfClasses[classNameLower];
  }

  //? —— Edit IDF ——————
  /**
   * Adds a new IDF object for the given IDF class based on the given fields.
   * @param className IDF class name (case insensitive).
   * @param fields TODO
   */
  addObject(className: string, fields: IDFFields) {
    this.getIDFClass(className).idfObjects.push(new IDFObject(className, fields));
  }

  //? —— Export as String ——————

  toString(classIndentSize: number = 2, fieldIndentSize: number = 4, fieldSize: number = 22): string {
    const classIndent = " ".repeat(Math.floor(classIndentSize));
    const fieldIndent = " ".repeat(Math.floor(fieldIndentSize));

    let outputString = "";

    for (const [classNameLower, idfClass] of Object.entries(this.idfClasses)) {
      outputString += `${classIndent}${idd[classNameLower]}\n`;
      for (const idfObject of idfClass.idfObjects) {
        Object.entries(idfObject.getFields()).forEach(([fieldName, fieldVal], fieldIndex) => {
          const fieldPaddingLength = fieldSize - String(fieldVal).length;
          const fieldPadding = " ".repeat(fieldPaddingLength >= 0 ? fieldPaddingLength : 0);

          const closingSymbol = (fieldIndex == Object.keys(idfObject.getFields()).length - 1) ? ";" : ",";

          outputString += `${fieldIndent}${fieldVal}${closingSymbol}${fieldPadding}  !- ${fieldName}\n`;
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
