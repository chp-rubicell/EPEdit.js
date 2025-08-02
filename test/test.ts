/** Performance Test */

import { IDF } from '../src/idf';
import { idfString } from './idfs/RefBldgMediumOfficeNew2004_Chicago';

async function main() {
  console.log();
  console.log('< RefBldgMediumOfficeNew2004_Chicago.idf >')
  console.log();

  console.time('read IDF');
  const idf = await IDF.fromString(idfString, '../idds');
  console.timeEnd('read IDF');
  console.log();
  
  console.time('iterate objects');
  const _ = idf.getObjects('BuildingSurface:Detailed');
  for (const surf of _) {
    surf.Outside_Boundary_Condition = 'adiabatic';
  }
  console.timeEnd('iterate objects');
  console.log(`  - num. of total surfaces: ${_.length}`);
  console.log('  - updated surface boundary conditions.');
  console.log();

  console.time('write IDF')
  idf.toString();
  console.timeEnd('write IDF')
  console.log();

  console.log(idf.getObjects('BuildingSurface:Detailed')[10]);
  console.log();

  console.log();
  console.log(idf.toString().slice(0, 61));
}
main();
async function getObjectTest() {
  const idf = await IDF.fromString(idfString, '../idds');
  // console.log(idf.getObject('Version', ''));
  console.log(idf.getObjects('BuildingSurface:Detailed').map((item) => item.Name));
  console.log(idf.getObject('BuildingSurface:Detailed', 'Core_mid_ZN_5_Wall_South'));
}
// getObjectTest();
