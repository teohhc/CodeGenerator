<app-tablegrid [title]="##RESOLVEGRID(Config, GridTitle, 1)##" 
[freezeLeftList]="##RESOLVEVAR(Token, 2)##['freeze']['left']" [freezeRightList]="##RESOLVEVAR(Token, 2)##['freeze']['right']"
[itemlist]="##RESOLVEVAR(Token, 3)##" [formatList]="##RESOLVEVAR(Token, 2)##['format']"
[columnHeader]="##RESOLVEVAR(Token, 1)##" [mergeRule]="##RESOLVEVAR(Token, 2)##['mergeRule']" [seq]="##RESOLVEGRID(Config, Sequence, 1)##" [loading]="##RESOLVEGRID(Config, Loading, 1)##"
[total]="##RESOLVEGRID(Config, Total, 1)##"
(eventTriggered)="onTableGridEvent($event)"></app-tablegrid>