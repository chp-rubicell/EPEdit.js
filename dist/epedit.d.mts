/** Generate IDD from schema.epJSON */
interface fieldProps {
    name: string;
    type: 'string' | 'int' | 'float';
    units: string | null;
}
type extensibleFieldName = [string, string];
interface classProps {
    className: string;
    fields: Record<string, fieldProps>;
    extensible?: {
        startIdx: number;
        size: number;
        keyRegExps: string[];
        fieldNames: extensibleFieldName[];
    };
}
type IDD = Record<string, classProps>;
declare class IDDManager {
    private iddCache;
    iddDir: string;
    constructor(iddDir?: string);
    /**
     * Load an IDD for the given version.
     * @param version Version code (e.g., '24-2')
     * @returns IDD string (e.g., from 'v24-2.ts')
     */
    getVersion(version: string, ts?: boolean): Promise<IDD>;
    /**
     *
     * @param iddPath e.g., `${this.iddDir}/v${version}-idd`
     */
    loadPreprocessedIDD(iddPath: string): Promise<void>;
    /**
     * Read self-supplied .idd file.
     * @param iddString A string read from an .idd file.
     */
    static fromIDD(iddString: string): void;
}

type IDFFieldValue = string | number | null;
type IDFFields = Record<string, IDFFieldValue>;
declare class IDFObject {
    class: IDFClass;
    className: string;
    name: string | null;
    fields: IDFFields;
    constructor(idfClass: IDFClass, fields: IDFFields);
    /**
     * Get the value of a field in an IDFObject.
     * @param fieldName Name of the field to edit (case insensitive).
     * @returns Value of the field.
     */
    get(fieldName: string): IDFFieldValue;
    /**
     * Change the value of a field in an IDFObject.
     * @param fieldName Name of the field to edit (case insensitive).
     * @param value Value to set the field.
     */
    set(fieldName: string, value: IDFFieldValue): void;
    toString(classIndentSize?: number, fieldIndentSize?: number, fieldSize?: number): string;
}
declare class IDFClass {
    readonly classIDD: classProps;
    readonly name: string;
    idfObjects: IDFObject[];
    readonly fieldKeys: string[];
    readonly fieldSize: number;
    readonly hasNameField: boolean;
    readonly hasExtensible: boolean;
    readonly extensibleStartIdx: number;
    readonly extensibleSize: number;
    constructor(classIDD: classProps);
    getFieldIdxByKey(fieldKey: string): number;
    /**
     * Get the biggest index in an array of fieldKeys
     * @param fieldKeys An array of fieldKeys
     * @returns
     */
    getLastFieldIdxByKeys(fieldKeys: string[]): number;
    /**
     * Get the biggest index in IDFFields
     * @param fields IDFFields of fieldKey: fieldVal
     * @returns [lastFieldIdx, lastFieldKey]
     */
    getLastFieldIdxAndKeyFromFields(fields: IDFFields): [number, string];
    getFieldNameByIdx(fieldIdx: number): string;
    /**
     * Create an array of field key in one loop.
     * @param length Desired length of the field key array.
     * @returns
     */
    getFieldKeys(length: number): string[];
    /**
     * Create an array of fieldProps in one loop.
     * @param length Desired length of the field key array.
     * @returns
     */
    getFieldProps(length: number): Record<string, fieldProps>;
    getFieldPropByIdx(fieldIdx: number): fieldProps;
    getFieldNameByKey(fieldKey: string): void;
    getObjectsFields(re?: RegExp | undefined): IDFFields[];
}
declare class IDF {
    CHECKVALID: boolean;
    readonly IDD: IDD;
    idfClasses: Record<string, IDFClass>;
    constructor(idd: IDD);
    static fromString(idfString: string, iddDir?: string, globalIDDManager?: IDDManager, ts?: boolean): Promise<IDF>;
    /**
     * Returns an IDFClass object with the corresponding className.
     * @param className IDF class name (case insensitive).
     * @returns IDFClass.
     */
    getIDFClass(className: string): IDFClass;
    /**
     * Adds a new IDF object for the given IDF class based on the given fields.
     * @param className IDF class name (case insensitive).
     * @param fields fieldKeys and values for creating IDF objects
     */
    newObject(className: string, fields: IDFFields): void;
    getObjects(className: string, re?: RegExp | undefined): IDFFields[];
    toString(classIndentSize?: number, fieldIndentSize?: number, fieldSize?: number): string;
}

export { IDDManager, IDF };
