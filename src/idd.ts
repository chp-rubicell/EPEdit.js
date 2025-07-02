/** Generate IDD from schema.epJSON */
//TODO add support for extendible fields

// import { fieldNameToKey } from '../utilities';
// import * as schema from './idds/v23-2-light.schema.json';
// import { classPropsMini, classFieldsMini } from '../epjson-schema';
import { fieldNameToKey } from './utilities';
// import { exportDataToJson } from '../dev-utils';
import { iddString } from './idds/v23-2-idd'

/*
? RegExp Pattern
#linebreak#
/(?:\r\n|\r|\n)/

#head#
/\S+,#linebreak#(?: *\\.*#linebreak#)+/
Version,
      \memo Specifies the EnergyPlus version of the IDF file.
      \unique-object
      \format singleLine

#field#
/ *\S+ *[,;](?: *\\.*#linebreak#)+/
  A1 ; \field Version Identifier
      \default 23.2

#head#(#field#)+
/\S+,#linebreak#(?: *\\.*#linebreak#)+(?: *\S+ *[,;](?: *\\.*#linebreak#)+)+/g
 ^head                                ^fields
/\S+,(?:\r\n|\r|\n)(?: *\\.*(?:\r\n|\r|\n))+(?: *\S+ *[,;](?: *\\.*(?:\r\n|\r|\n))+)+/g
*/

//TODO move these?
export interface fieldProps {
  name: string;
  type: 'string' | 'number';
  units: 'string' | null;
}

type extensibleFieldName = [string, string]; // prefix, suffix -> (prefix)(n)(suffix)

export interface classProps {
  className: string;
  extensibleFieldStart?: number; // start index of the extensible fields
  extensibleFields?: extensibleFieldName[];
  fields: Record<string, fieldProps>; // fieldKey: fieldProps (excluding extensibles)
}
export type classFields = Record<string, classProps>; // classKey: classProps


//? —— Parse IDD File ——————

function parseIDDClassString(classString: string) {}

/**
 * Preprocess the .idd file (not intended for live parsing)
 * @param iddString A string containing the idd information
 */
function preprocessIDD(iddString: string) {
  const classMatches = iddString.matchAll(/\S+,(?:\r\n|\r|\n)(?: *\\.*(?:\r\n|\r|\n))+(?: *\S+ *[,;](?: *\\.*(?:\r\n|\r|\n))+)+/g);

  for (const classMatch of classMatches) {
    const classString: string = classMatch[0];
    
    //? get top-level class info
    const classInfoString = (classString.match(/\S+,(?:\r\n|\r|\n)(?: *\\.*(?:\r\n|\r|\n))+/) ?? [''])[0]; // Version, \~~, \~~
    const className = (classInfoString.match(/(\S+),/) ?? [])[1]; // e.g., Version
    const classKey = className.toLowerCase();

    //? get field info
    const fieldMatches = classString.matchAll(/ *\S+ *[,;](?: *\\.*(?:\r\n|\r|\n))+/g);
    
    for (const fieldMatch of fieldMatches) {
      const fieldString: string = fieldMatch[0];
      const fieldName = (fieldString.match(/\\field (.+)(?:\r\n|\r|\n)/) ?? [])[1];
      const fieldKey = fieldNameToKey(fieldName);
      const fieldTypeRaw = (fieldString.match(/\\type (\S+)(?:\r\n|\r|\n)/) ?? [])[1];
      // integer, real, alpha, choice, object-list, external-list, node
      let fieldType: string;
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
    }
    console.log()
  }
}

preprocessIDD(iddString)





/*

//? —— Parse Schema File ——————

const schema: any = schemaData;

// for export
// interface classPropsMini {
//   fields: string[];
// }
// type classFieldsMini = Record<string, classPropsMini>;

const dataDictionaryExport: classFieldsMini = Object.fromEntries(
  Object.entries(schema.properties).map(([className, propData]: [string, any]) => {
    const props: any = propData;
    const fieldNames: string[] = Object.values(props.legacy_idd.field_info).map((field_info: any) => field_info.field_name);
    const classProps: classPropsMini = {
      fields: fieldNames
    }
    return [className, classProps];
  })
)

// console.log(dataDictionaryExport);
// console.log(dataDictionaryExport['WindowMaterial:SimpleGlazingSystem'.toLowerCase()]);


// for (let key of Object.keys(schema.properties)) {
//   console.log(key)
// }

exportDataToJson(dataDictionaryExport, './src/idds/v23-2.schema-test.json', true);
*/