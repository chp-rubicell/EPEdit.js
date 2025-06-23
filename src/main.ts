import { readIDD } from "./idd";
import { IDF } from "./idf";


const exampleIDD: string = `
\\group Simulation Parameters

Version,
      \\memo Specifies the EnergyPlus version of the IDF file.
      \\unique-object
      \\format singleLine
  A1 ; \\field Version Identifier
      \\default 23.2

SimulationControl,
      \\unique-object
      \\memo Note that the following 3 fields are related to the Sizing:Zone, Sizing:System,
      \\memo and Sizing:Plant objects. Having these fields set to Yes but no corresponding
      \\memo Sizing object will not cause the sizing to be done. However, having any of these
      \\memo fields set to No, the corresponding Sizing object is ignored.
      \\memo Note also, if you want to do system sizing, you must also do zone sizing in the same
      \\memo run or an error will result.
      \\min-fields 7
  A1, \\field Do Zone Sizing Calculation
      \\note If Yes, Zone sizing is accomplished from corresponding Sizing:Zone objects
      \\note and autosize fields.
      \\type choice
      \\key Yes
      \\key No
      \\default No
  A2, \\field Do System Sizing Calculation
      \\note If Yes, System sizing is accomplished from corresponding Sizing:System objects
      \\note and autosize fields.
      \\note If Yes, Zone sizing (previous field) must also be Yes.
      \\type choice
      \\key Yes
      \\key No
      \\default No
  A3, \\field Do Plant Sizing Calculation
      \\note If Yes, Plant sizing is accomplished from corresponding Sizing:Plant objects
      \\note and autosize fields.
      \\type choice
      \\key Yes
      \\key No
      \\default No
  A4, \\field Run Simulation for Sizing Periods
      \\note If Yes, SizingPeriod:* objects are executed and results from those may be displayed..
      \\type choice
      \\key Yes
      \\key No
      \\default Yes
  A5, \\field Run Simulation for Weather File Run Periods
      \\note If Yes, RunPeriod:* objects are executed and results from those may be displayed..
      \\type choice
      \\key Yes
      \\key No
      \\default Yes
  A6, \\field Do HVAC Sizing Simulation for Sizing Periods
      \\note If Yes, SizingPeriod:* objects are executed additional times for advanced sizing.
      \\note Currently limited to use with coincident plant sizing, see Sizing:Plant object
      \\type choice
      \\key Yes
      \\key No
      \\default No
  N1; \\field Maximum Number of HVAC Sizing Simulation Passes
      \\note the entire set of SizingPeriod:* objects may be repeated to fine tune size results
      \\note this input sets a limit on the number of passes that the sizing algorithms can repeat the set
      \\type integer
      \\minimum 1
      \\default 1

PerformancePrecisionTradeoffs,
      \\unique-object
      \\memo This object enables users to choose certain options that speed up EnergyPlus simulation,
      \\memo but may lead to small decreases in accuracy of results.
  A1, \\field Use Coil Direct Solutions
      \\note If Yes, an analytical or empirical solution will be used to replace iterations in
      \\note the coil performance calculations.
      \\type choice
      \\key Yes
      \\key No
      \\default No
  A2, \\field Zone Radiant Exchange Algorithm
      \\note Determines which algorithm will be used to solve long wave radiant exchange among surfaces within a zone.
      \\type choice
      \\key ScriptF
      \\key CarrollMRT
      \\default ScriptF
  A3, \\field Override Mode
      \\note The increasing mode number roughly correspond with increased speed. A description of each mode
      \\note are shown in the documentation. When Advanced is selected the N1 field value is used.
      \\type choice
      \\key Normal
      \\key Mode01
      \\key Mode02
      \\key Mode03
      \\key Mode04
      \\key Mode05
      \\key Mode06
      \\key Mode07
      \\key Mode08
      \\key Advanced
      \\default Normal
  N1, \\field MaxZoneTempDiff
      \\note Maximum zone temperature change before HVAC timestep is shortened.
      \\note Only used when Override Mode is set to Advanced
      \\type real
      \\minimum 0.1
      \\maximum 3.0
      \\default 0.3
  N2, \\field MaxAllowedDelTemp
      \\note Maximum surface temperature change before HVAC timestep is shortened.
      \\note Only used when Override Mode is set to Advanced
      \\type real
      \\minimum 0.002
      \\maximum 0.1
      \\default 0.002
  A4; \\field Use Representative Surfaces for Calculations
      \\note Automatically group surfaces with similar characteristics and perform relevant calculations only once for each group.
      \\type choice
      \\key Yes
      \\key No
      \\default No

Building,
       \\memo Describes parameters that are used during the simulation
       \\memo of the building. There are necessary correlations between the entries for
       \\memo this object and some entries in the Site:WeatherStation and
       \\memo Site:HeightVariation objects, specifically the Terrain field.
       \\unique-object
       \\required-object
       \\min-fields 8
  A1 , \\field Name
       \\retaincase
       \\default NONE
  N1 , \\field North Axis
       \\note degrees from true North
       \\units deg
       \\type real
       \\default 0.0
  A2 , \\field Terrain
       \\note  Country=FlatOpenCountry | Suburbs=CountryTownsSuburbs | City=CityCenter | Ocean=body of water (5km) | Urban=Urban-Industrial-Forest
       \\type choice
       \\key Country
       \\key Suburbs
       \\key City
       \\key Ocean
       \\key Urban
       \\default Suburbs
  N2 , \\field Loads Convergence Tolerance Value
       \\note Loads Convergence Tolerance Value is a change in load from one warmup day to the next
       \\type real
       \\minimum> 0.0
       \\maximum .5
       \\default .04
       \\units W
  N3 , \\field Temperature Convergence Tolerance Value
       \\units deltaC
       \\type real
       \\minimum> 0.0
       \\maximum .5
       \\default .4
  A3 , \\field Solar Distribution
       \\note  MinimalShadowing | FullExterior | FullInteriorAndExterior | FullExteriorWithReflections | FullInteriorAndExteriorWithReflections
       \\type choice
       \\key MinimalShadowing
       \\key FullExterior
       \\key FullInteriorAndExterior
       \\key FullExteriorWithReflections
       \\key FullInteriorAndExteriorWithReflections
       \\default FullExterior
  N4 , \\field Maximum Number of Warmup Days
       \\note EnergyPlus will only use as many warmup days as needed to reach convergence tolerance.
       \\note This field's value should NOT be set less than 25.
       \\type integer
       \\minimum> 0
       \\default 25
  N5 ; \\field Minimum Number of Warmup Days
       \\note The minimum number of warmup days that produce enough temperature and flux history
       \\note to start EnergyPlus simulation for all reference buildings was suggested to be 6.
       \\note However this can lead to excessive run times as warmup days can be repeated needlessly.
       \\note For faster execution rely on the convergence criteria to detect when warmup is complete.
       \\note When this field is greater than the maximum warmup days defined previous field
       \\note the maximum number of warmup days will be reset to the minimum value entered here.
       \\note Warmup days will be set to be the value you entered. The default is 1.
       \\type integer
       \\minimum> 0
       \\default 1
`;


const exampleJSON: string = "";
