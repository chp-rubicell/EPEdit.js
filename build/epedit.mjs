// src/utilities.ts
function renameFieldNamesToKeys(obj) {
  return Object.fromEntries(
    Object.entries(obj).map(([fieldName, value]) => [fieldNameToKey(fieldName), value])
  );
}
function fieldNameToKey(fieldName) {
  let fieldKey = fieldName;
  fieldKey = fieldKey.replace(/[-/*()]/g, "");
  fieldKey = fieldKey.replace(/ /g, "_");
  return fieldKey;
}

// src/idd.ts
var IDDManager = class {
  constructor(iddDir = "./idds") {
    this.iddCache = {};
    if (iddDir.endsWith("/")) iddDir = iddDir.slice(0, -1);
    this.iddDir = iddDir;
  }
  /**
   * Load an IDD for the given version.
   * @param version Version code (e.g., '24-2')
   * @returns IDD string (e.g., from 'v24-2.ts')
   */
  async getVersion(version, ts = false) {
    const versionMatch = version.match(/\d+[\-.]\d+/);
    if (versionMatch == null) {
      throw new RangeError(`'${version}' is not a valid version format!`);
    }
    version = versionMatch[0].replace(/[.]/g, "-");
    if (!(version in this.iddCache)) {
      await this.loadPreprocessedIDD(`${this.iddDir}/v${version}-idd${ts ? "" : ".js"}`);
    }
    return this.iddCache[version];
  }
  /**
   * 
   * @param iddPath e.g., `${this.iddDir}/v${version}-idd`
   */
  async loadPreprocessedIDD(iddPath) {
    const { iddVersion, iddString } = await import(iddPath);
    const idd = JSON.parse(iddString);
    this.iddCache[iddVersion] = idd;
  }
  /**
   * Read self-supplied .idd file.
   * @param iddString A string read from an .idd file.
   */
  static fromIDD(iddString) {
  }
};

// src/idf.ts
var IDFObject = class {
  constructor(idfClass, fields) {
    this.class = idfClass;
    this.className = idfClass.name;
    if (idfClass.hasNameField) {
      this.name = String(fields["name"]);
    } else {
      this.name = null;
    }
    fields = renameFieldNamesToKeys(fields);
    const [lastFieldIdx, _] = idfClass.getLastFieldIdxAndKeyFromFields(fields);
    const fieldProps2 = idfClass.getFieldProps(lastFieldIdx + 1);
    this.fields = Object.fromEntries(
      Object.entries(fields).map(([key, value]) => {
        const fieldType = fieldProps2[key].type;
        if (typeof value === "string" && (value.toLowerCase() == "autosize" || value.toLowerCase() == "autocalculate")) {
          value = value.toLowerCase();
        } else if (value !== null) {
          switch (fieldType) {
            case "int":
              if (typeof value === "string") value = parseInt(value);
              else value = Math.trunc(value);
              break;
            case "float":
              if (typeof value === "string") value = parseFloat(value);
              break;
            case "string":
              value = String(value);
              break;
            default:
              throw new RangeError(`Type '${fieldType}' not supported for ${this.className} - ${this.name}`);
              break;
          }
        }
        return [key, value];
      })
    );
  }
  /**
   * Get the value of a field in an IDFObject.
   * @param fieldName Name of the field to edit (case insensitive).
   * @returns Value of the field.
   */
  get(fieldName) {
    return this.fields[fieldNameToKey(fieldName)];
  }
  /**
   * Change the value of a field in an IDFObject.
   * @param fieldName Name of the field to edit (case insensitive).
   * @param value Value to set the field.
   */
  set(fieldName, value) {
    this.fields[fieldNameToKey(fieldName)] = value;
  }
  toString(classIndentSize = 2, fieldIndentSize = 4, fieldSize = 22) {
    const classIndent = " ".repeat(Math.floor(classIndentSize));
    const fieldIndent = " ".repeat(Math.floor(fieldIndentSize));
    let outputString = "";
    const [lastFieldIndex, lastFieldKey] = this.class.getLastFieldIdxAndKeyFromFields(this.fields);
    if (lastFieldIndex < 0) return "";
    outputString += `
${classIndent}${this.className}
`;
    const fieldProps2 = this.class.getFieldProps(lastFieldIndex + 1);
    for (const [fieldKey, fieldProp] of Object.entries(fieldProps2)) {
      const fieldName = fieldProp.name;
      const fieldVal = String(this.fields[fieldKey] ?? "");
      const fieldPaddingLength = fieldSize - String(fieldVal).length;
      const fieldPadding = " ".repeat(fieldPaddingLength >= 0 ? fieldPaddingLength : 0);
      const closingSymbol = fieldKey == lastFieldKey ? ";" : ",";
      const fieldUnits = fieldProp.units;
      const fieldUnitsString = fieldUnits === null ? "" : ` {${fieldUnits}}`;
      outputString += `${fieldIndent}${fieldVal}${closingSymbol}${fieldPadding}  !- ${fieldName}${fieldUnitsString}
`;
    }
    return outputString;
  }
};
var IDFClass = class {
  constructor(classIDD) {
    this.classIDD = classIDD;
    this.name = classIDD.className;
    this.idfObjects = [];
    this.fieldKeys = Object.keys(classIDD.fields);
    this.hasNameField = Object.keys(this.fieldKeys)[0] == "Name";
    if (classIDD.extensible) {
      this.fieldKeys = this.fieldKeys.slice(0, classIDD.extensible.startIdx);
      this.hasExtensible = true;
      this.extensibleStartIdx = classIDD.extensible.startIdx;
      this.extensibleSize = classIDD.extensible.size;
    } else {
      this.hasExtensible = false;
      this.extensibleStartIdx = -1;
      this.extensibleSize = 0;
    }
    this.fieldSize = this.fieldKeys.length;
  }
  getFieldIdxByKey(fieldKey) {
    const fieldIdx = this.fieldKeys.indexOf(fieldKey);
    if (fieldIdx >= 0) {
      return fieldIdx;
    } else if (this.hasExtensible) {
      let extensibleIdx = -1;
      let extensibleGroupIdx = -1;
      for (let regexpIdx = 0; regexpIdx < (this.classIDD.extensible?.keyRegExps ?? []).length; regexpIdx++) {
        const regexp = new RegExp((this.classIDD.extensible?.keyRegExps ?? [])[regexpIdx]);
        const regexpMatch = fieldKey.match(regexp);
        if (regexpMatch) {
          extensibleIdx = regexpIdx;
          extensibleGroupIdx = parseInt(regexpMatch[1]) - 1;
          break;
        }
      }
      if (extensibleIdx < 0) {
        throw new RangeError(`'${this.name}' has no '${fieldKey}' field!`);
      }
      return this.extensibleStartIdx + this.extensibleSize * extensibleGroupIdx + extensibleIdx;
    } else {
      throw new RangeError(`'${this.name}' has no '${fieldKey}' field!`);
    }
  }
  /**
   * Get the biggest index in an array of fieldKeys
   * @param fieldKeys An array of fieldKeys
   * @returns 
   */
  getLastFieldIdxByKeys(fieldKeys) {
    let lastFieldIdx = -1;
    for (const fieldKey of fieldKeys) {
      const fieldIdx = this.getFieldIdxByKey(fieldKey);
      if (fieldIdx > lastFieldIdx) lastFieldIdx = fieldIdx;
    }
    return lastFieldIdx;
  }
  /**
   * Get the biggest index in IDFFields
   * @param fields IDFFields of fieldKey: fieldVal
   * @returns [lastFieldIdx, lastFieldKey]
   */
  getLastFieldIdxAndKeyFromFields(fields) {
    let lastFieldIdx = -1;
    let lastFieldKey = "";
    for (const [key, val] of Object.entries(fields)) {
      if (val === null) continue;
      const fieldIdx = this.getFieldIdxByKey(key);
      if (fieldIdx > lastFieldIdx) {
        lastFieldIdx = fieldIdx;
        lastFieldKey = key;
      }
    }
    return [lastFieldIdx, lastFieldKey];
  }
  getFieldNameByIdx(fieldIdx) {
    if (fieldIdx < this.fieldSize) {
      return Object.values(this.classIDD.fields)[fieldIdx].name;
    } else if (this.hasExtensible) {
      const extensibleIdx = (fieldIdx - this.fieldSize) % this.extensibleSize;
      const extensibleGroupIdx = Math.floor((fieldIdx - this.fieldSize) / this.extensibleSize);
      const [prefix, suffix] = this.classIDD.extensible?.fieldNames[extensibleIdx] ?? ["", ""];
      return `${prefix}${extensibleGroupIdx + 1}${suffix}`;
    } else {
      throw new RangeError(`Index ${fieldIdx} is out of bound for '${this.name}'!`);
    }
  }
  /**
   * Create an array of field key in one loop.
   * @param length Desired length of the field key array.
   * @returns 
   */
  getFieldKeys(length) {
    if (length <= this.fieldSize) {
      return this.fieldKeys.slice(0, length);
    } else if (this.hasExtensible) {
      let keys = [...this.fieldKeys];
      for (let i = 0; i < length - this.fieldSize; i++) {
        const extensibleIdx = i % this.extensibleSize;
        const extensibleGroupIdx = Math.floor(i / this.extensibleSize);
        const [prefix, suffix] = this.classIDD.extensible?.fieldNames[extensibleIdx] ?? ["", ""];
        keys.push(fieldNameToKey(`${prefix}${extensibleGroupIdx + 1}${suffix}`));
      }
      return keys;
    } else {
      throw new RangeError(`Length ${length} is out of bound for '${this.name}'!`);
    }
  }
  /**
   * Create an array of fieldProps in one loop.
   * @param length Desired length of the field key array.
   * @returns 
   */
  getFieldProps(length) {
    const fieldLength = Object.values(this.classIDD.fields).length;
    if (length <= fieldLength) {
      return Object.fromEntries(
        Object.entries(this.classIDD.fields).slice(0, length)
      );
    } else if (this.hasExtensible) {
      const extensibleProps = Object.values(this.classIDD.fields).slice(-this.extensibleSize);
      let fields = { ...this.classIDD.fields };
      for (let i = 0; i < length - fieldLength; i++) {
        const extensibleIdx = i % this.extensibleSize;
        const extensibleGroupIdx = Math.floor(i / this.extensibleSize) + 1;
        const templateFieldProp = extensibleProps[extensibleIdx];
        const [prefix, suffix] = this.classIDD.extensible?.fieldNames[extensibleIdx] ?? ["", ""];
        const fieldName = `${prefix}${extensibleGroupIdx + 1}${suffix}`;
        const fieldKey = fieldNameToKey(fieldName);
        fields[fieldKey] = {
          name: fieldName,
          type: templateFieldProp.type,
          units: templateFieldProp.units
        };
      }
      return fields;
    } else {
      throw new RangeError(`Length ${length} is out of bound for '${this.name}'!`);
    }
  }
  getFieldPropByIdx(fieldIdx) {
    if (fieldIdx < this.fieldSize) {
      return Object.values(this.classIDD.fields)[fieldIdx];
    } else if (this.hasExtensible) {
      const extensibleIdx = (fieldIdx - this.fieldSize) % this.extensibleSize;
      const extensibleGroupIdx = Math.floor((fieldIdx - this.fieldSize) / this.extensibleSize);
      const [prefix, suffix] = this.classIDD.extensible?.fieldNames[extensibleIdx] ?? ["", ""];
      const fieldName = `${prefix}${extensibleGroupIdx + 1}${suffix}`;
      const templateFieldProp = Object.values(this.classIDD.fields)[this.extensibleStartIdx + extensibleIdx];
      return {
        name: fieldName,
        type: templateFieldProp.type,
        units: templateFieldProp.units
      };
    } else {
      throw new RangeError(`Index ${fieldIdx} is out of bound for '${this.name}'!`);
    }
  }
  getFieldNameByKey(fieldKey) {
  }
  getObjectsFields(re) {
    if (this.hasNameField && re !== void 0) {
      return this.idfObjects.filter((item) => re.test(String(item.fields.Name ?? ""))).map((item) => item.fields);
    } else {
      return this.idfObjects.map((item) => item.fields);
    }
  }
};
var IDF = class _IDF {
  constructor(idd) {
    //* Hyperparameters
    // whether to check validity when modifying the IDF object
    this.CHECKVALID = false;
    this.IDD = idd;
    this.idfClasses = {};
  }
  //? —— Define IDF from String ——————
  static async fromString(idfString, globalIDDManager, ts = false) {
    if (idfString.length <= 0) throw RangeError("Not a valid IDF string!");
    idfString = idfString.replace(/!.*\s*/g, "");
    idfString = idfString.replace(/,\s*/g, ",").replace(/;\s*/g, ";").trim();
    const versionMatch = idfString.match(/version,(\S+?);/i);
    if (versionMatch == null) throw RangeError("No version info!");
    const version = versionMatch[1];
    let idd;
    if (globalIDDManager == null) {
      idd = await new IDDManager().getVersion(version, ts);
    } else {
      idd = await globalIDDManager.getVersion(version, ts);
    }
    const idf = new _IDF(idd);
    const objectList = idfString.split(";");
    for (let i = 0; i < objectList.length; i++) {
      const obj = objectList[i];
      if (obj.length <= 0) continue;
      const fieldList = obj.split(",");
      const className = fieldList.shift() ?? "";
      const keys = idf.getIDFClass(className).getFieldKeys(fieldList.length);
      const entries = fieldList.map((value, index) => [keys[index], value]);
      const fields = Object.fromEntries(entries);
      idf.addObject(className, fields);
    }
    return idf;
  }
  //? —— Manage IDF ——————
  /**
   * Returns an IDFClass object with the corresponding className.
   * @param className IDF class name (case insensitive).
   * @returns IDFClass.
   */
  //!!!private
  getIDFClass(className) {
    const classNameLower = className.toLowerCase();
    if (!(classNameLower in this.idfClasses)) {
      const classIDD = this.IDD[classNameLower];
      this.idfClasses[classNameLower] = new IDFClass(classIDD);
    }
    return this.idfClasses[classNameLower];
  }
  //? —— Edit IDF ——————
  /**
   * Adds a new IDF object for the given IDF class based on the given fields.
   * @param className IDF class name (case insensitive).
   * @param fields TODO
   */
  addObject(className, fields) {
    const idfClass = this.getIDFClass(className);
    idfClass.idfObjects.push(new IDFObject(idfClass, fields));
  }
  getObjects(className, re) {
    const classNameLower = className.toLowerCase();
    if (!(classNameLower in this.idfClasses)) {
      throw new RangeError(`'${className}' not in this idf!`);
    }
    return this.getIDFClass(className).getObjectsFields(re);
  }
  //? —— Export as String ——————
  toString(classIndentSize = 2, fieldIndentSize = 4, fieldSize = 22) {
    const classIndent = " ".repeat(Math.floor(classIndentSize));
    const fieldIndent = " ".repeat(Math.floor(fieldIndentSize));
    let outputString = "";
    for (const [classNameLower, idfClass] of Object.entries(this.idfClasses)) {
      for (const idfObject of idfClass.idfObjects) {
        outputString += idfObject.toString();
      }
    }
    return outputString;
  }
};
export {
  IDDManager,
  IDF
};
