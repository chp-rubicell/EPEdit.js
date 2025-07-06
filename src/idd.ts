/** Generate IDD from schema.epJSON */
//TODO (maybe) add autosizable and autocalculatable tags

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
  fields: Record<string, fieldProps>; // fieldKey: fieldProps (excluding extensibles)
  extensible?: {
    startIdx: number; // start index of the extensible fields
    size: number; // size of the extensible fields
    keyRegExps: string[]; // RegExp pattern for extensible field search
    fieldNames: extensibleFieldName[];
  };
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
    classProp.extensible = {
      startIdx: -1, // update during the field parsing
      size: parseInt(extensibleMatch[1]),
      keyRegExps: [],
      fieldNames: [],
    }
  }

  //? get field info
  const fieldMatches = classString.slice(classInfoString.length).matchAll(/ *[^\s,]+ *[,;](?: *\\.*(?:\r\n|\r|\n))*/g);

  let fieldIdx = 0;
  for (const fieldMatch of fieldMatches) {
    // skip field if first extensible field set is complete
    if (
      classProp.extensible
      && classProp.extensible.startIdx >= 0
      && fieldIdx >= (classProp.extensible.startIdx
        + classProp.extensible.size)
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
    if (classProp.extensible && fieldString.match(/\\begin-extensible/) != null) {
      classProp.extensible.startIdx = fieldIdx;
    }
    // if extensible field
    if (classProp.extensible && classProp.extensible.startIdx >= 0) {
      let prefix: string;
      let suffix: string;
      const fieldNameMatch = fieldName.match(/(?<prefix>[^\d]+)\d+(?<suffix>[^\d]*)$/i);
      if (fieldNameMatch && fieldNameMatch.groups) {
        ({ prefix, suffix } = fieldNameMatch.groups);
      }
      else {
        // if there is no number in the field name
        // throw new RangeError(`No extensible pattern matched for ${className} - '${fieldName}'!`);

        if (verbose) {
          console.log(`> No extensible pattern matched for ${className} - '${fieldName}'!`)
        }
        prefix = fieldName + ' ';
        suffix = '';
        classProp.extensible.fieldNames?.push([fieldName + ' ', ''])
      }
      classProp.extensible.fieldNames?.push([prefix, suffix]);
      classProp.extensible.keyRegExps?.push(`${fieldNameToKey(prefix)}(\\d+)${fieldNameToKey(suffix)}`);
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

// interface for loading IDD using import
interface IDDModule {
  iddVersion: string;
  iddString: string;
}

export class IDDManager {
  private iddCache: Record<string, IDD>; // consider using Map?
  iddDir: string;

  constructor(iddDir: string = './idds') {
    this.iddCache = {};
    if (iddDir.endsWith('/')) iddDir = iddDir.slice(0, -1);
    this.iddDir = iddDir;
  }

  /**
   * Load an IDD for the given version.
   * @param version Version code (e.g., '24-2')
   * @returns IDD string (e.g., from 'v24-2.ts')
   */
  async getVersion(version: string, ts: boolean = false) {
    const versionMatch = version.match(/\d+[\-.]\d+/);
    if (versionMatch == null) {
      throw new RangeError(`'${version}' is not a valid version format!`);
    }
    version = versionMatch[0].replace(/[.]/g, '-'); // '24-2' format
    // check if version is already in the cache
    if (!(version in this.iddCache)) {
      await this.loadPreprocessedIDD(`${this.iddDir}/v${version}-idd${ts ? '' : '.js'}`);
    }
    return this.iddCache[version];
  }

  /**
   * 
   * @param iddPath e.g., `${this.iddDir}/v${version}-idd`
   */
  async loadPreprocessedIDD(iddPath: string) {
    const { iddVersion, iddString } = await import(iddPath) as IDDModule;
    const idd: IDD = JSON.parse(iddString) as IDD;
    this.iddCache[iddVersion] = idd;
  }

  /**
   * Read self-supplied .idd file.
   * @param iddString A string read from an .idd file.
   */
  static fromIDD(iddString: string) { }
}