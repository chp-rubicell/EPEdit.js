export const iddString = String.raw`!      VA
!      W/m2, deg C or cd/m2
!      W/m2, W or deg C
!      W/s
!      W/W
!      years
! **************************************************************************

\group Simulation Parameters

Version,
      \memo Specifies the EnergyPlus version of the IDF file.
      \unique-object
      \format singleLine
  A1 ; \field Version Identifier
      \default 23.2

SimulationControl,
      \unique-object
      \memo Note that the following 3 fields are related to the Sizing:Zone, Sizing:System,
      \memo and Sizing:Plant objects. Having these fields set to Yes but no corresponding
      \memo Sizing object will not cause the sizing to be done. However, having any of these
      \memo fields set to No, the corresponding Sizing object is ignored.
      \memo Note also, if you want to do system sizing, you must also do zone sizing in the same
      \memo run or an error will result.
      \min-fields 7
  A1, \field Do Zone Sizing Calculation
      \note If Yes, Zone sizing is accomplished from corresponding Sizing:Zone objects
      \note and autosize fields.
      \type choice
      \key Yes
      \key No
      \default No
  A2, \field Do System Sizing Calculation
      \note If Yes, System sizing is accomplished from corresponding Sizing:System objects
      \note and autosize fields.
      \note If Yes, Zone sizing (previous field) must also be Yes.
      \type choice
      \key Yes
      \key No
      \default No
  A3, \field Do Plant Sizing Calculation
      \note If Yes, Plant sizing is accomplished from corresponding Sizing:Plant objects
      \note and autosize fields.
      \type choice
      \key Yes
      \key No
      \default No
  A4, \field Run Simulation for Sizing Periods
      \note If Yes, SizingPeriod:* objects are executed and results from those may be displayed..
      \type choice
      \key Yes
      \key No
      \default Yes
  A5, \field Run Simulation for Weather File Run Periods
      \note If Yes, RunPeriod:* objects are executed and results from those may be displayed..
      \type choice
      \key Yes
      \key No
      \default Yes
  A6, \field Do HVAC Sizing Simulation for Sizing Periods
      \note If Yes, SizingPeriod:* objects are executed additional times for advanced sizing.
      \note Currently limited to use with coincident plant sizing, see Sizing:Plant object
      \type choice
      \key Yes
      \key No
      \default No
  N1; \field Maximum Number of HVAC Sizing Simulation Passes
      \note the entire set of SizingPeriod:* objects may be repeated to fine tune size results
      \note this input sets a limit on the number of passes that the sizing algorithms can repeat the set
      \type integer
      \minimum 1
      \default 1
      
ShadowCalculation,
       \unique-object
       \memo This object is used to control details of the solar, shading, and daylighting models
       \extensible:1
  A1 , \field Shading Calculation Method
       \note Select between CPU-based polygon clipping method, the GPU-based pixel counting method,
       \note or importing from external shading data.
       \note If PixelCounting is selected and GPU hardware (or GPU emulation) is not available, a warning will be
       \note displayed and EnergyPlus will revert to PolygonClipping.
       \note If Scheduled is chosen, the Sunlit Fraction Schedule Name is required
       \note in SurfaceProperty:LocalEnvironment.
       \note If Imported is chosen, the Schedule:File:Shading object is required.
       \type choice
       \key PolygonClipping
       \key PixelCounting
       \key Scheduled
       \key Imported
       \default PolygonClipping
  A2 , \field Shading Calculation Update Frequency Method
       \note choose calculation frequency method. note that Timestep is only needed for certain cases
       \note and can increase execution time significantly.
       \type choice
       \key Periodic
       \key Timestep
       \default Periodic
  N1 , \field Shading Calculation Update Frequency
       \type integer
       \minimum 1
       \default 20
       \note enter number of days
       \note this field is only used if the previous field is set to Periodic
       \note warning issued if >31
  N2 , \field Maximum Figures in Shadow Overlap Calculations
       \note Number of allowable figures in shadow overlap in PolygonClipping calculations
       \type integer
       \minimum 200
       \default 15000
  A3 , \field Polygon Clipping Algorithm
       \note Advanced Feature. Internal default is SutherlandHodgman
       \note Refer to InputOutput Reference and Engineering Reference for more information
       \type choice
       \key ConvexWeilerAtherton
       \key SutherlandHodgman
       \key SlaterBarskyandSutherlandHodgman
       \default SutherlandHodgman
  N3 , \field Pixel Counting Resolution
       \note Number of pixels in both dimensions of the surface rendering
       \type integer
       \default 512
  A4 , \field Sky Diffuse Modeling Algorithm
       \note Advanced Feature. Internal default is SimpleSkyDiffuseModeling
       \note If you have shading elements that change transmittance over the
       \note year, you may wish to choose the detailed method.
       \note Refer to InputOutput Reference and Engineering Reference for more information
       \type choice
       \key SimpleSkyDiffuseModeling
       \key DetailedSkyDiffuseModeling
       \default SimpleSkyDiffuseModeling
  A5 , \field Output External Shading Calculation Results
       \type choice
       \key Yes
       \key No
       \default No
       \note If Yes is chosen, the calculated external shading fraction results will be saved to an external CSV file with surface names as the column headers.
  A6 , \field Disable Self-Shading Within Shading Zone Groups
       \note If Yes, self-shading will be disabled from all exterior surfaces in a given Shading Zone Group to surfaces within
       \note the same Shading Zone Group.
       \note If both Disable Self-Shading Within Shading Zone Groups and Disable Self-Shading From Shading Zone Groups to Other Zones = Yes,
       \note then all self-shading from exterior surfaces will be disabled.
       \note If only one of these fields = Yes, then at least one Shading Zone Group must be specified, or this field will be ignored.
       \note Shading from Shading:* surfaces, overhangs, fins, and reveals will not be disabled.
       \type choice
       \key Yes
       \key No
       \default No
  A7 , \field Disable Self-Shading From Shading Zone Groups to Other Zones
       \note If Yes, self-shading will be disabled from all exterior surfaces in a given Shading Zone Group to all other zones in the model.
       \note If both Disable Self-Shading Within Shading Zone Groups and Disable Self-Shading From Shading Zone Groups to Other Zones = Yes,
       \note then all self-shading from exterior surfaces will be disabled.
       \note If only one of these fields = Yes, then at least one Shading Zone Group must be specified, or this field will be ignored.
       \note Shading from Shading:* surfaces, overhangs, fins, and reveals will not be disabled.
       \type choice
       \key Yes
       \key No
       \default No
  A8 , \field Shading Zone Group 1 ZoneList Name
       \note Specifies a group of zones which are controlled by the Disable Self-Shading fields.
       \type object-list
       \object-list ZoneListNames
       \begin-extensible
  A9 , \field Shading Zone Group 2 ZoneList Name
       \type object-list
       \object-list ZoneListNames
  A10, \field Shading Zone Group 3 ZoneList Name
       \type object-list
       \object-list ZoneListNames
  A11, \field Shading Zone Group 4 ZoneList Name
       \type object-list
       \object-list ZoneListNames
  A12, \field Shading Zone Group 5 ZoneList Name
       \type object-list
       \object-list ZoneListNames
  A13; \field Shading Zone Group 6 ZoneList Name
       \type object-list
       \object-list ZoneListNames
Building,
       \memo Describes parameters that are used during the simulation
       \memo of the building. There are necessary correlations between the entries for
       \memo this object and some entries in the Site:WeatherStation and
       \memo Site:HeightVariation objects, specifically the Terrain field.
       \unique-object
       \required-object
       \min-fields 8
  A1 , \field Name
       \retaincase
       \default NONE
  N1 , \field North Axis
       \note degrees from true North
       \units deg
       \type real
       \default 0.0
  A2 , \field Terrain
       \note  Country=FlatOpenCountry | Suburbs=CountryTownsSuburbs | City=CityCenter | Ocean=body of water (5km) | Urban=Urban-Industrial-Forest
       \type choice
       \key Country
       \key Suburbs
       \key City
       \key Ocean
       \key Urban
       \default Suburbs
  N2 , \field Loads Convergence Tolerance Value
       \note Loads Convergence Tolerance Value is a change in load from one warmup day to the next
       \type real
       \minimum> 0.0
       \maximum .5
       \default .04
       \units W
  N3 , \field Temperature Convergence Tolerance Value
       \units deltaC
       \type real
       \minimum> 0.0
       \maximum .5
       \default .4
  A3 , \field Solar Distribution
       \note  MinimalShadowing | FullExterior | FullInteriorAndExterior | FullExteriorWithReflections | FullInteriorAndExteriorWithReflections
       \type choice
       \key MinimalShadowing
       \key FullExterior
       \key FullInteriorAndExterior
       \key FullExteriorWithReflections
       \key FullInteriorAndExteriorWithReflections
       \default FullExterior
  N4 , \field Maximum Number of Warmup Days
       \note EnergyPlus will only use as many warmup days as needed to reach convergence tolerance.
       \note This field's value should NOT be set less than 25.
       \type integer
       \minimum> 0
       \default 25
  N5 ; \field Minimum Number of Warmup Days
       \note The minimum number of warmup days that produce enough temperature and flux history
       \note to start EnergyPlus simulation for all reference buildings was suggested to be 6.
       \note However this can lead to excessive run times as warmup days can be repeated needlessly.
       \note For faster execution rely on the convergence criteria to detect when warmup is complete.
       \note When this field is greater than the maximum warmup days defined previous field
       \note the maximum number of warmup days will be reset to the minimum value entered here.
       \note Warmup days will be set to be the value you entered. The default is 1.
       \type integer
       \minimum> 0
       \default 1

BuildingSurface:Detailed,
  \memo Allows for detailed entry of building heat transfer surfaces. Does not include subsurfaces such as windows or doors.
  \extensible:3 -- duplicate last set of x,y,z coordinates (last 3 fields), remembering to remove ; from "inner" fields.
  \format vertices
  \min-fields 20
  A1 , \field Name
       \required-field
       \type alpha
       \reference SurfaceNames
       \reference SurfAndSubSurfNames
       \reference AllHeatTranSurfNames
       \reference OutFaceEnvNames
       \reference AllHeatTranAngFacNames
       \reference RadiantSurfaceNames
       \reference AllShadingAndHTSurfNames
       \reference FloorSurfaceNames
  A2 , \field Surface Type
       \required-field
       \type choice
       \key Floor
       \key Wall
       \key Ceiling
       \key Roof
  A3 , \field Construction Name
       \required-field
       \note To be matched with a construction in this input file
       \type object-list
       \object-list ConstructionNames
  A4 , \field Zone Name
       \required-field
       \note Zone the surface is a part of.
       \type object-list
       \object-list ZoneNames
  A5 , \field Space Name
       \note Space the surface is a part of (optional, see description of Space object for more details).
       \type object-list
       \object-list SpaceNames
  A6 , \field Outside Boundary Condition
       \required-field
       \type choice
       \key Adiabatic
       \key Surface
       \key Zone
       \key Outdoors
       \key Foundation
       \key Ground
       \key GroundFCfactorMethod
       \key OtherSideCoefficients
       \key OtherSideConditionsModel
       \key GroundSlabPreprocessorAverage
       \key GroundSlabPreprocessorCore
       \key GroundSlabPreprocessorPerimeter
       \key GroundBasementPreprocessorAverageWall
       \key GroundBasementPreprocessorAverageFloor
       \key GroundBasementPreprocessorUpperWall
       \key GroundBasementPreprocessorLowerWall
  A7,  \field Outside Boundary Condition Object
       \type object-list
       \object-list OutFaceEnvNames
       \note Non-blank only if the field Outside Boundary Condition is Surface,
       \note Zone, OtherSideCoefficients or OtherSideConditionsModel
       \note If Surface, specify name of corresponding surface in adjacent zone or
       \note specify current surface name for internal partition separating like zones
       \note If Zone, specify the name of the corresponding zone and
       \note the program will generate the corresponding interzone surface
       \note If Foundation, specify the name of the corresponding Foundation object and
       \note the program will calculate the heat transfer appropriately
       \note If OtherSideCoefficients, specify name of SurfaceProperty:OtherSideCoefficients
       \note If OtherSideConditionsModel, specify name of SurfaceProperty:OtherSideConditionsModel
  A8 , \field Sun Exposure
       \type choice
       \key SunExposed
       \key NoSun
       \default SunExposed
  A9,  \field Wind Exposure
       \type choice
       \key WindExposed
       \key NoWind
       \default WindExposed
  N1,  \field View Factor to Ground
       \type real
       \note From the exterior of the surface
       \note Unused if one uses the "reflections" options in Solar Distribution in Building input
       \note unless a DaylightingDevice:Shelf or DaylightingDevice:Tubular object has been specified.
       \note autocalculate will automatically calculate this value from the tilt of the surface
       \autocalculatable
       \minimum 0.0
       \maximum 1.0
       \default autocalculate
  N2 , \field Number of Vertices
       \note shown with 120 vertex coordinates -- extensible object
       \note  "extensible" -- duplicate last set of x,y,z coordinates (last 3 fields),
       \note remembering to remove ; from "inner" fields.
       \note for clarity in any error messages, renumber the fields as well.
       \note (and changing z terminator to a comma "," for all but last one which needs a semi-colon ";")
       \autocalculatable
       \minimum 3
       \default autocalculate
       \note vertices are given in GlobalGeometryRules coordinates -- if relative, all surface coordinates
       \note are "relative" to the Zone Origin. If world, then building and zone origins are used
       \note for some internal calculations, but all coordinates are given in an "absolute" system.
  N3,  \field Vertex 1 X-coordinate
       \begin-extensible
       \required-field
       \units m
       \type real
  N4 , \field Vertex 1 Y-coordinate
       \required-field
       \units m
       \type real
  N5 , \field Vertex 1 Z-coordinate
       \required-field
       \units m
       \type real
  N6,  \field Vertex 2 X-coordinate
       \required-field
       \units m
       \type real
  N7,  \field Vertex 2 Y-coordinate
       \required-field
       \units m
       \type real
  N8,  \field Vertex 2 Z-coordinate
       \required-field
       \units m
       \type real
  N9,  \field Vertex 3 X-coordinate
       \required-field
       \units m
       \type real
  N10, \field Vertex 3 Y-coordinate
       \required-field
       \units m
       \type real
  N11, \field Vertex 3 Z-coordinate
       \required-field
       \units m
       \type real
  N12, \field Vertex 4 X-coordinate
       \units m
       \type real
  N13, \field Vertex 4 Y-coordinate
       \type real
       \units m
  N14, \field Vertex 4 Z-coordinate
       \units m
       \type real
  N15, \field Vertex 5 X-coordinate
       \units m
       \type real
  N16, \field Vertex 5 Y-coordinate
       \type real
       \units m
  N17, \field Vertex 5 Z-coordinate
       \units m
       \type real
  N18, \field Vertex 6 X-coordinate
       \units m
       \type real
  N19, \field Vertex 6 Y-coordinate
       \type real
       \units m
  N20, \field Vertex 6 Z-coordinate
       \units m
       \type real
  N21, \field Vertex 7 X-coordinate
       \units m
       \type real
  N22, \field Vertex 7 Y-coordinate
       \type real
       \units m
  N23, \field Vertex 7 Z-coordinate
       \units m
       \type real
  N24, \field Vertex 8 X-coordinate
       \units m
       \type real
  N25, \field Vertex 8 Y-coordinate
       \type real
       \units m
  N26, \field Vertex 8 Z-coordinate
       \units m
       \type real
  N27, \field Vertex 9 X-coordinate
       \units m
       \type real
  N28, \field Vertex 9 Y-coordinate
       \type real
       \units m
  N29, \field Vertex 9 Z-coordinate
       \units m
       \type real
  N30, \field Vertex 10 X-coordinate
       \units m
       \type real
  N31, \field Vertex 10 Y-coordinate
       \type real
       \units m
  N32, \field Vertex 10 Z-coordinate
       \units m
       \type real
  N33, \field Vertex 11 X-coordinate
       \units m
       \type real
  N34, \field Vertex 11 Y-coordinate
       \type real
       \units m
  N35, \field Vertex 11 Z-coordinate
       \units m
       \type real
  N36, \field Vertex 12 X-coordinate
       \units m
       \type real
  N37, \field Vertex 12 Y-coordinate
       \type real
       \units m
  N38, \field Vertex 12 Z-coordinate
       \units m
       \type real
  N39, \field Vertex 13 X-coordinate
       \units m
       \type real
  N40, \field Vertex 13 Y-coordinate
       \type real
       \units m
  N41, \field Vertex 13 Z-coordinate
       \units m
       \type real
  N42, \field Vertex 14 X-coordinate
       \units m
       \type real
  N43, \field Vertex 14 Y-coordinate
       \type real
       \units m
  N44, \field Vertex 14 Z-coordinate
       \units m
       \type real
  N45, \field Vertex 15 X-coordinate
       \units m
       \type real
  N46, \field Vertex 15 Y-coordinate
       \type real
       \units m
  N47, \field Vertex 15 Z-coordinate
       \units m
       \type real
  N48, \field Vertex 16 X-coordinate
       \units m
       \type real
  N49, \field Vertex 16 Y-coordinate
       \type real
       \units m
  N50, \field Vertex 16 Z-coordinate
       \units m
       \type real
  N51, \field Vertex 17 X-coordinate
       \units m
       \type real
  N52, \field Vertex 17 Y-coordinate
       \type real
       \units m
  N53, \field Vertex 17 Z-coordinate
       \units m
       \type real
  N54, \field Vertex 18 X-coordinate
       \units m
       \type real
  N55, \field Vertex 18 Y-coordinate
       \type real
       \units m
  N56, \field Vertex 18 Z-coordinate
       \units m
       \type real
  N57, \field Vertex 19 X-coordinate
       \units m
       \type real
  N58, \field Vertex 19 Y-coordinate
       \type real
       \units m
  N59, \field Vertex 19 Z-coordinate
       \units m
       \type real
  N60, \field Vertex 20 X-coordinate
       \units m
       \type real
  N61, \field Vertex 20 Y-coordinate
       \type real
       \units m
  N62, \field Vertex 20 Z-coordinate
       \units m
       \type real
  N63, \field Vertex 21 X-coordinate
       \units m
       \type real
  N64, \field Vertex 21 Y-coordinate
       \type real
       \units m
  N65, \field Vertex 21 Z-coordinate
       \units m
       \type real
  N66, \field Vertex 22 X-coordinate
       \units m
       \type real
  N67, \field Vertex 22 Y-coordinate
       \type real
       \units m
  N68, \field Vertex 22 Z-coordinate
       \units m
       \type real
  N69, \field Vertex 23 X-coordinate
       \units m
       \type real
  N70, \field Vertex 23 Y-coordinate
       \type real
       \units m
  N71, \field Vertex 23 Z-coordinate
       \units m
       \type real
  N72, \field Vertex 24 X-coordinate
       \units m
       \type real
  N73, \field Vertex 24 Y-coordinate
       \type real
       \units m
  N74, \field Vertex 24 Z-coordinate
       \units m
       \type real
  N75, \field Vertex 25 X-coordinate
       \units m
       \type real
  N76, \field Vertex 25 Y-coordinate
       \type real
       \units m
  N77, \field Vertex 25 Z-coordinate
       \units m
       \type real
  N78, \field Vertex 26 X-coordinate
       \units m
       \type real
  N79, \field Vertex 26 Y-coordinate
       \type real
       \units m
  N80, \field Vertex 26 Z-coordinate
       \units m
       \type real
  N81, \field Vertex 27 X-coordinate
       \units m
       \type real
  N82, \field Vertex 27 Y-coordinate
       \type real
       \units m
  N83, \field Vertex 27 Z-coordinate
       \units m
       \type real
  N84, \field Vertex 28 X-coordinate
       \units m
       \type real
  N85, \field Vertex 28 Y-coordinate
       \type real
       \units m
  N86, \field Vertex 28 Z-coordinate
       \units m
       \type real
  N87, \field Vertex 29 X-coordinate
       \units m
       \type real
  N88, \field Vertex 29 Y-coordinate
       \type real
       \units m
  N89, \field Vertex 29 Z-coordinate
       \units m
       \type real
  N90, \field Vertex 30 X-coordinate
       \units m
       \type real
  N91, \field Vertex 30 Y-coordinate
       \type real
       \units m
  N92, \field Vertex 30 Z-coordinate
       \units m
       \type real
  N93, \field Vertex 31 X-coordinate
       \units m
       \type real
  N94, \field Vertex 31 Y-coordinate
       \units m
       \type real
  N95, \field Vertex 31 Z-coordinate
       \units m
       \type real
  N96, \field Vertex 32 X-coordinate
       \units m
       \type real
  N97, \field Vertex 32 Y-coordinate
       \units m
       \type real
  N98, \field Vertex 32 Z-coordinate
       \units m
       \type real
  N99, \field Vertex 33 X-coordinate
       \units m
       \type real
  N100, \field Vertex 33 Y-coordinate
       \units m
       \type real
  N101, \field Vertex 33 Z-coordinate
       \units m
       \type real
  N102, \field Vertex 34 X-coordinate
       \units m
       \type real
  N103, \field Vertex 34 Y-coordinate
       \units m
       \type real
  N104, \field Vertex 34 Z-coordinate
       \units m
       \type real
  N105, \field Vertex 35 X-coordinate
       \units m
       \type real
  N106, \field Vertex 35 Y-coordinate
       \units m
       \type real
  N107, \field Vertex 35 Z-coordinate
       \units m
       \type real
  N108, \field Vertex 36 X-coordinate
       \units m
       \type real
  N109, \field Vertex 36 Y-coordinate
       \units m
       \type real
  N110, \field Vertex 36 Z-coordinate
       \units m
       \type real
  N111, \field Vertex 37 X-coordinate
       \units m
       \type real
  N112, \field Vertex 37 Y-coordinate
       \units m
       \type real
  N113, \field Vertex 37 Z-coordinate
       \units m
       \type real
  N114, \field Vertex 38 X-coordinate
       \units m
       \type real
  N115, \field Vertex 38 Y-coordinate
       \units m
       \type real
  N116, \field Vertex 38 Z-coordinate
       \units m
       \type real
  N117, \field Vertex 39 X-coordinate
       \units m
       \type real
  N118, \field Vertex 39 Y-coordinate
       \units m
       \type real
  N119, \field Vertex 39 Z-coordinate
       \units m
       \type real
  N120, \field Vertex 40 X-coordinate
       \units m
       \type real
  N121, \field Vertex 40 Y-coordinate
       \units m
       \type real
  N122, \field Vertex 40 Z-coordinate
       \units m
       \type real
  N123, \field Vertex 41 X-coordinate
       \units m
       \type real
  N124, \field Vertex 41 Y-coordinate
       \units m
       \type real
  N125, \field Vertex 41 Z-coordinate
       \units m
       \type real
  N126, \field Vertex 42 X-coordinate
       \units m
       \type real
  N127, \field Vertex 42 Y-coordinate
       \units m
       \type real
  N128, \field Vertex 42 Z-coordinate
       \units m
       \type real
  N129, \field Vertex 43 X-coordinate
       \units m
       \type real
  N130, \field Vertex 43 Y-coordinate
       \units m
       \type real
  N131, \field Vertex 43 Z-coordinate
       \units m
       \type real
  N132, \field Vertex 44 X-coordinate
       \units m
       \type real
  N133, \field Vertex 44 Y-coordinate
       \units m
       \type real
  N134, \field Vertex 44 Z-coordinate
       \units m
       \type real
  N135, \field Vertex 45 X-coordinate
       \units m
       \type real
  N136, \field Vertex 45 Y-coordinate
       \units m
       \type real
  N137, \field Vertex 45 Z-coordinate
       \units m
       \type real
  N138, \field Vertex 46 X-coordinate
       \units m
       \type real
  N139, \field Vertex 46 Y-coordinate
       \units m
       \type real
  N140, \field Vertex 46 Z-coordinate
       \units m
       \type real
  N141, \field Vertex 47 X-coordinate
       \units m
       \type real
  N142, \field Vertex 47 Y-coordinate
       \units m
       \type real
  N143, \field Vertex 47 Z-coordinate
       \units m
       \type real
  N144, \field Vertex 48 X-coordinate
       \units m
       \type real
  N145, \field Vertex 48 Y-coordinate
       \units m
       \type real
  N146, \field Vertex 48 Z-coordinate
       \units m
       \type real
  N147, \field Vertex 49 X-coordinate
       \units m
       \type real
  N148, \field Vertex 49 Y-coordinate
       \units m
       \type real
  N149, \field Vertex 49 Z-coordinate
       \units m
       \type real
  N150, \field Vertex 50 X-coordinate
       \units m
       \type real
  N151, \field Vertex 50 Y-coordinate
       \units m
       \type real
  N152, \field Vertex 50 Z-coordinate
       \units m
       \type real
  N153, \field Vertex 51 X-coordinate
       \units m
       \type real
  N154, \field Vertex 51 Y-coordinate
       \units m
       \type real
  N155, \field Vertex 51 Z-coordinate
       \units m
       \type real
  N156, \field Vertex 52 X-coordinate
       \units m
       \type real
  N157, \field Vertex 52 Y-coordinate
       \units m
       \type real
  N158, \field Vertex 52 Z-coordinate
       \units m
       \type real
  N159, \field Vertex 53 X-coordinate
       \units m
       \type real
  N160, \field Vertex 53 Y-coordinate
       \units m
       \type real
  N161, \field Vertex 53 Z-coordinate
       \units m
       \type real
  N162, \field Vertex 54 X-coordinate
       \units m
       \type real
  N163, \field Vertex 54 Y-coordinate
       \units m
       \type real
  N164, \field Vertex 54 Z-coordinate
       \units m
       \type real
  N165, \field Vertex 55 X-coordinate
       \units m
       \type real
  N166, \field Vertex 55 Y-coordinate
       \units m
       \type real
  N167, \field Vertex 55 Z-coordinate
       \units m
       \type real
  N168, \field Vertex 56 X-coordinate
       \units m
       \type real
  N169, \field Vertex 56 Y-coordinate
       \units m
       \type real
  N170, \field Vertex 56 Z-coordinate
       \units m
       \type real
  N171, \field Vertex 57 X-coordinate
       \units m
       \type real
  N172, \field Vertex 57 Y-coordinate
       \units m
       \type real
  N173, \field Vertex 57 Z-coordinate
       \units m
       \type real
  N174, \field Vertex 58 X-coordinate
       \units m
       \type real
  N175, \field Vertex 58 Y-coordinate
       \units m
       \type real
  N176, \field Vertex 58 Z-coordinate
       \units m
       \type real
  N177, \field Vertex 59 X-coordinate
       \units m
       \type real
  N178, \field Vertex 59 Y-coordinate
       \units m
       \type real
  N179, \field Vertex 59 Z-coordinate
       \units m
       \type real
  N180, \field Vertex 60 X-coordinate
       \units m
       \type real
  N181, \field Vertex 60 Y-coordinate
       \units m
       \type real
  N182, \field Vertex 60 Z-coordinate
       \units m
       \type real
  N183, \field Vertex 61 X-coordinate
       \units m
       \type real
  N184, \field Vertex 61 Y-coordinate
       \units m
       \type real
  N185, \field Vertex 61 Z-coordinate
       \units m
       \type real
  N186, \field Vertex 62 X-coordinate
       \units m
       \type real
  N187, \field Vertex 62 Y-coordinate
       \units m
       \type real
  N188, \field Vertex 62 Z-coordinate
       \units m
       \type real
  N189, \field Vertex 63 X-coordinate
       \units m
       \type real
  N190, \field Vertex 63 Y-coordinate
       \units m
       \type real
  N191, \field Vertex 63 Z-coordinate
       \units m
       \type real
  N192, \field Vertex 64 X-coordinate
       \units m
       \type real
  N193, \field Vertex 64 Y-coordinate
       \units m
       \type real
  N194, \field Vertex 64 Z-coordinate
       \units m
       \type real
  N195, \field Vertex 65 X-coordinate
       \units m
       \type real
  N196, \field Vertex 65 Y-coordinate
       \units m
       \type real
  N197, \field Vertex 65 Z-coordinate
       \units m
       \type real
  N198, \field Vertex 66 X-coordinate
       \units m
       \type real
  N199, \field Vertex 66 Y-coordinate
       \units m
       \type real
  N200, \field Vertex 66 Z-coordinate
       \units m
       \type real
  N201, \field Vertex 67 X-coordinate
       \units m
       \type real
  N202, \field Vertex 67 Y-coordinate
       \units m
       \type real
  N203, \field Vertex 67 Z-coordinate
       \units m
       \type real
  N204, \field Vertex 68 X-coordinate
       \units m
       \type real
  N205, \field Vertex 68 Y-coordinate
       \units m
       \type real
  N206, \field Vertex 68 Z-coordinate
       \units m
       \type real
  N207, \field Vertex 69 X-coordinate
       \units m
       \type real
  N208, \field Vertex 69 Y-coordinate
       \units m
       \type real
  N209, \field Vertex 69 Z-coordinate
       \units m
       \type real
  N210, \field Vertex 70 X-coordinate
       \units m
       \type real
  N211, \field Vertex 70 Y-coordinate
       \units m
       \type real
  N212, \field Vertex 70 Z-coordinate
       \units m
       \type real
  N213, \field Vertex 71 X-coordinate
       \units m
       \type real
  N214, \field Vertex 71 Y-coordinate
       \units m
       \type real
  N215, \field Vertex 71 Z-coordinate
       \units m
       \type real
  N216, \field Vertex 72 X-coordinate
       \units m
       \type real
  N217, \field Vertex 72 Y-coordinate
       \units m
       \type real
  N218, \field Vertex 72 Z-coordinate
       \units m
       \type real
  N219, \field Vertex 73 X-coordinate
       \units m
       \type real
  N220, \field Vertex 73 Y-coordinate
       \units m
       \type real
  N221, \field Vertex 73 Z-coordinate
       \units m
       \type real
  N222, \field Vertex 74 X-coordinate
       \units m
       \type real
  N223, \field Vertex 74 Y-coordinate
       \units m
       \type real
  N224, \field Vertex 74 Z-coordinate
       \units m
       \type real
  N225, \field Vertex 75 X-coordinate
       \units m
       \type real
  N226, \field Vertex 75 Y-coordinate
       \units m
       \type real
  N227, \field Vertex 75 Z-coordinate
       \units m
       \type real
  N228, \field Vertex 76 X-coordinate
       \units m
       \type real
  N229, \field Vertex 76 Y-coordinate
       \units m
       \type real
  N230, \field Vertex 76 Z-coordinate
       \units m
       \type real
  N231, \field Vertex 77 X-coordinate
       \units m
       \type real
  N232, \field Vertex 77 Y-coordinate
       \units m
       \type real
  N233, \field Vertex 77 Z-coordinate
       \units m
       \type real
  N234, \field Vertex 78 X-coordinate
       \units m
       \type real
  N235, \field Vertex 78 Y-coordinate
       \units m
       \type real
  N236, \field Vertex 78 Z-coordinate
       \units m
       \type real
  N237, \field Vertex 79 X-coordinate
       \units m
       \type real
  N238, \field Vertex 79 Y-coordinate
       \units m
       \type real
  N239, \field Vertex 79 Z-coordinate
       \units m
       \type real
  N240, \field Vertex 80 X-coordinate
       \units m
       \type real
  N241, \field Vertex 80 Y-coordinate
       \units m
       \type real
  N242, \field Vertex 80 Z-coordinate
       \units m
       \type real
  N243, \field Vertex 81 X-coordinate
       \units m
       \type real
  N244, \field Vertex 81 Y-coordinate
       \units m
       \type real
  N245, \field Vertex 81 Z-coordinate
       \units m
       \type real
  N246, \field Vertex 82 X-coordinate
       \units m
       \type real
  N247, \field Vertex 82 Y-coordinate
       \units m
       \type real
  N248, \field Vertex 82 Z-coordinate
       \units m
       \type real
  N249, \field Vertex 83 X-coordinate
       \units m
       \type real
  N250, \field Vertex 83 Y-coordinate
       \units m
       \type real
  N251, \field Vertex 83 Z-coordinate
       \units m
       \type real
  N252, \field Vertex 84 X-coordinate
       \units m
       \type real
  N253, \field Vertex 84 Y-coordinate
       \units m
       \type real
  N254, \field Vertex 84 Z-coordinate
       \units m
       \type real
  N255, \field Vertex 85 X-coordinate
       \units m
       \type real
  N256, \field Vertex 85 Y-coordinate
       \units m
       \type real
  N257, \field Vertex 85 Z-coordinate
       \units m
       \type real
  N258, \field Vertex 86 X-coordinate
       \units m
       \type real
  N259, \field Vertex 86 Y-coordinate
       \units m
       \type real
  N260, \field Vertex 86 Z-coordinate
       \units m
       \type real
  N261, \field Vertex 87 X-coordinate
       \units m
       \type real
  N262, \field Vertex 87 Y-coordinate
       \units m
       \type real
  N263, \field Vertex 87 Z-coordinate
       \units m
       \type real
  N264, \field Vertex 88 X-coordinate
       \units m
       \type real
  N265, \field Vertex 88 Y-coordinate
       \units m
       \type real
  N266; \field Vertex 88 Z-coordinate
       \units m
       \type real
`;