import { IDF, IDDManager } from '../dist/epedit.mjs';

async function main() {
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
}
main();