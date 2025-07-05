/** Generate IDD from schema.epJSON */
//TODO add support for extendible fields

// import { fieldNameToKey } from '../utilities';
// import * as schema from './idds/v23-2-light.schema.json';
// import { classPropsMini, classFieldsMini } from '../epjson-schema';
import { fieldNameToKey, findLastFieldIndex } from './utilities';


export interface fieldProps {
  name: string;
  type: 'string' | 'int' | 'float';
  units: string | null;
}

type extensibleFieldName = [string, string]; // prefix, suffix -> (prefix)(n)(suffix)

export interface classProps {
  className: string;
  extensibleFieldStart?: number; // start index of the extensible fields
  extensibleFieldSize?: number; // size of the extensible fields
  extensibleFields?: extensibleFieldName[];
  fields: Record<string, fieldProps>; // fieldKey: fieldProps (excluding extensibles)
}

export type IDD = Record<string, classProps>; // classKey: classProps

//? —— RegExp Pattern ——————
/*
#linebreak#
/(?:\r\n|\r|\n)/

#head#
/[^\s,]+,#linebreak#(?: *\\.*#linebreak#)+/
Version,
      \memo Specifies the EnergyPlus version of the IDF file.
      \unique-object
      \format singleLine

#field#
/ *[^\s,]+ *[,;](?: *\\.*#linebreak#)+/
  A1 ; \field Version Identifier
      \default 23.2

#head#(#field#)+
/[^\s,]+,#linebreak#(?: *\\.*#linebreak#)+(?: *[^\s,]+ *[,;](?: *\\.*#linebreak#)+)+/g
 ^head                                ^fields
/[^\s,]+,(?:\r\n|\r|\n)(?: *\\.*(?:\r\n|\r|\n))+(?: *[^\s,]+ *[,;](?: *\\.*(?:\r\n|\r|\n))+)+/g
*/

//? —— Parse ——————

/**
 * Parse a class idd string and creates a classProps object. (for preprocess and realtime)
 * @param classString Class idd string.
 * @returns classProps object.
 */
export function parseIDDClassString(classString: string, verbose: boolean = false): classProps {

  //? get top-level class info
  const classInfoString = (classString.match(/[^\s,]+,(?:\r\n|\r|\n)(?: *\\.*(?:\r\n|\r|\n))+/) ?? [''])[0]; // Version, \~~, \~~
  const className = (classInfoString.match(/([^\s,]+),/) ?? [])[1]; // e.g., Version

  //? create classProps instance for this class
  let classProp: classProps = {
    className: className,
    fields: {}
  };

  //? check extensible
  const extensibleMatch = classInfoString.match(/\\extensible:(\d+)/);
  if (extensibleMatch != null) {
    classProp.extensibleFieldStart = -1; // update during the field parsing
    classProp.extensibleFieldSize = parseInt(extensibleMatch[1]);
    classProp.extensibleFields = [];
  }

  //? get field info
  const fieldMatches = classString.slice(classInfoString.length).matchAll(/ *[^\s,]+ *[,;](?: *\\.*(?:\r\n|\r|\n))*/g);

  let fieldIdx = 0;
  for (const fieldMatch of fieldMatches) {
    // skip field if first extensible field set is complete
    if (
      (classProp.extensibleFieldStart ?? -1) >= 0
      && fieldIdx >= ((classProp.extensibleFieldStart ?? 0) + (classProp.extensibleFieldSize ?? 0))
    ) break;
    const fieldString: string = fieldMatch[0];

    let fieldName = (fieldString.match(/\\field (.+)(?:\r\n|\r|\n)/) ?? [])[1];
    let fieldKey = '';
    if (fieldName == null) {
      console.log(`> No fieldName match for '${className}' - ${fieldIdx}!`);
      const fieldCodeMatch = fieldString.match(/ *([^\s,]+) *[,;]/);
      let fieldCode = String(fieldIdx);
      if (fieldCodeMatch) {
        fieldCode = fieldCodeMatch[1];
      }
      fieldName = fieldCode;
      fieldKey = fieldCode;
      console.log(`  using '${fieldCode}' instead.`);
    }
    else {
      fieldKey = fieldNameToKey(fieldName);
    }

    //? field type
    const fieldTypeRaw = (fieldString.match(/\\type ([^\s,]+)(?:\r\n|\r|\n)/) ?? [])[1];
    //* integer, real, alpha, choice, object-list, external-list, node
    let fieldType: 'string' | 'int' | 'float';
    switch (fieldTypeRaw) {
      case 'integer':
        fieldType = 'int';
        break;
      case 'real':
        fieldType = 'float';
        break;
      default:
        fieldType = 'string';
        break;
    }

    //? field units
    const fieldUnits = (fieldString.match(/\\units (.+)(?:\r\n|\r|\n)/) ?? [])[1] ?? null;

    //? extensible
    // start of extensible
    if (fieldString.match(/\\begin-extensible/) != null) {
      classProp.extensibleFieldStart = fieldIdx;
    }
    // if extensible field
    if ((classProp.extensibleFieldStart ?? -1) >= 0) {
      const fieldNameMatch = fieldName.match(/(?<prefix>[^\d]+)\d+(?<suffix>[^\d]*)$/i);
      if (fieldNameMatch && fieldNameMatch.groups) {
        const { prefix, suffix } = fieldNameMatch.groups;
        classProp.extensibleFields?.push([prefix, suffix])
      }
      else {
        // if there is no number in the field name
        // throw RangeError(`No extensible pattern matched for ${className} - '${fieldName}'!`)
        if (verbose) {
          console.log(`> No extensible pattern matched for ${className} - '${fieldName}'!`)
        }
        classProp.extensibleFields?.push([fieldName + ' ', ''])
      }
    }

    const fieldProp: fieldProps = {
      name: fieldName,
      type: fieldType,
      units: fieldUnits
    }

    classProp.fields[fieldKey] = fieldProp;
    fieldIdx++;
  }

  return classProp;
}

//? —— Load and Manage IDDs ——————

/**
 * Load an IDD string from a typescript file corresponding to the given version.
 * @param code Version code (e.g., '24-2')
 * @returns IDD string (e.g., from 'v24-2.ts')
 */
export async function loadString(code: string): Promise<string> {
  const { iddString } = await import(`./idds/v${code}-idd`);
  return iddString;
}

export class IDDManager {
  private iddCache: Record<string, IDD> // consider using Map?

  constructor() {
    this.iddCache = {};
  }

  async getVersion(version: string) {
    const versionMatch = version.match(/\d+[\-.]\d+/);
    if (versionMatch == null) {
      throw new RangeError(`'${version}' is not a valid version format!`);
    }
    version = versionMatch[0].replace(/[.]/g, '-'); // '24-2' format
    // check if version is already in the cache
    if (!(version in this.iddCache)) {

      const loadedString: string = await loadString(version);
      const idd: IDD = JSON.parse(loadedString) as IDD;

      this.iddCache[version] = idd;
    }
    return this.iddCache[version];
  }

  /**
   * Read self-supplied .idd file.
   * @param iddString A string read from an .idd file.
   */
  static fromIDD(iddString: string) { }
}