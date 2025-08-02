import { IDF, IDDManager } from '../dist/epedit.mjs';
import { idfString } from './idfs/RefBldgMediumOfficeNew2004_Chicago.js';

async function addObjectTest() {
    const idd = await new IDDManager('../../idds').getVersion('23.2');
    let idf = new IDF(idd);
    idf.newObject('Zone', {Name: 'Test Zone'});
    console.log(idf.toString());
}

async function surfaceTest() {
    const idd = await new IDDManager('../../idds').getVersion('23.2');
    // const iddManager = new IDDManager();
    // await iddManager.loadPreprocessedIDD('../dist/idds/v23-2-idd.js');
    // const idd = iddManager.getVersion('23.2');
    let idf = new IDF(idd);
    const surfClass = idf.getIDFClass('buildingsurface:detailed');
    // console.log(surfClass)
    console.log(surfClass.getFieldIdxByKey('Vertex_3_Ycoordinate'));
    console.log(surfClass.getFieldPropByIdx(19));
    console.log(surfClass.getFieldKeys(20));
    console.log(surfClass.getFieldProps(20));
    console.log(surfClass.getLastFieldIdxAndKeyFromFields({'Vertex_3_Ycoordinate':1, 'Vertex_3_Zcoordinate':null, 'Name':''}));
    
    console.log()
    idf.newObject('buildingsurface:detailed', {Vertex_3_Ycoordinate: 0});
    console.log(idf.toString());
}

async function speedTest() {
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
  console.log(idf.toString().slice(0, 200));
}

async function getObjectTest() {
  const idf = await IDF.fromString(idfString, '../idds');
  console.log(idf.getIDFClass('buildingsurface:detailed').fieldKeys[0])
  console.log(idf.getIDFClass('buildingsurface:detailed').hasNameField);
  console.log(idf.getObjects('BuildingSurface:Detailed', /Core_mid_ZN_5_Wall_South/))
}

// addObjectTest();
// surfaceTest();
// speedTest();
getObjectTest();