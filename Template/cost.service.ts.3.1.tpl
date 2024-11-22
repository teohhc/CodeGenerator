fetch##BLOCK##() {
  this.costSvc
    .get##BLOCK##(this.scenarioId, this.reqModel)
    .subscribe(response => {
      this.##BLOCK## = response;
    });
}