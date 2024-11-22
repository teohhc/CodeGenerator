##RESOLVEVAR(Token, 4)##() {
  this.portfolioSvc
    .##RESOLVEVAR(Token, 8)##(this.##RESOLVEVAR(Token, 5)##, this.reqModel)
    .subscribe(response => {
      this.##RESOLVEVAR(Token, 3)## = response;
    });
}