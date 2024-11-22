public ##RESOLVEVAR(Token, 1)## = ##RESOLVEVAR(Token, 6)##();
public ##RESOLVEVAR(Token, 2)## = {
  'freeze': {
    'left': ##RESOLVEGRID(Config, FreezeLeft, 1)##, 
    'right':##RESOLVEGRID(Config, FreezeRight, 1)##
  },
  'format': {##ITERATEGRID(Formatlist, '!!!PARAM:1:!!!': { 'type': '!!!PARAM:2:!!!'!!!COMMA!!! 'format': '!!!PARAM:3:!!!' }!!!COMMA!!!, ["ColumnName":"DataType":"Format"])##
  },
  'mergeRule': ##RESOLVEGRID(Config, Merge, 1)##,
  'highlightRule': ##RESOLVEGRID(Config, Highlight, 1)##,
  'totalRule': ##RESOLVEGRID(Config,TotalRule, 1)##,
};
public ##RESOLVEVAR(Token, 3)##: any[];