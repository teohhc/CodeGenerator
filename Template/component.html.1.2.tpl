<div class="row">
    <div class="col-3">&nbsp;</div>
    <div class="col-7">
        <div style="width:100%;">
            <button class="btn btn-outline-primary float-button" (click)="downloadChart('##BLOCK##')">Download Chart</button>
            <button class="btn btn-outline-primary float-button" (click)="downloadExcel('##BLOCK##', this.##BLOCK##Data)">Download Excel</button>
        </div>
        <canvas ###BLOCK## id="##BLOCK##" height="250px"></canvas>
    </div>
    <div class="col-3">&nbsp;</div>
</div>