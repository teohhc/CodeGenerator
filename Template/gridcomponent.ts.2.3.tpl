fetch##BLOCK##() {
  //for compare
  this.portfolioSvc
    .get##RESOLVEVAR(Token, 8)##(this.compareScenarioId, this.reqModel)
    .subscribe(response => {
      this.##RESOLVEVAR(Token, 3)## = response;
    });
}