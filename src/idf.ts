/*
TODO account for extendable inputs
*/
import { IDDManager, IDD, classProps, fieldProps } from './idd';
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
  fields: IDFFields;

  constructor(className: string, fields: IDFFields) {
    this.className = className.toLowerCase();
    this.fields = utils.renameFieldNamesToKeys(fields);
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
  readonly classIDD: classProps; // class dataDictionary
  readonly name: string; // class name
  idfObjects: IDFObject[];
  readonly fieldKeys: string[]; // excluding extensible fields
  readonly hasNameField: boolean; // whether this class have a 'Name' field
  readonly hasExtensible: boolean; // whether this class have extensible fields

  constructor(classIDD: classProps) {
    this.classIDD = classIDD;
    this.name = classIDD.className;
    this.idfObjects = [];
    this.fieldKeys = Object.keys(classIDD.fields);
    // exclude extensible fields
    if (classIDD.extensibleFieldStart ?? -1 > 0) {
      this.fieldKeys = this.fieldKeys.slice(0, classIDD.extensibleFieldStart);
    }
    // whether the class have a 'Name' field
    this.hasNameField = Object.keys(this.fieldKeys)[0] == 'Name';
    this.hasExtensible = (classIDD.extensibleFieldStart ?? -1) >= 0;
  }

  getFieldIdxFromKey(fieldKey: string) {
    const fieldIdx = this.fieldKeys.indexOf(fieldKey);
    if (fieldIdx >= 0) {
      return fieldIdx;
    }
    else if (this.hasExtensible) {
      let extensibleIdx = -1; // index among extensible fields
      let extensibleGroupIdx = -1; // index of the extensible group
      for (let regexpIdx = 0; regexpIdx < (this.classIDD.extensibleFieldKeyExp ?? []).length; regexpIdx++) {
        const regexp = new RegExp((this.classIDD.extensibleFieldKeyExp ?? [])[regexpIdx]);
        const regexpMatch = fieldKey.match(regexp);
        if (regexpMatch) {
          extensibleIdx = regexpIdx;
          extensibleGroupIdx = parseInt(regexpMatch[1]) - 1;
          break;
        }
      }
      if (extensibleIdx <= 0) {
        console.error(`'${this.name}' has no '${fieldKey}' field!`);
        return null;
      }
      return (this.classIDD.extensibleFieldStart ?? 0)
        + (this.classIDD.extensibleFieldSize ?? 0) * extensibleGroupIdx
        + extensibleIdx;
    }
    else {
      console.error(`'${this.name}' has no '${fieldKey}' field!`);
      return null;
    }
  }

  getFieldNameFromIdx(fieldIdx: number) {
  }

  getFieldPropFromIdx(fieldIdx: number) {
    if (fieldIdx < this.fieldKeys.length) {
      return Object.values(this.classIDD.fields)[fieldIdx];
    }
    //TODO
    else if (this.hasExtensible) {}
    
    // const fieldProp: fieldProps = {
    //   name: fieldName,
    //   type: fieldType,
    //   units: fieldUnits
    // }
  }

  getFieldNameFromKey(fieldKey: string) {
  }


  getObjectsFields(re?: RegExp | undefined) {
    //TODO add try-catch
    if (this.hasNameField && re !== undefined) {
      return this.idfObjects
        // test Name on the given RegExp
        // if there is no Name in fields, use ''
        .filter((item) => re.test(String(item.fields.Name ?? '')))
        // return the fields and not the IDFObject
        .map((item) => item.fields);
    }
    else {
      return this.idfObjects.map((item) => item.fields);
    }
  }
}

export class IDF {
  //* Hyperparameters
  // whether to check validity when modifying the IDF object
  CHECKVALID: boolean = false;
  // contains IDFClasses
  private readonly IDD: IDD;
  private idfClasses: Record<string, IDFClass>;

  constructor(idd: IDD) {
    this.IDD = idd;
    this.idfClasses = {};
  }

  //? —— Define IDF from String ——————

  static async fromString(idfString: string, globalIDDManager?: IDDManager) {
    //TODO add type casting for inputs
    if (idfString.length <= 0) throw RangeError('Not a valid IDF string!');

    //? parse string and split into objects

    // remove comments
    idfString = idfString.replace(/!.*\s*/g, '');
    // remove whitespaces
    idfString = idfString.replace(/,\s*/g, ',').replace(/;\s*/g, ';').trim();

    //? get version info
    const versionMatch = idfString.match(/version,(\S+?);/i);
    if (versionMatch == null) throw RangeError('No version info!');
    // const version = '23.2';
    const version = versionMatch[1];

    //? load IDD
    let idd: IDD;
    if (globalIDDManager == null) {
      idd = await new IDDManager().getVersion(version);
    }
    else {
      idd = await globalIDDManager.getVersion(version);
    }
    const idf = new IDF(idd);

    //? add objects

    // split into objects
    const objectList = idfString.split(';');

    /*
    !!!!TEMP!!!!!!!!
    for (let i = 0; i < objectList.length; i++) {
      const obj = objectList[i];
      if (obj.length <= 0) continue;

      const fieldList = obj.split(',');
      const className = fieldList.shift() ?? ''; // get and remove first element.
      const keys = Object.values(idf.IDD[className.toLowerCase()].fieldNames);
      const entries = fieldList.map((value, index) => [keys[index], value]);
      const fields = Object.fromEntries(entries) as IDFFields;
      idf.addObject(className, fields)
    }
      */

    return idf;
  }

  //? —— Manage IDF ——————
  /**
   * Returns an IDFClass object with the corresponding className.
   * @param className IDF class name (case insensitive).
   * @returns IDFClass.
   */
  //!!!private
  getIDFClass(className: string): IDFClass {
    // if (this.dictionary == null) {
    //   throw ReferenceError('IDD is not yet defined!');
    // }
    const classNameLower: string = className.toLowerCase();
    if (!(classNameLower in this.idfClasses)) {
      // 만약 해당 class가 한 번도 한 생겼다면
      const classIDD = this.IDD[classNameLower];
      this.idfClasses[classNameLower] = new IDFClass(classIDD);
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
      throw new RangeError(`"${className}" not in this idf!`);
    }
    return this.getIDFClass(className).getObjectsFields(re);
  }

  //? —— Export as String ——————

  toString(classIndentSize: number = 2, fieldIndentSize: number = 4, fieldSize: number = 22): string {
    const classIndent = ' '.repeat(Math.floor(classIndentSize));
    const fieldIndent = ' '.repeat(Math.floor(fieldIndentSize));

    let outputString = '';

    //TODO 순서가 idd와 다를 경우??
    /*
    !!!!TEMP!!!!!!!!
    for (const [classNameLower, idfClass] of Object.entries(this.idfClasses)) {
      for (const idfObject of idfClass.idfObjects) {
        const lastFieldIndex = utils.findLastFieldIndex(idfObject.fields);
        if (lastFieldIndex < 0) continue; // skip object if all fields are null

        //? add className
        outputString += `\n${classIndent}${idfClass.name}\n`;

        // field name capitalization
        const fieldNames = idfClass.fieldNames;
        //? add fields
        Object.entries(idfObject.fields).forEach(([fieldKey, fieldVal], fieldIndex) => {
          if (fieldIndex > lastFieldIndex) return; // skip trailing null fields (considered as empty)

          // update fieldKey (if there is no matching fieldName, add '?' to the end of the fieldKey)
          const fieldName = fieldNames[fieldKey] ?? `${fieldKey}?`;
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
    */

    return outputString;
  }
}

/*
const idfString = `! U.S. Department of Energy Commercial Reference Building Models of the National Building Stock.
! Washington, DC: U.S. Department of Energy, Energy Efficiency and
! Renewable Energy, Office of Building Technologies.
! ***GENERAL SIMULATION PARAMETERS***
! Number of Zones: 18

Version,
  23.2;                    !- Test

SimulationControl,
  YES,                     !- Do Zone Sizing Calculation
  YES,                     !- Do System Sizing Calculation
  ,                        !- Do Plant Sizing Calculation
  YES,                     !- Run Simulation for Sizing Periods
  NO,                      !- Run Simulation for Weather File Run Periods
  No,                      !- Do HVAC Sizing Simulation for Sizing Periods
  1;                       !- Maximum Number of HVAC Sizing Simulation Passes

Building,
  Ref Bldg Medium Office New2004_v1.3_5.0,  !- Name
  0.0000,                  !- North Axis {deg}
  City,                    !- Terrain
  0.0400,                  !- Loads Convergence Tolerance Value {W}
  0.2000,                  !- Temperature Convergence Tolerance Value {deltaC}
  FullInteriorAndExterior, !- Solar Distribution
  25,                      !- Maximum Number of Warmup Days
  6;                       !- Minimum Number of Warmup Days
`;

async function main() {
  console.time('readIDF');
  const idf = await IDF.fromString(idfString);
  console.timeEnd('readIDF');
  // console.log(idf.toString());
}
main();
*/

/*
async function main() {

  const idd = await new IDDManager().getVersion('23.2');
  let idf = new IDF(idd);

  idf.addObject('Timestep', { 'test_a': null, 'test_b': 1, 'Number of Timesteps per Hour': null });
  idf.addObject('Timestep', { 'test_a': null, 'test_b': 2, 'Number of Timesteps per Hour': false });
  idf.addObject('PythonPlugin:TrendVariable', { 'Name': 'asdf', 'Name of a Python Plugin Variable': 'a' });
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
}
main();
*/


async function main() {

  const idd = await new IDDManager().getVersion('23.2');
  let idf = new IDF(idd);
  console.log(idf.getIDFClass('buildingsurface:detailed'))
  // console.log(idf.getIDFClass('buildingsurface:detailed').getFieldIdxFromKey('Vertex_3_Ycoordinate'))
  console.log(idf.getIDFClass('buildingsurface:detailed').getFieldPropFromIdx(0))
}
main();
