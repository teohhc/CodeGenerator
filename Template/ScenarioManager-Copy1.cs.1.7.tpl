        public static async Task<AipmPortfolioResultBarNLineChartModel> Get##BLOCK##(int scenarioId, AipmPortfolioResultFilter filter)
        {
            var summaryData = await ##RESOLVEDATA(Datapoint, FunctionName, 1)##(scenarioId, filter);
            var barChartModel = new AipmPortfolioResultBarChartModel();
            // Get uniq labels
            Dictionary<string, int> fieldArray = new Dictionary<string, int>();
            var i=0;
            foreach (var row in summaryData)
            {
                var value = 0;
                var token=row.##RESOLVEDATA(Fieldlist, FieldName, 1)##==null? "null": row.##RESOLVEDATA(Fieldlist, FieldName, 1)##.ToString();
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

            double? ##RESOLVEDATA(Fieldlist, FieldName, 3)##Total = null;
            foreach (var row in summaryData)
            {
                var dataModel = new AipmPortfolioResultBarChartDataModel();
                dataModel.yAxisID = "##RESOLVE(Title, YAxes1ID, 1)##";
                dataModel.Type = "bar";
                switch (row.##RESOLVEDATA(Fieldlist, FieldName, 2)##)
                {
                    case 0:
                        dataModel.Label = row.##RESOLVEDATA(Fieldlist, FieldName, 1)##==null? "null":row.##RESOLVEDATA(Fieldlist, FieldName, 1)##;
                        dataModel.Data.Add((double)decimal.Parse(row.##RESOLVEDATA(Fieldlist, FieldName, 3)##==null?"0.00":row.##RESOLVEDATA(Fieldlist, FieldName, 3)##.Value.ToString("0.00")) );
                        dataModel.BackgroundColor = "##RESOLVE(Legend, BackgroundColor, 1)##";
                        break;

                    case 1:
                        dataModel.Label = row.##RESOLVEDATA(Fieldlist, FieldName, 1)##==null? "null":row.##RESOLVEDATA(Fieldlist, FieldName, 1)##;
                        dataModel.Data.Add((double)decimal.Parse(row.##RESOLVEDATA(Fieldlist, FieldName, 3)##==null?"0.00":row.##RESOLVEDATA(Fieldlist, FieldName, 3)##.Value.ToString("0.00")) );
                        dataModel.BackgroundColor = "##RESOLVE(Legend, BackgroundColor, 2)##";
                        break;

                    case 2:
                        dataModel.Label = row.##RESOLVEDATA(Fieldlist, FieldName, 1)##==null? "null":row.##RESOLVEDATA(Fieldlist, FieldName, 1)##;
                        dataModel.Data.Add((double)decimal.Parse(row.##RESOLVEDATA(Fieldlist, FieldName, 3)##==null?"0.00":row.##RESOLVEDATA(Fieldlist, FieldName, 3)##.Value.ToString("0.00")) );
                        dataModel.BackgroundColor = "##RESOLVE(Legend, BackgroundColor, 3)##";
                        break;

                    case 3:
                        dataModel.Label = row.##RESOLVEDATA(Fieldlist, FieldName, 1)##==null? "null":row.##RESOLVEDATA(Fieldlist, FieldName, 1)##;
                        dataModel.Data.Add((double)decimal.Parse(row.##RESOLVEDATA(Fieldlist, FieldName, 3)##==null?"0.00":row.##RESOLVEDATA(Fieldlist, FieldName, 3)##.Value.ToString("0.00")) );
                        dataModel.BackgroundColor = "##RESOLVE(Legend, BackgroundColor, 4)##";
                        break;

                    case 4:
                        dataModel.Label = row.##RESOLVEDATA(Fieldlist, FieldName, 1)##==null? "null":row.##RESOLVEDATA(Fieldlist, FieldName, 1)##;
                        dataModel.Data.Add((double)decimal.Parse(row.##RESOLVEDATA(Fieldlist, FieldName, 3)##==null?"0.00":row.##RESOLVEDATA(Fieldlist, FieldName, 3)##.Value.ToString("0.00")) );
                        dataModel.BackgroundColor = "##RESOLVE(Legend, BackgroundColor, 5)##";
                        break;

                    case 5:
                        dataModel.Label = row.##RESOLVEDATA(Fieldlist, FieldName, 1)##==null? "null":row.##RESOLVEDATA(Fieldlist, FieldName, 1)##;
                        dataModel.Data.Add((double)decimal.Parse(row.##RESOLVEDATA(Fieldlist, FieldName, 3)##==null?"0.00":row.##RESOLVEDATA(Fieldlist, FieldName, 3)##.Value.ToString("0.00")) );
                        dataModel.BackgroundColor = "##RESOLVE(Legend, BackgroundColor, 6)##";
                        break;

                    case 6:
                        dataModel.Label = row.##RESOLVEDATA(Fieldlist, FieldName, 1)##==null? "null":row.##RESOLVEDATA(Fieldlist, FieldName, 1)##;
                        dataModel.Data.Add((double)decimal.Parse(row.##RESOLVEDATA(Fieldlist, FieldName, 3)##==null?"0.00":row.##RESOLVEDATA(Fieldlist, FieldName, 3)##.Value.ToString("0.00")) );
                        dataModel.BackgroundColor = "##RESOLVE(Legend, BackgroundColor, 7)##";
                        break;

                    case 7:
                        dataModel.Label = row.##RESOLVEDATA(Fieldlist, FieldName, 1)##==null? "null":row.##RESOLVEDATA(Fieldlist, FieldName, 1)##;
                        dataModel.Data.Add((double)decimal.Parse(row.##RESOLVEDATA(Fieldlist, FieldName, 3)##==null?"0.00":row.##RESOLVEDATA(Fieldlist, FieldName, 3)##.Value.ToString("0.00")) );
                        dataModel.BackgroundColor = "##RESOLVE(Legend, BackgroundColor, 8)##";
                        break;
                }

                //add Bar Chart Data Model to Bar Chart Model
                barChartModel.Datasets.Add(dataModel);
                ##RESOLVEDATA(Fieldlist, FieldName, 3)##Total = ##RESOLVEDATA(Fieldlist, FieldName, 3)##Total == null ? (row.##RESOLVEDATA(Fieldlist, FieldName, 3)##==null? 0.0: row.##RESOLVEDATA(Fieldlist, FieldName, 3)##.Value) : (##RESOLVEDATA(Fieldlist, FieldName, 3)##Total + (row.##RESOLVEDATA(Fieldlist, FieldName, 3)## == null ? 0.0 : row.##RESOLVEDATA(Fieldlist, FieldName, 3)##.Value));
            }

            var lineChart = new AipmPortfolioResultBarChartDataModel
            {
                yAxisID = "##RESOLVE(Title, YAxes2ID, 1)##",
                Label = "##RESOLVE(Title, YAxes2, 1)##",
                Type = "line",
                BackgroundColor = "rgb(255, 159, 64)"
            };
            lineChart.Data.Add((double)decimal.Parse(##RESOLVEDATA(Fieldlist, FieldName, 3)##Total==null?"0.00":##RESOLVEDATA(Fieldlist, FieldName, 3)##Total.Value.ToString("0.00")) );
            barChartModel.Datasets.Add(lineChart);

            var allData = new AipmPortfolioResultBarNLineChartModel
            {
                Labels = barChartModel.Labels,
                Datasets = barChartModel.Datasets
            };

            return allData;
        }