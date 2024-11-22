        public static async Task<##RESOLVEDATA(Datapoint, FunctionName, 1)##ChartModel> Get##BLOCK##(int scenarioId, AipmPortfolioResultFilter filter)
        {
            var summaryData = await ##RESOLVEDATA(Datapoint, FunctionName, 1)##(scenarioId, filter);

            var barChartModel = new ##RESOLVEDATA(Datapoint, FunctionName, 1)##ChartModel();
            barChartModel.Labels.Add("##RESOLVEDATA(Fieldlist, FieldName, 3)####RESOLVEDATA(Fieldlist, PostFix, 3)##");
            barChartModel.Labels.Add("##RESOLVEDATA(Fieldlist, FieldName, 4)####RESOLVEDATA(Fieldlist, PostFix, 4)##");
            barChartModel.Labels.Add("##RESOLVEDATA(Fieldlist, FieldName, 5)####RESOLVEDATA(Fieldlist, PostFix, 5)##");
            barChartModel.Labels.Add("##RESOLVEDATA(Fieldlist, FieldName, 6)####RESOLVEDATA(Fieldlist, PostFix, 6)##");
            barChartModel.Labels.Add("##RESOLVEDATA(Fieldlist, FieldName, 7)####RESOLVEDATA(Fieldlist, PostFix, 7)##");
            barChartModel.Labels.Add("##RESOLVEDATA(Fieldlist, FieldName, 8)####RESOLVEDATA(Fieldlist, PostFix, 8)##");
/*
            // Get uniq labels
            Dictionary<string, int> fieldArray = new Dictionary<string, int>();
            var i=0;
            foreach (var row in summaryData)
            {
                var value = 0;
                var token = row.##RESOLVEDATA(Fieldlist, FieldName, 1)##==null?"null":row.##RESOLVEDATA(Fieldlist, FieldName, 1)##;
                bool hasValue = fieldArray.TryGetValue(row.##RESOLVEDATA(Fieldlist, FieldName, 1)##, out value);
                if (!hasValue) {
                    fieldArray.Add(row.##RESOLVEDATA(Fieldlist, FieldName, 1)##==null? "null": row.##RESOLVEDATA(Fieldlist, FieldName, 1)##, i);
                    i++;
                }
            }
*/
            var i = 0;
            Dictionary<string, int> fieldArray = new Dictionary<string, int>();
            fieldArray.Add("##RESOLVE(Legend, Label, 1)##", 0);
            fieldArray.Add("##RESOLVE(Legend, Label, 2)##", 1);
            fieldArray.Add("##RESOLVE(Legend, Label, 3)##", 2);
            fieldArray.Add("##RESOLVE(Legend, Label, 4)##", 3);
            fieldArray.Add("##RESOLVE(Legend, Label, 5)##", 4);
            fieldArray.Add("##RESOLVE(Legend, Label, 6)##", 5);
            fieldArray.Add("##RESOLVE(Legend, Label, 7)##", 6);
            fieldArray.Add("##RESOLVE(Legend, Label, 8)##", 7);

            foreach (var row in summaryData)
            {
                var dataModel = new ##RESOLVEDATA(Datapoint, FunctionName, 1)##Datasets();
                dataModel.Label = row.##RESOLVEDATA(Fieldlist, FieldName, 1)##==null? "blank":row.##RESOLVEDATA(Fieldlist, FieldName, 1)##;
                dataModel.Data.Add((double)decimal.Parse(row.##RESOLVEDATA(Fieldlist, FieldName, 3)##==null?"0.00":row.##RESOLVEDATA(Fieldlist, FieldName, 3)##.Value.ToString("0.0000")));
                dataModel.Data.Add((double)decimal.Parse(row.##RESOLVEDATA(Fieldlist, FieldName, 4)##==null?"0.00":row.##RESOLVEDATA(Fieldlist, FieldName, 4)##.Value.ToString("0.0000")));
                dataModel.Data.Add((double)decimal.Parse(row.##RESOLVEDATA(Fieldlist, FieldName, 5)##==null?"0.00":row.##RESOLVEDATA(Fieldlist, FieldName, 5)##.Value.ToString("0.0000")));
                dataModel.Data.Add((double)decimal.Parse(row.##RESOLVEDATA(Fieldlist, FieldName, 6)##==null?"0.00":row.##RESOLVEDATA(Fieldlist, FieldName, 6)##.Value.ToString("0.0000")));
                dataModel.Data.Add((double)decimal.Parse(row.##RESOLVEDATA(Fieldlist, FieldName, 7)##==null?"0.00":row.##RESOLVEDATA(Fieldlist, FieldName, 7)##.Value.ToString("0.0000")));
                dataModel.Data.Add((double)decimal.Parse(row.##RESOLVEDATA(Fieldlist, FieldName, 8)##==null?"0.00":row.##RESOLVEDATA(Fieldlist, FieldName, 8)##.Value.ToString("0.0000")));
                //switch (fieldArray[row.##RESOLVEDATA(Fieldlist, FieldName, 1)##==null? "null": row.##RESOLVEDATA(Fieldlist, FieldName, 1)##])
                switch (i)
                {
                    case 0:
                        dataModel.BorderColor = "##RESOLVE(Legend, BorderColor, 1)##";
                        dataModel.BorderWidth = ##RESOLVE(Legend, BorderWidth, 1)##;
                        dataModel.BackgroundColor = "##RESOLVE(Legend, Colour, 1)##";
                        dataModel.Fill = ##RESOLVE(Legend, Fill, 1)##;
                        break;

                    case 1:
                        dataModel.BorderColor = "##RESOLVE(Legend, BorderColor, 2)##";
                        dataModel.BorderWidth = ##RESOLVE(Legend, BorderWidth, 2)##;
                        dataModel.BackgroundColor = "##RESOLVE(Legend, Colour, 2)##";
                        dataModel.Fill = ##RESOLVE(Legend, Fill, 2)##;
                        break;

                    case 2:
                        dataModel.BorderColor = "##RESOLVE(Legend, BorderColor, 3)##";
                        dataModel.BorderWidth = ##RESOLVE(Legend, BorderWidth, 3)##;
                        dataModel.BackgroundColor = "##RESOLVE(Legend, Colour, 3)##";
                        dataModel.Fill = ##RESOLVE(Legend, Fill, 3)##;
                        break;

                    case 3:
                        dataModel.BorderColor = "##RESOLVE(Legend, BorderColor, 4)##";
                        dataModel.BorderWidth = ##RESOLVE(Legend, BorderWidth, 4)##;
                        dataModel.BackgroundColor = "##RESOLVE(Legend, Colour, 4)##";
                        dataModel.Fill = ##RESOLVE(Legend, Fill, 4)##;
                        break;

                    case 4:
                        dataModel.BorderColor = "##RESOLVE(Legend, BorderColor, 5)##";
                        dataModel.BorderWidth = ##RESOLVE(Legend, BorderWidth, 5)##;
                        dataModel.BackgroundColor = "##RESOLVE(Legend, Colour, 5)##";
                        dataModel.Fill = ##RESOLVE(Legend, Fill, 5)##;
                        break;

                    case 5:
                        dataModel.BorderColor = "##RESOLVE(Legend, BorderColor, 6)##";
                        dataModel.BorderWidth = ##RESOLVE(Legend, BorderWidth, 6)##;
                        dataModel.BackgroundColor = "##RESOLVE(Legend, Colour, 6)##";
                        dataModel.Fill = ##RESOLVE(Legend, Fill, 5)##;

                        break;

                    case 6:
                        dataModel.BorderColor = "##RESOLVE(Legend, BorderColor, 7)##";
                        dataModel.BorderWidth = ##RESOLVE(Legend, BorderWidth, 7)##;
                        dataModel.BackgroundColor = "##RESOLVE(Legend, Colour, 7)##";
                        dataModel.Fill = ##RESOLVE(Legend, Fill, 7)##;
                        break;

                    case 7:
                        dataModel.BorderColor = "##RESOLVE(Legend, BorderColor, 8)##";
                        dataModel.BorderWidth = ##RESOLVE(Legend, BorderWidth, 8)##;
                        dataModel.BackgroundColor = "##RESOLVE(Legend, Colour, 8)##";
                        dataModel.Fill = ##RESOLVE(Legend, Fill, 8)##;
                        break;
                }
                i++;
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