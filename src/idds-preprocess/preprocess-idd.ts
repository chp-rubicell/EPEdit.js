import { IDD, parseIDDClassString } from '../idd';
import { promises as fs } from 'fs';

//? —— Export ——————

// Export process IDD to .ts file.
export async function exportIDDToTs(
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
    await fs.writeFile(filePath, jsonString, 'utf-8');

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
/\S+,#linebreak#(?: *\\.*#linebreak#)+/
Version,
      \memo Specifies the EnergyPlus version of the IDF file.
      \unique-object
      \format singleLine

#field#
/ *\S+ *[,;](?: *\\.*#linebreak#)+/
  A1 ; \field Version Identifier
      \default 23.2

#head#(#field#)+
/\S+,#linebreak#(?: *\\.*#linebreak#)+(?: *\S+ *[,;](?: *\\.*#linebreak#)+)+/g
 ^head                                ^fields
/\S+,(?:\r\n|\r|\n)(?: *\\.*(?:\r\n|\r|\n))+(?: *\S+ *[,;](?: *\\.*(?:\r\n|\r|\n))+)+/g
*/

//? —— Parse IDD File ——————

/**
 * Preprocess the .idd file (not intended for live parsing)
 * @param iddString A string containing the idd information
 */
async function preprocessIDD(iddCode: string) {
  const { iddString } = await import(`./v${iddCode}-idd`);

  let idd: IDD = {};

  const classMatches = iddString.matchAll(/\S+,(?:\r\n|\r|\n)(?: *\\.*(?:\r\n|\r|\n))+(?: *\S+ *[,;](?: *\\.*(?:\r\n|\r|\n))+)+/g);

  for (const classMatch of classMatches) {
    const classString: string = classMatch[0];

    const classProp = parseIDDClassString(classString, true);
    const classKey = classProp.className.toLowerCase();

    idd[classKey] = classProp;
  }

  // console.log(idd);
  // console.log(idd['buildingsurface:detailed']);

  exportIDDToTs(idd, `./src/idds/v${iddCode}-idd.ts`, true);
}

//? —— Run Preprocess ——————

preprocessIDD('23-2');
