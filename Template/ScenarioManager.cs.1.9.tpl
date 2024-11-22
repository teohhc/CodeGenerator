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
                var token = row.##RESOLVEDATA(Fieldlist, FieldName, 2)##==null?"null":row.##RESOLVEDATA(Fieldlist, FieldName, 2)##;
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

            double? ##RESOLVEDATA(Fieldlist, FieldName, 3)##Total = null;
            var dataModel = new ##RESOLVEDATA(Datapoint, FunctionName, 1)##Datasets();
            dataModel.yAxisID = "##RESOLVE(Title, YAxes1ID, 1)##";
            dataModel.Type = "line";
            dataModel.Fill = false;
            dataModel.BorderWidth = 0;
            dataModel.BackgroundColor = legendColorArray[0];

            //dataModel.BackgroundColor = legendColorArray[0];
            foreach (var row in summaryData)
            {
                var token = row.##RESOLVEDATA(Fieldlist, FieldName, 2)##==null?"null":row.##RESOLVEDATA(Fieldlist, FieldName, 2)##;
                dataModel.Data.Add((double)decimal.Parse(row.##RESOLVEDATA(Fieldlist, FieldName, 3)##==null?"0.00":row.##RESOLVEDATA(Fieldlist, FieldName, 3)##.Value.ToString("0.00")) );
            }
            //add Bar Chart Data Model to Bar Chart Model
            barChartModel.Datasets.Add(dataModel);

            var allData = new ##RESOLVEDATA(Datapoint, FunctionName, 1)##ChartModel
            {
                Labels = barChartModel.Labels,
                Datasets = barChartModel.Datasets,
                SQLData = summaryData.ToList()
            };

            return allData;
        }