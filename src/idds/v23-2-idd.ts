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
`;