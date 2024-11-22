        public static async Task<IEnumerable<##RESOLVEDATA(Datapoint, DataHolder, 1)##>> ##RESOLVEDATA(Datapoint, FunctionName, 1)##(int scenarioId, AipmPortfolioResultFilter filter)
        {
            var where = "";
            if (filter.State != null && filter.State.Count > 0)
            {
                var states = string.Join("', '", filter.State);
                where += " AND mp.\"UDCFG_GeoStateCode\" IN ('" + states + "')";
            }

            if (filter.BusinessArea != null && filter.BusinessArea.Count > 0)
            {
                var businessArea = string.Join("', '", filter.BusinessArea);
                where += " AND mp.\"UDCFG_BusinessAreaCode\" IN ('" + businessArea + "')";
            }

            if (filter.ProjectType != null && filter.ProjectType.Count > 0)
            {
                var projectType = string.Join("', '", filter.ProjectType);
                where += " AND mp.\"UDProjectType\" IN ('" + projectType + "')";
            }

            if (filter.StrategicObjective != null && filter.StrategicObjective.Count > 0)
            {
                var strategicObjective = string.Join("', '", filter.StrategicObjective);
                where += " AND mp.\"UDStrategicObjective\" IN ('" + strategicObjective + "')";
            }

            if (filter.SubObjective != null && filter.SubObjective.Count > 0)
            {
                var subObjective = string.Join("', '", filter.SubObjective);
                where += " AND mp.\"UDIBRNarrativeMR\" IN ('" + subObjective + "')";
            }
            
            if (filter.SubObjectiveHPA != null && filter.SubObjectiveHPA.Count > 0)
            {
                var subOjectiveHPA = string.Join("', '", filter.SubObjectiveHPA);
                where += " AND mp.\"UDIBRNarrativeHPA\" IN ('" + subOjectiveHPA + "')";
            }

            if (filter.Voltage != null && filter.Voltage.Count > 0)
            {
                var voltage = string.Join("', '", filter.Voltage);
                where += " AND mp.\"UDVoltagekV\" IN ('" + voltage + "')";
            }
            var innerSql = $"##RESOLVEDATAESC(Datapoint, SQL, 1, [" + where + "])##";

            var innerparams = new { id = scenarioId };
            var summary = (await DbHelper.ExecuteDql<##RESOLVEDATA(Datapoint, DataHolder, 1)##>(innerSql, innerparams));

            /*
            var summaryReturnResult = new List<##RESOLVEDATA(Datapoint, DataHolder, 1)##>();
            summaryReturnResult.Add(summary);*/

            return summary;
        }