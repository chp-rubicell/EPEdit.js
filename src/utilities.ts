//? —— Field Key and Name Related ——————
/**
 * Creates a new record with all keys converted to lowercase.
 * @param obj The input record.
 * @returns A new record with lowercase keys.
 */
export function lowerCaseKeys<T>(obj: Record<string, T>): Record<string, T> {
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
  console.log(separators)
  const words = str
    .toLowerCase()
    .split(re) // split the string into an array of words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)); // capitalize the first letter of each word

  return alternateMerge(words, separators).join('');
}

export function fieldNameToKey(fieldName: string): string {
  //TODO get info from idd
  let fieldKey = fieldName;
  fieldKey = fieldKey.replace(/\s*{.*}/, ''); // remove units
  fieldKey = toTitleCase(fieldKey, /[ \-_]/); // make it title case
  fieldKey = fieldKey.replace(/[-]/g, ''); // remove illegal characters
  fieldKey = fieldKey.replace(' ', '_');
  return fieldKey;
}

// const testName = 'U--Factor-tEst value {W/m2-K}';
// console.log(`'${testName}'`);
// console.log(`'${fieldNameToKey(testName)}'`);
// console.log(`'${fieldNameToKey(fieldNameToKey(testName))}'`);

//? —— Field Index Related ——————
/**
 * Finds the last index in a Record where the corresponding value is not null.
 *
 * @param record The Record to search through.
 * @returns The last index with a non-null value, or -1 if none is found.
 */
export function findLastFieldIndex<T>(record: Record<string, T | null>): number {
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