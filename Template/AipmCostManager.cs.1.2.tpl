        public static async Task<List<Dictionary<string, object>>> get##RESOLVEDATA(Datapoint, FunctionName, 1)##(int scenarioId, AipmCostFilters model)
        {
            var commandText = "";

            if (model.State != null && model.State.Count > 0)
            {
                var states = "";
                states = string.Join("', '", model.State);
                commandText += " AND a.\"UDCFG_GeoStateCode\" IN ('" + states + "')";
            }
            
            if (model.BusinessArea != null && model.BusinessArea.Count > 0)
            {
                var businessArea = "";
                businessArea = string.Join("', '", model.BusinessArea);
                commandText += " AND a.\"UDCFG_BusinessAreaCode\" IN ('" + businessArea + "')";
            }
            
            if (model.ProjectType != null && model.ProjectType.Count > 0)
            {
                var projectType = "";
                projectType = string.Join("', '", model.ProjectType);
                commandText += " AND a.\"UDProjectType\" IN ('" + projectType + "')";
            }
            
            if (model.Voltage != null && model.Voltage.Count > 0)
            {
                var voltage = "";
                voltage = string.Join(", ", model.Voltage.Select(item => $"'{item}'"));
                commandText += " AND a.\"UDVoltagekV\" IN (" + voltage + ")";
            }
            
            var sql = $"##RESOLVEDATAESC(Datapoint, SQL, 1, ["\"+ commandText + \""])##";
            var parameters = new { id = scenarioId, id2 = scenarioId };
            var result = await DbHelper.ExecuteDql(sql, parameters);
        
            return result.ToList();
        }