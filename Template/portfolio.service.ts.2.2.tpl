public get##BLOCK##(
  scenarioId: number,
  params: any
): Observable<any> {
  return this.http.post<IRequestResponse<[]>>(this.END_POINT["portfolio"].##BLOCK##+"/"+scenarioId.toString(), params);
}