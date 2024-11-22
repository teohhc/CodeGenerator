        public static async Task<##RESOLVEDATA(Datapoint, FunctionName, 1)##ChartModel> Get##BLOCK##(int scenarioId, AipmPortfolioResultFilter filter)
        {
            var summaryData = await ##RESOLVEDATA(Datapoint, FunctionName, 1)##(scenarioId, filter);
            var barChartModel = new ##RESOLVEDATA(Datapoint, FunctionName, 1)##ChartModel();
            // Get uniq labels
            Dictionary<string, int> labelArray = new Dictionary<string, int>();
            var lblIdx=0;
            foreach (var row in summaryData)
            {
                var value = 0;
                var token = row.##RESOLVEDATA(Fieldlist, FieldName, 1)##==null?"null":row.##RESOLVEDATA(Fieldlist, FieldName, 1)##;
                bool hasValue = labelArray.TryGetValue(token, out value);
                if (!hasValue) {
                    labelArray.Add(token, lblIdx);
                    lblIdx++;
                }
            }

            // Add uniq labels to the chart
            foreach (var row in labelArray)
            {
                barChartModel.Labels.Add(row.Key);
            }

            // Get uniq legend
            Dictionary<string, int> legendArray = new Dictionary<string, int>();
            var lgdIdx=0;
            foreach (var row in summaryData)
            {
                var value = 0;
                var token = row.##RESOLVEDATA(Fieldlist, FieldName, 2)##==null?"null":row.##RESOLVEDATA(Fieldlist, FieldName, 2)##;
                bool hasValue = legendArray.TryGetValue(token, out value);
                if (!hasValue) {
                    legendArray.Add(token, lgdIdx);
                    lgdIdx++;
                }
            }

            Dictionary<int, string> legendColorArray = new Dictionary<int, string>();
            int lclIdx=0;
            ##ITERATETHEMES(Colourset, legendColorArray.Add(lclIdx++!!!COMMA!!! !!!PARAMDQUOTE:1:!!!);, ["Colour"])##

            Dictionary<int, string> legendBorderColorArray = new Dictionary<int, string>();
            int lbclIdx=0;
            ##ITERATETHEMES(Colourset, legendBorderColorArray.Add(lbclIdx++!!!COMMA!!! !!!PARAMDQUOTE:1:!!!);, ["BorderColor"])##

            foreach (var legend in legendArray) {
                var dataModel = new ##RESOLVEDATA(Datapoint, FunctionName, 1)##Datasets();
                foreach (var p in summaryData.Where(p => (p.##RESOLVEDATA(Fieldlist, FieldName, 2)##==null?"null":p.##RESOLVEDATA(Fieldlist, FieldName, 2)##) == legend.Key)) {
                    var token = p.##RESOLVEDATA(Fieldlist, FieldName, 2)##==null?"null":p.##RESOLVEDATA(Fieldlist, FieldName, 2)##;
                    dataModel.Data.Add((double)decimal.Parse(p.##RESOLVEDATA(Fieldlist, FieldName, 3)##==null?"0.00":p.##RESOLVEDATA(Fieldlist, FieldName, 3)##.Value.ToString("0.00")) );
                    dataModel.Label = p.##RESOLVEDATA(Fieldlist, FieldName, 2)##==null?"null":p.##RESOLVEDATA(Fieldlist, FieldName, 2)##;
                    dataModel.BorderWidth = 1;
                    dataModel.CategoryPercentage = 0.5;
                    dataModel.Fill = true;
                    dataModel.BackgroundColor = legendColorArray[legendArray[token]];
                    dataModel.BorderColor = legendBorderColorArray[legendArray[token]];
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