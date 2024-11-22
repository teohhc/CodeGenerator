  public get##BLOCK##(
    scenarioId: number,
    params: any
  ): Observable<PortfolioResultChartData> {
    return this.http.post<PortfolioResultChartData>(this.END_POINT["portfolio"].##BLOCK##+"/"+scenarioId.toString(), params);
  }