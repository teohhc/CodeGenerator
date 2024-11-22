import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AipmFilterRequestModel, AIPMFilters, FilterBusinessArea } from '@views/aipm/aipm.interface';
import { AipmCostService } from '@views/aipm/cost/cost.service';
import { AipmScenarioService } from '@views/aipm/scenario/scenario.service';
import * as Chart from 'chart.js';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PortfolioImportComponent } from '../../import/import.component';
import { IPortfolioSupplyResult, PortfolioResultChartData, PORTFOLIO_APPROVED_RESULT_TABLE_COLUMN, PORTFOLIO_REJECTED_RESULT_TABLE_COLUMN, PORTFOLIO_SUMMARY_RESULT_TABLE_COLUMN, RESULT_SUPPLY_TABLE_COLUMN, PORTFOLIO_APPROVED_GROUPBY_RESULT_TABLE_COLUMN, PORTFOLIO_REJECTED_GROUPBY_RESULT_TABLE_COLUMN, PORTFOLIO_APPROVED_GROUPBY_RESULT_TABLE_COLUMN2, PORTFOLIO_REJECTED_GROUPBY_RESULT_TABLE_COLUMN2, hdrDefresultSummaryTableColumns, hdrDefresultApprovedTableColumns, hdrDefresultApprovedGroupByGridColumns, hdrDefresultApprovedGroupByGrid2Columns, hdrDefresultSupplyTableColumns, hdrDefresultRejectedTableColumns, hdrDefresultRejectedGroupByGridColumns, hdrDefresultRejectedGroupByGrid2Columns } from '../../portfolio.interface';
import { AipmPortfolioService } from '../../portfolio.service';
import * as htmlToImage from 'html-to-image';
import { saveAs} from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-aipm-portfolio-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {

  public filters: AIPMFilters;
  public reqModel: AipmFilterRequestModel = {};
  public baList: FilterBusinessArea[];
  public loading: boolean = true;
  public scenarioId: number;
  public scenarioName: string;
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

    public resultSummaryTableColumns = hdrDefresultSummaryTableColumns();
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
      'actionRule': [],
    };
//===============================================================
// TEMPLATE END: gridcomponent.ts.1.3.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.1.3.tpl
//===============================================================
    public listOfApproved: any[];

    public resultApprovedTableColumns = hdrDefresultApprovedTableColumns();
    public resultApprovedTableRules = {
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
    public listOfApprovedGroupBy: any[];

    public resultApprovedGroupByGridColumns = hdrDefresultApprovedGroupByGridColumns();
    public resultApprovedGroupByGridRules = {
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
    public listOfApprovedGroupBy2: any[];

    public resultApprovedGroupByGrid2Columns = hdrDefresultApprovedGroupByGrid2Columns();
    public resultApprovedGroupByGrid2Rules = {
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
    public listOfSupply: any[];

    public resultSupplyTableColumns = hdrDefresultSupplyTableColumns();
    public resultSupplyTableRules = {
      'freeze': {
        'left': ['ProjectDefinition','UDProjectDescription'], 
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
    public listOfRejected: any[];

    public resultRejectedTableColumns = hdrDefresultRejectedTableColumns();
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
      'actionRule': [],
    };
//===============================================================
// TEMPLATE END: gridcomponent.ts.1.3.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.1.3.tpl
//===============================================================
    public listOfRejectedGroupBy: any[];

    public resultRejectedGroupByGridColumns = hdrDefresultRejectedGroupByGridColumns();
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
      'actionRule': [],
    };
//===============================================================
// TEMPLATE END: gridcomponent.ts.1.3.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.1.3.tpl
//===============================================================
    public listOfRejectedGroupBy2: any[];

    public resultRejectedGroupByGrid2Columns = hdrDefresultRejectedGroupByGrid2Columns();
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

  @ViewChild("budgetchart")
  private budgetchartRef: ElementRef;
  public budgetchart: Chart;
  budgetChartData: any;

  @Input("type")
  type: string;

  maxY: any;
  maxY2: any;

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
  @ViewChild("LeftBarLineBudgetResultChart")
  private LeftBarLineBudgetResultChartRef: ElementRef;
  public LeftBarLineBudgetResultChart: Chart;
  LeftBarLineBudgetResultChartData: any;
//===============================================================
// TEMPLATE END: component.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.1.1.tpl
//===============================================================
  @ViewChild("LeftStackedBarBudgetResultChart")
  private LeftStackedBarBudgetResultChartRef: ElementRef;
  public LeftStackedBarBudgetResultChart: Chart;
  LeftStackedBarBudgetResultChartData: any;
//===============================================================
// TEMPLATE END: component.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.1.1.tpl
//===============================================================
  @ViewChild("LeftBarLineNPVResultChart")
  private LeftBarLineNPVResultChartRef: ElementRef;
  public LeftBarLineNPVResultChart: Chart;
  LeftBarLineNPVResultChartData: any;
//===============================================================
// TEMPLATE END: component.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.1.1.tpl
//===============================================================
  @ViewChild("LeftStackedBarNPVResultChart")
  private LeftStackedBarNPVResultChartRef: ElementRef;
  public LeftStackedBarNPVResultChart: Chart;
  LeftStackedBarNPVResultChartData: any;
//===============================================================
// TEMPLATE END: component.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.1.1.tpl
//===============================================================
  @ViewChild("LeftRadarElementResultChart")
  private LeftRadarElementResultChartRef: ElementRef;
  public LeftRadarElementResultChart: Chart;
  LeftRadarElementResultChartData: any;
//===============================================================
// TEMPLATE END: component.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.1.1.tpl
//===============================================================
  @ViewChild("LeftStackedBarOSRiskResultChart")
  private LeftStackedBarOSRiskResultChartRef: ElementRef;
  public LeftStackedBarOSRiskResultChart: Chart;
  LeftStackedBarOSRiskResultChartData: any;
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

      this.hideUnwantedColumn(this.resultSummaryTableColumns);
      this.hideUnwantedColumn(this.resultApprovedTableColumns);
      this.hideUnwantedColumn(this.resultApprovedGroupByGridColumns);
      this.hideUnwantedColumn(this.resultApprovedGroupByGrid2Columns);

      this.scenarioName = result.entity.scenarioName;
    });
  }

  fetchChart() {
    this.loading = true;
    if (this.type == "original") {
      this.portfolioSvc.getOriginalChart(this.scenarioId, this.reqModel)
        .subscribe(result => {
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

  newChart() {
    this.loading = true;
    if (this.type == "original") {
      this.portfolioSvc.getBudgetChart(this.scenarioId, this.reqModel)
        .subscribe(result => {
          // this.chartData = result.datasets;
          this.budgetChartData = result;
          var barData = result.datasets.filter(a => a.type == "bar")[0].data;
          var maxBarData = 0;

          barData.forEach(x =>{
            if (maxBarData < x){
              maxBarData = x;
            }
          });

          this.maxY2 = (Math.ceil(result.datasets.filter(a => a.type == "line")[0].data[0]/10)) * 10
          this.maxY = (maxBarData > (this.maxY2 / 4) ? (Math.ceil((result.datasets.filter(a => a.type == "line")[0].data[0] - maxBarData) / 10)) * 10 : this.maxY2 /4 );
          this.budgetChart();
        });
    } else if (this.type == "alternative") {
      this.portfolioSvc.getBudgetChart(this.scenarioId, this.reqModel)
        .subscribe(result => {
          // this.chartData = result.datasets;
          this.budgetChartData = result;
          this.budgetChart();
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

    // do sort on single table only
    if(table == "depProjTable"){
      this.fetchResultDeprioritizedGrid();
    }else if(table == "supplyTable"){
      this.fetchResultSupplyGrid();
    }else{
      this.fetchData();
    }
  }

  /* GENCODE:MARKER:3:START */

//===============================================================
// TEMPLATE START: component.ts.2.1.tpl
//===============================================================
  fetchLeftBarLineBudgetResultChart() {
    this.loading = true;
    this.type = "original";
    if (this.type == "original") {
      this.portfolioSvc.getLeftBarLineBudgetResultChart(this.scenarioId, this.reqModel)
        .subscribe(result => {

          this.loading = false;
          this.LeftBarLineBudgetResultChartData = result;
          this.doLeftBarLineBudgetResultChart();
        });
    } else if (this.type == "alternative") {
      this.portfolioSvc.getLeftBarLineBudgetResultChart(this.scenarioId, this.reqModel)
        .subscribe(result => {

          this.loading = false;
          this.LeftBarLineBudgetResultChartData = result;
          this.doLeftBarLineBudgetResultChart();
        });
    }
  }
//===============================================================
// TEMPLATE END: component.ts.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.2.1.tpl
//===============================================================
  fetchLeftStackedBarBudgetResultChart() {
    this.loading = true;
    this.type = "original";
    if (this.type == "original") {
      this.portfolioSvc.getLeftStackedBarBudgetResultChart(this.scenarioId, this.reqModel)
        .subscribe(result => {

          this.loading = false;
          this.LeftStackedBarBudgetResultChartData = result;
          this.doLeftStackedBarBudgetResultChart();
        });
    } else if (this.type == "alternative") {
      this.portfolioSvc.getLeftStackedBarBudgetResultChart(this.scenarioId, this.reqModel)
        .subscribe(result => {

          this.loading = false;
          this.LeftStackedBarBudgetResultChartData = result;
          this.doLeftStackedBarBudgetResultChart();
        });
    }
  }
//===============================================================
// TEMPLATE END: component.ts.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.2.1.tpl
//===============================================================
  fetchLeftBarLineNPVResultChart() {
    this.loading = true;
    this.type = "original";
    if (this.type == "original") {
      this.portfolioSvc.getLeftBarLineNPVResultChart(this.scenarioId, this.reqModel)
        .subscribe(result => {

          this.loading = false;
          this.LeftBarLineNPVResultChartData = result;
          this.doLeftBarLineNPVResultChart();
        });
    } else if (this.type == "alternative") {
      this.portfolioSvc.getLeftBarLineNPVResultChart(this.scenarioId, this.reqModel)
        .subscribe(result => {

          this.loading = false;
          this.LeftBarLineNPVResultChartData = result;
          this.doLeftBarLineNPVResultChart();
        });
    }
  }
//===============================================================
// TEMPLATE END: component.ts.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.2.1.tpl
//===============================================================
  fetchLeftStackedBarNPVResultChart() {
    this.loading = true;
    this.type = "original";
    if (this.type == "original") {
      this.portfolioSvc.getLeftStackedBarNPVResultChart(this.scenarioId, this.reqModel)
        .subscribe(result => {

          this.loading = false;
          this.LeftStackedBarNPVResultChartData = result;
          this.doLeftStackedBarNPVResultChart();
        });
    } else if (this.type == "alternative") {
      this.portfolioSvc.getLeftStackedBarNPVResultChart(this.scenarioId, this.reqModel)
        .subscribe(result => {

          this.loading = false;
          this.LeftStackedBarNPVResultChartData = result;
          this.doLeftStackedBarNPVResultChart();
        });
    }
  }
//===============================================================
// TEMPLATE END: component.ts.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.2.1.tpl
//===============================================================
  fetchLeftRadarElementResultChart() {
    this.loading = true;
    this.type = "original";
    if (this.type == "original") {
      this.portfolioSvc.getLeftRadarElementResultChart(this.scenarioId, this.reqModel)
        .subscribe(result => {

          this.loading = false;
          this.LeftRadarElementResultChartData = result;
          this.doLeftRadarElementResultChart();
        });
    } else if (this.type == "alternative") {
      this.portfolioSvc.getLeftRadarElementResultChart(this.scenarioId, this.reqModel)
        .subscribe(result => {

          this.loading = false;
          this.LeftRadarElementResultChartData = result;
          this.doLeftRadarElementResultChart();
        });
    }
  }
//===============================================================
// TEMPLATE END: component.ts.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.2.1.tpl
//===============================================================
  fetchLeftStackedBarOSRiskResultChart() {
    this.loading = true;
    this.type = "original";
    if (this.type == "original") {
      this.portfolioSvc.getLeftStackedBarOSRiskResultChart(this.scenarioId, this.reqModel)
        .subscribe(result => {

          this.loading = false;
          this.LeftStackedBarOSRiskResultChartData = result;
          this.doLeftStackedBarOSRiskResultChart();
        });
    } else if (this.type == "alternative") {
      this.portfolioSvc.getLeftStackedBarOSRiskResultChart(this.scenarioId, this.reqModel)
        .subscribe(result => {

          this.loading = false;
          this.LeftStackedBarOSRiskResultChartData = result;
          this.doLeftStackedBarOSRiskResultChart();
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
    //this.getResultRejected();
    //this.getResultSummary();
    this.fetchChart();

  /* GENCODE:MARKER:14:START */

//===============================================================
// TEMPLATE START: gridcomponent.ts.2.4.tpl
//===============================================================
    this.fetchResultSummaryGrid();
//===============================================================
// TEMPLATE END: gridcomponent.ts.2.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.2.4.tpl
//===============================================================
    this.fetchResultPrioritisedGrid();
//===============================================================
// TEMPLATE END: gridcomponent.ts.2.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.2.4.tpl
//===============================================================
    this.fetchResultCategorizedPrio_1Grid();
//===============================================================
// TEMPLATE END: gridcomponent.ts.2.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.2.4.tpl
//===============================================================
    this.fetchResultCategorizedPrio_2Grid();
//===============================================================
// TEMPLATE END: gridcomponent.ts.2.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.2.4.tpl
//===============================================================
    this.fetchResultSupplyGrid();
//===============================================================
// TEMPLATE END: gridcomponent.ts.2.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.2.4.tpl
//===============================================================
    this.fetchResultDeprioritizedGrid();
//===============================================================
// TEMPLATE END: gridcomponent.ts.2.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.2.4.tpl
//===============================================================
    this.fetchResultCategorizedDeprio_1Grid();
//===============================================================
// TEMPLATE END: gridcomponent.ts.2.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.2.4.tpl
//===============================================================
    this.fetchResultCategorizedDeprio_2Grid();
//===============================================================
// TEMPLATE END: gridcomponent.ts.2.4.tpl
//===============================================================

  /* GENCODE:MARKER:14:END */

    //this.getResultApprovedGroupBy();
    //this.getResultRejectedGroupBy();
    //this.newChart();
    /* GENCODE:MARKER:4:START */

//===============================================================
// TEMPLATE START: component.ts.3.1.tpl
//===============================================================
    this.fetchLeftBarLineBudgetResultChart();
//===============================================================
// TEMPLATE END: component.ts.3.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.3.1.tpl
//===============================================================
    this.fetchLeftStackedBarBudgetResultChart();
//===============================================================
// TEMPLATE END: component.ts.3.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.3.1.tpl
//===============================================================
    this.fetchLeftBarLineNPVResultChart();
//===============================================================
// TEMPLATE END: component.ts.3.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.3.1.tpl
//===============================================================
    this.fetchLeftStackedBarNPVResultChart();
//===============================================================
// TEMPLATE END: component.ts.3.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.3.1.tpl
//===============================================================
    this.fetchLeftRadarElementResultChart();
//===============================================================
// TEMPLATE END: component.ts.3.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: component.ts.3.1.tpl
//===============================================================
    this.fetchLeftStackedBarOSRiskResultChart();
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
            }
          }
        }
      },
    });
  }

  //Siti 210623
  budgetChart() {
    if (this.budgetchart) {
      this.budgetchart.destroy();
    }

    this.budgetchart = new Chart(this.budgetchartRef.nativeElement, {
      type: "bar",
      data: this.budgetChartData,      
      options: {
        responsive: true,
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: "Scenarios Comparison"
            }
          }],
          yAxes: [{
            id: "annualBudget",
            position: 'left',
            scaleLabel: {
              display: true,
              labelString: "Annual Budget (RM)"
            },
            ticks: {  
              callback: function(label, index, labels) {
                return label.toLocaleString('en-GB', {style:"currency", currency:"MYR"}).replace('MYR', '');
              },
              beginAtZero: true,
              max: this.maxY,
              stepSize: this.maxY/10
            }
          },
          {
            id:"totalBudget",
            position: 'right',
            //stacked: true,
            scaleLabel: {
              display: true,
              labelString: "Total Budget (RM)"
            },
            ticks: {
              callback: function(label, index, labels) {
                return label.toLocaleString('en-GB', {style:"currency", currency:"MYR"}).replace('MYR', '');
              },
              beginAtZero: true,
              max: this.maxY2,
              stepSize: this.maxY2/10
            }
          }]
        },
      },
    });
    this.loading = false;
  }

  /* GENCODE:MARKER:5:START */

//===============================================================
// TEMPLATE START: component.ts.4.1.tpl
//===============================================================
  doLeftBarLineBudgetResultChart() {
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

    if (this.LeftBarLineBudgetResultChart) {
      this.LeftBarLineBudgetResultChart.destroy();
    }

    var LeftBarLineBudgetResultChartDS = this.LeftBarLineBudgetResultChartData.datasets.filter(a => a.type == "bar");
    var maxBarData = 0;
    LeftBarLineBudgetResultChartDS[0].data.forEach(x =>{
      if (maxBarData < x){
        maxBarData = x;
      }
    });

    var LeftBarLineBudgetResultChart_Y2 = (Math.ceil(this.LeftBarLineBudgetResultChartData.datasets.filter(a => a.type == "line")[0].data[0]/10)) * 11;
    var LeftBarLineBudgetResultChart_Y = (Math.ceil(maxBarData/10)) * 11;

    this.LeftBarLineBudgetResultChart = new Chart(this.LeftBarLineBudgetResultChartRef.nativeElement, {
      type: "bar",
      data: this.LeftBarLineBudgetResultChartData,      
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
              max: LeftBarLineBudgetResultChart_Y,
              stepSize: LeftBarLineBudgetResultChart_Y/10
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
              max: LeftBarLineBudgetResultChart_Y2,
              stepSize: LeftBarLineBudgetResultChart_Y2/10
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
  doLeftStackedBarBudgetResultChart() {

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

    if (this.LeftStackedBarBudgetResultChart) {
      this.LeftStackedBarBudgetResultChart.destroy();
    }

    this.LeftStackedBarBudgetResultChartData = this.adjustColor('Total Budget by Strategic Objective Chart', this.LeftStackedBarBudgetResultChartData);

    this.LeftStackedBarBudgetResultChart = new Chart(this.LeftStackedBarBudgetResultChartRef.nativeElement, {
        type: "bar",
        data: this.LeftStackedBarBudgetResultChartData,      
   
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
  doLeftBarLineNPVResultChart() {

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

    if (this.LeftBarLineNPVResultChart) {
      this.LeftBarLineNPVResultChart.destroy();
    }

    this.LeftBarLineNPVResultChartData = this.adjustColor('Cumulative NPV Risk Reduction Chart', this.LeftBarLineNPVResultChartData);

    this.LeftBarLineNPVResultChart = new Chart(this.LeftBarLineNPVResultChartRef.nativeElement, {
        type: "bar",
        data: this.LeftBarLineNPVResultChartData,      
   
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
  doLeftStackedBarNPVResultChart() {

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

    if (this.LeftStackedBarNPVResultChart) {
      this.LeftStackedBarNPVResultChart.destroy();
    }

    this.LeftStackedBarNPVResultChartData = this.adjustColor('Total NPV Risk Reduction by Strategic Objective Chart', this.LeftStackedBarNPVResultChartData);

    this.LeftStackedBarNPVResultChart = new Chart(this.LeftStackedBarNPVResultChartRef.nativeElement, {
        type: "bar",
        data: this.LeftStackedBarNPVResultChartData,      
   
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
  doLeftRadarElementResultChart() {
    if (this.LeftRadarElementResultChart) {
      this.LeftRadarElementResultChart.destroy();
    }

    this.LeftRadarElementResultChart = new Chart(this.LeftRadarElementResultChartRef.nativeElement, {
        type: "radar",
        data: this.LeftRadarElementResultChartData,
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
  doLeftStackedBarOSRiskResultChart() {

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

    if (this.LeftStackedBarOSRiskResultChart) {
      this.LeftStackedBarOSRiskResultChart.destroy();
    }

    this.LeftStackedBarOSRiskResultChartData = this.adjustColor('Chart of Outstanding Risk', this.LeftStackedBarOSRiskResultChartData);

    this.LeftStackedBarOSRiskResultChart = new Chart(this.LeftStackedBarOSRiskResultChartRef.nativeElement, {
        type: "bar",
        data: this.LeftStackedBarOSRiskResultChartData,      
   
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
    
  /* public onDeleteClick(cand) {
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
fetchResultSummaryGrid() {
  this.portfolioSvc
    .getResultSummaryGrid(this.scenarioId, this.reqModel)
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
fetchResultPrioritisedGrid() {
  this.portfolioSvc
    .getResultPrioritisedGrid(this.scenarioId, this.reqModel)
    .subscribe(response => {
      this.listOfApproved = response;
    });
}
//===============================================================
// TEMPLATE END: gridcomponent.ts.3.3.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.3.3.tpl
//===============================================================
fetchResultCategorizedPrio_1Grid() {
  this.portfolioSvc
    .getResultCategorizedPrio_1Grid(this.scenarioId, this.reqModel)
    .subscribe(response => {
      this.listOfApprovedGroupBy = response;
    });
}
//===============================================================
// TEMPLATE END: gridcomponent.ts.3.3.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.3.3.tpl
//===============================================================
fetchResultCategorizedPrio_2Grid() {
  this.portfolioSvc
    .getResultCategorizedPrio_2Grid(this.scenarioId, this.reqModel)
    .subscribe(response => {
      this.listOfApprovedGroupBy2 = response;
    });
}
//===============================================================
// TEMPLATE END: gridcomponent.ts.3.3.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.3.3.tpl
//===============================================================
fetchResultSupplyGrid() {
  this.portfolioSvc
    .getResultSupplyGrid(this.scenarioId, this.reqModel)
    .subscribe(response => {
      this.listOfSupply = response;
    });
}
//===============================================================
// TEMPLATE END: gridcomponent.ts.3.3.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.3.3.tpl
//===============================================================
fetchResultDeprioritizedGrid() {
  this.portfolioSvc
    .getResultDeprioritizedGrid(this.scenarioId, this.reqModel)
    .subscribe(response => {
      this.listOfRejected = response;
    });
}
//===============================================================
// TEMPLATE END: gridcomponent.ts.3.3.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.3.3.tpl
//===============================================================
fetchResultCategorizedDeprio_1Grid() {
  this.portfolioSvc
    .getResultCategorizedDeprio_1Grid(this.scenarioId, this.reqModel)
    .subscribe(response => {
      this.listOfRejectedGroupBy = response;
    });
}
//===============================================================
// TEMPLATE END: gridcomponent.ts.3.3.tpl
//===============================================================


//===============================================================
// TEMPLATE START: gridcomponent.ts.3.3.tpl
//===============================================================
fetchResultCategorizedDeprio_2Grid() {
  this.portfolioSvc
    .getResultCategorizedDeprio_2Grid(this.scenarioId, this.reqModel)
    .subscribe(response => {
      this.listOfRejectedGroupBy2 = response;
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
/*
  viewGanttChart() {
    let chartUrl = `https://ncpsas-stg.hq.tnb.com.my:8343/SASVisualAnalyticsViewer/?reportSBIP=SBIP%3A%2F%2FMETASERVER%2FINET%20VA%2FReports%2FAIPM%2FGantt%20Chart%20Draft(Report)&page=vi6&PlanID=${this.scenarioId}&ScenarioName=${encodeURIComponent(this.scenarioName)}`
    console.log(chartUrl);

    window.open(chartUrl, "_blank");
  }
*/
  viewGanttChart() {
  /*
  if (!this.userinfo.permissions.find(a => a == "ViewLFVA")) {
      this.router.navigate([PathConstant.Dashboard]);
      alert("Do not have permission to access");
  } else {*/
      let chartUrl = `https://ncpsas-stg.hq.tnb.com.my:8343/SASVisualAnalyticsViewer/?reportSBIP=SBIP%3A%2F%2FMETASERVER%2FINET%20VA%2FReports%2FAIPM%2FGantt%20Chart%20Draft(Report)&page=vi6&PlanID=${this.scenarioId}&ScenarioName=${encodeURIComponent(this.scenarioName)}`
      let glass = window.open("", "hide_referrer");
      if (glass==null) return;
      glass.document.open();
      glass.document.writeln(`<script type="text/javascript"> setTimeout(function(){document.getElementById("clickme").click()}, 100)</script>`);
      glass.document.writeln(`<a id="clickme" href="${chartUrl}" referrerpolicy="no-referrer">Click here if VA does not open</a>`);
      glass.document.close();  
  }
}