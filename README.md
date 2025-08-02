<p align="center">
    <a href="https://github.com/chp-rubicell/EPEdit.js/releases/latest">
        <img src="https://github.com/chp-rubicell/EPEdit.js/blob/main/doc/epedit.svg" width="256" alt="EPEdit.js"><br/>
    </a>
    <!-- <img src="doc/epedit.svg" width="256" alt="EPEdit.js"><br/> -->
    <a href="https://github.com/chp-rubicell/EPEdit.js/releases/latest"><img src="https://img.shields.io/github/release/chp-rubicell/EPEdit.js.svg?style=flat-square&maxAge=3600" alt="Downloads"></a>
</p>

**EPEdit.js** is a JavaScript library for parsing, editing, and writing EnergyPlus Input Data Files (`.idf`).

## Features

- **Parse IDF Files**: Load `.idf` file content into a structured object model.
- **Modify IDF**: Create, update, or delete any object within the IDF model.
- **Find IDF Objects**: Easily find and retrieve objects by their type (e.g., `Building`, `Material`) and name.
- **Modify Fields**: Get and set values for any field of an IDF object.
- **Universal**: Works in both modern web browsers and Node.js environments.
- **Export to IDF**: Serialize the modified model back into a valid `.idf` file string.

## Usage

### Create a new IDF model

This code create a new IDF model and adds a new `Zone` object called `'Test Zone'`.

```javascript
import { IDF, IDDManager } from 'epedit.mjs';

async function addZoneExample() {
    const idd = await new IDDManager('./idds').getVersion('23.2');
    let idf = new IDF(idd);
    idf.newObject('Zone', {Name: 'Test Zone'});
    console.log(idf.toString());
}

addZoneExample();
```
```
  Zone
    Test Zone,               !- Name
    0,                       !- Direction of Relative North {deg}
    0,                       !- X Origin {m}
    0,                       !- Y Origin {m}
    0,                       !- Z Origin {m}
    1,                       !- Type
    1,                       !- Multiplier
    Autocalculate,           !- Ceiling Height {m}
    Autocalculate,           !- Volume {m3}
    Autocalculate,           !- Floor Area {m2}
    ,                        !- Zone Inside Convection Algorithm
    ,                        !- Zone Outside Convection Algorithm
    Yes;                     !- Part of Total Floor Area
```

### Read, modify, and save an `.idf` file

This code reads an `.idf` sting from `RefBldgMediumOfficeNew2004_Chicago` and iterate through `BuildingSurface:Detailed` objects to change the `Outside Boundary Condition` to `adiabatic`. Finally, it serializes the model back into an `.idf` file string.

```javascript
import { IDF, IDDManager } from 'epedit.mjs';
import { idfString } from './idfs/RefBldgMediumOfficeNew2004_Chicago.js';

async function main() {
    console.time('read IDF');
    const idf = await IDF.fromString(idfString, '../idds');
    console.timeEnd('read IDF');
    
    console.time('iterate objects');
    const surfaces = idf.getObjects('BuildingSurface:Detailed');
    for (const surf of surfaces) {
        surf.Outside_Boundary_Condition = 'adiabatic';
    }
    console.timeEnd('iterate objects');
    console.log(`  - num. of total surfaces: ${surfaces.length}`);
    console.log('  - updated surface boundary conditions.');

    console.time('write IDF')
    idf.toString();
    console.timeEnd('write IDF')

    console.log(idf.getObjects('BuildingSurface:Detailed')[10]);
    
    console.log(idf.toString().slice(0, 61));
}

main();
```
```
< RefBldgMediumOfficeNew2004_Chicago.idf >

read IDF: 263.925ms

iterate objects: 0.216ms
  - num. of total surfaces: 128
  - updated surface boundary conditions.

write IDF: 9.212ms

{
  Name: 'Core_mid_ZN_5_Wall_South',
  Surface_Type: 'Wall',
  Construction_Name: 'int-walls',
  Zone_Name: 'Core_mid',
  Space_Name: '',
  Outside_Boundary_Condition: 'adiabatic',
  Outside_Boundary_Condition_Object: 'Perimeter_mid_ZN_1_Wall_North',
  Sun_Exposure: 'NoSun',
  Wind_Exposure: 'NoWind',
  View_Factor_to_Ground: 'Autocalculate',
  Number_of_Vertices: '4',
  Vertex_1_Xcoordinate: 4.5732,
  Vertex_1_Ycoordinate: 4.5732,
  Vertex_1_Zcoordinate: 6.7056,
  Vertex_2_Xcoordinate: 4.5732,
  Vertex_2_Ycoordinate: 4.5732,
  Vertex_2_Zcoordinate: 3.9624,
  Vertex_3_Xcoordinate: 45.3375,
  Vertex_3_Ycoordinate: 4.5732,
  Vertex_3_Zcoordinate: 3.9624,
  Vertex_4_Xcoordinate: 45.3375,
  Vertex_4_Ycoordinate: 4.5732,
  Vertex_4_Zcoordinate: 6.7056
}

  Version
    23.2;                    !- Version Identifier
```

## API Reference

### `IDDManager`

- **`constructor(iddDir: string = './idds')`**: Creates a new IDDManager instance by pointing to the directory containing the preprocessed idds.
- **`async getVersion(version: string, ts: boolean = false)`**: Get a specific version of idd.
- **`static fromIDD(iddString: string)`**: Load an IDD from an `Energy+.idd` string. _<ins>(TODO)</ins>_

### `IDF`

- **`constructor(idd: IDD)`**: Create a new IDF model instance from a given IDD object.
- **`static async fromString(idfString: string, iddDir: string = './idds', globalIDDManager?: IDDManager, ts: boolean = false)`**: Create a new IDF model instance from an `.idf` file string.
- **`newObject(className: string, fields: IDFFields, ignoreDefaults: boolean = false)`**: Adds a new IDF object for the given IDF class based on the given fields.
- **`getObjects(className: string, re?: RegExp | undefined)`**: Get IDF objects with the matching pattern.
- **`getObject(className: string, name: string): IDFFields`**: Get an IDF object with the matching name.
- **`toString(classIndentSize: number = 2, fieldIndentSize: number = 4, fieldSize: number = 22)`**: Serialize the modified model back into a valid `.idf` file string.

## License

Distributed under the [MIT License](https://github.com/chp-rubicell/EPEdit.js/blob/main/LICENSE).
