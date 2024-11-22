<ng-container>
    <div class="table382">
        <nz-table nzSize="small" ###RESOLVEVAR(Token, 2)## nzBordered nzShowSizeChanger [nzLoading]="loading" [nzData]="##RESOLVEVAR(Token, 1)##" [nzFrontPagination]="false" [nzScroll]="{ x: '0', y: '300px' }">
            <thead>
                <tr>
                    <th nzLeft nzWidth="35px">No.</th>
                    <ng-container *ngFor="let tableColumnData of resultInclusiveExclusiveTableColumns">
                        <!--Freeze Panels-->
                        <th nzLeft title="{{tableColumnData.toolTip}}" *ngIf="tableColumnData.display  && tableColumnData.isSortable && (tableColumnData.columnName=='projectDefinition' || tableColumnData.columnName=='udProjectDescription')" [nzSortOrder]=null (nzSortOrderChange)="sortChange($event, tableColumnData?.columnName)" [nzSortDirections]="['ascend', 'descend']" nzWidth="{{tableColumnData.columnWidth}}">
                        <app-custom-table-filter *ngIf="tableColumnData.isSearchable" [customFilter]="customFilter" [column]="tableColumnData" (emitRefreshTableAction)="refreshTable(tableColumnData,$event,true)"></app-custom-table-filter>
                        {{ tableColumnData.displayName }}
                        </th>
                        <th nzLeft title="{{tableColumnData.toolTip}}" *ngIf="tableColumnData.display && !tableColumnData.isSortable && (tableColumnData.columnName=='projectDefinition' || tableColumnData.columnName=='udProjectDescription')" nzWidth="{{tableColumnData.columnWidth}}">
                            <app-custom-table-filter *ngIf="tableColumnData.isSearchable" [column]="tableColumnData" (emitRefreshTableAction)="refreshTable(tableColumnData,$event,true)"></app-custom-table-filter>
                            {{ tableColumnData.displayName }}
                        </th>
                        <!--Freeze Panels-->

                        <th title="{{tableColumnData.toolTip}}" *ngIf="tableColumnData.display  && tableColumnData.isSortable && tableColumnData.columnName!='projectDefinition' && tableColumnData.columnName!='udProjectDescription'" [nzSortOrder]=null (nzSortOrderChange)="sortChange($event, tableColumnData?.columnName)" [nzSortDirections]="['ascend', 'descend']" nzWidth="{{tableColumnData.columnWidth}}">
                        <app-custom-table-filter *ngIf="tableColumnData.isSearchable" [column]="tableColumnData" (emitRefreshTableAction)="refreshTable(tableColumnData,$event,true)"></app-custom-table-filter>
                        {{ tableColumnData.displayName }}
                        </th>
                        <th title="{{tableColumnData.toolTip}}" *ngIf="tableColumnData.display && !tableColumnData.isSortable && tableColumnData.columnName!='projectDefinition' && tableColumnData.columnName!='udProjectDescription'" nzWidth="{{tableColumnData.columnWidth}}">
                            <app-custom-table-filter *ngIf="tableColumnData.isSearchable" [column]="tableColumnData" (emitRefreshTableAction)="refreshTable(tableColumnData,$event,true)"></app-custom-table-filter>
                            {{ tableColumnData.displayName }}
                        </th>
                    </ng-container>
                </tr>
            </thead>
            <tbody>
                <tr *ngFor="let item of ##RESOLVEVAR(Token, 2)##.data; let i = index;">
                    <td nzLeft>{{ i + 1 }}.</td>
                    <td nzLeft>{{ item.projectDefinition }}</td>
                    <td nzLeft>{{ item.udProjectDescription }}</td>
                    <td>{{ item.udStrategicObjective }}</td>
                    <td>{{ item.subObjectiveDdl }}</td>
                    <td>{{ item.udCategory }}</td>
                    <td>{{ item.udProjectType }}</td>
                    <td>{{ item.udVoltagekV }}</td>
                    <td>{{ item.stateName }}</td>
                    <td>{{ item.businessAreaName }}</td>
                    <td>{{ item.budgetBeforeRevised | number:'1.2-2' }}</td>
                    <td>{{ item.totalBudget | number:'1.2-2' }}</td>
                    <td>{{ item.risk_Reduced | number:'1.2-2' }}</td>
                    <td>{{ item.tcO_Opex | number:'1.2-2' }}</td>
                    <td>{{ item.tcO_TotalProjectCost | number:'1.2-2' }}</td>
                    <td>{{ item.npvRiskReduced | number:'1.2-2' }}</td>
                    <td>{{ item.project_Score | number:'1.3-3' }}</td>
                    <td>{{ item.month_Scope_1 }}</td>
                    <!-- <td *ngIf="item.start_Month_Scope_1 == null"></td>
                    <td *ngIf="item.start_Month_Scope_1 != null">{{ item.start_Month_Scope_1 | date:'MMM yyyy' }}</td> -->
                    <td>{{ item.start_Month_Scope_1 | date:'MMM yyyy' }}</td>
                    <td>{{ item.month_Scope_2 }}</td>
                    <td>{{ item.start_Month_Scope_2 | date:'MMM yyyy' }}</td>
                    <td>{{ item.month_Scope_3 }}</td>
                    <td>{{ item.start_Month_Scope_3 | date:'MMM yyyy' }}</td>
                    <td>{{ item.month_Scope_4 }}</td>
                    <td>{{ item.start_Month_Scope_4 | date:'MMM yyyy' }}</td>
                    <td>{{ item.comm_Month | date:'MMM yyyy' }}</td>
                    <td>{{ item.target_Comm_Month | date:'MMM yyyy' }}</td>
                    <td>{{ item.mandatory }}</td>
                    <td>{{ item.budY1 | number:'1.2-2' }}</td>
                    <td>{{ item.budY2 | number:'1.2-2' }}</td>
                    <td>{{ item.budY3 | number:'1.2-2' }}</td>
                    <td>{{ item.budY4 | number:'1.2-2' }}</td>
                    <td>{{ item.budY5 | number:'1.2-2' }}</td>
                    <td>{{ item.budY6 | number:'1.2-2' }}</td>
                    <td>{{ item.budY7 | number:'1.2-2' }}</td>
                    <td>{{ item.budY8 | number:'1.2-2' }}</td>
                </tr>
            </tbody>
        </nz-table>
    </div>
</ng-container>