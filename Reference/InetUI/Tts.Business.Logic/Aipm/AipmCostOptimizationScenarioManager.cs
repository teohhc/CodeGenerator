using Dapper;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Npgsql;
using Tts.Business.Entities.Aipm;
using Tts.Business.Helpers;
using Tts.Business.ViewModels.Aipm;
using Tts.Business.ViewModels;
using System.Net.Http;
using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using Web.Admin.HttpAggregator.Controllers.Tts.Aipm;

namespace Tts.Business.Logic.Aipm
{
    public class AipmCostOptimizationScenarioManager
    {
        public static async Task<bool> Create(AipmCostOptimizationScenario record)
        {
            var commandText = $"INSERT INTO aipmcostoptimizationscenario (scenarioyear, scenarioname, scenariocomments, createdby, modifiedby, createddt, modifieddt,\"cycleId\", hoza, \"stateCode\", \"isNational\") " +
                              $"VALUES (@scenarioyear, @scenarioname, @scenariocomments, @createdby, @modifiedby, @createddt, @modifieddt, @cycleId, @hoza, @stateCode, @isNational)";
            var parameters = new
            {
                cycleId = record.CycleId,
                scenarioyear = record.ScenarioYear,
                scenarioname = record.ScenarioName,
                scenariocomments = record.ScenarioComments,
                createdby = record.CreatedBy,
                modifiedby = record.ModifiedBy,
                createddt = record.CreatedDt,
                modifieddt = record.ModifiedDt,
                hoza = record.Hoza,
                stateCode = record.StateCode,
                isNational = record.IsNational
            };
            var response = await DbHelper.ExecuteDml(commandText, parameters);
            return response;

        }
        public static async Task<bool> Delete(int id)
        {
            var commandText = $"UPDATE aipmcostoptimizationscenario SET deleted=true WHERE id = @id";
            var parameters = new
            {
                id = id
            };
            var response = await DbHelper.ExecuteDml(commandText, parameters);
            return response;
        }
        public static async Task<AipmCostOptimizationScenario> ReadById(int id)
        {
            var commandText = $"SELECT * FROM aipmcostoptimizationscenario WHERE id=(@recordid)";
            var parameters = new { recordid = id };
            return (await DbHelper.ExecuteDql<AipmCostOptimizationScenario>(commandText, parameters)).FirstOrDefault();
        }
        public static async Task<AipmCostOptimizationScenario> ReadByName(string name)
        {
            var commandText = $"SELECT * FROM aipmcostoptimizationscenario WHERE scenarioname = '" + name + "'";
            return (await DbHelper.ExecuteDql<AipmCostOptimizationScenario>(commandText)).FirstOrDefault();
        }
        public static async Task<Pagination<AipmCostOptimizationScenario>> List(AipmBudgetCostOptimizationScenarioSearch search, string username)
        {
            var joinClause = new StringBuilder();
            var dynamicParameters = new DynamicParameters();
            var whereClause = new StringBuilder();
            var sortByClause = string.Empty;

            if (!string.IsNullOrEmpty(search.SortByColumn) && !string.IsNullOrEmpty(search.SortDirection))
                sortByClause = " ORDER BY a.\"" + search.SortByColumn.ToLower() + "\" " + search.SortDirection.ToUpper();

            if (!string.IsNullOrEmpty(sortByClause))
            {
                sortByClause += ", a.createddt DESC";
            }
            else
            {
                sortByClause += "ORDER BY a.createddt DESC";
            }

            whereClause.Append(" WHERE a.deleted=false AND a.\"cycleId\"=@cycleId");
            if (search.ScenarioId != null)
                whereClause.Append(" AND a.id != '" + search.ScenarioId + "'");

            if (search.ScenarioYear != null)
                whereClause.Append(" AND a.scenarioyear = " + search.ScenarioYear);

            if (search.ScenarioName != null)
                whereClause.Append(" AND a.scenarioname LIKE '%" + search.ScenarioName + "%'");

            if (search.StateName != null && search.StateName.Any())
            {
                var states = string.Join("', '", search.StateName);
                if (search.StateName.Any(a => a == "National"))
                {
                    whereClause.Append(" AND (a.\"stateCode\" IS NULL OR a.\"stateCode\" IN ('" + states + "'))");
                }
                else
                {
                    whereClause.Append(" AND a.\"stateCode\" IN ('" + states + "')");
                }
            }
                
            if (!string.IsNullOrEmpty(search.SearchKey) && !string.IsNullOrEmpty(search.SearchValue))
            {
                if (search.SearchKey.IsContain("scenarioname"))
                    whereClause.Append(" AND a.scenarioname LIKE '%" + search.SearchValue + "%'");
            }

            dynamicParameters.Add("@username", username);
            dynamicParameters.Add("@cycleId", search.CycleId, DbType.Int32);
            dynamicParameters.Add("@PageSize", search.PageSize, DbType.Int32);
            dynamicParameters.Add("@PageNumber", search.PageIndex, DbType.Int32);

            joinClause.Append("LEFT JOIN public.\"Profiling_Running_Record_Graph\" AS b ON a.id = b.\"Plan_ID\" LEFT JOIN public.\"Profiling_Running_Record_Percent\" AS c ON a.id = c.\"Plan_ID\" INNER JOIN public.\"CFG_GeoState\" AS geoState ON a.\"stateCode\" = geoState.\"Code\" INNER JOIN public.\"SEC_ApplicationUserStateMapping\" AS userState ON a.\"stateCode\" = userState.\"CFG_GeoStateCode\" ");

            var sb = new StringBuilder();
            sb.Append(" SELECT SUM(\"count\") FROM (SELECT COUNT (*) FROM aipmcostoptimizationscenario AS a");
            sb.Append(" " + joinClause);
            sb.Append(" " + whereClause);
            sb.Append(" AND userState.\"SEC_ApplicationUserUsername\"=@username AND a.\"isNational\" = false");
            sb.Append(" UNION ALL");
            sb.Append(" SELECT COUNT(*) FROM aipmcostoptimizationscenario AS a LEFT JOIN public.\"Profiling_Running_Record_Graph\" AS b ON a.id = b.\"Plan_ID\" LEFT JOIN public.\"Profiling_Running_Record_Percent\" AS c ON a.id = c.\"Plan_ID\"");
            sb.Append(" " + whereClause + " AND a.\"isNational\"=true");
            sb.Append(") AS a;");

            sb.Append("SELECT * FROM (SELECT a.*, COALESCE(b.\"Status\", 'Not Running') AS \"HistogramStatus\", COALESCE(c.\"Status\", 'Not Running') AS \"ResultStatus\", geoState.\"Name\" AS \"StateName\" FROM aipmcostoptimizationscenario AS a");
            sb.Append(" " + joinClause);
            sb.Append(" " + whereClause);
            sb.Append(" AND userState.\"SEC_ApplicationUserUsername\"=@username AND a.\"isNational\" = false");
            sb.Append(" UNION ALL");
            sb.Append(" SELECT a.*, COALESCE(b.\"Status\", 'Not Running') AS \"HistogramStatus\", COALESCE(c.\"Status\", 'Not Running') AS \"ResultStatus\", 'National' AS \"StateName\" FROM aipmcostoptimizationscenario AS a LEFT JOIN public.\"Profiling_Running_Record_Graph\" AS b ON a.id = b.\"Plan_ID\" LEFT JOIN public.\"Profiling_Running_Record_Percent\" AS c ON a.id = c.\"Plan_ID\"");
            sb.Append(" " + whereClause + " AND a.\"isNational\"=true");
            sb.Append(") AS a");
            sb.Append(" " + sortByClause);
            sb.Append(" LIMIT @PageSize");
            sb.Append(" OFFSET ((@PageNumber - 1) * @PageSize);");

            var db = new NpgsqlConnection(DbHelper.GetConnectingString);
            using var dbResponse = await db.QueryMultipleAsync(sb.ToString(), dynamicParameters);
            var finalPagination = new Pagination<AipmCostOptimizationScenario>
            {
                TotalCount = dbResponse.Read<int>().FirstOrDefault(),
                Items = dbResponse.Read<AipmCostOptimizationScenario>().ToList()
            };
            return finalPagination;
        }

        public static async Task<Pagination<AipmCostOptimizationScenario>> ImportList(AipmBudgetCostOptimizationScenarioSearch search)
        {
            var db = new NpgsqlConnection(DbHelper.GetConnectingString);
            var joinClause = new StringBuilder();
            var dynamicParameters = new DynamicParameters();
            var whereClause = new StringBuilder();
            var sortByClause = string.Empty;

            var currentScenarioSql = await db.QueryMultipleAsync("SELECT * FROM aipmcostoptimizationscenario WHERE id = " + search.ScenarioId);
            var currentScenario = currentScenarioSql.Read<AipmCostOptimizationScenario>().FirstOrDefault();

            if (!string.IsNullOrEmpty(search.SortByColumn) && !string.IsNullOrEmpty(search.SortDirection))
                sortByClause = " ORDER BY a.\"" + search.SortByColumn.ToLower() + "\" " + search.SortDirection.ToUpper();

            if (!string.IsNullOrEmpty(sortByClause))
            {
                sortByClause += ", a.createddt DESC";
            }
            else
            {
                sortByClause += "ORDER BY a.createddt DESC";
            }

            whereClause.Append(" WHERE a.deleted=false AND a.\"cycleId\"=@cycleId");
            if (search.ScenarioId != null)
                whereClause.Append(" AND a.id != '" + search.ScenarioId + "'");

            if (search.ScenarioYear != null)
                whereClause.Append(" AND a.scenarioyear = " + search.ScenarioYear);

            if (search.ScenarioName != null)
                whereClause.Append(" AND a.scenarioname LIKE '%" + search.ScenarioName + "%'");

            if (search.StateName != null && search.StateName.Any())
            {
                var states = string.Join("', '", search.StateName);
                if (search.StateName.Any(a => a == "National"))
                {
                    whereClause.Append(" AND (a.\"stateCode\" IS NULL OR a.\"stateCode\" IN ('" + states + "'))");
                }
                else
                {
                    whereClause.Append(" AND a.\"stateCode\" IN ('" + states + "')");
                }
            }

            if (!string.IsNullOrEmpty(search.SearchKey) && !string.IsNullOrEmpty(search.SearchValue))
            {
                if (search.SearchKey.IsContain("scenarioname"))
                    whereClause.Append(" AND a.scenarioname ILIKE '%" + search.SearchValue + "%'");
            }

            if (currentScenario.StateCode != null && currentScenario.StateCode != "")
            {
                whereClause.Append(" AND a.\"stateCode\" = @stateCode");
                dynamicParameters.Add("@stateCode", currentScenario.StateCode);
            }

            dynamicParameters.Add("@cycleId", search.CycleId, DbType.Int32);
            dynamicParameters.Add("@PageSize", search.PageSize, DbType.Int32);
            dynamicParameters.Add("@PageNumber", search.PageIndex, DbType.Int32);

            joinClause.Append("LEFT JOIN public.\"Profiling_Running_Record_Graph\" AS b ON a.id = b.\"Plan_ID\" LEFT JOIN public.\"Profiling_Running_Record_Percent\" AS c ON a.id = c.\"Plan_ID\" INNER JOIN public.\"CFG_GeoState\" AS geoState ON a.\"stateCode\" = geoState.\"Code\" ");

            var sb = new StringBuilder();
            sb.Append(" SELECT SUM(\"count\") FROM (SELECT COUNT (*) FROM aipmcostoptimizationscenario AS a");
            sb.Append(" " + joinClause);
            sb.Append(" " + whereClause);
            if (currentScenario.StateCode == null || currentScenario.StateCode == "")
            {
                sb.Append(" UNION ALL");
                sb.Append(" SELECT COUNT(*) FROM aipmcostoptimizationscenario AS a LEFT JOIN public.\"Profiling_Running_Record_Graph\" AS b ON a.id = b.\"Plan_ID\" LEFT JOIN public.\"Profiling_Running_Record_Percent\" AS c ON a.id = c.\"Plan_ID\" WHERE a.deleted=false AND a.\"isNational\"=true AND a.\"cycleId\"=@cycleId");
            }
            sb.Append(") AS a;");

            sb.Append("SELECT * FROM (SELECT a.*, COALESCE(b.\"Status\", 'Not Running') AS \"HistogramStatus\", COALESCE(c.\"Status\", 'Not Running') AS \"ResultStatus\", geoState.\"Name\" AS \"StateName\" FROM aipmcostoptimizationscenario AS a");
            sb.Append(" " + joinClause);
            sb.Append(" " + whereClause);
            if (currentScenario.StateCode == null || currentScenario.StateCode == "")
            {
                sb.Append(" UNION ALL");
                sb.Append(" SELECT a.*, COALESCE(b.\"Status\", 'Not Running') AS \"HistogramStatus\", COALESCE(c.\"Status\", 'Not Running') AS \"ResultStatus\", 'National' AS \"StateName\" FROM aipmcostoptimizationscenario AS a LEFT JOIN public.\"Profiling_Running_Record_Graph\" AS b ON a.id = b.\"Plan_ID\" LEFT JOIN public.\"Profiling_Running_Record_Percent\" AS c ON a.id = c.\"Plan_ID\" WHERE a.deleted=false AND a.\"isNational\"=true AND a.\"cycleId\"=@cycleId");
            }
            sb.Append(") AS a");
            sb.Append(" " + sortByClause);
            sb.Append(" LIMIT @PageSize");
            sb.Append(" OFFSET ((@PageNumber - 1) * @PageSize);");

            using var dbResponse = await db.QueryMultipleAsync(sb.ToString(), dynamicParameters);
            var finalPagination = new Pagination<AipmCostOptimizationScenario>
            {
                TotalCount = dbResponse.Read<int>().FirstOrDefault(),
                Items = dbResponse.Read<AipmCostOptimizationScenario>().ToList()
            };
            return finalPagination;
        }

        public static async Task<Pagination<AipmCostOptimizationScenario>> ListWithResult(AipmBudgetCostOptimizationScenarioSearch search, string username)
        {
            var joinClause = new StringBuilder();
            var dynamicParameters = new DynamicParameters();
            var whereClause = new StringBuilder();
            var sortByClause = string.Empty;

            if (!string.IsNullOrEmpty(search.SortByColumn) && !string.IsNullOrEmpty(search.SortDirection))
                sortByClause = " ORDER BY a.\"" + search.SortByColumn.ToLower() + "\" " + search.SortDirection.ToUpper();

            if (!string.IsNullOrEmpty(sortByClause))
            {
                sortByClause += ", a.createddt DESC";
            }
            else
            {
                sortByClause += "ORDER BY a.createddt DESC";
            }

            whereClause.Append(" WHERE a.\"cycleId\"=@cycleId AND a.id IN (SELECT \"Plan_ID\" FROM public.\"Profiling_Final_Result_Trans\" GROUP BY \"Plan_ID\")");
            if (search.ScenarioYear != null)
                whereClause.Append(" AND a.scenarioyear=" + search.ScenarioYear);


            if (!string.IsNullOrEmpty(search.SearchKey) && !string.IsNullOrEmpty(search.SearchValue))
            {
                if (search.SearchKey.IsContain("scenarioname"))
                    whereClause.Append(" AND a.scenarioname ILIKE '%" + search.SearchValue + "%'");
            }

            if (search.ScenarioId != null)
                whereClause.Append(" AND a.id != '" + search.ScenarioId + "'");

            if (search.ScenarioYear != null)
                whereClause.Append(" AND a.scenarioyear = " + search.ScenarioYear);

            if (search.ScenarioName != null)
                whereClause.Append(" AND a.scenarioname LIKE '%" + search.ScenarioName + "%'");

            if (!string.IsNullOrEmpty(search.SearchKey) && !string.IsNullOrEmpty(search.SearchValue))
            {
                if (search.SearchKey.IsContain("scenarioname"))
                    whereClause.Append(" AND a.scenarioname ILIKE '%" + search.SearchValue + "%'");
            }

            dynamicParameters.Add("@username", username);
            dynamicParameters.Add("@cycleId", search.CycleId, DbType.Int32);
            dynamicParameters.Add("@PageSize", search.PageSize, DbType.Int32);
            dynamicParameters.Add("@PageNumber", search.PageIndex, DbType.Int32);

            if (search.StateCode != null && search.StateCode != "")
            {
                whereClause.Append(" AND a.\"stateCode\" = @stateCode");
                dynamicParameters.Add("@stateCode", search.StateCode);
            }

            joinClause.Append("LEFT JOIN public.\"Profiling_Running_Record_Graph\" AS b ON a.id = b.\"Plan_ID\" LEFT JOIN public.\"Profiling_Running_Record_Percent\" AS c ON a.id = c.\"Plan_ID\" INNER JOIN public.\"CFG_GeoState\" AS geoState ON a.\"stateCode\" = geoState.\"Code\" INNER JOIN public.\"SEC_ApplicationUserStateMapping\" AS userState ON a.\"stateCode\" = userState.\"CFG_GeoStateCode\" ");

            var sb = new StringBuilder();
            sb.Append(" SELECT SUM(\"count\") FROM (SELECT COUNT (*) FROM aipmcostoptimizationscenario AS a");
            sb.Append(" " + joinClause);
            sb.Append(" " + whereClause);
            sb.Append(" AND userState.\"SEC_ApplicationUserUsername\"=@username AND a.\"isNational\" = false");
            sb.Append(" UNION ALL");
            sb.Append(" SELECT COUNT(*) FROM aipmcostoptimizationscenario AS a LEFT JOIN public.\"Profiling_Running_Record_Graph\" AS b ON a.id = b.\"Plan_ID\" LEFT JOIN public.\"Profiling_Running_Record_Percent\" AS c ON a.id = c.\"Plan_ID\"");
            sb.Append(" " + whereClause + " AND a.\"isNational\"=true");
            sb.Append(") AS a;");

            sb.Append("SELECT * FROM (SELECT a.*, COALESCE(b.\"Status\", 'Not Running') AS \"HistogramStatus\", COALESCE(c.\"Status\", 'Not Running') AS \"ResultStatus\", geoState.\"Name\" AS \"StateName\" FROM aipmcostoptimizationscenario AS a");
            sb.Append(" " + joinClause);
            sb.Append(" " + whereClause);
            sb.Append(" AND userState.\"SEC_ApplicationUserUsername\"=@username AND a.\"isNational\" = false");
            sb.Append(" UNION ALL");
            sb.Append(" SELECT a.*, COALESCE(b.\"Status\", 'Not Running') AS \"HistogramStatus\", COALESCE(c.\"Status\", 'Not Running') AS \"ResultStatus\", 'National' AS \"StateName\" FROM aipmcostoptimizationscenario AS a LEFT JOIN public.\"Profiling_Running_Record_Graph\" AS b ON a.id = b.\"Plan_ID\" LEFT JOIN public.\"Profiling_Running_Record_Percent\" AS c ON a.id = c.\"Plan_ID\"");
            sb.Append(" " + whereClause + " AND a.\"isNational\"=true");
            sb.Append(") AS a");
            sb.Append(" " + sortByClause);
            sb.Append(" LIMIT @PageSize");
            sb.Append(" OFFSET ((@PageNumber - 1) * @PageSize);");

            var db = new NpgsqlConnection(DbHelper.GetConnectingString);
            using var dbResponse = await db.QueryMultipleAsync(sb.ToString(), dynamicParameters);
            var finalPagination = new Pagination<AipmCostOptimizationScenario>
            {
                TotalCount = dbResponse.Read<int>().FirstOrDefault(),
                Items = dbResponse.Read<AipmCostOptimizationScenario>().ToList()
            };
            return finalPagination;
        }

        public static async Task<bool> RunSaveScenario(int scenarioId)
        {
            var runString = "DELETE FROM public.\"Profiling_Running_Record_Graph\" WHERE \"Plan_ID\" = " + scenarioId + ";";
            runString += "DELETE FROM public.\"Profiling_Running_Record_Percent\" WHERE \"Plan_ID\" = " + scenarioId + ";";
            runString += "INSERT INTO public.\"Profiling_Running_Record_Graph\" VALUES (" + scenarioId + ", '" + DateTime.Now.ToString("yyyy-MM-dd") + "', '" + DateTime.Now.ToString("HH:mm:ss") + "', null, 'Waiting');";
            runString += "INSERT INTO public.\"Profiling_Running_Record_Percent\" VALUES (" + scenarioId + ", '" + DateTime.Now.ToString("yyyy-MM-dd") + "', '" + DateTime.Now.ToString("HH:mm:ss") + "', null, 'Waiting');";

            var db = new NpgsqlConnection(DbHelper.GetConnectingString);
            var response = await DbHelper.ExecuteDml(runString);
            if (response)
            {
                var clientHandler = new HttpClientHandler();
                try
                {
                    var json = JsonConvert.SerializeObject("");
                    var data = new StringContent(json, Encoding.UTF8, "application/json");
                    var endPoint = "https://ncpsas-stg.hq.tnb.com.my:8343/SASStoredProcess/do?_program=%2FINET+Data+Management%2F07+STP%2FAIPM%2FCostRiskProfiling&_username=sas.admin&_password=xC9Gz-wgUFfd6UR&plan_id=" + scenarioId;
                    clientHandler.ServerCertificateCustomValidationCallback = (sender, cert, chain, sslPolicyErrors) => true;
                    var client = new HttpClient(clientHandler);
                    client.PostAsync(endPoint, data);
                }
                catch (Exception ex)
                {
                    // ignored the endpoint bugs, since it's always bug
                }
            }

            return response;
        }
        public static async Task<AipmRunChart> RunChart(int scenarioId, AipmCostFilters model)
        {
            var chart = new AipmRunChart
            {
                Status = "Running",
                DurationChart = new AipmRunChartDataDuration
                {
                    Datasets = new List<AipmRunChartDurationDataSet>(),
                    Labels = new List<string>()
                },
                BudgetChart = new AipmRunChartDataBudget
                {
                    Datasets = new List<AipmRunChartBudgetDataSet>(),
                    Labels = new List<string>()
                }
            };

            var runningRecord = await ReadRunningRecord(scenarioId);
            if (runningRecord != null && runningRecord.Status.ToLower() == "complete")
                chart.Status = "Completed";

            if (chart.Status != "Completed")
                return chart;
            var data = (await ReadRunChartData(scenarioId, model)).ToList();
            if (data.Count <= 0)
                return chart;

            foreach (var i in data)
            {
                i.Estimate_Duration = Convert.ToDecimal(i.Estimate_Duration.ToString("n3"));
                i.Estimate_OverBudget_Percent = Convert.ToDecimal(i.Estimate_OverBudget_Percent.ToString("n3"));
            }

            var gData = data.GroupBy(x => new { x.state, x.AreaName, x.Voltage_Type, x.Project_Type, x.Scope });
            foreach (var record in gData)
            {
                var labelText = record.Key.state + "-" + record.Key.AreaName + "-" + record.Key.Project_Type + "-" + record.Key.Voltage_Type + "kV-" + (record.Key.Scope == 1 ? "S1 Land" : (record.Key.Scope == 2 ? "S2 B&C" : (record.Key.Scope == 3 ? "S3 P&M" : (record.Key.Scope == 4 ? "S4 M&L" : ""))));
                chart.DurationChart.Labels.Add(labelText);
                chart.BudgetChart.Labels.Add(labelText);

            }
            var labelData = data.GroupBy(x => x.Confidence_Level);
            //remove confidence level (michael 15 march 2023)
            labelData = labelData.Where(a => a.Key != 1 && a.Key != 5 && a.Key != 10 && a.Key != 90 && a.Key != 95);
            Dictionary<int, string> colors = new Dictionary<int, string>();
            colors.Add(25, "rgb(248,108,107)");
            colors.Add(50, "rgb(248,203,0)");
            colors.Add(75, "rgb(23,162,184)");
            colors.Add(99, "rgb(77,189,116)");
            foreach (var label in labelData)
            {
                var durationDat = label.Select(it => Convert.ToInt32(it.Estimate_Duration)).Select(dummy => dummy).ToList();
                var budgetData = label.Select(it => it.Estimate_OverBudget_Percent).Select(dummy => dummy).ToList();
                chart.DurationChart.Datasets.Add(new AipmRunChartDurationDataSet
                {
                    Label = "Confidence Level " + label.Key,
                    Data = durationDat,
                    //BackgroundColor = "rgb(" + new Random().Next(256) + "," + new Random().Next(256) + "," + new Random().Next(256) + ")"
                    BackgroundColor = colors[label.Key]
                });
                chart.BudgetChart.Datasets.Add(new AipmRunChartBudgetDataSet
                {
                    Label = "Confidence Level " + label.Key,
                    Data = budgetData,
                    //BackgroundColor = "rgb(" + new Random().Next(256) + "," + new Random().Next(256) + "," + new Random().Next(256) + ")"
                    BackgroundColor = colors[label.Key]
                });
            }
            return chart;
        }
        public static async Task<List<ProfilingFinalResultTrans>> RunChartDurationTable(int scenarioId, AipmCostFilters model)
        {
            var commandText = $"SELECT a.*, b.\"AreaName\" FROM public.\"Profiling_Final_Result_Trans\" AS a LEFT JOIN public.\"CFG_BusinessArea\" AS b ON a.business_area = b.\"AreaCode\" WHERE a.\"Plan_ID\"=(@id) AND a.\"VarName\"='Estimate_Duration'";
            if (model.State != null && model.State.Count > 0)
            {
                var states = "";
                states = string.Join("', '", model.State);
                commandText += " AND a.state IN ('" + states + "')";
            }

            if (model.BusinessArea != null && model.BusinessArea.Count > 0)
            {
                var businessArea = "";
                businessArea = string.Join("', '", model.BusinessArea);
                commandText += " AND a.business_area IN ('" + businessArea + "')";
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
            var results = (await DbHelper.ExecuteDql<ProfilingFinalResultTrans>(commandText, parameters)).ToList();

            foreach (var i in results)
            {
                switch (i.Scope)
                {
                    case 1:
                        i.ScopeName = "S1 Land";
                        break;
                    case 2:
                        i.ScopeName = "S2 B&C";
                        break;
                    case 3:
                        i.ScopeName = "S3 P&M";
                        break;
                    case 4:
                        i.ScopeName = "S4 M&L";
                        break;
                }
            }

            //foreach (var result in results)
            //{
            //    result.Confidence_Level_1 = Convert.
            //}

            results = results.OrderBy(x => x.state).OrderBy(x => x.business_area).OrderBy(x => x.Project_Type).OrderBy(x => x.Voltage_Type).OrderBy(x => x.Scope).ToList();

            return results;
        }
        public static async Task<List<ProfilingFinalResultBudgetTrans>> RunChartBudgetTable(int scenarioId, AipmCostFilters model)
        {
            var commandText = $"SELECT a.*, b.\"AreaName\" FROM public.\"Profiling_Final_Result_Trans\" AS a LEFT JOIN public.\"CFG_BusinessArea\" AS b ON a.business_area = b.\"AreaCode\" WHERE a.\"Plan_ID\"=(@id) AND a.\"VarName\"='Estimate_OverBudget_Percent'";
            if (model.State != null && model.State.Count > 0)
            {
                var states = "";
                states = string.Join("', '", model.State);
                commandText += " AND a.state IN ('" + states + "')";
            }

            if (model.BusinessArea != null && model.BusinessArea.Count > 0)
            {
                var businessArea = "";
                businessArea = string.Join("', '", model.BusinessArea);
                commandText += " AND a.business_area IN ('" + businessArea + "')";
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

            var results = (await DbHelper.ExecuteDql<ProfilingFinalResultBudgetTrans>(commandText, parameters)).ToList();

            foreach (var data in results)
            {
                switch (data.Scope)
                {
                    case 1:
                        data.ScopeName = "S1 Land";
                        break;
                    case 2:
                        data.ScopeName = "S2 B&C";
                        break;
                    case 3:
                        data.ScopeName = "S3 P&M";
                        break;
                    case 4:
                        data.ScopeName = "S4 M&L";
                        break;
                }
            }

            results = results.OrderBy(x => x.state).OrderBy(x => x.business_area).OrderBy(x => x.Project_Type).OrderBy(x => x.Voltage_Type).OrderBy(x => x.Scope).ToList();

            return results;
        }
        public static async Task<bool> RunChartBudgetTableUpdate(List<AipmCostResultTableInput> model)
        {
            foreach (var item in model)
            {
                var commandText = $"UPDATE public.\"Profiling_Final_Result_Trans\" " +
                                  $" SET " +
                                  $" \"User_Input\"=(@UserInput)" +
                                  $" WHERE \"Id\" = @recordId";

                var parameters = new
                {
                    UserInput = item.UserInput,
                    recordId = item.Id
                };
                await DbHelper.ExecuteDml(commandText, parameters);
            }
            return true;
        }

        private static async Task<AipmRunningRecord> ReadRunningRecord(int scenarioId)
        {
            var commandText = $"SELECT * FROM public.\"Profiling_Running_Record_Percent\" WHERE \"Plan_ID\"=(@id)";
            var parameters = new { id = scenarioId };
            return (await DbHelper.ExecuteDql<AipmRunningRecord>(commandText, parameters)).FirstOrDefault();
        }
        private static async Task<IEnumerable<ProfilingFinalResult>> ReadRunChartData(int scenarioId, AipmCostFilters model)
        {
            var commandText = $"SELECT a.*, b.\"AreaName\" FROM public.\"Profiling_Final_Result\" AS a LEFT JOIN public.\"CFG_BusinessArea\" AS b ON a.business_area = b.\"AreaCode\" WHERE a.\"Plan_ID\"=(@id)";
            if (model.State != null && model.State.Count > 0)
            {
                var states = "";
                states = string.Join("', '", model.State);
                commandText += " AND a.state IN ('" + states + "')";
            }

            if (model.BusinessArea != null && model.BusinessArea.Count > 0)
            {
                var businessArea = "";
                businessArea = string.Join("', '", model.BusinessArea);
                commandText += " AND a.business_area IN ('" + businessArea + "')";
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
            return (await DbHelper.ExecuteDql<ProfilingFinalResult>(commandText, parameters));
        }

        public static async Task<AipmConfigDurationChart> ConfigDurationChart(AipmCostFilters model)
        {
            var chart = new AipmConfigDurationChart
            {
                Status = "Running",
                ChartData = new List<AipmConfigDurationChartData>()
            };

            var runningRecord = await ReadConfigRunRecord(model.scenarioId);
            if (runningRecord != null && runningRecord.Status.ToLower() == "complete")
                chart.Status = "Completed";

            if (chart.Status != "Completed")
                return chart;

            var durationData = (await ReadConfigDurationChartData(model)).ToList();
            if (durationData.Count <= 0)
                return chart;

            var gDurationData = durationData.GroupBy(x => new { x.State, x.AreaName, x.Business_Area, x.Voltage_Type, x.Project_Type, x.Scope });
            var durationProfilingList = (await ReadConfigDurationChartProfilingData(model.scenarioId)).ToList();
            var durationGoodnessList = (await ReadConfigDurationChartGoodnessData(model.scenarioId)).ToList();
            foreach (var record in gDurationData)
            {
                var cData = new AipmConfigDurationChartData
                {
                    Title = "State : " + record.Key.State + "\n  Business Area : " + record.Key.AreaName + "\n Project Type : " + record.Key.Project_Type + "\n Scope : " + record.Key.Scope,
                    Count = durationData.Where(x => x.State == record.Key.State && x.Business_Area == record.Key.Business_Area && x.Project_Type == record.Key.Project_Type && x.Voltage_Type == record.Key.Voltage_Type && x.Scope == record.Key.Scope).Sum(a => Convert.ToInt32(a._COUNT_)),
                    StateCode = record.Key.State,
                    State = record.Key.State,
                    BusinessAreaCode = record.Key.Business_Area.ToString(),
                    BusinessArea = record.Key.AreaName,
                    Voltage = record.Key.Voltage_Type.ToString(),
                    ProjectType = record.Key.Project_Type,
                    Scope = record.Key.Scope,
                    Labels = new List<decimal>(),
                    BarData = new List<decimal>(),
                    LineData = new List<decimal>(),
                    ParamBudget = durationProfilingList.Where(x =>
                            x.State == record.Key.State &&
                            x.Business_Area == record.Key.Business_Area &&
                            x.Project_Type == record.Key.Project_Type &&
                            x.Voltage_Type == record.Key.Voltage_Type &&
                            x.Scope == record.Key.Scope).ToList(),
                    GoodnessBudget = durationGoodnessList.Where(x =>
                            x.State == record.Key.State &&
                            x.Business_Area == record.Key.Business_Area &&
                            x.Project_Type == record.Key.Project_Type &&
                            x.Voltage_Type == record.Key.Voltage_Type &&
                            x.Scope == record.Key.Scope).ToList(),
                };
                foreach (var item in record)
                {
                    cData.Labels.Add(decimal.Parse(item._MIDPT_.ToString("0.000")));
                    cData.BarData.Add(decimal.Parse(item._OBSPCT_.ToString("0.000")));
                    cData.LineData.Add(decimal.Parse(item._EXPPCT_.ToString("0.000")));
                }
                chart.ChartData.Add(cData);
            }
            return chart;
        }
        private static async Task<AipmRunningRecord> ReadConfigRunRecord(int scenarioId)
        {
            var commandText = $"SELECT * FROM public.\"Profiling_Running_Record_Graph\" WHERE \"Plan_ID\"=(@id)";
            var parameters = new { id = scenarioId };
            return (await DbHelper.ExecuteDql<AipmRunningRecord>(commandText, parameters)).FirstOrDefault();
        }

        private static async Task<IEnumerable<ProfilingHistogramPtBudget>> ReadConfigDurationChartData(AipmCostFilters model)
        {
            var commandText = $"SELECT a.*, b.\"AreaName\" FROM public.\"Profiling_HistogramPt_Dura\" AS a LEFT JOIN public.\"CFG_BusinessArea\" AS b ON a.\"Business_Area\" = b.\"AreaCode\" WHERE a.\"Plan_ID\"=(@id)";
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

            var parameters = new { id = model.scenarioId };
            return (await DbHelper.ExecuteDql<ProfilingHistogramPtBudget>(commandText, parameters));
        }

        private static async Task<IEnumerable<ProfilingParameterBudget>> ReadConfigDurationChartProfilingData(int scenarioId)
        {
            var commandText = $"SELECT * FROM public.\"Profiling_Parameter_Dura\" WHERE \"Plan_ID\"=(@id)";
            var parameters = new { id = scenarioId };
            return (await DbHelper.ExecuteDql<ProfilingParameterBudget>(commandText, parameters));
        }
        private static async Task<IEnumerable<ProfilingGoodnessOfFitBudget>> ReadConfigDurationChartGoodnessData(int scenarioId)
        {
            var commandText = $"SELECT * FROM public.\"Profiling_Goodness_Of_Fit_Dura\" WHERE \"Plan_ID\"=(@id)";
            var parameters = new { id = scenarioId };
            return (await DbHelper.ExecuteDql<ProfilingGoodnessOfFitBudget>(commandText, parameters));
        }

        public static async Task<AipmConfigBudgetChart> ConfigBudgetChart(AipmCostFilters model)
        {
            var chart = new AipmConfigBudgetChart
            {
                Status = "Running",
                ChartData = new List<AipmConfigBudgetChartData>()
            };

            var runningRecord = await ReadConfigRunRecord(model.scenarioId);
            if (runningRecord != null && runningRecord.Status.ToLower() == "complete")
                chart.Status = "Completed";

            if (chart.Status != "Completed")
                return chart;

            var data = (await ReadConfigBudgetChartData(model)).ToList();
            if (data.Count <= 0)
                return chart;


            var gData = data.GroupBy(x => new { x.State, x.Business_Area, x.AreaName, x.Voltage_Type, x.Project_Type, x.Scope });
            var profilingList = (await ReadConfigBudgetChartProfilingData(model.scenarioId)).ToList();
            var goodnessList = (await ReadConfigBudgetChartGoodnessData(model.scenarioId)).ToList();
            foreach (var record in gData)
            {
                var cData = new AipmConfigBudgetChartData
                {
                    Title = "State : " + record.Key.State + "  Business Area : " + record.Key.AreaName + " Project Type : " + record.Key.Project_Type + " Scope : " + record.Key.Scope,
                    Count = data.Where(x => x.State == record.Key.State && x.Business_Area == record.Key.Business_Area && x.Project_Type == record.Key.Project_Type && x.Voltage_Type == record.Key.Voltage_Type && x.Scope == record.Key.Scope).Sum(a => Convert.ToInt32(a._COUNT_)),
                    State = record.Key.State,
                    StateCode = record.Key.State,
                    BusinessAreaCode = record.Key.Business_Area.ToString(),
                    BusinessArea = record.Key.AreaName,
                    Voltage = record.Key.Voltage_Type.ToString(),
                    ProjectType = record.Key.Project_Type,
                    Scope = record.Key.Scope,
                    Labels = new List<decimal>(),
                    BarData = new List<HistogramBarData>(),
                    LineData = new List<decimal>(),
                    ParamBudget = profilingList.Where(x =>
                            x.State == record.Key.State &&
                            x.Business_Area == record.Key.Business_Area &&
                            x.Project_Type == record.Key.Project_Type &&
                            x.Voltage_Type == record.Key.Voltage_Type &&
                            x.Scope == record.Key.Scope).ToList(),
                    GoodnessBudget = goodnessList.Where(x =>
                            x.State == record.Key.State &&
                            x.Business_Area == record.Key.Business_Area &&
                            x.Project_Type == record.Key.Project_Type &&
                            x.Voltage_Type == record.Key.Voltage_Type &&
                            x.Scope == record.Key.Scope).ToList(),
                };
                foreach (var item in record)
                {
                    cData.Labels.Add(decimal.Parse(item._MIDPT_.ToString("0.000")));
                    cData.LineData.Add(decimal.Parse(item._EXPPCT_.ToString("0.000")));
                    var newBarData = new HistogramBarData
                    {
                        x = decimal.Parse(item._MIDPT_.ToString("0.000")),
                        y = decimal.Parse(item._OBSPCT_.ToString("0.000")),
                        Count = int.Parse(item._COUNT_.ToString("0"))
                    };
                    cData.BarData.Add(newBarData);
                    //cData.BarData.Add(decimal.Parse(item._OBSPCT_.ToString("0.000")));
                }
                chart.ChartData.Add(cData);
            }
            return chart;
        }

        private static async Task<IEnumerable<ProfilingHistogramPtDura>> ReadConfigBudgetChartData(AipmCostFilters model)
        {
            var commandText = $"SELECT a.*, b.\"AreaName\" FROM public.\"Profiling_HistogramPt_Budget\" AS a LEFT JOIN public.\"CFG_BusinessArea\" AS b ON a.\"Business_Area\" = b.\"AreaCode\" WHERE a.\"Plan_ID\"=(@id)";
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

            var parameters = new { id = model.scenarioId };
            return (await DbHelper.ExecuteDql<ProfilingHistogramPtDura>(commandText, parameters));
        }
        private static async Task<IEnumerable<ProfilingParameterBudget>> ReadConfigBudgetChartProfilingData(int scenarioId)
        {
            var commandText = $"SELECT * FROM public.\"Profiling_Parameter_Budget\" WHERE \"Plan_ID\"=(@id)";
            var parameters = new { id = scenarioId };
            return (await DbHelper.ExecuteDql<ProfilingParameterBudget>(commandText, parameters));
        }
        private static async Task<IEnumerable<ProfilingGoodnessOfFitBudget>> ReadConfigBudgetChartGoodnessData(int scenarioId)
        {
            var commandText = $"SELECT * FROM public.\"Profiling_Goodness_Of_Fit_Budget\" WHERE \"Plan_ID\"=(@id)";
            var parameters = new { id = scenarioId };
            return (await DbHelper.ExecuteDql<ProfilingGoodnessOfFitBudget>(commandText, parameters));
        }

        public static async Task<Pagination<AipmHistoricalProjectDetails>> HistogramProjectList(AipmHistogramProjectListFilter model)
        {
            var countText = "";
            var commandText = "";
            if (model.Type.ToLower() == "budget")
            {
                //commandText = "SELECT a.*, b.\"AreaName\" AS \"UDCFG_BusinessAreaName\", c.\"Name\" AS \"UDCFG_GeoStateName\", d.\"Scope1Schedule\", d.\"Scope2Schedule\", d.\"Scope3Schedule\", d.\"Scope4Schedule\", d.\"Scope1Budget\", d.\"Scope2Budget\", d.\"Scope3Budget\", d.\"Scope4Budget\", d.\"Scope1ActualCost\", d.\"Scope2ActualCost\", d.\"Scope3ActualCost\", d.\"Scope4ActualCost\" FROM \"MP_Project\" AS a LEFT JOIN public.\"CFG_BusinessArea\" AS b ON a.\"UDCFG_BusinessAreaCode\" = b.\"AreaCode\" LEFT JOIN public.\"CFG_GeoState\" AS c ON a.\"UDCFG_GeoStateCode\" = c.\"Code\" LEFT JOIN public.\"MP_BudgetSchedule\" AS d ON a.\"Id\" = d.\"MP_ProjectId\" " +
                //    "WHERE a.\"ProjectDefinition\" IN (SELECT \"Project_Definition\" FROM public.\"Profiling_Histo_ProjList_Budget\" WHERE \"Plan_ID\"=@id AND \"State\"=@stateCode AND \"Business_Area\"=@businessArea AND \"Voltage_Type\"=@voltageType AND \"Scope\"=@scope AND " +
                //     (model.ProjectType != null ? "\"Project_Type\"=@projectType" : "\"Project_Type\" IS NULL") +
                //    ")";

                commandText = "SELECT a.*, b.\"AreaName\" AS \"BusinessAreaName\", c.\"Name\" AS \"StateName\", d.\"UDProjectDescription\", d.\"ProjectScore\" FROM public.\"Profiling_Histo_ProjList_Budget\" AS a LEFT JOIN public.\"CFG_BusinessArea\" AS b ON a.\"Business_Area\" = b.\"AreaCode\" LEFT JOIN public.\"CFG_GeoState\" AS c ON a.\"State\" = c.\"Code\" LEFT JOIN public.\"MP_Project\" AS d ON a.\"Project_Definition\" = d.\"ProjectDefinition\" WHERE a.\"Plan_ID\"=@id AND a.\"State\"=@stateCode AND a.\"Business_Area\"=@businessArea AND a.\"Voltage_Type\"=@voltageType AND a.\"Scope\"=@scope AND " +
                     (model.ProjectType != null ? "a.\"Project_Type\"=@projectType" : "a.\"Project_Type\" IS NULL");

                //countText = "SELECT COUNT(*) FROM \"MP_Project\" AS a LEFT JOIN public.\"CFG_BusinessArea\" AS b ON a.\"UDCFG_BusinessAreaCode\" = b.\"AreaCode\" LEFT JOIN public.\"CFG_GeoState\" AS c ON a.\"UDCFG_GeoStateCode\" = c.\"Code\" LEFT JOIN public.\"MP_BudgetSchedule\" AS d ON a.\"Id\" = d.\"MP_ProjectId\" " +
                //    "WHERE a.\"ProjectDefinition\" IN (SELECT \"Project_Definition\" FROM public.\"Profiling_Histo_ProjList_Budget\" WHERE \"Plan_ID\"=@id AND \"State\"=@stateCode AND \"Business_Area\"=@businessArea AND \"Voltage_Type\"=@voltageType AND \"Scope\"=@scope AND " +
                //     (model.ProjectType != null ? "\"Project_Type\"=@projectType" : "\"Project_Type\" IS NULL") +
                //    ")";

                countText = "SELECT COUNT(*) FROM public.\"Profiling_Histo_ProjList_Budget\" AS a LEFT JOIN public.\"CFG_BusinessArea\" AS b ON a.\"Business_Area\" = b.\"AreaCode\" LEFT JOIN public.\"CFG_GeoState\" AS c ON a.\"State\" = c.\"Code\" LEFT JOIN public.\"MP_Project\" AS d ON a.\"Project_Definition\" = d.\"ProjectDefinition\" WHERE a.\"Plan_ID\"=@id AND a.\"State\"=@stateCode AND a.\"Business_Area\"=@businessArea AND a.\"Voltage_Type\"=@voltageType AND a.\"Scope\"=@scope AND " +
                     (model.ProjectType != null ? "a.\"Project_Type\"=@projectType" : "a.\"Project_Type\" IS NULL");
            }
            else if (model.Type.ToLower() == "duration")
            {
                //commandText = "SELECT a.*, b.\"AreaName\" AS \"UDCFG_BusinessAreaName\", c.\"Name\" AS \"UDCFG_GeoStateName\", d.\"Scope1Schedule\", d.\"Scope2Schedule\", d.\"Scope3Schedule\", d.\"Scope4Schedule\", d.\"Scope1Budget\", d.\"Scope2Budget\", d.\"Scope3Budget\", d.\"Scope4Budget\", d.\"Scope1ActualCost\", d.\"Scope2ActualCost\", d.\"Scope3ActualCost\", d.\"Scope4ActualCost\" FROM \"MP_Project\" AS a LEFT JOIN public.\"CFG_BusinessArea\" AS b ON a.\"UDCFG_BusinessAreaCode\" = b.\"AreaCode\" LEFT JOIN public.\"CFG_GeoState\" AS c ON a.\"UDCFG_GeoStateCode\" = c.\"Code\" LEFT JOIN public.\"MP_BudgetSchedule\" AS d ON a.\"Id\" = d.\"MP_ProjectId\" " +
                //    "WHERE a.\"ProjectDefinition\" IN (SELECT \"Project_Definition\" FROM public.\"Profiling_Histo_ProjList_Dura\" WHERE \"Plan_ID\"=@id AND \"State\"=@stateCode AND \"Business_Area\"=@businessArea AND \"Voltage_Type\"=@voltageType AND \"Scope\"=@scope AND " +
                //     (model.ProjectType != null ? "\"Project_Type\"=@projectType" : "\"Project_Type\" IS NULL") +
                //    ")";
                //countText = "SELECT COUNT(*) FROM \"MP_Project\" AS a LEFT JOIN public.\"CFG_BusinessArea\" AS b ON a.\"UDCFG_BusinessAreaCode\" = b.\"AreaCode\" LEFT JOIN public.\"CFG_GeoState\" AS c ON a.\"UDCFG_GeoStateCode\" = c.\"Code\" LEFT JOIN public.\"MP_BudgetSchedule\" AS d ON a.\"Id\" = d.\"MP_ProjectId\" " +
                //    "WHERE a.\"ProjectDefinition\" IN (SELECT \"Project_Definition\" FROM public.\"Profiling_Histo_ProjList_Dura\" WHERE \"Plan_ID\"=@id AND \"State\"=@stateCode AND \"Business_Area\"=@businessArea AND \"Voltage_Type\"=@voltageType AND \"Scope\"=@scope AND " +
                //     (model.ProjectType != null ? "\"Project_Type\"=@projectType" : "\"Project_Type\" IS NULL") +
                //    ")";

                commandText = "SELECT a.*, b.\"AreaName\" AS \"BusinessAreaName\", c.\"Name\" AS \"StateName\", d.\"UDProjectDescription\", d.\"ProjectScore\" FROM public.\"Profiling_Histo_ProjList_Dura\" AS a LEFT JOIN public.\"CFG_BusinessArea\" AS b ON a.\"Business_Area\" = b.\"AreaCode\" LEFT JOIN public.\"CFG_GeoState\" AS c ON a.\"State\" = c.\"Code\" LEFT JOIN public.\"MP_Project\" AS d ON a.\"Project_Definition\" = d.\"ProjectDefinition\" WHERE a.\"Plan_ID\"=@id AND a.\"State\"=@stateCode AND a.\"Business_Area\"=@businessArea AND a.\"Voltage_Type\"=@voltageType AND a.\"Scope\"=@scope AND " + (model.ProjectType != null ? "a.\"Project_Type\"=@projectType" : "a.\"Project_Type\" IS NULL");

                countText = "SELECT COUNT(*) FROM public.\"Profiling_Histo_ProjList_Dura\" AS a LEFT JOIN public.\"CFG_BusinessArea\" AS b ON a.\"Business_Area\" = b.\"AreaCode\" LEFT JOIN public.\"CFG_GeoState\" AS c ON a.\"State\" = c.\"Code\" LEFT JOIN public.\"MP_Project\" AS d ON a.\"Project_Definition\" = d.\"ProjectDefinition\" WHERE a.\"Plan_ID\"=@id AND a.\"State\"=@stateCode AND a.\"Business_Area\"=@businessArea AND a.\"Voltage_Type\"=@voltageType AND a.\"Scope\"=@scope AND " +
                     (model.ProjectType != null ? "a.\"Project_Type\"=@projectType" : "a.\"Project_Type\" IS NULL");
            }

            if (model.SortByColumn != null)
            {
                if (model.SortByColumn == "projectDefinition")
                {
                    commandText += " ORDER BY a.\"Project_Definition\" " + model.SortDirection;
                }
            }
            commandText += " LIMIT @PageSize";
            commandText += " OFFSET ((@PageNumber - 1) * @PageSize);";

            var parameters = new { id = model.ScenarioId, stateCode = model.StateCode, businessArea = model.BusinessAreaCode, voltageType = model.VoltageType, projectType = model.ProjectType, scope = model.Scope, PageSize = model.PageSize, PageNumber = model.PageIndex };

            var dataList = (await DbHelper.ExecuteDql<AipmHistoricalProjectDetails>(commandText, parameters)).ToList();

            var returnList = new Pagination<AipmHistoricalProjectDetails>()
            {
                TotalCount = (await DbHelper.ExecuteDql<int>(countText, parameters)).FirstOrDefault(),
                Items = dataList
            };

            return returnList;
        }
    }
}