public ##RESOLVEVAR(Token, 8)##(
  scenarioId: number,
  params: any
): Observable<any> {
  return this.http.post<IRequestResponse<[]>>(this.END_POINT["portfolio"].##RESOLVEVAR(Token, 7)##+"/"+scenarioId.toString(), params);
}