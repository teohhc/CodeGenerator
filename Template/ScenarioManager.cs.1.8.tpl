        public static async Task<##RESOLVEDATA(Datapoint, FunctionName, 1)##ChartModel> Get##BLOCK##(int scenarioId, AipmPortfolioResultFilter filter)
        {
            var summaryData = await ##RESOLVEDATA(Datapoint, FunctionName, 1)##(scenarioId, filter);
            var barChartModel = new ##RESOLVEDATA(Datapoint, FunctionName, 1)##ChartModel();
            // Get uniq labels
            Dictionary<string, int> fieldArray = new Dictionary<string, int>();
            var i=0;
            foreach (var row in summaryData)
            {
                var value = 0;
                var token = row.##RESOLVEDATA(Fieldlist, FieldName, 1)##==null? "null":row.##RESOLVEDATA(Fieldlist, FieldName, 1)##;
                bool hasValue = fieldArray.TryGetValue(token, out value);
                if (!hasValue) {
                    fieldArray.Add(token, i);
                    i++;
                }
            }

            // Add uniq labels to the chart
            foreach (var row in fieldArray)
            {
                barChartModel.Labels.Add(row.Key);
            }
            //barChartModel.Labels.Add("##RESOLVE(Title, XAxes1, 1)##");

            foreach (var row in fieldArray)
            {
                var dataModel = new ##RESOLVEDATA(Datapoint, FunctionName, 1)##Datasets();
                dataModel.Type = "bar";
                foreach (var p in summaryData.Where(p => ((p.##RESOLVEDATA(Fieldlist, FieldName, 1)##==null? "null": p.##RESOLVEDATA(Fieldlist, FieldName, 1)##) == row.Key)))
                {
                    dataModel.Start.Add(p.##RESOLVEDATA(Fieldlist, FieldName, 3)##==null? "":p.##RESOLVEDATA(Fieldlist, FieldName, 3)##);
                    dataModel.End.Add(p.##RESOLVEDATA(Fieldlist, FieldName, 4)##==null? "":p.##RESOLVEDATA(Fieldlist, FieldName, 4)##);
                    dataModel.Label = p.##RESOLVEDATA(Fieldlist, FieldName, 1)##==null? "null":p.##RESOLVEDATA(Fieldlist, FieldName, 1)##;
                    switch (fieldArray[p.##RESOLVEDATA(Fieldlist, FieldName, 1)##==null ? "null" : p.##RESOLVEDATA(Fieldlist, FieldName, 1)##]) {
                        case 0:
                            dataModel.BackgroundColor = "##RESOLVE(Legend, BackgroundColor, 1)##";
                            break;
    
                        case 1:
                            dataModel.BackgroundColor = "##RESOLVE(Legend, BackgroundColor, 2)##";
                            break;
    
                        case 2:
                            dataModel.BackgroundColor = "##RESOLVE(Legend, BackgroundColor, 3)##";
                            break;
    
                        case 3:
                            dataModel.BackgroundColor = "##RESOLVE(Legend, BackgroundColor, 4)##";
                            break;
    
                        case 4:
                            dataModel.BackgroundColor = "##RESOLVE(Legend, BackgroundColor, 5)##";
                            break;
    
                        case 5:
                            dataModel.BackgroundColor = "##RESOLVE(Legend, BackgroundColor, 6)##";
                            break;
    
                        case 6:
                            dataModel.BackgroundColor = "##RESOLVE(Legend, BackgroundColor, 7)##";
                            break;
    
                        case 7:
                            dataModel.BackgroundColor = "##RESOLVE(Legend, BackgroundColor, 8)##";
                            break;
                    }
                }

                //add Bar Chart Data Model to Bar Chart Model
                barChartModel.Datasets.Add(dataModel);
            }

            var allData = new ##RESOLVEDATA(Datapoint, FunctionName, 1)##ChartModel
            {
                Labels = barChartModel.Labels,
                Datasets = barChartModel.Datasets,
                SQLData = summaryData.ToList()
            };

            return allData;
        }