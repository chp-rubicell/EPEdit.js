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
 * @returns The title-cased string.
 */
function toTitleCase(str: string): string {
  // Return an empty string if the input is null, undefined, or empty
  if (!str) {
    return "";
  }

  return str
    .toLowerCase() // 1. Convert the entire string to lowercase
    .split(" ") // 2. Split the string into an array of words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // 3. Capitalize the first letter of each word
    .join(" "); // 4. Join the words back into a single string
}

export function fieldNameToKey(fieldName: string): string {
  //TODO get info from idd
  let fieldKey = fieldName;
  fieldKey = fieldKey.replace(/\s*{.*}/, ""); // remove units
  fieldKey = fieldKey.replace(/[-]/g, ""); // remove illegal characters
  fieldKey = toTitleCase(fieldKey);
  fieldKey = fieldKey.replace(" ", "_");
  return fieldKey;
}

const testName = 'U--Factor-tEst {W/m2-K}';
console.log()
console.log(toTitleCase(testName));
// console.log(`"${testName}"`);
// console.log(`"${fieldNameToKey(testName)}"`);