/** Generate IDD from schema.epJSON */
//TODO add support for extendible fields

// import { fieldNameToKey } from '../utilities';
// import * as schema from './idds/v23-2-light.schema.json';
// import { classPropsMini, classFieldsMini } from '../epjson-schema';
import { fieldNameToKey, findLastFieldIndex } from './utilities';


//TODO move these?
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


/**
 * Parse a class idd string and creates a classProps object. (for preprocess and realtime)
 * @param classString Class idd string.
 * @returns classProps object.
 */
export function parseIDDClassString(classString: string, verbose: boolean = false): classProps {

  //? get top-level class info
  const classInfoString = (classString.match(/\S+,(?:\r\n|\r|\n)(?: *\\.*(?:\r\n|\r|\n))+/) ?? [''])[0]; // Version, \~~, \~~
  const className = (classInfoString.match(/(\S+),/) ?? [])[1]; // e.g., Version

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
  const fieldMatches = classString.matchAll(/ *\S+ *[,;](?: *\\.*(?:\r\n|\r|\n))+/g);

  let fieldIdx = 0;
  for (const fieldMatch of fieldMatches) {
    // skip field if first extensible field set is complete
    if (
      (classProp.extensibleFieldStart ?? -1) >= 0
      && fieldIdx >= ((classProp.extensibleFieldStart ?? 0) + (classProp.extensibleFieldSize ?? 0))
    ) break;
    const fieldString: string = fieldMatch[0];

    const fieldName = (fieldString.match(/\\field (.+)(?:\r\n|\r|\n)/) ?? [])[1];
    const fieldKey = fieldNameToKey(fieldName);

    //? field type
    const fieldTypeRaw = (fieldString.match(/\\type (\S+)(?:\r\n|\r|\n)/) ?? [])[1];
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
    if (fieldString.match(/\\begin-extensible/) != null) {
      classProp.extensibleFieldStart = fieldIdx;
    }
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
