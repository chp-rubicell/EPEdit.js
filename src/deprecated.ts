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
