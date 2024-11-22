        public static async Task<##RESOLVEDATA(Datapoint, FunctionName, 1)##ChartModel> Get##BLOCK##(int scenarioId, AipmPortfolioResultFilter filter)
        {
            var summaryData = await ##RESOLVEDATA(Datapoint, FunctionName, 1)##(scenarioId, filter);
            var barChartModel = new ##RESOLVEDATA(Datapoint, FunctionName, 1)##InternalChartModel();
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
                var token = row.##RESOLVEDATA(Fieldlist, FieldName, 1)##==null?"null":row.##RESOLVEDATA(Fieldlist, FieldName, 1)##;
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

            var dataModel = new ##RESOLVEDATA(Datapoint, FunctionName, 1)##Datasets();
            double? ##RESOLVEDATA(Fieldlist, FieldName, 3)##Total = null;
            dataModel.yAxisID = "##RESOLVE(Title, YAxes1ID, 1)##";
            dataModel.Type = "bar";
            foreach (var legend in legendArray) {
                foreach (var p in summaryData.Where(p => (p.##RESOLVEDATA(Fieldlist, FieldName, 1)##==null?"null":p.##RESOLVEDATA(Fieldlist, FieldName, 1)##) == legend.Key)) {
                    var token = p.##RESOLVEDATA(Fieldlist, FieldName, 1)##==null?"null":p.##RESOLVEDATA(Fieldlist, FieldName, 1)##;
                    dataModel.Data.Add((double)decimal.Parse(p.##RESOLVEDATA(Fieldlist, FieldName, 3)##==null?"0.00":p.##RESOLVEDATA(Fieldlist, FieldName, 3)##.Value.ToString("0.00")) );
                    ##RESOLVEDATA(Fieldlist, FieldName, 3)##Total = ##RESOLVEDATA(Fieldlist, FieldName, 3)##Total == null ? (p.##RESOLVEDATA(Fieldlist, FieldName, 3)##==null? 0.0: p.##RESOLVEDATA(Fieldlist, FieldName, 3)##.Value) : (##RESOLVEDATA(Fieldlist, FieldName, 3)##Total + (p.##RESOLVEDATA(Fieldlist, FieldName, 3)## == null ? 0.0 : p.##RESOLVEDATA(Fieldlist, FieldName, 3)##.Value));
                    dataModel.BackgroundColor.Add(legendColorArray[labelArray[token]]);
                }
            }
            //add Bar Chart Data Model to Bar Chart Model
            barChartModel.Datasets.Add(dataModel);

            var lineChart = new ##RESOLVEDATA(Datapoint, FunctionName, 1)##Datasets
            {
                yAxisID = "##RESOLVE(Title, YAxes2ID, 1)##",
                //Label = "Total ##RESOLVEDATA(Fieldlist, FieldName, 3)##",
                Type = "line",
                Fill = false
                //BackgroundColor = "rgb(255, 159, 64)"
            };
            foreach (var legend in legendArray) {
                lineChart.Data.Add((double)decimal.Parse(##RESOLVEDATA(Fieldlist, FieldName, 3)##Total==null?"0.00":##RESOLVEDATA(Fieldlist, FieldName, 3)##Total.Value.ToString("0.00")) );
                lineChart.BackgroundColor.Add("rgba(201, 203, 207, 0.2)");
            }
            
            barChartModel.Datasets.Add(lineChart);

            var allData = new ##RESOLVEDATA(Datapoint, FunctionName, 1)##ChartModel
            {
                Labels = barChartModel.Labels,
                Datasets = barChartModel.Datasets,
                SQLData = summaryData.ToList()
            };

            return allData;
        }