    public compDict(dict1, dict2) {
      var all = Object.assign({}, dict1, dict2);
    
      var both = {};
      var lhs = {};
      var rhs = {};
      for (var key in all) {
        if (key in dict1 && key in dict2) {
            both[key] = dict1[key];
        } else {
          if (key in dict1) {
            lhs[key] = dict1[key];
          } else if (key in dict2) {
            rhs[key] = dict2[key];
          }
        }
      }
      return {
        'both': both,
        'lhs': lhs,
        'rhs': rhs
      }
    }