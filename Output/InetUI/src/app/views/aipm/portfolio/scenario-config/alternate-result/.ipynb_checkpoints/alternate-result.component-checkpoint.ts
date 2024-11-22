import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AipmFilterRequestModel, AIPMFilters, FilterBusinessArea } from '@views/aipm/aipm.interface';
import { AIPM_COST_RESULT_TABLE_COLUMNS } from '@views/aipm/budget/aipm-budget.interface';
import { AipmCostService } from '@views/aipm/cost/cost.service';
import { AipmScenarioService } from '@views/aipm/scenario/scenario.service';
import * as Chart from 'chart.js';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PortfolioImportComponent } from '../../import/import.component';
import { IPortfolioApprovedResult, IPortfolioSupplyResult, PortfolioResultChartData, PORTFOLIO_APPROVED_RESULT_TABLE_COLUMN, PORTFOLIO_REJECTED_RESULT_TABLE_COLUMN, PORTFOLIO_SUMMARY_RESULT_TABLE_COLUMN, RESULT_SUPPLY_TABLE_COLUMN, PORTFOLIO_REJECTED_GROUPBY_RESULT_TABLE_COLUMN, PORTFOLIO_APPROVED_GROUPBY_RESULT_TABLE_COLUMN2, PORTFOLIO_REJECTED_GROUPBY_RESULT_TABLE_COLUMN2, hdrDefAlternateResultSummaryGridHdr, hdrDefAlternateResultPrioritisedGridHdr, hdrDefAlternateResultCategorizedPrio_2GridHdr, hdrDefAlternateResultCategorizedPrio_1GridHdr, hdrDefAlternateResultAlternateProjGridHdr, hdrDefAlternateResultSupplyGridHdr, hdrDefAlternateResultDeprioritizedGridHdr, hdrDefAlternateResultCategorizedDeprio_1GridHdr, hdrDefAlternateResultCategorizedDeprio_2GridHdr } from '../../portfolio.interface';
import { AipmPortfolioService } from '../../portfolio.service';
import { PortfolioAlternateImportComponent } from './alternate-result-import/alternate-result-import.component';
import * as htmlToImage from 'html-to-image';
import { saveAs} from 'file-saver';
import * as XLSX from 'xlsx';
import { DeferModalComponent } from './defer-modal/defer-modal.component';
import { ConfirmationModalComponent } from '@shared/confirmation-modal/confirmation-modal.component';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-aipm-portfolio-alternate-result',
  templateUrl: './alternate-result.component.html',
  styleUrls: ['./alternate-result.component.scss']
})
export class AlternateResultComponent implements OnInit {
  public modalRef: BsModalRef;
  public filters: AIPMFilters;
  public reqModel: AipmFilterRequestModel = {};
  public baList: FilterBusinessArea[];
  public listOfApproved: IPortfolioApprovedResult[];
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

/* GENCODE:MARKER:12:START */

//===============================================================
// TEMPLATE START: gridcomponent.ts.1.3.tpl
//===============================================================
    public listOfSummary: any[];

    public AlternateResultSummaryGridHdr = hdrDefAlternateResultSummaryGridHdr();
    public AlternateResultSummaryGridInfoCFGRule = {
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
    public AlternateResultPrioritisedGrid: any[];

    public AlternateResultPrioritisedGridHdr = hdrDefAlternateResultPrioritisedGridHdr();
    public AlternateResultPrioritisedGridInfoCFGRule = {
      'freeze': {
        'left': ['projectDefinition','udProjectDescription'], 
        'right':['action']
      },
      'format': {
 'budget_Before_Revised': { 'type': 'number', 'format': '1.2-2' },
 'total_Budget': { 'type': 'number', 'format': '1.2-2' },
 'risk_Reduced': { 'type': 'number', 'format': '1.2-2' },
 'tcO_Opex': { 'type': 'number', 'format': '1.2-2' },
 'tcO_TotalProjectCost': { 'type': 'number', 'format': '1.2-2' },
 'npV_RiskReduced': { 'type': 'number', 'format': '1.2-2' },
 'project_Score': { 'type': 'number', 'format': '1.3-3' },
 'start_Month_Scope_1': { 'type': 'date', 'format': 'MMM yyyy' },
 'start_Month_Scope_2': { 'type': 'date', 'format': 'MMM yyyy' },
 'start_Month_Scope_3': { 'type': 'date', 'format': 'MMM yyyy' },
 'start_Month_Scope_4': { 'type': 'date', 'format': 'MMM yyyy' },
 'comm_Month': { 'type': 'date', 'format': 'MMM yyyy' },
 'target_Comm_Month': { 'type': 'date', 'format': 'MMM yyyy' },
 'budY1': { 'type': 'number', 'format': '1.2-2' },
 'budY2': { 'type': 'number', 'format': '1.2-2' },
 'budY3': { 'type': 'number', 'format': '1.2-2' },
 'budY4': { 'type': 'number', 'format': '1.2-2' },
 'budY5': { 'type': 'number', 'format': '1.2-2' },
 'budY6': { 'type': 'number', 'format': '1.2-2' },
 'budY7': { 'type': 'number', 'format': '1.2-2' },
 'budY8': { 'type': 'number', 'format': '1.2-2' },
      },
      'mergeRule': [],
      'highlightRule': {},
      'totalRule': {},
      'actionRule': [{'label':'Defer','condition':'!this.data.defer','function':this.callbackOnDeferClick,'param':['this.data.project_ID','true',this]},{'label':'Undo','condition':'this.data.defer','function':this.callbackOnDeferClick,'param':['this.data.project_ID','false',this]}],
    };
//===============================================================
// TEMPLATE END: gridcomponent.ts.1.3.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.1.3.tpl
//===============================================================
    public AlternateResultCategorizedPrio_1Grid: any[];

    public AlternateResultCategorizedPrio_1GridHdr = hdrDefAlternateResultCategorizedPrio_1GridHdr();
    public AlternateResultCategorizedPrio_1GridInfoCFGRule = {
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
    public AlternateResultCategorizedPrio_2Grid: any[];

    public AlternateResultCategorizedPrio_2GridHdr = hdrDefAlternateResultCategorizedPrio_2GridHdr();
    public AlternateResultCategorizedPrio_2GridInfoCFGRule = {
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
    public AlternateResultAlternateProjGrid: any[];

    public AlternateResultAlternateProjGridHdr = hdrDefAlternateResultAlternateProjGridHdr();
    public AlternateResultAlternateProjGridInfoCFGRule = {
      'freeze': {
        'left': ['projectDefinition','udProjectDescription'], 
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
      'actionRule': [{'label':'Delete','condition':'true','function':this.callBackOnDeleteAlternateClick,'param':['this.data.project_ID',this]}],
    };
//===============================================================
// TEMPLATE END: gridcomponent.ts.1.3.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.1.3.tpl
//===============================================================
    public AlternateResultSupplyGrid: any[];

    public AlternateResultSupplyGridHdr = hdrDefAlternateResultSupplyGridHdr();
    public AlternateResultSupplyGridInfoCFGRule = {
      'freeze': {
        'left': ['projectDefinition','udProjectDescription'], 
        'right':['action']
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
      'actionRule': [{'label':'Delete','condition':'true','function':this.callBackOnDeleteClick,'param':['this.data.Project_ID',this]}],
    };
//===============================================================
// TEMPLATE END: gridcomponent.ts.1.3.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.1.3.tpl
//===============================================================
    public AlternateResultDeprioritizedGrid: any[];

    public AlternateResultDeprioritizedGridHdr = hdrDefAlternateResultDeprioritizedGridHdr();
    public AlternateResultDeprioritizedGridInfoCFGRule = {
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
    public AlternateResultCategorizedDeprio_1Grid: any[];

    public AlternateResultCategorizedDeprio_1GridHdr = hdrDefAlternateResultCategorizedDeprio_1GridHdr();
    public AlternateResultCategorizedDeprio_1GridInfoCFGRule = {
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
    public AlternateResultCategorizedDeprio_2Grid: any[];

    public AlternateResultCategorizedDeprio_2GridHdr = hdrDefAlternateResultCategorizedDeprio_2GridHdr();
    public AlternateResultCategorizedDeprio_2GridInfoCFGRule = {
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

/* GENCODE:MARKER:12:END */
  
  editable: boolean = false;
  numberOfYears: number;

  @ViewChild("chart")
  private chartRef: ElementRef;
  public chart: Chart;
  chartData: any;
  chartRefData: PortfolioResultChartData;

  @Input("type")
  type: string;

  /* GENCODE:MARKER:0:START */
  //@Input("type")
  //type: string;

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

  /* GENCODE:MARKER:1:END */

  /* GENCODE:MARKER:2:START */

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

    this.getById();
    
    this.form = this.formBuilder.group({
      strategicObjective: [],
      subObjective: [],
      subObjectiveHPA: [],
      stateCode: [],
      businessArea: [],
      projectTypeList: [],
      voltageList: [],
    });

    this.fetchFilters();
    this.fetchData();
  }

  getById() {
    this.scenarioSvs.getById(
      "portfolio",
      this.scenarioId
    ).subscribe(result => {
      this.editable = result.editable;
      this.numberOfYears = ((result.entity.endYear - result.entity.startYear) + 1);

      this.hideUnwantedColumn(this.AlternateResultSummaryGridHdr);
      this.hideUnwantedColumn(this.AlternateResultPrioritisedGridHdr);
      this.hideUnwantedColumn(this.AlternateResultCategorizedPrio_1GridHdr);
      this.hideUnwantedColumn(this.AlternateResultCategorizedPrio_2GridHdr);
    });
  }

  fetchChart() {
    this.loading = true;
    if (this.type == "original") {
       this.portfolioSvc.getOriginalChart(this.scenarioId, this.reqModel)
         .subscribe(result => {
           this.loading = false;
           this.chartData = result.datasets;
           this.chartRefData = result;
           this.updateChart();
         });
    } else if (this.type == "alternative") {
      this.portfolioSvc.getAlternativeChart(this.scenarioId, this.reqModel)
        .subscribe(result => {
          this.chartData = result.datasets;
          this.chartRefData = result;
          this.updateChart();
        });
    }
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

  public sortChange(e: string, column: string, table: string): void {
    if (e) {
      this.reqModel.sortByColumn = column;
      this.reqModel.sortDirection = (e === "ascend" ? "ASC" : "DESC");
    } else {
      this.reqModel.sortByColumn = "";
      this.reqModel.sortDirection = "";
    }
    //here
    if(table == "prioProjTable"){
      this.fetchAlternateResultPrioritisedGrid();
    }else if (table == "altProjTable"){
      this.fetchAlternateResultAlternateProjGrid();
    }else if (table == "supplyProjTable"){
      this.fetchAlternateResultSupplyGrid();
    }else{
      this.fetchData();
    }
  }

  /* GENCODE:MARKER:3:START */

//===============================================================
// TEMPLATE START: component.ts.2.1.tpl
//===============================================================
  fetchRightBarLineBudgetChart() {
    this.loading = true;
    this.type = "original";
    if (this.type == "original") {
      this.portfolioSvc.getRightBarLineBudgetChart(this.scenarioId, this.reqModel)
        .subscribe(result => {

          this.loading = false;
          this.RightBarLineBudgetChartData = result;
          this.doRightBarLineBudgetChart();
        });
    } else if (this.type == "alternative") {
      this.portfolioSvc.getRightBarLineBudgetChart(this.scenarioId, this.reqModel)
        .subscribe(result => {

          this.loading = false;
          this.RightBarLineBudgetChartData = result;
          this.doRightBarLineBudgetChart();
        });
    }
  }
//===============================================================
// TEMPLATE END: component.ts.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.2.1.tpl
//===============================================================
  fetchRightStackedBarBudgetChart() {
    this.loading = true;
    this.type = "original";
    if (this.type == "original") {
      this.portfolioSvc.getRightStackedBarBudgetChart(this.scenarioId, this.reqModel)
        .subscribe(result => {

          this.loading = false;
          this.RightStackedBarBudgetChartData = result;
          this.doRightStackedBarBudgetChart();
        });
    } else if (this.type == "alternative") {
      this.portfolioSvc.getRightStackedBarBudgetChart(this.scenarioId, this.reqModel)
        .subscribe(result => {

          this.loading = false;
          this.RightStackedBarBudgetChartData = result;
          this.doRightStackedBarBudgetChart();
        });
    }
  }
//===============================================================
// TEMPLATE END: component.ts.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.2.1.tpl
//===============================================================
  fetchRightBarLineNPVChart() {
    this.loading = true;
    this.type = "original";
    if (this.type == "original") {
      this.portfolioSvc.getRightBarLineNPVChart(this.scenarioId, this.reqModel)
        .subscribe(result => {

          this.loading = false;
          this.RightBarLineNPVChartData = result;
          this.doRightBarLineNPVChart();
        });
    } else if (this.type == "alternative") {
      this.portfolioSvc.getRightBarLineNPVChart(this.scenarioId, this.reqModel)
        .subscribe(result => {

          this.loading = false;
          this.RightBarLineNPVChartData = result;
          this.doRightBarLineNPVChart();
        });
    }
  }
//===============================================================
// TEMPLATE END: component.ts.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.2.1.tpl
//===============================================================
  fetchRightStackedBarNPVChart() {
    this.loading = true;
    this.type = "original";
    if (this.type == "original") {
      this.portfolioSvc.getRightStackedBarNPVChart(this.scenarioId, this.reqModel)
        .subscribe(result => {

          this.loading = false;
          this.RightStackedBarNPVChartData = result;
          this.doRightStackedBarNPVChart();
        });
    } else if (this.type == "alternative") {
      this.portfolioSvc.getRightStackedBarNPVChart(this.scenarioId, this.reqModel)
        .subscribe(result => {

          this.loading = false;
          this.RightStackedBarNPVChartData = result;
          this.doRightStackedBarNPVChart();
        });
    }
  }
//===============================================================
// TEMPLATE END: component.ts.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.2.1.tpl
//===============================================================
  fetchRightRadarElementChart() {
    this.loading = true;
    this.type = "original";
    if (this.type == "original") {
      this.portfolioSvc.getRightRadarElementChart(this.scenarioId, this.reqModel)
        .subscribe(result => {

          this.loading = false;
          this.RightRadarElementChartData = result;
          this.doRightRadarElementChart();
        });
    } else if (this.type == "alternative") {
      this.portfolioSvc.getRightRadarElementChart(this.scenarioId, this.reqModel)
        .subscribe(result => {

          this.loading = false;
          this.RightRadarElementChartData = result;
          this.doRightRadarElementChart();
        });
    }
  }
//===============================================================
// TEMPLATE END: component.ts.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.2.1.tpl
//===============================================================
  fetchRightStackedBarOSRiskChart() {
    this.loading = true;
    this.type = "original";
    if (this.type == "original") {
      this.portfolioSvc.getRightStackedBarOSRiskChart(this.scenarioId, this.reqModel)
        .subscribe(result => {

          this.loading = false;
          this.RightStackedBarOSRiskChartData = result;
          this.doRightStackedBarOSRiskChart();
        });
    } else if (this.type == "alternative") {
      this.portfolioSvc.getRightStackedBarOSRiskChart(this.scenarioId, this.reqModel)
        .subscribe(result => {

          this.loading = false;
          this.RightStackedBarOSRiskChartData = result;
          this.doRightStackedBarOSRiskChart();
        });
    }
  }
//===============================================================
// TEMPLATE END: component.ts.2.1.tpl
//===============================================================

  /* GENCODE:MARKER:3:END */

  fetchData() {
    this.loading = true;
    this.reqModel.scenarioId = this.activatedRoute.snapshot.params.id;
    this.reqModel.strategicObjective = this.form.get('strategicObjective').value !== null && this.form.get('strategicObjective').value != undefined ? this.form.get('strategicObjective').value : null;
    this.reqModel.subObjective = this.form.get('subObjective').value !== null && this.form.get('subObjective').value != undefined ? this.form.get('subObjective').value : null;
    this.reqModel.subObjectiveHPA = this.form.get('subObjectiveHPA').value !== null && this.form.get('subObjectiveHPA').value !== undefined ? this.form.get('subObjectiveHPA').value : null;
    this.reqModel.state = this.form.get('stateCode').value !== null && this.form.get('stateCode').value != undefined ? this.form.get('stateCode').value : null;
    this.reqModel.businessArea = this.form.get('businessArea').value !== null && this.form.get('businessArea').value != undefined ? this.form.get('businessArea').value : null;
    this.reqModel.projectType = this.form.get('projectTypeList').value !== null && this.form.get('projectTypeList').value != undefined ? this.form.get('projectTypeList').value : null;
    this.reqModel.voltage = this.form.get('voltageList').value !== null && this.form.get('voltageList').value != undefined ? this.form.get('voltageList').value : null;


    //this.getResultApproved();
    //this.getResultAlternate();
    //this.getResultRejected();
    //this.getResultSummary();
    this.fetchChart();
    
  /* GENCODE:MARKER:14:START */

//===============================================================
// TEMPLATE START: gridcomponent.ts.2.4.tpl
//===============================================================
    this.fetchAlternateResultSummaryGrid();
//===============================================================
// TEMPLATE END: gridcomponent.ts.2.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.2.4.tpl
//===============================================================
    this.fetchAlternateResultPrioritisedGrid();
//===============================================================
// TEMPLATE END: gridcomponent.ts.2.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.2.4.tpl
//===============================================================
    this.fetchAlternateResultCategorizedPrio_1Grid();
//===============================================================
// TEMPLATE END: gridcomponent.ts.2.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.2.4.tpl
//===============================================================
    this.fetchAlternateResultCategorizedPrio_2Grid();
//===============================================================
// TEMPLATE END: gridcomponent.ts.2.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.2.4.tpl
//===============================================================
    this.fetchAlternateResultAlternateProjGrid();
//===============================================================
// TEMPLATE END: gridcomponent.ts.2.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.2.4.tpl
//===============================================================
    this.fetchAlternateResultSupplyGrid();
//===============================================================
// TEMPLATE END: gridcomponent.ts.2.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.2.4.tpl
//===============================================================
    this.fetchAlternateResultDeprioritizedGrid();
//===============================================================
// TEMPLATE END: gridcomponent.ts.2.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.2.4.tpl
//===============================================================
    this.fetchAlternateResultCategorizedDeprio_1Grid();
//===============================================================
// TEMPLATE END: gridcomponent.ts.2.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.2.4.tpl
//===============================================================
    this.fetchAlternateResultCategorizedDeprio_2Grid();
//===============================================================
// TEMPLATE END: gridcomponent.ts.2.4.tpl
//===============================================================

  /* GENCODE:MARKER:14:END */

    /* GENCODE:MARKER:4:START */

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

    /* GENCODE:MARKER:4:END */
    // this.watchImportCompleted();
  }

  runAlternate() {
    this.portfolioSvc
      .runAlternate(this.scenarioId)
      .subscribe(response => {
        if (response.success) {
          this.fetchData();
        }
      });
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
    this.loading = false;
  }
  
  /* GENCODE:MARKER:5:START */

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
  
  importProjectModalRef: BsModalRef;
  importSupplyProject() {
    if (this.editable) {
      this.importProjectModalRef = this.bsModalService.show(
        PortfolioImportComponent,
        {
            initialState: {
                scenarioId: this.scenarioId,
            },
            class: 'modal-xl',
            ignoreBackdropClick: true,
        }
      );
      this.importProjectModalRef.onHide.subscribe(() => {
          this.fetchData();
      });
    }
  }

  importAlternateModalRef: BsModalRef;
  importAlternateProject() {
    if (this.editable) {
      this.importAlternateModalRef = this.bsModalService.show(
        PortfolioAlternateImportComponent,
        {
            initialState: {
                scenarioId: this.scenarioId
            },
            class: 'modal-xl',
            ignoreBackdropClick: true,
        }
      );
      this.importAlternateModalRef.onHide.subscribe(() => {
          // this.runAlternate();
          this.fetchData();
      });
    }
  }

  //  watchImportCompleted() {
  //   this.portfolioSvc.importCompleted$
  //     .pipe(
  //       tap((rs) => {
  //         if (rs) {
  //           this.getResultSupply()
  //         }
  //       })
  //     )
  //     .subscribe();
  // }

/*   getResultApproved() {
    this.portfolioSvc
      .getPortfolioAlternateResultApproved(this.scenarioId, this.reqModel)
      .subscribe(response => {
        this.listOfApproved = response;
      });
  } */
  
/*   getResultRejected() {
    this.portfolioSvc
    .getPortfolioAlternateResultRejected(this.scenarioId, this.reqModel)
    .subscribe(response => {
      this.listOfRejected = response;
    });
  } */

/*   getResultSummary() {
    this.portfolioSvc
      .getPortfolioAlternateResultSummary(this.scenarioId, this.reqModel)
      .subscribe(response => {
        this.listOfSummary = response;
      });
  } */

/*   public onDeleteClick(cand) {
    if (this.editable) {
      this.loading = true;
      this.portfolioSvc
        .deleteSupplyProject(
          {
            scenarioId: this.scenarioId, 
            projectId: cand
          }
        )
        .subscribe((rs) => {
          if (rs.success) {
            this.notification.success("Deleted Successfully", "");
            this.fetchData();
          }
        });
    }
  } */

    public callBackOnDeleteClick(cand, _self) {
      if (_self.editable) {
        _self.loading = true;
        _self.portfolioSvc
          .deleteSupplyProject(
            {
              scenarioId: _self.scenarioId, 
              projectId: cand
            }
          )
          .subscribe((rs) => {
            if (rs.success) {
              _self.notification.success("Deleted Successfully", "");
              _self.fetchData();
            }
          });
      }
    }

/*   public onDeleteAlternateClick(cand) {
    if (this.editable) {
      this.loading = true;
      this.portfolioSvc
        .deleteAlternateProject(
          {
            scenarioId: this.scenarioId, 
            projectId: cand
          }
        )
        .subscribe((rs) => {
          if (rs.success) {
            this.notification.success("Deleted Successfully", "");
            this.fetchData();
          }
        });
    }
  } */
  
  public callBackOnDeleteAlternateClick(cand, _self) {
    if (_self.editable) {
      _self.loading = true;
      _self.portfolioSvc
        .deleteAlternateProject(
          {
            scenarioId: _self.scenarioId, 
            projectId: cand
          }
        )
        .subscribe((rs) => {
          if (rs.success) {
            _self.notification.success("Deleted Successfully", "");
            _self.fetchData();
          }
        });
    }
  } 

/*   onDeferClick(projectId, defer) {
    if (this.editable) {
      if (defer === true) {
        this.modalRef = this.bsModalService.show(
          DeferModalComponent,
          {
              initialState: {},
              class: 'modal-lg',
              ignoreBackdropClick: true
          }
        );
  
        this.modalRef.onHide.subscribe((resp) => {
          let response: any = JSON.parse(resp);
          if (response.startDate != null) {
            response.startDate = response.startDate+'-01'
          }
          if (response.submitted === true) {  
            this.loading = true;
            this.portfolioSvc
              .deferProject(
                {
                  scenarioId: this.scenarioId, 
                  projectId: projectId,
                  defer: defer,
                  deferAction: response.action,
                  newStartDate: response.startDate,
                  justification: response.justification
                }
              )
              .subscribe((rs) => {
                //if (rs.success) {
                //  this.notification.success("Deferred", "");
                  this.fetchData();
                //}
              });
          }
        });
      }
      else {
        // handle Undo
        this.modalRef = this.bsModalService.show(
          ConfirmationModalComponent,
          {
              initialState: {},
              class: 'modal-lg',
              ignoreBackdropClick: true,
          }
        );
  
        this.modalRef.content.submitEvent.subscribe(() => {
          this.loading = true;
          this.portfolioSvc
            .deferProject(
              {
                scenarioId: this.scenarioId, 
                projectId: projectId,
                defer: defer
              }
            )
            .subscribe((rs) => {
              // if (rs.success) {
                // this.notification.success("Deferred", "");
                this.fetchData();
              // }
            });
        });
      }
    }
  } */

  callbackOnDeferClick(projectId, defer, _self) {
    if (_self.editable) {
      if (defer === true) {
        _self.modalRef = _self.bsModalService.show(
          DeferModalComponent,
          {
              initialState: {},
              class: 'modal-lg',
              ignoreBackdropClick: true
          }
        );
  
        _self.modalRef.onHide.subscribe((resp) => {
          let response: any = JSON.parse(resp);
          if (response.startDate != null) {
            response.startDate = response.startDate+'-01'
          }
          if (response.submitted === true) {  
            _self.loading = true;
            _self.portfolioSvc
              .deferProject(
                {
                  scenarioId: _self.scenarioId, 
                  projectId: projectId,
                  defer: defer,
                  deferAction: response.action,
                  newStartDate: response.startDate,
                  justification: response.justification
                }
              )
              .subscribe((rs) => {
                //if (rs.success) {
                //  this.notification.success("Deferred", "");
                _self.fetchData();
                //}
              });
          }
        });
      }
      else {
        // handle Undo
        _self.modalRef = _self.bsModalService.show(
          ConfirmationModalComponent,
          {
              initialState: {},
              class: 'modal-lg',
              ignoreBackdropClick: true,
          }
        );
  
        _self.modalRef.content.submitEvent.subscribe(() => {
          _self.loading = true;
          _self.portfolioSvc
            .deferProject(
              {
                scenarioId: _self.scenarioId, 
                projectId: projectId,
                defer: defer
              }
            )
            .subscribe((rs) => {
              // if (rs.success) {
                // this.notification.success("Deferred", "");
                _self.fetchData();
              // }
            });
        });
      }
    }
  }

  clearFilter() {
    this.baList = this.filters.businessArea;
    this.form.patchValue({ strategicObjective: null });
    this.form.patchValue({ subObjective: null });
    this.form.patchValue({ subObjectiveHPA: null });
    this.form.patchValue({ stateCode: null });
    this.form.patchValue({ businessArea: null });
    this.form.patchValue({ voltageList: null });
    this.form.patchValue({ projectTypeList: null });

    this.reqModel.sortByColumn = "";
    this.reqModel.sortDirection = "";

    this.fetchData();
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

  /* GENCODE:MARKER:8:END */
  onTableGridEvent(event) {
    this.sortChange(event.e, event.column, "");
  }
  
  /* GENCODE:MARKER:13:START */

//===============================================================
// TEMPLATE START: gridcomponent.ts.3.3.tpl
//===============================================================
fetchAlternateResultSummaryGrid() {
  this.portfolioSvc
    .getAlternateResultSummaryGrid(this.scenarioId, this.reqModel)
    .subscribe(response => {
      this.listOfSummary = response;
    });
}
//===============================================================
// TEMPLATE END: gridcomponent.ts.3.3.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.3.3.tpl
//===============================================================
fetchAlternateResultPrioritisedGrid() {
  this.portfolioSvc
    .getAlternateResultPrioritisedGrid(this.scenarioId, this.reqModel)
    .subscribe(response => {
      this.AlternateResultPrioritisedGrid = response;
    });
}
//===============================================================
// TEMPLATE END: gridcomponent.ts.3.3.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.3.3.tpl
//===============================================================
fetchAlternateResultCategorizedPrio_1Grid() {
  this.portfolioSvc
    .getAlternateResultCategorizedPrio_1Grid(this.scenarioId, this.reqModel)
    .subscribe(response => {
      this.AlternateResultCategorizedPrio_1Grid = response;
    });
}
//===============================================================
// TEMPLATE END: gridcomponent.ts.3.3.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.3.3.tpl
//===============================================================
fetchAlternateResultCategorizedPrio_2Grid() {
  this.portfolioSvc
    .getAlternateResultCategorizedPrio_2Grid(this.scenarioId, this.reqModel)
    .subscribe(response => {
      this.AlternateResultCategorizedPrio_2Grid = response;
    });
}
//===============================================================
// TEMPLATE END: gridcomponent.ts.3.3.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.3.3.tpl
//===============================================================
fetchAlternateResultAlternateProjGrid() {
  this.portfolioSvc
    .getAlternateResultAlternateProjGrid(this.scenarioId, this.reqModel)
    .subscribe(response => {
      this.AlternateResultAlternateProjGrid = response;
    });
}
//===============================================================
// TEMPLATE END: gridcomponent.ts.3.3.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.3.3.tpl
//===============================================================
fetchAlternateResultSupplyGrid() {
  this.portfolioSvc
    .getAlternateResultSupplyGrid(this.scenarioId, this.reqModel)
    .subscribe(response => {
      this.AlternateResultSupplyGrid = response;
    });
}
//===============================================================
// TEMPLATE END: gridcomponent.ts.3.3.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.3.3.tpl
//===============================================================
fetchAlternateResultDeprioritizedGrid() {
  this.portfolioSvc
    .getAlternateResultDeprioritizedGrid(this.scenarioId, this.reqModel)
    .subscribe(response => {
      this.AlternateResultDeprioritizedGrid = response;
    });
}
//===============================================================
// TEMPLATE END: gridcomponent.ts.3.3.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.3.3.tpl
//===============================================================
fetchAlternateResultCategorizedDeprio_1Grid() {
  this.portfolioSvc
    .getAlternateResultCategorizedDeprio_1Grid(this.scenarioId, this.reqModel)
    .subscribe(response => {
      this.AlternateResultCategorizedDeprio_1Grid = response;
    });
}
//===============================================================
// TEMPLATE END: gridcomponent.ts.3.3.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.3.3.tpl
//===============================================================
fetchAlternateResultCategorizedDeprio_2Grid() {
  this.portfolioSvc
    .getAlternateResultCategorizedDeprio_2Grid(this.scenarioId, this.reqModel)
    .subscribe(response => {
      this.AlternateResultCategorizedDeprio_2Grid = response;
    });
}
//===============================================================
// TEMPLATE END: gridcomponent.ts.3.3.tpl
//===============================================================

  /* GENCODE:MARKER:13:END */

  hideUnwantedColumn(columns: any[]) {
    // Hide unwanted year column
    for(var colIdx in columns)
    {
      if(this.isUnwantedYearColumn(columns[colIdx].columnName)){
        columns[colIdx].display = false;
      }
    }
  }

  public isUnwantedYearColumn(colname) {
    if(colname.toLowerCase().startsWith("budy")){
      var _year = parseInt(colname.substring(4)); 
      if(!isNaN(_year) && _year > this.numberOfYears)
      {
        return true;
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
