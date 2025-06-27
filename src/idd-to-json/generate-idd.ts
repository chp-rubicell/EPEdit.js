/** Generate IDD from schema.epJSON */
//TODO add support for extendible fields

// import { fieldNameToKey } from '../utilities';
// import * as schema from './idds/v23-2-light.schema.json';
import { classPropsMini, classFieldsMini } from '../epjson-schema'
import * as schemaData from './idds/v23-2.schema.json';

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
    /*
    const fieldKeyNameDict = Object.fromEntries(
      Object.values(fieldNames).map((fieldName) => [fieldNameToKey(fieldName), fieldName])
    );
    const classProps: classProps = {
      className: className,
      fieldNames: fieldKeyNameDict
    }
    */
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

//? —— Export Parsed Record File as JSON ——————

import { promises as fs } from 'fs';
// import * as path from 'path';

// Create an async function to handle the export
async function exportRecordToJsonFile(
  data: Record<string, any>,
  filePath: string,
) {
  try {
    //? Serialize the object to a JSON string
    // The 'null, 2' arguments pretty-print the JSON with 2-space indentation
    // const jsonString = JSON.stringify(data, null, 2);

    // Minified output
    const jsonString = JSON.stringify(data);

    //? Define the output file path
    // path.join ensures the path is correct for any operating system
    // const filePath = path.join(__dirname, fileName);

    //? Write the string to a file
    await fs.writeFile(filePath, jsonString, "utf-8");

    console.log(`Successfully exported data to ${filePath}`);
  } catch (err) {
    console.error("Error writing file:", err);
  }
}

exportRecordToJsonFile(dataDictionaryExport, './src/idds/v23-2.schema-mini.json');
