// export interface IPortfolio {
//   id: number;
//   state: string;
//   senarioName: string;
//   revision: string;
//   submittedDate: string;
//   comments: string;
//   status: string;

import { TableColumnData } from "@model/table.model";
import { ChartDataSets } from "chart.js";

// }
export interface IPortfolio {
  id: number;
  startYear: number;
  scenarioName: string;
  scenarioComments: string;
  createdBy: string;
  createdOnUtc: string;
  updatedBy: string;
  updatedOnUtc: string;
}

export interface IPortfolioConfig {
  scenarioId: number;
  numOfYears: number;
  yearBudget: IPortfolioConfigList[];
  minNPV: number,
  scenarioComments: string;
  createdBy: string;
  createdOnUtc: any;
  updatedBy: string;
  updatedOnUtc: any;
}

export interface IPortfolioConfigList {
  year: number;
  budget: number;
}

export interface IPortfolioApprovedResult {
  plan_ID: number;
  project_ID: number;
  projectDefinition: string;
  udProjectDescription: string;
  udStrategicObjective: string;
  subObjectiveDdl: string;
  udCategory: string;
  udProjectType: string;
  udVoltagekV: string;
  businessAreaName: string;
  stateName: string;
  month_Scope_123: number;
  start_Month_Scope_123: number;
  month_Scope_4: number;
  start_Month_Scope_4: number;
  comm_Month: number;
  target_Comm_Month: number;
  mandatory: number;
  total_Budget: number;
  budY1: number;
  budY2: number;
  budY3: number;
  budY4: number;
  budY5: number;
  budY6: number;
  budY7: number;
  budY8: number;
  project_Score: number;
  risk_Reduced: number;
}

export interface IPortfolioSummaryResult {
  plan_ID: number;
  summary: any;
  totalProject: number;
  budgetBeforeRevised: number;
  totalBudget: number;
  riskReduced: number;
  tcoOpex: number;
  tcoTotalProjectCost: number;
  npvRiskReduced: number;
  projectScore: number;
  budY1: number;
  budY2: number;
  budY3: number;
  budY4: number;
  budY5: number;
  budY6: number;
  budY7: number;
  budY8: number;
}

export interface IPortfolioSummaryCommonResult {
  summary: any;
  totalProject1: number;
  totalProject2: number;
  totalBudgetBeforeRevised1: number;
  totalBudgetBeforeRevised2: number;
  totalBudget1: number;
  totalBudget2: number;
  totalRiskReduced1: number;
  totalRiskReduced2: number;
  opex1: number;
  opex2: number;
  totalProjectCost1: number;
  totalProjectCost2: number;
  npvRiskReduced1: number;
  npvRiskReduced2: number;
  totalProjectScore1: number;
  totalProjectScore2: number;
  totalBUDY11: number;
  totalBUDY12: number;
  totalBUDY21: number;
  totalBUDY22: number;
  totalBUDY31: number;
  totalBUDY32: number;
  totalBUDY41: number;
  totalBUDY42: number;
  totalBUDY51: number;
  totalBUDY52: number;
  totalBUDY61: number;
  totalBUDY62: number;
  totalBUDY71: number;
  totalBUDY72: number;
  totalBUDY81: number;
  totalBUDY82: number;
}

export interface IPortfolioRejectedResult {
  plan_ID: number;
  projectDefinition: string;
  udProjectDescription: string;
  udStrategicObjective: string;
  subObjectiveDdl: string;
  udCategory: string;
  udProjectType: string;
  udVoltagekV: string;
  businessAreaName: string;
  stateName: string;
  project_Score: number;
  risk_Reduced: number;
  total_Budget: number;
}

export interface IPortfolioSupplyResult {
  plan_ID: number;
  projectDefinition: string;
  udProjectDescription: string;
  udStrategicObjective: string;
  subObjectiveDdl: string;
  udCategory: string;
  udProjectType: string;
  udVoltagekV: string;
  businessAreaName: string;
  stateName: string;
  project_Score: number;
  risk_Reduced: number;
  total_Budget: number;
}
export interface IPortfolioImportCandidate {
  id: number;
  projectDefinition: number;
  udProjectDescription: string;
  udStrategicObjective: string;
  subObjectiveDdl: string;
  udCategory: string;
  udProjectType: string;
  udVoltagekV: string;
  businessAreaName: string;
  stateName: string;
  project_Score: number;
  risk_Reduced: number;
  total_Budget: number;
}

export interface IProject{
  project_id?: number;
  project_definition: string;
  project_score: number;
  risk_reduced: number;
  total_budget: number;
}

export interface ISystemProject{
  project_id: number;
  project_definition: string;
  start_month_scope_123: number;
  month_scope_4: number;
  start_month_scope_4: number;
  mandatory: number;
  total_budget: number;
  budy_1: number;
  budy_2: number;
  budy_3: number;
  budy_4: number;
  budy_5: number;
  budy_6: number;
  budy_7: number;
  budy_8: number;
  project_score: number;
  risk_reduced: number;
}

export interface PortfolioResultChartModel {
  projectDefinition: string,
  totalBudget: number,
  totalRiskReduced: number,
  totalProjectScore: number,
  x: number,
  y: number,
  r: number
}

export interface PortfolioResultChartDataset extends ChartDataSets {
  label: string,
  boderWidth: number,
  borderColor: string,
  backgroundColor: string,
  data: number[],
  type: string,
  fill: boolean
}

export interface PortfolioResultChartData {
  datasets: PortfolioResultChartDataset[]
}

export const PROJECT_IMPORT_HEADER : TableColumnData[] = [
  {
    displayName: "Project Definition",
    columnName: "projectDefinition",
    columnTypeId: 1,
    columnType: "Text",
    columnWidth: "90px",
    isSearchable: true,
    isSortable: true,
    display: true,
    order: 1,
    toolTip: "",
    value: "",
  },
  {
    displayName: "Project Description",
    columnName: "udProjectDescription",
    columnTypeId: 1,
    columnType: "Text",
    columnWidth: "250px",
    isSearchable: true,
    isSortable: true,
    display: true,
    order: 2,
    toolTip: "",
    value: "",
  },
  {
    displayName: "Project Category",
    columnName: "udCategory",
    columnTypeId: 2,
    columnType: "Drop Down",
    columnWidth: "90px",
    isSearchable: false,
    isSortable: false,
    display: true,
    order: 3,
    toolTip: "",
    filterValue: [
      {
        value:"System Project", text:"System Project"
      }, 
      {
        value:"Supply Project", text:"Supply Project"
      }
    ],
    value: '[{"value":"System Project", "text":"System Project"}, {"value":"Supply Project", "text":"Supply Project"}]',
  },
  {
    displayName: "Project Type",
    columnName: "udProjectType",
    columnTypeId: 1,
    columnType: "Text",
    columnWidth: "90px",
    isSearchable: true,
    isSortable: true,
    display: true,
    order: 4,
    toolTip: "",
    value: '',
  },
  {
    displayName: "Voltage",
    columnName: "udVoltagekV",
    columnTypeId: 2,
    columnType: "Drop Down",
    columnWidth: "60px",
    isSearchable: true,
    isSortable: false,
    display: true,
    order: 5,
    toolTip: "",
    filterValue: {},
    value: '[{"value":"0.415", "text":"0.415kV"}, {"value":"6.6", "text":"6.6kV"}, {"value":"11", "text":"11kV"}, {"value":"22", "text":"22kV"}, {"value":"33", "text":"33kV"}]',
  },
  {
    displayName: "State",
    columnName: "udcfG_GeoStateCode",
    columnTypeId: 2,
    columnType: "Drop Down",
    columnWidth: "100px",
    isSearchable: true,
    isSortable: false,
    display: true,
    order: 6,
    toolTip: "",
    filterValue: {},
    value: '[{"value":"PJCJ","text":"Putrajaya_Cyberjaya"},{"value":"SGR","text":"Selangor"},{"value":"KUL","text":"WP_Kuala_Lumpur"},{"value":"PHG","text":"Pahang"},{"value":"KEL","text":"Kelantan"},{"value":"TRG","text":"Terengganu"},{"value":"KDH","text":"Kedah"},{"value":"PLS","text":"Perlis"},{"value":"PRK","text":"Perak"},{"value":"NSN","text":"Negeri_Sembilan"},{"value":"JHR","text":"Johor"},{"value":"MLK","text":"Melaka"},{"value":"PNG","text":"Pulau_Pinang"}]',
  },
  {
    displayName: "Business Area",
    columnName: "udcfG_BusinessAreaName",
    columnTypeId: 1,
    columnType: "Text",
    columnWidth: "90px",
    isSearchable: true,
    isSortable: true,
    display: true,
    order: 7,
    toolTip: "",
    value: '',
  },
  {
    displayName: "Total Budget (RM)",
    columnName: "totalBudget",
    columnTypeId: 1,
    columnType: "Text",
    columnWidth: "100px",
    isSearchable: false,
    isSortable: true,
    display: true,
    order: 10,
    toolTip: "",
    value: '',
  },
  {
    displayName: "Risk Reduced (RM)",
    columnName: "riskReduced",
    columnTypeId: 1,
    columnType: "Text",
    columnWidth: "90px",
    isSearchable: false,
    isSortable: true,
    display: true,
    order: 10,
    toolTip: "",
    value: '',
  },
  {
    displayName: "OPEX (RM)",
    columnName: "tcoOpex",
    columnTypeId: 1,
    columnType: "Text",
    columnWidth: "90px",
    isSearchable: false,
    isSortable: true,
    display: true,
    order: 10,
    toolTip: "",
    value: '',
  },
  {
    displayName: "Total Project Cost (RM)",
    columnName: "tcoTotalProjectCost",
    columnTypeId: 1,
    columnType: "Text",
    columnWidth: "90px",
    isSearchable: false,
    isSortable: true,
    display: true,
    order: 10,
    toolTip: "",
    value: '',
  },
  {
    displayName: "NPV Risk Reduced (RM)",
    columnName: "npvRiskReduced",
    columnTypeId: 1,
    columnType: "Text",
    columnWidth: "90px",
    isSearchable: false,
    isSortable: true,
    display: true,
    order: 10,
    toolTip: "",
    value: '',
  },
  {
    displayName: "Project Score (Risk Reduced/TCO)",
    columnName: "projectScore",
    columnTypeId: 1,
    columnType: "Text",
    columnWidth: "100px",
    isSearchable: false,
    isSortable: true,
    display: true,
    order: 10,
    toolTip: "",
    value: '',
  }
];

/* GENCODE:MARKER:2:START */

//===============================================================
// TEMPLATE START: portfolio.interface.ts.1.1.tpl
//===============================================================
export function RESULT_SUPPLY_TABLE_COLUMN()
{
    return [
 {displayName: "Project Definition", columnName: "ProjectDefinition", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Project Description", columnName: "UDProjectDescription", columnTypeId: 1.0, columnType: "Text", columnWidth: "250px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Strategic Objective", columnName: "UDStrategicObjective", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Sub-strategic Objective for Reliability", columnName: "UDIBRNarrativeMR", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Sub-strategic Objective for High Profile Area", columnName: "UDIBRNarrativeHPA", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Project Category", columnName: "UDCategory", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Project Type", columnName: "UDProjectType", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Voltage", columnName: "UDVoltagekV", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "60px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "State", columnName: "StateName", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "100px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Business Area", columnName: "BusinessAreaName", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Budget (RM)", columnName: "Total_Budget", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Risk Reduced (RM)", columnName: "Risk_Reduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "OPEX (RM)", columnName: "TCO_Opex", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Total Project Cost (RM)", columnName: "TCO_TotalProjectCost", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "NPV Risk Reduced (RM)", columnName: "NPV_RiskReduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Project Score (NPV Risk Reduced/TCO)", columnName: "Project_Score", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
    ];
}
//===============================================================
// TEMPLATE END: portfolio.interface.ts.1.1.tpl
//===============================================================

/* GENCODE:MARKER:2:END */

/* GENCODE:MARKER:1:START */

//===============================================================
// TEMPLATE START: portfolio.interface.ts.1.1.tpl
//===============================================================
export function PORTFOLIO_APPROVED_GROUPBY_RESULT_TABLE_COLUMN()
{
    return [
 {displayName: "Strategic Objective", columnName: "udStrategicObjective", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "130px", isSearchable: true, isSortable: false, display: true, toolTip: "" },
 {displayName: "Sub-strategic Objective for Reliability", columnName: "uDIBRNarrativeMR", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: true, isSortable: false, display: true, toolTip: "" },
 {displayName: "Sub-strategic Objective for High Profile Area", columnName: "uDIBRNarrativeHPA", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: true, isSortable: false, display: true, toolTip: "" },
 {displayName: "Voltage", columnName: "udVoltagekV", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "60px", isSearchable: true, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Project", columnName: "total_Project", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Budget Before Revised (RM)", columnName: "budget_Before_Revised", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "Total Budget (RM)", columnName: "total_Budget", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "Risk Reduced (RM)", columnName: "risk_Reduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "OPEX (RM)", columnName: "tcO_Opex", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "Total Project Cost (RM)", columnName: "tcO_TotalProjectCost", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "NPV Risk Reduced (RM)", columnName: "npV_RiskReduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "Project Score (NPV Risk Reduced/TCO)", columnName: "project_Score", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "Budget Year 1 (RM)", columnName: "budY1", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 2 (RM)", columnName: "budY2", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 3 (RM)", columnName: "budY3", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 4 (RM)", columnName: "budY4", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 5 (RM)", columnName: "budY5", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 6 (RM)", columnName: "budY6", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 7 (RM)", columnName: "budY7", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 8 (RM)", columnName: "budY8", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
    ];
}
//===============================================================
// TEMPLATE END: portfolio.interface.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.interface.ts.1.1.tpl
//===============================================================
export function PORTFOLIO_REJECTED_GROUPBY_RESULT_TABLE_COLUMN()
{
    return [
 {displayName: "Strategic Objective", columnName: "udStrategicObjective", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "130px", isSearchable: true, isSortable: false, display: true, toolTip: "" },
 {displayName: "Sub-strategic Objective for Reliability", columnName: "uDIBRNarrativeMR", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: true, isSortable: false, display: true, toolTip: "" },
 {displayName: "Sub-strategic Objective for High Profile Area", columnName: "uDIBRNarrativeHPA", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: true, isSortable: false, display: true, toolTip: "" },
 {displayName: "Voltage", columnName: "udVoltagekV", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "60px", isSearchable: true, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Project", columnName: "total_Project", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Budget Before Revised (RM)", columnName: "budget_Before_Revised", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Total Budget (RM)", columnName: "total_Budget", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Risk Reduced (RM)", columnName: "risk_Reduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "OPEX (RM)", columnName: "tcO_Opex", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Total Project Cost (RM)", columnName: "tcO_TotalProjectCost", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "NPV Risk Reduced (RM)", columnName: "npV_RiskReduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Project Score (NPV Risk Reduced/TCO)", columnName: "project_Score", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
    ];
}
//===============================================================
// TEMPLATE END: portfolio.interface.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.interface.ts.1.1.tpl
//===============================================================
export function PORTFOLIO_SUMMARY_RESULT_TABLE_COLUMN()
{
    return [
 {displayName: "Summary of", columnName: "summary", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Project", columnName: "totalProject", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Budget Before Revised (RM)", columnName: "budgetBeforeRevised", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Budget (RM)", columnName: "totalBudget", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Risk Reduced (RM)", columnName: "riskReduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "OPEX (RM)", columnName: "tcoOpex", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Project Cost (RM)", columnName: "tcoTotalProjectCost", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "NPV Risk Reduced (RM)", columnName: "npvRiskReduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Project Score (NPV Risk Reduced/TCO)", columnName: "projectScore", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Budget Year 1 (RM)", columnName: "budY1", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Budget Year 2 (RM)", columnName: "budY2", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Budget Year 3 (RM)", columnName: "budY3", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Budget Year 4 (RM)", columnName: "budY4", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Budget Year 5 (RM)", columnName: "budY5", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Budget Year 6 (RM)", columnName: "budY6", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Budget Year 7 (RM)", columnName: "budY7", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Budget Year 8 (RM)", columnName: "budY8", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
    ];
}
//===============================================================
// TEMPLATE END: portfolio.interface.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.interface.ts.1.1.tpl
//===============================================================
export function PORTFOLIO_APPROVED_RESULT_TABLE_COLUMN()
{
    return [
 {displayName: "Project Definition", columnName: "projectDefinition", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Project Description", columnName: "udProjectDescription", columnTypeId: 1.0, columnType: "Text", columnWidth: "250px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Strategic Objective", columnName: "udStrategicObjective", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Sub-strategic Objective for Reliability", columnName: "udibrNarrativeMR", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Sub-strategic Objective for High Profile Area", columnName: "udibrNarrativeHPA", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Project Category", columnName: "udCategory", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Project Type", columnName: "udProjectType", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "110px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Voltage", columnName: "udVoltagekV", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "60px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "State", columnName: "stateName", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "100px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Business Area", columnName: "businessAreaName", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Before Revised (RM)", columnName: "budget_Before_Revised", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Total Budget (RM)", columnName: "total_Budget", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Risk Reduced (RM)", columnName: "risk_Reduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "OPEX (RM)", columnName: "tcO_Opex", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Total Project Cost (RM)", columnName: "tcO_TotalProjectCost", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "NPV Risk Reduced (RM)", columnName: "npV_RiskReduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Project Score (NPV Risk Reduced/TCO)", columnName: "project_Score", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Scope 1 Duration (Months)", columnName: "month_Scope_1", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 1 Start Month", columnName: "start_Month_Scope_1", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 2 Duration (Months)", columnName: "month_Scope_2", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 2 Start Month", columnName: "start_Month_Scope_2", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 3 Duration (Months)", columnName: "month_Scope_3", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 3 Start Month", columnName: "start_Month_Scope_3", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 4 Duration (Months)", columnName: "month_Scope_4", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 4 Start Month", columnName: "start_Month_Scope_4", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Comm Month", columnName: "comm_Month", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Target Comm Month", columnName: "target_Comm_Month", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Mandatory", columnName: "mandatory", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 1 (RM)", columnName: "budY1", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 2 (RM)", columnName: "budY2", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 3 (RM)", columnName: "budY3", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 4 (RM)", columnName: "budY4", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 5 (RM)", columnName: "budY5", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 6 (RM)", columnName: "budY6", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 7 (RM)", columnName: "budY7", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 8 (RM)", columnName: "budY8", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
    ];
}
//===============================================================
// TEMPLATE END: portfolio.interface.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.interface.ts.1.1.tpl
//===============================================================
export function PORTFOLIO_REJECTED_RESULT_TABLE_COLUMN()
{
    return [
 {displayName: "Project Definition", columnName: "projectDefinition", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Project Description", columnName: "udProjectDescription", columnTypeId: 1.0, columnType: "Text", columnWidth: "250px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Strategic Objective", columnName: "udStrategicObjective", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Sub-strategic Objective for Reliability", columnName: "udIBRNarrativeMR", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Sub-strategic Objective for High Profile Area", columnName: "udIBRNarrativeHPA", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Project Category", columnName: "udCategory", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Project Type", columnName: "udProjectType", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Voltage", columnName: "udVoltagekV", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "60px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "State", columnName: "udcfG_GeoStateCode", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "100px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Business Area", columnName: "udcfG_BusinessAreaName", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Before Revised (RM)", columnName: "budgetBeforeRevised", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Total Budget (RM)", columnName: "totalBudget", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Risk Reduced (RM)", columnName: "riskReduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "OPEX (RM)", columnName: "tcoOpex", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Total Project Cost (RM)", columnName: "tcoTotalProjectCost", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "NPV Risk Reduced (RM)", columnName: "npvRiskReduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Project Score (NPV Risk Reduced/TCO)", columnName: "projectScore", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
    ];
}
//===============================================================
// TEMPLATE END: portfolio.interface.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.interface.ts.1.1.tpl
//===============================================================
export function PORTFOLIO_APPROVED_GROUPBY_RESULT_TABLE_COLUMN2()
{
    return [
 {displayName: "Strategic Objective", columnName: "udStrategicObjective", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "130px", isSearchable: true, isSortable: false, display: true, toolTip: "" },
 {displayName: "Voltage", columnName: "udVoltagekV", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "60px", isSearchable: true, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Project", columnName: "total_Project", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Budget Before Revised (RM)", columnName: "budget_Before_Revised", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "Total Budget (RM)", columnName: "total_Budget", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "Risk Reduced (RM)", columnName: "risk_Reduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "OPEX (RM)", columnName: "tcO_Opex", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "Total Project Cost (RM)", columnName: "tcO_TotalProjectCost", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "NPV Risk Reduced (RM)", columnName: "npV_RiskReduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "Project Score (NPV Risk Reduced/TCO)", columnName: "project_Score", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "Budget Year 1 (RM)", columnName: "budY1", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 2 (RM)", columnName: "budY2", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 3 (RM)", columnName: "budY3", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 4 (RM)", columnName: "budY4", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 5 (RM)", columnName: "budY5", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 6 (RM)", columnName: "budY6", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 7 (RM)", columnName: "budY7", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 8 (RM)", columnName: "budY8", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
    ];
}
//===============================================================
// TEMPLATE END: portfolio.interface.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.interface.ts.1.1.tpl
//===============================================================
export function PORTFOLIO_REJECTED_GROUPBY_RESULT_TABLE_COLUMN2()
{
    return [
 {displayName: "Strategic Objective", columnName: "udStrategicObjective", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "130px", isSearchable: true, isSortable: false, display: true, toolTip: "" },
 {displayName: "Voltage", columnName: "udVoltagekV", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "60px", isSearchable: true, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Project", columnName: "total_Project", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Budget Before Revised (RM)", columnName: "budget_Before_Revised", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Total Budget (RM)", columnName: "total_Budget", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Risk Reduced (RM)", columnName: "risk_Reduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "OPEX (RM)", columnName: "tcO_Opex", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Total Project Cost (RM)", columnName: "tcO_TotalProjectCost", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "NPV Risk Reduced (RM)", columnName: "npV_RiskReduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Project Score (NPV Risk Reduced/TCO)", columnName: "project_Score", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
    ];
}
//===============================================================
// TEMPLATE END: portfolio.interface.ts.1.1.tpl
//===============================================================

/* GENCODE:MARKER:1:END */

/* GENCODE:MARKER:3:START */

//===============================================================
// TEMPLATE START: portfolio.interface.ts.1.2.tpl
//===============================================================
export function hdrDefresultSummaryTableColumns()
{
    return [
 {displayName: "Summary of", columnName: "summary", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Project", columnName: "totalProject", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Budget Before Revised (RM)", columnName: "budgetBeforeRevised", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Budget (RM)", columnName: "totalBudget", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Risk Reduced (RM)", columnName: "riskReduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "OPEX (RM)", columnName: "tcoOpex", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Project Cost (RM)", columnName: "tcoTotalProjectCost", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "NPV Risk Reduced (RM)", columnName: "npvRiskReduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Project Score (NPV Risk Reduced/TCO)", columnName: "projectScore", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Budget Year 1 (RM)", columnName: "budY1", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Budget Year 2 (RM)", columnName: "budY2", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Budget Year 3 (RM)", columnName: "budY3", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Budget Year 4 (RM)", columnName: "budY4", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Budget Year 5 (RM)", columnName: "budY5", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Budget Year 6 (RM)", columnName: "budY6", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Budget Year 7 (RM)", columnName: "budY7", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Budget Year 8 (RM)", columnName: "budY8", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
    ];
}
//===============================================================
// TEMPLATE END: portfolio.interface.ts.1.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.interface.ts.1.2.tpl
//===============================================================
export function hdrDefresultApprovedTableColumns()
{
    return [
 {displayName: "Project Definition", columnName: "ProjectDefinition", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Project Description", columnName: "UDProjectDescription", columnTypeId: 1.0, columnType: "Text", columnWidth: "250px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Strategic Objective", columnName: "UDStrategicObjective", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Sub-strategic Objective for Reliability", columnName: "UDIBRNarrativeMR", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Sub-strategic Objective for High Profile Area", columnName: "UDIBRNarrativeHPA", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Project Category", columnName: "UDCategory", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Project Type", columnName: "UDProjectType", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "110px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Voltage", columnName: "UDVoltagekV", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "60px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "State", columnName: "StateName", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "100px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Business Area", columnName: "BusinessAreaName", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Before Revised (RM)", columnName: "Budget_Before_Revised", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Total Budget (RM)", columnName: "Total_Budget", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Risk Reduced (RM)", columnName: "Risk_Reduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "OPEX (RM)", columnName: "TCO_Opex", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Total Project Cost (RM)", columnName: "TCO_TotalProjectCost", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "NPV Risk Reduced (RM)", columnName: "NPV_RiskReduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Project Score (NPV Risk Reduced/TCO)", columnName: "Project_Score", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Scope 1 Duration (Months)", columnName: "Month_Scope_1", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 1 Start Month", columnName: "Start_Month_Scope_1", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 2 Duration (Months)", columnName: "Month_Scope_2", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 2 Start Month", columnName: "Start_Month_Scope_2", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 3 Duration (Months)", columnName: "Month_Scope_3", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 3 Start Month", columnName: "Start_Month_Scope_3", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 4 Duration (Months)", columnName: "Month_Scope_4", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 4 Start Month", columnName: "Start_Month_Scope_4", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Comm Month", columnName: "Comm_Month", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Target Comm Month", columnName: "Target_Comm_Month", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Mandatory", columnName: "Mandatory", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 1 (RM)", columnName: "BUDY1", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 2 (RM)", columnName: "BUDY2", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 3 (RM)", columnName: "BUDY3", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 4 (RM)", columnName: "BUDY4", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 5 (RM)", columnName: "BUDY5", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 6 (RM)", columnName: "BUDY6", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 7 (RM)", columnName: "BUDY7", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 8 (RM)", columnName: "BUDY8", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
    ];
}
//===============================================================
// TEMPLATE END: portfolio.interface.ts.1.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.interface.ts.1.2.tpl
//===============================================================
export function hdrDefresultApprovedGroupByGridColumns()
{
    return [
 {displayName: "Strategic Objective", columnName: "udStrategicObjective", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "130px", isSearchable: true, isSortable: false, display: true, toolTip: "" },
 {displayName: "Sub-strategic Objective for Reliability", columnName: "uDIBRNarrativeMR", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: true, isSortable: false, display: true, toolTip: "" },
 {displayName: "Sub-strategic Objective for High Profile Area", columnName: "uDIBRNarrativeHPA", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: true, isSortable: false, display: true, toolTip: "" },
 {displayName: "Voltage", columnName: "udVoltagekV", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "60px", isSearchable: true, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Project", columnName: "total_Project", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Budget Before Revised (RM)", columnName: "budget_Before_Revised", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "Total Budget (RM)", columnName: "total_Budget", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "Risk Reduced (RM)", columnName: "risk_Reduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "OPEX (RM)", columnName: "tcO_Opex", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "Total Project Cost (RM)", columnName: "tcO_TotalProjectCost", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "NPV Risk Reduced (RM)", columnName: "npV_RiskReduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "Project Score (NPV Risk Reduced/TCO)", columnName: "project_Score", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "Budget Year 1 (RM)", columnName: "budY1", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 2 (RM)", columnName: "budY2", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 3 (RM)", columnName: "budY3", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 4 (RM)", columnName: "budY4", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 5 (RM)", columnName: "budY5", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 6 (RM)", columnName: "budY6", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 7 (RM)", columnName: "budY7", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 8 (RM)", columnName: "budY8", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
    ];
}
//===============================================================
// TEMPLATE END: portfolio.interface.ts.1.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.interface.ts.1.2.tpl
//===============================================================
export function hdrDefresultApprovedGroupByGrid2Columns()
{
    return [
 {displayName: "Strategic Objective", columnName: "udStrategicObjective", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "130px", isSearchable: true, isSortable: false, display: true, toolTip: "" },
 {displayName: "Voltage", columnName: "udVoltagekV", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "60px", isSearchable: true, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Project", columnName: "total_Project", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Budget Before Revised (RM)", columnName: "budget_Before_Revised", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "Total Budget (RM)", columnName: "total_Budget", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "Risk Reduced (RM)", columnName: "risk_Reduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "OPEX (RM)", columnName: "tcO_Opex", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "Total Project Cost (RM)", columnName: "tcO_TotalProjectCost", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "NPV Risk Reduced (RM)", columnName: "npV_RiskReduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "Project Score (NPV Risk Reduced/TCO)", columnName: "project_Score", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "Budget Year 1 (RM)", columnName: "budY1", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 2 (RM)", columnName: "budY2", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 3 (RM)", columnName: "budY3", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 4 (RM)", columnName: "budY4", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 5 (RM)", columnName: "budY5", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 6 (RM)", columnName: "budY6", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 7 (RM)", columnName: "budY7", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 8 (RM)", columnName: "budY8", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
    ];
}
//===============================================================
// TEMPLATE END: portfolio.interface.ts.1.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.interface.ts.1.2.tpl
//===============================================================
export function hdrDefresultSupplyTableColumns()
{
    return [
 {displayName: "Project Definition", columnName: "ProjectDefinition", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Project Description", columnName: "UDProjectDescription", columnTypeId: 1.0, columnType: "Text", columnWidth: "250px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Strategic Objective", columnName: "UDStrategicObjective", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Sub-strategic Objective for Reliability", columnName: "UDIBRNarrativeMR", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Sub-strategic Objective for High Profile Area", columnName: "UDIBRNarrativeHPA", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Project Category", columnName: "UDCategory", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Project Type", columnName: "UDProjectType", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Voltage", columnName: "UDVoltagekV", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "60px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "State", columnName: "StateName", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "100px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Business Area", columnName: "BusinessAreaName", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Budget (RM)", columnName: "Total_Budget", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Risk Reduced (RM)", columnName: "Risk_Reduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "OPEX (RM)", columnName: "TCO_Opex", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Total Project Cost (RM)", columnName: "TCO_TotalProjectCost", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "NPV Risk Reduced (RM)", columnName: "NPV_RiskReduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Project Score (NPV Risk Reduced/TCO)", columnName: "Project_Score", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Action", columnName: "action", columnTypeId: 98.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
    ];
}
//===============================================================
// TEMPLATE END: portfolio.interface.ts.1.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.interface.ts.1.2.tpl
//===============================================================
export function hdrDefresultRejectedTableColumns()
{
    return [
 {displayName: "Project Definition", columnName: "projectDefinition", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Project Description", columnName: "udProjectDescription", columnTypeId: 1.0, columnType: "Text", columnWidth: "250px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Strategic Objective", columnName: "udStrategicObjective", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Sub-strategic Objective for Reliability", columnName: "udIBRNarrativeMR", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Sub-strategic Objective for High Profile Area", columnName: "udIBRNarrativeHPA", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Project Category", columnName: "udCategory", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Project Type", columnName: "udProjectType", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Voltage", columnName: "udVoltagekV", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "60px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "State", columnName: "udcfG_GeoStateCode", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "100px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Business Area", columnName: "udcfG_BusinessAreaName", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Before Revised (RM)", columnName: "budgetBeforeRevised", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Total Budget (RM)", columnName: "totalBudget", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Risk Reduced (RM)", columnName: "riskReduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "OPEX (RM)", columnName: "tcoOpex", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Total Project Cost (RM)", columnName: "tcoTotalProjectCost", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "NPV Risk Reduced (RM)", columnName: "npvRiskReduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Project Score (NPV Risk Reduced/TCO)", columnName: "projectScore", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
    ];
}
//===============================================================
// TEMPLATE END: portfolio.interface.ts.1.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.interface.ts.1.2.tpl
//===============================================================
export function hdrDefresultRejectedGroupByGridColumns()
{
    return [
 {displayName: "Strategic Objective", columnName: "udStrategicObjective", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "130px", isSearchable: true, isSortable: false, display: true, toolTip: "" },
 {displayName: "Sub-strategic Objective for Reliability", columnName: "uDIBRNarrativeMR", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: true, isSortable: false, display: true, toolTip: "" },
 {displayName: "Sub-strategic Objective for High Profile Area", columnName: "uDIBRNarrativeHPA", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: true, isSortable: false, display: true, toolTip: "" },
 {displayName: "Voltage", columnName: "udVoltagekV", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "60px", isSearchable: true, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Project", columnName: "total_Project", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Budget Before Revised (RM)", columnName: "budget_Before_Revised", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Total Budget (RM)", columnName: "total_Budget", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Risk Reduced (RM)", columnName: "risk_Reduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "OPEX (RM)", columnName: "tcO_Opex", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Total Project Cost (RM)", columnName: "tcO_TotalProjectCost", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "NPV Risk Reduced (RM)", columnName: "npV_RiskReduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Project Score (NPV Risk Reduced/TCO)", columnName: "project_Score", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
    ];
}
//===============================================================
// TEMPLATE END: portfolio.interface.ts.1.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.interface.ts.1.2.tpl
//===============================================================
export function hdrDefresultRejectedGroupByGrid2Columns()
{
    return [
 {displayName: "Strategic Objective", columnName: "udStrategicObjective", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "130px", isSearchable: true, isSortable: false, display: true, toolTip: "" },
 {displayName: "Voltage", columnName: "udVoltagekV", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "60px", isSearchable: true, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Project", columnName: "total_Project", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Budget Before Revised (RM)", columnName: "budget_Before_Revised", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Total Budget (RM)", columnName: "total_Budget", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Risk Reduced (RM)", columnName: "risk_Reduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "OPEX (RM)", columnName: "tcO_Opex", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Total Project Cost (RM)", columnName: "tcO_TotalProjectCost", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "NPV Risk Reduced (RM)", columnName: "npV_RiskReduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Project Score (NPV Risk Reduced/TCO)", columnName: "project_Score", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
    ];
}
//===============================================================
// TEMPLATE END: portfolio.interface.ts.1.2.tpl
//===============================================================

/* GENCODE:MARKER:3:END */

/* GENCODE:MARKER:4:START */

//===============================================================
// TEMPLATE START: portfolio.interface.ts.1.2.tpl
//===============================================================
export function hdrDefAlternateResultSummaryGridHdr()
{
    return [
 {displayName: "Summary of", columnName: "summary", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Project", columnName: "totalProject", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Budget Before Revised (RM)", columnName: "budgetBeforeRevised", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Budget (RM)", columnName: "totalBudget", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Risk Reduced (RM)", columnName: "riskReduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "OPEX (RM)", columnName: "tcoOpex", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Project Cost (RM)", columnName: "tcoTotalProjectCost", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "NPV Risk Reduced (RM)", columnName: "npvRiskReduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Project Score (NPV Risk Reduced/TCO)", columnName: "projectScore", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Budget Year 1 (RM)", columnName: "budY1", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Budget Year 2 (RM)", columnName: "budY2", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Budget Year 3 (RM)", columnName: "budY3", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Budget Year 4 (RM)", columnName: "budY4", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Budget Year 5 (RM)", columnName: "budY5", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Budget Year 6 (RM)", columnName: "budY6", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Budget Year 7 (RM)", columnName: "budY7", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Budget Year 8 (RM)", columnName: "budY8", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Beyond Horizon", columnName: "beyondHorizon", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
    ];
}
//===============================================================
// TEMPLATE END: portfolio.interface.ts.1.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.interface.ts.1.2.tpl
//===============================================================
export function hdrDefAlternateResultPrioritisedGridHdr()
{
    return [
 {displayName: "Project Definition", columnName: "ProjectDefinition", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "90px", isSearchable: true, isSortable: true, display: true, toolTip: "" },
 {displayName: "Project Description", columnName: "UDProjectDescription", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "250px", isSearchable: true, isSortable: true, display: true, toolTip: "" },
 {displayName: "Strategic Objective", columnName: "UDStrategicObjective", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Sub-strategic Objective for Reliability", columnName: "UDIBRNarrativeMR", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Sub-strategic Objective for High Profile Area", columnName: "UDIBRNarrativeHPA", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Project Category", columnName: "UDCategory", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "90px", isSearchable: true, isSortable: true, display: true, toolTip: "" },
 {displayName: "Project Type", columnName: "UDProjectType", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "110px", isSearchable: true, isSortable: true, display: true, toolTip: "" },
 {displayName: "Voltage", columnName: "UDVoltagekV", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "60px", isSearchable: true, isSortable: true, display: true, toolTip: "" },
 {displayName: "State", columnName: "StateName", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "100px", isSearchable: true, isSortable: true, display: true, toolTip: "" },
 {displayName: "Business Area", columnName: "BusinessAreaName", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Before Revised (RM)", columnName: "Budget_Before_Revised", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Total Budget (RM)", columnName: "Total_Budget", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Risk Reduced (RM)", columnName: "Risk_Reduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "OPEX (RM)", columnName: "TCO_Opex", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Total Project Cost (RM)", columnName: "TCO_TotalProjectCost", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "NPV Risk Reduced (RM)", columnName: "NPV_RiskReduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Project Score (NPV Risk Reduced/TCO)", columnName: "Project_Score", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Scope 1 Duration (Months)", columnName: "Month_Scope_1", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 1 Start Month", columnName: "Start_Month_Scope_1", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 2 Duration (Months)", columnName: "Month_Scope_2", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 2 Start Month", columnName: "Start_Month_Scope_2", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 3 Duration (Months)", columnName: "Month_Scope_3", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 3 Start Month", columnName: "Start_Month_Scope_3", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 4 Duration (Months)", columnName: "Month_Scope_4", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 4 Start Month", columnName: "Start_Month_Scope_4", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Comm Month", columnName: "Comm_Month", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Target Comm Month", columnName: "Target_Comm_Month", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Mandatory", columnName: "Mandatory", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 1 (RM)", columnName: "BUDY1", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 2 (RM)", columnName: "BUDY2", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 3 (RM)", columnName: "BUDY3", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 4 (RM)", columnName: "BUDY4", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 5 (RM)", columnName: "BUDY5", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 6 (RM)", columnName: "BUDY6", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 7 (RM)", columnName: "BUDY7", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 8 (RM)", columnName: "BUDY8", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Defer Action", columnName: "Defer_Action", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "90px", isSearchable: true, isSortable: true, display: true, toolTip: "" },
 {displayName: "Justification", columnName: "Justification", columnTypeId: 1.0, columnType: "Text", columnWidth: "250px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Action", columnName: "action", columnTypeId: 98.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
    ];
}
//===============================================================
// TEMPLATE END: portfolio.interface.ts.1.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.interface.ts.1.2.tpl
//===============================================================
export function hdrDefAlternateResultCategorizedPrio_1GridHdr()
{
    return [
 {displayName: "Strategic Objective", columnName: "udStrategicObjective", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "130px", isSearchable: true, isSortable: false, display: true, toolTip: "" },
 {displayName: "Sub-strategic Objective for Reliability", columnName: "uDIBRNarrativeMR", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: true, isSortable: false, display: true, toolTip: "" },
 {displayName: "Sub-strategic Objective for High Profile Area", columnName: "uDIBRNarrativeHPA", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: true, isSortable: false, display: true, toolTip: "" },
 {displayName: "Voltage", columnName: "udVoltagekV", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "60px", isSearchable: true, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Project", columnName: "total_Project", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Budget Before Revised (RM)", columnName: "budget_Before_Revised", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "Total Budget (RM)", columnName: "total_Budget", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "Risk Reduced (RM)", columnName: "risk_Reduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "OPEX (RM)", columnName: "tcO_Opex", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "Total Project Cost (RM)", columnName: "tcO_TotalProjectCost", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "NPV Risk Reduced (RM)", columnName: "npV_RiskReduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "Project Score (NPV Risk Reduced/TCO)", columnName: "project_Score", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "Budget Year 1 (RM)", columnName: "budY1", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 2 (RM)", columnName: "budY2", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 3 (RM)", columnName: "budY3", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 4 (RM)", columnName: "budY4", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 5 (RM)", columnName: "budY5", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 6 (RM)", columnName: "budY6", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 7 (RM)", columnName: "budY7", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 8 (RM)", columnName: "budY8", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
    ];
}
//===============================================================
// TEMPLATE END: portfolio.interface.ts.1.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.interface.ts.1.2.tpl
//===============================================================
export function hdrDefAlternateResultCategorizedPrio_2GridHdr()
{
    return [
 {displayName: "Strategic Objective", columnName: "udStrategicObjective", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "130px", isSearchable: true, isSortable: false, display: true, toolTip: "" },
 {displayName: "Voltage", columnName: "udVoltagekV", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "60px", isSearchable: true, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Project", columnName: "total_Project", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Budget Before Revised (RM)", columnName: "budget_Before_Revised", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "Total Budget (RM)", columnName: "total_Budget", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "Risk Reduced (RM)", columnName: "risk_Reduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "OPEX (RM)", columnName: "tcO_Opex", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "Total Project Cost (RM)", columnName: "tcO_TotalProjectCost", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "NPV Risk Reduced (RM)", columnName: "npV_RiskReduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "Project Score (NPV Risk Reduced/TCO)", columnName: "project_Score", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "Budget Year 1 (RM)", columnName: "budY1", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 2 (RM)", columnName: "budY2", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 3 (RM)", columnName: "budY3", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 4 (RM)", columnName: "budY4", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 5 (RM)", columnName: "budY5", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 6 (RM)", columnName: "budY6", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 7 (RM)", columnName: "budY7", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 8 (RM)", columnName: "budY8", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
    ];
}
//===============================================================
// TEMPLATE END: portfolio.interface.ts.1.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.interface.ts.1.2.tpl
//===============================================================
export function hdrDefAlternateResultAlternateProjGridHdr()
{
    return [
 {displayName: "Project Definition", columnName: "ProjectDefinition", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Project Description", columnName: "UDProjectDescription", columnTypeId: 1.0, columnType: "Text", columnWidth: "250px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Strategic Objective", columnName: "UDStrategicObjective", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Sub-strategic Objective for Reliability", columnName: "UDIBRNarrativeMR", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Sub-strategic Objective for High Profile Area", columnName: "UDIBRNarrativeHPA", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Project Category", columnName: "UDCategory", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Project Type", columnName: "UDProjectType", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "110px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Voltage", columnName: "UDVoltagekV", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "60px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "State", columnName: "StateName", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "100px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Business Area", columnName: "BusinessAreaName", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Before Revised (RM)", columnName: "Budget_Before_Revised", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Total Budget (RM)", columnName: "Total_Budget", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Risk Reduced (RM)", columnName: "Risk_Reduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "OPEX (RM)", columnName: "TCO_Opex", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Total Project Cost (RM)", columnName: "TCO_TotalProjectCost", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "NPV Risk Reduced (RM)", columnName: "NPV_RiskReduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Project Score (NPV Risk Reduced/TCO) ", columnName: "Project_Score", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Scope 1 Duration (Months) ", columnName: "Month_Scope_1", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 1 Start Month ", columnName: "Start_Month_Scope_1", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 2 Duration (Months) ", columnName: "Month_Scope_2", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 2 Start Month ", columnName: "Start_Month_Scope_2", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 3 Duration (Months) ", columnName: "Month_Scope_3", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 3 Start Month ", columnName: "Start_Month_Scope_3", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 4 Duration (Months) ", columnName: "Month_Scope_4", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 4 Start Month ", columnName: "Start_Month_Scope_4", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Comm Month ", columnName: "Comm_Month", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Target Comm Month ", columnName: "Target_Comm_Month", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Mandatory ", columnName: "Mandatory", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 1 (RM) ", columnName: "BUDY1", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 2 (RM) ", columnName: "BUDY2", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 3 (RM) ", columnName: "BUDY3", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 4 (RM) ", columnName: "BUDY4", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 5 (RM) ", columnName: "BUDY5", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 6 (RM) ", columnName: "BUDY6", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 7 (RM) ", columnName: "BUDY7", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 8 (RM) ", columnName: "BUDY8", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Master Project Reproposal ID", columnName: "Reproposal_IDs", columnTypeId: 1.0, columnType: "Text", columnWidth: "150px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Action", columnName: "action", columnTypeId: 98.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
    ];
}
//===============================================================
// TEMPLATE END: portfolio.interface.ts.1.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.interface.ts.1.2.tpl
//===============================================================
export function hdrDefAlternateResultSupplyGridHdr()
{
    return [
 {displayName: "Project Definition", columnName: "ProjectDefinition", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Project Description", columnName: "UDProjectDescription", columnTypeId: 1.0, columnType: "Text", columnWidth: "250px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Strategic Objective", columnName: "UDStrategicObjective", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Sub-strategic Objective for Reliability", columnName: "UDIBRNarrativeMR", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Sub-strategic Objective for High Profile Area", columnName: "UDIBRNarrativeHPA", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Project Category", columnName: "UDCategory", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Project Type", columnName: "UDProjectType", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Voltage", columnName: "UDVoltagekV", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "60px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "State", columnName: "StateName", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "100px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Business Area", columnName: "BusinessAreaName", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Budget (RM)", columnName: "Total_Budget", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Risk Reduced (RM)", columnName: "Risk_Reduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "OPEX (RM)", columnName: "TCO_Opex", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Total Project Cost (RM)", columnName: "TCO_TotalProjectCost", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "NPV Risk Reduced (RM)", columnName: "NPV_RiskReduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Project Score (NPV Risk Reduced/TCO)", columnName: "Project_Score", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Action", columnName: "action", columnTypeId: 98.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
    ];
}
//===============================================================
// TEMPLATE END: portfolio.interface.ts.1.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.interface.ts.1.2.tpl
//===============================================================
export function hdrDefAlternateResultDeprioritizedGridHdr()
{
    return [
 {displayName: "Project Definition", columnName: "projectDefinition", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Project Description", columnName: "udProjectDescription", columnTypeId: 1.0, columnType: "Text", columnWidth: "250px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Strategic Objective", columnName: "udStrategicObjective", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Sub-strategic Objective for Reliability", columnName: "udIBRNarrativeMR", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Sub-strategic Objective for High Profile Area", columnName: "udIBRNarrativeHPA", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Project Category", columnName: "udCategory", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Project Type", columnName: "udProjectType", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Voltage", columnName: "udVoltagekV", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "60px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "State", columnName: "udcfG_GeoStateCode", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "100px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Business Area", columnName: "udcfG_BusinessAreaName", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Before Revised (RM)", columnName: "budgetBeforeRevised", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Total Budget (RM)", columnName: "totalBudget", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Risk Reduced (RM)", columnName: "riskReduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "OPEX (RM)", columnName: "tcoOpex", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Total Project Cost (RM)", columnName: "tcoTotalProjectCost", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "NPV Risk Reduced (RM)", columnName: "npvRiskReduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Project Score (NPV Risk Reduced/TCO)", columnName: "projectScore", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
    ];
}
//===============================================================
// TEMPLATE END: portfolio.interface.ts.1.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.interface.ts.1.2.tpl
//===============================================================
export function hdrDefAlternateResultCategorizedDeprio_1GridHdr()
{
    return [
 {displayName: "Strategic Objective", columnName: "udStrategicObjective", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "130px", isSearchable: true, isSortable: false, display: true, toolTip: "" },
 {displayName: "Sub-strategic Objective for Reliability", columnName: "uDIBRNarrativeMR", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: true, isSortable: false, display: true, toolTip: "" },
 {displayName: "Sub-strategic Objective for High Profile Area", columnName: "uDIBRNarrativeHPA", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: true, isSortable: false, display: true, toolTip: "" },
 {displayName: "Voltage", columnName: "udVoltagekV", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "60px", isSearchable: true, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Project", columnName: "total_Project", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Budget Before Revised (RM)", columnName: "budget_Before_Revised", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Total Budget (RM)", columnName: "total_Budget", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Risk Reduced (RM)", columnName: "risk_Reduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "OPEX (RM)", columnName: "tcO_Opex", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Total Project Cost (RM)", columnName: "tcO_TotalProjectCost", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "NPV Risk Reduced (RM)", columnName: "npV_RiskReduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Project Score (NPV Risk Reduced/TCO)", columnName: "project_Score", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
    ];
}
//===============================================================
// TEMPLATE END: portfolio.interface.ts.1.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.interface.ts.1.2.tpl
//===============================================================
export function hdrDefAlternateResultCategorizedDeprio_2GridHdr()
{
    return [
 {displayName: "Strategic Objective", columnName: "udStrategicObjective", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "130px", isSearchable: true, isSortable: false, display: true, toolTip: "" },
 {displayName: "Voltage", columnName: "udVoltagekV", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "60px", isSearchable: true, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Project", columnName: "total_Project", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Budget Before Revised (RM)", columnName: "budget_Before_Revised", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Total Budget (RM)", columnName: "total_Budget", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Risk Reduced (RM)", columnName: "risk_Reduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "OPEX (RM)", columnName: "tcO_Opex", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Total Project Cost (RM)", columnName: "tcO_TotalProjectCost", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "NPV Risk Reduced (RM)", columnName: "npV_RiskReduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Project Score (NPV Risk Reduced/TCO)", columnName: "project_Score", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
    ];
}
//===============================================================
// TEMPLATE END: portfolio.interface.ts.1.2.tpl
//===============================================================

/* GENCODE:MARKER:4:END */

/* GENCODE:MARKER:5:START */

//===============================================================
// TEMPLATE START: portfolio.interface.ts.1.2.tpl
//===============================================================
export function hdrDefComparisonSummaryGridHdr()
{
    return [
 {displayName: "Summary of", columnName: "summary", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Project", columnName: "totalProject", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Budget Before Revised (RM)", columnName: "budgetBeforeRevised", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Budget (RM)", columnName: "totalBudget", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Risk Reduced (RM)", columnName: "riskReduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "OPEX (RM)", columnName: "tcoOpex", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Project Cost (RM)", columnName: "tcoTotalProjectCost", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "NPV Risk Reduced (RM)", columnName: "npvRiskReduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Project Score (NPV Risk Reduced/TCO)", columnName: "projectScore", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Budget Year 1 (RM)", columnName: "budY1", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Budget Year 2 (RM)", columnName: "budY2", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Budget Year 3 (RM)", columnName: "budY3", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Budget Year 4 (RM)", columnName: "budY4", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Budget Year 5 (RM)", columnName: "budY5", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Budget Year 6 (RM)", columnName: "budY6", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Budget Year 7 (RM)", columnName: "budY7", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Budget Year 8 (RM)", columnName: "budY8", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
    ];
}
//===============================================================
// TEMPLATE END: portfolio.interface.ts.1.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.interface.ts.1.2.tpl
//===============================================================
export function hdrDefComparisonPrioritisedGridHdr()
{
    return [
 {displayName: "Project Definition", columnName: "ProjectDefinition", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Project Description", columnName: "UDProjectDescription", columnTypeId: 1.0, columnType: "Text", columnWidth: "250px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Strategic Objective", columnName: "UDStrategicObjective", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Sub-strategic Objective for Reliability", columnName: "UDIBRNarrativeMR", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Sub-strategic Objective for High Profile Area", columnName: "UDIBRNarrativeHPA", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Project Category", columnName: "UDCategory", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Project Type", columnName: "UDProjectType", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "110px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Voltage", columnName: "UDVoltagekV", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "60px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "State", columnName: "StateName", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "100px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Business Area", columnName: "BusinessAreaName", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Before Revised (RM)", columnName: "Budget_Before_Revised", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Total Budget (RM)", columnName: "Total_Budget", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Risk Reduced (RM)", columnName: "Risk_Reduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "OPEX (RM)", columnName: "TCO_Opex", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Total Project Cost (RM)", columnName: "TCO_TotalProjectCost", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "NPV Risk Reduced (RM)", columnName: "NPV_RiskReduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Project Score (NPV Risk Reduced/TCO)", columnName: "Project_Score", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Scope 1 Duration (Months)", columnName: "Month_Scope_1", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 1 Start Month", columnName: "Start_Month_Scope_1", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 2 Duration (Months)", columnName: "Month_Scope_2", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 2 Start Month", columnName: "Start_Month_Scope_2", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 3 Duration (Months)", columnName: "Month_Scope_3", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 3 Start Month", columnName: "Start_Month_Scope_3", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 4 Duration (Months)", columnName: "Month_Scope_4", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 4 Start Month", columnName: "Start_Month_Scope_4", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Comm Month", columnName: "Comm_Month", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Target Comm Month", columnName: "Target_Comm_Month", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Mandatory", columnName: "Mandatory", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 1 (RM)", columnName: "BUDY1", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 2 (RM)", columnName: "BUDY2", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 3 (RM)", columnName: "BUDY3", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 4 (RM)", columnName: "BUDY4", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 5 (RM)", columnName: "BUDY5", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 6 (RM)", columnName: "BUDY6", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 7 (RM)", columnName: "BUDY7", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 8 (RM)", columnName: "BUDY8", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Defer Action", columnName: "defer_Action", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Justification", columnName: "justification", columnTypeId: 1.0, columnType: "Text", columnWidth: "250px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
    ];
}
//===============================================================
// TEMPLATE END: portfolio.interface.ts.1.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.interface.ts.1.2.tpl
//===============================================================
export function hdrDefComparisonDeprioritizedGridHdr()
{
    return [
 {displayName: "Project Definition", columnName: "projectDefinition", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Project Description", columnName: "udProjectDescription", columnTypeId: 1.0, columnType: "Text", columnWidth: "250px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Strategic Objective", columnName: "udStrategicObjective", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Sub-strategic Objective for Reliability", columnName: "udIBRNarrativeMR", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Sub-strategic Objective for High Profile Area", columnName: "udIBRNarrativeHPA", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Project Category", columnName: "udCategory", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Project Type", columnName: "udProjectType", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Voltage", columnName: "udVoltagekV", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "60px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "State", columnName: "udcfG_GeoStateCode", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "100px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Business Area", columnName: "udcfG_BusinessAreaName", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Before Revised (RM)", columnName: "budgetBeforeRevised", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Total Budget (RM)", columnName: "totalBudget", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Risk Reduced (RM)", columnName: "riskReduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "OPEX (RM)", columnName: "tcoOpex", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Total Project Cost (RM)", columnName: "tcoTotalProjectCost", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "NPV Risk Reduced (RM)", columnName: "npvRiskReduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Project Score (NPV Risk Reduced/TCO)", columnName: "projectScore", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
    ];
}
//===============================================================
// TEMPLATE END: portfolio.interface.ts.1.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.interface.ts.1.2.tpl
//===============================================================
export function hdrDefComparisonCategorizedPrio_1GridHdr()
{
    return [
 {displayName: "Strategic Objective", columnName: "udStrategicObjective", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "130px", isSearchable: true, isSortable: false, display: true, toolTip: "" },
 {displayName: "Sub-strategic Objective for Reliability", columnName: "uDIBRNarrativeMR", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: true, isSortable: false, display: true, toolTip: "" },
 {displayName: "Sub-strategic Objective for High Profile Area", columnName: "uDIBRNarrativeHPA", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: true, isSortable: false, display: true, toolTip: "" },
 {displayName: "Voltage", columnName: "udVoltagekV", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "60px", isSearchable: true, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Project", columnName: "total_Project", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Budget Before Revised (RM)", columnName: "budget_Before_Revised", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "Total Budget (RM)", columnName: "total_Budget", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "Risk Reduced (RM)", columnName: "risk_Reduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "OPEX (RM)", columnName: "tcO_Opex", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "Total Project Cost (RM)", columnName: "tcO_TotalProjectCost", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "NPV Risk Reduced (RM)", columnName: "npV_RiskReduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "Project Score (NPV Risk Reduced/TCO)", columnName: "project_Score", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "Budget Year 1 (RM)", columnName: "budY1", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 2 (RM)", columnName: "budY2", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 3 (RM)", columnName: "budY3", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 4 (RM)", columnName: "budY4", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 5 (RM)", columnName: "budY5", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 6 (RM)", columnName: "budY6", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 7 (RM)", columnName: "budY7", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 8 (RM)", columnName: "budY8", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
    ];
}
//===============================================================
// TEMPLATE END: portfolio.interface.ts.1.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.interface.ts.1.2.tpl
//===============================================================
export function hdrDefComparisonCategorizedPrio_2GridHdr()
{
    return [
 {displayName: "Strategic Objective", columnName: "udStrategicObjective", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "130px", isSearchable: true, isSortable: false, display: true, toolTip: "" },
 {displayName: "Voltage", columnName: "udVoltagekV", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "60px", isSearchable: true, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Project", columnName: "total_Project", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Budget Before Revised (RM)", columnName: "budget_Before_Revised", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "Total Budget (RM)", columnName: "total_Budget", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "Risk Reduced (RM)", columnName: "risk_Reduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "OPEX (RM)", columnName: "tcO_Opex", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "Total Project Cost (RM)", columnName: "tcO_TotalProjectCost", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "NPV Risk Reduced (RM)", columnName: "npV_RiskReduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "Project Score (NPV Risk Reduced/TCO)", columnName: "project_Score", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "Budget Year 1 (RM)", columnName: "budY1", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 2 (RM)", columnName: "budY2", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 3 (RM)", columnName: "budY3", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 4 (RM)", columnName: "budY4", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 5 (RM)", columnName: "budY5", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 6 (RM)", columnName: "budY6", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 7 (RM)", columnName: "budY7", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 8 (RM)", columnName: "budY8", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
    ];
}
//===============================================================
// TEMPLATE END: portfolio.interface.ts.1.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.interface.ts.1.2.tpl
//===============================================================
export function hdrDefComparisonCategorizedDeprio_1GridHdr()
{
    return [
 {displayName: "Strategic Objective", columnName: "udStrategicObjective", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "130px", isSearchable: true, isSortable: false, display: true, toolTip: "" },
 {displayName: "Sub-strategic Objective for Reliability", columnName: "uDIBRNarrativeMR", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: true, isSortable: false, display: true, toolTip: "" },
 {displayName: "Sub-strategic Objective for High Profile Area", columnName: "uDIBRNarrativeHPA", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: true, isSortable: false, display: true, toolTip: "" },
 {displayName: "Voltage", columnName: "udVoltagekV", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "60px", isSearchable: true, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Project", columnName: "total_Project", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Budget Before Revised (RM)", columnName: "budget_Before_Revised", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Total Budget (RM)", columnName: "total_Budget", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Risk Reduced (RM)", columnName: "risk_Reduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "OPEX (RM)", columnName: "tcO_Opex", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Total Project Cost (RM)", columnName: "tcO_TotalProjectCost", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "NPV Risk Reduced (RM)", columnName: "npV_RiskReduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Project Score (NPV Risk Reduced/TCO)", columnName: "project_Score", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
    ];
}
//===============================================================
// TEMPLATE END: portfolio.interface.ts.1.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.interface.ts.1.2.tpl
//===============================================================
export function hdrDefComparisonCategorizedDeprio_2GridHdr()
{
    return [
 {displayName: "Strategic Objective", columnName: "udStrategicObjective", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "130px", isSearchable: true, isSortable: false, display: true, toolTip: "" },
 {displayName: "Voltage", columnName: "udVoltagekV", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "60px", isSearchable: true, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Project", columnName: "total_Project", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Budget Before Revised (RM)", columnName: "budget_Before_Revised", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Total Budget (RM)", columnName: "total_Budget", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Risk Reduced (RM)", columnName: "risk_Reduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "OPEX (RM)", columnName: "tcO_Opex", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Total Project Cost (RM)", columnName: "tcO_TotalProjectCost", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "NPV Risk Reduced (RM)", columnName: "npV_RiskReduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Project Score (NPV Risk Reduced/TCO)", columnName: "project_Score", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
    ];
}
//===============================================================
// TEMPLATE END: portfolio.interface.ts.1.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.interface.ts.1.2.tpl
//===============================================================
export function hdrDefComparisonAlternateProjGridHdr()
{
    return [
 {displayName: "Project Definition", columnName: "ProjectDefinition", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Project Description", columnName: "UDProjectDescription", columnTypeId: 1.0, columnType: "Text", columnWidth: "250px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Strategic Objective", columnName: "UDStrategicObjective", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Sub-strategic Objective for Reliability", columnName: "UDIBRNarrativeMR", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Sub-strategic Objective for High Profile Area", columnName: "UDIBRNarrativeHPA", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Project Category", columnName: "UDCategory", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Project Type", columnName: "UDProjectType", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "110px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Voltage", columnName: "UDVoltagekV", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "60px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "State", columnName: "StateName", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "100px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Business Area", columnName: "BusinessAreaName", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Before Revised (RM)", columnName: "Budget_Before_Revised", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Total Budget (RM)", columnName: "Total_Budget", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Risk Reduced (RM)", columnName: "Risk_Reduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "OPEX (RM)", columnName: "TCO_Opex", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Total Project Cost (RM)", columnName: "TCO_TotalProjectCost", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "NPV Risk Reduced (RM)", columnName: "NPV_RiskReduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Project Score (NPV Risk Reduced/TCO) ", columnName: "Project_Score", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Scope 1 Duration (Months) ", columnName: "Month_Scope_1", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 1 Start Month ", columnName: "Start_Month_Scope_1", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 2 Duration (Months) ", columnName: "Month_Scope_2", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 2 Start Month ", columnName: "Start_Month_Scope_2", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 3 Duration (Months) ", columnName: "Month_Scope_3", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 3 Start Month ", columnName: "Start_Month_Scope_3", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 4 Duration (Months) ", columnName: "Month_Scope_4", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 4 Start Month ", columnName: "Start_Month_Scope_4", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Comm Month ", columnName: "Comm_Month", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Target Comm Month ", columnName: "Target_Comm_Month", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Mandatory ", columnName: "Mandatory", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 1 (RM) ", columnName: "BUDY1", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 2 (RM) ", columnName: "BUDY2", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 3 (RM) ", columnName: "BUDY3", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 4 (RM) ", columnName: "BUDY4", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 5 (RM) ", columnName: "BUDY5", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 6 (RM) ", columnName: "BUDY6", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 7 (RM) ", columnName: "BUDY7", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 8 (RM) ", columnName: "BUDY8", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Master Project Reproposal ID", columnName: "Reproposal_IDs", columnTypeId: 1.0, columnType: "Text", columnWidth: "150px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Action", columnName: "action", columnTypeId: 98.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: false, toolTip: "" },
    ];
}
//===============================================================
// TEMPLATE END: portfolio.interface.ts.1.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.interface.ts.1.2.tpl
//===============================================================
export function hdrDefComparisonSupplyGridHdr()
{
    return [
 {displayName: "Project Definition", columnName: "ProjectDefinition", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Project Description", columnName: "UDProjectDescription", columnTypeId: 1.0, columnType: "Text", columnWidth: "250px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Strategic Objective", columnName: "UDStrategicObjective", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Sub-strategic Objective for Reliability", columnName: "UDIBRNarrativeMR", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Sub-strategic Objective for High Profile Area", columnName: "UDIBRNarrativeHPA", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Project Category", columnName: "UDCategory", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Project Type", columnName: "UDProjectType", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Voltage", columnName: "UDVoltagekV", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "60px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "State", columnName: "StateName", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "100px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Business Area", columnName: "BusinessAreaName", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Budget (RM)", columnName: "Total_Budget", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Risk Reduced (RM)", columnName: "Risk_Reduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "OPEX (RM)", columnName: "TCO_Opex", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Total Project Cost (RM)", columnName: "TCO_TotalProjectCost", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "NPV Risk Reduced (RM)", columnName: "NPV_RiskReduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Project Score (NPV Risk Reduced/TCO)", columnName: "Project_Score", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Action", columnName: "action", columnTypeId: 98.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
    ];
}
//===============================================================
// TEMPLATE END: portfolio.interface.ts.1.2.tpl
//===============================================================

/* GENCODE:MARKER:5:END */

/* GENCODE:MARKER:6:START */

//===============================================================
// TEMPLATE START: portfolio.interface.ts.1.2.tpl
//===============================================================
export function hdrDefComparisonRightSummaryGridHdr()
{
    return [
 {displayName: "Summary of", columnName: "summary", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Project", columnName: "totalProject", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Budget Before Revised (RM)", columnName: "budgetBeforeRevised", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Budget (RM)", columnName: "totalBudget", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Risk Reduced (RM)", columnName: "riskReduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "OPEX (RM)", columnName: "tcoOpex", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Project Cost (RM)", columnName: "tcoTotalProjectCost", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "NPV Risk Reduced (RM)", columnName: "npvRiskReduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Project Score (NPV Risk Reduced/TCO)", columnName: "projectScore", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Budget Year 1 (RM)", columnName: "budY1", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Budget Year 2 (RM)", columnName: "budY2", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Budget Year 3 (RM)", columnName: "budY3", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Budget Year 4 (RM)", columnName: "budY4", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Budget Year 5 (RM)", columnName: "budY5", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Budget Year 6 (RM)", columnName: "budY6", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Budget Year 7 (RM)", columnName: "budY7", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Budget Year 8 (RM)", columnName: "budY8", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
    ];
}
//===============================================================
// TEMPLATE END: portfolio.interface.ts.1.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.interface.ts.1.2.tpl
//===============================================================
export function hdrDefComparisonRightPrioritisedGridHdr()
{
    return [
 {displayName: "Project Definition", columnName: "ProjectDefinition", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Project Description", columnName: "UDProjectDescription", columnTypeId: 1.0, columnType: "Text", columnWidth: "250px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Strategic Objective", columnName: "UDStrategicObjective", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Sub-strategic Objective for Reliability", columnName: "UDIBRNarrativeMR", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Sub-strategic Objective for High Profile Area", columnName: "UDIBRNarrativeHPA", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Project Category", columnName: "UDCategory", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Project Type", columnName: "UDProjectType", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "110px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Voltage", columnName: "UDVoltagekV", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "60px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "State", columnName: "StateName", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "100px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Business Area", columnName: "BusinessAreaName", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Before Revised (RM)", columnName: "Budget_Before_Revised", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Total Budget (RM)", columnName: "Total_Budget", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Risk Reduced (RM)", columnName: "Risk_Reduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "OPEX (RM)", columnName: "TCO_Opex", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Total Project Cost (RM)", columnName: "TCO_TotalProjectCost", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "NPV Risk Reduced (RM)", columnName: "NPV_RiskReduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Project Score (NPV Risk Reduced/TCO)", columnName: "Project_Score", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Scope 1 Duration (Months)", columnName: "Month_Scope_1", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 1 Start Month", columnName: "Start_Month_Scope_1", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 2 Duration (Months)", columnName: "Month_Scope_2", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 2 Start Month", columnName: "Start_Month_Scope_2", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 3 Duration (Months)", columnName: "Month_Scope_3", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 3 Start Month", columnName: "Start_Month_Scope_3", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 4 Duration (Months)", columnName: "Month_Scope_4", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 4 Start Month", columnName: "Start_Month_Scope_4", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Comm Month", columnName: "Comm_Month", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Target Comm Month", columnName: "Target_Comm_Month", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Mandatory", columnName: "Mandatory", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 1 (RM)", columnName: "BUDY1", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 2 (RM)", columnName: "BUDY2", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 3 (RM)", columnName: "BUDY3", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 4 (RM)", columnName: "BUDY4", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 5 (RM)", columnName: "BUDY5", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 6 (RM)", columnName: "BUDY6", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 7 (RM)", columnName: "BUDY7", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 8 (RM)", columnName: "BUDY8", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
    ];
}
//===============================================================
// TEMPLATE END: portfolio.interface.ts.1.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.interface.ts.1.2.tpl
//===============================================================
export function hdrDefComparisonRightDeprioritizedGridHdr()
{
    return [
 {displayName: "Project Definition", columnName: "projectDefinition", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Project Description", columnName: "udProjectDescription", columnTypeId: 1.0, columnType: "Text", columnWidth: "250px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Strategic Objective", columnName: "udStrategicObjective", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Sub-strategic Objective for Reliability", columnName: "udIBRNarrativeMR", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Sub-strategic Objective for High Profile Area", columnName: "udIBRNarrativeHPA", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Project Category", columnName: "udCategory", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Project Type", columnName: "udProjectType", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Voltage", columnName: "udVoltagekV", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "60px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "State", columnName: "udcfG_GeoStateCode", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "100px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Business Area", columnName: "udcfG_BusinessAreaName", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Before Revised (RM)", columnName: "budgetBeforeRevised", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Total Budget (RM)", columnName: "totalBudget", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Risk Reduced (RM)", columnName: "riskReduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "OPEX (RM)", columnName: "tcoOpex", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Total Project Cost (RM)", columnName: "tcoTotalProjectCost", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "NPV Risk Reduced (RM)", columnName: "npvRiskReduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Project Score (NPV Risk Reduced/TCO)", columnName: "projectScore", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
    ];
}
//===============================================================
// TEMPLATE END: portfolio.interface.ts.1.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.interface.ts.1.2.tpl
//===============================================================
export function hdrDefComparisonRightCategorizedPrio_1GridHdr()
{
    return [
 {displayName: "Strategic Objective", columnName: "udStrategicObjective", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "130px", isSearchable: true, isSortable: false, display: true, toolTip: "" },
 {displayName: "Sub-strategic Objective for Reliability", columnName: "uDIBRNarrativeMR", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: true, isSortable: false, display: true, toolTip: "" },
 {displayName: "Sub-strategic Objective for High Profile Area", columnName: "uDIBRNarrativeHPA", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: true, isSortable: false, display: true, toolTip: "" },
 {displayName: "Voltage", columnName: "udVoltagekV", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "60px", isSearchable: true, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Project", columnName: "total_Project", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Budget Before Revised (RM)", columnName: "budget_Before_Revised", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "Total Budget (RM)", columnName: "total_Budget", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "Risk Reduced (RM)", columnName: "risk_Reduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "OPEX (RM)", columnName: "tcO_Opex", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "Total Project Cost (RM)", columnName: "tcO_TotalProjectCost", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "NPV Risk Reduced (RM)", columnName: "npV_RiskReduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "Project Score (NPV Risk Reduced/TCO)", columnName: "project_Score", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "Budget Year 1 (RM)", columnName: "budY1", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 2 (RM)", columnName: "budY2", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 3 (RM)", columnName: "budY3", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 4 (RM)", columnName: "budY4", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 5 (RM)", columnName: "budY5", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 6 (RM)", columnName: "budY6", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 7 (RM)", columnName: "budY7", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 8 (RM)", columnName: "budY8", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
    ];
}
//===============================================================
// TEMPLATE END: portfolio.interface.ts.1.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.interface.ts.1.2.tpl
//===============================================================
export function hdrDefComparisonRightCategorizedPrio_2GridHdr()
{
    return [
 {displayName: "Strategic Objective", columnName: "udStrategicObjective", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "130px", isSearchable: true, isSortable: false, display: true, toolTip: "" },
 {displayName: "Voltage", columnName: "udVoltagekV", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "60px", isSearchable: true, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Project", columnName: "total_Project", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Budget Before Revised (RM)", columnName: "budget_Before_Revised", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "Total Budget (RM)", columnName: "total_Budget", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "Risk Reduced (RM)", columnName: "risk_Reduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "OPEX (RM)", columnName: "tcO_Opex", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "Total Project Cost (RM)", columnName: "tcO_TotalProjectCost", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "NPV Risk Reduced (RM)", columnName: "npV_RiskReduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "Project Score (NPV Risk Reduced/TCO)", columnName: "project_Score", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: false, toolTip: "" },
 {displayName: "Budget Year 1 (RM)", columnName: "budY1", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 2 (RM)", columnName: "budY2", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 3 (RM)", columnName: "budY3", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 4 (RM)", columnName: "budY4", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 5 (RM)", columnName: "budY5", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 6 (RM)", columnName: "budY6", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 7 (RM)", columnName: "budY7", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 8 (RM)", columnName: "budY8", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
    ];
}
//===============================================================
// TEMPLATE END: portfolio.interface.ts.1.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.interface.ts.1.2.tpl
//===============================================================
export function hdrDefComparisonRightCategorizedDeprio_1GridHdr()
{
    return [
 {displayName: "Strategic Objective", columnName: "udStrategicObjective", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "130px", isSearchable: true, isSortable: false, display: true, toolTip: "" },
 {displayName: "Sub-strategic Objective for Reliability", columnName: "uDIBRNarrativeMR", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: true, isSortable: false, display: true, toolTip: "" },
 {displayName: "Sub-strategic Objective for High Profile Area", columnName: "uDIBRNarrativeHPA", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: true, isSortable: false, display: true, toolTip: "" },
 {displayName: "Voltage", columnName: "udVoltagekV", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "60px", isSearchable: true, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Project", columnName: "total_Project", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Budget Before Revised (RM)", columnName: "budget_Before_Revised", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Total Budget (RM)", columnName: "total_Budget", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Risk Reduced (RM)", columnName: "risk_Reduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "OPEX (RM)", columnName: "tcO_Opex", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Total Project Cost (RM)", columnName: "tcO_TotalProjectCost", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "NPV Risk Reduced (RM)", columnName: "npV_RiskReduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Project Score (NPV Risk Reduced/TCO)", columnName: "project_Score", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
    ];
}
//===============================================================
// TEMPLATE END: portfolio.interface.ts.1.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.interface.ts.1.2.tpl
//===============================================================
export function hdrDefComparisonRightCategorizedDeprio_2GridHdr()
{
    return [
 {displayName: "Strategic Objective", columnName: "udStrategicObjective", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "130px", isSearchable: true, isSortable: false, display: true, toolTip: "" },
 {displayName: "Voltage", columnName: "udVoltagekV", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "60px", isSearchable: true, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Project", columnName: "total_Project", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Budget Before Revised (RM)", columnName: "budget_Before_Revised", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Total Budget (RM)", columnName: "total_Budget", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Risk Reduced (RM)", columnName: "risk_Reduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "OPEX (RM)", columnName: "tcO_Opex", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Total Project Cost (RM)", columnName: "tcO_TotalProjectCost", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "NPV Risk Reduced (RM)", columnName: "npV_RiskReduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Project Score (NPV Risk Reduced/TCO)", columnName: "project_Score", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
    ];
}
//===============================================================
// TEMPLATE END: portfolio.interface.ts.1.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.interface.ts.1.2.tpl
//===============================================================
export function hdrDefComparisonRightAlternateProjGridHdr()
{
    return [
 {displayName: "Project Definition", columnName: "ProjectDefinition", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Project Description", columnName: "UDProjectDescription", columnTypeId: 1.0, columnType: "Text", columnWidth: "250px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Strategic Objective", columnName: "UDStrategicObjective", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Sub-strategic Objective for Reliability", columnName: "UDIBRNarrativeMR", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Sub-strategic Objective for High Profile Area", columnName: "UDIBRNarrativeHPA", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Project Category", columnName: "UDCategory", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Project Type", columnName: "UDProjectType", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "110px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Voltage", columnName: "UDVoltagekV", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "60px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "State", columnName: "StateName", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "100px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Business Area", columnName: "BusinessAreaName", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Before Revised (RM)", columnName: "Budget_Before_Revised", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Total Budget (RM)", columnName: "Total_Budget", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Risk Reduced (RM)", columnName: "Risk_Reduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "OPEX (RM)", columnName: "TCO_Opex", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Total Project Cost (RM)", columnName: "TCO_TotalProjectCost", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "NPV Risk Reduced (RM)", columnName: "NPV_RiskReduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Project Score (NPV Risk Reduced/TCO) ", columnName: "Project_Score", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Scope 1 Duration (Months) ", columnName: "Month_Scope_1", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 1 Start Month ", columnName: "Start_Month_Scope_1", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 2 Duration (Months) ", columnName: "Month_Scope_2", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 2 Start Month ", columnName: "Start_Month_Scope_2", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 3 Duration (Months) ", columnName: "Month_Scope_3", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 3 Start Month ", columnName: "Start_Month_Scope_3", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 4 Duration (Months) ", columnName: "Month_Scope_4", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Scope 4 Start Month ", columnName: "Start_Month_Scope_4", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Comm Month ", columnName: "Comm_Month", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Target Comm Month ", columnName: "Target_Comm_Month", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Mandatory ", columnName: "Mandatory", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 1 (RM) ", columnName: "BUDY1", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 2 (RM) ", columnName: "BUDY2", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 3 (RM) ", columnName: "BUDY3", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 4 (RM) ", columnName: "BUDY4", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 5 (RM) ", columnName: "BUDY5", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 6 (RM) ", columnName: "BUDY6", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 7 (RM) ", columnName: "BUDY7", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Budget Year 8 (RM) ", columnName: "BUDY8", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Master Project Reproposal ID", columnName: "Reproposal_IDs", columnTypeId: 1.0, columnType: "Text", columnWidth: "150px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Action", columnName: "action", columnTypeId: 98.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: false, toolTip: "" },
    ];
}
//===============================================================
// TEMPLATE END: portfolio.interface.ts.1.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.interface.ts.1.2.tpl
//===============================================================
export function hdrDefComparisonRightSupplyGridHdr()
{
    return [
 {displayName: "Project Definition", columnName: "ProjectDefinition", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Project Description", columnName: "UDProjectDescription", columnTypeId: 1.0, columnType: "Text", columnWidth: "250px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Strategic Objective", columnName: "UDStrategicObjective", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Sub-strategic Objective for Reliability", columnName: "UDIBRNarrativeMR", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Sub-strategic Objective for High Profile Area", columnName: "UDIBRNarrativeHPA", columnTypeId: 1.0, columnType: "Text", columnWidth: "130px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Project Category", columnName: "UDCategory", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Project Type", columnName: "UDProjectType", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Voltage", columnName: "UDVoltagekV", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "60px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "State", columnName: "StateName", columnTypeId: 2.0, columnType: "Drop Down", columnWidth: "100px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Business Area", columnName: "BusinessAreaName", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: false, display: true, toolTip: "" },
 {displayName: "Total Budget (RM)", columnName: "Total_Budget", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Risk Reduced (RM)", columnName: "Risk_Reduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "OPEX (RM)", columnName: "TCO_Opex", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Total Project Cost (RM)", columnName: "TCO_TotalProjectCost", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "NPV Risk Reduced (RM)", columnName: "NPV_RiskReduced", columnTypeId: 1.0, columnType: "Text", columnWidth: "90px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
 {displayName: "Project Score (NPV Risk Reduced/TCO)", columnName: "Project_Score", columnTypeId: 1.0, columnType: "Text", columnWidth: "100px", isSearchable: false, isSortable: true, display: true, toolTip: "" },
    ];
}
//===============================================================
// TEMPLATE END: portfolio.interface.ts.1.2.tpl
//===============================================================

/* GENCODE:MARKER:6:END */