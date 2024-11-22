  fetch##BLOCK##() {
    this.loading = true;
    this.type = "original";
    if (this.type == "original") {
      this.portfolioSvc.get##BLOCK##(this.##RESOLVEVAR(Token, 1)##, this.reqModel)
        .subscribe(result => {
          this.compared = true;
          this.loading = false;
          this.##BLOCK##Data = result;
          this.do##BLOCK##();
        });
    } else if (this.type == "alternative") {
      this.portfolioSvc.get##BLOCK##(this.##RESOLVEVAR(Token, 1)##, this.reqModel)
        .subscribe(result => {
          this.compared = true;
          this.loading = false;
          this.##BLOCK##Data = result;
          this.do##BLOCK##();
        });
    }
  }