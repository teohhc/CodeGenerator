import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { tap } from "rxjs/operators";
import { AipmGrid, IAipmPageParams, IRequestResponse } from "../aipm.interface";
import { ICandidate } from "../candidate/candidate.interface";
import { IPortfolio, IPortfolioApprovedResult, IPortfolioConfig, IPortfolioImportCandidate, IPortfolioRejectedResult, IPortfolioSummaryResult, PortfolioResultChartData } from "./portfolio.interface";
import { findEndOfBlock } from "@angular/localize/src/utils";
import { suppressDeprecationWarnings } from "moment";

@Injectable({
  providedIn: "root",
})
export class AipmPortfolioService {
  private END_POINT = {
    budget: {
      run: "/AipmBudgetCostOptimizationScenario/Run",
      list: "/AipmBudgetCostOptimizationScenario/List",
      create: "/AipmBudgetCostOptimizationScenario/Create",
    },
    cost: {
      run: "/AipmCostOptimizationScenario/Run",
      list: "/AipmCostOptimizationScenario/List",
      create: "/AipmCostOptimizationScenario/Create",
    },
    portfolio: {
      runAlternate: "/AipmPortfolioScenario/RunAlternate",
      chart: "/AipmPortfolioScenario/GetChart",
      alternativeChart: "/AipmPortfolioScenario/GetAlternativeChart",
      config: "/AipmPortfolioScenario/Config",
      list: "/AipmPortfolioScenario/List",
      save: "/AipmPortfolioScenario/SaveConfig",
      availableAlternateList: "/AipmPortfolioProject/AlternateProjects",
      availableSupplyList: "/AipmPortfolioProject/SupplyProjects",
      resultApproved: "/AipmPortfolioScenario/PortfolioResultsApproved",
      //resultApprovedDefer: "/AipmPortfolioScenario/PortfolioResultsApprovedDefer",
      resultAlternativeApproved: "/AipmPortfolioScenario/PortfolioAlternateResultsApproved",
      //resultRejected: "/AipmPortfolioScenario/PortfolioResultsRejected",
      resultAlternativeRejected: "/AipmPortfolioScenario/PortfolioAlternateResultsRejected",
      //resultSummary: "/AipmPortfolioScenario/PortfolioResultsSummary",
      compareResultSummary: "/AipmPortfolioScenario/PortfolioCompareResultsSummary",
      resultAlternativeSummary: "/AipmPortfolioScenario/PortfolioAlternateResultsSummary",
      import:"/AipmPortfolioScenario/PortfolioResultsAlternateProjectInsert",
      deleteAlternate:"/AipmPortfolioScenario/PortfolioResultsAlternateProjectDelete",
      supplyImport:"/AipmPortfolioScenario/PortfolioResultsSupplyInsert",
      deleteSupply:"/AipmPortfolioScenario/PortfolioResultsSupplyDelete",
      defer:"/AipmPortfolioProject/Defer",
      budgetChart:"/AipmPortfolioScenario/GetBudgetChart"

/* GENCODE:MARKER:1:START */

//===============================================================
// TEMPLATE START: service.ts.1.1.tpl
//===============================================================
    ,LeftBarLineBudgetResultChart:"/AipmPortfolioScenario/GetLeftBarLineBudgetResultChart"
//===============================================================
// TEMPLATE END: service.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: service.ts.1.1.tpl
//===============================================================
    ,LeftStackedBarBudgetResultChart:"/AipmPortfolioScenario/GetLeftStackedBarBudgetResultChart"
//===============================================================
// TEMPLATE END: service.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: service.ts.1.1.tpl
//===============================================================
    ,LeftBarLineNPVResultChart:"/AipmPortfolioScenario/GetLeftBarLineNPVResultChart"
//===============================================================
// TEMPLATE END: service.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: service.ts.1.1.tpl
//===============================================================
    ,LeftStackedBarNPVResultChart:"/AipmPortfolioScenario/GetLeftStackedBarNPVResultChart"
//===============================================================
// TEMPLATE END: service.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: service.ts.1.1.tpl
//===============================================================
    ,LeftRadarElementResultChart:"/AipmPortfolioScenario/GetLeftRadarElementResultChart"
//===============================================================
// TEMPLATE END: service.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: service.ts.1.1.tpl
//===============================================================
    ,LeftStackedBarOSRiskResultChart:"/AipmPortfolioScenario/GetLeftStackedBarOSRiskResultChart"
//===============================================================
// TEMPLATE END: service.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: service.ts.1.1.tpl
//===============================================================
    ,LeftBarLineBudgetChart:"/AipmPortfolioScenario/GetLeftBarLineBudgetChart"
//===============================================================
// TEMPLATE END: service.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: service.ts.1.1.tpl
//===============================================================
    ,RightBarLineBudgetChart:"/AipmPortfolioScenario/GetRightBarLineBudgetChart"
//===============================================================
// TEMPLATE END: service.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: service.ts.1.1.tpl
//===============================================================
    ,LeftStackedBarBudgetChart:"/AipmPortfolioScenario/GetLeftStackedBarBudgetChart"
//===============================================================
// TEMPLATE END: service.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: service.ts.1.1.tpl
//===============================================================
    ,RightStackedBarBudgetChart:"/AipmPortfolioScenario/GetRightStackedBarBudgetChart"
//===============================================================
// TEMPLATE END: service.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: service.ts.1.1.tpl
//===============================================================
    ,LeftBarLineNPVChart:"/AipmPortfolioScenario/GetLeftBarLineNPVChart"
//===============================================================
// TEMPLATE END: service.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: service.ts.1.1.tpl
//===============================================================
    ,RightBarLineNPVChart:"/AipmPortfolioScenario/GetRightBarLineNPVChart"
//===============================================================
// TEMPLATE END: service.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: service.ts.1.1.tpl
//===============================================================
    ,LeftStackedBarNPVChart:"/AipmPortfolioScenario/GetLeftStackedBarNPVChart"
//===============================================================
// TEMPLATE END: service.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: service.ts.1.1.tpl
//===============================================================
    ,RightStackedBarNPVChart:"/AipmPortfolioScenario/GetRightStackedBarNPVChart"
//===============================================================
// TEMPLATE END: service.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: service.ts.1.1.tpl
//===============================================================
    ,LeftRadarElementChart:"/AipmPortfolioScenario/GetLeftRadarElementChart"
//===============================================================
// TEMPLATE END: service.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: service.ts.1.1.tpl
//===============================================================
    ,RightRadarElementChart:"/AipmPortfolioScenario/GetRightRadarElementChart"
//===============================================================
// TEMPLATE END: service.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: service.ts.1.1.tpl
//===============================================================
    ,LeftStackedBarOSRiskChart:"/AipmPortfolioScenario/GetLeftStackedBarOSRiskChart"
//===============================================================
// TEMPLATE END: service.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: service.ts.1.1.tpl
//===============================================================
    ,RightStackedBarOSRiskChart:"/AipmPortfolioScenario/GetRightStackedBarOSRiskChart"
//===============================================================
// TEMPLATE END: service.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.1.1.tpl
//===============================================================
    ,resultRejectedGroupBy:"/AipmPortfolioScenario/resultRejectedGroupBy"
//===============================================================
// TEMPLATE END: portfolio.service.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.1.1.tpl
//===============================================================
    ,AlternateResultRejectedGroupBy:"/AipmPortfolioScenario/AlternateResultRejectedGroupBy"
//===============================================================
// TEMPLATE END: portfolio.service.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.1.1.tpl
//===============================================================
    ,resultApprovedGroupBy:"/AipmPortfolioScenario/resultApprovedGroupBy"
//===============================================================
// TEMPLATE END: portfolio.service.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.1.1.tpl
//===============================================================
    ,resultRejectedGroupBy2:"/AipmPortfolioScenario/resultRejectedGroupBy2"
//===============================================================
// TEMPLATE END: portfolio.service.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.1.1.tpl
//===============================================================
    ,AlternateResultApprovedGroupBy2:"/AipmPortfolioScenario/AlternateResultApprovedGroupBy2"
//===============================================================
// TEMPLATE END: portfolio.service.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.1.1.tpl
//===============================================================
    ,AlternateResultRejectedGroupBy2:"/AipmPortfolioScenario/AlternateResultRejectedGroupBy2"
//===============================================================
// TEMPLATE END: portfolio.service.ts.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.1.1.tpl
//===============================================================
    ,resultApprovedGroupBy2:"/AipmPortfolioScenario/resultApprovedGroupBy2"
//===============================================================
// TEMPLATE END: portfolio.service.ts.1.1.tpl
//===============================================================

/* GENCODE:MARKER:1:END */

/* GENCODE:MARKER:3:START */

//===============================================================
// TEMPLATE START: portfolio.service.ts.1.2.tpl
//===============================================================
    ,resultRejected:"/AipmPortfolioScenario/PortfolioResultsRejected"
//===============================================================
// TEMPLATE END: portfolio.service.ts.1.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.1.2.tpl
//===============================================================
    ,resultAlternate:"/AipmPortfolioScenario/PortfolioResultsAlternateProject"
//===============================================================
// TEMPLATE END: portfolio.service.ts.1.2.tpl
//===============================================================

/* GENCODE:MARKER:3:END */

/* GENCODE:MARKER:4:START */

//===============================================================
// TEMPLATE START: portfolio.service.ts.1.4.tpl
//===============================================================
    ,ResultSummaryGrid:"/AipmPortfolioScenario/GetResultSummaryGrid"
//===============================================================
// TEMPLATE END: portfolio.service.ts.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.1.4.tpl
//===============================================================
    ,ResultPrioritisedGrid:"/AipmPortfolioScenario/GetResultPrioritisedGrid"
//===============================================================
// TEMPLATE END: portfolio.service.ts.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.1.4.tpl
//===============================================================
    ,ResultCategorizedPrio_1Grid:"/AipmPortfolioScenario/GetResultCategorizedPrio_1Grid"
//===============================================================
// TEMPLATE END: portfolio.service.ts.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.1.4.tpl
//===============================================================
    ,ResultCategorizedPrio_2Grid:"/AipmPortfolioScenario/GetResultCategorizedPrio_2Grid"
//===============================================================
// TEMPLATE END: portfolio.service.ts.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.1.4.tpl
//===============================================================
    ,ResultSupplyGrid:"/AipmPortfolioScenario/GetResultSupplyGrid"
//===============================================================
// TEMPLATE END: portfolio.service.ts.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.1.4.tpl
//===============================================================
    ,ResultDeprioritizedGrid:"/AipmPortfolioScenario/GetResultDeprioritizedGrid"
//===============================================================
// TEMPLATE END: portfolio.service.ts.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.1.4.tpl
//===============================================================
    ,ResultCategorizedDeprio_1Grid:"/AipmPortfolioScenario/GetResultCategorizedDeprio_1Grid"
//===============================================================
// TEMPLATE END: portfolio.service.ts.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.1.4.tpl
//===============================================================
    ,ResultCategorizedDeprio_2Grid:"/AipmPortfolioScenario/GetResultCategorizedDeprio_2Grid"
//===============================================================
// TEMPLATE END: portfolio.service.ts.1.4.tpl
//===============================================================

/* GENCODE:MARKER:4:END */

/* GENCODE:MARKER:6:START */

//===============================================================
// TEMPLATE START: portfolio.service.ts.1.4.tpl
//===============================================================
    ,AlternateResultSummaryGrid:"/AipmPortfolioScenario/GetAlternateResultSummaryGrid"
//===============================================================
// TEMPLATE END: portfolio.service.ts.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.1.4.tpl
//===============================================================
    ,AlternateResultPrioritisedGrid:"/AipmPortfolioScenario/GetAlternateResultPrioritisedGrid"
//===============================================================
// TEMPLATE END: portfolio.service.ts.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.1.4.tpl
//===============================================================
    ,AlternateResultCategorizedPrio_1Grid:"/AipmPortfolioScenario/GetAlternateResultCategorizedPrio_1Grid"
//===============================================================
// TEMPLATE END: portfolio.service.ts.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.1.4.tpl
//===============================================================
    ,AlternateResultCategorizedPrio_2Grid:"/AipmPortfolioScenario/GetAlternateResultCategorizedPrio_2Grid"
//===============================================================
// TEMPLATE END: portfolio.service.ts.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.1.4.tpl
//===============================================================
    ,AlternateResultAlternateProjGrid:"/AipmPortfolioScenario/GetAlternateResultAlternateProjGrid"
//===============================================================
// TEMPLATE END: portfolio.service.ts.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.1.4.tpl
//===============================================================
    ,AlternateResultSupplyGrid:"/AipmPortfolioScenario/GetAlternateResultSupplyGrid"
//===============================================================
// TEMPLATE END: portfolio.service.ts.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.1.4.tpl
//===============================================================
    ,AlternateResultDeprioritizedGrid:"/AipmPortfolioScenario/GetAlternateResultDeprioritizedGrid"
//===============================================================
// TEMPLATE END: portfolio.service.ts.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.1.4.tpl
//===============================================================
    ,AlternateResultCategorizedDeprio_1Grid:"/AipmPortfolioScenario/GetAlternateResultCategorizedDeprio_1Grid"
//===============================================================
// TEMPLATE END: portfolio.service.ts.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.1.4.tpl
//===============================================================
    ,AlternateResultCategorizedDeprio_2Grid:"/AipmPortfolioScenario/GetAlternateResultCategorizedDeprio_2Grid"
//===============================================================
// TEMPLATE END: portfolio.service.ts.1.4.tpl
//===============================================================

/* GENCODE:MARKER:6:END */

/* GENCODE:MARKER:8:START */

//===============================================================
// TEMPLATE START: portfolio.service.ts.1.4.tpl
//===============================================================
    ,ComparisonSummaryGrid:"/AipmPortfolioScenario/GetComparisonSummaryGrid"
//===============================================================
// TEMPLATE END: portfolio.service.ts.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.1.4.tpl
//===============================================================
    ,ComparisonPrioritisedGrid:"/AipmPortfolioScenario/GetComparisonPrioritisedGrid"
//===============================================================
// TEMPLATE END: portfolio.service.ts.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.1.4.tpl
//===============================================================
    ,ComparisonDeprioritizedGrid:"/AipmPortfolioScenario/GetComparisonDeprioritizedGrid"
//===============================================================
// TEMPLATE END: portfolio.service.ts.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.1.4.tpl
//===============================================================
    ,ComparisonCategorizedPrio_1Grid:"/AipmPortfolioScenario/GetComparisonCategorizedPrio_1Grid"
//===============================================================
// TEMPLATE END: portfolio.service.ts.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.1.4.tpl
//===============================================================
    ,ComparisonCategorizedPrio_2Grid:"/AipmPortfolioScenario/GetComparisonCategorizedPrio_2Grid"
//===============================================================
// TEMPLATE END: portfolio.service.ts.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.1.4.tpl
//===============================================================
    ,ComparisonCategorizedDeprio_1Grid:"/AipmPortfolioScenario/GetComparisonCategorizedDeprio_1Grid"
//===============================================================
// TEMPLATE END: portfolio.service.ts.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.1.4.tpl
//===============================================================
    ,ComparisonCategorizedDeprio_2Grid:"/AipmPortfolioScenario/GetComparisonCategorizedDeprio_2Grid"
//===============================================================
// TEMPLATE END: portfolio.service.ts.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.1.4.tpl
//===============================================================
    ,ComparisonAlternateProjGrid:"/AipmPortfolioScenario/GetComparisonAlternateProjGrid"
//===============================================================
// TEMPLATE END: portfolio.service.ts.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.1.4.tpl
//===============================================================
    ,ComparisonSupplyGrid:"/AipmPortfolioScenario/GetComparisonSupplyGrid"
//===============================================================
// TEMPLATE END: portfolio.service.ts.1.4.tpl
//===============================================================

/* GENCODE:MARKER:8:END */

/* GENCODE:MARKER:10:START */

//===============================================================
// TEMPLATE START: portfolio.service.ts.1.4.tpl
//===============================================================
    ,ComparisonRightSummaryGrid:"/AipmPortfolioScenario/GetComparisonRightSummaryGrid"
//===============================================================
// TEMPLATE END: portfolio.service.ts.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.1.4.tpl
//===============================================================
    ,ComparisonRightPrioritisedGrid:"/AipmPortfolioScenario/GetComparisonRightPrioritisedGrid"
//===============================================================
// TEMPLATE END: portfolio.service.ts.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.1.4.tpl
//===============================================================
    ,ComparisonRightDeprioritizedGrid:"/AipmPortfolioScenario/GetComparisonRightDeprioritizedGrid"
//===============================================================
// TEMPLATE END: portfolio.service.ts.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.1.4.tpl
//===============================================================
    ,ComparisonRightCategorizedPrio_1Grid:"/AipmPortfolioScenario/GetComparisonRightCategorizedPrio_1Grid"
//===============================================================
// TEMPLATE END: portfolio.service.ts.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.1.4.tpl
//===============================================================
    ,ComparisonRightCategorizedPrio_2Grid:"/AipmPortfolioScenario/GetComparisonRightCategorizedPrio_2Grid"
//===============================================================
// TEMPLATE END: portfolio.service.ts.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.1.4.tpl
//===============================================================
    ,ComparisonRightCategorizedDeprio_1Grid:"/AipmPortfolioScenario/GetComparisonRightCategorizedDeprio_1Grid"
//===============================================================
// TEMPLATE END: portfolio.service.ts.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.1.4.tpl
//===============================================================
    ,ComparisonRightCategorizedDeprio_2Grid:"/AipmPortfolioScenario/GetComparisonRightCategorizedDeprio_2Grid"
//===============================================================
// TEMPLATE END: portfolio.service.ts.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.1.4.tpl
//===============================================================
    ,ComparisonRightAlternateProjGrid:"/AipmPortfolioScenario/GetComparisonRightAlternateProjGrid"
//===============================================================
// TEMPLATE END: portfolio.service.ts.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.1.4.tpl
//===============================================================
    ,ComparisonRightSupplyGrid:"/AipmPortfolioScenario/GetComparisonRightSupplyGrid"
//===============================================================
// TEMPLATE END: portfolio.service.ts.1.4.tpl
//===============================================================

/* GENCODE:MARKER:10:END */

,saveBudgetConfig:"/AipmPortfolioScenario/SaveBudgetConfig"

    },
  };

  public readonly importCompleted$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient) {}
  // constructor(private readonly http: HttpClient) {}

  public runAlternate(
    scenarioId: number,
  ): Observable<any> {
    return this.http.post<IRequestResponse<any>>(this.END_POINT["portfolio"].runAlternate, {scenarioId: scenarioId});
  }

  public getOriginalChart(
    scenarioId: number,
    params: any
  ): Observable<PortfolioResultChartData> {
    return this.http.post<PortfolioResultChartData>(this.END_POINT["portfolio"].chart+"/"+scenarioId.toString(), params);
  }

  public getAlternativeChart(
    scenarioId: number,
    params: any
  ): Observable<PortfolioResultChartData> {
    return this.http.post<PortfolioResultChartData>(this.END_POINT["portfolio"].alternativeChart+"/"+scenarioId.toString(), params);
  }

  public getConfig(
    scenarioId: number
  ): Observable<any> {
    return this.http.get<IRequestResponse<IPortfolioConfig[]>>(this.END_POINT["portfolio"].config+"/"+scenarioId.toString());
  }

  public saveConfig(
    params: any
  ): Observable<any> {
    return this.http.post<IRequestResponse<IPortfolioConfig[]>>(this.END_POINT["portfolio"].save, params);
  }
  public getPortfolioAvailableAlternateList(
    params: any
  ): Observable<any> {
    return this.http.post<IRequestResponse<IPortfolioImportCandidate[]>>(this.END_POINT["portfolio"].availableAlternateList, params);
  }

  public getPortfolioAvailableSupplyList(
    params: any
  ): Observable<any> {
    return this.http.post<IRequestResponse<IPortfolioImportCandidate[]>>(this.END_POINT["portfolio"].availableSupplyList, params);
  }

  public deleteAlternateProject(
    params: any
  ): Observable<any> {
    return this.http.post<IRequestResponse<string>>(this.END_POINT["portfolio"].deleteAlternate, params);
  }

  public deleteSupplyProject(
    params: any
  ): Observable<any> {
    return this.http.post<IRequestResponse<string>>(this.END_POINT["portfolio"].deleteSupply, params);
  }

  public getPortfolioResultApproved(
    scenarioId: number,
    params: any
  ): Observable<any> {
    return this.http.post<IRequestResponse<IPortfolioApprovedResult>>(this.END_POINT["portfolio"].resultApproved+"/"+scenarioId.toString(), params);
  }
  
  public getPortfolioCompareResultSummary(
    scenarioIds: string,
    params: any
  ): Observable<any> {
    return this.http.post<AipmGrid>(this.END_POINT["portfolio"].compareResultSummary+"/"+scenarioIds, params);
  }

  public importAlternateProject( scenarioId: number,projectId:number, startDate:String, reproposal: number[] ): Observable<any>{
    return this.http.post<any>(`${this.END_POINT["portfolio"].import}?scenarioId=${scenarioId}&projectId=${projectId}&startDate=${startDate}&reproposal=${reproposal}`,{})
    .pipe(
      tap((rs) => {
        if (rs) this.importCompleted$.next(true);
      })
    );;
  }

  public importSupplyProject( scenarioId: number,projectId:number): Observable<any>{
    return this.http.post<any>(`${this.END_POINT["portfolio"].supplyImport}?scenarioId=${scenarioId}&projectId=${projectId}`,{})
    .pipe(
      tap((rs) => {
        if (rs) this.importCompleted$.next(true);
      })
    );;
  }

  public getPortfolioAlternateResultApproved(
    scenarioId: number,
    params: any
  ): Observable<any> {
    return this.http.post<IRequestResponse<IPortfolioApprovedResult>>(this.END_POINT["portfolio"].resultAlternativeApproved+"/"+scenarioId.toString(), params);
  }

  public getPortfolioAlternateResultRejected(
    scenarioId: number,
    params: any
  ): Observable<any> {
    return this.http.post<IRequestResponse<IPortfolioRejectedResult>>(this.END_POINT["portfolio"].resultAlternativeRejected+"/"+scenarioId.toString(), params);
  }

  public getPortfolioAlternateResultSummary(
    scenarioId: number,
    params: any
  ): Observable<any> {
    return this.http.post<IPortfolioSummaryResult[]>(this.END_POINT["portfolio"].resultAlternativeSummary+"/"+scenarioId.toString(), params);
  }

  public deferProject(
    params: any
  ): Observable<any> {
    return this.http.post<IRequestResponse<string>>(this.END_POINT["portfolio"].defer, params);
  }

  public getBudgetChart(
    scenarioId: number,
    params: any
  ): Observable<PortfolioResultChartData> {
    return this.http.post<PortfolioResultChartData>(this.END_POINT["portfolio"].budgetChart+"/"+scenarioId.toString(), params);
  }

  public getSupplyProjectGrid(
    scenarioId: number,
    params: any
  ): Observable<any> {
    return this.http.post<IRequestResponse<[]>>(this.END_POINT["portfolio"].ResultSupplyGrid+"/"+scenarioId.toString(), params);
  } // no need one, later delete

/* GENCODE:MARKER:5:START */

//===============================================================
// TEMPLATE START: portfolio.service.ts.2.2.tpl
//===============================================================
public getResultSummaryGrid(
  scenarioId: number,
  params: any
): Observable<any> {
  return this.http.post<IRequestResponse<[]>>(this.END_POINT["portfolio"].ResultSummaryGrid+"/"+scenarioId.toString(), params);
}
//===============================================================
// TEMPLATE END: portfolio.service.ts.2.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.2.2.tpl
//===============================================================
public getResultPrioritisedGrid(
  scenarioId: number,
  params: any
): Observable<any> {
  return this.http.post<IRequestResponse<[]>>(this.END_POINT["portfolio"].ResultPrioritisedGrid+"/"+scenarioId.toString(), params);
}
//===============================================================
// TEMPLATE END: portfolio.service.ts.2.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.2.2.tpl
//===============================================================
public getResultCategorizedPrio_1Grid(
  scenarioId: number,
  params: any
): Observable<any> {
  return this.http.post<IRequestResponse<[]>>(this.END_POINT["portfolio"].ResultCategorizedPrio_1Grid+"/"+scenarioId.toString(), params);
}
//===============================================================
// TEMPLATE END: portfolio.service.ts.2.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.2.2.tpl
//===============================================================
public getResultCategorizedPrio_2Grid(
  scenarioId: number,
  params: any
): Observable<any> {
  return this.http.post<IRequestResponse<[]>>(this.END_POINT["portfolio"].ResultCategorizedPrio_2Grid+"/"+scenarioId.toString(), params);
}
//===============================================================
// TEMPLATE END: portfolio.service.ts.2.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.2.2.tpl
//===============================================================
public getResultSupplyGrid(
  scenarioId: number,
  params: any
): Observable<any> {
  return this.http.post<IRequestResponse<[]>>(this.END_POINT["portfolio"].ResultSupplyGrid+"/"+scenarioId.toString(), params);
}
//===============================================================
// TEMPLATE END: portfolio.service.ts.2.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.2.2.tpl
//===============================================================
public getResultDeprioritizedGrid(
  scenarioId: number,
  params: any
): Observable<any> {
  return this.http.post<IRequestResponse<[]>>(this.END_POINT["portfolio"].ResultDeprioritizedGrid+"/"+scenarioId.toString(), params);
}
//===============================================================
// TEMPLATE END: portfolio.service.ts.2.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.2.2.tpl
//===============================================================
public getResultCategorizedDeprio_1Grid(
  scenarioId: number,
  params: any
): Observable<any> {
  return this.http.post<IRequestResponse<[]>>(this.END_POINT["portfolio"].ResultCategorizedDeprio_1Grid+"/"+scenarioId.toString(), params);
}
//===============================================================
// TEMPLATE END: portfolio.service.ts.2.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.2.2.tpl
//===============================================================
public getResultCategorizedDeprio_2Grid(
  scenarioId: number,
  params: any
): Observable<any> {
  return this.http.post<IRequestResponse<[]>>(this.END_POINT["portfolio"].ResultCategorizedDeprio_2Grid+"/"+scenarioId.toString(), params);
}
//===============================================================
// TEMPLATE END: portfolio.service.ts.2.2.tpl
//===============================================================

/* GENCODE:MARKER:5:END */

/* GENCODE:MARKER:7:START */

//===============================================================
// TEMPLATE START: portfolio.service.ts.2.2.tpl
//===============================================================
public getAlternateResultSummaryGrid(
  scenarioId: number,
  params: any
): Observable<any> {
  return this.http.post<IRequestResponse<[]>>(this.END_POINT["portfolio"].AlternateResultSummaryGrid+"/"+scenarioId.toString(), params);
}
//===============================================================
// TEMPLATE END: portfolio.service.ts.2.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.2.2.tpl
//===============================================================
public getAlternateResultPrioritisedGrid(
  scenarioId: number,
  params: any
): Observable<any> {
  return this.http.post<IRequestResponse<[]>>(this.END_POINT["portfolio"].AlternateResultPrioritisedGrid+"/"+scenarioId.toString(), params);
}
//===============================================================
// TEMPLATE END: portfolio.service.ts.2.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.2.2.tpl
//===============================================================
public getAlternateResultCategorizedPrio_1Grid(
  scenarioId: number,
  params: any
): Observable<any> {
  return this.http.post<IRequestResponse<[]>>(this.END_POINT["portfolio"].AlternateResultCategorizedPrio_1Grid+"/"+scenarioId.toString(), params);
}
//===============================================================
// TEMPLATE END: portfolio.service.ts.2.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.2.2.tpl
//===============================================================
public getAlternateResultCategorizedPrio_2Grid(
  scenarioId: number,
  params: any
): Observable<any> {
  return this.http.post<IRequestResponse<[]>>(this.END_POINT["portfolio"].AlternateResultCategorizedPrio_2Grid+"/"+scenarioId.toString(), params);
}
//===============================================================
// TEMPLATE END: portfolio.service.ts.2.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.2.2.tpl
//===============================================================
public getAlternateResultAlternateProjGrid(
  scenarioId: number,
  params: any
): Observable<any> {
  return this.http.post<IRequestResponse<[]>>(this.END_POINT["portfolio"].AlternateResultAlternateProjGrid+"/"+scenarioId.toString(), params);
}
//===============================================================
// TEMPLATE END: portfolio.service.ts.2.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.2.2.tpl
//===============================================================
public getAlternateResultSupplyGrid(
  scenarioId: number,
  params: any
): Observable<any> {
  return this.http.post<IRequestResponse<[]>>(this.END_POINT["portfolio"].AlternateResultSupplyGrid+"/"+scenarioId.toString(), params);
}
//===============================================================
// TEMPLATE END: portfolio.service.ts.2.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.2.2.tpl
//===============================================================
public getAlternateResultDeprioritizedGrid(
  scenarioId: number,
  params: any
): Observable<any> {
  return this.http.post<IRequestResponse<[]>>(this.END_POINT["portfolio"].AlternateResultDeprioritizedGrid+"/"+scenarioId.toString(), params);
}
//===============================================================
// TEMPLATE END: portfolio.service.ts.2.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.2.2.tpl
//===============================================================
public getAlternateResultCategorizedDeprio_1Grid(
  scenarioId: number,
  params: any
): Observable<any> {
  return this.http.post<IRequestResponse<[]>>(this.END_POINT["portfolio"].AlternateResultCategorizedDeprio_1Grid+"/"+scenarioId.toString(), params);
}
//===============================================================
// TEMPLATE END: portfolio.service.ts.2.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.2.2.tpl
//===============================================================
public getAlternateResultCategorizedDeprio_2Grid(
  scenarioId: number,
  params: any
): Observable<any> {
  return this.http.post<IRequestResponse<[]>>(this.END_POINT["portfolio"].AlternateResultCategorizedDeprio_2Grid+"/"+scenarioId.toString(), params);
}
//===============================================================
// TEMPLATE END: portfolio.service.ts.2.2.tpl
//===============================================================

/* GENCODE:MARKER:7:END */

/* GENCODE:MARKER:9:START */

//===============================================================
// TEMPLATE START: portfolio.service.ts.2.2.tpl
//===============================================================
public getComparisonSummaryGrid(
  scenarioId: number,
  params: any
): Observable<any> {
  return this.http.post<IRequestResponse<[]>>(this.END_POINT["portfolio"].ComparisonSummaryGrid+"/"+scenarioId.toString(), params);
}
//===============================================================
// TEMPLATE END: portfolio.service.ts.2.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.2.2.tpl
//===============================================================
public getComparisonPrioritisedGrid(
  scenarioId: number,
  params: any
): Observable<any> {
  return this.http.post<IRequestResponse<[]>>(this.END_POINT["portfolio"].ComparisonPrioritisedGrid+"/"+scenarioId.toString(), params);
}
//===============================================================
// TEMPLATE END: portfolio.service.ts.2.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.2.2.tpl
//===============================================================
public getComparisonDeprioritizedGrid(
  scenarioId: number,
  params: any
): Observable<any> {
  return this.http.post<IRequestResponse<[]>>(this.END_POINT["portfolio"].ComparisonDeprioritizedGrid+"/"+scenarioId.toString(), params);
}
//===============================================================
// TEMPLATE END: portfolio.service.ts.2.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.2.2.tpl
//===============================================================
public getComparisonCategorizedPrio_1Grid(
  scenarioId: number,
  params: any
): Observable<any> {
  return this.http.post<IRequestResponse<[]>>(this.END_POINT["portfolio"].ComparisonCategorizedPrio_1Grid+"/"+scenarioId.toString(), params);
}
//===============================================================
// TEMPLATE END: portfolio.service.ts.2.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.2.2.tpl
//===============================================================
public getComparisonCategorizedPrio_2Grid(
  scenarioId: number,
  params: any
): Observable<any> {
  return this.http.post<IRequestResponse<[]>>(this.END_POINT["portfolio"].ComparisonCategorizedPrio_2Grid+"/"+scenarioId.toString(), params);
}
//===============================================================
// TEMPLATE END: portfolio.service.ts.2.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.2.2.tpl
//===============================================================
public getComparisonCategorizedDeprio_1Grid(
  scenarioId: number,
  params: any
): Observable<any> {
  return this.http.post<IRequestResponse<[]>>(this.END_POINT["portfolio"].ComparisonCategorizedDeprio_1Grid+"/"+scenarioId.toString(), params);
}
//===============================================================
// TEMPLATE END: portfolio.service.ts.2.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.2.2.tpl
//===============================================================
public getComparisonCategorizedDeprio_2Grid(
  scenarioId: number,
  params: any
): Observable<any> {
  return this.http.post<IRequestResponse<[]>>(this.END_POINT["portfolio"].ComparisonCategorizedDeprio_2Grid+"/"+scenarioId.toString(), params);
}
//===============================================================
// TEMPLATE END: portfolio.service.ts.2.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.2.2.tpl
//===============================================================
public getComparisonAlternateProjGrid(
  scenarioId: number,
  params: any
): Observable<any> {
  return this.http.post<IRequestResponse<[]>>(this.END_POINT["portfolio"].ComparisonAlternateProjGrid+"/"+scenarioId.toString(), params);
}
//===============================================================
// TEMPLATE END: portfolio.service.ts.2.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.2.2.tpl
//===============================================================
public getComparisonSupplyGrid(
  scenarioId: number,
  params: any
): Observable<any> {
  return this.http.post<IRequestResponse<[]>>(this.END_POINT["portfolio"].ComparisonSupplyGrid+"/"+scenarioId.toString(), params);
}
//===============================================================
// TEMPLATE END: portfolio.service.ts.2.2.tpl
//===============================================================

/* GENCODE:MARKER:9:END */

/* GENCODE:MARKER:11:START */

//===============================================================
// TEMPLATE START: portfolio.service.ts.2.2.tpl
//===============================================================
public getComparisonRightSummaryGrid(
  scenarioId: number,
  params: any
): Observable<any> {
  return this.http.post<IRequestResponse<[]>>(this.END_POINT["portfolio"].ComparisonRightSummaryGrid+"/"+scenarioId.toString(), params);
}
//===============================================================
// TEMPLATE END: portfolio.service.ts.2.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.2.2.tpl
//===============================================================
public getComparisonRightPrioritisedGrid(
  scenarioId: number,
  params: any
): Observable<any> {
  return this.http.post<IRequestResponse<[]>>(this.END_POINT["portfolio"].ComparisonRightPrioritisedGrid+"/"+scenarioId.toString(), params);
}
//===============================================================
// TEMPLATE END: portfolio.service.ts.2.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.2.2.tpl
//===============================================================
public getComparisonRightDeprioritizedGrid(
  scenarioId: number,
  params: any
): Observable<any> {
  return this.http.post<IRequestResponse<[]>>(this.END_POINT["portfolio"].ComparisonRightDeprioritizedGrid+"/"+scenarioId.toString(), params);
}
//===============================================================
// TEMPLATE END: portfolio.service.ts.2.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.2.2.tpl
//===============================================================
public getComparisonRightCategorizedPrio_1Grid(
  scenarioId: number,
  params: any
): Observable<any> {
  return this.http.post<IRequestResponse<[]>>(this.END_POINT["portfolio"].ComparisonRightCategorizedPrio_1Grid+"/"+scenarioId.toString(), params);
}
//===============================================================
// TEMPLATE END: portfolio.service.ts.2.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.2.2.tpl
//===============================================================
public getComparisonRightCategorizedPrio_2Grid(
  scenarioId: number,
  params: any
): Observable<any> {
  return this.http.post<IRequestResponse<[]>>(this.END_POINT["portfolio"].ComparisonRightCategorizedPrio_2Grid+"/"+scenarioId.toString(), params);
}
//===============================================================
// TEMPLATE END: portfolio.service.ts.2.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.2.2.tpl
//===============================================================
public getComparisonRightCategorizedDeprio_1Grid(
  scenarioId: number,
  params: any
): Observable<any> {
  return this.http.post<IRequestResponse<[]>>(this.END_POINT["portfolio"].ComparisonRightCategorizedDeprio_1Grid+"/"+scenarioId.toString(), params);
}
//===============================================================
// TEMPLATE END: portfolio.service.ts.2.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.2.2.tpl
//===============================================================
public getComparisonRightCategorizedDeprio_2Grid(
  scenarioId: number,
  params: any
): Observable<any> {
  return this.http.post<IRequestResponse<[]>>(this.END_POINT["portfolio"].ComparisonRightCategorizedDeprio_2Grid+"/"+scenarioId.toString(), params);
}
//===============================================================
// TEMPLATE END: portfolio.service.ts.2.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.2.2.tpl
//===============================================================
public getComparisonRightAlternateProjGrid(
  scenarioId: number,
  params: any
): Observable<any> {
  return this.http.post<IRequestResponse<[]>>(this.END_POINT["portfolio"].ComparisonRightAlternateProjGrid+"/"+scenarioId.toString(), params);
}
//===============================================================
// TEMPLATE END: portfolio.service.ts.2.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.2.2.tpl
//===============================================================
public getComparisonRightSupplyGrid(
  scenarioId: number,
  params: any
): Observable<any> {
  return this.http.post<IRequestResponse<[]>>(this.END_POINT["portfolio"].ComparisonRightSupplyGrid+"/"+scenarioId.toString(), params);
}
//===============================================================
// TEMPLATE END: portfolio.service.ts.2.2.tpl
//===============================================================

/* GENCODE:MARKER:11:END */

/* GENCODE:MARKER:2:START */

//===============================================================
// TEMPLATE START: service.ts.2.1.tpl
//===============================================================
  public getLeftBarLineBudgetResultChart(
    scenarioId: number,
    params: any
  ): Observable<PortfolioResultChartData> {
    return this.http.post<PortfolioResultChartData>(this.END_POINT["portfolio"].LeftBarLineBudgetResultChart+"/"+scenarioId.toString(), params);
  }
//===============================================================
// TEMPLATE END: service.ts.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: service.ts.2.1.tpl
//===============================================================
  public getLeftStackedBarBudgetResultChart(
    scenarioId: number,
    params: any
  ): Observable<PortfolioResultChartData> {
    return this.http.post<PortfolioResultChartData>(this.END_POINT["portfolio"].LeftStackedBarBudgetResultChart+"/"+scenarioId.toString(), params);
  }
//===============================================================
// TEMPLATE END: service.ts.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: service.ts.2.1.tpl
//===============================================================
  public getLeftBarLineNPVResultChart(
    scenarioId: number,
    params: any
  ): Observable<PortfolioResultChartData> {
    return this.http.post<PortfolioResultChartData>(this.END_POINT["portfolio"].LeftBarLineNPVResultChart+"/"+scenarioId.toString(), params);
  }
//===============================================================
// TEMPLATE END: service.ts.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: service.ts.2.1.tpl
//===============================================================
  public getLeftStackedBarNPVResultChart(
    scenarioId: number,
    params: any
  ): Observable<PortfolioResultChartData> {
    return this.http.post<PortfolioResultChartData>(this.END_POINT["portfolio"].LeftStackedBarNPVResultChart+"/"+scenarioId.toString(), params);
  }
//===============================================================
// TEMPLATE END: service.ts.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: service.ts.2.1.tpl
//===============================================================
  public getLeftRadarElementResultChart(
    scenarioId: number,
    params: any
  ): Observable<PortfolioResultChartData> {
    return this.http.post<PortfolioResultChartData>(this.END_POINT["portfolio"].LeftRadarElementResultChart+"/"+scenarioId.toString(), params);
  }
//===============================================================
// TEMPLATE END: service.ts.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: service.ts.2.1.tpl
//===============================================================
  public getLeftStackedBarOSRiskResultChart(
    scenarioId: number,
    params: any
  ): Observable<PortfolioResultChartData> {
    return this.http.post<PortfolioResultChartData>(this.END_POINT["portfolio"].LeftStackedBarOSRiskResultChart+"/"+scenarioId.toString(), params);
  }
//===============================================================
// TEMPLATE END: service.ts.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: service.ts.2.1.tpl
//===============================================================
  public getLeftBarLineBudgetChart(
    scenarioId: number,
    params: any
  ): Observable<PortfolioResultChartData> {
    return this.http.post<PortfolioResultChartData>(this.END_POINT["portfolio"].LeftBarLineBudgetChart+"/"+scenarioId.toString(), params);
  }
//===============================================================
// TEMPLATE END: service.ts.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: service.ts.2.1.tpl
//===============================================================
  public getRightBarLineBudgetChart(
    scenarioId: number,
    params: any
  ): Observable<PortfolioResultChartData> {
    return this.http.post<PortfolioResultChartData>(this.END_POINT["portfolio"].RightBarLineBudgetChart+"/"+scenarioId.toString(), params);
  }
//===============================================================
// TEMPLATE END: service.ts.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: service.ts.2.1.tpl
//===============================================================
  public getLeftStackedBarBudgetChart(
    scenarioId: number,
    params: any
  ): Observable<PortfolioResultChartData> {
    return this.http.post<PortfolioResultChartData>(this.END_POINT["portfolio"].LeftStackedBarBudgetChart+"/"+scenarioId.toString(), params);
  }
//===============================================================
// TEMPLATE END: service.ts.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: service.ts.2.1.tpl
//===============================================================
  public getRightStackedBarBudgetChart(
    scenarioId: number,
    params: any
  ): Observable<PortfolioResultChartData> {
    return this.http.post<PortfolioResultChartData>(this.END_POINT["portfolio"].RightStackedBarBudgetChart+"/"+scenarioId.toString(), params);
  }
//===============================================================
// TEMPLATE END: service.ts.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: service.ts.2.1.tpl
//===============================================================
  public getLeftBarLineNPVChart(
    scenarioId: number,
    params: any
  ): Observable<PortfolioResultChartData> {
    return this.http.post<PortfolioResultChartData>(this.END_POINT["portfolio"].LeftBarLineNPVChart+"/"+scenarioId.toString(), params);
  }
//===============================================================
// TEMPLATE END: service.ts.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: service.ts.2.1.tpl
//===============================================================
  public getRightBarLineNPVChart(
    scenarioId: number,
    params: any
  ): Observable<PortfolioResultChartData> {
    return this.http.post<PortfolioResultChartData>(this.END_POINT["portfolio"].RightBarLineNPVChart+"/"+scenarioId.toString(), params);
  }
//===============================================================
// TEMPLATE END: service.ts.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: service.ts.2.1.tpl
//===============================================================
  public getLeftStackedBarNPVChart(
    scenarioId: number,
    params: any
  ): Observable<PortfolioResultChartData> {
    return this.http.post<PortfolioResultChartData>(this.END_POINT["portfolio"].LeftStackedBarNPVChart+"/"+scenarioId.toString(), params);
  }
//===============================================================
// TEMPLATE END: service.ts.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: service.ts.2.1.tpl
//===============================================================
  public getRightStackedBarNPVChart(
    scenarioId: number,
    params: any
  ): Observable<PortfolioResultChartData> {
    return this.http.post<PortfolioResultChartData>(this.END_POINT["portfolio"].RightStackedBarNPVChart+"/"+scenarioId.toString(), params);
  }
//===============================================================
// TEMPLATE END: service.ts.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: service.ts.2.1.tpl
//===============================================================
  public getLeftRadarElementChart(
    scenarioId: number,
    params: any
  ): Observable<PortfolioResultChartData> {
    return this.http.post<PortfolioResultChartData>(this.END_POINT["portfolio"].LeftRadarElementChart+"/"+scenarioId.toString(), params);
  }
//===============================================================
// TEMPLATE END: service.ts.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: service.ts.2.1.tpl
//===============================================================
  public getRightRadarElementChart(
    scenarioId: number,
    params: any
  ): Observable<PortfolioResultChartData> {
    return this.http.post<PortfolioResultChartData>(this.END_POINT["portfolio"].RightRadarElementChart+"/"+scenarioId.toString(), params);
  }
//===============================================================
// TEMPLATE END: service.ts.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: service.ts.2.1.tpl
//===============================================================
  public getLeftStackedBarOSRiskChart(
    scenarioId: number,
    params: any
  ): Observable<PortfolioResultChartData> {
    return this.http.post<PortfolioResultChartData>(this.END_POINT["portfolio"].LeftStackedBarOSRiskChart+"/"+scenarioId.toString(), params);
  }
//===============================================================
// TEMPLATE END: service.ts.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: service.ts.2.1.tpl
//===============================================================
  public getRightStackedBarOSRiskChart(
    scenarioId: number,
    params: any
  ): Observable<PortfolioResultChartData> {
    return this.http.post<PortfolioResultChartData>(this.END_POINT["portfolio"].RightStackedBarOSRiskChart+"/"+scenarioId.toString(), params);
  }
//===============================================================
// TEMPLATE END: service.ts.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.2.1.tpl
//===============================================================
public getPortfolioResultRejectedGroupBy(
  scenarioId: number,
  params: any
): Observable<any> {
  return this.http.post<IRequestResponse<[]>>(this.END_POINT["portfolio"].resultRejectedGroupBy+"/"+scenarioId.toString(), params);
}
//===============================================================
// TEMPLATE END: portfolio.service.ts.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.2.1.tpl
//===============================================================
public getPortfolioAlternateResultRejectedGroupBy(
  scenarioId: number,
  params: any
): Observable<any> {
  return this.http.post<IRequestResponse<[]>>(this.END_POINT["portfolio"].AlternateResultRejectedGroupBy+"/"+scenarioId.toString(), params);
}
//===============================================================
// TEMPLATE END: portfolio.service.ts.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.2.1.tpl
//===============================================================
public getPortfolioResultApprovedGroupBy(
  scenarioId: number,
  params: any
): Observable<any> {
  return this.http.post<IRequestResponse<[]>>(this.END_POINT["portfolio"].resultApprovedGroupBy+"/"+scenarioId.toString(), params);
}
//===============================================================
// TEMPLATE END: portfolio.service.ts.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.2.1.tpl
//===============================================================
public getPortfolioResultRejected(
  scenarioId: number,
  params: any
): Observable<any> {
  return this.http.post<IRequestResponse<[]>>(this.END_POINT["portfolio"].resultRejected+"/"+scenarioId.toString(), params);
}
//===============================================================
// TEMPLATE END: portfolio.service.ts.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.2.1.tpl
//===============================================================
public getPortfolioResultRejectedGroupBy2(
  scenarioId: number,
  params: any
): Observable<any> {
  return this.http.post<IRequestResponse<[]>>(this.END_POINT["portfolio"].resultRejectedGroupBy2+"/"+scenarioId.toString(), params);
}
//===============================================================
// TEMPLATE END: portfolio.service.ts.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.2.1.tpl
//===============================================================
public getPortfolioAlternateResultApprovedGroupBy2(
  scenarioId: number,
  params: any
): Observable<any> {
  return this.http.post<IRequestResponse<[]>>(this.END_POINT["portfolio"].AlternateResultApprovedGroupBy2+"/"+scenarioId.toString(), params);
}
//===============================================================
// TEMPLATE END: portfolio.service.ts.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.2.1.tpl
//===============================================================
public getPortfolioAlternateResultRejectedGroupBy2(
  scenarioId: number,
  params: any
): Observable<any> {
  return this.http.post<IRequestResponse<[]>>(this.END_POINT["portfolio"].AlternateResultRejectedGroupBy2+"/"+scenarioId.toString(), params);
}
//===============================================================
// TEMPLATE END: portfolio.service.ts.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.2.1.tpl
//===============================================================
public getPortfolioResultApprovedGroupBy2(
  scenarioId: number,
  params: any
): Observable<any> {
  return this.http.post<IRequestResponse<[]>>(this.END_POINT["portfolio"].resultApprovedGroupBy2+"/"+scenarioId.toString(), params);
}
//===============================================================
// TEMPLATE END: portfolio.service.ts.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: portfolio.service.ts.2.1.tpl
//===============================================================
public getPortfolioAlternateResultAlternate(
  scenarioId: number,
  params: any
): Observable<any> {
  return this.http.post<IRequestResponse<[]>>(this.END_POINT["portfolio"].resultAlternate+"/"+scenarioId.toString(), params);
}
//===============================================================
// TEMPLATE END: portfolio.service.ts.2.1.tpl
//===============================================================

/* GENCODE:MARKER:2:END */

public saveBudgetConfig(
  scenarioId: number,
  numberOfYears: number,
  params: any
): Observable<any> {
  return this.http.post<IRequestResponse<any>>(this.END_POINT["portfolio"].saveBudgetConfig+"/id="+scenarioId+"&noy="+numberOfYears, params);
}
  // public getList(
  //   params: Partial<IAipmPageParams>
  // ): Observable<IRequestResponse<{ items: IPortfolio[]; totalCount: number }>> {
  //   return of({
  //     entity: {
  //       items: [
  //         {
  //           id: 1,
  //           state: "Selangor",
  //           senarioName: "PortCostOp 2022-Rev3",
  //           revision: "Rev3",
  //           submittedDate: "4 Feb 20 22:04:14:00",
  //           comments: "123",
  //           status: "submitted",
  //         },
  //         {
  //           id: 3,
  //           state: "Selangor3",
  //           senarioName: "PortCostOp 2022-Rev3",
  //           revision: "Rev3",
  //           submittedDate: "4 Feb 20 22:04:14:00",
  //           comments: "123",
  //           status: "submitted3",
  //         },
  //         {
  //           id: 2,
  //           state: "Selangor2",
  //           senarioName: "PortCostOp 2022-Rev3",
  //           revision: "Rev3",
  //           submittedDate: "4 Feb 20 22:04:14:00",
  //           comments: "1232",
  //           status: "submitted2",
  //         },
  //       ],
  //       totalCount: 10,
  //     },
  //   } as any);
  // }

}
