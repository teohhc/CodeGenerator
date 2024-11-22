        public static async Task<AipmPortfolioResultBarNLineChartModel> Get##BLOCK##(int scenarioId, AipmPortfolioResultFilter filter)
        {
            var where = "";
            if (filter.State != null && filter.State.Count > 0)
            {
                var states = string.Join("', '", filter.State);
                where += " AND b.\"UDCFG_GeoStateCode\" IN ('" + states + "')";
            }

            if (filter.BusinessArea != null && filter.BusinessArea.Count > 0)
            {
                var businessArea = string.Join("', '", filter.BusinessArea);
                where += " AND b.\"UDCFG_BusinessAreaCode\" IN ('" + businessArea + "')";
            }

            if (filter.ProjectType != null && filter.ProjectType.Count > 0)
            {
                var projectType = string.Join("', '", filter.ProjectType);
                where += " AND b.\"UDProjectType\" IN ('" + projectType + "')";
            }

            if (filter.StrategicObjective != null && filter.StrategicObjective.Count > 0)
            {
                var strategicObjective = string.Join("', '", filter.StrategicObjective);
                where += " AND b.\"UDStrategicObjective\" IN ('" + strategicObjective + "')";
            }

            if (filter.Voltage != null && filter.Voltage.Count > 0)
            {
                var voltage = string.Join("', '", filter.Voltage);
                where += " AND b.\"UDVoltagekV\" IN ('" + voltage + "')";
            }

            var parameters = new { id = scenarioId };

            var summaryData = await PortfolioResultsSummary(scenarioId, filter);
            var prioritisedData = summaryData.Where(x => x.Summary == "Prioritised").FirstOrDefault();

            var barChartModel = new AipmPortfolioResultBarChartModel();
            barChartModel.Labels.Add("Current Scenario");


            for (var i = 0; i < 8; i++)
            {
                var dataModel = new AipmPortfolioResultBarChartDataModel();
                dataModel.yAxisID = "##RESOLVE(Title, YAxes1ID, 1)##";
                //dataModel.Order = 0;
                dataModel.Type = "bar";
                switch (i)
                {
                    case 0:
                        dataModel.Label = "Year 1";
                        //dataModel.Data.Add(prioritisedData.BUDY1.HasValue ? prioritisedData.BUDY1.Value : 0);
                        dataModel.Data.Add((double)decimal.Parse(prioritisedData.BUDY1.Value.ToString("0.00")) / 1000000);
                        dataModel.BackgroundColor = "##RESOLVE(Legend, BackgroundColor, 1)##";
                        break;

                    case 1:
                        dataModel.Label = "Year 2";
                        //dataModel.Data.Add(prioritisedData.BUDY2.HasValue ? prioritisedData.BUDY2.Value : 0);
                        dataModel.Data.Add((double)decimal.Parse(prioritisedData.BUDY2.Value.ToString("0.00")) / 1000000);
                        dataModel.BackgroundColor = "##RESOLVE(Legend, BackgroundColor, 2)##";
                        break;

                    case 2:
                        dataModel.Label = "Year 3";
                        //dataModel.Data.Add(prioritisedData.BUDY3.HasValue ? prioritisedData.BUDY3.Value : 0);
                        dataModel.Data.Add((double)decimal.Parse(prioritisedData.BUDY3.Value.ToString("0.00")) / 1000000);
                        dataModel.BackgroundColor = "##RESOLVE(Legend, BackgroundColor, 3)##";
                        break;

                    case 3:
                        dataModel.Label = "Year 4";
                        //dataModel.Data.Add(prioritisedData.BUDY4.HasValue ? prioritisedData.BUDY4.Value : 0);
                        dataModel.Data.Add((double)decimal.Parse(prioritisedData.BUDY4.Value.ToString("0.00")) / 1000000);
                        dataModel.BackgroundColor = "##RESOLVE(Legend, BackgroundColor, 4)##";
                        break;

                    case 4:
                        dataModel.Label = "Year 5";
                        //dataModel.Data.Add(prioritisedData.BUDY5.HasValue ? prioritisedData.BUDY5.Value : 0);
                        dataModel.Data.Add((double)decimal.Parse(prioritisedData.BUDY5.Value.ToString("0.00")) / 1000000);
                        dataModel.BackgroundColor = "##RESOLVE(Legend, BackgroundColor, 5)##";
                        break;

                    case 5:
                        dataModel.Label = "Year 6";
                        //dataModel.Data.Add(prioritisedData.BUDY6.HasValue ? prioritisedData.BUDY6.Value : 0);
                        dataModel.Data.Add((double)decimal.Parse(prioritisedData.BUDY6.Value.ToString("0.00")) / 1000000);
                        dataModel.BackgroundColor = "##RESOLVE(Legend, BackgroundColor, 6)##";
                        break;

                    case 6:
                        dataModel.Label = "Year 7";
                        //dataModel.Data.Add(prioritisedData.BUDY7.HasValue ? prioritisedData.BUDY7.Value : 0);
                        dataModel.Data.Add((double)decimal.Parse(prioritisedData.BUDY7.Value.ToString("0.00")) / 1000000);
                        dataModel.BackgroundColor = "##RESOLVE(Legend, BackgroundColor, 7)##";
                        break;

                    case 7:
                        dataModel.Label = "Year 8";
                        //dataModel.Data.Add(prioritisedData.BUDY8.HasValue ? prioritisedData.BUDY8.Value : 0);
                        dataModel.Data.Add((double)decimal.Parse(prioritisedData.BUDY8.Value.ToString("0.00")) / 1000000);
                        dataModel.BackgroundColor = "##RESOLVE(Legend, BackgroundColor, 8)##";
                        break;
                }

                //add Bar Chart Data Model to Bar Chart Model
                barChartModel.Datasets.Add(dataModel);
            }

            var lineChart = new AipmPortfolioResultBarChartDataModel
            {
                yAxisID = "##RESOLVE(Title, YAxes2ID, 1)##",
                Label = "##RESOLVE(Title, YAxes2, 1)##",
                Type = "line",
                BackgroundColor = "rgb(255, 159, 64)"
            };
            lineChart.Data.Add((double)decimal.Parse(prioritisedData.TotalBudget.Value.ToString("0.00")) / 1000000);
            barChartModel.Datasets.Add(lineChart);

            var allData = new AipmPortfolioResultBarNLineChartModel
            {
                Labels = barChartModel.Labels,
                Datasets = barChartModel.Datasets
            };

            return allData;
        }