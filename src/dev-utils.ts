/** utilities for developing */

import { promises as fs } from 'fs';
// import * as path from 'path';

// Create an async function to handle the export
export async function exportDataToJson(
  data: Record<string, any>,
  filePath: string,
  mini: boolean = false
) {
  try {
    //? Serialize the object to a JSON string
    // Minified output
    // const jsonString = JSON.stringify(data);
    // The 'null, 2' arguments pretty-print the JSON with 2-space indentation
    // const jsonString = JSON.stringify(data, null, 2);
    const jsonString = mini ? JSON.stringify(data) : JSON.stringify(data, null, 2);

    //? Define the output file path
    // path.join ensures the path is correct for any operating system
    // const filePath = path.join(__dirname, fileName);

    //? Write the string to a file
    await fs.writeFile(filePath, jsonString, "utf-8");

    console.log(`Successfully exported data to ${filePath}`);
  } catch (err) {
    console.error("Error writing file:", err);
  }
}