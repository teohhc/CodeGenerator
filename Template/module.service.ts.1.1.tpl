public get##BLOCK##(
  scenarioId: number,
  params: any
): Observable<any> {
  return this.http.post<IRequestResponse<[]>>(`/##RESOLVEDATA(URI, Endpoint, 1)##/##RESOLVEDATA(Datapoint, FunctionName, 1)##/${scenarioId}`, params);
}