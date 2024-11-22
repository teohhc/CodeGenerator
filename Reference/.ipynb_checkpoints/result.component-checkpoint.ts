import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AipmFilterRequestModel, AIPMFilters, FilterBusinessArea } from '@views/aipm/aipm.interface';
import { AipmScenarioService } from '@views/aipm/scenario/scenario.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { combineLatest, forkJoin } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { AipmCostResultTable, AipmCostResultTableUpdate, AIPM_COST_RESULT_TABLE_COLUMNS_BUDGET, AIPM_COST_RESULT_TABLE_COLUMNS_DURATION, hdrDefSceEvalRiskAssesFinalResultSimulGridHdr, } from '../../cost.interface';
import { AipmCostService } from '../../cost.service';

@Component({
  selector: 'app-aimp-cost-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {
  public filters: AIPMFilters;
  public reqModel: AipmFilterRequestModel = {};
  public baList: FilterBusinessArea[];
  public dataSet = [{}]
  public chartData: any;
  public loading: boolean = true;
  public scenarioId: number;
  public updating: boolean = false;
  public tabId = 0;
  public tabs = ['Budget','Schedule']
  public durationTableData: AipmCostResultTable[] = [];
  public budgetTableData: AipmCostResultTable[] = [];
  public tableColumns = AIPM_COST_RESULT_TABLE_COLUMNS_BUDGET;
  public durationTableColumns = AIPM_COST_RESULT_TABLE_COLUMNS_DURATION;

  /* GENCODE:MARKER:1:START */

//===============================================================
// TEMPLATE START: cost.service.ts.1.1.tpl
//===============================================================
    public SceEvalRiskAssesFinalResultSimulGrid: any[];
    public SceEvalRiskAssesFinalResultSimulGridHdr = hdrDefSceEvalRiskAssesFinalResultSimulGridHdr();
    public SceEvalRiskAssesFinalResultSimulGridInfoCFGRule = {
      'freeze': {
        'left': [], 
        'right':[]
      },
      'format': {
 'Total_Scope2Budget': { 'type': 'number', 'format': '1.2-2' },
 'Total_ADJ_Scope2Budget': { 'type': 'number', 'format': '1.2-2' },
 'Total_Scope3Budget': { 'type': 'number', 'format': '1.2-2' },
 'Total_ADJ_Scope3Budget': { 'type': 'number', 'format': '1.2-2' },
 'Total_Scope4Budget': { 'type': 'number', 'format': '1.2-2' },
 'Total_ADJ_Scope4Budget': { 'type': 'number', 'format': '1.2-2' },
 'Total_Scope1Budget': { 'type': 'number', 'format': '1.2-2' },
 'Total_ADJ_Scope1Budget': { 'type': 'number', 'format': '1.2-2' },
      },
      'mergeRule': [],
      'highlightRule': {}
    };
//===============================================================
// TEMPLATE END: cost.service.ts.1.1.tpl
//===============================================================

  /* GENCODE:MARKER:1:END */
  
  timerSeconds: number = 1;
  interval;
  editedDuration: AipmCostResultTable[] = [];
  editedBudget: AipmCostResultTable[] = [];

  editable: boolean = false;
  
  public form: FormGroup;
  constructor(
    private notification: NzNotificationService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder, 
    private scenarioSvc: AipmScenarioService,
    private readonly costSvc: AipmCostService
  ) { }

  public ngOnInit(): void {
    
    this.form = this.formBuilder.group({
        stateCode: [],
        businessArea: [],
        projectTypeList: [],
        voltageList: [],
        scopeList: [],
    });
    this.scenarioId = this.activatedRoute.snapshot.params.id;

    this.getById();
    this.fetchFilters();
    this.fetchChartData();
  }
  

  public fetchFilters(){
    this.loading = true;
    this.costSvc.getFilters()
      .subscribe(result => {
        this.loading = false;
        if (result.success) {
          this.filters = result.entity;
          this.baList = this.filters.businessArea;
        }
      });
  }

  getById() {
    this.scenarioSvc.getById(
      "cost",
      this.scenarioId
    ).subscribe(result => {
      this.editable = result.editable;  
    });
  }

  public update(updates:AipmCostResultTable[], type: string ): void {
    if(!updates?.length){
      this.notification.info('No changes was made.','');
      return;
    }
    this.costSvc.updateChartTableData(updates.map(x => ({ id: x.id, userInput: x.user_Input })))
      .pipe(tap(() => {
        this.notification.success(`${type} Record Updated`, "");
      }))
      .subscribe()
  }

  onTableGridEvent(event) {
    this.sortChange(event.e, event.column, "");
  }

  public sortChange(e: string, column: string, table: string): void {
    if (e) {
      this.reqModel.sortByColumn = column;
      this.reqModel.sortDirection = (e === "ascend" ? "ASC" : "DESC");
    } else {
      this.reqModel.sortByColumn = "";
      this.reqModel.sortDirection = "";
    }
  }

  public updateDuration():void{
     this.update(this.editedDuration, 'Duration');
    //  this.update(this.durationTableData.filter(d => d.user_Input !== d.user_Input_new && d.user_Input_new), 'Duration');
  } 

  
  public updateBudget():void{
    this.update(this.editedBudget,'Budget');
    // this.update(this.budgetTableData.filter(d => d.user_Input !== d.user_Input_new && d.user_Input_new),'Budget');
 } 

  public fetchChartData() {

    this.chartData = null;

    this.reqModel.scenarioId = this.activatedRoute.snapshot.params.id;
    this.reqModel.state = this.form.get('stateCode').value !== null && this.form.get('stateCode').value != undefined ? this.form.get('stateCode').value : null;
    this.reqModel.businessArea = this.form.get('businessArea').value !== null && this.form.get('businessArea').value != undefined ? this.form.get('businessArea').value : null;
    this.reqModel.projectType = this.form.get('projectTypeList').value !== null && this.form.get('projectTypeList').value != undefined ? this.form.get('projectTypeList').value : null;
    this.reqModel.voltage = this.form.get('voltageList').value !== null && this.form.get('voltageList').value != undefined ? this.form.get('voltageList').value : null;
    this.reqModel.scope = this.form.get('scopeList').value !== null && this.form.get('scopeList').value != undefined ? this.form.get('scopeList').value : null;

    combineLatest(
      [
        this.costSvc.getProjectChart(this.scenarioId, this.reqModel), 
        this.costSvc.getChartTableData("duration", this.scenarioId, this.reqModel), 
        this.costSvc.getChartTableData("budget", this.scenarioId, this.reqModel)
      ]
      )
      .subscribe((rs) => {
        this.chartData = rs[0];
        this.durationTableData = rs[1].map((d)=>({...d,user_Input_new: d.user_Input}));
        this.budgetTableData = rs[2].map((d)=>({...d,user_Input_new: d.user_Input}));
      });

    /* GENCODE:MARKER:2:START */

//===============================================================
// TEMPLATE START: cost.service.ts.2.1.tpl
//===============================================================
  this.fetchSceEvalRiskAssesFinalResultSimulGrid();
//===============================================================
// TEMPLATE END: cost.service.ts.2.1.tpl
//===============================================================

    /* GENCODE:MARKER:2:END */
  }

  public onTabChange(e){
    this.tabId = e.index;
    // this.fetchChartData(this.scenarioId);
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

  clearFilter() {
    this.baList = this.filters.businessArea;
    this.form.patchValue({ stateCode: null });
    this.form.patchValue({ businessArea: null });
    this.form.patchValue({ voltageList: null });
    this.form.patchValue({ projectTypeList: null });
    this.form.patchValue({ scopeList: null });

    this.fetchChartData();
  }

  resetInterval() {
    clearInterval(this.interval);
    this.interval = null;
  }
  
  onUpdate(data: AipmCostResultTable, type: string) {
    if (this.editable) {
      if (type == "budget") {
        if (!this.editedBudget.find(a => a.id == data.id)) {
          this.editedBudget.push(data);
        } else {
          this.editedBudget.forEach(candidate => {
            if (candidate.id == data.id) {
              candidate = data;
            }
          });
        }
      } else if (type == "duration") {
        if (!this.editedDuration.find(a => a.id == data.id)) {
          this.editedDuration.push(data);
        } else {
          this.editedDuration.forEach(candidate => {
            if (candidate.id == data.id) {
              candidate = data;
            }
          });
        }
      }
      
  
      this.resetInterval();
  
      this.interval = setInterval(() => {
        if (this.timerSeconds > 0) {
          this.timerSeconds--;
        }
  
        if (this.timerSeconds == 0) {
          if (type == 'budget') {
            this.updateBudget();
          } else if (type == 'duration') {
            this.updateDuration();
          }
          clearInterval(this.interval);
          this.interval = null;
          this.timerSeconds = 1;
        }
      }, 1000);
    }
  }

    /* GENCODE:MARKER:3:START */

//===============================================================
// TEMPLATE START: cost.service.ts.3.1.tpl
//===============================================================
fetchSceEvalRiskAssesFinalResultSimulGrid() {
  this.costSvc
    .getSceEvalRiskAssesFinalResultSimulGrid(this.scenarioId, this.reqModel)
    .subscribe(response => {
      this.SceEvalRiskAssesFinalResultSimulGrid = response;
    });
}
//===============================================================
// TEMPLATE END: cost.service.ts.3.1.tpl
//===============================================================

    /* GENCODE:MARKER:3:END */
}
