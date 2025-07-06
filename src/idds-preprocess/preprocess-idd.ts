import { IDD, parseIDDClassString } from '../idd';
import { readFileSync, writeFileSync } from 'fs';

//? —— Export ——————

// Export process IDD to .ts file.
function exportIDDToTs(
  idd: IDD,
  filePath: string,
  mini: boolean = false
) {
  try {
    //? Serialize the object to a JSON string
    // Minified output
    // const jsonString = JSON.stringify(data);
    // The 'null, 2' arguments pretty-print the JSON with 2-space indentation
    // const jsonString = JSON.stringify(data, null, 2);
    let jsonString = mini ? JSON.stringify(idd) : JSON.stringify(idd, null, 2);
    jsonString = 'export const iddString = String.raw`' + jsonString + '`';

    //? Define the output file path
    // path.join ensures the path is correct for any operating system
    // const filePath = path.join(__dirname, fileName);

    //? Write the string to a file
    writeFileSync(filePath, jsonString, 'utf-8');

    console.log(`Successfully exported data to ${filePath}`);
  } catch (err) {
    console.error('Error writing file:', err);
  }
}

//? —— RegExp Pattern ——————
/*
#linebreak#
/(?:\r\n|\r|\n)/

#head#
/[^\s,]+,#linebreak#(?: *\\.*#linebreak#)+/
Version,
      \memo Specifies the EnergyPlus version of the IDF file.
      \unique-object
      \format singleLine

#field#
/ *[^\s,]+ *[,;](?: *\\.*#linebreak#)+/
  A1 ; \field Version Identifier
      \default 23.2

#head#(#field#)+
/[^\s,]+,#linebreak#(?: *\\.*#linebreak#)+(?: *[^\s,]+ *[,;](?: *\\.*#linebreak#)+)+/g
 ^head                                ^fields
/[^\s,]+,(?:\r\n|\r|\n)(?: *\\.*(?:\r\n|\r|\n))+(?: *[^\s,]+ *[,;](?: *\\.*(?:\r\n|\r|\n))+)+/g
*/

//? —— Parse IDD File ——————

/**
 * Preprocess the .idd file (not intended for live parsing)
 * @param versionCode e.g., 23-2
 */
function preprocessIDD(versionCode: string, test: boolean = false) {
  const filePath = `./src/idds-preprocess/idds/V${versionCode}-0-Energy+.idd`;
  let iddString = '';
  try {
    iddString = readFileSync(filePath, 'utf8');
  } catch (err) {
    // console.error('Error reading the file:', err);
    throw new Error(`Error reading the file '${filePath}'`);
  }

  iddString = iddString.replace(/!.+(?:\r\n|\r|\n)/g, ''); // remove comments

  let idd: IDD = {};

  const classMatches = iddString.matchAll(/[^\s,]+,(?:\r\n|\r|\n)(?: *\\.*(?:\r\n|\r|\n))+(?: *[^\s,]+ *[,;](?: *\\.*(?:\r\n|\r|\n))+)+/g);

  for (const classMatch of classMatches) {
    const classString: string = classMatch[0];

    const classProp = parseIDDClassString(classString, true);
    const classKey = classProp.className.toLowerCase();

    idd[classKey] = classProp;
  }

  // console.log(idd);
  // console.log(idd['buildingsurface:detailed']);

  if (!test) {
    exportIDDToTs(idd, `./src/idds/v${versionCode}-idd.ts`, true);
  }
  else {
    exportIDDToTs(idd, `./src/idds-preprocess/test-v${versionCode}-idd.ts`, false);
  }
}

//? —— Run Preprocess ——————

// preprocessIDD('23-2', true);

const versionList = [
  '8-9',
  '9-0',
  '9-1',
  '9-2',
  '9-3',
  '9-4',
  '9-5',
  '9-6',
  '22-1',
  '22-2',
  '23-1',
  '23-2',
  '24-1',
  '24-2',
  '25-1',
]

for (const versionCode of versionList) {
  console.log(`—— ${versionCode} ——————`);
  preprocessIDD(versionCode);
  console.log();
}

