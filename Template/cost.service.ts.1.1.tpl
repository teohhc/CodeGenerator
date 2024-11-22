    public ##BLOCK##: any[];

    public ##RESOLVEGRID(Config, ColHdrName, 1)## = hdrDef##RESOLVEGRID(Config, ColHdrName, 1)##();
    public ##RESOLVEGRID(Config, RuleName, 1)## = {
      'freeze': {
        'left': ##RESOLVEGRID(Config, FreezeLeft, 1)##, 
        'right':##RESOLVEGRID(Config, FreezeRight, 1)##
      },
      'format': {##ITERATEGRID(Formatlist, '!!!PARAM:1:!!!': { 'type': '!!!PARAM:2:!!!'!!!COMMA!!! 'format': '!!!PARAM:3:!!!' }!!!COMMA!!!, ["ColumnName":"DataType":"Format"])##
      },
      'mergeRule': ##RESOLVEGRID(Config, Merge, 1)##,
      'highlightRule': ##RESOLVEGRID(Config, Highlight, 1)##
    };