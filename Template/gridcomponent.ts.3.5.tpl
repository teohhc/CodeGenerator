fetch##BLOCK##() {
  this.portfolioSvc
    .get##BLOCK##(this.scenarioId, this.reqModel)
    .subscribe(response => {
      this.##RESOLVEGRID(Config, DataName, 1)## = response;
      if (this.listOfMutually['lhs']) {
          delete this.listOfMutually['lhs'];
        }
        this.listOfMutually['lhs'] = {};
        for (var rec in this.listOfApproved) {
          this.listOfMutually['lhs'][this.listOfApproved[rec].project_ID]=this.listOfApproved[rec];
        }
    });
}