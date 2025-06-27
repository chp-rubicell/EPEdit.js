import * as schemaData from './idd-to-json/jsons/test-mini.json';

// for export
interface classPropsExport {
  className: string;
  fields: string[];
}
type classFieldsExport = Record<string, classPropsExport>;

const dataDictionaryImported: classFieldsExport = schemaData;

interface classProps {
  className: string;
  fieldNames: Record<string, string>;
}
type classFields = Record<string, classProps>;


console.log(dataDictionary['WindowMaterial:SimpleGlazingSystem'.toLowerCase()]);
