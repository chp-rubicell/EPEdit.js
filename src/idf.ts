/*
TODO apply fieldDictionary when creating IDFClasses
*/
import { dataDictionary } from './epjson-schema';
import * as utils from './utilities';

// interface IDFObject {
//   name: string;
//   [key: string]: number | string;
// }
type IDFFieldValue = string | number | boolean | null;
type IDFFields = Record<string, IDFFieldValue>;


//? —— IDFObject ——————

class IDFObject {
  className: string;
  private fields: IDFFields;
  name: string | null;

  constructor(className: string, fields: IDFFields) {
    this.className = className.toLowerCase();
    this.fields = utils.renameFieldNamesToKeys(fields);
    console.log(this.fields)
    this.name = 'test'; //TODO
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
    return this.fields[utils.fieldNameToKey(fieldName)];
  }
  /**
   * Change the value of a field in an IDFObject.
   * @param fieldName Name of the field to edit (case insensitive).
   * @param value Value to set the field.
   */
  set(fieldName: string, value: IDFFieldValue) {
    //TODO check validity
    this.fields[utils.fieldNameToKey(fieldName)] = value;
  }
}

//? —— IDF Class ——————

class IDFClass {
  readonly name: string; // class name
  idfObjects: IDFObject[];
  readonly fieldNames: Record<string, string>; // for mapping capitalization
  readonly hasNameField: boolean; // whether this class have a 'Name' field

  constructor(className: string) {
    const classDataDictionary = dataDictionary[className.toLowerCase()];
    this.name = classDataDictionary.className;
    this.idfObjects = [];
    this.fieldNames = classDataDictionary.fieldNames;
    this.hasNameField = true; // TODO
  }

  getObjectsFields(re?: RegExp | undefined) {
    //TODO add try-catch
    if (this.hasNameField && re !== undefined) {
      return this.idfObjects
        .filter((item) => re.test(item.name??''))
        .map((item) => item.getFields());
    }
    else {
      return this.idfObjects.map((item) => item.getFields());
    }
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

  getObjects(className: string, re?: RegExp | undefined) {
    /*
    TODO add optional filter variable
    */
    const classNameLower: string = className.toLowerCase();
    if (!(classNameLower in this.idfClasses)) {
      throw new RangeError(`"${className}" not this idf!`);
    }
    return this.getIDFClass(className).getObjectsFields(re);
  }

  //? —— Export as String ——————

  toString(classIndentSize: number = 2, fieldIndentSize: number = 4, fieldSize: number = 22): string {
    const classIndent = ' '.repeat(Math.floor(classIndentSize));
    const fieldIndent = ' '.repeat(Math.floor(fieldIndentSize));

    let outputString = '';

    //TODO 순서가 idd와 다를 경우??

    for (const [classNameLower, idfClass] of Object.entries(this.idfClasses)) {
      for (const idfObject of idfClass.idfObjects) {
        const lastFieldIndex = utils.findLastFieldIndex(idfObject.getFields());
        if (lastFieldIndex < 0) continue; // skip object if all fields are null

        //? add className
        outputString += `\n${classIndent}${idfClass.name}\n`;
        
        // field name capitalization
        const fieldNames = idfClass.fieldNames;
        //? add fields
        Object.entries(idfObject.getFields()).forEach(([fieldKey, fieldVal], fieldIndex) => {
          if (fieldIndex > lastFieldIndex) return; // skip trailing null fields (considered as empty)

          // update fieldKey
          const fieldName = fieldNames[fieldKey] ?? fieldKey;
          // update fieldVal for null|undefinded
          fieldVal = fieldVal ?? '';

          // compute paddings
          const fieldPaddingLength = fieldSize - String(fieldVal).length;
          const fieldPadding = ' '.repeat(fieldPaddingLength >= 0 ? fieldPaddingLength : 0);

          const closingSymbol = fieldIndex == lastFieldIndex ? ';' : ',';

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

idf.addObject('Timestep', { 'test_a': null, 'test_b': 1, 'Number of Timesteps per Hour': null });
idf.addObject('Timestep', { 'test_a': null, 'test_b': 2, 'Number of Timesteps per Hour': false });
idf.addObject('Timestep', { 'test_a': null, 'Number of Timesteps per Hour': null });

console.log(idf.toString());

console.log('without filter');
for (const obj of idf.getObjects('Timestep')) {
  // if (!obj.test_a) obj.test_a = obj.test_b;
  // obj.test_b = 3;
  console.log(obj)
}
console.log('with filter');
for (const obj of idf.getObjects('Timestep', /test\d/)) {
  console.log(obj)
}

// console.log(idf.objects['Timestep']);

console.log(idf.toString());
