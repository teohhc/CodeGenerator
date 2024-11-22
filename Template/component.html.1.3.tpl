<nz-collapse-panel nzHeader="##RESOLVE(Title, TitleText, 1)##" nzShowArrow="false" nzActive="true">
<app-tablegrid [title]="##RESOLVE(Title, TitleText, 2)##" 
[freezeLeftList]="##RESOLVEVAR(Token, 3)##['freeze']['left']" [freezeRightList]="##RESOLVEVAR(Token, 3)##['freeze']['right']"
[itemlist]="##RESOLVEVAR(Token, 2)##" [formatList]="##RESOLVEVAR(Token, 3)##['format']"
[columnHeader]="##RESOLVEVAR(Token, 1)##" [mergeRule]="##RESOLVEVAR(Token, 3)##['mergeRule']" [seq]="false" [loading]="loading"
(eventTriggered)="onTableGridEvent($event)"></app-tablegrid>
</nz-collapse-panel>