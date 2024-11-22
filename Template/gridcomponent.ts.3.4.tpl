fetch##BLOCK##() {
  this.portfolioSvc
    .get##BLOCK##(this.compareScenarioId, this.reqModel)
    .subscribe(response => {
      this.##RESOLVEGRID(Config, DataName, 1)## = response;
    });
}