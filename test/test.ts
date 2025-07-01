/** Performance Test */

import { IDF } from '../src/idf';
import { idfString } from './idfs/RefBldgMediumOfficeNew2004_Chicago';

async function main() {
  console.log();
  console.time('read IDF');
  const idf = await IDF.fromString(idfString);
  console.timeEnd('read IDF');
  console.log();
  
  console.time('iterate objects');
  const _ = idf.getObjects('BuildingSurface:Detailed');
  for (const surf of _) {
    surf.Outside_Boundary_Condition = 'adiabatic';
  }
  console.timeEnd('iterate objects');
  console.log(`  num. of total surfaces: ${_.length}`);
  console.log();

  console.time('write IDF')
  idf.toString();
  console.timeEnd('write IDF')
  console.log();

  console.log(idf.getObjects('BuildingSurface:Detailed')[10]);
}
main();
