import { fieldNameToKey } from './utilities';

// for export
export interface classPropsMini {
  fields: string[];
}
export type classFieldsMini = Record<string, classPropsMini>;

export interface classProps {
  className: string;
  fieldNames: Record<string, string>;
}
export type classFields = Record<string, classProps>;

/**
 * Load an IDD string from a typescript file corresponding to the given version.
 * @param code Version code (e.g., '24-2')
 * @returns IDD string (e.g., from 'v24-2.ts')
 */
export async function loadString(code: string): Promise<string> {
  const { idd } = await import(`./idds/v${code}`);
  return idd;
}

export class IDDManager {
  private iddCache: Record<string, classFields> // consider using Map?

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
      const dataDictionaryImported: classFieldsMini = JSON.parse(loadedString) as classFieldsMini;

      const dataDictionary: classFields = Object.fromEntries(
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

      this.iddCache[version] = dataDictionary;
    }
    return this.iddCache[version];
  }

  /**
   * Read self-supplied .idd file.
   * @param iddString A string read from an .idd file.
   */
  fromIDD(iddString: string) { }
}
/*
async function main() {
  const idd = new IDD();
  const i = await idd.getVersion('23.2');
  console.log(i['WindowMaterial:SimpleGlazingSystem'.toLowerCase()]);
}
main();
*/

//? —— Export dataDictonary as JSON (for debugging) ——————
/*
import { exportDataToJson } from './dev-utils';
exportDataToJson(dataDictionary, './src/idds/v23-2.schema-expanded.json');
*/