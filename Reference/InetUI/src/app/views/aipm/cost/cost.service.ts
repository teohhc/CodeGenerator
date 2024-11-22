import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AipmFilterRequestModel, IRequestResponse } from '../aipm.interface';
import { AipmCostResultTableUpdate } from './cost.interface';

@Injectable({
    providedIn: 'root'
})
export class AipmCostService {

    private END_POINT = {
        duration: {
            table: `/AipmCostOptimizationScenario/RunChartDurationTable`,
        },
        budget: {
            table: `/AipmCostOptimizationScenario/RunChartBudgetTable`,
        },
    };

    constructor(
        private readonly http: HttpClient,
    ) { }

/* GENCODE:MARKER:1:START */

//===============================================================
// TEMPLATE START: module.service.ts.1.1.tpl
//===============================================================
public getSceEvalRiskAssesFinalResultSimulGrid(
  scenarioId: number,
  params: any
): Observable<any> {
  return this.http.post<IRequestResponse<[]>>(`/AipmCostOptimizationScenario/SceEvalRiskAssesFinalResultSimulGrid/${scenarioId}`, params);
}
//===============================================================
// TEMPLATE END: module.service.ts.1.1.tpl
//===============================================================

/* GENCODE:MARKER:1:END */

    public getChartTableData(type: "duration" | "budget", id: number, params): Observable<any> {
        return this.http.post<IRequestResponse<any>>(`${this.END_POINT[type].table}/${id}`, params);
    }

    public updateChartTableData(payload: AipmCostResultTableUpdate[]): Observable<any> {
        return this.http.post<IRequestResponse<any>>(`/AipmCostOptimizationScenario/RunChartBudgetTableUpdate`, payload);
    }

    public getProjectChart(scenarioId: number, params): Observable<any> {
        return this.http.post<any>(`/AipmCostOptimizationScenario/RunChart/${scenarioId}`, params)
    }

    public getFilters(): Observable<any> {
        return this.http.post<any>(`/AipmFilter/Filters`, {})
    }

    public getHistogramProjectList(params): Observable<any> {
        return this.http.post<any>(`/AipmCostOptimizationScenario/HistogramProjectList`, params);
    }

    public configChart(params: AipmFilterRequestModel, type: "budget" | 'duration'): Observable<any> {

        let url = `/AipmCostOptimizationScenario/ConfigBudgetChart`;

        if (type == "duration")
            url = `/AipmCostOptimizationScenario/ConfigDurationChart`;

        return this.http.post<any>(url, params)
    }

}