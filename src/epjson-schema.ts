import { fieldNameToKey } from './utilities';
import * as schemaData from './idds/v23-2.schema-mini.json'; //!TEMP

// for export
export interface classPropsMini {
  fields: string[];
}
export type classFieldsMini = Record<string, classPropsMini>;

const dataDictionaryImported: classFieldsMini = schemaData;
// console.log(Object.entries(dataDictionaryImported).slice(0, 10));
// console.log(Object.entries(dataDictionaryImported).filter(([className, props]) => props == null));

interface classProps {
  className: string;
  fieldNames: Record<string, string>;
}
type classFields = Record<string, classProps>;

// console.log(
//   Object.entries(dataDictionaryImported).filter(([className, props]) => {
//     const fieldKeyNameDict = Object.fromEntries(
//       Object.values(props.fields).map((fieldName) => [fieldNameToKey(fieldName), fieldName])
//     );
//     const classProps: classProps = {
//       className: className,
//       fieldNames: fieldKeyNameDict
//     };
//     return props == null
//   })
// )

export const dataDictionary: classFields = Object.fromEntries(
  Object.entries(dataDictionaryImported).map(([className, props]: [string, classPropsMini]) => {
    const fieldKeyNameDict = Object.fromEntries(
      Object.values(props.fields).map((fieldName) => [fieldNameToKey(fieldName), fieldName])
    );
    const classProps: classProps = {
      className: className,
      fieldNames: fieldKeyNameDict
    };
    console.log([className.toLowerCase(), classProps])
    return [className.toLowerCase(), classProps];
  })
)

console.log(dataDictionary['WindowMaterial:SimpleGlazingSystem'.toLowerCase()]);
