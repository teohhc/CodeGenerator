        public static async Task<List<Dictionary<string, object>>> get##RESOLVEDATA(Datapoint, FunctionName, 1)##(int scenarioId, AipmCostFilters model)
        {
            var commandText = $"##RESOLVEDATAESC(Datapoint, SQL, 1)##";

            if (model.State != null && model.State.Count > 0)
            {
                var states = "";
                states = string.Join("', '", model.State);
                commandText += " AND a.\"State\" IN ('" + states + "')";
            }
            
            if (model.BusinessArea != null && model.BusinessArea.Count > 0)
            {
                var businessArea = "";
                businessArea = string.Join("', '", model.BusinessArea);
                commandText += " AND a.\"Business_Area\" IN ('" + businessArea + "')";
            }
            
            if (model.ProjectType != null && model.ProjectType.Count > 0)
            {
                var projectType = "";
                projectType = string.Join("', '", model.ProjectType);
                commandText += " AND a.\"Project_Type\" IN ('" + projectType + "')";
            }
            
            if (model.Voltage != null && model.Voltage.Count > 0)
            {
                var voltage = "";
                voltage = string.Join(", ", model.Voltage);
                commandText += " AND a.\"Voltage_Type\" IN (" + voltage + ")";
            }
            
            if (model.Scope != null && model.Scope.Count > 0)
            {
                var scope = "";
                scope = string.Join(", ", model.Scope);
                commandText += " AND a.\"Scope\" IN (" + scope + ")";
            }

            var parameters = new { id = scenarioId };
            var result = await DbHelper.ExecuteDql(commandText, parameters);
        
            return result.ToList();
        }