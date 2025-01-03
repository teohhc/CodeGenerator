import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AipmFilterRequestModel, AIPMFilters, FilterBusinessArea, AipmGridColumn } from '@views/aipm/aipm.interface';
import { AIPM_COST_RESULT_TABLE_COLUMNS } from '@views/aipm/budget/aipm-budget.interface';
import { AipmCostService } from '@views/aipm/cost/cost.service';
import { AipmScenarioService } from '@views/aipm/scenario/scenario.service';
import * as Chart from 'chart.js';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { tap } from 'rxjs/operators';
import { PortfolioImportComponent } from '../../import/import.component';
import { IPortfolioSupplyResult, PortfolioResultChartData, PortfolioResultChartDataset, PORTFOLIO_APPROVED_RESULT_TABLE_COLUMN, PORTFOLIO_REJECTED_RESULT_TABLE_COLUMN, PORTFOLIO_SUMMARY_RESULT_TABLE_COLUMN, RESULT_SUPPLY_TABLE_COLUMN, IPortfolioSummaryCommonResult, PORTFOLIO_APPROVED_GROUPBY_RESULT_TABLE_COLUMN, PORTFOLIO_REJECTED_GROUPBY_RESULT_TABLE_COLUMN, PORTFOLIO_APPROVED_GROUPBY_RESULT_TABLE_COLUMN2, PORTFOLIO_REJECTED_GROUPBY_RESULT_TABLE_COLUMN2, hdrDefComparisonSummaryGridHdr, hdrDefComparisonPrioritisedGridHdr, hdrDefComparisonRightSummaryGridHdr, hdrDefComparisonRightPrioritisedGridHdr, hdrDefComparisonSupplyGridHdr, hdrDefComparisonRightSupplyGridHdr, hdrDefComparisonDeprioritizedGridHdr, hdrDefComparisonRightDeprioritizedGridHdr, hdrDefComparisonCategorizedPrio_1GridHdr, hdrDefComparisonRightCategorizedPrio_1GridHdr, hdrDefComparisonCategorizedPrio_2GridHdr, hdrDefComparisonRightCategorizedPrio_2GridHdr, hdrDefComparisonCategorizedDeprio_1GridHdr, hdrDefComparisonRightCategorizedDeprio_1GridHdr, hdrDefComparisonCategorizedDeprio_2GridHdr, hdrDefComparisonRightCategorizedDeprio_2GridHdr 
  , hdrDefComparisonAlternateProjGridHdr, hdrDefComparisonRightAlternateProjGridHdr 
/* GENCODE:MARKER:21:START */

//===============================================================
// TEMPLATE START: gridcomponent.ts.4.1.tpl
//===============================================================
,hdrDefInclusiveExclusiveDataGridHdr
//===============================================================
// TEMPLATE END: gridcomponent.ts.4.1.tpl
//===============================================================

/* GENCODE:MARKER:21:END */
} from '../../portfolio.interface';
import { AipmPortfolioService } from '../../portfolio.service';
import { IScenario } from '@views/aipm/scenario/scenario.interface';
import { FloatingBar } from '@shared/floatingbar/component/floatingbar.component';
//import { Pivot } from '../pivot/pivot.component';
import { NONE_TYPE } from '@angular/compiler';
import * as htmlToImage from 'html-to-image';
import { saveAs} from 'file-saver';
import * as XLSX from 'xlsx';
import { forkJoin } from 'rxjs';


const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-aipm-portfolio-result-comparison',
  templateUrl: './comparison.component.html',
  styleUrls: ['./comparison.component.scss']
})
export class ComparisonComponent implements OnInit {

  filterList: any[];
//  pivotData: any[];

  public fbar: FloatingBar;
//  public pivot: Pivot;
  public filters: AIPMFilters;
  public reqModel: AipmFilterRequestModel = {};
  public baList: FilterBusinessArea[];
  public loading: boolean = true;
  public scenarioId: number;
  public modal: Partial<{
    title: string;
    data: any;
    show: boolean;
    result: boolean;
    importFrom: string;
    type: "import" | "detail";
  }> = {};
  public form: FormGroup;
  
  editable: boolean = false;
  numberOfYears: number;
  numberOfYears2: number;

  @ViewChild("chart")
  private chartRef: ElementRef;
  public chart: Chart;
  chartData: any;
  chartRefData: PortfolioResultChartData;

  compared: boolean = false;
  cycleId: number;
  projectList: IScenario[] = [];
  comparisonProjectList: IScenario[] = [];
  compareForm: FormGroup;
  compareScenarioId: number;
  compareItem=[
    {'number':0,'name':'compare0'}
  ];
  compareCount=0;
  compareMax=5;
  currentItemNo=null;
  
  @ViewChild("compareChart") compareChartRef: ElementRef;
  public compareChart: Chart;
  compareChartData: any;
  compareChartRefData: PortfolioResultChartData;

  // listOfSummaryCommon: IPortfolioSummaryCommonResult[] = [];
/*
  objectEvents = {
    'tableGrid1': {
      'renderFlag':false
    }
  }
*/

private isResultApprovedFetched = false;
private isResultApprovedCompareFetched = false;

public allSummaryGridCol: AipmGridColumn[];
public allPrioSummaryGridData: any[];
public allDeprioSummaryGridData: any[];
public allProjSummaryGridData: any[];

public testHighest = {
  "column": "colLabel",
  "content": "Total Project Score (NPV Risk Reduced/TCO)",
  "comparison": "max",
  "excludeCols":["colCategory","colLabel"],
  "style": "background",
  "color": "rgba(0,255,0,0.7)"
}

/* GENCODE:MARKER:15:START */

//===============================================================
// TEMPLATE START: gridcomponent.ts.1.3.tpl
//===============================================================
    public ComparisonSummaryGrid: any[];

    public ComparisonSummaryGridHdr = hdrDefComparisonSummaryGridHdr();
    public ComparisonSummaryGridInfoCFGRule = {
      'freeze': {
        'left': ['summary'], 
        'right':[]
      },
      'format': {
 'totalProject': { 'type': 'number', 'format': '1.0-0' },
 'budgetBeforeRevised': { 'type': 'number', 'format': '1.2-2' },
 'totalBudget': { 'type': 'number', 'format': '1.2-2' },
 'riskReduced': { 'type': 'number', 'format': '1.2-2' },
 'tcoOpex': { 'type': 'number', 'format': '1.2-2' },
 'tcoTotalProjectCost': { 'type': 'number', 'format': '1.2-2' },
 'npvRiskReduced': { 'type': 'number', 'format': '1.2-2' },
 'projectScore': { 'type': 'number', 'format': '1.3-3' },
 'budY1': { 'type': 'number', 'format': '1.2-2' },
 'budY2': { 'type': 'number', 'format': '1.2-2' },
 'budY3': { 'type': 'number', 'format': '1.2-2' },
 'budY4': { 'type': 'number', 'format': '1.2-2' },
 'budY5': { 'type': 'number', 'format': '1.2-2' },
 'budY6': { 'type': 'number', 'format': '1.2-2' },
 'budY7': { 'type': 'number', 'format': '1.2-2' },
 'budY8': { 'type': 'number', 'format': '1.2-2' },
 'beyondHorizon': { 'type': 'number', 'format': '1.2-2' },
      },
      'mergeRule': [],
      'highlightRule': {},
      'totalRule': {'projectScore':'npvRiskReduced / ( tcoOpex + tcoTotalProjectCost )'},
      'actionRule': [],
    };
//===============================================================
// TEMPLATE END: gridcomponent.ts.1.3.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.1.3.tpl
//===============================================================
    public ComparisonPrioritisedGrid: any[];

    public ComparisonPrioritisedGridHdr = hdrDefComparisonPrioritisedGridHdr();
    public ComparisonPrioritisedGridInfoCFGRule = {
      'freeze': {
        'left': ['ProjectDefinition','UDProjectDescription'], 
        'right':[]
      },
      'format': {
 'Budget_Before_Revised': { 'type': 'number', 'format': '1.2-2' },
 'Total_Budget': { 'type': 'number', 'format': '1.2-2' },
 'Risk_Reduced': { 'type': 'number', 'format': '1.2-2' },
 'TCO_Opex': { 'type': 'number', 'format': '1.2-2' },
 'TCO_TotalProjectCost': { 'type': 'number', 'format': '1.2-2' },
 'NPV_RiskReduced': { 'type': 'number', 'format': '1.2-2' },
 'Project_Score': { 'type': 'number', 'format': '1.3-3' },
 'Start_Month_Scope_1': { 'type': 'date', 'format': 'MMM yyyy' },
 'Start_Month_Scope_2': { 'type': 'date', 'format': 'MMM yyyy' },
 'Start_Month_Scope_3': { 'type': 'date', 'format': 'MMM yyyy' },
 'Start_Month_Scope_4': { 'type': 'date', 'format': 'MMM yyyy' },
 'Comm_Month': { 'type': 'date', 'format': 'MMM yyyy' },
 'Target_Comm_Month': { 'type': 'date', 'format': 'MMM yyyy' },
 'BUDY1': { 'type': 'number', 'format': '1.2-2' },
 'BUDY2': { 'type': 'number', 'format': '1.2-2' },
 'BUDY3': { 'type': 'number', 'format': '1.2-2' },
 'BUDY4': { 'type': 'number', 'format': '1.2-2' },
 'BUDY5': { 'type': 'number', 'format': '1.2-2' },
 'BUDY6': { 'type': 'number', 'format': '1.2-2' },
 'BUDY7': { 'type': 'number', 'format': '1.2-2' },
 'BUDY8': { 'type': 'number', 'format': '1.2-2' },
      },
      'mergeRule': [],
      'highlightRule': {},
      'totalRule': {},
      'actionRule': [],
    };
//===============================================================
// TEMPLATE END: gridcomponent.ts.1.3.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.1.3.tpl
//===============================================================
    public ComparisonDeprioritizedGrid: any[];

    public ComparisonDeprioritizedGridHdr = hdrDefComparisonDeprioritizedGridHdr();
    public ComparisonDeprioritizedGridInfoCFGRule = {
      'freeze': {
        'left': ['projectDefinition','udProjectDescription'], 
        'right':[]
      },
      'format': {
 'budgetBeforeRevised': { 'type': 'number', 'format': '1.2-2' },
 'totalBudget': { 'type': 'number', 'format': '1.2-2' },
 'riskReduced': { 'type': 'number', 'format': '1.2-2' },
 'tcoOpex': { 'type': 'number', 'format': '1.2-2' },
 'tcoTotalProjectCost': { 'type': 'number', 'format': '1.2-2' },
 'npvRiskReduced': { 'type': 'number', 'format': '1.2-2' },
 'projectScore': { 'type': 'number', 'format': '1.3-3' },
      },
      'mergeRule': [],
      'highlightRule': {},
      'totalRule': {},
      'actionRule': [],
    };
//===============================================================
// TEMPLATE END: gridcomponent.ts.1.3.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.1.3.tpl
//===============================================================
    public ComparisonCategorizedPrio_1Grid: any[];

    public ComparisonCategorizedPrio_1GridHdr = hdrDefComparisonCategorizedPrio_1GridHdr();
    public ComparisonCategorizedPrio_1GridInfoCFGRule = {
      'freeze': {
        'left': [], 
        'right':[]
      },
      'format': {
 'total_Project': { 'type': 'number', 'format': '1.0-0' },
 'budget_Before_Revised': { 'type': 'number', 'format': '1.2-2' },
 'total_Budget': { 'type': 'number', 'format': '1.2-2' },
 'risk_Reduced': { 'type': 'number', 'format': '1.2-2' },
 'tcO_Opex': { 'type': 'number', 'format': '1.2-2' },
 'tcO_TotalProjectCost': { 'type': 'number', 'format': '1.2-2' },
 'npV_RiskReduced': { 'type': 'number', 'format': '1.2-2' },
 'project_Score': { 'type': 'number', 'format': '1.3-3' },
 'budY1': { 'type': 'number', 'format': '1.2-2' },
 'budY2': { 'type': 'number', 'format': '1.2-2' },
 'budY3': { 'type': 'number', 'format': '1.2-2' },
 'budY4': { 'type': 'number', 'format': '1.2-2' },
 'budY5': { 'type': 'number', 'format': '1.2-2' },
 'budY6': { 'type': 'number', 'format': '1.2-2' },
 'budY7': { 'type': 'number', 'format': '1.2-2' },
 'budY8': { 'type': 'number', 'format': '1.2-2' },
      },
      'mergeRule': [{'type':'rowcol','instList':[{'direction':'row','areaList':{'keyCol':['udStrategicObjective'],'mergeCol':['udStrategicObjective','uDIBRNarrativeMR','uDIBRNarrativeHPA']}}]}],
      'highlightRule': {},
      'totalRule': {},
      'actionRule': [],
    };
//===============================================================
// TEMPLATE END: gridcomponent.ts.1.3.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.1.3.tpl
//===============================================================
    public ComparisonCategorizedPrio_2Grid: any[];

    public ComparisonCategorizedPrio_2GridHdr = hdrDefComparisonCategorizedPrio_2GridHdr();
    public ComparisonCategorizedPrio_2GridInfoCFGRule = {
      'freeze': {
        'left': [], 
        'right':[]
      },
      'format': {
 'total_Project': { 'type': 'number', 'format': '1.0-0' },
 'budget_Before_Revised': { 'type': 'number', 'format': '1.2-2' },
 'total_Budget': { 'type': 'number', 'format': '1.2-2' },
 'risk_Reduced': { 'type': 'number', 'format': '1.2-2' },
 'tcO_Opex': { 'type': 'number', 'format': '1.2-2' },
 'tcO_TotalProjectCost': { 'type': 'number', 'format': '1.2-2' },
 'npV_RiskReduced': { 'type': 'number', 'format': '1.2-2' },
 'project_Score': { 'type': 'number', 'format': '1.3-3' },
 'budY1': { 'type': 'number', 'format': '1.2-2' },
 'budY2': { 'type': 'number', 'format': '1.2-2' },
 'budY3': { 'type': 'number', 'format': '1.2-2' },
 'budY4': { 'type': 'number', 'format': '1.2-2' },
 'budY5': { 'type': 'number', 'format': '1.2-2' },
 'budY6': { 'type': 'number', 'format': '1.2-2' },
 'budY7': { 'type': 'number', 'format': '1.2-2' },
 'budY8': { 'type': 'number', 'format': '1.2-2' },
      },
      'mergeRule': [{'type':'rowcol','instList':[{'direction':'row','areaList':{'keyCol':['udStrategicObjective'],'mergeCol':['udStrategicObjective']}}]}],
      'highlightRule': {},
      'totalRule': {},
      'actionRule': [],
    };
//===============================================================
// TEMPLATE END: gridcomponent.ts.1.3.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.1.3.tpl
//===============================================================
    public ComparisonCategorizedDeprio_1Grid: any[];

    public ComparisonCategorizedDeprio_1GridHdr = hdrDefComparisonCategorizedDeprio_1GridHdr();
    public ComparisonCategorizedDeprio_1GridInfoCFGRule = {
      'freeze': {
        'left': [], 
        'right':[]
      },
      'format': {
 'total_Project': { 'type': 'number', 'format': '1.0-0' },
 'budget_Before_Revised': { 'type': 'number', 'format': '1.2-2' },
 'total_Budget': { 'type': 'number', 'format': '1.2-2' },
 'risk_Reduced': { 'type': 'number', 'format': '1.2-2' },
 'tcO_Opex': { 'type': 'number', 'format': '1.2-2' },
 'tcO_TotalProjectCost': { 'type': 'number', 'format': '1.2-2' },
 'npV_RiskReduced': { 'type': 'number', 'format': '1.2-2' },
 'project_Score': { 'type': 'number', 'format': '1.3-3' },
      },
      'mergeRule': [{'type':'rowcol','instList':[{'direction':'row','areaList':{'keyCol':['udStrategicObjective'],'mergeCol':['udStrategicObjective','uDIBRNarrativeMR','uDIBRNarrativeHPA']}}]}],
      'highlightRule': {},
      'totalRule': {},
      'actionRule': [],
    };
//===============================================================
// TEMPLATE END: gridcomponent.ts.1.3.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.1.3.tpl
//===============================================================
    public ComparisonCategorizedDeprio_2Grid: any[];

    public ComparisonCategorizedDeprio_2GridHdr = hdrDefComparisonCategorizedDeprio_2GridHdr();
    public ComparisonCategorizedDeprio_2GridInfoCFGRule = {
      'freeze': {
        'left': [], 
        'right':[]
      },
      'format': {
 'total_Project': { 'type': 'number', 'format': '1.0-0' },
 'budget_Before_Revised': { 'type': 'number', 'format': '1.2-2' },
 'total_Budget': { 'type': 'number', 'format': '1.2-2' },
 'risk_Reduced': { 'type': 'number', 'format': '1.2-2' },
 'tcO_Opex': { 'type': 'number', 'format': '1.2-2' },
 'tcO_TotalProjectCost': { 'type': 'number', 'format': '1.2-2' },
 'npV_RiskReduced': { 'type': 'number', 'format': '1.2-2' },
 'project_Score': { 'type': 'number', 'format': '1.3-3' },
      },
      'mergeRule': [{'type':'rowcol','instList':[{'direction':'row','areaList':{'keyCol':['udStrategicObjective'],'mergeCol':['udStrategicObjective']}}]}],
      'highlightRule': {},
      'totalRule': {},
      'actionRule': [],
    };
//===============================================================
// TEMPLATE END: gridcomponent.ts.1.3.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.1.3.tpl
//===============================================================
    public ComparisonAlternateProjGrid: any[];

    public ComparisonAlternateProjGridHdr = hdrDefComparisonAlternateProjGridHdr();
    public ComparisonAlternateProjGridInfoCFGRule = {
      'freeze': {
        'left': ['ProjectDefinition','UDProjectDescription'], 
        'right':[]
      },
      'format': {
 'Budget_Before_Revised': { 'type': 'number', 'format': '1.2-2' },
 'Total_Budget': { 'type': 'number', 'format': '1.2-2' },
 'Risk_Reduced': { 'type': 'number', 'format': '1.2-2' },
 'TCO_Opex': { 'type': 'number', 'format': '1.2-2' },
 'TCO_TotalProjectCost': { 'type': 'number', 'format': '1.2-2' },
 'NPV_RiskReduced': { 'type': 'number', 'format': '1.2-2' },
 'Project_Score': { 'type': 'number', 'format': '1.3-3' },
 'Start_Month_Scope_1': { 'type': 'date', 'format': 'MMM yyyy' },
 'Start_Month_Scope_2': { 'type': 'date', 'format': 'MMM yyyy' },
 'Start_Month_Scope_3': { 'type': 'date', 'format': 'MMM yyyy' },
 'Start_Month_Scope_4': { 'type': 'date', 'format': 'MMM yyyy' },
 'Comm_Month': { 'type': 'date', 'format': 'MMM yyyy' },
 'Target_Comm_Month': { 'type': 'date', 'format': 'MMM yyyy' },
 'BUDY1': { 'type': 'number', 'format': '1.2-2' },
 'BUDY2': { 'type': 'number', 'format': '1.2-2' },
 'BUDY3': { 'type': 'number', 'format': '1.2-2' },
 'BUDY4': { 'type': 'number', 'format': '1.2-2' },
 'BUDY5': { 'type': 'number', 'format': '1.2-2' },
 'BUDY6': { 'type': 'number', 'format': '1.2-2' },
 'BUDY7': { 'type': 'number', 'format': '1.2-2' },
 'BUDY8': { 'type': 'number', 'format': '1.2-2' },
      },
      'mergeRule': [],
      'highlightRule': {},
      'totalRule': {},
      'actionRule': [],
    };
//===============================================================
// TEMPLATE END: gridcomponent.ts.1.3.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.1.3.tpl
//===============================================================
    public ComparisonSupplyGrid: any[];

    public ComparisonSupplyGridHdr = hdrDefComparisonSupplyGridHdr();
    public ComparisonSupplyGridInfoCFGRule = {
      'freeze': {
        'left': ['ProjectDefinition','UDProjectDescription'], 
        'right':[]
      },
      'format': {
 'Total_Budget': { 'type': 'number', 'format': '1.2-2' },
 'Risk_Reduced': { 'type': 'number', 'format': '1.2-2' },
 'TCO_Opex': { 'type': 'number', 'format': '1.2-2' },
 'TCO_TotalProjectCost': { 'type': 'number', 'format': '1.2-2' },
 'NPV_RiskReduced': { 'type': 'number', 'format': '1.2-2' },
 'Project_Score': { 'type': 'number', 'format': '1.2-2' },
      },
      'mergeRule': [],
      'highlightRule': {},
      'totalRule': {},
      'actionRule': [],
    };
//===============================================================
// TEMPLATE END: gridcomponent.ts.1.3.tpl
//===============================================================

/* GENCODE:MARKER:15:END */

/* GENCODE:MARKER:18:START */

//===============================================================
// TEMPLATE START: gridcomponent.ts.1.3.tpl
//===============================================================
    public InclusiveExclusiveDataGrid: any[];

    public InclusiveExclusiveDataGridHdr = hdrDefInclusiveExclusiveDataGridHdr();
    public InclusiveExclusiveDataGridInfoCFGRule = {
      'freeze': {
        'left': ['ProjectDefinition','UDProjectDescription'], 
        'right':['action']
      },
      'format': {
 'Budget_Before_Revised': { 'type': 'number', 'format': '1.2-2' },
 'Total_Budget': { 'type': 'number', 'format': '1.2-2' },
 'Risk_Reduced': { 'type': 'number', 'format': '1.2-2' },
 'TCO_Opex': { 'type': 'number', 'format': '1.2-2' },
 'TCO_TotalProjectCost': { 'type': 'number', 'format': '1.2-2' },
 'NPV_RiskReduced': { 'type': 'number', 'format': '1.2-2' },
 'Project_Score': { 'type': 'number', 'format': '1.3-3' },
 'Start_Month_Scope_1': { 'type': 'date', 'format': 'MMM yyyy' },
 'Start_Month_Scope_2': { 'type': 'date', 'format': 'MMM yyyy' },
 'Start_Month_Scope_3': { 'type': 'date', 'format': 'MMM yyyy' },
 'Start_Month_Scope_4': { 'type': 'date', 'format': 'MMM yyyy' },
 'Comm_Month': { 'type': 'date', 'format': 'MMM yyyy' },
 'Target_Comm_Month': { 'type': 'date', 'format': 'MMM yyyy' },
 'BUDY1': { 'type': 'number', 'format': '1.2-2' },
 'BUDY2': { 'type': 'number', 'format': '1.2-2' },
 'BUDY3': { 'type': 'number', 'format': '1.2-2' },
 'BUDY4': { 'type': 'number', 'format': '1.2-2' },
 'BUDY5': { 'type': 'number', 'format': '1.2-2' },
 'BUDY6': { 'type': 'number', 'format': '1.2-2' },
 'BUDY7': { 'type': 'number', 'format': '1.2-2' },
 'BUDY8': { 'type': 'number', 'format': '1.2-2' },
      },
      'mergeRule': [],
      'highlightRule': {},
      'totalRule': {},
      'actionRule': [],
    };
//===============================================================
// TEMPLATE END: gridcomponent.ts.1.3.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.1.3.tpl
//===============================================================
    public ComparisonRightSummaryGrid: any[];

    public ComparisonRightSummaryGridHdr = hdrDefComparisonRightSummaryGridHdr();
    public ComparisonRightSummaryGridInfoCFGRule = {
      'freeze': {
        'left': ['summary'], 
        'right':[]
      },
      'format': {
 'totalProject': { 'type': 'number', 'format': '1.0-0' },
 'budgetBeforeRevised': { 'type': 'number', 'format': '1.2-2' },
 'totalBudget': { 'type': 'number', 'format': '1.2-2' },
 'riskReduced': { 'type': 'number', 'format': '1.2-2' },
 'tcoOpex': { 'type': 'number', 'format': '1.2-2' },
 'tcoTotalProjectCost': { 'type': 'number', 'format': '1.2-2' },
 'npvRiskReduced': { 'type': 'number', 'format': '1.2-2' },
 'projectScore': { 'type': 'number', 'format': '1.3-3' },
 'budY1': { 'type': 'number', 'format': '1.2-2' },
 'budY2': { 'type': 'number', 'format': '1.2-2' },
 'budY3': { 'type': 'number', 'format': '1.2-2' },
 'budY4': { 'type': 'number', 'format': '1.2-2' },
 'budY5': { 'type': 'number', 'format': '1.2-2' },
 'budY6': { 'type': 'number', 'format': '1.2-2' },
 'budY7': { 'type': 'number', 'format': '1.2-2' },
 'budY8': { 'type': 'number', 'format': '1.2-2' },
 'beyondHorizon': { 'type': 'number', 'format': '1.2-2' },
      },
      'mergeRule': [],
      'highlightRule': {},
      'totalRule': {'projectScore':'npvRiskReduced / ( tcoOpex + tcoTotalProjectCost )'},
      'actionRule': [],
    };
//===============================================================
// TEMPLATE END: gridcomponent.ts.1.3.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.1.3.tpl
//===============================================================
    public ComparisonRightPrioritisedGrid: any[];

    public ComparisonRightPrioritisedGridHdr = hdrDefComparisonRightPrioritisedGridHdr();
    public ComparisonRightPrioritisedGridInfoCFGRule = {
      'freeze': {
        'left': ['ProjectDefinition','UDProjectDescription'], 
        'right':[]
      },
      'format': {
 'Budget_Before_Revised': { 'type': 'number', 'format': '1.2-2' },
 'Total_Budget': { 'type': 'number', 'format': '1.2-2' },
 'Risk_Reduced': { 'type': 'number', 'format': '1.2-2' },
 'TCO_Opex': { 'type': 'number', 'format': '1.2-2' },
 'TCO_TotalProjectCost': { 'type': 'number', 'format': '1.2-2' },
 'NPV_RiskReduced': { 'type': 'number', 'format': '1.2-2' },
 'Project_Score': { 'type': 'number', 'format': '1.3-3' },
 'Start_Month_Scope_1': { 'type': 'date', 'format': 'MMM yyyy' },
 'Start_Month_Scope_2': { 'type': 'date', 'format': 'MMM yyyy' },
 'Start_Month_Scope_3': { 'type': 'date', 'format': 'MMM yyyy' },
 'Start_Month_Scope_4': { 'type': 'date', 'format': 'MMM yyyy' },
 'Comm_Month': { 'type': 'date', 'format': 'MMM yyyy' },
 'Target_Comm_Month': { 'type': 'date', 'format': 'MMM yyyy' },
 'BUDY1': { 'type': 'number', 'format': '1.2-2' },
 'BUDY2': { 'type': 'number', 'format': '1.2-2' },
 'BUDY3': { 'type': 'number', 'format': '1.2-2' },
 'BUDY4': { 'type': 'number', 'format': '1.2-2' },
 'BUDY5': { 'type': 'number', 'format': '1.2-2' },
 'BUDY6': { 'type': 'number', 'format': '1.2-2' },
 'BUDY7': { 'type': 'number', 'format': '1.2-2' },
 'BUDY8': { 'type': 'number', 'format': '1.2-2' },
      },
      'mergeRule': [],
      'highlightRule': {},
      'totalRule': {},
      'actionRule': [],
    };
//===============================================================
// TEMPLATE END: gridcomponent.ts.1.3.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.1.3.tpl
//===============================================================
    public ComparisonRightDeprioritizedGrid: any[];

    public ComparisonRightDeprioritizedGridHdr = hdrDefComparisonRightDeprioritizedGridHdr();
    public ComparisonRightDeprioritizedGridInfoCFGRule = {
      'freeze': {
        'left': ['projectDefinition','udProjectDescription'], 
        'right':[]
      },
      'format': {
 'budgetBeforeRevised': { 'type': 'number', 'format': '1.2-2' },
 'totalBudget': { 'type': 'number', 'format': '1.2-2' },
 'riskReduced': { 'type': 'number', 'format': '1.2-2' },
 'tcoOpex': { 'type': 'number', 'format': '1.2-2' },
 'tcoTotalProjectCost': { 'type': 'number', 'format': '1.2-2' },
 'npvRiskReduced': { 'type': 'number', 'format': '1.2-2' },
 'projectScore': { 'type': 'number', 'format': '1.3-3' },
      },
      'mergeRule': [],
      'highlightRule': {},
      'totalRule': {},
      'actionRule': [],
    };
//===============================================================
// TEMPLATE END: gridcomponent.ts.1.3.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.1.3.tpl
//===============================================================
    public ComparisonRightCategorizedPrio_1Grid: any[];

    public ComparisonRightCategorizedPrio_1GridHdr = hdrDefComparisonRightCategorizedPrio_1GridHdr();
    public ComparisonRightCategorizedPrio_1GridInfoCFGRule = {
      'freeze': {
        'left': [], 
        'right':[]
      },
      'format': {
 'total_Project': { 'type': 'number', 'format': '1.0-0' },
 'budget_Before_Revised': { 'type': 'number', 'format': '1.2-2' },
 'total_Budget': { 'type': 'number', 'format': '1.2-2' },
 'risk_Reduced': { 'type': 'number', 'format': '1.2-2' },
 'tcO_Opex': { 'type': 'number', 'format': '1.2-2' },
 'tcO_TotalProjectCost': { 'type': 'number', 'format': '1.2-2' },
 'npV_RiskReduced': { 'type': 'number', 'format': '1.2-2' },
 'project_Score': { 'type': 'number', 'format': '1.3-3' },
 'budY1': { 'type': 'number', 'format': '1.2-2' },
 'budY2': { 'type': 'number', 'format': '1.2-2' },
 'budY3': { 'type': 'number', 'format': '1.2-2' },
 'budY4': { 'type': 'number', 'format': '1.2-2' },
 'budY5': { 'type': 'number', 'format': '1.2-2' },
 'budY6': { 'type': 'number', 'format': '1.2-2' },
 'budY7': { 'type': 'number', 'format': '1.2-2' },
 'budY8': { 'type': 'number', 'format': '1.2-2' },
      },
      'mergeRule': [{'type':'rowcol','instList':[{'direction':'row','areaList':{'keyCol':['udStrategicObjective'],'mergeCol':['udStrategicObjective','uDIBRNarrativeMR','uDIBRNarrativeHPA']}}]}],
      'highlightRule': {},
      'totalRule': {},
      'actionRule': [],
    };
//===============================================================
// TEMPLATE END: gridcomponent.ts.1.3.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.1.3.tpl
//===============================================================
    public ComparisonRightCategorizedPrio_2Grid: any[];

    public ComparisonRightCategorizedPrio_2GridHdr = hdrDefComparisonRightCategorizedPrio_2GridHdr();
    public ComparisonRightCategorizedPrio_2GridInfoCFGRule = {
      'freeze': {
        'left': [], 
        'right':[]
      },
      'format': {
 'total_Project': { 'type': 'number', 'format': '1.0-0' },
 'budget_Before_Revised': { 'type': 'number', 'format': '1.2-2' },
 'total_Budget': { 'type': 'number', 'format': '1.2-2' },
 'risk_Reduced': { 'type': 'number', 'format': '1.2-2' },
 'tcO_Opex': { 'type': 'number', 'format': '1.2-2' },
 'tcO_TotalProjectCost': { 'type': 'number', 'format': '1.2-2' },
 'npV_RiskReduced': { 'type': 'number', 'format': '1.2-2' },
 'project_Score': { 'type': 'number', 'format': '1.3-3' },
 'budY1': { 'type': 'number', 'format': '1.2-2' },
 'budY2': { 'type': 'number', 'format': '1.2-2' },
 'budY3': { 'type': 'number', 'format': '1.2-2' },
 'budY4': { 'type': 'number', 'format': '1.2-2' },
 'budY5': { 'type': 'number', 'format': '1.2-2' },
 'budY6': { 'type': 'number', 'format': '1.2-2' },
 'budY7': { 'type': 'number', 'format': '1.2-2' },
 'budY8': { 'type': 'number', 'format': '1.2-2' },
      },
      'mergeRule': [{'type':'rowcol','instList':[{'direction':'row','areaList':{'keyCol':['udStrategicObjective'],'mergeCol':['udStrategicObjective']}}]}],
      'highlightRule': {},
      'totalRule': {},
      'actionRule': [],
    };
//===============================================================
// TEMPLATE END: gridcomponent.ts.1.3.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.1.3.tpl
//===============================================================
    public ComparisonRightCategorizedDeprio_1Grid: any[];

    public ComparisonRightCategorizedDeprio_1GridHdr = hdrDefComparisonRightCategorizedDeprio_1GridHdr();
    public ComparisonRightCategorizedDeprio_1GridInfoCFGRule = {
      'freeze': {
        'left': [], 
        'right':[]
      },
      'format': {
 'total_Project': { 'type': 'number', 'format': '1.0-0' },
 'budget_Before_Revised': { 'type': 'number', 'format': '1.2-2' },
 'total_Budget': { 'type': 'number', 'format': '1.2-2' },
 'risk_Reduced': { 'type': 'number', 'format': '1.2-2' },
 'tcO_Opex': { 'type': 'number', 'format': '1.2-2' },
 'tcO_TotalProjectCost': { 'type': 'number', 'format': '1.2-2' },
 'npV_RiskReduced': { 'type': 'number', 'format': '1.2-2' },
 'project_Score': { 'type': 'number', 'format': '1.3-3' },
      },
      'mergeRule': [{'type':'rowcol','instList':[{'direction':'row','areaList':{'keyCol':['udStrategicObjective'],'mergeCol':['udStrategicObjective','uDIBRNarrativeMR','uDIBRNarrativeHPA']}}]}],
      'highlightRule': {},
      'totalRule': {},
      'actionRule': [],
    };
//===============================================================
// TEMPLATE END: gridcomponent.ts.1.3.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.1.3.tpl
//===============================================================
    public ComparisonRightCategorizedDeprio_2Grid: any[];

    public ComparisonRightCategorizedDeprio_2GridHdr = hdrDefComparisonRightCategorizedDeprio_2GridHdr();
    public ComparisonRightCategorizedDeprio_2GridInfoCFGRule = {
      'freeze': {
        'left': [], 
        'right':[]
      },
      'format': {
 'total_Project': { 'type': 'number', 'format': '1.0-0' },
 'budget_Before_Revised': { 'type': 'number', 'format': '1.2-2' },
 'total_Budget': { 'type': 'number', 'format': '1.2-2' },
 'risk_Reduced': { 'type': 'number', 'format': '1.2-2' },
 'tcO_Opex': { 'type': 'number', 'format': '1.2-2' },
 'tcO_TotalProjectCost': { 'type': 'number', 'format': '1.2-2' },
 'npV_RiskReduced': { 'type': 'number', 'format': '1.2-2' },
 'project_Score': { 'type': 'number', 'format': '1.3-3' },
      },
      'mergeRule': [{'type':'rowcol','instList':[{'direction':'row','areaList':{'keyCol':['udStrategicObjective'],'mergeCol':['udStrategicObjective']}}]}],
      'highlightRule': {},
      'totalRule': {},
      'actionRule': [],
    };
//===============================================================
// TEMPLATE END: gridcomponent.ts.1.3.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.1.3.tpl
//===============================================================
    public ComparisonRightAlternateProjGrid: any[];

    public ComparisonRightAlternateProjGridHdr = hdrDefComparisonRightAlternateProjGridHdr();
    public ComparisonRightAlternateProjGridInfoCFGRule = {
      'freeze': {
        'left': ['ProjectDefinition','UDProjectDescription'], 
        'right':[]
      },
      'format': {
 'Budget_Before_Revised': { 'type': 'number', 'format': '1.2-2' },
 'Total_Budget': { 'type': 'number', 'format': '1.2-2' },
 'Risk_Reduced': { 'type': 'number', 'format': '1.2-2' },
 'TCO_Opex': { 'type': 'number', 'format': '1.2-2' },
 'TCO_TotalProjectCost': { 'type': 'number', 'format': '1.2-2' },
 'NPV_RiskReduced': { 'type': 'number', 'format': '1.2-2' },
 'Project_Score': { 'type': 'number', 'format': '1.3-3' },
 'Start_Month_Scope_1': { 'type': 'date', 'format': 'MMM yyyy' },
 'Start_Month_Scope_2': { 'type': 'date', 'format': 'MMM yyyy' },
 'Start_Month_Scope_3': { 'type': 'date', 'format': 'MMM yyyy' },
 'Start_Month_Scope_4': { 'type': 'date', 'format': 'MMM yyyy' },
 'Comm_Month': { 'type': 'date', 'format': 'MMM yyyy' },
 'Target_Comm_Month': { 'type': 'date', 'format': 'MMM yyyy' },
 'BUDY1': { 'type': 'number', 'format': '1.2-2' },
 'BUDY2': { 'type': 'number', 'format': '1.2-2' },
 'BUDY3': { 'type': 'number', 'format': '1.2-2' },
 'BUDY4': { 'type': 'number', 'format': '1.2-2' },
 'BUDY5': { 'type': 'number', 'format': '1.2-2' },
 'BUDY6': { 'type': 'number', 'format': '1.2-2' },
 'BUDY7': { 'type': 'number', 'format': '1.2-2' },
 'BUDY8': { 'type': 'number', 'format': '1.2-2' },
      },
      'mergeRule': [],
      'highlightRule': {},
      'totalRule': {},
      'actionRule': [],
    };
//===============================================================
// TEMPLATE END: gridcomponent.ts.1.3.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.1.3.tpl
//===============================================================
    public ComparisonRightSupplyGrid: any[];

    public ComparisonRightSupplyGridHdr = hdrDefComparisonRightSupplyGridHdr();
    public ComparisonRightSupplyGridInfoCFGRule = {
      'freeze': {
        'left': ['ProjectDefinition','UDProjectDescription'], 
        'right':[]
      },
      'format': {
 'Total_Budget': { 'type': 'number', 'format': '1.2-2' },
 'Risk_Reduced': { 'type': 'number', 'format': '1.2-2' },
 'TCO_Opex': { 'type': 'number', 'format': '1.2-2' },
 'TCO_TotalProjectCost': { 'type': 'number', 'format': '1.2-2' },
 'NPV_RiskReduced': { 'type': 'number', 'format': '1.2-2' },
 'Project_Score': { 'type': 'number', 'format': '1.2-2' },
      },
      'mergeRule': [],
      'highlightRule': {},
      'totalRule': {},
      'actionRule': [],
    };
//===============================================================
// TEMPLATE END: gridcomponent.ts.1.3.tpl
//===============================================================

/* GENCODE:MARKER:18:END */

/* GENCODE:MARKER:11:START */

//===============================================================
// TEMPLATE START: gridcomponent.ts.1.2.tpl
//===============================================================
public tableGridRules_v2 = {
  'freeze': {
    'left': [], 
    'right':[]
  },
  'format': {
 'budY4': { 'type': 'number', 'format': '1.2-2' },
 'start_Month_Scope_3': { 'type': 'date', 'format': 'MMM yyyy' },
 'budY5': { 'type': 'number', 'format': '1.2-2' },
 'start_Month_Scope_4': { 'type': 'date', 'format': 'MMM yyyy' },
 'risk_Reduced': { 'type': 'number', 'format': '1.2-2' },
 'totalBudget': { 'type': 'number', 'format': '1.2-2' },
 'budY6': { 'type': 'number', 'format': '1.2-2' },
 'budY7': { 'type': 'number', 'format': '1.2-2' },
 'budY8': { 'type': 'number', 'format': '1.2-2' },
 'budgetBeforeRevised': { 'type': 'number', 'format': '1.2-2' },
 'target_Comm_Month': { 'type': 'date', 'format': 'MMM yyyy' },
 'tcO_TotalProjectCost': { 'type': 'number', 'format': '1.2-2' },
 'tcO_Opex': { 'type': 'number', 'format': '1.2-2' },
 'comm_Month': { 'type': 'date', 'format': 'MMM yyyy' },
 'budY1': { 'type': 'number', 'format': '1.2-2' },
 'npvRiskReduced': { 'type': 'number', 'format': '1.2-2' },
 'budY2': { 'type': 'number', 'format': '1.2-2' },
 'start_Month_Scope_1': { 'type': 'date', 'format': 'MMM yyyy' },
 'project_Score': { 'type': 'number', 'format': '1.3-3' },
 'budY3': { 'type': 'number', 'format': '1.2-2' },
 'start_Month_Scope_2': { 'type': 'date', 'format': 'MMM yyyy' },
  },
  'mergeRule': [],
  'highlightRule': { 'column': 'colLabel', 'content': 'Total Project Score (NPV Risk Reduced/TCO)', 'comparison': 'max', 'excludeCols':['colCategory','colLabel'], 'style': 'background',  'color': 'rgba(0,255,0,0.7)'}
};
//===============================================================
// TEMPLATE END: gridcomponent.ts.1.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.1.1.tpl
//===============================================================
public resultApprovedGroupByGridColumns = PORTFOLIO_APPROVED_GROUPBY_RESULT_TABLE_COLUMN();
public resultApprovedGroupByGridRules = {
  'freeze': {
    'left': [], 
    'right':[]
  },
  'format': {
 'total_Project': { 'type': 'number', 'format': '1.0-0' },
 'budY2': { 'type': 'number', 'format': '1.2-2' },
 'budY3': { 'type': 'number', 'format': '1.2-2' },
 'budY4': { 'type': 'number', 'format': '1.2-2' },
 'budY5': { 'type': 'number', 'format': '1.2-2' },
 'budY6': { 'type': 'number', 'format': '1.2-2' },
 'budY7': { 'type': 'number', 'format': '1.2-2' },
 'budY8': { 'type': 'number', 'format': '1.2-2' },
 'budget_Before_Revised': { 'type': 'number', 'format': '1.2-2' },
 'total_Budget': { 'type': 'number', 'format': '1.2-2' },
 'risk_Reduced': { 'type': 'number', 'format': '1.2-2' },
 'tcO_Opex': { 'type': 'number', 'format': '1.2-2' },
 'tcO_TotalProjectCost': { 'type': 'number', 'format': '1.2-2' },
 'npV_RiskReduced': { 'type': 'number', 'format': '1.2-2' },
 'project_Score': { 'type': 'number', 'format': '1.3-3' },
 'budY1': { 'type': 'number', 'format': '1.2-2' },
  },
  'mergeRule': [{'type':'rowcol','instList':[{'direction':'row','areaList':{'keyCol':['udStrategicObjective'],'mergeCol':['udStrategicObjective','uDIBRNarrativeMR','uDIBRNarrativeHPA']}}]}],
  'highlightRule': {},
  'totalRule': {},
};
public listOfApprovedGroupBy: any[];
//===============================================================
// TEMPLATE END: gridcomponent.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.1.1.tpl
//===============================================================
public resultRejectedGroupByGridColumns = PORTFOLIO_REJECTED_GROUPBY_RESULT_TABLE_COLUMN();
public resultRejectedGroupByGridRules = {
  'freeze': {
    'left': [], 
    'right':[]
  },
  'format': {
 'total_Project': { 'type': 'number', 'format': '1.0-0' },
 'budget_Before_Revised': { 'type': 'number', 'format': '1.2-2' },
 'total_Budget': { 'type': 'number', 'format': '1.2-2' },
 'risk_Reduced': { 'type': 'number', 'format': '1.2-2' },
 'tcO_Opex': { 'type': 'number', 'format': '1.2-2' },
 'tcO_TotalProjectCost': { 'type': 'number', 'format': '1.2-2' },
 'npV_RiskReduced': { 'type': 'number', 'format': '1.2-2' },
 'project_Score': { 'type': 'number', 'format': '1.3-3' },
  },
  'mergeRule': [{'type':'rowcol','instList':[{'direction':'row','areaList':{'keyCol':['udStrategicObjective'],'mergeCol':['udStrategicObjective','uDIBRNarrativeMR','uDIBRNarrativeHPA']}}]}],
  'highlightRule': {},
  'totalRule': {},
};
public listOfRejectedGroupBy: any[];
//===============================================================
// TEMPLATE END: gridcomponent.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.1.1.tpl
//===============================================================
public resultApprovedGroupByGridColumnsCompare = PORTFOLIO_APPROVED_GROUPBY_RESULT_TABLE_COLUMN();
public resultApprovedGroupByGridRulesCompare = {
  'freeze': {
    'left': [], 
    'right':[]
  },
  'format': {
 'total_Project': { 'type': 'number', 'format': '1.0-0' },
 'budY2': { 'type': 'number', 'format': '1.2-2' },
 'budY3': { 'type': 'number', 'format': '1.2-2' },
 'budY4': { 'type': 'number', 'format': '1.2-2' },
 'budY5': { 'type': 'number', 'format': '1.2-2' },
 'budY6': { 'type': 'number', 'format': '1.2-2' },
 'budY7': { 'type': 'number', 'format': '1.2-2' },
 'budY8': { 'type': 'number', 'format': '1.2-2' },
 'budget_Before_Revised': { 'type': 'number', 'format': '1.2-2' },
 'total_Budget': { 'type': 'number', 'format': '1.2-2' },
 'risk_Reduced': { 'type': 'number', 'format': '1.2-2' },
 'tcO_Opex': { 'type': 'number', 'format': '1.2-2' },
 'tcO_TotalProjectCost': { 'type': 'number', 'format': '1.2-2' },
 'npV_RiskReduced': { 'type': 'number', 'format': '1.2-2' },
 'project_Score': { 'type': 'number', 'format': '1.3-3' },
 'budY1': { 'type': 'number', 'format': '1.2-2' },
  },
  'mergeRule': [{'type':'rowcol','instList':[{'direction':'row','areaList':{'keyCol':['udStrategicObjective'],'mergeCol':['udStrategicObjective','uDIBRNarrativeMR','uDIBRNarrativeHPA']}}]}],
  'highlightRule': {},
  'totalRule': {},
};
public listOfApprovedGroupByCompare: any[];
//===============================================================
// TEMPLATE END: gridcomponent.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.1.1.tpl
//===============================================================
public resultRejectedGroupByGridColumnsCompare = PORTFOLIO_REJECTED_GROUPBY_RESULT_TABLE_COLUMN();
public resultRejectedGroupByGridRulesCompare = {
  'freeze': {
    'left': [], 
    'right':[]
  },
  'format': {
 'total_Project': { 'type': 'number', 'format': '1.0-0' },
 'budget_Before_Revised': { 'type': 'number', 'format': '1.2-2' },
 'total_Budget': { 'type': 'number', 'format': '1.2-2' },
 'risk_Reduced': { 'type': 'number', 'format': '1.2-2' },
 'tcO_Opex': { 'type': 'number', 'format': '1.2-2' },
 'tcO_TotalProjectCost': { 'type': 'number', 'format': '1.2-2' },
 'npV_RiskReduced': { 'type': 'number', 'format': '1.2-2' },
 'project_Score': { 'type': 'number', 'format': '1.3-3' },
  },
  'mergeRule': [{'type':'rowcol','instList':[{'direction':'row','areaList':{'keyCol':['udStrategicObjective'],'mergeCol':['udStrategicObjective','uDIBRNarrativeMR','uDIBRNarrativeHPA']}}]}],
  'highlightRule': {},
  'totalRule': {},
};
public listOfRejectedGroupByCompare: any[];
//===============================================================
// TEMPLATE END: gridcomponent.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.1.1.tpl
//===============================================================
public resultSummaryTableColumns = PORTFOLIO_SUMMARY_RESULT_TABLE_COLUMN();
public resultSummaryTableRules = {
  'freeze': {
    'left': ['summary'], 
    'right':[]
  },
  'format': {
 'totalProject': { 'type': 'number', 'format': '1.0-0' },
 'budY2': { 'type': 'number', 'format': '1.2-2' },
 'budY3': { 'type': 'number', 'format': '1.2-2' },
 'budY4': { 'type': 'number', 'format': '1.2-2' },
 'budY5': { 'type': 'number', 'format': '1.2-2' },
 'budY6': { 'type': 'number', 'format': '1.2-2' },
 'budY7': { 'type': 'number', 'format': '1.2-2' },
 'budY8': { 'type': 'number', 'format': '1.2-2' },
 'budgetBeforeRevised': { 'type': 'number', 'format': '1.2-2' },
 'totalBudget': { 'type': 'number', 'format': '1.2-2' },
 'riskReduced': { 'type': 'number', 'format': '1.2-2' },
 'tcoOpex': { 'type': 'number', 'format': '1.2-2' },
 'tcoTotalProjectCost': { 'type': 'number', 'format': '1.2-2' },
 'npvRiskReduced': { 'type': 'number', 'format': '1.2-2' },
 'projectScore': { 'type': 'number', 'format': '1.3-3' },
 'budY1': { 'type': 'number', 'format': '1.2-2' },
  },
  'mergeRule': [],
  'highlightRule': {},
  'totalRule': {'projectScore':'npvRiskReduced / ( tcoOpex + tcoTotalProjectCost )'},
};
public listOfSummary: any[];
//===============================================================
// TEMPLATE END: gridcomponent.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.1.1.tpl
//===============================================================
public resultApprovedTableColumns = PORTFOLIO_APPROVED_RESULT_TABLE_COLUMN();
public resultApprovedTableRules = {
  'freeze': {
    'left': ['ProjectDefinition','UDProjectDescription'], 
    'right':[]
  },
  'format': {
 'Budget_Before_Revised': { 'type': 'number', 'format': '1.2-2' },
 'Start_Month_Scope_3': { 'type': 'date', 'format': 'MMM yyyy' },
 'Start_Month_Scope_4': { 'type': 'date', 'format': 'MMM yyyy' },
 'Comm_Month': { 'type': 'date', 'format': 'MMM yyyy' },
 'Target_Comm_Month': { 'type': 'date', 'format': 'MMM yyyy' },
 'BUDY1': { 'type': 'number', 'format': '1.2-2' },
 'BUDY2': { 'type': 'number', 'format': '1.2-2' },
 'BUDY3': { 'type': 'number', 'format': '1.2-2' },
 'BUDY4': { 'type': 'number', 'format': '1.2-2' },
 'BUDY5': { 'type': 'number', 'format': '1.2-2' },
 'BUDY6': { 'type': 'number', 'format': '1.2-2' },
 'Total_Budget': { 'type': 'number', 'format': '1.2-2' },
 'BUDY7': { 'type': 'number', 'format': '1.2-2' },
 'BUDY8': { 'type': 'number', 'format': '1.2-2' },
 'Risk_Reduced': { 'type': 'number', 'format': '1.2-2' },
 'TCO_Opex': { 'type': 'number', 'format': '1.2-2' },
 'TCO_TotalProjectCost': { 'type': 'number', 'format': '1.2-2' },
 'NPV_RiskReduced': { 'type': 'number', 'format': '1.2-2' },
 'Project_Score': { 'type': 'number', 'format': '1.3-3' },
 'Start_Month_Scope_1': { 'type': 'date', 'format': 'MMM yyyy' },
 'Start_Month_Scope_2': { 'type': 'date', 'format': 'MMM yyyy' },
  },
  'mergeRule': [],
  'highlightRule': {},
  'totalRule': {},
};
public listOfApproved: any[];
//===============================================================
// TEMPLATE END: gridcomponent.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.1.1.tpl
//===============================================================
public resultRejectedTableColumns = PORTFOLIO_REJECTED_RESULT_TABLE_COLUMN();
public resultRejectedTableRules = {
  'freeze': {
    'left': ['projectDefinition','udProjectDescription'], 
    'right':[]
  },
  'format': {
 'budgetBeforeRevised': { 'type': 'number', 'format': '1.2-2' },
 'totalBudget': { 'type': 'number', 'format': '1.2-2' },
 'riskReduced': { 'type': 'number', 'format': '1.2-2' },
 'tcoOpex': { 'type': 'number', 'format': '1.2-2' },
 'tcoTotalProjectCost': { 'type': 'number', 'format': '1.2-2' },
 'npvRiskReduced': { 'type': 'number', 'format': '1.2-2' },
 'projectScore': { 'type': 'number', 'format': '1.3-3' },
  },
  'mergeRule': [],
  'highlightRule': {},
  'totalRule': {},
};
public listOfRejected: any[];
//===============================================================
// TEMPLATE END: gridcomponent.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.1.1.tpl
//===============================================================
public resultSummaryTableColumnsCompare = PORTFOLIO_SUMMARY_RESULT_TABLE_COLUMN();
public resultSummaryTableRulesCompare = {
  'freeze': {
    'left': ['summary'], 
    'right':[]
  },
  'format': {
 'totalProject': { 'type': 'number', 'format': '1.0-0' },
 'budY2': { 'type': 'number', 'format': '1.2-2' },
 'budY3': { 'type': 'number', 'format': '1.2-2' },
 'budY4': { 'type': 'number', 'format': '1.2-2' },
 'budY5': { 'type': 'number', 'format': '1.2-2' },
 'budY6': { 'type': 'number', 'format': '1.2-2' },
 'budY7': { 'type': 'number', 'format': '1.2-2' },
 'budY8': { 'type': 'number', 'format': '1.2-2' },
 'budgetBeforeRevised': { 'type': 'number', 'format': '1.2-2' },
 'totalBudget': { 'type': 'number', 'format': '1.2-2' },
 'riskReduced': { 'type': 'number', 'format': '1.2-2' },
 'tcoOpex': { 'type': 'number', 'format': '1.2-2' },
 'tcoTotalProjectCost': { 'type': 'number', 'format': '1.2-2' },
 'npvRiskReduced': { 'type': 'number', 'format': '1.2-2' },
 'projectScore': { 'type': 'number', 'format': '1.3-3' },
 'budY1': { 'type': 'number', 'format': '1.2-2' },
  },
  'mergeRule': [],
  'highlightRule': {},
  'totalRule': {'projectScore':'npvRiskReduced / ( tcoOpex + tcoTotalProjectCost )'},
};
public listOfSummaryCompare: any[];
//===============================================================
// TEMPLATE END: gridcomponent.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.1.1.tpl
//===============================================================
public resultApprovedTableColumnsCompare = PORTFOLIO_APPROVED_RESULT_TABLE_COLUMN();
public resultApprovedTableRulesCompare = {
  'freeze': {
    'left': ['ProjectDefinition','UDProjectDescription'], 
    'right':[]
  },
  'format': {
 'Budget_Before_Revised': { 'type': 'number', 'format': '1.2-2' },
 'Start_Month_Scope_3': { 'type': 'date', 'format': 'MMM yyyy' },
 'Start_Month_Scope_4': { 'type': 'date', 'format': 'MMM yyyy' },
 'Comm_Month': { 'type': 'date', 'format': 'MMM yyyy' },
 'Target_Comm_Month': { 'type': 'date', 'format': 'MMM yyyy' },
 'BUDY1': { 'type': 'number', 'format': '1.2-2' },
 'BUDY2': { 'type': 'number', 'format': '1.2-2' },
 'BUDY3': { 'type': 'number', 'format': '1.2-2' },
 'BUDY4': { 'type': 'number', 'format': '1.2-2' },
 'BUDY5': { 'type': 'number', 'format': '1.2-2' },
 'BUDY6': { 'type': 'number', 'format': '1.2-2' },
 'Total_Budget': { 'type': 'number', 'format': '1.2-2' },
 'BUDY7': { 'type': 'number', 'format': '1.2-2' },
 'BUDY8': { 'type': 'number', 'format': '1.2-2' },
 'Risk_Reduced': { 'type': 'number', 'format': '1.2-2' },
 'TCO_Opex': { 'type': 'number', 'format': '1.2-2' },
 'TCO_TotalProjectCost': { 'type': 'number', 'format': '1.2-2' },
 'NPV_RiskReduced': { 'type': 'number', 'format': '1.2-2' },
 'Project_Score': { 'type': 'number', 'format': '1.3-3' },
 'Start_Month_Scope_1': { 'type': 'date', 'format': 'MMM yyyy' },
 'Start_Month_Scope_2': { 'type': 'date', 'format': 'MMM yyyy' },
  },
  'mergeRule': [],
  'highlightRule': {},
  'totalRule': {},
};
public listOfApprovedCompare: any[];
//===============================================================
// TEMPLATE END: gridcomponent.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.1.1.tpl
//===============================================================
public resultRejectedTableColumnsCompare = PORTFOLIO_REJECTED_RESULT_TABLE_COLUMN();
public resultRejectedTableRulesCompare = {
  'freeze': {
    'left': ['projectDefinition','udProjectDescription'], 
    'right':[]
  },
  'format': {
 'budgetBeforeRevised': { 'type': 'number', 'format': '1.2-2' },
 'totalBudget': { 'type': 'number', 'format': '1.2-2' },
 'riskReduced': { 'type': 'number', 'format': '1.2-2' },
 'tcoOpex': { 'type': 'number', 'format': '1.2-2' },
 'tcoTotalProjectCost': { 'type': 'number', 'format': '1.2-2' },
 'npvRiskReduced': { 'type': 'number', 'format': '1.2-2' },
 'projectScore': { 'type': 'number', 'format': '1.3-3' },
  },
  'mergeRule': [],
  'highlightRule': {},
  'totalRule': {},
};
public listOfRejectedCompare: any[];
//===============================================================
// TEMPLATE END: gridcomponent.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.1.1.tpl
//===============================================================
public resultApprovedGroupByGrid2Columns = PORTFOLIO_APPROVED_GROUPBY_RESULT_TABLE_COLUMN2();
public resultApprovedGroupByGrid2Rules = {
  'freeze': {
    'left': [], 
    'right':[]
  },
  'format': {
 'total_Project': { 'type': 'number', 'format': '1.0-0' },
 'budY2': { 'type': 'number', 'format': '1.2-2' },
 'budY3': { 'type': 'number', 'format': '1.2-2' },
 'budY4': { 'type': 'number', 'format': '1.2-2' },
 'budY5': { 'type': 'number', 'format': '1.2-2' },
 'budY6': { 'type': 'number', 'format': '1.2-2' },
 'budY7': { 'type': 'number', 'format': '1.2-2' },
 'budY8': { 'type': 'number', 'format': '1.2-2' },
 'budget_Before_Revised': { 'type': 'number', 'format': '1.2-2' },
 'total_Budget': { 'type': 'number', 'format': '1.2-2' },
 'risk_Reduced': { 'type': 'number', 'format': '1.2-2' },
 'tcO_Opex': { 'type': 'number', 'format': '1.2-2' },
 'tcO_TotalProjectCost': { 'type': 'number', 'format': '1.2-2' },
 'npV_RiskReduced': { 'type': 'number', 'format': '1.2-2' },
 'project_Score': { 'type': 'number', 'format': '1.3-3' },
 'budY1': { 'type': 'number', 'format': '1.2-2' },
  },
  'mergeRule': [{'type':'rowcol','instList':[{'direction':'row','areaList':{'keyCol':['udStrategicObjective'],'mergeCol':['udStrategicObjective']}}]}],
  'highlightRule': {},
  'totalRule': {},
};
public listOfApprovedGroupBy2: any[];
//===============================================================
// TEMPLATE END: gridcomponent.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.1.1.tpl
//===============================================================
public resultRejectedGroupByGrid2Columns = PORTFOLIO_REJECTED_GROUPBY_RESULT_TABLE_COLUMN2();
public resultRejectedGroupByGrid2Rules = {
  'freeze': {
    'left': [], 
    'right':[]
  },
  'format': {
 'total_Project': { 'type': 'number', 'format': '1.0-0' },
 'budget_Before_Revised': { 'type': 'number', 'format': '1.2-2' },
 'total_Budget': { 'type': 'number', 'format': '1.2-2' },
 'risk_Reduced': { 'type': 'number', 'format': '1.2-2' },
 'tcO_Opex': { 'type': 'number', 'format': '1.2-2' },
 'tcO_TotalProjectCost': { 'type': 'number', 'format': '1.2-2' },
 'npV_RiskReduced': { 'type': 'number', 'format': '1.2-2' },
 'project_Score': { 'type': 'number', 'format': '1.3-3' },
  },
  'mergeRule': [{'type':'rowcol','instList':[{'direction':'row','areaList':{'keyCol':['udStrategicObjective'],'mergeCol':['udStrategicObjective']}}]}],
  'highlightRule': {},
  'totalRule': {},
};
public listOfRejectedGroupBy2: any[];
//===============================================================
// TEMPLATE END: gridcomponent.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.1.1.tpl
//===============================================================
public resultApprovedGroupByGridColumnsCompare2 = PORTFOLIO_APPROVED_GROUPBY_RESULT_TABLE_COLUMN2();
public resultApprovedGroupByGridRulesCompare2 = {
  'freeze': {
    'left': [], 
    'right':[]
  },
  'format': {
 'total_Project': { 'type': 'number', 'format': '1.0-0' },
 'budY2': { 'type': 'number', 'format': '1.2-2' },
 'budY3': { 'type': 'number', 'format': '1.2-2' },
 'budY4': { 'type': 'number', 'format': '1.2-2' },
 'budY5': { 'type': 'number', 'format': '1.2-2' },
 'budY6': { 'type': 'number', 'format': '1.2-2' },
 'budY7': { 'type': 'number', 'format': '1.2-2' },
 'budY8': { 'type': 'number', 'format': '1.2-2' },
 'budget_Before_Revised': { 'type': 'number', 'format': '1.2-2' },
 'total_Budget': { 'type': 'number', 'format': '1.2-2' },
 'risk_Reduced': { 'type': 'number', 'format': '1.2-2' },
 'tcO_Opex': { 'type': 'number', 'format': '1.2-2' },
 'tcO_TotalProjectCost': { 'type': 'number', 'format': '1.2-2' },
 'npV_RiskReduced': { 'type': 'number', 'format': '1.2-2' },
 'project_Score': { 'type': 'number', 'format': '1.3-3' },
 'budY1': { 'type': 'number', 'format': '1.2-2' },
  },
  'mergeRule': [{'type':'rowcol','instList':[{'direction':'row','areaList':{'keyCol':['udStrategicObjective'],'mergeCol':['udStrategicObjective']}}]}],
  'highlightRule': {},
  'totalRule': {},
};
public listOfApprovedGroupByCompare2: any[];
//===============================================================
// TEMPLATE END: gridcomponent.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.1.1.tpl
//===============================================================
public resultRejectedGroupByGridColumnsCompare2 = PORTFOLIO_REJECTED_GROUPBY_RESULT_TABLE_COLUMN2();
public resultRejectedGroupByGridRulesCompare2 = {
  'freeze': {
    'left': [], 
    'right':[]
  },
  'format': {
 'total_Project': { 'type': 'number', 'format': '1.0-0' },
 'budget_Before_Revised': { 'type': 'number', 'format': '1.2-2' },
 'total_Budget': { 'type': 'number', 'format': '1.2-2' },
 'risk_Reduced': { 'type': 'number', 'format': '1.2-2' },
 'tcO_Opex': { 'type': 'number', 'format': '1.2-2' },
 'tcO_TotalProjectCost': { 'type': 'number', 'format': '1.2-2' },
 'npV_RiskReduced': { 'type': 'number', 'format': '1.2-2' },
 'project_Score': { 'type': 'number', 'format': '1.3-3' },
  },
  'mergeRule': [{'type':'rowcol','instList':[{'direction':'row','areaList':{'keyCol':['udStrategicObjective'],'mergeCol':['udStrategicObjective']}}]}],
  'highlightRule': {},
  'totalRule': {},
};
public listOfRejectedGroupByCompare2: any[];
//===============================================================
// TEMPLATE END: gridcomponent.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.1.1.tpl
//===============================================================
public resultSupplyTableColumns = RESULT_SUPPLY_TABLE_COLUMN();
public resultSupplyTableRules = {
  'freeze': {
    'left': ['ProjectDefinition','UDProjectDescription'], 
    'right':[]
  },
  'format': {
 'Total_Budget': { 'type': 'number', 'format': '1.2-2' },
 'Risk_Reduced': { 'type': 'number', 'format': '1.2-2' },
 'TCO_Opex': { 'type': 'number', 'format': '1.2-2' },
 'TCO_TotalProjectCost': { 'type': 'number', 'format': '1.2-2' },
 'NPV_RiskReduced': { 'type': 'number', 'format': '1.2-2' },
 'Project_Score': { 'type': 'number', 'format': '1.2-2' },
  },
  'mergeRule': [],
  'highlightRule': {},
  'totalRule': {},
};
public listOfSupply: any[];
//===============================================================
// TEMPLATE END: gridcomponent.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.1.1.tpl
//===============================================================
public resultSupplyTableColumnsCompare = RESULT_SUPPLY_TABLE_COLUMN();
public resultSupplyTableColumnsRulesCompare = {
  'freeze': {
    'left': ['ProjectDefinition','UDProjectDescription'], 
    'right':[]
  },
  'format': {
 'Total_Budget': { 'type': 'number', 'format': '1.2-2' },
 'Risk_Reduced': { 'type': 'number', 'format': '1.2-2' },
 'TCO_Opex': { 'type': 'number', 'format': '1.2-2' },
 'TCO_TotalProjectCost': { 'type': 'number', 'format': '1.2-2' },
 'NPV_RiskReduced': { 'type': 'number', 'format': '1.2-2' },
 'Project_Score': { 'type': 'number', 'format': '1.2-2' },
  },
  'mergeRule': [],
  'highlightRule': {},
  'totalRule': {},
};
public listOfSupplyCompare: any[];
//===============================================================
// TEMPLATE END: gridcomponent.ts.1.1.tpl
//===============================================================

/* GENCODE:MARKER:11:END */

public resultInclusiveExclusiveTableColumns = PORTFOLIO_APPROVED_RESULT_TABLE_COLUMN();


  public tableGridRules = {
    'freeze': {
      '2Col':['projectDefinition','udProjectDescription'],
      'left':['a'],
      'right':['h']
    },
    'format': {
      'format1': {
        'budY4': { 'type':'number', 'format':'1.2-2' },
        'start_Month_Scope_3': { 'type':'date', 'format':'MMM yyyy' },
        'budY5': { 'type':'number', 'format':'1.2-2' },
        'start_Month_Scope_4': { 'type':'date', 'format':'MMM yyyy' },
        'risk_Reduced': { 'type':'number', 'format':'1.2-2' },
        'totalBudget': { 'type':'number', 'format':'1.2-2' },
        'budY6': { 'type':'number', 'format':'1.2-2' },
        'budY7': { 'type':'number', 'format':'1.2-2' },
        'budY8': { 'type':'number', 'format':'1.2-2' },
        'budgetBeforeRevised': { 'type':'number', 'format':'1.2-2' },
        'target_Comm_Month': { 'type':'date', 'format':'MMM yyyy' },
        'tcO_TotalProjectCost': { 'type':'number', 'format':'1.2-2' },
        'tcO_Opex': { 'type':'number', 'format':'1.2-2' },
        'comm_Month': { 'type':'date', 'format':'MMM yyyy' },
        'budY1': { 'type':'number', 'format':'1.2-2' },
        'npvRiskReduced': { 'type':'number', 'format':'1.2-2' },
        'budY2': { 'type':'number', 'format':'1.2-2' },
        'start_Month_Scope_1': { 'type':'date', 'format':'MMM yyyy' },
        'project_Score': { 'type':'number', 'format':'1.3-3' },
        'budY3': { 'type':'number', 'format':'1.2-2' },
        'start_Month_Scope_2': { 'type':'date', 'format':'MMM yyyy' }
      },
      'formatTest': {
        'a': { 'type':'number', 'format':'1.2-2' },
        'b': { 'type':'date', 'format':'MMM yyyy' },
        'd': { 'type':'number', 'format':'1.2-2' },
        'g': { 'type':'number', 'format':'1.2-2' }
      }
    },
    'mergeRule': {
      '1': [
        { 
          'type':'rowcol', 
          'instList':[ 
            { 
              'direction':'row', 
              'areaList': {
                'keyCol': ['a', 'b'], 
                'mergeCol': ['a', 'b', 'c'] 
              } 
            } 
          ] 
        },
        { 'type':'area', 'instList':[ { s:{ r:2, c:3 }, e: { r:3, c:4 } } ] }
      ]
    },
    'filterList': {
      '1':[]
    }
  };

  public testTableColumns = [
    {
      'displayName': 'Alphabet A',
      'columnName': 'a',
      'columnTypeId': 2,
      'columnType': 'Drop Down',
      'columnWidth': '90px',
      'isSearchable': true,
      'isSortable': true,
      'display': true,
      'order': 1,
      'toolTip': '',
      'value': '',
    },
    {
      'displayName': 'Alphabet B',
      'columnName': 'b',
      'columnTypeId': 2,
      'columnType': 'Drop Down',
      'columnWidth': '90px',
      'isSearchable': true,
      'isSortable': true,
      'display': true,
      'order': 1,
      'toolTip': '',
      'value': '',
    },
    {
      'displayName': 'Alphabet C',
      'columnName': 'c',
      'columnTypeId': 2,
      'columnType': 'Drop Down',
      'columnWidth': '90px',
      'isSearchable': true,
      'isSortable': false,
      'display': true,
      'order': 1,
      'toolTip': '',
      'value': '',
    },
    {
      'displayName': 'Alphabet D',
      'columnName': 'd',
      'columnTypeId': 2,
      'columnType': 'Drop Down',
      'columnWidth': '90px',
      'isSearchable': true,
      'isSortable': false,
      'display': true,
      'order': 1,
      'toolTip': '',
      'value': '',
    },
    {
      'displayName': 'Alphabet E',
      'columnName': 'e',
      'columnTypeId': 2,
      'columnType': 'Drop Down',
      'columnWidth': '500px',
      'isSearchable': true,
      'isSortable': true,
      'display': true,
      'order': 1,
      'toolTip': '',
      'value': '',
    },
    {
      'displayName': 'Alphabet F',
      'columnName': 'f',
      'columnTypeId': 2,
      'columnType': 'Drop Down',
      'columnWidth': '500px',
      'isSearchable': true,
      'isSortable': true,
      'display': true,
      'order': 1,
      'toolTip': '',
      'value': '',
    },
    {
      'displayName': 'Alphabet G',
      'columnName': 'g',
      'columnTypeId': 2,
      'columnType': 'Drop Down',
      'columnWidth': '500px',
      'isSearchable': true,
      'isSortable': false,
      'display': true,
      'order': 1,
      'toolTip': '',
      'value': '',
    },
    {
      'displayName': 'Alphabet H',
      'columnName': 'h',
      'columnTypeId': 1,
      'columnType': 'Text',
      'columnWidth': '500px',
      'isSearchable': false,
      'isSortable': false,
      'display': true,
      'order': 1,
      'toolTip': '',
      'value': '',
    }
  ];



  public tablelistTest = [
    {
      'a': 1,      'b': '2024-07-01T00:00:00',      'c': 'Malaysia',      'd': 8,      'e': 'E',      'f': 'X',      'g': 8
    },
    {
      'a': 1,      'b': '2023-01-01T00:00:00',      'c': 'Malaysia',      'd': 8,      'e': 'A',      'f': 'Z',      'g': 3
    },
    {
      'a': 1,      'b': '2023-01-01T00:00:00',      'c': 'Malaysia',      'd': 6,      'e': 'C',      'f': 'Y',      'g': 5
    },
    {
      'a': 2,      'b': '2023-01-01T00:00:00',      'c': 'Malaysia',      'd': 6,      'e': 'B',      'f': 'V',      'g': 2
    }
  ];

  public tablelistInit = this.tablelistTest;

  /* GENCODE:MARKER:0:START */
  @Input("type")
  type: string;

  maxY: any;
  maxY2: any;
  /* GENCODE:MARKER:0:END */
  
  /* GENCODE:MARKER:1:START */

//===============================================================
// TEMPLATE START: SyncColor.ts.1.1.tpl
//===============================================================
  compareChartColors = {};
  compareFixedColorList = [
    "rgba(0,255,0,0.7)","rgba(0,0,255,0.7)","rgba(255,0,0,0.7)","rgba(1,255,254,0.7)","rgba(255,166,254,0.7)",
    "rgba(255,219,102,0.7)","rgba(0,100,1,0.7)","rgba(1,0,103,0.7)","rgba(149,0,58,0.7)","rgba(0,125,181,0.7)",
    "rgba(255,0,246,0.7)","rgba(255,238,232,0.7)","rgba(119,77,0,0.7)","rgba(144,251,146,0.7)","rgba(0,118,255,0.7)",
    "rgba(213,255,0,0.7)","rgba(255,147,126,0.7)","rgba(106,130,108,0.7)","rgba(255,2,157,0.7)","rgba(254,137,0,0.7)",
    "rgba(122,71,130,0.7)","rgba(126,45,210,0.7)","rgba(133,169,0,0.7)","rgba(255,0,86,0.7)","rgba(164,36,0,0.7)",
    "rgba(0,174,126,0.7)","rgba(104,61,59,0.7)","rgba(189,198,255,0.7)","rgba(38,52,0,0.7)","rgba(189,211,147,0.7)",
    "rgba(0,185,23,0.7)","rgba(158,0,142,0.7)","rgba(0,21,68,0.7)","rgba(194,140,159,0.7)","rgba(255,116,163,0.7)",
    "rgba(1,208,255,0.7)","rgba(0,71,84,0.7)","rgba(229,111,254,0.7)","rgba(120,130,49,0.7)","rgba(14,76,161,0.7)",
    "rgba(145,208,203,0.7)","rgba(190,153,112,0.7)","rgba(150,138,232,0.7)","rgba(187,136,0,0.7)","rgba(67,0,44,0.7)",
    "rgba(222,255,116,0.7)","rgba(0,255,198,0.7)","rgba(255,229,2,0.7)","rgba(98,14,0,0.7)","rgba(0,143,156,0.7)",
    "rgba(152,255,82,0.7)","rgba(117,68,177,0.7)","rgba(181,0,255,0.7)","rgba(0,255,120,0.7)","rgba(255,110,65,0.7)",
    "rgba(0,95,57,0.7)","rgba(107,104,130,0.7)","rgba(95,173,78,0.7)","rgba(167,87,64,0.7)","rgba(165,255,210,0.7)",
    "rgba(255,177,103,0.7)","rgba(0,155,255,0.7)","rgba(232,94,190,0.7)",       
  ];
//===============================================================
// TEMPLATE END: SyncColor.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: InclusiveExclusive.ts.1.1.tpl
//===============================================================
  listOfMutually: any;
//===============================================================
// TEMPLATE END: InclusiveExclusive.ts.1.1.tpl
//===============================================================

  /* GENCODE:MARKER:1:END */

    
  /* GENCODE:MARKER:2:START */

//===============================================================
// TEMPLATE START: component.ts.1.1.tpl
//===============================================================
  @ViewChild("LeftBarLineBudgetChart")
  private LeftBarLineBudgetChartRef: ElementRef;
  public LeftBarLineBudgetChart: Chart;
  LeftBarLineBudgetChartData: any;
//===============================================================
// TEMPLATE END: component.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.1.1.tpl
//===============================================================
  @ViewChild("RightBarLineBudgetChart")
  private RightBarLineBudgetChartRef: ElementRef;
  public RightBarLineBudgetChart: Chart;
  RightBarLineBudgetChartData: any;
//===============================================================
// TEMPLATE END: component.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.1.1.tpl
//===============================================================
  @ViewChild("LeftStackedBarBudgetChart")
  private LeftStackedBarBudgetChartRef: ElementRef;
  public LeftStackedBarBudgetChart: Chart;
  LeftStackedBarBudgetChartData: any;
//===============================================================
// TEMPLATE END: component.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.1.1.tpl
//===============================================================
  @ViewChild("RightStackedBarBudgetChart")
  private RightStackedBarBudgetChartRef: ElementRef;
  public RightStackedBarBudgetChart: Chart;
  RightStackedBarBudgetChartData: any;
//===============================================================
// TEMPLATE END: component.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.1.1.tpl
//===============================================================
  @ViewChild("LeftBarLineNPVChart")
  private LeftBarLineNPVChartRef: ElementRef;
  public LeftBarLineNPVChart: Chart;
  LeftBarLineNPVChartData: any;
//===============================================================
// TEMPLATE END: component.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.1.1.tpl
//===============================================================
  @ViewChild("RightBarLineNPVChart")
  private RightBarLineNPVChartRef: ElementRef;
  public RightBarLineNPVChart: Chart;
  RightBarLineNPVChartData: any;
//===============================================================
// TEMPLATE END: component.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.1.1.tpl
//===============================================================
  @ViewChild("LeftStackedBarNPVChart")
  private LeftStackedBarNPVChartRef: ElementRef;
  public LeftStackedBarNPVChart: Chart;
  LeftStackedBarNPVChartData: any;
//===============================================================
// TEMPLATE END: component.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.1.1.tpl
//===============================================================
  @ViewChild("RightStackedBarNPVChart")
  private RightStackedBarNPVChartRef: ElementRef;
  public RightStackedBarNPVChart: Chart;
  RightStackedBarNPVChartData: any;
//===============================================================
// TEMPLATE END: component.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.1.1.tpl
//===============================================================
  @ViewChild("LeftRadarElementChart")
  private LeftRadarElementChartRef: ElementRef;
  public LeftRadarElementChart: Chart;
  LeftRadarElementChartData: any;
//===============================================================
// TEMPLATE END: component.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.1.1.tpl
//===============================================================
  @ViewChild("RightRadarElementChart")
  private RightRadarElementChartRef: ElementRef;
  public RightRadarElementChart: Chart;
  RightRadarElementChartData: any;
//===============================================================
// TEMPLATE END: component.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.1.1.tpl
//===============================================================
  @ViewChild("LeftStackedBarOSRiskChart")
  private LeftStackedBarOSRiskChartRef: ElementRef;
  public LeftStackedBarOSRiskChart: Chart;
  LeftStackedBarOSRiskChartData: any;
//===============================================================
// TEMPLATE END: component.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.1.1.tpl
//===============================================================
  @ViewChild("RightStackedBarOSRiskChart")
  private RightStackedBarOSRiskChartRef: ElementRef;
  public RightStackedBarOSRiskChart: Chart;
  RightStackedBarOSRiskChartData: any;
//===============================================================
// TEMPLATE END: component.ts.1.1.tpl
//===============================================================

  /* GENCODE:MARKER:2:END */

  constructor(
    private readonly costSvc: AipmCostService, 
    private notification: NzNotificationService,
    private activatedRoute: ActivatedRoute,
    private readonly portfolioSvc: AipmPortfolioService,
    private formBuilder: FormBuilder,  
    private bsModalService: BsModalService,
    private readonly scenarioSvs: AipmScenarioService
    ) { }


  public ngOnInit(): void {

    this.scenarioId = this.activatedRoute.snapshot.params.id;
    this.cycleId = this.activatedRoute.snapshot.params.cycleId;

    this.getById();
    this.getScenarioWithResultList();
    
    this.form = this.formBuilder.group({
      strategicObjective: [],
      subObjective: [],
      stateCode: [],
      businessArea: [],
      projectTypeList: [],
      voltageList: [],
    });

    this.compareForm = this.formBuilder.group({
        compare0:[],
        compare1:[],
        compare2:[],
        compare3:[],
        compare4:[]
    });

/* GENCODE:MARKER:9:START */

//===============================================================
// TEMPLATE START: InclusiveExclusive.ts.5.1.tpl
//===============================================================
    this.listOfMutually = {
      'lhs': {},
      'rhs': {},
      'inclusive': [],
      'exclusiveLeft': [],
      'exclusiveRight': []
    };
//===============================================================
// TEMPLATE END: InclusiveExclusive.ts.5.1.tpl
//===============================================================

/* GENCODE:MARKER:9:END */

    this.fetchFilters();
    this.fetchData();
  }

  getScenarioWithResultList() {
    this.scenarioSvs.listWithResult(
      "portfolio",
      {
        cycleId: this.cycleId
      }
    ).subscribe(result => {
      this.projectList = result.entity.items;
      this.comparisonProjectList = result.entity.items.filter(x => x.id != Number(this.scenarioId));
    });
  }

  getById() {
    this.scenarioSvs.getById(
      "portfolio",
      this.scenarioId
    ).subscribe(result => {
      this.editable = result.editable;
      this.numberOfYears = ((result.entity.endYear - result.entity.startYear) + 1);
      //here1
      this.hideUnwantedColumn(this.ComparisonSummaryGridHdr);
      this.hideUnwantedColumn(this.ComparisonPrioritisedGridHdr);
      this.hideUnwantedColumn(this.resultApprovedGroupByGridColumns);
      this.hideUnwantedColumn(this.resultApprovedGroupByGrid2Columns);
    });
  }

  fetchChart() {
    this.loading = true;
    this.portfolioSvc.getOriginalChart(this.scenarioId, this.reqModel)
      .subscribe(result => {
        this.chartData = result.datasets;
        this.chartRefData = result;
        this.updateChart();
      });
  }

  public fetchFilters(){
    this.loading = true;
    this.costSvc.getFilters()
      .subscribe(result => {
        if (result.success) {
          this.filters = result.entity;
          this.baList = this.filters.businessArea;
        }
      });
  }

  public onStateSelect(state: string[]) {
    this.baList = this.filters.businessArea;
    if (state != null && state != undefined) {
      this.baList = [];
      state.forEach(e => {
        var filteredList = this.filters.businessArea.filter(a => a.cfG_GeoStateCode == e);
        filteredList.forEach(ba => {
          this.baList.push(ba);
        });
      });
    }

    this.baList.sort((a,b) => a.areaName.localeCompare(b.areaName));
  }

  public sortChange(e: string, column: string): void {
    if (e) {
      this.reqModel.sortByColumn = column;
      this.reqModel.sortDirection = (e === "ascend" ? "ASC" : "DESC");
    } else {
      this.reqModel.sortByColumn = "";
      this.reqModel.sortDirection = "";
    }

    this.fetchData();
  }

  /* GENCODE:MARKER:3:START */

//===============================================================
// TEMPLATE START: component.ts.2.1.tpl
//===============================================================
  fetchLeftBarLineBudgetChart() {
    this.loading = true;
    this.type = "original";
    if (this.type == "original") {
      this.portfolioSvc.getLeftBarLineBudgetChart(this.scenarioId, this.reqModel)
        .subscribe(result => {

          this.loading = false;
          this.LeftBarLineBudgetChartData = result;
          this.doLeftBarLineBudgetChart();
        });
    } else if (this.type == "alternative") {
      this.portfolioSvc.getLeftBarLineBudgetChart(this.scenarioId, this.reqModel)
        .subscribe(result => {

          this.loading = false;
          this.LeftBarLineBudgetChartData = result;
          this.doLeftBarLineBudgetChart();
        });
    }
  }
//===============================================================
// TEMPLATE END: component.ts.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.2.2.tpl
//===============================================================
  fetchRightBarLineBudgetChart() {
    this.loading = true;
    this.type = "original";
    if (this.type == "original") {
      this.portfolioSvc.getRightBarLineBudgetChart(this.compareScenarioId, this.reqModel)
        .subscribe(result => {
          this.compared = true;
          this.loading = false;
          this.RightBarLineBudgetChartData = result;
          this.doRightBarLineBudgetChart();
        });
    } else if (this.type == "alternative") {
      this.portfolioSvc.getRightBarLineBudgetChart(this.compareScenarioId, this.reqModel)
        .subscribe(result => {
          this.compared = true;
          this.loading = false;
          this.RightBarLineBudgetChartData = result;
          this.doRightBarLineBudgetChart();
        });
    }
  }
//===============================================================
// TEMPLATE END: component.ts.2.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.2.1.tpl
//===============================================================
  fetchLeftStackedBarBudgetChart() {
    this.loading = true;
    this.type = "original";
    if (this.type == "original") {
      this.portfolioSvc.getLeftStackedBarBudgetChart(this.scenarioId, this.reqModel)
        .subscribe(result => {

          this.loading = false;
          this.LeftStackedBarBudgetChartData = result;
          this.doLeftStackedBarBudgetChart();
        });
    } else if (this.type == "alternative") {
      this.portfolioSvc.getLeftStackedBarBudgetChart(this.scenarioId, this.reqModel)
        .subscribe(result => {

          this.loading = false;
          this.LeftStackedBarBudgetChartData = result;
          this.doLeftStackedBarBudgetChart();
        });
    }
  }
//===============================================================
// TEMPLATE END: component.ts.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.2.2.tpl
//===============================================================
  fetchRightStackedBarBudgetChart() {
    this.loading = true;
    this.type = "original";
    if (this.type == "original") {
      this.portfolioSvc.getRightStackedBarBudgetChart(this.compareScenarioId, this.reqModel)
        .subscribe(result => {
          this.compared = true;
          this.loading = false;
          this.RightStackedBarBudgetChartData = result;
          this.doRightStackedBarBudgetChart();
        });
    } else if (this.type == "alternative") {
      this.portfolioSvc.getRightStackedBarBudgetChart(this.compareScenarioId, this.reqModel)
        .subscribe(result => {
          this.compared = true;
          this.loading = false;
          this.RightStackedBarBudgetChartData = result;
          this.doRightStackedBarBudgetChart();
        });
    }
  }
//===============================================================
// TEMPLATE END: component.ts.2.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.2.1.tpl
//===============================================================
  fetchLeftBarLineNPVChart() {
    this.loading = true;
    this.type = "original";
    if (this.type == "original") {
      this.portfolioSvc.getLeftBarLineNPVChart(this.scenarioId, this.reqModel)
        .subscribe(result => {

          this.loading = false;
          this.LeftBarLineNPVChartData = result;
          this.doLeftBarLineNPVChart();
        });
    } else if (this.type == "alternative") {
      this.portfolioSvc.getLeftBarLineNPVChart(this.scenarioId, this.reqModel)
        .subscribe(result => {

          this.loading = false;
          this.LeftBarLineNPVChartData = result;
          this.doLeftBarLineNPVChart();
        });
    }
  }
//===============================================================
// TEMPLATE END: component.ts.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.2.2.tpl
//===============================================================
  fetchRightBarLineNPVChart() {
    this.loading = true;
    this.type = "original";
    if (this.type == "original") {
      this.portfolioSvc.getRightBarLineNPVChart(this.compareScenarioId, this.reqModel)
        .subscribe(result => {
          this.compared = true;
          this.loading = false;
          this.RightBarLineNPVChartData = result;
          this.doRightBarLineNPVChart();
        });
    } else if (this.type == "alternative") {
      this.portfolioSvc.getRightBarLineNPVChart(this.compareScenarioId, this.reqModel)
        .subscribe(result => {
          this.compared = true;
          this.loading = false;
          this.RightBarLineNPVChartData = result;
          this.doRightBarLineNPVChart();
        });
    }
  }
//===============================================================
// TEMPLATE END: component.ts.2.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.2.1.tpl
//===============================================================
  fetchLeftStackedBarNPVChart() {
    this.loading = true;
    this.type = "original";
    if (this.type == "original") {
      this.portfolioSvc.getLeftStackedBarNPVChart(this.scenarioId, this.reqModel)
        .subscribe(result => {

          this.loading = false;
          this.LeftStackedBarNPVChartData = result;
          this.doLeftStackedBarNPVChart();
        });
    } else if (this.type == "alternative") {
      this.portfolioSvc.getLeftStackedBarNPVChart(this.scenarioId, this.reqModel)
        .subscribe(result => {

          this.loading = false;
          this.LeftStackedBarNPVChartData = result;
          this.doLeftStackedBarNPVChart();
        });
    }
  }
//===============================================================
// TEMPLATE END: component.ts.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.2.2.tpl
//===============================================================
  fetchRightStackedBarNPVChart() {
    this.loading = true;
    this.type = "original";
    if (this.type == "original") {
      this.portfolioSvc.getRightStackedBarNPVChart(this.compareScenarioId, this.reqModel)
        .subscribe(result => {
          this.compared = true;
          this.loading = false;
          this.RightStackedBarNPVChartData = result;
          this.doRightStackedBarNPVChart();
        });
    } else if (this.type == "alternative") {
      this.portfolioSvc.getRightStackedBarNPVChart(this.compareScenarioId, this.reqModel)
        .subscribe(result => {
          this.compared = true;
          this.loading = false;
          this.RightStackedBarNPVChartData = result;
          this.doRightStackedBarNPVChart();
        });
    }
  }
//===============================================================
// TEMPLATE END: component.ts.2.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.2.1.tpl
//===============================================================
  fetchLeftRadarElementChart() {
    this.loading = true;
    this.type = "original";
    if (this.type == "original") {
      this.portfolioSvc.getLeftRadarElementChart(this.scenarioId, this.reqModel)
        .subscribe(result => {

          this.loading = false;
          this.LeftRadarElementChartData = result;
          this.doLeftRadarElementChart();
        });
    } else if (this.type == "alternative") {
      this.portfolioSvc.getLeftRadarElementChart(this.scenarioId, this.reqModel)
        .subscribe(result => {

          this.loading = false;
          this.LeftRadarElementChartData = result;
          this.doLeftRadarElementChart();
        });
    }
  }
//===============================================================
// TEMPLATE END: component.ts.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.2.2.tpl
//===============================================================
  fetchRightRadarElementChart() {
    this.loading = true;
    this.type = "original";
    if (this.type == "original") {
      this.portfolioSvc.getRightRadarElementChart(this.compareScenarioId, this.reqModel)
        .subscribe(result => {
          this.compared = true;
          this.loading = false;
          this.RightRadarElementChartData = result;
          this.doRightRadarElementChart();
        });
    } else if (this.type == "alternative") {
      this.portfolioSvc.getRightRadarElementChart(this.compareScenarioId, this.reqModel)
        .subscribe(result => {
          this.compared = true;
          this.loading = false;
          this.RightRadarElementChartData = result;
          this.doRightRadarElementChart();
        });
    }
  }
//===============================================================
// TEMPLATE END: component.ts.2.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.2.1.tpl
//===============================================================
  fetchLeftStackedBarOSRiskChart() {
    this.loading = true;
    this.type = "original";
    if (this.type == "original") {
      this.portfolioSvc.getLeftStackedBarOSRiskChart(this.scenarioId, this.reqModel)
        .subscribe(result => {

          this.loading = false;
          this.LeftStackedBarOSRiskChartData = result;
          this.doLeftStackedBarOSRiskChart();
        });
    } else if (this.type == "alternative") {
      this.portfolioSvc.getLeftStackedBarOSRiskChart(this.scenarioId, this.reqModel)
        .subscribe(result => {

          this.loading = false;
          this.LeftStackedBarOSRiskChartData = result;
          this.doLeftStackedBarOSRiskChart();
        });
    }
  }
//===============================================================
// TEMPLATE END: component.ts.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.2.2.tpl
//===============================================================
  fetchRightStackedBarOSRiskChart() {
    this.loading = true;
    this.type = "original";
    if (this.type == "original") {
      this.portfolioSvc.getRightStackedBarOSRiskChart(this.compareScenarioId, this.reqModel)
        .subscribe(result => {
          this.compared = true;
          this.loading = false;
          this.RightStackedBarOSRiskChartData = result;
          this.doRightStackedBarOSRiskChart();
        });
    } else if (this.type == "alternative") {
      this.portfolioSvc.getRightStackedBarOSRiskChart(this.compareScenarioId, this.reqModel)
        .subscribe(result => {
          this.compared = true;
          this.loading = false;
          this.RightStackedBarOSRiskChartData = result;
          this.doRightStackedBarOSRiskChart();
        });
    }
  }
//===============================================================
// TEMPLATE END: component.ts.2.2.tpl
//===============================================================

  /* GENCODE:MARKER:3:END */

  fetchData() {
    this.loading = true;
    this.reqModel.scenarioId = this.activatedRoute.snapshot.params.id;
    this.reqModel.strategicObjective = this.form.get('strategicObjective').value !== null && this.form.get('strategicObjective').value != undefined ? this.form.get('strategicObjective').value : null;
    this.reqModel.state = this.form.get('stateCode').value !== null && this.form.get('stateCode').value != undefined ? this.form.get('stateCode').value : null;
    this.reqModel.businessArea = this.form.get('businessArea').value !== null && this.form.get('businessArea').value != undefined ? this.form.get('businessArea').value : null;
    this.reqModel.projectType = this.form.get('projectTypeList').value !== null && this.form.get('projectTypeList').value != undefined ? this.form.get('projectTypeList').value : null;
    this.reqModel.voltage = this.form.get('voltageList').value !== null && this.form.get('voltageList').value != undefined ? this.form.get('voltageList').value : null;


    this.getAllCompareData();
    this.getResultApproved();
    this.getResultRejected();
    this.getResultSummary();
    this.fetchChart();
    //this.getCompareData();

    /* GENCODE:MARKER:16:START */

//===============================================================
// TEMPLATE START: gridcomponent.ts.2.4.tpl
//===============================================================
    this.fetchComparisonSummaryGrid();
//===============================================================
// TEMPLATE END: gridcomponent.ts.2.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.2.4.tpl
//===============================================================
    this.fetchComparisonPrioritisedGrid();
//===============================================================
// TEMPLATE END: gridcomponent.ts.2.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.2.4.tpl
//===============================================================
    this.fetchComparisonDeprioritizedGrid();
//===============================================================
// TEMPLATE END: gridcomponent.ts.2.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.2.4.tpl
//===============================================================
    this.fetchComparisonCategorizedPrio_1Grid();
//===============================================================
// TEMPLATE END: gridcomponent.ts.2.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.2.4.tpl
//===============================================================
    this.fetchComparisonCategorizedPrio_2Grid();
//===============================================================
// TEMPLATE END: gridcomponent.ts.2.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.2.4.tpl
//===============================================================
    this.fetchComparisonCategorizedDeprio_1Grid();
//===============================================================
// TEMPLATE END: gridcomponent.ts.2.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.2.4.tpl
//===============================================================
    this.fetchComparisonCategorizedDeprio_2Grid();
//===============================================================
// TEMPLATE END: gridcomponent.ts.2.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.2.4.tpl
//===============================================================
    this.fetchComparisonAlternateProjGrid();
//===============================================================
// TEMPLATE END: gridcomponent.ts.2.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.2.4.tpl
//===============================================================
    this.fetchComparisonSupplyGrid();
//===============================================================
// TEMPLATE END: gridcomponent.ts.2.4.tpl
//===============================================================

    /* GENCODE:MARKER:16:END */

    /* GENCODE:MARKER:12:START */

//===============================================================
// TEMPLATE START: gridcomponent.ts.3.1.tpl
//===============================================================
this.getResultApprovedGroupBy();
//===============================================================
// TEMPLATE END: gridcomponent.ts.3.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.3.1.tpl
//===============================================================
this.getResultRejectedGroupBy();
//===============================================================
// TEMPLATE END: gridcomponent.ts.3.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.3.1.tpl
//===============================================================
this.getResultApprovedGroupBy2();
//===============================================================
// TEMPLATE END: gridcomponent.ts.3.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.3.1.tpl
//===============================================================
this.getResultRejectedGroupBy2();
//===============================================================
// TEMPLATE END: gridcomponent.ts.3.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.3.2.tpl
//===============================================================
    this.fetchSupplyProjectGrid();
//===============================================================
// TEMPLATE END: gridcomponent.ts.3.2.tpl
//===============================================================

    /* GENCODE:MARKER:12:END */

    /* GENCODE:MARKER:4:START */

//===============================================================
// TEMPLATE START: component.ts.3.1.tpl
//===============================================================
    this.fetchLeftBarLineBudgetChart();
//===============================================================
// TEMPLATE END: component.ts.3.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.3.1.tpl
//===============================================================
    this.fetchLeftStackedBarBudgetChart();
//===============================================================
// TEMPLATE END: component.ts.3.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.3.1.tpl
//===============================================================
    this.fetchLeftBarLineNPVChart();
//===============================================================
// TEMPLATE END: component.ts.3.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.3.1.tpl
//===============================================================
    this.fetchLeftStackedBarNPVChart();
//===============================================================
// TEMPLATE END: component.ts.3.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.3.1.tpl
//===============================================================
    this.fetchLeftRadarElementChart();
//===============================================================
// TEMPLATE END: component.ts.3.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.3.1.tpl
//===============================================================
    this.fetchLeftStackedBarOSRiskChart();
//===============================================================
// TEMPLATE END: component.ts.3.1.tpl
//===============================================================

    /* GENCODE:MARKER:4:END */
    // this.watchImportCompleted();
  }

  updateChart() {
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(this.chartRef.nativeElement, {
      type: "bubble",
      data: {
        datasets: this.chartData
      },
      options: {
        responsive: true,
        scales: {
          xAxes: [{
            type: "logarithmic",
            stacked: true,
            scaleLabel: {
              display: true,
              labelString: "Total TCO (RM mil)"
            },
            ticks: {
              callback: function(label, index, labels) {

                var num = Number(label);
                if(!isNaN(num) && num > 0)
                label = num / 1000000;

                return label.toLocaleString('en-GB', {style:"currency", currency:"MYR"}).replace('MYR', '');
                // return label.toLocaleString('en-GB');
              }
            },
            afterBuildTicks: (chartObj) => {
              // Override if there are too many default ticks to avoid overlapping label
              if(chartObj.ticks.length > 20){
                var newTicks = this.generateLogScaleTicks(chartObj.ticks[0], chartObj.ticks[chartObj.ticks.length -1], "x");
                return newTicks;
              }else{
                return chartObj.ticks;
              }
            }
          }],
          yAxes: [{
            type: "logarithmic",
            stacked: true,
            scaleLabel: {
              display: true,
              labelString: "NPV Risk Reduced (RM mil)"
            },
            ticks: {
              callback: function(label, index, labels) {

                var num = Number(label);
                if(!isNaN(num) && num > 0)
                label = num / 1000000; 

                return label.toLocaleString('en-GB', {style:"currency", currency:"MYR"}).replace('MYR', '');
                // return label.toLocaleString('en-GB');
              }
            },
            afterBuildTicks: (chartObj) => {
              // Override if there are too many default ticks to avoid overlapping label
              if(chartObj.ticks.length > 20){
                var newTicks = this.generateLogScaleTicks(chartObj.ticks[chartObj.ticks.length -1], chartObj.ticks[0], "y");
                return newTicks;
              }else{
                return chartObj.ticks;
              }
            }
          }]
        },
        tooltips: {
          callbacks: {
            label: function(tooltipItem, chartData) {
              if (tooltipItem.datasetIndex != 2) {
                return [
                  chartData.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]["projectDefinition"],
                  "Total TCO: RM" + chartData.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]["totalTCO"].toLocaleString('en-GB', {style:"currency", currency:"MYR"}).replace('MYR', ''),
                  "NPV Risk Reduced: RM" + chartData.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]["npvRiskReduced"].toLocaleString('en-GB', {style:"currency", currency:"MYR"}).replace('MYR', ''),
                  "Project Score: " + chartData.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]["totalProjectScore"].toFixed(3),
                  "Mandatory: " + (chartData.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]["mandatory"] == true ? "Yes" : "No"),
                  "Strategic Objective: " + chartData.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]["strategicObjective"],
                ];
              }
              // projectScore: chartData[tooltipItem.datasetIndex].data[tooltipItem.index].projectScore;
              // riskReduced: chartData[tooltipItem.datasetIndex].data[tooltipItem.index].riskReduced;
              // totalBudget: chartData[tooltipItem.datasetIndex].data[tooltipItem.index].totalBudget;
              // var multiStringText = [projectDefinition, "Total Budget:" + this.totalBudget, "Risk Reduced:" + this.riskReduced, "Project Score:" + this.projectScore];
              // return multiStringText;
            }
          }
        }
      },
    });
  }

  /* GENCODE:MARKER:5:START */

//===============================================================
// TEMPLATE START: component.ts.4.1.tpl
//===============================================================
  doLeftBarLineBudgetChart() {
    function drawDatasetPointsLabels(obj) {
      var chartInstance = obj.chart;
      var ctx = chartInstance.ctx;
      ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
      ctx.textAlign = "center";
      ctx.fillStyle = "#666";

      var plotted = {};
      var idx=0;
      Chart.helpers.each(obj.data.datasets.forEach(function (dataset, i) {
        var meta = chartInstance.controller.getDatasetMeta(i);
        var hidden = chartInstance.controller.getDatasetMeta(i).hidden;

        if (hidden==null || hidden !=true) {
          plotted[idx]={};
          var type = meta.type;
          Chart.helpers.each(meta.data.forEach(function (bar, index) {
            var centerPoint = bar.getCenterPoint();
            var pad=0;
            
            plotted[idx][index] = {
              'val':dataset.data[index],
              'x':centerPoint.x,
              'y':centerPoint.y,
              'visible':hidden,
              'type':type
            };
          }),obj);
          idx++;
        }            
      }),obj);
      
      var lineMinX=null;
      var lineMinY=null;
      var lineMaxX=null;
      var lineMaxY=null;
      var lineFlag=null;
      var lineVal="";
      for (var row in plotted) {
        var i = Number(row);
        for (var column in plotted[row]) {
          var c = Number(column);
          var pad=0;
          if (plotted[i][c]['type']=='bar') {
            // Suppress if 0
            if (plotted[i][c]['val']!=0) {
                  // check overlap
                  /* Commented doesn't work for negative value
                  var prev=1;
                  if (i>0) {
                      while (i-prev>0 && plotted[i-prev][c]['val']==0) {
                          prev++;
                      }
                      if (plotted[i-prev][c]['val']!=0) {
                          var gap = (plotted[i][c]['y']+10) - plotted[i-prev][c]['y'];
                          if (gap>0) {
                              pad = gap;
                          }
                      }
                  } else {
                      var gap = plotted[i][c]['y'];
                  }
                  plotted[i][c]['y']=plotted[i][c]['y']-pad; */
                  ctx.fillText(plotted[i][c]['val'], plotted[i][c]['x'], plotted[i][c]['y']);
            }
          } else {
            lineFlag=1;
            lineVal=plotted[i][c]['val'];
            if (lineMinX>plotted[i][c]['x'] || lineMinX == null) {
              lineMinX = plotted[i][c]['x'];
            }
            if (lineMaxX<plotted[i][c]['x'] || lineMaxX == null) {
              lineMaxX = plotted[i][c]['x'];
            }
            if (lineMinY>plotted[i][c]['y'] || lineMinY == null) {
              lineMinY = plotted[i][c]['y'];
            }
            if (lineMaxY<plotted[i][c]['y'] || lineMaxY == null) {
              lineMaxY = plotted[i][c]['y'];
            }
          }
        }
      }
      if (lineFlag) {
        var midX = (lineMinX+lineMaxX)/2;
        var midY = (lineMinY+lineMaxY)/2;
        ctx.fillText(lineVal, midX, midY);
      }
    }

    if (this.LeftBarLineBudgetChart) {
      this.LeftBarLineBudgetChart.destroy();
    }

    var LeftBarLineBudgetChartDS = this.LeftBarLineBudgetChartData.datasets.filter(a => a.type == "bar");
    var maxBarData = 0;
    LeftBarLineBudgetChartDS[0].data.forEach(x =>{
      if (maxBarData < x){
        maxBarData = x;
      }
    });

    var LeftBarLineBudgetChart_Y2 = (Math.ceil(this.LeftBarLineBudgetChartData.datasets.filter(a => a.type == "line")[0].data[0]/10)) * 11;
    var LeftBarLineBudgetChart_Y = (Math.ceil(maxBarData/10)) * 11;

    this.LeftBarLineBudgetChart = new Chart(this.LeftBarLineBudgetChartRef.nativeElement, {
      type: "bar",
      data: this.LeftBarLineBudgetChartData,      
      options: {
        legend: {
            display: false
        },
        title: {
            display: true,
            text: 'Annual Budget Chart',
            fontSize: 20,
        },
        responsive: true,
        scales: {
          xAxes: [{
          }],
          yAxes: [{
            id: "yaxis1",
            position: 'left',
            scaleLabel: {
              display: true,
              labelString: "Annual Budget"
            },
            ticks: {  
              callback: function(label, index, labels) {
                return label.toLocaleString('en-GB', {style:"currency", currency:"MYR"}).replace('MYR', '') + ' (Mil)';
              },
              beginAtZero: true,
              max: LeftBarLineBudgetChart_Y,
              stepSize: LeftBarLineBudgetChart_Y/10
            }
          },
          {
            id:"yaxis2",
            position: 'right',
            scaleLabel: {
              display: true,
              labelString: "Total Budget"
            },
            ticks: {
              callback: function(label, index, labels) {
                return label.toLocaleString('en-GB', {style:"currency", currency:"MYR"}).replace('MYR', '') + ' (Mil)';
              },
              beginAtZero: true,
              max: LeftBarLineBudgetChart_Y2,
              stepSize: LeftBarLineBudgetChart_Y2/10
            }
          }]
        },
        animation: {
          onProgress: function () {drawDatasetPointsLabels(this)},
          onComplete: function () {drawDatasetPointsLabels(this)}
        }
      },
    });
  }
//===============================================================
// TEMPLATE END: component.ts.4.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.4.1.tpl
//===============================================================
  doRightBarLineBudgetChart() {
    function drawDatasetPointsLabels(obj) {
      var chartInstance = obj.chart;
      var ctx = chartInstance.ctx;
      ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
      ctx.textAlign = "center";
      ctx.fillStyle = "#666";

      var plotted = {};
      var idx=0;
      Chart.helpers.each(obj.data.datasets.forEach(function (dataset, i) {
        var meta = chartInstance.controller.getDatasetMeta(i);
        var hidden = chartInstance.controller.getDatasetMeta(i).hidden;

        if (hidden==null || hidden !=true) {
          plotted[idx]={};
          var type = meta.type;
          Chart.helpers.each(meta.data.forEach(function (bar, index) {
            var centerPoint = bar.getCenterPoint();
            var pad=0;
            
            plotted[idx][index] = {
              'val':dataset.data[index],
              'x':centerPoint.x,
              'y':centerPoint.y,
              'visible':hidden,
              'type':type
            };
          }),obj);
          idx++;
        }            
      }),obj);
      
      var lineMinX=null;
      var lineMinY=null;
      var lineMaxX=null;
      var lineMaxY=null;
      var lineFlag=null;
      var lineVal="";
      for (var row in plotted) {
        var i = Number(row);
        for (var column in plotted[row]) {
          var c = Number(column);
          var pad=0;
          if (plotted[i][c]['type']=='bar') {
            // Suppress if 0
            if (plotted[i][c]['val']!=0) {
                  // check overlap
                  /* Commented doesn't work for negative value
                  var prev=1;
                  if (i>0) {
                      while (i-prev>0 && plotted[i-prev][c]['val']==0) {
                          prev++;
                      }
                      if (plotted[i-prev][c]['val']!=0) {
                          var gap = (plotted[i][c]['y']+10) - plotted[i-prev][c]['y'];
                          if (gap>0) {
                              pad = gap;
                          }
                      }
                  } else {
                      var gap = plotted[i][c]['y'];
                  }
                  plotted[i][c]['y']=plotted[i][c]['y']-pad; */
                  ctx.fillText(plotted[i][c]['val'], plotted[i][c]['x'], plotted[i][c]['y']);
            }
          } else {
            lineFlag=1;
            lineVal=plotted[i][c]['val'];
            if (lineMinX>plotted[i][c]['x'] || lineMinX == null) {
              lineMinX = plotted[i][c]['x'];
            }
            if (lineMaxX<plotted[i][c]['x'] || lineMaxX == null) {
              lineMaxX = plotted[i][c]['x'];
            }
            if (lineMinY>plotted[i][c]['y'] || lineMinY == null) {
              lineMinY = plotted[i][c]['y'];
            }
            if (lineMaxY<plotted[i][c]['y'] || lineMaxY == null) {
              lineMaxY = plotted[i][c]['y'];
            }
          }
        }
      }
      if (lineFlag) {
        var midX = (lineMinX+lineMaxX)/2;
        var midY = (lineMinY+lineMaxY)/2;
        ctx.fillText(lineVal, midX, midY);
      }
    }

    if (this.RightBarLineBudgetChart) {
      this.RightBarLineBudgetChart.destroy();
    }

    var RightBarLineBudgetChartDS = this.RightBarLineBudgetChartData.datasets.filter(a => a.type == "bar");
    var maxBarData = 0;
    RightBarLineBudgetChartDS[0].data.forEach(x =>{
      if (maxBarData < x){
        maxBarData = x;
      }
    });

    var RightBarLineBudgetChart_Y2 = (Math.ceil(this.RightBarLineBudgetChartData.datasets.filter(a => a.type == "line")[0].data[0]/10)) * 11;
    var RightBarLineBudgetChart_Y = (Math.ceil(maxBarData/10)) * 11;

    this.RightBarLineBudgetChart = new Chart(this.RightBarLineBudgetChartRef.nativeElement, {
      type: "bar",
      data: this.RightBarLineBudgetChartData,      
      options: {
        legend: {
            display: false
        },
        title: {
            display: true,
            text: 'Annual Budget Chart',
            fontSize: 20,
        },
        responsive: true,
        scales: {
          xAxes: [{
          }],
          yAxes: [{
            id: "yaxis1",
            position: 'left',
            scaleLabel: {
              display: true,
              labelString: "Annual Budget"
            },
            ticks: {  
              callback: function(label, index, labels) {
                return label.toLocaleString('en-GB', {style:"currency", currency:"MYR"}).replace('MYR', '') + ' (Mil)';
              },
              beginAtZero: true,
              max: RightBarLineBudgetChart_Y,
              stepSize: RightBarLineBudgetChart_Y/10
            }
          },
          {
            id:"yaxis2",
            position: 'right',
            scaleLabel: {
              display: true,
              labelString: "Total Budget"
            },
            ticks: {
              callback: function(label, index, labels) {
                return label.toLocaleString('en-GB', {style:"currency", currency:"MYR"}).replace('MYR', '') + ' (Mil)';
              },
              beginAtZero: true,
              max: RightBarLineBudgetChart_Y2,
              stepSize: RightBarLineBudgetChart_Y2/10
            }
          }]
        },
        animation: {
          onProgress: function () {drawDatasetPointsLabels(this)},
          onComplete: function () {drawDatasetPointsLabels(this)}
        }
      },
    });
  }
//===============================================================
// TEMPLATE END: component.ts.4.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.4.2.tpl
//===============================================================
  doLeftStackedBarBudgetChart() {

    function drawDatasetPointsLabels(obj) {
      var chartInstance = obj.chart;
      var ctx = chartInstance.ctx;
      ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
      ctx.textAlign = "center";
      var plotted = {};
      var idx=0;
      Chart.helpers.each(obj.data.datasets.forEach(function (dataset, i) {
        var meta = chartInstance.controller.getDatasetMeta(i);
        var hidden = chartInstance.controller.getDatasetMeta(i).hidden;

        if (hidden==null || hidden !=true) {
          plotted[idx]={};
          Chart.helpers.each(meta.data.forEach(function (bar, index) {
            var centerPoint = bar.getCenterPoint();
            var pad=0;
            
            plotted[idx][index] = {
              'val':dataset.data[index],
              'x':centerPoint.x,
              'y':centerPoint.y,
              'visible':hidden
            };
          }),obj);
          idx++;
        }            
      }),obj);
      
      for (var row in plotted) {
        var i = Number(row);
        for (var column in plotted[row]) {
          var c = Number(column);
          var pad=0;
          // Suppress if 0
          if (plotted[i][c]['val']!=0) {
                // check overlap
                /* Commented doesn't work for negative value
                var prev=1;
                if (i>0) {
                    while (i-prev>0 && plotted[i-prev][c]['val']==0) {
                        prev++;
                    }
                    if (plotted[i-prev][c]['val']!=0) {
                        var gap = (plotted[i][c]['y']+10) - plotted[i-prev][c]['y'];
                        if (gap>0) {
                            pad = gap;
                        }
                    }
                } else {
                    var gap = plotted[i][c]['y'];
                }
                plotted[i][c]['y']=plotted[i][c]['y']-pad; */
                ctx.fillText(plotted[i][c]['val'], plotted[i][c]['x'], plotted[i][c]['y']);
          }
        }
      }
    }

    if (this.LeftStackedBarBudgetChart) {
      this.LeftStackedBarBudgetChart.destroy();
    }

    this.LeftStackedBarBudgetChartData = this.adjustColor('Total Budget by Strategic Objective Chart', this.LeftStackedBarBudgetChartData);

    this.LeftStackedBarBudgetChart = new Chart(this.LeftStackedBarBudgetChartRef.nativeElement, {
        type: "bar",
        data: this.LeftStackedBarBudgetChartData,      
   
        options: {
            title: {
                display: true,
                text: 'Total Budget by Strategic Objective Chart',
                fontSize: 20
            },
            scales: {
                xAxes: [{
                    stacked: true
                }],
                yAxes: [{
                    stacked: true,
                    scaleLabel: {
                            display: true,
                            labelString: "Total Planned Budget",
                    },
                    ticks: {
                            callback: function(value, index, values) {
                                    // Customize the currency sign and format
                                    return 'MYR' + value + ' (Mil)';
                            }
                    }
                }]
            },
            animation: {
              onProgress: function () {drawDatasetPointsLabels(this)},
              onComplete: function () {drawDatasetPointsLabels(this)}
            }
        }
    });
  }
//===============================================================
// TEMPLATE END: component.ts.4.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.4.2.tpl
//===============================================================
  doRightStackedBarBudgetChart() {

    function drawDatasetPointsLabels(obj) {
      var chartInstance = obj.chart;
      var ctx = chartInstance.ctx;
      ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
      ctx.textAlign = "center";
      var plotted = {};
      var idx=0;
      Chart.helpers.each(obj.data.datasets.forEach(function (dataset, i) {
        var meta = chartInstance.controller.getDatasetMeta(i);
        var hidden = chartInstance.controller.getDatasetMeta(i).hidden;

        if (hidden==null || hidden !=true) {
          plotted[idx]={};
          Chart.helpers.each(meta.data.forEach(function (bar, index) {
            var centerPoint = bar.getCenterPoint();
            var pad=0;
            
            plotted[idx][index] = {
              'val':dataset.data[index],
              'x':centerPoint.x,
              'y':centerPoint.y,
              'visible':hidden
            };
          }),obj);
          idx++;
        }            
      }),obj);
      
      for (var row in plotted) {
        var i = Number(row);
        for (var column in plotted[row]) {
          var c = Number(column);
          var pad=0;
          // Suppress if 0
          if (plotted[i][c]['val']!=0) {
                // check overlap
                /* Commented doesn't work for negative value
                var prev=1;
                if (i>0) {
                    while (i-prev>0 && plotted[i-prev][c]['val']==0) {
                        prev++;
                    }
                    if (plotted[i-prev][c]['val']!=0) {
                        var gap = (plotted[i][c]['y']+10) - plotted[i-prev][c]['y'];
                        if (gap>0) {
                            pad = gap;
                        }
                    }
                } else {
                    var gap = plotted[i][c]['y'];
                }
                plotted[i][c]['y']=plotted[i][c]['y']-pad; */
                ctx.fillText(plotted[i][c]['val'], plotted[i][c]['x'], plotted[i][c]['y']);
          }
        }
      }
    }

    if (this.RightStackedBarBudgetChart) {
      this.RightStackedBarBudgetChart.destroy();
    }

    this.RightStackedBarBudgetChartData = this.adjustColor('Total Budget by Strategic Objective Chart', this.RightStackedBarBudgetChartData);

    this.RightStackedBarBudgetChart = new Chart(this.RightStackedBarBudgetChartRef.nativeElement, {
        type: "bar",
        data: this.RightStackedBarBudgetChartData,      
   
        options: {
            title: {
                display: true,
                text: 'Total Budget by Strategic Objective Chart',
                fontSize: 20
            },
            scales: {
                xAxes: [{
                    stacked: true
                }],
                yAxes: [{
                    stacked: true,
                    scaleLabel: {
                            display: true,
                            labelString: "Total Planned Budget",
                    },
                    ticks: {
                            callback: function(value, index, values) {
                                    // Customize the currency sign and format
                                    return 'MYR' + value + ' (Mil)';
                            }
                    }
                }]
            },
            animation: {
              onProgress: function () {drawDatasetPointsLabels(this)},
              onComplete: function () {drawDatasetPointsLabels(this)}
            }
        }
    });
  }
//===============================================================
// TEMPLATE END: component.ts.4.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.4.2.tpl
//===============================================================
  doLeftBarLineNPVChart() {

    function drawDatasetPointsLabels(obj) {
      var chartInstance = obj.chart;
      var ctx = chartInstance.ctx;
      ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
      ctx.textAlign = "center";
      var plotted = {};
      var idx=0;
      Chart.helpers.each(obj.data.datasets.forEach(function (dataset, i) {
        var meta = chartInstance.controller.getDatasetMeta(i);
        var hidden = chartInstance.controller.getDatasetMeta(i).hidden;

        if (hidden==null || hidden !=true) {
          plotted[idx]={};
          Chart.helpers.each(meta.data.forEach(function (bar, index) {
            var centerPoint = bar.getCenterPoint();
            var pad=0;
            
            plotted[idx][index] = {
              'val':dataset.data[index],
              'x':centerPoint.x,
              'y':centerPoint.y,
              'visible':hidden
            };
          }),obj);
          idx++;
        }            
      }),obj);
      
      for (var row in plotted) {
        var i = Number(row);
        for (var column in plotted[row]) {
          var c = Number(column);
          var pad=0;
          // Suppress if 0
          if (plotted[i][c]['val']!=0) {
                // check overlap
                /* Commented doesn't work for negative value
                var prev=1;
                if (i>0) {
                    while (i-prev>0 && plotted[i-prev][c]['val']==0) {
                        prev++;
                    }
                    if (plotted[i-prev][c]['val']!=0) {
                        var gap = (plotted[i][c]['y']+10) - plotted[i-prev][c]['y'];
                        if (gap>0) {
                            pad = gap;
                        }
                    }
                } else {
                    var gap = plotted[i][c]['y'];
                }
                plotted[i][c]['y']=plotted[i][c]['y']-pad; */
                ctx.fillText(plotted[i][c]['val'], plotted[i][c]['x'], plotted[i][c]['y']);
          }
        }
      }
    }

    if (this.LeftBarLineNPVChart) {
      this.LeftBarLineNPVChart.destroy();
    }

    this.LeftBarLineNPVChartData = this.adjustColor('Cumulative NPV Risk Reduction Chart', this.LeftBarLineNPVChartData);

    this.LeftBarLineNPVChart = new Chart(this.LeftBarLineNPVChartRef.nativeElement, {
        type: "bar",
        data: this.LeftBarLineNPVChartData,      
   
        options: {
            title: {
                display: true,
                text: 'Cumulative NPV Risk Reduction Chart',
                fontSize: 20
            },
            scales: {
                xAxes: [{
                    stacked: true
                }],
                yAxes: [{
                    stacked: true,
                    scaleLabel: {
                            display: true,
                            labelString: "Cumulative NPV Risk Reduction",
                    },
                    ticks: {
                            callback: function(value, index, values) {
                                    // Customize the currency sign and format
                                    return 'MYR' + value + ' (Mil)';
                            }
                    }
                }]
            },
            animation: {
              onProgress: function () {drawDatasetPointsLabels(this)},
              onComplete: function () {drawDatasetPointsLabels(this)}
            }
        }
    });
  }
//===============================================================
// TEMPLATE END: component.ts.4.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.4.2.tpl
//===============================================================
  doRightBarLineNPVChart() {

    function drawDatasetPointsLabels(obj) {
      var chartInstance = obj.chart;
      var ctx = chartInstance.ctx;
      ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
      ctx.textAlign = "center";
      var plotted = {};
      var idx=0;
      Chart.helpers.each(obj.data.datasets.forEach(function (dataset, i) {
        var meta = chartInstance.controller.getDatasetMeta(i);
        var hidden = chartInstance.controller.getDatasetMeta(i).hidden;

        if (hidden==null || hidden !=true) {
          plotted[idx]={};
          Chart.helpers.each(meta.data.forEach(function (bar, index) {
            var centerPoint = bar.getCenterPoint();
            var pad=0;
            
            plotted[idx][index] = {
              'val':dataset.data[index],
              'x':centerPoint.x,
              'y':centerPoint.y,
              'visible':hidden
            };
          }),obj);
          idx++;
        }            
      }),obj);
      
      for (var row in plotted) {
        var i = Number(row);
        for (var column in plotted[row]) {
          var c = Number(column);
          var pad=0;
          // Suppress if 0
          if (plotted[i][c]['val']!=0) {
                // check overlap
                /* Commented doesn't work for negative value
                var prev=1;
                if (i>0) {
                    while (i-prev>0 && plotted[i-prev][c]['val']==0) {
                        prev++;
                    }
                    if (plotted[i-prev][c]['val']!=0) {
                        var gap = (plotted[i][c]['y']+10) - plotted[i-prev][c]['y'];
                        if (gap>0) {
                            pad = gap;
                        }
                    }
                } else {
                    var gap = plotted[i][c]['y'];
                }
                plotted[i][c]['y']=plotted[i][c]['y']-pad; */
                ctx.fillText(plotted[i][c]['val'], plotted[i][c]['x'], plotted[i][c]['y']);
          }
        }
      }
    }

    if (this.RightBarLineNPVChart) {
      this.RightBarLineNPVChart.destroy();
    }

    this.RightBarLineNPVChartData = this.adjustColor('Cumulative NPV Risk Reduction Chart', this.RightBarLineNPVChartData);

    this.RightBarLineNPVChart = new Chart(this.RightBarLineNPVChartRef.nativeElement, {
        type: "bar",
        data: this.RightBarLineNPVChartData,      
   
        options: {
            title: {
                display: true,
                text: 'Cumulative NPV Risk Reduction Chart',
                fontSize: 20
            },
            scales: {
                xAxes: [{
                    stacked: true
                }],
                yAxes: [{
                    stacked: true,
                    scaleLabel: {
                            display: true,
                            labelString: "Cumulative NPV Risk Reduction",
                    },
                    ticks: {
                            callback: function(value, index, values) {
                                    // Customize the currency sign and format
                                    return 'MYR' + value + ' (Mil)';
                            }
                    }
                }]
            },
            animation: {
              onProgress: function () {drawDatasetPointsLabels(this)},
              onComplete: function () {drawDatasetPointsLabels(this)}
            }
        }
    });
  }
//===============================================================
// TEMPLATE END: component.ts.4.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.4.2.tpl
//===============================================================
  doLeftStackedBarNPVChart() {

    function drawDatasetPointsLabels(obj) {
      var chartInstance = obj.chart;
      var ctx = chartInstance.ctx;
      ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
      ctx.textAlign = "center";
      var plotted = {};
      var idx=0;
      Chart.helpers.each(obj.data.datasets.forEach(function (dataset, i) {
        var meta = chartInstance.controller.getDatasetMeta(i);
        var hidden = chartInstance.controller.getDatasetMeta(i).hidden;

        if (hidden==null || hidden !=true) {
          plotted[idx]={};
          Chart.helpers.each(meta.data.forEach(function (bar, index) {
            var centerPoint = bar.getCenterPoint();
            var pad=0;
            
            plotted[idx][index] = {
              'val':dataset.data[index],
              'x':centerPoint.x,
              'y':centerPoint.y,
              'visible':hidden
            };
          }),obj);
          idx++;
        }            
      }),obj);
      
      for (var row in plotted) {
        var i = Number(row);
        for (var column in plotted[row]) {
          var c = Number(column);
          var pad=0;
          // Suppress if 0
          if (plotted[i][c]['val']!=0) {
                // check overlap
                /* Commented doesn't work for negative value
                var prev=1;
                if (i>0) {
                    while (i-prev>0 && plotted[i-prev][c]['val']==0) {
                        prev++;
                    }
                    if (plotted[i-prev][c]['val']!=0) {
                        var gap = (plotted[i][c]['y']+10) - plotted[i-prev][c]['y'];
                        if (gap>0) {
                            pad = gap;
                        }
                    }
                } else {
                    var gap = plotted[i][c]['y'];
                }
                plotted[i][c]['y']=plotted[i][c]['y']-pad; */
                ctx.fillText(plotted[i][c]['val'], plotted[i][c]['x'], plotted[i][c]['y']);
          }
        }
      }
    }

    if (this.LeftStackedBarNPVChart) {
      this.LeftStackedBarNPVChart.destroy();
    }

    this.LeftStackedBarNPVChartData = this.adjustColor('Total NPV Risk Reduction by Strategic Objective Chart', this.LeftStackedBarNPVChartData);

    this.LeftStackedBarNPVChart = new Chart(this.LeftStackedBarNPVChartRef.nativeElement, {
        type: "bar",
        data: this.LeftStackedBarNPVChartData,      
   
        options: {
            title: {
                display: true,
                text: 'Total NPV Risk Reduction by Strategic Objective Chart',
                fontSize: 20
            },
            scales: {
                xAxes: [{
                    stacked: true
                }],
                yAxes: [{
                    stacked: true,
                    scaleLabel: {
                            display: true,
                            labelString: "Total NPV Risk Reduction",
                    },
                    ticks: {
                            callback: function(value, index, values) {
                                    // Customize the currency sign and format
                                    return 'MYR' + value + ' (Mil)';
                            }
                    }
                }]
            },
            animation: {
              onProgress: function () {drawDatasetPointsLabels(this)},
              onComplete: function () {drawDatasetPointsLabels(this)}
            }
        }
    });
  }
//===============================================================
// TEMPLATE END: component.ts.4.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.4.2.tpl
//===============================================================
  doRightStackedBarNPVChart() {

    function drawDatasetPointsLabels(obj) {
      var chartInstance = obj.chart;
      var ctx = chartInstance.ctx;
      ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
      ctx.textAlign = "center";
      var plotted = {};
      var idx=0;
      Chart.helpers.each(obj.data.datasets.forEach(function (dataset, i) {
        var meta = chartInstance.controller.getDatasetMeta(i);
        var hidden = chartInstance.controller.getDatasetMeta(i).hidden;

        if (hidden==null || hidden !=true) {
          plotted[idx]={};
          Chart.helpers.each(meta.data.forEach(function (bar, index) {
            var centerPoint = bar.getCenterPoint();
            var pad=0;
            
            plotted[idx][index] = {
              'val':dataset.data[index],
              'x':centerPoint.x,
              'y':centerPoint.y,
              'visible':hidden
            };
          }),obj);
          idx++;
        }            
      }),obj);
      
      for (var row in plotted) {
        var i = Number(row);
        for (var column in plotted[row]) {
          var c = Number(column);
          var pad=0;
          // Suppress if 0
          if (plotted[i][c]['val']!=0) {
                // check overlap
                /* Commented doesn't work for negative value
                var prev=1;
                if (i>0) {
                    while (i-prev>0 && plotted[i-prev][c]['val']==0) {
                        prev++;
                    }
                    if (plotted[i-prev][c]['val']!=0) {
                        var gap = (plotted[i][c]['y']+10) - plotted[i-prev][c]['y'];
                        if (gap>0) {
                            pad = gap;
                        }
                    }
                } else {
                    var gap = plotted[i][c]['y'];
                }
                plotted[i][c]['y']=plotted[i][c]['y']-pad; */
                ctx.fillText(plotted[i][c]['val'], plotted[i][c]['x'], plotted[i][c]['y']);
          }
        }
      }
    }

    if (this.RightStackedBarNPVChart) {
      this.RightStackedBarNPVChart.destroy();
    }

    this.RightStackedBarNPVChartData = this.adjustColor('Total NPV Risk Reduction by Strategic Objective Chart', this.RightStackedBarNPVChartData);

    this.RightStackedBarNPVChart = new Chart(this.RightStackedBarNPVChartRef.nativeElement, {
        type: "bar",
        data: this.RightStackedBarNPVChartData,      
   
        options: {
            title: {
                display: true,
                text: 'Total NPV Risk Reduction by Strategic Objective Chart',
                fontSize: 20
            },
            scales: {
                xAxes: [{
                    stacked: true
                }],
                yAxes: [{
                    stacked: true,
                    scaleLabel: {
                            display: true,
                            labelString: "Total NPV Risk Reduction",
                    },
                    ticks: {
                            callback: function(value, index, values) {
                                    // Customize the currency sign and format
                                    return 'MYR' + value + ' (Mil)';
                            }
                    }
                }]
            },
            animation: {
              onProgress: function () {drawDatasetPointsLabels(this)},
              onComplete: function () {drawDatasetPointsLabels(this)}
            }
        }
    });
  }
//===============================================================
// TEMPLATE END: component.ts.4.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.4.5.tpl
//===============================================================
  doLeftRadarElementChart() {
    if (this.LeftRadarElementChart) {
      this.LeftRadarElementChart.destroy();
    }

    this.LeftRadarElementChart = new Chart(this.LeftRadarElementChartRef.nativeElement, {
        type: "radar",
        data: this.LeftRadarElementChartData,
        options : {
            title: {
                display: true,
                text: 'Radar Chart Cumulative Risk by Elements',
                fontSize: 20
            },
        
            scale: {
                angleLines: {
                    display: false
                },
            }
        }
    });
  }
//===============================================================
// TEMPLATE END: component.ts.4.5.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.4.5.tpl
//===============================================================
  doRightRadarElementChart() {
    if (this.RightRadarElementChart) {
      this.RightRadarElementChart.destroy();
    }

    this.RightRadarElementChart = new Chart(this.RightRadarElementChartRef.nativeElement, {
        type: "radar",
        data: this.RightRadarElementChartData,
        options : {
            title: {
                display: true,
                text: 'Radar Chart Cumulative Risk by Elements',
                fontSize: 20
            },
        
            scale: {
                angleLines: {
                    display: false
                },
            }
        }
    });
  }
//===============================================================
// TEMPLATE END: component.ts.4.5.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.4.2.tpl
//===============================================================
  doLeftStackedBarOSRiskChart() {

    function drawDatasetPointsLabels(obj) {
      var chartInstance = obj.chart;
      var ctx = chartInstance.ctx;
      ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
      ctx.textAlign = "center";
      var plotted = {};
      var idx=0;
      Chart.helpers.each(obj.data.datasets.forEach(function (dataset, i) {
        var meta = chartInstance.controller.getDatasetMeta(i);
        var hidden = chartInstance.controller.getDatasetMeta(i).hidden;

        if (hidden==null || hidden !=true) {
          plotted[idx]={};
          Chart.helpers.each(meta.data.forEach(function (bar, index) {
            var centerPoint = bar.getCenterPoint();
            var pad=0;
            
            plotted[idx][index] = {
              'val':dataset.data[index],
              'x':centerPoint.x,
              'y':centerPoint.y,
              'visible':hidden
            };
          }),obj);
          idx++;
        }            
      }),obj);
      
      for (var row in plotted) {
        var i = Number(row);
        for (var column in plotted[row]) {
          var c = Number(column);
          var pad=0;
          // Suppress if 0
          if (plotted[i][c]['val']!=0) {
                // check overlap
                /* Commented doesn't work for negative value
                var prev=1;
                if (i>0) {
                    while (i-prev>0 && plotted[i-prev][c]['val']==0) {
                        prev++;
                    }
                    if (plotted[i-prev][c]['val']!=0) {
                        var gap = (plotted[i][c]['y']+10) - plotted[i-prev][c]['y'];
                        if (gap>0) {
                            pad = gap;
                        }
                    }
                } else {
                    var gap = plotted[i][c]['y'];
                }
                plotted[i][c]['y']=plotted[i][c]['y']-pad; */
                ctx.fillText(plotted[i][c]['val'], plotted[i][c]['x'], plotted[i][c]['y']);
          }
        }
      }
    }

    if (this.LeftStackedBarOSRiskChart) {
      this.LeftStackedBarOSRiskChart.destroy();
    }

    this.LeftStackedBarOSRiskChartData = this.adjustColor('Chart of Outstanding Risk', this.LeftStackedBarOSRiskChartData);

    this.LeftStackedBarOSRiskChart = new Chart(this.LeftStackedBarOSRiskChartRef.nativeElement, {
        type: "bar",
        data: this.LeftStackedBarOSRiskChartData,      
   
        options: {
            title: {
                display: true,
                text: 'Chart of Outstanding Risk',
                fontSize: 20
            },
            scales: {
                xAxes: [{
                    stacked: true
                }],
                yAxes: [{
                    stacked: true,
                    scaleLabel: {
                            display: true,
                            labelString: "Risk Outstanding",
                    },
                    ticks: {
                            callback: function(value, index, values) {
                                    // Customize the currency sign and format
                                    return 'MYR' + value + ' (Mil)';
                            }
                    }
                }]
            },
            animation: {
              onProgress: function () {drawDatasetPointsLabels(this)},
              onComplete: function () {drawDatasetPointsLabels(this)}
            }
        }
    });
  }
//===============================================================
// TEMPLATE END: component.ts.4.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.4.2.tpl
//===============================================================
  doRightStackedBarOSRiskChart() {

    function drawDatasetPointsLabels(obj) {
      var chartInstance = obj.chart;
      var ctx = chartInstance.ctx;
      ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
      ctx.textAlign = "center";
      var plotted = {};
      var idx=0;
      Chart.helpers.each(obj.data.datasets.forEach(function (dataset, i) {
        var meta = chartInstance.controller.getDatasetMeta(i);
        var hidden = chartInstance.controller.getDatasetMeta(i).hidden;

        if (hidden==null || hidden !=true) {
          plotted[idx]={};
          Chart.helpers.each(meta.data.forEach(function (bar, index) {
            var centerPoint = bar.getCenterPoint();
            var pad=0;
            
            plotted[idx][index] = {
              'val':dataset.data[index],
              'x':centerPoint.x,
              'y':centerPoint.y,
              'visible':hidden
            };
          }),obj);
          idx++;
        }            
      }),obj);
      
      for (var row in plotted) {
        var i = Number(row);
        for (var column in plotted[row]) {
          var c = Number(column);
          var pad=0;
          // Suppress if 0
          if (plotted[i][c]['val']!=0) {
                // check overlap
                /* Commented doesn't work for negative value
                var prev=1;
                if (i>0) {
                    while (i-prev>0 && plotted[i-prev][c]['val']==0) {
                        prev++;
                    }
                    if (plotted[i-prev][c]['val']!=0) {
                        var gap = (plotted[i][c]['y']+10) - plotted[i-prev][c]['y'];
                        if (gap>0) {
                            pad = gap;
                        }
                    }
                } else {
                    var gap = plotted[i][c]['y'];
                }
                plotted[i][c]['y']=plotted[i][c]['y']-pad; */
                ctx.fillText(plotted[i][c]['val'], plotted[i][c]['x'], plotted[i][c]['y']);
          }
        }
      }
    }

    if (this.RightStackedBarOSRiskChart) {
      this.RightStackedBarOSRiskChart.destroy();
    }

    this.RightStackedBarOSRiskChartData = this.adjustColor('Chart of Outstanding Risk', this.RightStackedBarOSRiskChartData);

    this.RightStackedBarOSRiskChart = new Chart(this.RightStackedBarOSRiskChartRef.nativeElement, {
        type: "bar",
        data: this.RightStackedBarOSRiskChartData,      
   
        options: {
            title: {
                display: true,
                text: 'Chart of Outstanding Risk',
                fontSize: 20
            },
            scales: {
                xAxes: [{
                    stacked: true
                }],
                yAxes: [{
                    stacked: true,
                    scaleLabel: {
                            display: true,
                            labelString: "Risk Outstanding",
                    },
                    ticks: {
                            callback: function(value, index, values) {
                                    // Customize the currency sign and format
                                    return 'MYR' + value + ' (Mil)';
                            }
                    }
                }]
            },
            animation: {
              onProgress: function () {drawDatasetPointsLabels(this)},
              onComplete: function () {drawDatasetPointsLabels(this)}
            }
        }
    });
  }
//===============================================================
// TEMPLATE END: component.ts.4.2.tpl
//===============================================================

  /* GENCODE:MARKER:5:END */

  getResultApproved(): Promise<any> {
    if (this.isResultApprovedFetched) {
      return Promise.resolve(this.listOfMutually['lhs']);
    }

    return new Promise((resolve, reject) => {
      this.portfolioSvc
        .getPortfolioResultApproved(this.scenarioId, this.reqModel)
        .subscribe(response => {
          this.listOfApproved = response;
          if (this.listOfMutually['lhs']) {
            delete this.listOfMutually['lhs'];
          }
          this.listOfMutually['lhs'] = {};
          for (var rec in this.listOfApproved) {
            this.listOfMutually['lhs'][this.listOfApproved[rec].Project_ID]=this.listOfApproved[rec];
          }
          this.isResultApprovedFetched = true;
          resolve(this.listOfMutually['lhs']);
      }, error => reject(error));
    });
  }

  getResultRejected() {
    this.portfolioSvc
      .getPortfolioResultRejected(this.scenarioId, this.reqModel)
      .subscribe(response => {
        this.listOfRejected = response;
      });
  }

  getResultSummary() {
    this.portfolioSvc
      .getResultSummaryGrid(this.scenarioId, this.reqModel)
      .subscribe(response => {
        this.listOfSummary = response;
      });
  }

  getAllCompareResultSummary(scenarioIds: string) {
    this.portfolioSvc
      .getPortfolioCompareResultSummary(scenarioIds, this.reqModel)
      .subscribe(response => {
        var tmpResp = response;

        // Map scenario name for grid column
        for(var idx in tmpResp.columns){
          var project = this.projectList.filter(x => ( "col"+ x.id.toString()) == tmpResp.columns[idx].columnName);
          if(project.length > 0){
            tmpResp.columns[idx].displayName = project[0].scenarioName;
          }
        }

        this.allPrioSummaryGridData = [];
        this.allDeprioSummaryGridData = [];
        this.allProjSummaryGridData = [];
        this.allSummaryGridCol = tmpResp.columns;

        var tmpPrioData = [], tmpDeprioData = [], tmpTotalData = [];
        for(var idx in tmpResp.data){
          if(tmpResp.data[idx]["colCategory"] == "Prioritised"){
            tmpPrioData.push(tmpResp.data[idx]);
          }else if(tmpResp.data[idx]["colCategory"] == "Deprioritised"){
            tmpDeprioData.push(tmpResp.data[idx]);
          }else if (tmpResp.data[idx]["colCategory"] == "Total"){
            tmpTotalData.push(tmpResp.data[idx]);
          }
        }

        this.allPrioSummaryGridData = tmpPrioData;
        this.allDeprioSummaryGridData = tmpDeprioData;
        this.allProjSummaryGridData = tmpTotalData;
      });
  }

//   public onDeleteClick(cand) {
//     if (this.editable) {
//       this.loading = true;
//       this.portfolioSvc
//         .deleteAlternateProject(
//           {
//             scenarioId: this.scenarioId, 
//             projectId: cand
//           }
//         )
//         .subscribe((rs) => {
//           this.loading = false;
//           if (rs.success) {
//             this.notification.success("Deleted Successfully", "");
//             this.fetchData();
//           }
//         });
//     }
//   }

  clearFilter() {
    this.baList = this.filters.businessArea;
    this.form.patchValue({ strategicObjective: null });
    this.form.patchValue({ subObjective: null });
    this.form.patchValue({ stateCode: null });
    this.form.patchValue({ businessArea: null });
    this.form.patchValue({ voltageList: null });
    this.form.patchValue({ projectTypeList: null });

    this.reqModel.sortByColumn = "";
    this.reqModel.sortDirection = "";

    this.fetchData();
  }

  addCompare() {
    this.filterList = [];
    this.compareItem.forEach(element => {
      var tempId = this.compareForm.get(element.name).value;
      if (tempId) {
        var tempstr = this.projectList.filter(x => x.id == tempId)[0];
        //console.log('tempstr', tempstr);
        tempstr['rec']=element;
        this.filterList = [tempstr].concat(this.filterList);
      }
    });
  }

  getItemNum() {
    var result;
    if (this.currentItemNo) {
      result = this.currentItemNo;
    } else {
      for (var ci in this.compareItem) {
        var compareValue = this.compareForm.get(this.compareItem[ci].name).value
        if (compareValue) {
          result = this.compareItem[ci].name;
          //this.currentItemNo = this.compareItem[ci].name;
          //console.log("use this -->", result);
          break;
        }
      }
    }
    return result;
  }

  doFetchAndCompare() {
    this.getCompareData();
    forkJoin([this.getResultApproved(), this.getResultApprovedCompare()]).subscribe(() => {
      this.doInclusiveExclusive();
    });
    this.tablelistInit = this.tablelistTest;
  }

  addThenCompare() {
    this.addItem();
    this.getAllCompareData();
    this.doFetchAndCompare();
    this.currentItemNo=this.getItemNum();
  }

  /* GENCODE:MARKER:10:START */
  doInclusiveExclusive() {
      var keys = this.compDict(this.listOfMutually['lhs'], this.listOfMutually['rhs']);
  
      // Inclusive
      if (this.listOfMutually['inclusive']) {
        delete this.listOfMutually['inclusive'];
      }
      this.listOfMutually['inclusive'] = [];
      for (var rec in keys['both']) {
        this.listOfMutually['inclusive'].push(keys['both'][rec]);
      }
  
      // Exclusive left
      if (this.listOfMutually['exclusiveLeft']) {
        delete this.listOfMutually['exclusiveLeft'];
      }
      this.listOfMutually['exclusiveLeft'] = [];
      for (var rec in keys['lhs']) {
        this.listOfMutually['exclusiveLeft'].push(keys['lhs'][rec]);
      }
  
      // Exclusive right
      if (this.listOfMutually['exclusiveRight']) {
        delete this.listOfMutually['exclusiveRight'];
      }
      this.listOfMutually['exclusiveRight'] = [];
      for (var rec in keys['rhs']) {
        this.listOfMutually['exclusiveRight'].push(keys['rhs'][rec]);
      }
      this.isResultApprovedCompareFetched = false;
  }
  /* GENCODE:MARKER:10:END */

  getCompareData() {

    if (this.getItemNum() != null) {
    this.compareScenarioId = this.compareForm.get(this.getItemNum()).value;
    //this.compareScenarioId = this.compareForm.get('compare0').value;
    //var tempstr = this.comparisonProjectList.filter(x => x.id == this.compareScenarioId);
    //this.filterList = tempstr;

    this.reqModel.strategicObjective = this.form.get('strategicObjective').value !== null && this.form.get('strategicObjective').value != undefined ? this.form.get('strategicObjective').value : null;
    this.reqModel.state = this.form.get('stateCode').value !== null && this.form.get('stateCode').value != undefined ? this.form.get('stateCode').value : null;
    this.reqModel.businessArea = this.form.get('businessArea').value !== null && this.form.get('businessArea').value != undefined ? this.form.get('businessArea').value : null;
    this.reqModel.projectType = this.form.get('projectTypeList').value !== null && this.form.get('projectTypeList').value != undefined ? this.form.get('projectTypeList').value : null;
    this.reqModel.voltage = this.form.get('voltageList').value !== null && this.form.get('voltageList').value != undefined ? this.form.get('voltageList').value : null;

    this.getByIdCompare();
    this.getResultSummaryCompare();
    this.getResultApprovedCompare();
    this.getResultRejectedCompare();
    this.getResultSupplyCompare();
    this.fetchChartCompare();
    
    /* GENCODE:MARKER:19:START */

//===============================================================
// TEMPLATE START: gridcomponent.ts.2.4.tpl
//===============================================================
    this.fetchComparisonRightSummaryGrid();
//===============================================================
// TEMPLATE END: gridcomponent.ts.2.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.2.4.tpl
//===============================================================
    this.fetchComparisonRightPrioritisedGrid();
//===============================================================
// TEMPLATE END: gridcomponent.ts.2.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.2.4.tpl
//===============================================================
    this.fetchComparisonRightDeprioritizedGrid();
//===============================================================
// TEMPLATE END: gridcomponent.ts.2.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.2.4.tpl
//===============================================================
    this.fetchComparisonRightCategorizedPrio_1Grid();
//===============================================================
// TEMPLATE END: gridcomponent.ts.2.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.2.4.tpl
//===============================================================
    this.fetchComparisonRightCategorizedPrio_2Grid();
//===============================================================
// TEMPLATE END: gridcomponent.ts.2.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.2.4.tpl
//===============================================================
    this.fetchComparisonRightCategorizedDeprio_1Grid();
//===============================================================
// TEMPLATE END: gridcomponent.ts.2.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.2.4.tpl
//===============================================================
    this.fetchComparisonRightCategorizedDeprio_2Grid();
//===============================================================
// TEMPLATE END: gridcomponent.ts.2.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.2.4.tpl
//===============================================================
    this.fetchComparisonRightAlternateProjGrid();
//===============================================================
// TEMPLATE END: gridcomponent.ts.2.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.2.4.tpl
//===============================================================
    this.fetchComparisonRightSupplyGrid();
//===============================================================
// TEMPLATE END: gridcomponent.ts.2.4.tpl
//===============================================================

    /* GENCODE:MARKER:19:END */

    /* GENCODE:MARKER:14:START */

//===============================================================
// TEMPLATE START: gridcomponent.ts.3.1.tpl
//===============================================================
this.getResultApprovedGroupByCompare();
//===============================================================
// TEMPLATE END: gridcomponent.ts.3.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.3.1.tpl
//===============================================================
this.getResultRejectedGroupByCompare();
//===============================================================
// TEMPLATE END: gridcomponent.ts.3.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.3.1.tpl
//===============================================================
this.getResultApprovedGroupByCompare2();
//===============================================================
// TEMPLATE END: gridcomponent.ts.3.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.3.1.tpl
//===============================================================
this.getResultRejectedGroupByCompare2();
//===============================================================
// TEMPLATE END: gridcomponent.ts.3.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.3.1.tpl
//===============================================================
this.getResultSupplyCompare();
//===============================================================
// TEMPLATE END: gridcomponent.ts.3.1.tpl
//===============================================================

    /* GENCODE:MARKER:14:END */
    
    /* GENCODE:MARKER:6:START */

//===============================================================
// TEMPLATE START: component.ts.3.1.tpl
//===============================================================
    this.fetchRightBarLineBudgetChart();
//===============================================================
// TEMPLATE END: component.ts.3.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.3.1.tpl
//===============================================================
    this.fetchRightStackedBarBudgetChart();
//===============================================================
// TEMPLATE END: component.ts.3.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.3.1.tpl
//===============================================================
    this.fetchRightBarLineNPVChart();
//===============================================================
// TEMPLATE END: component.ts.3.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.3.1.tpl
//===============================================================
    this.fetchRightStackedBarNPVChart();
//===============================================================
// TEMPLATE END: component.ts.3.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.3.1.tpl
//===============================================================
    this.fetchRightRadarElementChart();
//===============================================================
// TEMPLATE END: component.ts.3.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.3.1.tpl
//===============================================================
    this.fetchRightStackedBarOSRiskChart();
//===============================================================
// TEMPLATE END: component.ts.3.1.tpl
//===============================================================

    /* GENCODE:MARKER:6:END */
    }
  }

  getAllCompareData() {

    // Get all compare scenario id
    var ids = [];
    for (var ci in this.compareItem) {
      var compareValue = this.compareForm.get(this.compareItem[ci].name).value
      if (compareValue) {
        ids.push(compareValue);
      }
    }

    if (ids.length > 0) {

    ids.unshift(this.scenarioId);

    this.reqModel.strategicObjective = this.form.get('strategicObjective').value !== null && this.form.get('strategicObjective').value != undefined ? this.form.get('strategicObjective').value : null;
    this.reqModel.state = this.form.get('stateCode').value !== null && this.form.get('stateCode').value != undefined ? this.form.get('stateCode').value : null;
    this.reqModel.businessArea = this.form.get('businessArea').value !== null && this.form.get('businessArea').value != undefined ? this.form.get('businessArea').value : null;
    this.reqModel.projectType = this.form.get('projectTypeList').value !== null && this.form.get('projectTypeList').value != undefined ? this.form.get('projectTypeList').value : null;
    this.reqModel.voltage = this.form.get('voltageList').value !== null && this.form.get('voltageList').value != undefined ? this.form.get('voltageList').value : null;

    this.getAllCompareResultSummary(ids.join(","));
    }
  }

  getByIdCompare() {
    this.scenarioSvs.getById(
      "portfolio",
      this.compareScenarioId
    ).subscribe(result => {
      this.numberOfYears2 = ((result.entity.endYear - result.entity.startYear) + 1);
      //here2
      this.hideUnwantedColumn(this.ComparisonRightSummaryGridHdr, "compare");
      this.hideUnwantedColumn(this.ComparisonRightPrioritisedGrid, "compare");
      this.hideUnwantedColumn(this.resultApprovedGroupByGridColumnsCompare, "compare");
      this.hideUnwantedColumn(this.resultApprovedGroupByGridColumnsCompare2, "compare");
    });
  }

  getResultApprovedCompare(): Promise<any> {
    if (this.isResultApprovedCompareFetched) {
      return Promise.resolve(this.listOfMutually['rhs']);
    }
  
    return new Promise((resolve, reject) => {
      this.portfolioSvc
        .getPortfolioResultApproved(this.compareScenarioId, this.reqModel)
        .subscribe(response => {
          this.listOfApprovedCompare = response;

          if (this.listOfMutually['rhs']) {
            delete this.listOfMutually['rhs'];
          }
          this.listOfMutually['rhs'] = {};
          for (var rec in this.listOfApprovedCompare ) {
            this.listOfMutually['rhs'][this.listOfApprovedCompare[rec].Project_ID]=this.listOfApprovedCompare[rec];
          }

          this.isResultApprovedCompareFetched = true;
          resolve(this.listOfMutually['rhs']);
        }, error => reject(error));
    });
  }

  getResultRejectedCompare() {
    this.portfolioSvc
      .getPortfolioResultRejected(this.compareScenarioId, this.reqModel)
      .subscribe(response => {
        this.listOfRejectedCompare = response;
      });
  }

  getResultSummaryCompare() {
    this.portfolioSvc
      .getResultSummaryGrid(this.compareScenarioId, this.reqModel)
      .subscribe(response => {
        this.listOfSummaryCompare = response;
      });
  }

  fetchChartCompare() {
    this.loading = true;
    this.portfolioSvc.getOriginalChart(this.compareScenarioId, this.reqModel)
      .subscribe(result => {
        this.compared = true;
        this.compareChartData = result.datasets;
        this.compareChartRefData = result;
        this.updateCompareChart();
      });
  }

  updateCompareChart() {
    if (this.compareChart) {
      this.compareChart.destroy();
    }
    this.compareChart = new Chart(this.compareChartRef.nativeElement, {
      type: "bubble",
      data: {
        datasets: this.compareChartData
      },
      options: {
        responsive: true,
        scales: {
          xAxes: [{
            type: "logarithmic",
            stacked: true,
            scaleLabel: {
              display: true,
              labelString: "Total TCO (RM mil)"
            },
            ticks: {
              callback: function(label, index, labels) {

                var num = Number(label);
                if(!isNaN(num) && num > 0)
                label = num / 1000000;

                return label.toLocaleString('en-GB', {style:"currency", currency:"MYR"}).replace('MYR', '');
                // return label.toLocaleString('en-GB');
              }
            },
            afterBuildTicks: (chartObj) => {
              // Override if there are too many default ticks to avoid overlapping label
              if(chartObj.ticks.length > 20){
                var newTicks = this.generateLogScaleTicks(chartObj.ticks[0], chartObj.ticks[chartObj.ticks.length -1], "x");
                return newTicks;
              }else{
                return chartObj.ticks;
              }
            }
          }],
          yAxes: [{
            type: "logarithmic",
            stacked: true,
            scaleLabel: {
              display: true,
              labelString: "NPV Risk Reduced (RM mil)"
            },
            ticks: {
              callback: function(label, index, labels) {

                var num = Number(label);
                if(!isNaN(num) && num > 0)
                label = num / 1000000;

                return label.toLocaleString('en-GB', {style:"currency", currency:"MYR"}).replace('MYR', '');
                // return label.toLocaleString('en-GB');
              }
            },
            afterBuildTicks: (chartObj) => {
              // Override if there are too many default ticks to avoid overlapping label
              if(chartObj.ticks.length > 20){
                var newTicks = this.generateLogScaleTicks(chartObj.ticks[chartObj.ticks.length -1], chartObj.ticks[0], "y");
                return newTicks;
              }else{
                return chartObj.ticks;
              }
            }
          }]
        },
        tooltips: {
          callbacks: {
            label: function(tooltipItem, chartData) {
              if (tooltipItem.datasetIndex != 2) {
                return [
                  chartData.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]["projectDefinition"],
                  "Total TCO: RM" + chartData.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]["totalTCO"].toLocaleString('en-GB', {style:"currency", currency:"MYR"}).replace('MYR', ''),
                  "NPV Risk Reduced: RM" + chartData.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]["npvRiskReduced"].toLocaleString('en-GB', {style:"currency", currency:"MYR"}).replace('MYR', ''),
                  "Project Score: " + chartData.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]["totalProjectScore"].toFixed(3),
                  "Mandatory: " + (chartData.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]["mandatory"] == true ? "Yes" : "No"),
                  "Strategic Objective: " + chartData.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]["strategicObjective"],
                ];
              }
              // projectScore: chartData[tooltipItem.datasetIndex].data[tooltipItem.index].projectScore;
              // riskReduced: chartData[tooltipItem.datasetIndex].data[tooltipItem.index].riskReduced;
              // totalBudget: chartData[tooltipItem.datasetIndex].data[tooltipItem.index].totalBudget;
              // var multiStringText = [projectDefinition, "Total Budget:" + this.totalBudget, "Risk Reduced:" + this.riskReduced, "Project Score:" + this.projectScore];
              // return multiStringText;
            }
          }
        }
      },
    });

    this.loading = false;
  }

  addItem() {
    if (this.compareCount<this.compareMax-1) {
      ++this.compareCount;
      this.compareItem.push({'number':this.compareCount,'name':'compare'+this.compareCount});      
    }
    this.addCompare();
  }

  onTabSelected(event) {
    this.currentItemNo=event.rec.name;
    //console.log("parent -->", event);
    //this.getCompareData();
    this.isResultApprovedCompareFetched = false;
    this.doFetchAndCompare();
  }

  /* GENCODE:MARKER:7:START */

//===============================================================
// TEMPLATE START: SyncColor.ts.2.1.tpl
//===============================================================
  normalizeLabel(token) {
    var result = token;
    if (token=='') {
      result = '#BLANK#';
    }
    return result;
  }

  getColorbyLabel(title, label, color) {
    var found = false;
    if (this.compareChartColors.hasOwnProperty(title)) {
      if (this.compareChartColors[title]['LABEL'].hasOwnProperty(label)) {
        found = true;
        color = this.compareChartColors[title]['LABEL'][this.normalizeLabel(label)]
      }
    }
    return {'found':found, 'color':color}
  }

  checkColor(title, color) {
    var found = false;
    if (this.compareChartColors.hasOwnProperty(title)) {
      if (this.compareChartColors[title]['COLOR'].hasOwnProperty(color)) {
        found = true;
      }
    }
    return {'found':found, 'color':color}
  }

  getNewColor(title) {
    var colorIdx=0;
    var color = this.compareFixedColorList[colorIdx];
    while (this.checkColor(title, color).found) {
      if (this.compareFixedColorList.length-1 > colorIdx) {
        ++colorIdx;
        // color = this.compareFixedColorList[colorIdx];
        color = this.modifyAlpha(this.compareFixedColorList[colorIdx], 0.5);
      } else {
        color = "rgba(255,255,255,0.5)";
        break;
      }
    }
    return color;
  }

  addChartColor(title, color, label) {
    if (!this.compareChartColors.hasOwnProperty(title)) {
      this.compareChartColors[title]={};
    }
    if (!this.compareChartColors[title].hasOwnProperty('COLOR')) {
      this.compareChartColors[title]['COLOR']={};
    }
    if (!this.compareChartColors[title]['COLOR'].hasOwnProperty(color)) {
      this.compareChartColors[title]['COLOR'][color] = label;
    }
  }

  addChartLabel(title, color, label) {
    if (!this.compareChartColors.hasOwnProperty(title)) {
      this.compareChartColors[title]={};
    }
    if (!this.compareChartColors[title].hasOwnProperty('LABEL')) {
      this.compareChartColors[title]['LABEL']={};
    }
    if (!this.compareChartColors[title]['LABEL'].hasOwnProperty(label)) {
      this.compareChartColors[title]['LABEL'][label] = color;
    }    
  }

  modifyAlpha(rgbaString, alphaValue) {
    // Use a regular expression to match the rgba values
    const rgbaRegex = /rgba\((\d{1,3}),(\d{1,3}),(\d{1,3}),(\d*\.?\d+)\)/;
    
    // Replace the existing alpha value with the new alphaValue parameter
    const newRgbaString = rgbaString.replace(rgbaRegex, `rgba($1,$2,$3,${alphaValue})`);
    
    return newRgbaString;
  }

  adjustColor(title, chartData) {
    for (var row in chartData['datasets']) {
      var label = this.normalizeLabel(chartData['datasets'][row]['label']);
      var color = chartData['datasets'][row]['backgroundColor'];
      var labelResult = this.getColorbyLabel(title, label, color);
      // Check for existing label
      if (labelResult.found) {
        chartData['datasets'][row]['backgroundColor'] = labelResult.color;
        chartData['datasets'][row]['borderColor'] = this.modifyAlpha(labelResult.color, 1);
      } else {
        // New label treatment
        var colorResult = this.checkColor(title, color);
        if (colorResult.found) { // existing color is in use
          color = this.getNewColor(title);
          chartData['datasets'][row]['backgroundColor'] = color;
          // chartData['datasets'][row]['borderColor'] = this.modifyAlpha(color, 1);
          chartData['datasets'][row]['borderColor'] = color;
        }
        this.addChartColor(title, color, label);
        this.addChartLabel(title, color, label);
      }
    }
    return chartData;
  }
//===============================================================
// TEMPLATE END: SyncColor.ts.2.1.tpl
//===============================================================

  /* GENCODE:MARKER:7:END */


  /* GENCODE:MARKER:8:START */

//===============================================================
// TEMPLATE START: download-btn.ts.1.1.tpl
//===============================================================
  downloadChart(chartName) {
    //console.log('Downloading Chart:'+chartName);
    var node:any = document.getElementById(chartName);
    htmlToImage.toJpeg(node)
      .then(function (dataUrl) {
        var img = new Image();
        img.src = dataUrl;
        saveAs(img.src, chartName+'.jpg');
      })
      .catch(function (error) {
        console.error('oops, something went wrong!', error);
      });
  }

  downloadExcel(chartName, chartData) {
    //console.log('Downloading Excel:');
    //console.log(chartData.sqlData);
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(chartData.sqlData);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, chartName);
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  /* tag consists:-
    This functions will create the sqlData dict.
    It takes an object and creates the sqlData as a child if doesn't exists.
    Then it takes resultset from data. Each resultset is a group of records.
    Tag is the name given to the group. Tagname is the logical group of these tags.
    Tagname appears as a column name in the final excel.
  */
  appendToSqlData(obj, data, tag, tagname, suppressTag) {
    if (!obj.hasOwnProperty('sqlData')) {
      obj.sqlData = [];
    }
    for (var rowIdx=0; rowIdx < data.length; rowIdx++) {
      var resultSet = data[rowIdx].data;
      if (tag[rowIdx]) {
        for (var row in resultSet) {
          var newRow = resultSet[row];
          newRow[tagname]=tag[rowIdx];
          for (var i in suppressTag) {
            if (newRow.hasOwnProperty(suppressTag[i])) {
              delete newRow[suppressTag[i]];
            }
          }
          obj.sqlData.push(newRow);
        }
      }
    }
  }

  downloadExcelTreated(chartName, chartData, tag, tagname, suppressTag) {
    if (chartData.hasOwnProperty('sqlData')) {
      delete chartData.sqlData;
    }
    this.appendToSqlData(chartData, chartData, tag, tagname, suppressTag);
    this.downloadExcel(chartName, chartData);
  }
//===============================================================
// TEMPLATE END: download-btn.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: InclusiveExclusive.ts.3.1.tpl
//===============================================================
    public compDict(dict1, dict2) {
      var all = Object.assign({}, dict1, dict2);
    
      var both = {};
      var lhs = {};
      var rhs = {};
      for (var key in all) {
        if (key in dict1 && key in dict2) {
            both[key] = dict1[key];
        } else {
          if (key in dict1) {
            lhs[key] = dict1[key];
          } else if (key in dict2) {
            rhs[key] = dict2[key];
          }
        }
      }
      return {
        'both': both,
        'lhs': lhs,
        'rhs': rhs
      }
    }
//===============================================================
// TEMPLATE END: InclusiveExclusive.ts.3.1.tpl
//===============================================================

  /* GENCODE:MARKER:8:END */

  onTableGridEvent(event) {
    this.sortChange(event.e, event.column);
  }

  onCompareDropDownChange(value) {
    var ids = [];
    for (var ci in this.compareItem) {
      var compareValue = this.compareForm.get(this.compareItem[ci].name).value
      if (compareValue) {
        ids.push(compareValue);
      }
    }
    ids.push(Number(this.scenarioId));
    this.comparisonProjectList = this.projectList.filter(item => !ids.includes(item.id));
  }
  
  /* GENCODE:MARKER:17:START */

//===============================================================
// TEMPLATE START: gridcomponent.ts.3.3.tpl
//===============================================================
fetchComparisonSummaryGrid() {
  this.portfolioSvc
    .getComparisonSummaryGrid(this.scenarioId, this.reqModel)
    .subscribe(response => {
      this.ComparisonSummaryGrid = response;
    });
}
//===============================================================
// TEMPLATE END: gridcomponent.ts.3.3.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.3.5.tpl
//===============================================================
fetchComparisonPrioritisedGrid() {
  this.portfolioSvc
    .getComparisonPrioritisedGrid(this.scenarioId, this.reqModel)
    .subscribe(response => {
      this.ComparisonPrioritisedGrid = response;
    });
}
//===============================================================
// TEMPLATE END: gridcomponent.ts.3.5.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.3.3.tpl
//===============================================================
fetchComparisonDeprioritizedGrid() {
  this.portfolioSvc
    .getComparisonDeprioritizedGrid(this.scenarioId, this.reqModel)
    .subscribe(response => {
      this.ComparisonDeprioritizedGrid = response;
    });
}
//===============================================================
// TEMPLATE END: gridcomponent.ts.3.3.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.3.3.tpl
//===============================================================
fetchComparisonCategorizedPrio_1Grid() {
  this.portfolioSvc
    .getComparisonCategorizedPrio_1Grid(this.scenarioId, this.reqModel)
    .subscribe(response => {
      this.ComparisonCategorizedPrio_1Grid = response;
    });
}
//===============================================================
// TEMPLATE END: gridcomponent.ts.3.3.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.3.3.tpl
//===============================================================
fetchComparisonCategorizedPrio_2Grid() {
  this.portfolioSvc
    .getComparisonCategorizedPrio_2Grid(this.scenarioId, this.reqModel)
    .subscribe(response => {
      this.ComparisonCategorizedPrio_2Grid = response;
    });
}
//===============================================================
// TEMPLATE END: gridcomponent.ts.3.3.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.3.3.tpl
//===============================================================
fetchComparisonCategorizedDeprio_1Grid() {
  this.portfolioSvc
    .getComparisonCategorizedDeprio_1Grid(this.scenarioId, this.reqModel)
    .subscribe(response => {
      this.ComparisonCategorizedDeprio_1Grid = response;
    });
}
//===============================================================
// TEMPLATE END: gridcomponent.ts.3.3.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.3.3.tpl
//===============================================================
fetchComparisonCategorizedDeprio_2Grid() {
  this.portfolioSvc
    .getComparisonCategorizedDeprio_2Grid(this.scenarioId, this.reqModel)
    .subscribe(response => {
      this.ComparisonCategorizedDeprio_2Grid = response;
    });
}
//===============================================================
// TEMPLATE END: gridcomponent.ts.3.3.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.3.3.tpl
//===============================================================
fetchComparisonAlternateProjGrid() {
  this.portfolioSvc
    .getComparisonAlternateProjGrid(this.scenarioId, this.reqModel)
    .subscribe(response => {
      this.ComparisonAlternateProjGrid = response;
    });
}
//===============================================================
// TEMPLATE END: gridcomponent.ts.3.3.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.3.3.tpl
//===============================================================
fetchComparisonSupplyGrid() {
  this.portfolioSvc
    .getComparisonSupplyGrid(this.scenarioId, this.reqModel)
    .subscribe(response => {
      this.ComparisonSupplyGrid = response;
    });
}
//===============================================================
// TEMPLATE END: gridcomponent.ts.3.3.tpl
//===============================================================

  /* GENCODE:MARKER:17:END */

  /* GENCODE:MARKER:20:START */

//===============================================================
// TEMPLATE START: gridcomponent.ts.3.4.tpl
//===============================================================
fetchComparisonRightSummaryGrid() {
  this.portfolioSvc
    .getComparisonRightSummaryGrid(this.compareScenarioId, this.reqModel)
    .subscribe(response => {
      this.ComparisonRightSummaryGrid = response;
    });
}
//===============================================================
// TEMPLATE END: gridcomponent.ts.3.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.3.6.tpl
//===============================================================
fetchComparisonRightPrioritisedGrid() {
  this.portfolioSvc
    .getComparisonRightPrioritisedGrid(this.compareScenarioId, this.reqModel)
    .subscribe(response => {
      this.ComparisonRightPrioritisedGrid = response;
    });
}
//===============================================================
// TEMPLATE END: gridcomponent.ts.3.6.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.3.4.tpl
//===============================================================
fetchComparisonRightDeprioritizedGrid() {
  this.portfolioSvc
    .getComparisonRightDeprioritizedGrid(this.compareScenarioId, this.reqModel)
    .subscribe(response => {
      this.ComparisonRightDeprioritizedGrid = response;
    });
}
//===============================================================
// TEMPLATE END: gridcomponent.ts.3.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.3.4.tpl
//===============================================================
fetchComparisonRightCategorizedPrio_1Grid() {
  this.portfolioSvc
    .getComparisonRightCategorizedPrio_1Grid(this.compareScenarioId, this.reqModel)
    .subscribe(response => {
      this.ComparisonRightCategorizedPrio_1Grid = response;
    });
}
//===============================================================
// TEMPLATE END: gridcomponent.ts.3.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.3.4.tpl
//===============================================================
fetchComparisonRightCategorizedPrio_2Grid() {
  this.portfolioSvc
    .getComparisonRightCategorizedPrio_2Grid(this.compareScenarioId, this.reqModel)
    .subscribe(response => {
      this.ComparisonRightCategorizedPrio_2Grid = response;
    });
}
//===============================================================
// TEMPLATE END: gridcomponent.ts.3.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.3.4.tpl
//===============================================================
fetchComparisonRightCategorizedDeprio_1Grid() {
  this.portfolioSvc
    .getComparisonRightCategorizedDeprio_1Grid(this.compareScenarioId, this.reqModel)
    .subscribe(response => {
      this.ComparisonRightCategorizedDeprio_1Grid = response;
    });
}
//===============================================================
// TEMPLATE END: gridcomponent.ts.3.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.3.4.tpl
//===============================================================
fetchComparisonRightCategorizedDeprio_2Grid() {
  this.portfolioSvc
    .getComparisonRightCategorizedDeprio_2Grid(this.compareScenarioId, this.reqModel)
    .subscribe(response => {
      this.ComparisonRightCategorizedDeprio_2Grid = response;
    });
}
//===============================================================
// TEMPLATE END: gridcomponent.ts.3.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.3.4.tpl
//===============================================================
fetchComparisonRightAlternateProjGrid() {
  this.portfolioSvc
    .getComparisonRightAlternateProjGrid(this.compareScenarioId, this.reqModel)
    .subscribe(response => {
      this.ComparisonRightAlternateProjGrid = response;
    });
}
//===============================================================
// TEMPLATE END: gridcomponent.ts.3.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.3.4.tpl
//===============================================================
fetchComparisonRightSupplyGrid() {
  this.portfolioSvc
    .getComparisonRightSupplyGrid(this.compareScenarioId, this.reqModel)
    .subscribe(response => {
      this.ComparisonRightSupplyGrid = response;
    });
}
//===============================================================
// TEMPLATE END: gridcomponent.ts.3.4.tpl
//===============================================================

  /* GENCODE:MARKER:20:END */

  /* GENCODE:MARKER:13:START */

//===============================================================
// TEMPLATE START: gridcomponent.ts.2.1.tpl
//===============================================================
getResultApprovedGroupBy() {
  this.portfolioSvc
    .getPortfolioResultApprovedGroupBy(this.scenarioId, this.reqModel)
    .subscribe(response => {
      this.listOfApprovedGroupBy = response;
    });
}
//===============================================================
// TEMPLATE END: gridcomponent.ts.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.2.1.tpl
//===============================================================
getResultRejectedGroupBy() {
  this.portfolioSvc
    .getPortfolioResultRejectedGroupBy(this.scenarioId, this.reqModel)
    .subscribe(response => {
      this.listOfRejectedGroupBy = response;
    });
}
//===============================================================
// TEMPLATE END: gridcomponent.ts.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.2.1.tpl
//===============================================================
getResultApprovedGroupByCompare() {
  this.portfolioSvc
    .getPortfolioResultApprovedGroupBy(this.compareScenarioId, this.reqModel)
    .subscribe(response => {
      this.listOfApprovedGroupByCompare = response;
    });
}
//===============================================================
// TEMPLATE END: gridcomponent.ts.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.2.1.tpl
//===============================================================
getResultRejectedGroupByCompare() {
  this.portfolioSvc
    .getPortfolioResultRejectedGroupBy(this.compareScenarioId, this.reqModel)
    .subscribe(response => {
      this.listOfRejectedGroupByCompare = response;
    });
}
//===============================================================
// TEMPLATE END: gridcomponent.ts.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.2.1.tpl
//===============================================================
getResultApprovedGroupBy2() {
  this.portfolioSvc
    .getPortfolioResultApprovedGroupBy2(this.scenarioId, this.reqModel)
    .subscribe(response => {
      this.listOfApprovedGroupBy2 = response;
    });
}
//===============================================================
// TEMPLATE END: gridcomponent.ts.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.2.1.tpl
//===============================================================
getResultRejectedGroupBy2() {
  this.portfolioSvc
    .getPortfolioResultRejectedGroupBy2(this.scenarioId, this.reqModel)
    .subscribe(response => {
      this.listOfRejectedGroupBy2 = response;
    });
}
//===============================================================
// TEMPLATE END: gridcomponent.ts.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.2.1.tpl
//===============================================================
getResultApprovedGroupByCompare2() {
  this.portfolioSvc
    .getPortfolioResultApprovedGroupBy2(this.compareScenarioId, this.reqModel)
    .subscribe(response => {
      this.listOfApprovedGroupByCompare2 = response;
    });
}
//===============================================================
// TEMPLATE END: gridcomponent.ts.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.2.1.tpl
//===============================================================
getResultRejectedGroupByCompare2() {
  this.portfolioSvc
    .getPortfolioResultRejectedGroupBy2(this.compareScenarioId, this.reqModel)
    .subscribe(response => {
      this.listOfRejectedGroupByCompare2 = response;
    });
}
//===============================================================
// TEMPLATE END: gridcomponent.ts.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.2.2.tpl
//===============================================================
fetchSupplyProjectGrid() {
  this.portfolioSvc
    .getSupplyProjectGrid(this.scenarioId, this.reqModel)
    .subscribe(response => {
      this.listOfSupply = response;
    });
}
//===============================================================
// TEMPLATE END: gridcomponent.ts.2.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.2.1.tpl
//===============================================================
getResultSupplyCompare() {
  this.portfolioSvc
    .getSupplyProjectGrid (this.compareScenarioId, this.reqModel)
    .subscribe(response => {
      this.listOfSupplyCompare = response;
    });
}
//===============================================================
// TEMPLATE END: gridcomponent.ts.2.1.tpl
//===============================================================

  /* GENCODE:MARKER:13:END */

  hideUnwantedColumn(columns: any[], type:"main"|"compare"="main") {
    // Hide unwanted year column
    for(var colIdx in columns)
    {
      if(this.isUnwantedYearColumn(columns[colIdx].columnName, type)){
        columns[colIdx].display = false;
      }
    }
  }

  public isUnwantedYearColumn(colname:string, type:"main"|"compare"="main") {
	if (typeof colname == 'string') {
        //console.error('colname is not a string:', colname);
		if(colname.toLowerCase().startsWith("budy")){
		  var _year = parseInt(colname.substring(4)); 
		  if(type == "main"){
			if(!isNaN(_year) && _year > this.numberOfYears)
			{
			  return true;
			}
		  }else if(type == "compare"){
			if(!isNaN(_year) && _year > this.numberOfYears2)
			{
			  return true;
			}
		  }
		}
	}
    return false;
  }
  
  generateLogScaleTicks(minVal:number, maxVal: number, axis: string, count: number = 100): number[] {
    const ticks = [];
    var min = minVal, max = maxVal;
        
    if(min == 0)
      min = 1;

    // Calculate the factor based on the number of ticks and the maximum value
    const factor = 10;//Math.pow(max, 1 / (count - 1));

    for (let i = 0; i < count; i++) {
      // Calculate the value using the factor and exponent
      var value = min * Math.pow(factor, i);
      
      // Ensure the generated value is within the range [min, max]
      value = Math.min(max, Math.round(Math.max(min, value)));

      value = value > max ? max : value;
      ticks.push(value);

      if(value >= max)
      {
        break;
      }
    }

    ticks[0] = minVal;
    if(axis.toLowerCase() == "y")
      return ticks.reverse();

    return ticks;
  }
}
