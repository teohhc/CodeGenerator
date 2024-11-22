fetch##BLOCK##() {
  this.portfolioSvc
    .get##BLOCK##(this.scenarioId, this.reqModel)
    .subscribe(response => {
      this.##RESOLVEVAR(Token, 3)## = response;
    });
}