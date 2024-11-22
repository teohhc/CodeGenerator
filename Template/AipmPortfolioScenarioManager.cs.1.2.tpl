        public static async Task<List<Dictionary<string, object>>> ##RESOLVEDATA(Datapoint, FunctionName, 1)##(int scenarioId, AipmPortfolioResultFilter filter, bool alternate = false)
        {
            var where = "";
            var sortBy = "";
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
        
            if (filter.SubObjective != null && filter.SubObjective.Count > 0)
            {
                var subObjective = string.Join("', '", filter.SubObjective);
                where += " AND b.\"SubObjectiveDdl\" IN ('" + subObjective + "')";
            }
        
            if (filter.Voltage != null && filter.Voltage.Count > 0)
            {
                var voltage = string.Join("', '", filter.Voltage);
                where += " AND b.\"UDVoltagekV\" IN ('" + voltage + "')";
            }
        
            if (!string.IsNullOrEmpty(filter.SortByColumn))
            {
                sortBy = " ORDER BY ";
                if (filter.SortByColumn == "budgetBeforeRevised")
                {
                    sortBy += " \"budget_Before_Revised\" " + filter.SortDirection;
                }
                else if (filter.SortByColumn == "totalBudget")
                {
                    sortBy += " \"total_Budget\" " + filter.SortDirection;
                }
                else if (filter.SortByColumn == "riskReduced")
                {
                    sortBy += " \"risk_Reduced\" " + filter.SortDirection;
                }
                else if (filter.SortByColumn == "tcoOpex")
                {
                    sortBy += " \"tcO_Opex\" " + filter.SortDirection;
                }
                else if (filter.SortByColumn == "tcoTotalProjectCost")
                {
                    sortBy += " \"tcO_TotalProjectCost\" " + filter.SortDirection;
                }
                else if (filter.SortByColumn == "npvRiskReduced")
                {
                    sortBy += " \"npV_RiskReduced\" " + filter.SortDirection;
                }
                else if (filter.SortByColumn == "projectScore")
                {
                    sortBy += " \"project_Score\" " + filter.SortDirection;
                }
            }
        
            var commandText = $"##RESOLVEDATAESC(Datapoint, SQL, 1, ["{where + sortBy}"])##";
            commandText += "ORDER BY \"UDStrategicObjective\", \"UDIBRNarrativeMR\", \"UDIBRNarrativeHPA\", \"UDVoltagekV\"";

            var parameters = new { id = scenarioId };
            var result = await DbHelper.ExecuteDql(commandText, parameters);
        
            return result.ToList();
        }