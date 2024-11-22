        public static async Task<AipmPortfolioResultStackChartModel> Get##BLOCK##(int scenarioId, AipmPortfolioResultFilter filter)
        {
            var summaryData = await ##RESOLVEDATA(Datapoint, FunctionName, 1)##(scenarioId, filter);
            var barChartModel = new AipmPortfolioResultStackChartModel();
            // Get uniq labels
            Dictionary<string, int> labelArray = new Dictionary<string, int>();
            var i=0;
            foreach (var row in summaryData)
            {
                var value = 0;
                var token = row.##RESOLVEDATA(Fieldlist, FieldName, 1)##==null?"null":row.##RESOLVEDATA(Fieldlist, FieldName, 1)##;
                bool hasValue = labelArray.TryGetValue(token, out value);
                if (!hasValue) {
                    labelArray.Add(token, i);
                    i++;
                }
            }

            // Add uniq labels to the chart
            foreach (var row in labelArray)
            {
                barChartModel.Labels.Add(row.Key);
            }

            Dictionary<string, int> fieldArray = new Dictionary<string, int>();
            fieldArray.Add("##RESOLVE(Legend, Data, 1)##", 0);
            fieldArray.Add("##RESOLVE(Legend, Data, 2)##", 1);
            fieldArray.Add("##RESOLVE(Legend, Data, 3)##", 2);
            fieldArray.Add("##RESOLVE(Legend, Data, 4)##", 3);
            fieldArray.Add("##RESOLVE(Legend, Data, 5)##", 4);
            fieldArray.Add("##RESOLVE(Legend, Data, 6)##", 5);
            fieldArray.Add("##RESOLVE(Legend, Data, 7)##", 6);
            fieldArray.Add("##RESOLVE(Legend, Data, 8)##", 7);

            Dictionary<int, string> int2FieldArray = new Dictionary<int, string>();
            int2FieldArray.Add(0, "##RESOLVE(Legend, Data, 1)##");
            int2FieldArray.Add(1, "##RESOLVE(Legend, Data, 2)##");
            int2FieldArray.Add(2, "##RESOLVE(Legend, Data, 3)##");
            int2FieldArray.Add(3, "##RESOLVE(Legend, Data, 4)##");
            int2FieldArray.Add(4, "##RESOLVE(Legend, Data, 5)##");
            int2FieldArray.Add(5, "##RESOLVE(Legend, Data, 6)##");
            int2FieldArray.Add(6, "##RESOLVE(Legend, Data, 7)##");
            int2FieldArray.Add(7, "##RESOLVE(Legend, Data, 8)##");

            for (var fldIndex = 0; fldIndex < fieldArray.Count; fldIndex++) {
                var dataModel = new StackBarDataModel();
                foreach (var p in summaryData.Where(p => (p.##RESOLVEDATA(Fieldlist, FieldName, 2)## == int2FieldArray[fldIndex]))) {
                    dataModel.Data.Add((double)decimal.Parse(p.##RESOLVEDATA(Fieldlist, FieldName, 3)##==null?"0.00":p.##RESOLVEDATA(Fieldlist, FieldName, 3)##.Value.ToString("0.00")) );
               
                    switch (fieldArray[p.##RESOLVEDATA(Fieldlist, FieldName, 2)##==null?"":p.##RESOLVEDATA(Fieldlist, FieldName, 2)##])
                    {
                        case 0:
                            dataModel.Label = "##RESOLVE(Legend, Label, 1)##";
                            dataModel.BorderColor = "##RESOLVE(Legend, BorderColor, 1)##";
                            dataModel.BorderWidth = ##RESOLVE(Legend, BorderWidth, 1)##;
                            dataModel.BackgroundColor = "##RESOLVE(Legend, BackgroundColor, 1)##";
                            dataModel.CategoryPercentage = ##RESOLVE(Legend, CategoryPercentage, 1)##;
                            dataModel.Fill = ##RESOLVE(Legend, Fill, 1)##;
                            break;
    
                        case 1:
                            dataModel.Label = "##RESOLVE(Legend, Label, 2)##";
                            dataModel.BorderColor = "##RESOLVE(Legend, BorderColor, 2)##";
                            dataModel.BorderWidth = ##RESOLVE(Legend, BorderWidth, 2)##;
                            dataModel.BackgroundColor = "##RESOLVE(Legend, BackgroundColor, 2)##";
                            dataModel.CategoryPercentage = ##RESOLVE(Legend, CategoryPercentage, 2)##;
                            dataModel.Fill = ##RESOLVE(Legend, Fill, 2)##;
                            break;
    
                        case 2:
                            dataModel.Label = "##RESOLVE(Legend, Label, 3)##";
                            dataModel.BorderColor = "##RESOLVE(Legend, BorderColor, 3)##";
                            dataModel.BorderWidth = ##RESOLVE(Legend, BorderWidth, 3)##;
                            dataModel.BackgroundColor = "##RESOLVE(Legend, BackgroundColor, 3)##";
                            dataModel.CategoryPercentage = ##RESOLVE(Legend, CategoryPercentage, 3)##;
                            dataModel.Fill = ##RESOLVE(Legend, Fill, 3)##;
                            break;
    
                        case 3:
                            dataModel.Label = "##RESOLVE(Legend, Label, 4)##";
                            dataModel.BorderColor = "##RESOLVE(Legend, BorderColor, 4)##";
                            dataModel.BorderWidth = ##RESOLVE(Legend, BorderWidth, 4)##;
                            dataModel.BackgroundColor = "##RESOLVE(Legend, BackgroundColor, 4)##";
                            dataModel.CategoryPercentage = ##RESOLVE(Legend, CategoryPercentage, 4)##;
                            dataModel.Fill = ##RESOLVE(Legend, Fill, 4)##;
                            break;
    
                        case 4:
                            dataModel.Label = "##RESOLVE(Legend, Label, 5)##";
                            dataModel.BorderColor = "##RESOLVE(Legend, BorderColor, 5)##";
                            dataModel.BorderWidth = ##RESOLVE(Legend, BorderWidth, 5)##;
                            dataModel.BackgroundColor = "##RESOLVE(Legend, BackgroundColor, 5)##";
                            dataModel.CategoryPercentage = ##RESOLVE(Legend, CategoryPercentage, 5)##;
                            dataModel.Fill = ##RESOLVE(Legend, Fill, 5)##;
                            break;
    
                        case 5:
                            dataModel.Label = "##RESOLVE(Legend, Label, 6)##";
                            dataModel.BorderColor = "##RESOLVE(Legend, BorderColor, 6)##";
                            dataModel.BorderWidth = ##RESOLVE(Legend, BorderWidth, 6)##;
                            dataModel.BackgroundColor = "##RESOLVE(Legend, BackgroundColor, 6)##";
                            dataModel.CategoryPercentage = ##RESOLVE(Legend, CategoryPercentage, 6)##;
                            dataModel.Fill = ##RESOLVE(Legend, Fill, 6)##;
                            break;
    
                        case 6:
                            dataModel.Label = "##RESOLVE(Legend, Label, 7)##";
                            dataModel.BorderColor = "##RESOLVE(Legend, BorderColor, 7)##";
                            dataModel.BorderWidth = ##RESOLVE(Legend, BorderWidth, 7)##;
                            dataModel.BackgroundColor = "##RESOLVE(Legend, BackgroundColor, 7)##";
                            dataModel.CategoryPercentage = ##RESOLVE(Legend, CategoryPercentage, 7)##;
                            dataModel.Fill = ##RESOLVE(Legend, Fill, 7)##;
                            break;
    
                        case 7:
                            dataModel.Label = "##RESOLVE(Legend, Label, 8)##";
                            dataModel.BorderColor = "##RESOLVE(Legend, BorderColor, 8)##";
                            dataModel.BorderWidth = ##RESOLVE(Legend, BorderWidth, 8)##;
                            dataModel.BackgroundColor = "##RESOLVE(Legend, BackgroundColor, 8)##";
                            dataModel.CategoryPercentage = ##RESOLVE(Legend, CategoryPercentage, 8)##;
                            dataModel.Fill = ##RESOLVE(Legend, Fill, 8)##;
                            break;
                    }
                }

                //add Bar Chart Data Model to Bar Chart Model
                barChartModel.Datasets.Add(dataModel);
            }

            var allData = new AipmPortfolioResultStackChartModel
            {
                Labels = barChartModel.Labels,
                Datasets = barChartModel.Datasets
            };

            return allData;
        }