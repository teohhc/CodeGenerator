fetch##BLOCK##() {
  this.portfolioSvc
    .get##BLOCK##(this.compareScenarioId, this.reqModel)
    .subscribe(response => {
      this.##RESOLVEGRID(Config, DataName, 1)## = response;
/* GENCODE:MARKER:10:START */

//===============================================================
// TEMPLATE START: InclusiveExclusive.ts.4.1.tpl
//===============================================================
        if (this.listOfMutually['rhs']) {
          delete this.listOfMutually['rhs'];
        }
        this.listOfMutually['rhs'] = {};
        for (var rec in this.ComparisonRightPrioritisedGrid ) {
          this.listOfMutually['rhs'][this.ComparisonRightPrioritisedGrid[rec].project_ID]=this.ComparisonRightPrioritisedGrid[rec];
        }
        var keys = this.compDict(this.listOfMutually['lhs'], this.listOfMutually['rhs']);

        // Inclusive
        if (this.listOfMutually['inclusive']) {
          delete this.listOfMutually['inclusive'];
        }
        this.listOfMutually['inclusive'] = [];
        for (var rec in keys['both']) {
          this.listOfMutually['inclusive'].push(keys['both'][rec]);
        }

        // Exclusive left
        if (this.listOfMutually['exclusiveLeft']) {
          delete this.listOfMutually['exclusiveLeft'];
        }
        this.listOfMutually['exclusiveLeft'] = [];
        for (var rec in keys['lhs']) {
          this.listOfMutually['exclusiveLeft'].push(keys['lhs'][rec]);
        }

        // Exclusive right
        if (this.listOfMutually['exclusiveRight']) {
          delete this.listOfMutually['exclusiveRight'];
        }
        this.listOfMutually['exclusiveRight'] = [];
        for (var rec in keys['rhs']) {
          this.listOfMutually['exclusiveRight'].push(keys['rhs'][rec]);
        }
//===============================================================
// TEMPLATE END: InclusiveExclusive.ts.4.1.tpl
//===============================================================

        /* GENCODE:MARKER:10:END */
    });
}