<app-tablegrid [title]="##RESOLVEGRID(Config, GridTitle, 1)##" 
[freezeLeftList]="##RESOLVEGRID(Config, RuleName, 1)##['freeze']['left']" [freezeRightList]="##RESOLVEGRID(Config, RuleName, 1)##['freeze']['right']"
[itemlist]="##RESOLVEGRID(Config, DataName, 1)##" [formatList]="##RESOLVEGRID(Config, RuleName, 1)##['format']"
[columnHeader]="##RESOLVEGRID(Config, ColHdrName, 1)##" [mergeRule]="##RESOLVEGRID(Config, RuleName, 1)##['mergeRule']" [seq]="##RESOLVEGRID(Config, Sequence, 1)##" [loading]="##RESOLVEGRID(Config, Loading, 1)##"
[total]="##RESOLVEGRID(Config, Total, 1)##" [totalRule]="##RESOLVEGRID(Config, RuleName, 1)##['totalRule']"
(eventTriggered)="onTableGridEvent($event)" [highlightRule]="##RESOLVEGRID(Config, RuleName, 1)##['highlightRule']"
[actionRule]="##RESOLVEGRID(Config, RuleName, 1)##['actionRule']"></app-tablegrid>
