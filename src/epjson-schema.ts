import { fieldNameToKey } from './utilities';
import { default as schemaData } from './idds/v23-2.schema-mini.json'; //!TEMP
// to prevent "default": {...} key in JSON

// for export
export interface classPropsMini {
  fields: string[];
}
export type classFieldsMini = Record<string, classPropsMini>;

const dataDictionaryImported: classFieldsMini = schemaData;
// console.log(Object.entries(dataDictionaryImported).slice(0, 10));
// console.log(Object.entries(dataDictionaryImported).filter(([className, props]) => props == null));

export interface classProps {
  className: string;
  fieldNames: Record<string, string>;
}
export type classFields = Record<string, classProps>;


export class IDD {
  private iddCache: Record<string, classFields> // consider using Map?
  constructor() {
    this.iddCache = {};
  }

  getVersion(version: string) {
    const versionMatch = version.match(/\d+[\-.]\d+/);
    if (versionMatch == null) {
      throw new RangeError(`'${version}' is not a valid version format!`);
    }
    version = versionMatch[0].replace(/[.]/g, '-'); // '24-2' format
    // check if version is already in the cache
    if (version in this.iddCache) {
      return this.iddCache[version];
    }

    const {loadedString} = await import('./idds/v23-2');
  }

  /**
   * Read self-supplied .idd file.
   * @param iddString A string read from an .idd file.
   */
  fromIDD(iddString: string) { }
}
const version = '23-2.1';
console.log((version.match(/\d+[\-.]\d+/)??['23-2'])[0].replace(/[\-]/g, '.'));
/*
export const dataDictionary: classFields = Object.fromEntries(
  Object.entries(dataDictionaryImported).map(([className, props]: [string, classPropsMini]) => {
    if (!('fields' in props)) console.log(className)
    const fieldKeyNameDict = Object.fromEntries(
      Object.values(props.fields).map((fieldName) => [fieldNameToKey(fieldName), fieldName])
    );
    const classProps: classProps = {
      className: className,
      fieldNames: fieldKeyNameDict
    };
    return [className.toLowerCase(), classProps];
  })
)
*/

//? —— Export dataDictonary as JSON (for debugging) ——————
/*
import { exportDataToJson } from './dev-utils';
exportDataToJson(dataDictionary, './src/idds/v23-2.schema-expanded.json');
*/