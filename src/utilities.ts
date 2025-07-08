import { IDFFieldType, IDFFieldValueStrict } from './types';

//? —— Field Key and Name Related ——————

export function fieldNameToKey(fieldName: string): string {
  let fieldKey = fieldName;
  fieldKey = fieldKey.replace(/[-/*()]/g, ''); // remove illegal characters
  fieldKey = fieldKey.replace(/ /g, '_');
  return fieldKey;
}

// const testName = 'U--Factor-tEst value {W/m2-K}';
// const testName = 'Do-Zone Sizing Calculation';
// console.log(`'${testName}'`);
// console.log(`'${fieldNameToKey(testName)}'`);
// console.log(`'${fieldNameToKey(fieldNameToKey(testName))}'`);

/**
 * Creates a new record with all keys converted to lowercase.
 * @param obj The input record.
 * @returns A new record with lowercase keys.
 */
export function renameFieldNamesToKeys<T>(obj: Record<string, T>): Record<string, T> {
  return Object.fromEntries(
    Object.entries(obj).map(([fieldName, value]) => [fieldNameToKey(fieldName), value]),
  );
}

//? —— Field Value Related ——————

export function typeCastFieldValue(fieldType: IDFFieldType, value: IDFFieldValueStrict, className: string, fieldName: string) {
  switch (fieldType) {
    case 'int':
      if (typeof value === 'string') value = parseInt(value);
      else value = Math.trunc(value);
      break;
    case 'float':
      if (typeof value === 'string') value = parseFloat(value);
      break;
    case 'string':
      value = String(value);
      break;
    default:
      throw new RangeError(`Type '${fieldType}' not supported for ${className} - ${fieldName}`);
      break;
  }
  return value
}

//? —— Deprecated ——————

//? RegExp
/**
 * Converts a regular expression into a "strict" version that must match the entire string.
 *
 * @param regex The original RegExp object.
 * @returns A new RegExp object anchored with `^` and `$`.
 * @throws {Error} if the regex has the multiline 'm' flag.
 */
export function strictRegex(regex: RegExp): RegExp {
  // The 'm' flag changes how `^` and `$` work, so we prevent it.
  if (regex.multiline) {
    throw new Error(
      'Cannot make a regex strict if it uses the multiline \'m\' flag.',
    );
  }

  // Note: This simple version doesn't check if the source already
  // contains anchors, which could lead to `^^...$$`. This is
  // usually harmless but worth noting for complex cases.

  const strictPattern = `^${regex.source}$`;
  return new RegExp(strictPattern, regex.flags);
}

// console.log(/name\d/.test('name1a'));
// console.log(strictRegex(/name\d/).test('name1a'));

//? Field Key and Name Related
/**
 * Creates a new record with all keys converted to lowercase.
 * @param obj The input record.
 * @returns A new record with lowercase keys.
 */
function lowerCaseKeys<T>(obj: Record<string, T>): Record<string, T> {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key.toLowerCase(), value]),
  );
}

/**
 * Merges two arrays by alternating their elements.
 *
 * @param arr1 The first array.
 * @param arr2 The second array.
 * @returns A new array with elements from arr1 and arr2 alternated.
 */
function alternateMerge<T, U>(arr1: T[], arr2: U[]): (T | U)[] {
  const result: (T | U)[] = [];
  const maxLength = Math.max(arr1.length, arr2.length);

  for (let i = 0; i < maxLength; i++) {
    // Add element from the first array if it exists
    if (i < arr1.length) {
      result.push(arr1[i]);
    }

    // Add element from the second array if it exists
    if (i < arr2.length) {
      result.push(arr2[i]);
    }
  }

  return result;
}

/**
 * Converts a string to title case, where the first letter of each word is capitalized.
 *
 * @param str The input string to convert.
 * @param re RegExp pattern for spliting the words.
 * @returns The title-cased string.
 */
function toTitleCase(str: string, re: RegExp = /[ ]/): string {
  // Return an empty string if the input is null, undefined, or empty
  if (!str) {
    return '';
  }

  re = new RegExp(re.source, 'g'); // change regexp to global

  const separators: string[] = str.match(re) ?? [];
  // console.log(separators);
  const words = str
    .toLowerCase()
    .split(re) // split the string into an array of words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)); // capitalize the first letter of each word

  return alternateMerge(words, separators).join('');
}


//? Field Index Related
/**
 * Finds the last index in a Record where the corresponding value is not null.
 *
 * @param record The Record to search through.
 * @returns The last index with a non-null value, or -1 if none is found.
 */
function findLastFieldIndex<T>(record: Record<string, T | null>): number {
  // Get an array of the record's keys.
  const keys = Object.keys(record);

  // Iterate backward from the end of the keys array.
  for (let i = keys.length - 1; i >= 0; i--) {
    const key = keys[i];
    // Check if the value for the current key is not null.
    if (record[key] !== null) {
      // If it's not null, this is the last one. Return the key.
      return i;
    }
  }

  // If the loop finishes, no non-null value was found.
  return -1;
}