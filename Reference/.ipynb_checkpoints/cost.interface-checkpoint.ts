
export interface AipmCostResultTable {
    id: number;
    plan_ID: number;
    state: string,
    business_area: number;
    project_Type: string;
    scope: number;
    varName: string;
    confidence_Level_1: number;
    confidence_Level_5: number;
    confidence_Level_10: number;
    confidence_Level_25: number;
    confidence_Level_50: number;
    confidence_Level_75: number;
    confidence_Level_90: number;
    confidence_Level_95: number;
    confidence_Level_99: number;
    user_Input: number;
    user_Input_new: number;
}

export interface AipmCostResultTableUpdate {
    id: number;
    userInput: number;
}

/* GENCODE:MARKER:1:START */

//===============================================================
// TEMPLATE START: cost.interface.ts.1.1.tpl
//===============================================================
export function hdrDefSceEvalRiskAssesFinalResultSimulGridHdr()
{
    return [
 {displayName: "Project Type", columnName: "UDProjectType", columnTypeId: 1, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Voltage", columnName: "UDVoltagekV", columnTypeId: 1, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "State Code", columnName: "UDCFG_GeoStateCode", columnTypeId: 1, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Business Area Code", columnName: "UDCFG_BusinessAreaCode", columnTypeId: 1, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: false, toolTip: "" },
 {displayName: "Plan ID", columnName: "scenarioid", columnTypeId: 1, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: false, toolTip: "" },
 {displayName: "Business Area", columnName: "UDCFG_BusinessAreaName", columnTypeId: 1, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "State", columnName: "UDCFG_GeoStateName", columnTypeId: 1, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 1 Budget", columnName: "Scope1Budget", columnTypeId: 1, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 1 Budget (adj)", columnName: "ADJ_Scope1Budget", columnTypeId: 1, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 2_Budget", columnName: "Scope2Budget", columnTypeId: 1, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 2 Budget (adj)", columnName: "ADJ_Scope2Budget", columnTypeId: 1, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 3 Budget", columnName: "Scope3Budget", columnTypeId: 1, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 3 Budget (adj)", columnName: "ADJ_Scope3Budget", columnTypeId: 1, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 4 Budget", columnName: "Scope4Budget", columnTypeId: 1, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 4 Budget (adj)", columnName: "ADJ_Scope4Budget", columnTypeId: 1, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
    ];
}
//===============================================================
// TEMPLATE END: cost.interface.ts.1.1.tpl
//===============================================================

/* GENCODE:MARKER:1:END */

export const AIPM_COST_RESULT_TABLE_COLUMNS_BUDGET = [
    {
        title: "State",
        columnWidth: "20px",
        fixLeft: true,
        sortFn: ((a: AipmCostResultTable, b: AipmCostResultTable) => a?.state?.toLowerCase()?.localeCompare(b?.state?.toLowerCase()))
    },
    {
        title: "Business Area",
        columnWidth: "30px",
        fixLeft: true,
        sortFn: ((a: AipmCostResultTable, b: AipmCostResultTable) => a?.business_area - b?.business_area)
    },
    {
        title: "Project Type",
        columnWidth: "25px",
        fixLeft: true,
        sortFn: ((a: AipmCostResultTable, b: AipmCostResultTable) => a?.project_Type?.toLowerCase()?.localeCompare(b?.project_Type?.toLowerCase()))
    },
    {
        title: "Voltage",
        columnWidth: "25px",
        fixLeft: true,
        sortFn: ((a: AipmCostResultTable, b: AipmCostResultTable) => a?.project_Type?.toLowerCase()?.localeCompare(b?.project_Type?.toLowerCase()))
    },
    {
        title: "Scope",
        columnWidth: "20px",
        fixLeft: true,
        sortFn: ((a: AipmCostResultTable, b: AipmCostResultTable) => a?.scope - b?.scope)
    },
    // {
    //     title: "Var Name",
    //     sortFn: ((a: AipmCostResultTable, b: AipmCostResultTable) => a?.varName?.toLowerCase()?.localeCompare(b?.varName?.toLowerCase()))
    // }, 
    {
        title: "C.L 1 (%)",
        columnWidth: "25px",
        sortFn: ((a: AipmCostResultTable, b: AipmCostResultTable) => a?.confidence_Level_1 - b?.confidence_Level_1)
    },
    {
        title: "C.L 5 (%)",
        columnWidth: "25px",
        sortFn: ((a: AipmCostResultTable, b: AipmCostResultTable) => a?.confidence_Level_5 - b?.confidence_Level_5)
    },
    {
        title: "C.L 10 (%)",
        columnWidth: "25px",
        sortFn: ((a: AipmCostResultTable, b: AipmCostResultTable) => a?.confidence_Level_10 - b?.confidence_Level_10)
    },
    {
        title: "C.L 25 (%)",
        columnWidth: "25px",
        sortFn: ((a: AipmCostResultTable, b: AipmCostResultTable) => a?.confidence_Level_25 - b?.confidence_Level_25)
    },
    {
        title: "C.L 50 (%)",
        columnWidth: "25px",
        sortFn: ((a: AipmCostResultTable, b: AipmCostResultTable) => a?.confidence_Level_50 - b?.confidence_Level_50)
    },
    {
        title: "C.L 75 (%)",
        columnWidth: "25px",
        sortFn: ((a: AipmCostResultTable, b: AipmCostResultTable) => a?.confidence_Level_75 - b?.confidence_Level_75)
    },
    {
        title: "C.L 90 (%)",
        columnWidth: "25px",
        sortFn: ((a: AipmCostResultTable, b: AipmCostResultTable) => a?.confidence_Level_90 - b?.confidence_Level_90)
    },
    {
        title: "C.L 95 (%)",
        columnWidth: "25px",
        sortFn: ((a: AipmCostResultTable, b: AipmCostResultTable) => a?.confidence_Level_95 - b?.confidence_Level_95)
    },
    {
        title: "C.L 99 (%)",
        columnWidth: "25px",
        sortFn: ((a: AipmCostResultTable, b: AipmCostResultTable) => a?.confidence_Level_99 - b?.confidence_Level_99)
    },
    {
        title: "Budget Adjustment (%)",
        columnWidth: "35px",
        fixRight: true,
        sortFn: ((a: AipmCostResultTable, b: AipmCostResultTable) => a?.user_Input - b?.user_Input)
    }
]



export const AIPM_COST_RESULT_TABLE_COLUMNS_DURATION = [
  {
      title: "State",
      columnWidth: "20px",
      fixLeft: true,
      sortFn: ((a: AipmCostResultTable, b: AipmCostResultTable) => a?.state?.toLowerCase()?.localeCompare(b?.state?.toLowerCase()))
  },
  {
      title: "Business Area",
      columnWidth: "30px",
      fixLeft: true,
      sortFn: ((a: AipmCostResultTable, b: AipmCostResultTable) => a?.business_area - b?.business_area)
  },
  {
      title: "Project Type",
      columnWidth: "25px",
      fixLeft: true,
      sortFn: ((a: AipmCostResultTable, b: AipmCostResultTable) => a?.project_Type?.toLowerCase()?.localeCompare(b?.project_Type?.toLowerCase()))
  },
  {
      title: "Voltage",
      columnWidth: "25px",
      fixLeft: true,
      sortFn: ((a: AipmCostResultTable, b: AipmCostResultTable) => a?.project_Type?.toLowerCase()?.localeCompare(b?.project_Type?.toLowerCase()))
  },
  {
      title: "Scope",
      columnWidth: "20px",
      fixLeft: true,
      sortFn: ((a: AipmCostResultTable, b: AipmCostResultTable) => a?.scope - b?.scope)
  },
  // {
  //     title: "Var Name",
  //     sortFn: ((a: AipmCostResultTable, b: AipmCostResultTable) => a?.varName?.toLowerCase()?.localeCompare(b?.varName?.toLowerCase()))
  // }, 
  {
      title: "C.L 1 (Mths)",
      columnWidth: "25px",
      sortFn: ((a: AipmCostResultTable, b: AipmCostResultTable) => a?.confidence_Level_1 - b?.confidence_Level_1)
  },
  {
      title: "C.L 5 (Mths)",
      columnWidth: "25px",
      sortFn: ((a: AipmCostResultTable, b: AipmCostResultTable) => a?.confidence_Level_5 - b?.confidence_Level_5)
  },
  {
      title: "C.L 10 (Mths)",
      columnWidth: "25px",
      sortFn: ((a: AipmCostResultTable, b: AipmCostResultTable) => a?.confidence_Level_10 - b?.confidence_Level_10)
  },
  {
      title: "C.L 25 (Mths)",
      columnWidth: "25px",
      sortFn: ((a: AipmCostResultTable, b: AipmCostResultTable) => a?.confidence_Level_25 - b?.confidence_Level_25)
  },
  {
      title: "C.L 50 (Mths)",
      columnWidth: "25px",
      sortFn: ((a: AipmCostResultTable, b: AipmCostResultTable) => a?.confidence_Level_50 - b?.confidence_Level_50)
  },
  {
      title: "C.L 75 (Mths)",
      columnWidth: "25px",
      sortFn: ((a: AipmCostResultTable, b: AipmCostResultTable) => a?.confidence_Level_75 - b?.confidence_Level_75)
  },
  {
      title: "C.L 90 (Mths)",
      columnWidth: "25px",
      sortFn: ((a: AipmCostResultTable, b: AipmCostResultTable) => a?.confidence_Level_90 - b?.confidence_Level_90)
  },
  {
      title: "C.L 95 (Mths)",
      columnWidth: "25px",
      sortFn: ((a: AipmCostResultTable, b: AipmCostResultTable) => a?.confidence_Level_95 - b?.confidence_Level_95)
  },
  {
      title: "C.L 99 (Mths)",
      columnWidth: "25px",
      sortFn: ((a: AipmCostResultTable, b: AipmCostResultTable) => a?.confidence_Level_99 - b?.confidence_Level_99)
  },
  {
      title: "Schedule Adjustment",
      columnWidth: "25px",
      fixRight: true,
      sortFn: ((a: AipmCostResultTable, b: AipmCostResultTable) => a?.user_Input - b?.user_Input)
  }
]



export const AIPM_HISTOGRAM_PROJECTS_TABLE_COLUMNS = [
    {
      title: "Project Definition",
      isSortable: true,
      display: true
    },
    {
      title: "Project Description",
      display: true
    },
    {
      title: "State",
      display: true
    },
    {
      title: "Business Area",
      display: true
    },
    {
      title: "Project Type",
      display: true
    },
    {
      title: "Voltage",
      display: true
    },
    // {
    //   title: "Total Budget",
    //   display: true
    // },
    {
      title: "Planned Budget (RM)",
      display: true
    },
    {
      title: "Actual Cost (RM)",
      display: true
    },
    {
      title: "Budget Variance",
      display: true
    },
    {
      title: "Budget Variance (%)",
      display: true
    },
    {
      title: "Planned Date",
      display: true
    },
    {
      title: "Actual Date",
      display: true
    },
    {
      title: "Schedule Variance (Months)",
      display: true
    },
    {
      title: "Total Project Score",
      display: true
    },
  ]