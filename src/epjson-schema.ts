import { fieldNameToKey } from './utilities';
// import * as schema from './idds/v23-2-light.schema.json';
import * as schemaData from './idds/v23-2.schema.json';

const schema: any = schemaData;

/*
for (const key of Object.keys(schema.properties)) {
  if (schema.properties[key] == null) {
    console.log(key);
  }
  if (!('legacy_idd' in schema.properties[key])) {
    console.log(key);
  }
}
*/

interface classProps {
  className: string;
  fieldNames: Record<string, string>;
}
type classFields = Record<string, classProps>;

export const fieldDictionary: classFields = Object.fromEntries(
  Object.entries(schema.properties).map(([className, propData]: [string, any]) => {
    const props: any = propData;
    const fieldNames: string[] = Object.values(props.legacy_idd.field_info).map((field_info: any) => field_info.field_name);
    const fieldKeyNameDict = Object.fromEntries(
      Object.values(fieldNames).map((fieldName) => [fieldNameToKey(fieldName, true), fieldName])
    )
    const classProps: classProps = {
      className: className,
      fieldNames: fieldKeyNameDict
    }
    return [className.toLowerCase(), classProps];
  })
)

// console.log(fieldDictionary);
// console.log(fieldDictionary['WindowMaterial:SimpleGlazingSystem'.toLowerCase()]);


// for (let key of Object.keys(schema.properties)) {
//   console.log(key)
// }
