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
using System.Reflection;
using System.Collections;
using System.Xml;
using Microsoft.Extensions.Configuration;
using static LinqToDB.Reflection.Methods.LinqToDB;
using Google.Protobuf.WellKnownTypes;
using static Dapper.SqlMapper;

namespace Tts.Business.Logic.Aipm
{
    public class AipmPortfolioScenarioManager
    {
        public static async Task<bool> Create(AipmPortfolioScenario record)
        {
            var commandText = $"INSERT INTO public.\"AIPM_PortfolioScenario\" (\"ScenarioName\", \"ScenarioComments\", \"StartYear\", \"StartMonth\", \"EndYear\", \"CreatedBy\", \"CreatedOnUtc\", \"UpdatedBy\", \"UpdatedOnUtc\", \"cycleId\", \"hoza\", \"stateCode\", \"isNational\") " +
                              $"VALUES (@scenarioName, @scenarioComments, @startYear, @startMonth, @endYear, @createdBy, @createdOnUtc, @updatedBy, @updatedOnUtc, @cycleId, @hoza, @stateCode, @isNational)";
            var parameters = new
            {
                cycleId = record.CycleId,
                scenarioName = record.ScenarioName,
                scenarioComments = record.ScenarioComments,
                startYear = record.StartYear,
                startMonth = record.StartMonth,
                endYear = record.EndYear,
                createdBy = record.CreatedBy,
                createdOnUtc = record.CreatedOnUtc,
                updatedBy = record.UpdatedBy,
                updatedOnUtc = record.UpdatedOnUtc,
                hoza = record.Hoza,
                stateCode = record.StateCode,
                isNational = record.IsNational
            };
            var response = await DbHelper.ExecuteDml(commandText, parameters);
            return response;
        }
        private static async Task<bool> BackEndHelper(int scenarioId, int projectId, DateTime startDate, IConfiguration configuration, string SASStoreProc)
        {
            bool response = true;
            var clientHandler = new HttpClientHandler();
            try
            {
                var json = JsonConvert.SerializeObject("");
                var data = new StringContent(json, Encoding.UTF8, "application/json");
                var server = configuration["AIPM:Server"];
                var apiUrl = configuration["AIPM:" + SASStoreProc];
                var username = configuration["AIPM:SASStorProcUser"];
                var password = configuration["AIPM:SASStorProcPassword"];

                var endPoint = server + apiUrl
                    + "&_username=" + username
                    + "&_password=" + password
                    + "&plan_id=" + scenarioId.ToString()
                    + "&project_id=" + projectId.ToString()
                    + "&newStartDate=" + startDate.ToString("yyyy-MM-ddTHH:mm:ss.fffZ");

                clientHandler.ServerCertificateCustomValidationCallback = (sender, cert, chain, sslPolicyErrors) => true;
                var client = new HttpClient(clientHandler);
                var status = await client.PostAsync(endPoint, data);
            }
            catch (Exception ex)
            {
                // ignored the endpoint bugs, since it's always bug
                response = false;
            }

            return response;
        }

        public static async Task<bool> Delete(int id)
        {
            var commandText = $"UPDATE public.\"AIPM_PortfolioScenario\" SET deleted=true WHERE \"Id\" = @id";
            var parameters = new
            {
                id = id
            };
            var response = await DbHelper.ExecuteDml(commandText, parameters);
            return response;
        }

        public static async Task<AipmPortfolioConfig> GetConfigByScenarioId(int scenarioId)
        {
            var scenarioInfoSql = $"SELECT * FROM public.\"AIPM_PortfolioScenario\" WHERE \"Id\"=(@recordid)";
            var scenarioParams = new { recordid = scenarioId };
            var scenarioInfo = (await DbHelper.ExecuteDql<AipmPortfolioScenario>(scenarioInfoSql, scenarioParams)).FirstOrDefault();

            var commandText = $"SELECT * FROM public.\"AIPM_PortfolioConfiguration\" WHERE \"ScenarioId\"=(@recordid) ORDER BY \"Year\" ASC";
            var parameters = new { recordid = scenarioId };
            var configList = (await DbHelper.ExecuteDql<AipmPortfolioConfigDB>(commandText, parameters));

            var numOfYearsText = $"SELECT ((\"EndYear\" - \"StartYear\") + 1) FROM public.\"AIPM_PortfolioScenario\" WHERE \"Id\"=(@recordid)";
            var numOfYearsParams = new { recordid = scenarioId };
            var numOfYears = (await DbHelper.ExecuteDql<int>(numOfYearsText, numOfYearsParams)).FirstOrDefault();

            var model = new AipmPortfolioConfig
            {
                ScenarioId = scenarioInfo.Id,
                MinNPV = scenarioInfo.MinNPV,
                ScenarioComments = scenarioInfo.ScenarioComments,
                NumOfYears = numOfYears,
                YearBudget = new List<AipmPortfolioConfigYear>()
            };
            foreach (var row in configList)
            {
                var nYB = new AipmPortfolioConfigYear
                {
                    Year = row.Year,
                    Budget = row.Budget
                };

                model.YearBudget.Add(nYB);
            }

            return model;
        }

        public static async Task<List<Dictionary<string, object>>> GetBusinessArea(string state)
        {
            if (state == "national")
            {
                var commandText = "SELECT s.\"Name\" AS \"state\" , b.\"AreaName\" AS \"businessArea\" FROM public.\"CFG_BusinessArea\" AS b INNER JOIN public.\"CFG_GeoState\" AS s ON s.\"Code\" = b.\"CFG_GeoStateCode\" ORDER BY \"Name\", \"businessArea\"";

                var result = await DbHelper.ExecuteDql(commandText);
                return result.ToList();
            }
            else
            {
                var commandText = "SELECT s.\"Name\" AS \"state\" , b.\"AreaName\" AS \"businessArea\" FROM public.\"CFG_BusinessArea\" AS b INNER JOIN public.\"CFG_GeoState\" AS s ON s.\"Code\" = b.\"CFG_GeoStateCode\" WHERE b.\"CFG_GeoStateCode\" = (@state) ORDER BY \"state\", \"businessArea\"";

                var parameters = new { state };
                var result = await DbHelper.ExecuteDql(commandText, parameters);
                return result.ToList();
            }
        }
        public static async Task<bool> SaveConfig(AipmPortfolioConfig record)
        {
            var updateScenario = "UPDATE public.\"AIPM_PortfolioScenario\" SET \"ScenarioComments\" = '" + record.ScenarioComments +
                "', \"MinNPV\" = '" + record.MinNPV +
                "', \"UpdatedBy\" = '" + record.UpdatedBy + "', \"UpdatedOnUtc\" = '" + record.UpdatedOnUtc.ToString("yyyy-MM-dd HH:mm:ss") + "' WHERE \"Id\" = " + record.ScenarioId;
            await DbHelper.ExecuteDml(updateScenario, null);

            var dynamicParameters = new DynamicParameters();
            var commandText2 = $"SELECT * FROM public.\"AIPM_PortfolioConfiguration\" WHERE \"ScenarioId\" = @scenarioId";
            dynamicParameters.Add("@scenarioId", record.ScenarioId);
            var data = (await DbHelper.ExecuteDql<AipmPortfolioConfig>(commandText2, dynamicParameters)).ToList();

            if (data.Count > 0)
            {
                var updateString = "";
                foreach (var i in record.YearBudget)
                {
                    if (updateString != "")
                        updateString += "; ";

                    if (i.Budget != null)
                        updateString += "UPDATE public.\"AIPM_PortfolioConfiguration\" SET \"Budget\" = " +
                                        i.Budget.Value + ", \"UpdatedBy\" = '" + record.UpdatedBy +
                                        "', \"UpdatedOnUtc\" = '" +
                                        record.UpdatedOnUtc.ToString("yyyy-MM-dd HH:mm:ss") +
                                        "' WHERE \"ScenarioId\" = " + record.ScenarioId + " AND \"Year\" = " + i.Year;
                    else
                        updateString += "UPDATE public.\"AIPM_PortfolioConfiguration\" SET \"Budget\" = NULL,\"UpdatedBy\" = '" + record.UpdatedBy +
                                        "', \"UpdatedOnUtc\" = '" +
                                        record.UpdatedOnUtc.ToString("yyyy-MM-dd HH:mm:ss") +
                                        "' WHERE \"ScenarioId\" = " + record.ScenarioId + " AND \"Year\" = " + i.Year;

                }

                var response = await DbHelper.ExecuteDml(updateString, null);
                return response;
            }
            else
            {
                var commandText = $"INSERT INTO public.\"AIPM_PortfolioConfiguration\" (\"ScenarioId\", \"Year\", \"Budget\", \"CreatedBy\", \"CreatedOnUtc\", \"UpdatedBy\", \"UpdatedOnUtc\") VALUES ";

                var values = "";
                foreach (var i in record.YearBudget)
                {
                    if (values != "")
                        values += ", ";
                    if (i.Budget != null)
                        values += "(" + record.ScenarioId + ", " + i.Year + ", " + i.Budget + ", '" + record.CreatedBy + "', '" + record.CreatedOnUtc.ToString("yyyy-MM-dd HH:mm:ss") + "', '" + record.UpdatedBy + "', '" + record.UpdatedOnUtc.ToString("yyyy-MM-dd HH:mm:ss") + "')";
                    else
                        values += "(" + record.ScenarioId + ", " + i.Year + ", NULL,'" + record.CreatedBy + "', '" + record.CreatedOnUtc.ToString("yyyy-MM-dd HH:mm:ss") + "', '" + record.UpdatedBy + "', '" + record.UpdatedOnUtc.ToString("yyyy-MM-dd HH:mm:ss") + "')";


                }

                commandText += values;

                var response = await DbHelper.ExecuteDml(commandText, null);
                return response;
            }
        }        

        public static async Task<AipmPortfolioScenario> ReadById(int id)
        {
            var commandText = $"SELECT * FROM public.\"AIPM_PortfolioScenario\" WHERE \"Id\"=(@recordid)";
            var parameters = new { recordid = id };
            return (await DbHelper.ExecuteDql<AipmPortfolioScenario>(commandText, parameters)).FirstOrDefault();
        }
        public static async Task<AipmPortfolioScenario> ReadByName(string name)
        {
            var commandText = $"SELECT * FROM public.\"AIPM_PortfolioScenario\" WHERE \"ScenarioName\" = '" + name + "'";
            return (await DbHelper.ExecuteDql<AipmPortfolioScenario>(commandText)).FirstOrDefault();
        }
        public static async Task<Pagination<AipmPortfolioScenario>> List(AipmPortfolioScenarioSearch search, string username)
        {
            var joinClause = new StringBuilder();
            var dynamicParameters = new DynamicParameters();
            var whereClause = new StringBuilder();
            var sortByClause = string.Empty;

            if (!string.IsNullOrEmpty(search.SortByColumn) && !string.IsNullOrEmpty(search.SortDirection))
            {
                var column = "";
                if (search.SortByColumn == "scenarioName")
                    column = "ScenarioName";

                if (search.SortByColumn == "startYear")
                    column = "StartYear";

                sortByClause = " ORDER BY a.\"" + column + "\" " + search.SortDirection.ToUpper();
            }

            if (!string.IsNullOrEmpty(sortByClause))
            {
                sortByClause += ", a.\"CreatedOnUtc\" DESC";
            }
            else
            {
                sortByClause += "ORDER BY a.\"CreatedOnUtc\" DESC";
            }

            whereClause.Append(" WHERE a.deleted=false AND a.\"cycleId\"=@cycleId");
            if (search.StartYear != null && search.StartYear != 0)
                whereClause.Append(" AND a.\"StartYear\"=" + search.StartYear);
            if (search.ScenarioName != null && search.ScenarioName != "")
                whereClause.Append(" AND a.\"ScenarioName\" LIKE '%" + search.ScenarioName + "%'");
            if (search.ScenarioId != null && search.ScenarioId != 0)
                whereClause.Append(" AND a.\"Id\" != " + search.ScenarioId + " ");

            if (!string.IsNullOrEmpty(search.SearchKey) && !string.IsNullOrEmpty(search.SearchValue))
            {
                if (search.SearchKey.IsContain("scenarioname"))
                    whereClause.Append(" AND a.\"ScenarioName\" LIKE '%" + search.SearchValue + "%'");
            }

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

            dynamicParameters.Add("@username", username);
            dynamicParameters.Add("@cycleId", search.CycleId, DbType.Int32);
            dynamicParameters.Add("@PageSize", search.PageSize, DbType.Int32);
            dynamicParameters.Add("@PageNumber", search.PageIndex, DbType.Int32);

            joinClause.Append("LEFT JOIN public.\"PortfolioOpt_Running_Record\" AS b ON a.\"Id\" = b.\"Plan_ID\" INNER JOIN public.\"CFG_GeoState\" AS geoState ON a.\"stateCode\" = geoState.\"Code\" INNER JOIN public.\"SEC_ApplicationUserStateMapping\" AS userState ON a.\"stateCode\" = userState.\"CFG_GeoStateCode\"");

            var sb = new StringBuilder();            
            sb.Append(" SELECT SUM(\"count\") FROM (SELECT COUNT (*) FROM public.\"AIPM_PortfolioScenario\" AS a");
            sb.Append(" " + joinClause);
            sb.Append(" " + whereClause);
            sb.Append(" AND userState.\"SEC_ApplicationUserUsername\"=@username AND a.\"isNational\" = false");
            sb.Append(" UNION ALL");
            sb.Append(" SELECT COUNT(*) FROM public.\"AIPM_PortfolioScenario\" AS a LEFT JOIN public.\"PortfolioOpt_Running_Record\" AS b ON a.\"Id\" = b.\"Plan_ID\"");
            sb.Append(" " + whereClause + " AND a.\"isNational\"=true");
            sb.Append(") AS a;");

            sb.Append("SELECT * FROM (SELECT a.*, COALESCE(b.\"Status\", 'Not Running') AS \"ResultStatus\", geoState.\"Name\" AS \"StateName\" FROM public.\"AIPM_PortfolioScenario\" AS a");
            sb.Append(" " + joinClause);
            sb.Append(" " + whereClause);
            sb.Append(" AND userState.\"SEC_ApplicationUserUsername\"=@username AND a.\"isNational\" = false");
            sb.Append(" UNION ALL");
            sb.Append(" SELECT a.*, COALESCE(b.\"Status\", 'Not Running') AS \"ResultStatus\", 'National' AS \"StateName\" FROM public.\"AIPM_PortfolioScenario\" AS a LEFT JOIN public.\"PortfolioOpt_Running_Record\" AS b ON a.\"Id\" = b.\"Plan_ID\"");
            sb.Append(" " + whereClause + " AND a.\"isNational\"=true");
            sb.Append(") AS a");
            sb.Append(" left join (SELECT \"Plan_ID\", case when (sum(\"TCO_Opex\") + sum(\"TCO_TotalProjectCost\") <> 0) then sum(\"NPV_RiskReduced\")/(sum(\"TCO_Opex\")+sum(\"TCO_TotalProjectCost\"))/1000000 else null end as TotProjectScore, count(distinct \"Project_ID\") as Cnt FROM (SELECT \"Plan_ID\", \"Project_ID\", \"Project_Definition\", \"TCO_Opex\", \"TCO_TotalProjectCost\", \"NPV_RiskReduced\", CASE WHEN \"Defer_ID\" IS NOT NULL THEN 'Prioritised' WHEN \"Defer\" IS TRUE AND \"Defer_ID\" IS NULL THEN 'Cancelled' ELSE 'Deferred' END AS prjTyp FROM public.\"PortfolioOpt_Approved_Proj\" UNION ALL SELECT \"Plan_ID\", \"Project_ID\", \"Project_Definition\", \"TCO_Opex\", \"TCO_TotalProjectCost\", \"NPV_RiskReduced\", 'Alternate' AS prjTyp FROM public.\"PortfolioOpt_Alternate_Proj\") as a WHERE prjtyp in ('Prioritised', 'Deferred', 'Alternate') group by \"Plan_ID\") as p on a.\"Id\" = p.\"Plan_ID\"");
            sb.Append(" " + sortByClause);
            sb.Append(" LIMIT @PageSize");
            sb.Append(" OFFSET ((@PageNumber - 1) * @PageSize);");

            var db = new NpgsqlConnection(DbHelper.GetConnectingString);
            using var dbResponse = await db.QueryMultipleAsync(sb.ToString(), dynamicParameters);
            var finalPagination = new Pagination<AipmPortfolioScenario>
            {
                TotalCount = dbResponse.Read<int>().FirstOrDefault(),
                Items = dbResponse.Read<AipmPortfolioScenario>().ToList()
            };
            return finalPagination;
        }
        public static async Task<Pagination<AipmPortfolioScenario>> ListWithResult(AipmPortfolioScenarioSearch search, string username)
        {
            var joinClause = new StringBuilder();
            var dynamicParameters = new DynamicParameters();
            var whereClause = new StringBuilder();
            var sortByClause = string.Empty;

            if (!string.IsNullOrEmpty(search.SortByColumn) && !string.IsNullOrEmpty(search.SortDirection))
            {
                var column = "";
                if (search.SortByColumn == "scenarioName")
                    column = "ScenarioName";

                if (search.SortByColumn == "startYear")
                    column = "StartYear";

                sortByClause = " ORDER BY a.\"" + column + "\" " + search.SortDirection.ToUpper();
            }

            if (!string.IsNullOrEmpty(sortByClause))
            {
                sortByClause += ", a.\"CreatedOnUtc\" DESC";
            }
            else
            {
                sortByClause += "ORDER BY a.\"CreatedOnUtc\" DESC";
            }

            whereClause.Append(" WHERE a.deleted=false AND a.\"cycleId\"=@cycleId");
            if (search.StartYear != null && search.StartYear != 0)
                whereClause.Append(" AND a.\"StartYear\"=" + search.StartYear);
            if (search.ScenarioName != null && search.ScenarioName != "")
                whereClause.Append(" AND a.\"ScenarioName\" LIKE '%" + search.ScenarioName + "%'");
            if (search.ScenarioId != null && search.ScenarioId != 0)
                whereClause.Append(" AND a.\"Id\" != " + search.ScenarioId + " ");

            if (!string.IsNullOrEmpty(search.SearchKey) && !string.IsNullOrEmpty(search.SearchValue))
            {
                if (search.SearchKey.IsContain("scenarioname"))
                    whereClause.Append(" AND a.\"ScenarioName\" LIKE '%" + search.SearchValue + "%'");
            }

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

            dynamicParameters.Add("@username", username);
            dynamicParameters.Add("@cycleId", search.CycleId, DbType.Int32);
            //dynamicParameters.Add("@PageSize", search.PageSize, DbType.Int32);
            //dynamicParameters.Add("@PageNumber", search.PageIndex, DbType.Int32);

            joinClause.Append("INNER JOIN public.\"PortfolioOpt_Running_Record\" AS b ON b.\"Status\" = 'Complete' AND a.\"Id\" = b.\"Plan_ID\" INNER JOIN public.\"CFG_GeoState\" AS geoState ON a.\"stateCode\" = geoState.\"Code\" INNER JOIN public.\"SEC_ApplicationUserStateMapping\" AS userState ON a.\"stateCode\" = userState.\"CFG_GeoStateCode\"");

            var sb = new StringBuilder();
            sb.Append(" SELECT SUM(\"count\") FROM (SELECT COUNT (*) FROM public.\"AIPM_PortfolioScenario\" AS a");
            sb.Append(" " + joinClause);
            sb.Append(" " + whereClause);
            sb.Append(" AND userState.\"SEC_ApplicationUserUsername\"=@username AND a.\"isNational\" = false");
            sb.Append(" UNION ALL");
            sb.Append(" SELECT COUNT(*) FROM public.\"AIPM_PortfolioScenario\" AS a INNER JOIN public.\"PortfolioOpt_Running_Record\" AS b ON b.\"Status\" = 'Complete' AND a.\"Id\" = b.\"Plan_ID\"");
            sb.Append(" " + whereClause + " AND a.\"isNational\"=true");
            sb.Append(") AS a;");

            sb.Append("SELECT * FROM (SELECT a.*, COALESCE(b.\"Status\", 'Not Running') AS \"ResultStatus\", geoState.\"Name\" AS \"StateName\" FROM public.\"AIPM_PortfolioScenario\" AS a");
            sb.Append(" " + joinClause);
            sb.Append(" " + whereClause);
            sb.Append(" AND userState.\"SEC_ApplicationUserUsername\"=@username AND a.\"isNational\" = false");
            sb.Append(" UNION ALL");
            sb.Append(" SELECT a.*, COALESCE(b.\"Status\", 'Not Running') AS \"ResultStatus\", 'National' AS \"StateName\" FROM public.\"AIPM_PortfolioScenario\" AS a INNER JOIN public.\"PortfolioOpt_Running_Record\" AS b ON b.\"Status\" = 'Complete' AND a.\"Id\" = b.\"Plan_ID\"");
            sb.Append(" " + whereClause + " AND a.\"isNational\"=true");
            sb.Append(") AS a");
            sb.Append(" " + sortByClause);
            //sb.Append(" LIMIT @PageSize");
            //sb.Append(" OFFSET ((@PageNumber - 1) * @PageSize);");

            var db = new NpgsqlConnection(DbHelper.GetConnectingString);
            using var dbResponse = await db.QueryMultipleAsync(sb.ToString(), dynamicParameters);
            var finalPagination = new Pagination<AipmPortfolioScenario>
            {
                TotalCount = dbResponse.Read<int>().FirstOrDefault(),
                Items = dbResponse.Read<AipmPortfolioScenario>().ToList()
            };
            return finalPagination;
        }

        public static async Task<Pagination<AipmPortfolioScenario>> ImportList(AipmPortfolioScenarioSearch search)
        {
            var db = new NpgsqlConnection(DbHelper.GetConnectingString);
            var joinClause = new StringBuilder();
            var dynamicParameters = new DynamicParameters();
            var whereClause = new StringBuilder();
            var sortByClause = string.Empty;

            var currentScenarioSql = await db.QueryMultipleAsync("SELECT * FROM public.\"AIPM_PortfolioScenario\" WHERE \"Id\" = " + search.ScenarioId);
            var currentScenario = currentScenarioSql.Read<AipmPortfolioScenario>().FirstOrDefault();

            if (!string.IsNullOrEmpty(search.SortByColumn) && !string.IsNullOrEmpty(search.SortDirection))
            {
                var column = "";
                if (search.SortByColumn == "scenarioName")
                    column = "ScenarioName";

                if (search.SortByColumn == "startYear")
                    column = "StartYear";

                sortByClause = " ORDER BY a.\"" + column + "\" " + search.SortDirection.ToUpper();
            }

            if (!string.IsNullOrEmpty(sortByClause))
            {
                sortByClause += ", a.\"CreatedOnUtc\" DESC";
            }
            else
            {
                sortByClause += "ORDER BY a.\"CreatedOnUtc\" DESC";
            }

            whereClause.Append(" WHERE a.deleted=false AND a.\"cycleId\"=@cycleId");
            if (search.StartYear != null && search.StartYear != 0)
                whereClause.Append(" AND a.\"StartYear\"=" + search.StartYear);
            if (search.ScenarioName != null && search.ScenarioName != "")
                whereClause.Append(" AND a.\"ScenarioName\" LIKE '%" + search.ScenarioName + "%'");
            if (search.ScenarioId != null && search.ScenarioId != 0)
                whereClause.Append(" AND a.\"Id\" != " + search.ScenarioId + " ");

            if (!string.IsNullOrEmpty(search.SearchKey) && !string.IsNullOrEmpty(search.SearchValue))
            {
                if (search.SearchKey.IsContain("scenarioname"))
                    whereClause.Append(" AND a.\"ScenarioName\" LIKE '%" + search.SearchValue + "%'");
            }

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

            if (currentScenario.StateCode != null && currentScenario.StateCode != "")
            {
                whereClause.Append(" AND a.\"stateCode\" = @stateCode");
                dynamicParameters.Add("@stateCode", currentScenario.StateCode);
            }

            dynamicParameters.Add("@cycleId", search.CycleId, DbType.Int32);
            dynamicParameters.Add("@PageSize", search.PageSize, DbType.Int32);
            dynamicParameters.Add("@PageNumber", search.PageIndex, DbType.Int32);

            joinClause.Append("LEFT JOIN public.\"PortfolioOpt_Running_Record\" AS b ON a.\"Id\" = b.\"Plan_ID\" INNER JOIN public.\"CFG_GeoState\" AS geoState ON a.\"stateCode\" = geoState.\"Code\"");

            var sb = new StringBuilder();
            sb.Append(" SELECT SUM(\"count\") FROM (SELECT COUNT (*) FROM public.\"AIPM_PortfolioScenario\" AS a");
            sb.Append(" " + joinClause);
            sb.Append(" " + whereClause);
            if (currentScenario.StateCode == null || currentScenario.StateCode == "")
            {
                sb.Append(" UNION ALL");
                sb.Append(" SELECT COUNT(*) FROM public.\"AIPM_PortfolioScenario\" AS a LEFT JOIN public.\"PortfolioOpt_Running_Record\" AS b ON a.\"Id\" = b.\"Plan_ID\" WHERE a.deleted=false AND a.\"isNational\"=true AND a.\"cycleId\"=@cycleId");
            }
            sb.Append(") AS a;");

            sb.Append("SELECT * FROM (SELECT a.*, COALESCE(b.\"Status\", 'Not Running') AS \"ResultStatus\", geoState.\"Name\" AS \"StateName\" FROM public.\"AIPM_PortfolioScenario\" AS a");
            sb.Append(" " + joinClause);
            sb.Append(" " + whereClause);
            if (currentScenario.StateCode == null || currentScenario.StateCode == "")
            {
                sb.Append(" UNION ALL");
                sb.Append(" SELECT a.*, COALESCE(b.\"Status\", 'Not Running') AS \"ResultStatus\", 'National' AS \"StateName\" FROM public.\"AIPM_PortfolioScenario\" AS a LEFT JOIN public.\"PortfolioOpt_Running_Record\" AS b ON a.\"Id\" = b.\"Plan_ID\" WHERE a.deleted=false AND a.\"isNational\"=true AND a.\"cycleId\"=@cycleId");
            }
            sb.Append(") AS a");
            sb.Append(" " + sortByClause);
            sb.Append(" LIMIT @PageSize");
            sb.Append(" OFFSET ((@PageNumber - 1) * @PageSize);");

            using var dbResponse = await db.QueryMultipleAsync(sb.ToString(), dynamicParameters);
            var finalPagination = new Pagination<AipmPortfolioScenario>
            {
                TotalCount = dbResponse.Read<int>().FirstOrDefault(),
                Items = dbResponse.Read<AipmPortfolioScenario>().ToList()
            };
            return finalPagination;
        }

        public static async Task<bool> Run(AipmPortfolioRunScenario model)
        {
            var runString = "DELETE FROM public.\"PortfolioOpt_Running_Record\" WHERE \"Plan_ID\" = " + model.ScenarioId + ";";
            runString += "INSERT INTO public.\"PortfolioOpt_Running_Record\" VALUES (" + model.ScenarioId + ", '" + DateTime.Now.ToString("yyyy-MM-dd") + "', '" + DateTime.Now.ToString("HH:mm:ss") + "', null, 'Waiting')";
            var response = await DbHelper.ExecuteDml(runString);
            if (response)
            {
                var clientHandler = new HttpClientHandler();
                try
                {
                    var json = JsonConvert.SerializeObject("");
                    var data = new StringContent(json, Encoding.UTF8, "application/json");
                    var endPoint = "https://ncpsas-stg.hq.tnb.com.my:8343/SASStoredProcess/do?_program=%2FINET+Data+Management%2F07+STP%2FAIPM%2FPortfolio_Optimization&_username=sas.admin&_password=xC9Gz-wgUFfd6UR&plan_id=" + model.ScenarioId;
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

        public static async Task<bool> RunAlternate(AipmPortfolioRunScenario model)
        {
            var runString = "DELETE FROM public.\"PortfolioOpt_Alternate_Run_Rec\" WHERE \"Plan_ID\" = " + model.ScenarioId + ";";
            runString += "INSERT INTO public.\"PortfolioOpt_Alternate_Run_Rec\" VALUES (" + model.ScenarioId + ", '" + DateTime.Now.ToString("yyyy-MM-dd") + "', '" + DateTime.Now.ToString("HH:mm:ss") + "', null, 'Waiting')";
            var response = await DbHelper.ExecuteDml(runString);
            if (response)
            {
                var clientHandler = new HttpClientHandler();
                try
                {
                    var json = JsonConvert.SerializeObject("");
                    var data = new StringContent(json, Encoding.UTF8, "application/json");
                    var endPoint = "https://ncpsas-stg.hq.tnb.com.my:8343/SASStoredProcess/do?_program=%2FINET+Data+Management%2F07+STP%2FAIPM%2FPortfolio_AlternateProj&_username=sas.admin&_password=xC9Gz-wgUFfd6UR&plan_id=" + model.ScenarioId;
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

        public static async Task<IEnumerable<PortfolioOptSummaryResult>> PortfolioResultsSummary(int scenarioId, AipmPortfolioResultFilter filter)
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

            if (filter.SubObjective != null && filter.SubObjective.Count > 0)
            {
                var subObjective = string.Join("', '", filter.SubObjective);
                where += " AND b.\"UDIBRNarrativeMR\" IN ('" + subObjective + "')";
            }

            if (filter.SubObjectiveHPA != null && filter.SubObjectiveHPA.Count > 0)
            {
                var subOjectiveHPA = string.Join("', '", filter.SubObjectiveHPA);
                where += " AND b.\"UDIBRNarrativeHPA\" IN ('" + subOjectiveHPA + "')";
            }

            if (filter.Voltage != null && filter.Voltage.Count > 0)
            {
                var voltage = string.Join("', '", filter.Voltage);
                where += " AND b.\"UDVoltagekV\" IN ('" + voltage + "')";
            }
            /*
            var approvedSql = $"SELECT COALESCE(SUM(a.\"Budget_Before_Revised\"), 0.00) AS \"BudgetBeforeRevised\", COALESCE(SUM(a.\"Total_Budget\"), 0.00) AS \"TotalBudget\", COALESCE(SUM(a.\"Project_Score\"), 0.00) AS \"ProjectScore\", COALESCE(SUM(a.\"TCO_Opex\"), 0.00)*1000000 AS \"TCOOpex\", COALESCE(SUM(a.\"TCO_TotalProjectCost\"), 0.00)*1000000 AS \"TCOTotalProjectCost\", COALESCE(SUM(a.\"NPV_RiskReduced\"), 0.00) AS \"NPVRiskReduced\", COALESCE(SUM(a.\"Risk_Reduced\"), 0.00)*1000000 AS \"RiskReduced\", COALESCE(SUM(a.\"BUDY1\"), 0.00) AS \"BUDY1\", COALESCE(SUM(a.\"BUDY2\"), 0.00) AS \"BUDY2\", COALESCE(SUM(a.\"BUDY3\"), 0.00) AS \"BUDY3\", COALESCE(SUM(a.\"BUDY4\"), 0.00) AS \"BUDY4\", COALESCE(SUM(a.\"BUDY5\"), 0.00) AS \"BUDY5\", COALESCE(SUM(a.\"BUDY6\"), 0.00) AS \"BUDY6\", COALESCE(SUM(a.\"BUDY7\"), 0.00) AS \"BUDY7\", COALESCE(SUM(a.\"BUDY8\"), 0.00) AS \"BUDY8\", COUNT(*) AS \"TotalProject\" FROM public.\"PortfolioOpt_Approved_Proj\" AS a INNER JOIN public.\"MP_Project\" AS b ON a.\"Project_ID\" = b.\"Id\" WHERE a.\"Plan_ID\"=(@id)" + where;
            var approvedParams = new { id = scenarioId };
            */

            /*
            var approvedSql = $"SELECT COALESCE(SUM(a.\"Budget_Before_Revised\"), 0.00) AS \"BudgetBeforeRevised\", COALESCE(SUM(a.\"Total_Budget\"), 0.00) AS \"TotalBudget\", COALESCE(SUM(a.\"Project_Score\"), 0.00) AS \"ProjectScore\", COALESCE(SUM(a.\"TCO_Opex\"), 0.00)*1000000 AS \"TCOOpex\", COALESCE(SUM(a.\"TCO_TotalProjectCost\"), 0.00)*1000000 AS \"TCOTotalProjectCost\", COALESCE(SUM(a.\"NPV_RiskReduced\"), 0.00) AS \"NPVRiskReduced\", COALESCE(SUM(a.\"Risk_Reduced\"), 0.00)*1000000 AS \"RiskReduced\", COALESCE(SUM(a.\"BUDY1\"), 0.00) AS \"BUDY1\", COALESCE(SUM(a.\"BUDY2\"), 0.00) AS \"BUDY2\", COALESCE(SUM(a.\"BUDY3\"), 0.00) AS \"BUDY3\", COALESCE(SUM(a.\"BUDY4\"), 0.00) AS \"BUDY4\", COALESCE(SUM(a.\"BUDY5\"), 0.00) AS \"BUDY5\", COALESCE(SUM(a.\"BUDY6\"), 0.00) AS \"BUDY6\", COALESCE(SUM(a.\"BUDY7\"), 0.00) AS \"BUDY7\", COALESCE(SUM(a.\"BUDY8\"), 0.00) AS \"BUDY8\", COUNT(*) AS \"TotalProject\" FROM (\r\n\tSELECT \r\n\t\t\"Plan_ID\", \"Project_ID\", \r\n\t\t\"Budget_Before_Revised\", \"Total_Budget\", \"Project_Score\", \"TCO_Opex\", \"TCO_TotalProjectCost\", \"NPV_RiskReduced\",\r\n\t\t\"Risk_Reduced\", \"BUDY1\", \"BUDY2\", \"BUDY3\", \"BUDY4\", \"BUDY5\", \"BUDY6\", \"BUDY7\", \"BUDY8\"\r\n\tFROM public.\"PortfolioOpt_Approved_Proj\" where \"Plan_ID\"=(@id1) and (\"Defer\"=false or \"Defer\" is null)\r\n\tUNION\r\n\tSELECT\r\n\t\t\"Plan_ID\", \"Project_ID\", \r\n\t\t\"Budget_Before_Revised\", \"Total_Budget\", \"Project_Score\", \"TCO_Opex\", \"TCO_TotalProjectCost\", \"NPV_RiskReduced\",\r\n\t\t\"Risk_Reduced\", \"BUDY1\", \"BUDY2\", \"BUDY3\", \"BUDY4\", \"BUDY5\", \"BUDY6\", \"BUDY7\", \"BUDY8\"\r\n\tFROM public.\"PortfolioOpt_Deferred_Proj\" where \"ID\" in (\r\n\t\tSELECT \"Defer_ID\" from public.\"PortfolioOpt_Approved_Proj\" where \"Plan_ID\"=(@id2)\r\n\t)\r\n) AS a INNER JOIN public.\"MP_Project\" AS b ON a.\"Project_ID\" = b.\"Id\" WHERE a.\"Plan_ID\"=(@id)" + where;
            */
            // To include cancelled into Prioritised category
            var approvedSql = $"SELECT COALESCE(SUM(a.\"Budget_Before_Revised\"), 0.00) AS \"BudgetBeforeRevised\", COALESCE(SUM(a.\"Total_Budget\"), 0.00) AS \"TotalBudget\", COALESCE(SUM(a.\"Project_Score\"), 0.00) AS \"ProjectScore\", COALESCE(SUM(a.\"TCO_Opex\"), 0.00)*1000000 AS \"TCOOpex\", COALESCE(SUM(a.\"TCO_TotalProjectCost\"), 0.00)*1000000 AS \"TCOTotalProjectCost\", COALESCE(SUM(a.\"NPV_RiskReduced\"), 0.00) AS \"NPVRiskReduced\", COALESCE(SUM(a.\"Risk_Reduced\"), 0.00)*1000000 AS \"RiskReduced\", COALESCE(SUM(a.\"BUDY1\"), 0.00) AS \"BUDY1\", COALESCE(SUM(a.\"BUDY2\"), 0.00) AS \"BUDY2\", COALESCE(SUM(a.\"BUDY3\"), 0.00) AS \"BUDY3\", COALESCE(SUM(a.\"BUDY4\"), 0.00) AS \"BUDY4\", COALESCE(SUM(a.\"BUDY5\"), 0.00) AS \"BUDY5\", COALESCE(SUM(a.\"BUDY6\"), 0.00) AS \"BUDY6\", COALESCE(SUM(a.\"BUDY7\"), 0.00) AS \"BUDY7\", COALESCE(SUM(a.\"BUDY8\"), 0.00) AS \"BUDY8\", COUNT(*) AS \"TotalProject\" FROM (\r\n\tSELECT \r\n\t\t\"Plan_ID\", \"Project_ID\", \r\n\t\t\"Budget_Before_Revised\", \"Total_Budget\", \"Project_Score\", \"TCO_Opex\", \"TCO_TotalProjectCost\", \"NPV_RiskReduced\",\r\n\t\t\"Risk_Reduced\", \"BUDY1\", \"BUDY2\", \"BUDY3\", \"BUDY4\", \"BUDY5\", \"BUDY6\", \"BUDY7\", \"BUDY8\"\r\n\tFROM public.\"PortfolioOpt_Approved_Proj\" where \"Plan_ID\"=(@id1) and \"Defer_ID\" is null\r\n\tUNION\r\n\tSELECT\r\n\t\t\"Plan_ID\", \"Project_ID\", \r\n\t\t\"Budget_Before_Revised\", \"Total_Budget\", \"Project_Score\", \"TCO_Opex\", \"TCO_TotalProjectCost\", \"NPV_RiskReduced\",\r\n\t\t\"Risk_Reduced\", \"BUDY1\", \"BUDY2\", \"BUDY3\", \"BUDY4\", \"BUDY5\", \"BUDY6\", \"BUDY7\", \"BUDY8\"\r\n\tFROM public.\"PortfolioOpt_Deferred_Proj\" where \"ID\" in (\r\n\t\tSELECT \"Defer_ID\" from public.\"PortfolioOpt_Approved_Proj\" where \"Plan_ID\"=(@id2)\r\n\t)\r\n) AS a INNER JOIN public.\"MP_Project\" AS b ON a.\"Project_ID\" = b.\"Id\" WHERE a.\"Plan_ID\"=(@id)" + where;
            /*var approvedSql = $"SELECT\r\nCOALESCE(SUM(a.\r\n    \"Budget_Before_Revised\"), 0.00) AS \"BudgetBeforeRevised\",\r\n  COALESCE(SUM(a.\r\n    \"Total_Budget\"), 0.00) AS \"TotalBudget\",\r\n  COALESCE(SUM(a.\r\n    \"Project_Score\"), 0.00) AS \"ProjectScore\",\r\n  COALESCE(SUM(a.\r\n    \"TCO_Opex\"), 0.00) * 1000000 AS \"TCOOpex\",\r\n  COALESCE(SUM(a.\r\n    \"TCO_TotalProjectCost\"), 0.00) * 1000000 AS \"TCOTotalProjectCost\",\r\n  COALESCE(SUM(a.\r\n    \"NPV_RiskReduced\"), 0.00) AS \"NPVRiskReduced\",\r\n  COALESCE(SUM(a.\r\n    \"Risk_Reduced\"), 0.00) * 1000000 AS \"RiskReduced\",\r\n  COALESCE(SUM(a.\r\n    \"BUDY1\"), 0.00) AS \"BUDY1\",\r\n  COALESCE(SUM(a.\r\n    \"BUDY2\"), 0.00) AS \"BUDY2\",\r\n  COALESCE(SUM(a.\r\n    \"BUDY3\"), 0.00) AS \"BUDY3\",\r\n  COALESCE(SUM(a.\r\n    \"BUDY4\"), 0.00) AS \"BUDY4\",\r\n  COALESCE(SUM(a.\r\n    \"BUDY5\"), 0.00) AS \"BUDY5\",\r\n  COALESCE(SUM(a.\r\n    \"BUDY6\"), 0.00) AS \"BUDY6\",\r\n  COALESCE(SUM(a.\r\n    \"BUDY7\"), 0.00) AS \"BUDY7\",\r\n  COALESCE(SUM(a.\r\n    \"BUDY8\"), 0.00) AS \"BUDY8\",\r\n  COALESCE(SUM(a.\r\n    \"Total_Budget\"), 0.00) - (COALESCE(SUM(a.\r\n    \"BUDY1\"), 0.00) + COALESCE(SUM(a.\r\n    \"BUDY2\"), 0.00) + COALESCE(SUM(a.\r\n    \"BUDY3\"), 0.00) + COALESCE(SUM(a.\r\n    \"BUDY4\"), 0.00) + COALESCE(SUM(a.\r\n    \"BUDY5\"), 0.00) + COALESCE(SUM(a.\r\n    \"BUDY6\"), 0.00) + COALESCE(SUM(a.\r\n    \"BUDY7\"), 0.00) + COALESCE(SUM(a.\r\n    \"BUDY8\"), 0.00)) AS \"BeyondHorizon\",\r\n  COUNT( * ) AS \"TotalProject\"\r\nFROM\r\n  (\r\n    SELECT \"Plan_ID\",\r\n    \"Project_ID\",\r\n    \"Budget_Before_Revised\",\r\n    \"Total_Budget\",\r\n    \"Project_Score\",\r\n    \"TCO_Opex\",\r\n    \"TCO_TotalProjectCost\",\r\n    \"NPV_RiskReduced\",\r\n    \"Risk_Reduced\",\r\n    \"BUDY1\",\r\n    \"BUDY2\",\r\n    \"BUDY3\",\r\n    \"BUDY4\",\r\n    \"BUDY5\",\r\n    \"BUDY6\",\r\n    \"BUDY7\",\r\n    \"BUDY8\"\r\n    FROM public.\r\n    \"PortfolioOpt_Approved_Proj\"\r\n    where \"Plan_ID\" = (@id1) and(\r\n      \"Defer\" = false or \"Defer\"\r\n      is null)\r\n\r\n    UNION\r\n\r\n    SELECT \"Plan_ID\",\r\n    \"Project_ID\",\r\n    \"Budget_Before_Revised\",\r\n    \"Total_Budget\",\r\n    \"Project_Score\",\r\n    \"TCO_Opex\",\r\n    \"TCO_TotalProjectCost\",\r\n    \"NPV_RiskReduced\",\r\n    \"Risk_Reduced\",\r\n    \"BUDY1\",\r\n    \"BUDY2\",\r\n    \"BUDY3\",\r\n    \"BUDY4\",\r\n    \"BUDY5\",\r\n    \"BUDY6\",\r\n    \"BUDY7\",\r\n    \"BUDY8\"\r\n    FROM public.\r\n    \"PortfolioOpt_Deferred_Proj\"\r\n    where \"ID\" in\r\n    (\r\n      SELECT \"Defer_ID\"\r\n      from public.\r\n      \"PortfolioOpt_Approved_Proj\"\r\n      where \"Plan_ID\" = (@id2))) AS a\r\nINNER JOIN\r\npublic.\r\n\"MP_Project\"\r\nAS b\r\nON\r\na.\r\n\"Project_ID\" = b.\r\n\"Id\"\r\nWHERE\r\na.\r\n\"Plan_ID\" = (@id)" + where;*/
            var approvedParams = new { 
                id1 = scenarioId,
                id2 = scenarioId,
                id = scenarioId
            };

            var approvedSummary = (await DbHelper.ExecuteDql<PortfolioOptSummaryResult>(approvedSql, approvedParams)).FirstOrDefault();
            /*
            var supplySql = $"SELECT COALESCE(SUM(a.\"Total_Budget\"), 0.00) AS \"TotalBudget\", COALESCE(SUM(a.\"Project_Score\"), 0.00) AS \"ProjectScore\", COALESCE(SUM(a.\"TCO_Opex\"), 0.00)*1000000 AS \"TCOOpex\", COALESCE(SUM(a.\"TCO_TotalProjectCost\"), 0.00)*1000000 AS \"TCOTotalProjectCost\", COALESCE(SUM(a.\"NPV_RiskReduced\"), 0.00) AS \"NPVRiskReduced\", COALESCE(SUM(a.\"Risk_Reduced\"), 0.00)*1000000 AS \"RiskReduced\", COUNT(*) AS \"TotalProject\" FROM public.\"PortfolioOpt_Supply_Proj\" AS a INNER JOIN public.\"MP_Project\" AS b ON a.\"Project_ID\" = b.\"Id\" WHERE a.\"Plan_ID\"=(@id)" + where;
            var supplyParams = new { id = scenarioId };
            var supplySummary = (await DbHelper.ExecuteDql<PortfolioOptSummaryResult>(supplySql, supplyParams)).FirstOrDefault();
            */
            approvedSummary.Summary = "Prioritised";
            /*
            approvedSummary.BudgetBeforeRevised += (supplySummary.TotalBudget != null ? supplySummary.TotalBudget : 0);
            approvedSummary.TotalBudget += (supplySummary.TotalBudget != null ? supplySummary.TotalBudget : 0);
            approvedSummary.RiskReduced += (supplySummary.RiskReduced != null ? supplySummary.RiskReduced : 0);
            approvedSummary.ProjectScore += (supplySummary.ProjectScore != null ? supplySummary.ProjectScore : 0);
            approvedSummary.TCOOpex += (supplySummary.TCOOpex != null ? supplySummary.TCOOpex : 0);
            approvedSummary.TCOTotalProjectCost += (supplySummary.TCOTotalProjectCost != null ? supplySummary.TCOTotalProjectCost : 0);
            approvedSummary.NPVRiskReduced += (supplySummary.NPVRiskReduced != null ? supplySummary.NPVRiskReduced : 0);
            approvedSummary.TotalProject += supplySummary.TotalProject;
            */
            var rejectSql = $"SELECT COALESCE(SUM(a.\"Budget_Before_Revised\"), 0.00) AS \"BudgetBeforeRevised\", COALESCE(SUM(a.\"Total_Budget\"), 0.00) AS \"TotalBudget\", COALESCE(SUM(a.\"Project_Score\"), 0.000) AS \"ProjectScore\", COALESCE(SUM(a.\"TCO_Opex\"), 0.00)*1000000 AS \"TCOOpex\", COALESCE(SUM(a.\"TCO_TotalProjectCost\"), 0.00)*1000000 AS \"TCOTotalProjectCost\", COALESCE(SUM(a.\"NPV_RiskReduced\"), 0.00) AS \"NPVRiskReduced\", COALESCE(SUM(a.\"Risk_Reduced\"), 0.000)*1000000 AS \"RiskReduced\", COUNT(*) AS \"TotalProject\" FROM public.\"PortfolioOpt_Rejected_Proj\" AS a INNER JOIN public.\"MP_Project\" AS b ON a.\"Project_ID\" = b.\"Id\" WHERE a.\"Plan_ID\"=(@id)" + where;
            var rejectParams = new { id = scenarioId };
            var rejectSummary = (await DbHelper.ExecuteDql<PortfolioOptSummaryResult>(rejectSql, rejectParams)).FirstOrDefault();

            rejectSummary.Summary = "Deprioritised";
            rejectSummary.BUDY1 = 0.00;
            rejectSummary.BUDY2 = 0.00;
            rejectSummary.BUDY3 = 0.00;
            rejectSummary.BUDY4 = 0.00;
            rejectSummary.BUDY5 = 0.00;
            rejectSummary.BUDY6 = 0.00;
            rejectSummary.BUDY7 = 0.00;
            rejectSummary.BUDY8 = 0.00;

            var totalSummary = new PortfolioOptSummaryResult
            {
                Plan_ID = scenarioId,
                Summary = "Total",
                BudgetBeforeRevised = approvedSummary.BudgetBeforeRevised + (rejectSummary.BudgetBeforeRevised != null ? rejectSummary.BudgetBeforeRevised : 0),
                TotalBudget = approvedSummary.TotalBudget + (rejectSummary.TotalBudget != null ? rejectSummary.TotalBudget : 0),
                RiskReduced = approvedSummary.RiskReduced + (rejectSummary.RiskReduced != null ? rejectSummary.RiskReduced : 0),
                ProjectScore = approvedSummary.ProjectScore + (rejectSummary.ProjectScore != null ? rejectSummary.ProjectScore : 0),
                TCOOpex = approvedSummary.TCOOpex + (rejectSummary.TCOOpex != null ? rejectSummary.TCOOpex : 0),
                TCOTotalProjectCost = approvedSummary.TCOTotalProjectCost + (rejectSummary.TCOTotalProjectCost != null ? rejectSummary.TCOTotalProjectCost : 0),
                NPVRiskReduced = approvedSummary.NPVRiskReduced + (rejectSummary.NPVRiskReduced != null ? rejectSummary.NPVRiskReduced : 0),
                BUDY1 = approvedSummary.BUDY1,
                BUDY2 = approvedSummary.BUDY2,
                BUDY3 = approvedSummary.BUDY3,
                BUDY4 = approvedSummary.BUDY4,
                BUDY5 = approvedSummary.BUDY5,
                BUDY6 = approvedSummary.BUDY6,
                BUDY7 = approvedSummary.BUDY7,
                BUDY8 = approvedSummary.BUDY8
            };

            approvedSummary.ProjectScore = (approvedSummary.TCOOpex + approvedSummary.TCOTotalProjectCost) != 0 ? approvedSummary.NPVRiskReduced / (approvedSummary.TCOOpex + approvedSummary.TCOTotalProjectCost) : 0;
            rejectSummary.ProjectScore = (rejectSummary.TCOOpex + rejectSummary.TCOTotalProjectCost) != 0 ? rejectSummary.NPVRiskReduced / (rejectSummary.TCOOpex + rejectSummary.TCOTotalProjectCost) : 0;
            totalSummary.ProjectScore = (totalSummary.TCOOpex + totalSummary.TCOTotalProjectCost) != 0 ? totalSummary.NPVRiskReduced / (totalSummary.TCOOpex + totalSummary.TCOTotalProjectCost) : 0;
            totalSummary.TotalProject = approvedSummary.TotalProject + rejectSummary.TotalProject;

            var summaryReturnResult = new List<PortfolioOptSummaryResult>();
            summaryReturnResult.Add(approvedSummary);
            summaryReturnResult.Add(rejectSummary);
            //summaryReturnResult.Add(totalSummary);

            return summaryReturnResult;
        }

        public static async Task<UIGrid> PortfolioCompareResultsSummary(string scenarioIds, AipmPortfolioResultFilter filter)
/**********************************************************
 * 2024-08-19: Commented out supply from the summary
 *********************************************************/
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

            List<int?> listID = scenarioIds.Split(new char[] { ',' }).Select(s => Int32.TryParse(s, out int n) ? n : (int?)null).ToList().FindAll(x => x != null);

            var approvedSql = $"SELECT a.\"Plan_ID\" AS \"Plan_ID\", COALESCE(SUM(a.\"Budget_Before_Revised\"), 0.00) AS \"BudgetBeforeRevised\", COALESCE(SUM(a.\"Total_Budget\"), 0.00) AS \"TotalBudget\", COALESCE(SUM(a.\"Project_Score\"), 0.00) AS \"ProjectScore\", COALESCE(SUM(a.\"TCO_Opex\"), 0.00)*1000000 AS \"TCOOpex\", COALESCE(SUM(a.\"TCO_TotalProjectCost\"), 0.00)*1000000 AS \"TCOTotalProjectCost\", COALESCE(SUM(a.\"NPV_RiskReduced\"), 0.00) AS \"NPVRiskReduced\", COALESCE(SUM(a.\"Risk_Reduced\"), 0.00)*1000000 AS \"RiskReduced\", COALESCE(SUM(a.\"BUDY1\"), 0.00) AS \"BUDY1\", COALESCE(SUM(a.\"BUDY2\"), 0.00) AS \"BUDY2\", COALESCE(SUM(a.\"BUDY3\"), 0.00) AS \"BUDY3\", COALESCE(SUM(a.\"BUDY4\"), 0.00) AS \"BUDY4\", COALESCE(SUM(a.\"BUDY5\"), 0.00) AS \"BUDY5\", COALESCE(SUM(a.\"BUDY6\"), 0.00) AS \"BUDY6\", COALESCE(SUM(a.\"BUDY7\"), 0.00) AS \"BUDY7\", COALESCE(SUM(a.\"BUDY8\"), 0.00) AS \"BUDY8\", COUNT(*) AS \"TotalProject\" FROM public.\"PortfolioOpt_Approved_Proj\" AS a INNER JOIN public.\"MP_Project\" AS b ON a.\"Project_ID\" = b.\"Id\" WHERE a.\"Plan_ID\" = ANY(@listID)" + where + " GROUP BY a.\"Plan_ID\"";
            var approvedParams = new { listID };
            var approvedSummaries = (await DbHelper.ExecuteDql<PortfolioOptSummaryResult>(approvedSql, approvedParams)).ToList(); //.OrderBy(obj => listID.IndexOf(obj.Plan_ID)).ToList();
/*
            var supplySql = $"SELECT a.\"Plan_ID\" AS \"Plan_ID\", COALESCE(SUM(a.\"Total_Budget\"), 0.00) AS \"TotalBudget\", COALESCE(SUM(a.\"Project_Score\"), 0.00) AS \"ProjectScore\", COALESCE(SUM(a.\"TCO_Opex\"), 0.00)*1000000 AS \"TCOOpex\", COALESCE(SUM(a.\"TCO_TotalProjectCost\"), 0.00)*1000000 AS \"TCOTotalProjectCost\", COALESCE(SUM(a.\"NPV_RiskReduced\"), 0.00) AS \"NPVRiskReduced\", COALESCE(SUM(a.\"Risk_Reduced\"), 0.00)*1000000 AS \"RiskReduced\", COUNT(*) AS \"TotalProject\" FROM public.\"PortfolioOpt_Supply_Proj\" AS a INNER JOIN public.\"MP_Project\" AS b ON a.\"Project_ID\" = b.\"Id\" WHERE a.\"Plan_ID\" = ANY(@listID)" + where + " GROUP BY a.\"Plan_ID\"";
            var supplyParams = new { listID };
            var supplySummaries = (await DbHelper.ExecuteDql<PortfolioOptSummaryResult>(supplySql, supplyParams)).ToList();
*/
            var rejectSql = $"SELECT a.\"Plan_ID\" AS \"Plan_ID\", COALESCE(SUM(a.\"Budget_Before_Revised\"), 0.00) AS \"BudgetBeforeRevised\", COALESCE(SUM(a.\"Total_Budget\"), 0.00) AS \"TotalBudget\", COALESCE(SUM(a.\"Project_Score\"), 0.000) AS \"ProjectScore\", COALESCE(SUM(a.\"TCO_Opex\"), 0.00)*1000000 AS \"TCOOpex\", COALESCE(SUM(a.\"TCO_TotalProjectCost\"), 0.00)*1000000 AS \"TCOTotalProjectCost\", COALESCE(SUM(a.\"NPV_RiskReduced\"), 0.00) AS \"NPVRiskReduced\", COALESCE(SUM(a.\"Risk_Reduced\"), 0.000)*1000000 AS \"RiskReduced\", COUNT(*) AS \"TotalProject\" FROM public.\"PortfolioOpt_Rejected_Proj\" AS a INNER JOIN public.\"MP_Project\" AS b ON a.\"Project_ID\" = b.\"Id\" WHERE a.\"Plan_ID\" = ANY(@listID)" + where + " GROUP BY a.\"Plan_ID\"";
            var rejectParams = new { listID };
            var rejectSummaries = (await DbHelper.ExecuteDql<PortfolioOptSummaryResult>(rejectSql, rejectParams)).ToList();

            Dictionary<string, string> dictGridFields = new Dictionary<string, string>()
            {
                // Prioritised
                { "ptotalproject", "Total Project" },
                { "pbudgetbeforerevised", "Total Budget Before Revised (RM)" },
                { "ptotalbudget", "Total Budget (RM)" },
                { "ptotalriskreduced", "Total Risk Reduced (RM)" },
                { "popex", "OPEX (RM)" },
                { "ptotalprojcost", "Total Project Cost (RM)" },
                { "pnpvriskreduced", "NPV Risk Reduced (RM)" },
                { "ptotalprojscore", "Total Project Score (NPV Risk Reduced/TCO)" },
                { "ptotalbudgetyr1", "Total Budget Year 1 (RM)" },
                { "ptotalbudgetyr2", "Total Budget Year 2 (RM)" },
                { "ptotalbudgetyr3", "Total Budget Year 3 (RM)" },
                { "ptotalbudgetyr4", "Total Budget Year 4 (RM)" },
                { "ptotalbudgetyr5", "Total Budget Year 5 (RM)" },
                { "ptotalbudgetyr6", "Total Budget Year 6 (RM)" },
                { "ptotalbudgetyr7", "Total Budget Year 7 (RM)" },
                { "ptotalbudgetyr8", "Total Budget Year 8 (RM)" },
                // Deprioritised
                { "dtotalproject", "Total Project" },
                { "dbudgetbeforerevised", "Total Budget Before Revised (RM)" },
                { "dtotalbudget", "Total Budget (RM)" },
                { "dtotalriskreduced", "Total Risk Reduced (RM)" },
                { "dopex", "OPEX (RM)" },
                { "dtotalprojcost", "Total Project Cost (RM)" },
                { "dnpvriskreduced", "NPV Risk Reduced (RM)" },
                { "dtotalprojscore", "Total Project Score (NPV Risk Reduced/TCO)" },
                // Total
                { "stotalproject", "Total Project" },
                { "sbudgetbeforerevised", "Total Budget Before Revised (RM)" },
                { "stotalbudget", "Total Budget (RM)" },
                { "stotalriskreduced", "Total Risk Reduced (RM)" },
                { "sopex", "OPEX (RM)" },
                { "stotalprojcost", "Total Project Cost (RM)" },
                { "snpvriskreduced", "NPV Risk Reduced (RM)" },
                { "stotalprojscore", "Total Project Score (NPV Risk Reduced/TCO)" },
            };

            Dictionary<string, List<PortfolioOptSummaryResult>> dict = new Dictionary<string, List<PortfolioOptSummaryResult>>();
            Dictionary<string, Dictionary<string, object>> dictRow = new Dictionary<string, Dictionary<string, object>>();

            foreach (int id in listID)
            {
                if (!dictRow.ContainsKey($"col{id}"))
                    dictRow.Add($"col{id}", new Dictionary<string, object>());

                var approvedSummary = approvedSummaries.Find(x => x.Plan_ID == id);
                //var supplySummary = supplySummaries.Find(x => x.Plan_ID == id);
                var rejectSummary = rejectSummaries.Find(x => x.Plan_ID == id);

                if (approvedSummary == null)
                {
                    approvedSummary = new PortfolioOptSummaryResult()
                    {
                        Plan_ID = id,
                        BudgetBeforeRevised = 0,
                        TotalBudget = 0,
                        RiskReduced = 0,
                        TCOOpex = 0,
                        TCOTotalProjectCost = 0,
                        NPVRiskReduced = 0,
                        BUDY1 = 0,
                        BUDY2 = 0,
                        BUDY3 = 0,
                        BUDY4 = 0,
                        BUDY5 = 0,
                        BUDY6 = 0,
                        BUDY7 = 0,
                        BUDY8 = 0,
                    };
                }

                approvedSummary.Summary = "Prioritised";
                /*
                approvedSummary.BudgetBeforeRevised += (supplySummary?.TotalBudget ?? 0);
                approvedSummary.TotalBudget += (supplySummary?.TotalBudget ?? 0);
                approvedSummary.RiskReduced += (supplySummary?.RiskReduced ?? 0);
                approvedSummary.TCOOpex += (supplySummary?.TCOOpex ?? 0);
                approvedSummary.TCOTotalProjectCost += (supplySummary?.TCOTotalProjectCost ?? 0);
                approvedSummary.NPVRiskReduced += (supplySummary?.NPVRiskReduced ?? 0);
                approvedSummary.TotalProject += (supplySummary?.TotalProject ?? 0);
                */
                approvedSummary.ProjectScore = (approvedSummary.TCOOpex + approvedSummary.TCOTotalProjectCost) != 0 ? approvedSummary.NPVRiskReduced / (approvedSummary.TCOOpex + approvedSummary.TCOTotalProjectCost) : 0;

                if (rejectSummary == null)
                {
                    rejectSummary = new PortfolioOptSummaryResult()
                    {
                        Plan_ID = id,
                        BudgetBeforeRevised = 0,
                        TotalBudget = 0,
                        RiskReduced = 0,
                        TCOOpex = 0,
                        TCOTotalProjectCost = 0,
                        NPVRiskReduced = 0,
                        TotalProject = 0
                    };
                }

                rejectSummary.Summary = "Deprioritised";
                rejectSummary.ProjectScore = (rejectSummary.TCOOpex + rejectSummary.TCOTotalProjectCost) != 0 ? rejectSummary.NPVRiskReduced / (rejectSummary.TCOOpex + rejectSummary.TCOTotalProjectCost) : 0;

                var totalSummary = new PortfolioOptSummaryResult
                {
                    Plan_ID = approvedSummary.Plan_ID,
                    Summary = "Total",
                    BudgetBeforeRevised = approvedSummary.BudgetBeforeRevised + (rejectSummary.BudgetBeforeRevised ?? 0),
                    TotalBudget = approvedSummary.TotalBudget + (rejectSummary.TotalBudget ?? 0),
                    RiskReduced = approvedSummary.RiskReduced + (rejectSummary.RiskReduced ?? 0),
                    TCOOpex = approvedSummary.TCOOpex + (rejectSummary.TCOOpex ?? 0),
                    TCOTotalProjectCost = approvedSummary.TCOTotalProjectCost + (rejectSummary.TCOTotalProjectCost ?? 0),
                    NPVRiskReduced = approvedSummary.NPVRiskReduced + (rejectSummary.NPVRiskReduced ?? 0),
                    BUDY1 = approvedSummary.BUDY1,
                    BUDY2 = approvedSummary.BUDY2,
                    BUDY3 = approvedSummary.BUDY3,
                    BUDY4 = approvedSummary.BUDY4,
                    BUDY5 = approvedSummary.BUDY5,
                    BUDY6 = approvedSummary.BUDY6,
                    BUDY7 = approvedSummary.BUDY7,
                    BUDY8 = approvedSummary.BUDY8,
                    TotalProject = approvedSummary.TotalProject + rejectSummary.TotalProject
                };
                totalSummary.ProjectScore = (totalSummary.TCOOpex + totalSummary.TCOTotalProjectCost) != 0 ? totalSummary.NPVRiskReduced / (totalSummary.TCOOpex + totalSummary.TCOTotalProjectCost) : 0;

                // Prepare data for grid
                // Format the value here because the grid component only support entire column formatting.
                foreach (string field in dictGridFields.Keys)
                {
                    if (!dictRow[$"col{id}"].ContainsKey(field))
                        dictRow[$"col{id}"].Add(field, 0);

                    // Prioritised project
                    if (field == "ptotalproject") { dictRow[$"col{id}"][field] = approvedSummary.TotalProject.ToString(); }
                    else if (field == "pbudgetbeforerevised") { dictRow[$"col{id}"][field] = FormatNumber(approvedSummary.BudgetBeforeRevised ?? 0.00, 2).ToString("#,##0.00"); }
                    else if (field == "ptotalbudget") { dictRow[$"col{id}"][field] = FormatNumber(approvedSummary.TotalBudget ?? 0, 2).ToString("#,##0.00"); }
                    else if (field == "ptotalriskreduced") { dictRow[$"col{id}"][field] = FormatNumber(approvedSummary.RiskReduced ?? 0, 2).ToString("#,##0.00"); }
                    else if (field == "popex") { dictRow[$"col{id}"][field] = FormatNumber(approvedSummary.TCOOpex ?? 0, 2).ToString("#,##0.00"); }
                    else if (field == "ptotalprojcost") { dictRow[$"col{id}"][field] = FormatNumber(approvedSummary.TCOTotalProjectCost ?? 0, 2).ToString("#,##0.00"); }
                    else if (field == "pnpvriskreduced") { dictRow[$"col{id}"][field] = FormatNumber(approvedSummary.NPVRiskReduced ?? 0, 2).ToString("#,##0.00"); }
                    else if (field == "ptotalprojscore") { dictRow[$"col{id}"][field] = FormatNumber(approvedSummary.ProjectScore ?? 0, 3).ToString("#,##0.000"); }
                    else if (field == "ptotalbudgetyr1") { dictRow[$"col{id}"][field] = FormatNumber(approvedSummary.BUDY1 ?? 0, 2).ToString("#,##0.00"); }
                    else if (field == "ptotalbudgetyr2") { dictRow[$"col{id}"][field] = FormatNumber(approvedSummary.BUDY2 ?? 0, 2).ToString("#,##0.00"); }
                    else if (field == "ptotalbudgetyr3") { dictRow[$"col{id}"][field] = FormatNumber(approvedSummary.BUDY3 ?? 0, 2).ToString("#,##0.00"); }
                    else if (field == "ptotalbudgetyr4") { dictRow[$"col{id}"][field] = FormatNumber(approvedSummary.BUDY4 ?? 0, 2).ToString("#,##0.00"); }
                    else if (field == "ptotalbudgetyr5") { dictRow[$"col{id}"][field] = FormatNumber(approvedSummary.BUDY5 ?? 0, 2).ToString("#,##0.00"); }
                    else if (field == "ptotalbudgetyr6") { dictRow[$"col{id}"][field] = FormatNumber(approvedSummary.BUDY6 ?? 0, 2).ToString("#,##0.00"); }
                    else if (field == "ptotalbudgetyr7") { dictRow[$"col{id}"][field] = FormatNumber(approvedSummary.BUDY7 ?? 0, 2).ToString("#,##0.00"); }
                    else if (field == "ptotalbudgetyr8") { dictRow[$"col{id}"][field] = FormatNumber(approvedSummary.BUDY8 ?? 0, 2).ToString("#,##0.00"); }
                    // Deprioritised project
                    else if (field == "dtotalproject") { dictRow[$"col{id}"][field] = rejectSummary.TotalProject.ToString(); ; }
                    else if (field == "dbudgetbeforerevised") { dictRow[$"col{id}"][field] = FormatNumber(rejectSummary.BudgetBeforeRevised ?? 0, 2).ToString("#,##0.00"); }
                    else if (field == "dtotalbudget") { dictRow[$"col{id}"][field] = FormatNumber(rejectSummary.TotalBudget ?? 0, 2).ToString("#,##0.00"); }
                    else if (field == "dtotalriskreduced") { dictRow[$"col{id}"][field] = FormatNumber(rejectSummary.RiskReduced ?? 0, 2).ToString("#,##0.00"); }
                    else if (field == "dopex") { dictRow[$"col{id}"][field] = FormatNumber(rejectSummary.TCOOpex ?? 0, 2).ToString("#,##0.00"); }
                    else if (field == "dtotalprojcost") { dictRow[$"col{id}"][field] = FormatNumber(rejectSummary.TCOTotalProjectCost ?? 0, 2).ToString("#,##0.00"); }
                    else if (field == "dnpvriskreduced") { dictRow[$"col{id}"][field] = FormatNumber(rejectSummary.NPVRiskReduced ?? 0, 2).ToString("#,##0.00"); }
                    else if (field == "dtotalprojscore") { dictRow[$"col{id}"][field] = FormatNumber(rejectSummary.ProjectScore ?? 0, 3).ToString("#,##0.000"); }
                    // Summary
                    else if (field == "stotalproject") { dictRow[$"col{id}"][field] = totalSummary.TotalProject.ToString(); ; }
                    else if (field == "sbudgetbeforerevised") { dictRow[$"col{id}"][field] = FormatNumber(totalSummary.BudgetBeforeRevised ?? 0, 2).ToString("#,##0.00"); }
                    else if (field == "stotalbudget") { dictRow[$"col{id}"][field] = FormatNumber(totalSummary.TotalBudget ?? 0, 2).ToString("#,##0.00"); }
                    else if (field == "stotalriskreduced") { dictRow[$"col{id}"][field] = FormatNumber(totalSummary.RiskReduced ?? 0, 2).ToString("#,##0.00"); }
                    else if (field == "sopex") { dictRow[$"col{id}"][field] = FormatNumber(totalSummary.TCOOpex ?? 0, 2).ToString("#,##0.00"); }
                    else if (field == "stotalprojcost") { dictRow[$"col{id}"][field] = FormatNumber(totalSummary.TCOTotalProjectCost ?? 0, 2).ToString("#,##0.00"); }
                    else if (field == "snpvriskreduced") { dictRow[$"col{id}"][field] = FormatNumber(totalSummary.NPVRiskReduced ?? 0, 2).ToString("#,##0.00"); }
                    else if (field == "stotalprojscore") { dictRow[$"col{id}"][field] = FormatNumber(totalSummary.ProjectScore ?? 3, 2).ToString("#,##0.000"); }
                }
            }

            UIGrid uiGrid = new UIGrid();
            uiGrid.Rule.AddLeftFreeze("colLabel");
            uiGrid.AddColumn(new UIGridColumn() { columnName = "colCategory", columnWidth = "50px", columnType = UIGridColumnType.Text, columnTypeId = 1, display = false });
            uiGrid.AddColumn(new UIGridColumn() { columnName = "colLabel", displayName = "Description", columnWidth = "200px", columnType = UIGridColumnType.Text, columnTypeId = 1 });
            foreach (int id in listID)
            {
                uiGrid.AddColumn(new UIGridColumn()
                {
                    columnName = $"col{id}",
                    columnType = UIGridColumnType.Text,
                    columnTypeId = 1,
                    columnWidth = "150px"
                });
            }

            foreach (string field in dictGridFields.Keys)
            {
                Dictionary<string, object> rowData = new Dictionary<string, object>();

                if (field.StartsWith("p"))
                    rowData.Add("colCategory", "Prioritised");
                else if (field.StartsWith("d"))
                    rowData.Add("colCategory", "Deprioritised");
                else if (field.StartsWith("s"))
                    rowData.Add("colCategory", "Total");

                rowData.Add("colLabel", dictGridFields[field]);

                foreach (string colId in dictRow.Keys)
                {
                    rowData.Add(colId, dictRow[colId][field]);
                }

                uiGrid.Data.Add(rowData);
            }
            return uiGrid;
        }
        public static double FormatNumber(double num, int decimals) => Math.Round(num, decimals, MidpointRounding.AwayFromZero);

        /* GENCODE:MARKER:2:START */

//===============================================================
// TEMPLATE START: ScenarioManager.cs.2.1.tpl
//===============================================================
        public static async Task<IEnumerable<PortfolioAnnualBudgetDataSummaryResult>> PortfolioAnnualBudgetDataSummary(int scenarioId, AipmPortfolioResultFilter filter)
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
            var innerSql = $"SELECT \"YearIndex\" + \"StartYear\" AS \"Year\" , null as \"FILLER\", SUM(\"BUDY\")/1000000 AS \"BUDY\" FROM ( SELECT proj.\"YearIndex\" , proj.\"Plan_ID\" , proj.\"Project_ID\" , proj.\"BUDY\" , proj.\"resType\" , mp.\"Id\" , mp.\"UDCFG_GeoStateCode\" , mp.\"UDCFG_BusinessAreaCode\", mp.\"UDProjectType\" , mp.\"UDVoltagekV\" , mp.\"UDStrategicObjective\" , config.\"StartYear\" , config.\"EndYear\" FROM ( SELECT \'Prioritised\' AS \"resType\" , 0 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY1\" AS \"BUDY\" , \"Defer\" , \"Defer_ID\" FROM public.\"PortfolioOpt_Approved_Proj\" UNION SELECT \'Prioritised\' AS \"resType\" , 1 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY2\" AS \"BUDY\" , \"Defer\" , \"Defer_ID\" FROM public.\"PortfolioOpt_Approved_Proj\" UNION SELECT \'Prioritised\' AS \"resType\" , 2 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY3\" AS \"BUDY\" , \"Defer\" , \"Defer_ID\" FROM public.\"PortfolioOpt_Approved_Proj\" UNION SELECT \'Prioritised\' AS \"resType\" , 3 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY4\" AS \"BUDY\" , \"Defer\" , \"Defer_ID\" FROM public.\"PortfolioOpt_Approved_Proj\" UNION SELECT \'Prioritised\' AS \"resType\" , 4 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY5\" AS \"BUDY\" , \"Defer\" , \"Defer_ID\" FROM public.\"PortfolioOpt_Approved_Proj\" UNION SELECT \'Prioritised\' AS \"resType\" , 5 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY6\" AS \"BUDY\" , \"Defer\" , \"Defer_ID\" FROM public.\"PortfolioOpt_Approved_Proj\" UNION SELECT \'Prioritised\' AS \"resType\" , 6 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY7\" AS \"BUDY\" , \"Defer\" , \"Defer_ID\" FROM public.\"PortfolioOpt_Approved_Proj\" UNION SELECT \'Prioritised\' AS \"resType\" , 7 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY8\" AS \"BUDY\" , \"Defer\" , \"Defer_ID\" FROM public.\"PortfolioOpt_Approved_Proj\" UNION SELECT \'Defer\' AS \"resType\" , 0 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY1\" AS \"BUDY\" , \"Defer\" , \"ID\" AS \"Defer_ID\" FROM public.\"PortfolioOpt_Deferred_Proj\" UNION SELECT \'Defer\' AS \"resType\" , 1 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY2\" AS \"BUDY\" , \"Defer\" , \"ID\" AS \"Defer_ID\" FROM public.\"PortfolioOpt_Deferred_Proj\" UNION SELECT \'Defer\' AS \"resType\" , 2 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY3\" AS \"BUDY\" , \"Defer\" , \"ID\" AS \"Defer_ID\" FROM public.\"PortfolioOpt_Deferred_Proj\" UNION SELECT \'Defer\' AS \"resType\" , 3 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY4\" AS \"BUDY\" , \"Defer\" , \"ID\" AS \"Defer_ID\" FROM public.\"PortfolioOpt_Deferred_Proj\" UNION SELECT \'Defer\' AS \"resType\" , 4 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY5\" AS \"BUDY\" , \"Defer\" , \"ID\" AS \"Defer_ID\" FROM public.\"PortfolioOpt_Deferred_Proj\" UNION SELECT \'Defer\' AS \"resType\" , 5 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY6\" AS \"BUDY\" , \"Defer\" , \"ID\" AS \"Defer_ID\" FROM public.\"PortfolioOpt_Deferred_Proj\" UNION SELECT \'Defer\' AS \"resType\" , 6 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY7\" AS \"BUDY\" , \"Defer\" , \"ID\" AS \"Defer_ID\" FROM public.\"PortfolioOpt_Deferred_Proj\" UNION SELECT \'Defer\' AS \"resType\" , 7 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY8\" AS \"BUDY\" , \"Defer\" , \"ID\" AS \"Defer_ID\" FROM public.\"PortfolioOpt_Deferred_Proj\" ) AS proj INNER JOIN public.\"MP_Project\" AS mp ON proj.\"Project_ID\" = mp.\"Id\" INNER JOIN public.\"AIPM_PortfolioScenario\" as config on proj.\"Plan_ID\" = config.\"Id\" LEFT JOIN public.\"PortfolioOpt_Approved_Proj\" as ap on proj.\"Plan_ID\" = ap.\"Plan_ID\" and proj.\"resType\" = \'Defer\' and proj.\"Defer_ID\" = ap.\"Defer_ID\" WHERE proj.\"Plan_ID\" = (@id) AND ( ( proj.\"resType\" = \'Prioritised\' AND proj.\"Defer_ID\" IS NULL ) OR ( \"resType\" = \'Defer\' AND ap.\"Plan_ID\" IS NOT NULL) ) " + where + " ) AS resultset Where \"YearIndex\" + \"StartYear\" <= \"EndYear\" GROUP BY \"YearIndex\", \"Plan_ID\" , \"StartYear\", \"EndYear\" order by \"YearIndex\";";

            var innerparams = new { id = scenarioId };
            var summary = (await DbHelper.ExecuteDql<PortfolioAnnualBudgetDataSummaryResult>(innerSql, innerparams));

            /*
            var summaryReturnResult = new List<PortfolioAnnualBudgetDataSummaryResult>();
            summaryReturnResult.Add(summary);*/

            return summary;
        }
//===============================================================
// TEMPLATE END: ScenarioManager.cs.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: ScenarioManager.cs.2.1.tpl
//===============================================================
        public static async Task<IEnumerable<PortfolioBudgetvsStratDataSummaryResult>> PortfolioBudgetvsStratDataSummary(int scenarioId, AipmPortfolioResultFilter filter)
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
            var innerSql = $"SELECT \"YearIndex\" + \"StartYear\" AS \"Year\", \"UDStrategicObjective\" , SUM(\"BUDY\")/1000000 AS \"BUDY\" FROM ( SELECT proj.\"YearIndex\" , proj.\"Plan_ID\" , proj.\"Project_ID\" , proj.\"BUDY\" , proj.\"resType\" , mp.\"Id\" , mp.\"UDCFG_GeoStateCode\" , mp.\"UDCFG_BusinessAreaCode\", mp.\"UDProjectType\" , mp.\"UDVoltagekV\" , mp.\"UDStrategicObjective\" , config.\"StartYear\" , config.\"EndYear\" FROM ( SELECT \'Prioritised\' AS \"resType\" , 0 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY1\" AS \"BUDY\" , \"Defer\" , \"Defer_ID\" FROM public.\"PortfolioOpt_Approved_Proj\" UNION SELECT \'Prioritised\' AS \"resType\" , 1 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY2\" AS \"BUDY\" , \"Defer\" , \"Defer_ID\" FROM public.\"PortfolioOpt_Approved_Proj\" UNION SELECT \'Prioritised\' AS \"resType\" , 2 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY3\" AS \"BUDY\" , \"Defer\" , \"Defer_ID\" FROM public.\"PortfolioOpt_Approved_Proj\" UNION SELECT \'Prioritised\' AS \"resType\" , 3 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY4\" AS \"BUDY\" , \"Defer\" , \"Defer_ID\" FROM public.\"PortfolioOpt_Approved_Proj\" UNION SELECT \'Prioritised\' AS \"resType\" , 4 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY5\" AS \"BUDY\" , \"Defer\" , \"Defer_ID\" FROM public.\"PortfolioOpt_Approved_Proj\" UNION SELECT \'Prioritised\' AS \"resType\" , 5 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY6\" AS \"BUDY\" , \"Defer\" , \"Defer_ID\" FROM public.\"PortfolioOpt_Approved_Proj\" UNION SELECT \'Prioritised\' AS \"resType\" , 6 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY7\" AS \"BUDY\" , \"Defer\" , \"Defer_ID\" FROM public.\"PortfolioOpt_Approved_Proj\" UNION SELECT \'Prioritised\' AS \"resType\" , 7 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY8\" AS \"BUDY\" , \"Defer\" , \"Defer_ID\" FROM public.\"PortfolioOpt_Approved_Proj\" UNION SELECT \'Defer\' AS \"resType\" , 0 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY1\" AS \"BUDY\" , \"Defer\" , \"ID\" AS \"Defer_ID\" FROM public.\"PortfolioOpt_Deferred_Proj\" UNION SELECT \'Defer\' AS \"resType\" , 1 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY2\" AS \"BUDY\" , \"Defer\" , \"ID\" AS \"Defer_ID\" FROM public.\"PortfolioOpt_Deferred_Proj\" UNION SELECT \'Defer\' AS \"resType\" , 2 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY3\" AS \"BUDY\" , \"Defer\" , \"ID\" AS \"Defer_ID\" FROM public.\"PortfolioOpt_Deferred_Proj\" UNION SELECT \'Defer\' AS \"resType\" , 3 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY4\" AS \"BUDY\" , \"Defer\" , \"ID\" AS \"Defer_ID\" FROM public.\"PortfolioOpt_Deferred_Proj\" UNION SELECT \'Defer\' AS \"resType\" , 4 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY5\" AS \"BUDY\" , \"Defer\" , \"ID\" AS \"Defer_ID\" FROM public.\"PortfolioOpt_Deferred_Proj\" UNION SELECT \'Defer\' AS \"resType\" , 5 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY6\" AS \"BUDY\" , \"Defer\" , \"ID\" AS \"Defer_ID\" FROM public.\"PortfolioOpt_Deferred_Proj\" UNION SELECT \'Defer\' AS \"resType\" , 6 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY7\" AS \"BUDY\" , \"Defer\" , \"ID\" AS \"Defer_ID\" FROM public.\"PortfolioOpt_Deferred_Proj\" UNION SELECT \'Defer\' AS \"resType\" , 7 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY8\" AS \"BUDY\" , \"Defer\" , \"ID\" AS \"Defer_ID\" FROM public.\"PortfolioOpt_Deferred_Proj\" ) AS proj INNER JOIN public.\"MP_Project\" AS mp ON proj.\"Project_ID\" = mp.\"Id\" INNER JOIN public.\"AIPM_PortfolioScenario\" as config on proj.\"Plan_ID\" = config.\"Id\" LEFT JOIN public.\"PortfolioOpt_Approved_Proj\" as ap on proj.\"Plan_ID\" = ap.\"Plan_ID\" and proj.\"resType\" = \'Defer\' and proj.\"Defer_ID\" = ap.\"Defer_ID\" WHERE proj.\"Plan_ID\" = (@id) AND ( ( proj.\"resType\" = \'Prioritised\' AND proj.\"Defer_ID\" IS NULL ) OR ( \"resType\" = \'Defer\' AND ap.\"Plan_ID\" IS NOT NULL) ) " + where + " ) AS resultset Where \"YearIndex\" + \"StartYear\" <= \"EndYear\" GROUP BY \"YearIndex\", \"Plan_ID\" , \"StartYear\", \"EndYear\" , \"UDStrategicObjective\" order by \"YearIndex\";";

            var innerparams = new { id = scenarioId };
            var summary = (await DbHelper.ExecuteDql<PortfolioBudgetvsStratDataSummaryResult>(innerSql, innerparams));

            /*
            var summaryReturnResult = new List<PortfolioBudgetvsStratDataSummaryResult>();
            summaryReturnResult.Add(summary);*/

            return summary;
        }
//===============================================================
// TEMPLATE END: ScenarioManager.cs.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: ScenarioManager.cs.2.1.tpl
//===============================================================
        public static async Task<IEnumerable<PortfolioNPVvsCommMthDataSummaryResult>> PortfolioNPVvsCommMthDataSummary(int scenarioId, AipmPortfolioResultFilter filter)
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
            var innerSql = $"SELECT \"Year\" , \"YearIndex\", case when \"Year\" - \"StartYear\" > \"YearIndex\" then 0 else \"NPV_RiskReduced\" end as \"NPV_RiskReduced\" from ( Select \"Count\" as \"Year\" , generate_series(0, \"EndYear\"-\"StartYear\") AS \"YearIndex\" , max (resultset3.\"NPV_RiskReduced\") as \"NPV_RiskReduced\", \"StartYear\" , \"EndYear\" from ( Select \"Count\", case when \"CommYear\"=\"Count\" then \"NPV_RiskReduced\" else 0 end as \"NPV_RiskReduced\", \"StartYear\" , \"EndYear\" from ( SELECT \"StartYear\" , \"CommYear\" , \"EndYear\" , sum(\"NPV_RiskReduced\")/ 1000000 as \"NPV_RiskReduced\", generate_series(\"StartYear\",\"EndYear\") AS \"Count\" FROM ( SELECT proj.\"Plan_ID\" , proj.\"Project_ID\" , proj.\"NPV_RiskReduced\" , proj.\"resType\" , EXTRACT( YEAR FROM proj.\"Comm_Month\" ) as \"CommYear\", mp.\"Id\" , mp.\"UDCFG_GeoStateCode\" , mp.\"UDCFG_BusinessAreaCode\" , mp.\"UDProjectType\" , mp.\"UDVoltagekV\" , mp.\"UDStrategicObjective\" , config.\"StartYear\" , config.\"EndYear\" FROM ( SELECT \'Prioritised\' AS \"resType\", \"Comm_Month\" , \"Plan_ID\" , \"Project_ID\" , \"NPV_RiskReduced\" , \"Defer\" , \"Defer_ID\" FROM public.\"PortfolioOpt_Approved_Proj\" UNION SELECT \'Defer\' AS \"resType\", \"Comm_Month\" , \"Plan_ID\" , \"Project_ID\" , \"NPV_RiskReduced\" , \"Defer\" , \"ID\" AS \"Defer_ID\" FROM public.\"PortfolioOpt_Deferred_Proj\" ) AS proj INNER JOIN public.\"MP_Project\" AS mp ON proj.\"Project_ID\" = mp.\"Id\" INNER JOIN public.\"AIPM_PortfolioScenario\" as config on proj.\"Plan_ID\" = config.\"Id\" LEFT JOIN public.\"PortfolioOpt_Approved_Proj\" as ap on proj.\"Plan_ID\" = ap.\"Plan_ID\" and proj.\"resType\" = \'Defer\' and proj.\"Defer_ID\" = ap.\"Defer_ID\" WHERE proj.\"Plan_ID\" = (@id) AND ( ( proj.\"resType\" = \'Prioritised\' AND proj.\"Defer_ID\" IS NULL ) OR ( \"resType\" = \'Defer\' AND ap.\"Plan_ID\" IS NOT NULL) ) " + where + " ) AS resultset GROUP BY \"StartYear\", \"CommYear\" , \"Count\" , \"EndYear\" ORDER BY \"Count\" ASC, \"CommYear\" ASC) as resultset2) as resultset3 group by \"Year\" , \"StartYear\", \"EndYear\") as resultset4 WHERE \"Year\" is not null order by \"YearIndex\", \"Year\";";

            var innerparams = new { id = scenarioId };
            var summary = (await DbHelper.ExecuteDql<PortfolioNPVvsCommMthDataSummaryResult>(innerSql, innerparams));

            /*
            var summaryReturnResult = new List<PortfolioNPVvsCommMthDataSummaryResult>();
            summaryReturnResult.Add(summary);*/

            return summary;
        }
//===============================================================
// TEMPLATE END: ScenarioManager.cs.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: ScenarioManager.cs.2.1.tpl
//===============================================================
        public static async Task<IEnumerable<PortfolioNPVvsStratDataSummaryResult>> PortfolioNPVvsStratDataSummary(int scenarioId, AipmPortfolioResultFilter filter)
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
            var innerSql = $"WITH PlanData AS ( SELECT DISTINCT ON (\"Plan_ID\") \"Plan_ID\" FROM public.\"PortfolioOpt_Approved_Proj\" WHERE \"Plan_ID\" = (@id) ), ScenarioData AS ( SELECT \"Year\" , yearmatch.\"UDStrategicObjective\", SUM(finalresult.\"NPV_RiskReduced\") OVER ( PARTITION BY yearmatch.\"UDStrategicObjective\" ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW ) AS \"NPV_RiskReduced\" FROM ( SELECT \"StartYear\" + \"YearIndex\" AS \"Year\", \"UDStrategicObjective\" FROM ( SELECT DISTINCT mp.\"UDStrategicObjective\" , generate_series(0, 7) AS \"YearIndex\", ps.\"StartYear\" , ps.\"EndYear\" FROM ( SELECT \'Prioritised\' AS \"resType\", \"Plan_ID\" , \"Project_ID\" , \"Defer\" , \"Defer_ID\" FROM public.\"PortfolioOpt_Approved_Proj\" UNION SELECT \'Defer\' AS \"resType\", \"Plan_ID\" , \"Project_ID\" , \"Defer\" , \"ID\" AS \"Defer_ID\" FROM public.\"PortfolioOpt_Deferred_Proj\" ) AS proj INNER JOIN public.\"MP_Project\" AS mp ON proj.\"Project_ID\" = mp.\"Id\" INNER JOIN public.\"AIPM_PortfolioScenario\" AS ps ON proj.\"Plan_ID\" = ps.\"Id\" LEFT JOIN public.\"PortfolioOpt_Approved_Proj\" as ap on proj.\"Plan_ID\" = ap.\"Plan_ID\" and proj.\"resType\" = \'Defer\' and proj.\"Defer_ID\" = ap.\"Defer_ID\" WHERE proj.\"Plan_ID\" IN ( SELECT \"Plan_ID\" FROM PlanData) AND ( ( \"resType\" = \'Prioritised\' AND proj.\"Defer_ID\" IS NULL ) OR ( \"resType\" = \'Defer\' AND ap.\"Plan_ID\" IS NOT NULL) ) ) AS rowgeneration WHERE \"StartYear\" + \"YearIndex\" <= \"EndYear\" ORDER BY \"UDStrategicObjective\", \"YearIndex\" ) AS yearmatch LEFT JOIN ( SELECT \"CommYear\" , \"UDStrategicObjective\", COALESCE(\"NPV_RiskReduced\",0) as \"NPV_RiskReduced\" FROM ( SELECT \"UDStrategicObjective\" AS \"UDStrategicObjective\", SUM(\"NPV_RiskReduced\") / 1000000 AS \"NPV_RiskReduced\" , EXTRACT(YEAR FROM \"Comm_Month\") AS \"CommYear\" FROM ( SELECT proj.\"NPV_RiskReduced\" , proj.\"Project_ID\" , proj.\"Comm_Month\" , mp.\"Id\" , mp.\"UDCFG_GeoStateCode\" , mp.\"UDCFG_BusinessAreaCode\", mp.\"UDProjectType\" , mp.\"UDVoltagekV\" , mp.\"UDStrategicObjective\" FROM ( SELECT \'Approved\' AS resType , \"Plan_ID\" , \"Project_ID\" , \"Project_Definition\" , \"Start_Month_Scope_1\" , \"Month_Scope_1\" , \"Start_Month_Scope_2\" , \"Month_Scope_2\" , \"Start_Month_Scope_3\" , \"Month_Scope_3\" , \"Start_Month_Scope_4\" , \"Month_Scope_4\" , \"Comm_Month\" , \"Target_Comm_Month\" , \"Mandatory\" , \"Budget_Before_Revised\", \"Total_Budget\" , \"BUDY1\" , \"BUDY2\" , \"BUDY3\" , \"BUDY4\" , \"BUDY5\" , \"BUDY6\" , \"BUDY7\" , \"BUDY8\" , \"Project_Score\" , \"Risk_Reduced\" , \"TCO_Opex\" , \"TCO_TotalProjectCost\" , \"NPV_RiskReduced\" , \"Defer\" , \"Option1_Safety\" , \"Option1_Compliance\" , \"Option1_Financial\" , \"Option1_Reliability\" , \"Option1_Environment\" , \"Option1_Customer\" FROM public.\"PortfolioOpt_Approved_Proj\" UNION SELECT \'Alternate\' AS resType , \"Plan_ID\" , \"Project_ID\" , \"Project_Definition\" , \"Start_Month_Scope_1\" , \"Month_Scope_1\" , \"Start_Month_Scope_2\" , \"Month_Scope_2\" , \"Start_Month_Scope_3\" , \"Month_Scope_3\" , \"Start_Month_Scope_4\" , \"Month_Scope_4\" , \"Comm_Month\" , \"Target_Comm_Month\" , \"Mandatory\" , \"Budget_Before_Revised\", \"Total_Budget\" , \"BUDY1\" , \"BUDY2\" , \"BUDY3\" , \"BUDY4\" , \"BUDY5\" , \"BUDY6\" , \"BUDY7\" , \"BUDY8\" , \"Project_Score\" , \"Risk_Reduced\" , \"TCO_Opex\" , \"TCO_TotalProjectCost\" , \"NPV_RiskReduced\" , NULL AS \"Defer\" , \"Option1_Safety\" , \"Option1_Compliance\" , \"Option1_Financial\" , \"Option1_Reliability\" , \"Option1_Environment\" , \"Option1_Customer\" FROM public.\"PortfolioOpt_Alternate_Proj\" ) AS proj INNER JOIN public.\"MP_Project\" AS mp ON proj.\"Project_ID\" = mp.\"Id\" WHERE \"Plan_ID\" IN ( SELECT \"Plan_ID\" FROM PlanData) AND ( ( resType = \'Approved\' AND ( \"Defer\" IS NULL OR \"Defer\" IS FALSE)) OR ( resType = \'Alternate\') ) " + where + " ) AS projresult GROUP BY \"UDStrategicObjective\", EXTRACT(YEAR FROM \"Comm_Month\") ORDER BY \"UDStrategicObjective\" ASC, EXTRACT(YEAR FROM \"Comm_Month\") ASC ) AS resultbyyear ) AS finalresult ON yearmatch.\"Year\" = finalresult.\"CommYear\" AND yearmatch.\"UDStrategicObjective\" = finalresult.\"UDStrategicObjective\" ORDER BY \"UDStrategicObjective\", \"Year\" ) SELECT * from ScenarioData";

            var innerparams = new { id = scenarioId };
            var summary = (await DbHelper.ExecuteDql<PortfolioNPVvsStratDataSummaryResult>(innerSql, innerparams));

            /*
            var summaryReturnResult = new List<PortfolioNPVvsStratDataSummaryResult>();
            summaryReturnResult.Add(summary);*/

            return summary;
        }
//===============================================================
// TEMPLATE END: ScenarioManager.cs.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: ScenarioManager.cs.2.1.tpl
//===============================================================
        public static async Task<IEnumerable<PortfolioCumalRiskvsEleDataSummaryResult>> PortfolioCumalRiskvsEleDataSummary(int scenarioId, AipmPortfolioResultFilter filter)
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
            var innerSql = $"SELECT CommYear , PrjCnt , SUM(Option1_Safety) OVER ( ORDER BY CommYear ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW )/1000 AS Safety , SUM(Option1_Compliance) OVER ( ORDER BY CommYear ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW ) AS Compliance , SUM(Option1_Financial) OVER ( ORDER BY CommYear ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW ) /1000 AS Financial , SUM(Option1_Reliability) OVER ( ORDER BY CommYear ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW )/1000 AS Reliability, SUM(Option1_Environment) OVER ( ORDER BY CommYear ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW )/1000 AS Environment, SUM(Option1_Customer) OVER ( ORDER BY CommYear ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW ) /1000 AS Customer FROM ( select EXTRACT( YEAR FROM \"Comm_Month\" ) as CommYear , count(distinct \"Project_ID\") as PrjCnt , sum(\"Option1_Safety\") as Option1_Safety , sum(\"Option1_Compliance\") as Option1_Compliance , sum(\"Option1_Financial\") as Option1_Financial , sum(\"Option1_Reliability\") as Option1_Reliability, sum(\"Option1_Environment\") as Option1_Environment, sum(\"Option1_Customer\") as Option1_Customer from ( select proj.\"Option1_Safety\" , proj.\"Option1_Compliance\" , proj.\"Option1_Financial\" , proj.\"Option1_Reliability\" , proj.\"Option1_Environment\" , proj.\"Option1_Customer\" , proj.\"Comm_Month\" , proj.\"Project_ID\" , mp.\"Id\" , mp.\"UDCFG_GeoStateCode\" , mp.\"UDCFG_BusinessAreaCode\", mp.\"UDProjectType\" , mp.\"UDVoltagekV\" , mp.\"UDStrategicObjective\" from ( SELECT \'Prioritised\' as \"resType\" , \"Plan_ID\" , \"Project_ID\" , \"Project_Definition\" , \"Start_Month_Scope_1\" , \"Month_Scope_1\" , \"Start_Month_Scope_2\" , \"Month_Scope_2\" , \"Start_Month_Scope_3\" , \"Month_Scope_3\" , \"Start_Month_Scope_4\" , \"Month_Scope_4\" , \"Comm_Month\" , \"Target_Comm_Month\" , \"Mandatory\" , \"Budget_Before_Revised\" , \"Total_Budget\" , \"BUDY1\" , \"BUDY2\" , \"BUDY3\" , \"BUDY4\" , \"BUDY5\" , \"BUDY6\" , \"BUDY7\" , \"BUDY8\" , \"Project_Score\" , \"Risk_Reduced\" , \"TCO_Opex\" , \"TCO_TotalProjectCost\" , \"NPV_RiskReduced\" , \"Defer\" , \"Option1_Safety\" , \"Option1_Compliance\" , \"Option1_Financial\" , \"Option1_Reliability\" , \"Option1_Environment\" , \"Option1_Customer\" , \"Defer_ID\" FROM public.\"PortfolioOpt_Approved_Proj\" union SELECT \'Defer\' as \"resType\" , \"Plan_ID\" , \"Project_ID\" , \"Project_Definition\" , \"Start_Month_Scope_1\" , \"Month_Scope_1\" , \"Start_Month_Scope_2\" , \"Month_Scope_2\" , \"Start_Month_Scope_3\" , \"Month_Scope_3\" , \"Start_Month_Scope_4\" , \"Month_Scope_4\" , \"Comm_Month\" , \"Target_Comm_Month\" , \"Mandatory\" , \"Budget_Before_Revised\", \"Total_Budget\" , \"BUDY1\" , \"BUDY2\" , \"BUDY3\" , \"BUDY4\" , \"BUDY5\" , \"BUDY6\" , \"BUDY7\" , \"BUDY8\" , \"Project_Score\" , \"Risk_Reduced\" , \"TCO_Opex\" , \"TCO_TotalProjectCost\" , \"NPV_RiskReduced\" , null as \"Defer\" , \"Option1_Safety\" , \"Option1_Compliance\" , \"Option1_Financial\" , \"Option1_Reliability\" , \"Option1_Environment\" , \"Option1_Customer\" , \"ID\" AS \"Defer_ID\" FROM public.\"PortfolioOpt_Deferred_Proj\" ) as proj inner join public.\"MP_Project\" as mp on proj.\"Project_ID\" = mp.\"Id\" LEFT JOIN public.\"PortfolioOpt_Approved_Proj\" as ap on proj.\"Plan_ID\" = ap.\"Plan_ID\" and proj.\"resType\" = \'Defer\' and proj.\"Defer_ID\" = ap.\"Defer_ID\" where proj.\"Plan_ID\" =(@id) and ( ( \"resType\" = \'Prioritised\' AND proj.\"Defer_ID\" IS NULL ) or ( \"resType\" = \'Defer\' AND ap.\"Plan_ID\" IS NOT NULL ) ) " + where + " ) as resultset group by EXTRACT( YEAR FROM \"Comm_Month\" ) order by EXTRACT( YEAR FROM \"Comm_Month\" ) asc ) AS data";

            var innerparams = new { id = scenarioId };
            var summary = (await DbHelper.ExecuteDql<PortfolioCumalRiskvsEleDataSummaryResult>(innerSql, innerparams));

            /*
            var summaryReturnResult = new List<PortfolioCumalRiskvsEleDataSummaryResult>();
            summaryReturnResult.Add(summary);*/

            return summary;
        }
//===============================================================
// TEMPLATE END: ScenarioManager.cs.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: ScenarioManager.cs.2.1.tpl
//===============================================================
        public static async Task<IEnumerable<PortfolioOSRiskDataSummaryResult>> PortfolioOSRiskDataSummary(int scenarioId, AipmPortfolioResultFilter filter)
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
            var innerSql = $"WITH PlanData AS ( SELECT DISTINCT ON(\"Plan_ID\") \"Plan_ID\" FROM public. \"PortfolioOpt_Approved_Proj\" WHERE \"Plan_ID\" = (@id)), ScenarioData AS ( Select \"RunningYear\" As \"Year\", \"Description\" , \"Value\" / 1000000 as \"Value\" from ( Select * , case when \"DescripOrder\" = 0 and \"resType\" = \'Deprio/Cancel\' then 1 when \"DescripOrder\" = 1 and \"resType\" = \'Deprio/Cancel\' then 2 when \"DescripOrder\" = 2 and \"resType\" = \'Deprio/Cancel\' then 3 when \"DescripOrder\" = 3 and \"resType\" = \'Deprio/Cancel\' then 4 when \"DescripOrder\" = 0 and \"resType\" = \'Defer\' then 5 when \"DescripOrder\" = 1 and \"resType\" = \'Defer\' then 6 when \"DescripOrder\" = 2 and \"resType\" = \'Defer\' then 7 when \"DescripOrder\" = 3 and \"resType\" = \'Defer\' then 8 end as \"porder\", case when \"DescripOrder\" = 0 and \"resType\" = \'Deprio/Cancel\' then \'NPV_RiskReduced - Deprio/Cancel\' when \"DescripOrder\" = 1 and \"resType\" = \'Deprio/Cancel\' then \'Inflation - Deprio/Cancel\' when \"DescripOrder\" = 2 and \"resType\" = \'Deprio/Cancel\' then \'NPV_RiskReducedGrowth - Deprio/Cancel\' when \"DescripOrder\" = 3 and \"resType\" = \'Deprio/Cancel\' then \'Penalty - Deprio/Cancel\' when \"DescripOrder\" = 0 and \"resType\" = \'Defer\' then \'NPV_RiskReduced - Defer\' when \"DescripOrder\" = 1 and \"resType\" = \'Defer\' then \'Inflation - Defer\' when \"DescripOrder\" = 2 and \"resType\" = \'Defer\' then \'NPV_RiskReducedGrowth - Defer\' when \"DescripOrder\" = 3 and \"resType\" = \'Defer\' then \'Penalty - Defer\' end as \"Description\", case when \"DescripOrder\" = 0 and \"resType\" = \'Deprio/Cancel\' then \"NPV_RiskReduced\" when \"DescripOrder\" = 1 and \"resType\" = \'Deprio/Cancel\' then \"Inflation\" when \"DescripOrder\" = 2 and \"resType\" = \'Deprio/Cancel\' then \"NPV_RiskReducedGrowth\" when \"DescripOrder\" = 3 and \"resType\" = \'Deprio/Cancel\' then \"Penalty\" when \"DescripOrder\" = 0 and \"resType\" = \'Defer\' then \"NPV_RiskReduced\" when \"DescripOrder\" = 1 and \"resType\" = \'Defer\' then \"Inflation\" when \"DescripOrder\" = 2 and \"resType\" = \'Defer\' then \"NPV_RiskReducedGrowth\" when \"DescripOrder\" = 3 and \"resType\" = \'Defer\' then \"Penalty\" end as \"Value\" from ( Select * , generate_series(0, 3) AS \"DescripOrder\" from ( SELECT \"RunningYear\" , \"resType\" , SUM(\"NPV_RiskReduced\") AS \"NPV_RiskReduced\" , SUM(\"Inflation\") AS \"Inflation\" , SUM(\"Prj_NPV_RiskReducedGrowth\") AS \"NPV_RiskReducedGrowth\", SUM(\"Penalty\") AS \"Penalty\" FROM ( SELECT \"Project_ID\" , \"GrowthRate\" , \"RunningYear\" , \"UDCFG_BusinessAreaCode\", \"NPV_RiskReduced\" , SUM(\"NPV_RiskReducedGrowth\") OVER ( partition by \"Project_ID\" ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW ) AS \"Prj_NPV_RiskReducedGrowth\", (\"NPV_RiskReduced\" * \"GrowthRate\" / 100) AS \"NPV_RiskReducedGrowth\" , (\"NPV_RiskReduced\" * (1 + 0.04) ^ (\"YearIndex\" + 1) - \"NPV_RiskReduced\") AS \"Inflation\" , \"Penalty\" , \"resType\" , \"YearIndex\" , \"ScenarioEndYear\" FROM ( SELECT \"Project_ID\" , \"GrowthRate\" , \"RunningYear\" , \"UDCFG_BusinessAreaCode\" , \"NPV_RiskReduced\" , (\"NPV_RiskReduced\" * \"GrowthRate\" / 100) AS \"NPV_RiskReducedGrowth\", (\"NPV_RiskReduced\" * (1 + 0.04) ^ (\"YearIndex\" + 1) - \"NPV_RiskReduced\") AS \"Inflation\" , \"Penalty\" , \"resType\" , \"YearIndex\" , \"ScenarioEndYear\" FROM ( SELECT \"Project_ID\" , \"RunningYear\" , \"UDCFG_BusinessAreaCode\" , \"resType\" , \"YearIndex\" , \"ScenarioEndYear\" , COALESCE(\"NPV_RiskReduced\", 0) AS \"NPV_RiskReduced\", CASE WHEN EXTRACT(YEAR FROM AGE(\"proj_start_Month\", \"ScenarioStartDate\")) > 1 or \"resType\" = \'Deprio/Cancel\' THEN COALESCE(\"ProjectPenalties\", 0) + COALESCE(d. \"UDScope1ActualCost\", d. \"Scope1ActualCost\", 0.00) + COALESCE(d. \"UDScope2ActualCost\", d. \"Scope2ActualCost\", 0.00) + COALESCE(d. \"UDScope3ActualCost\", d. \"Scope3ActualCost\", 0.00) + COALESCE(d. \"UDScope4ActualCost\", d. \"Scope4ActualCost\", 0.00) ELSE 0 END AS \"Penalty\" from ( SELECT \"Total_Budget\" , \"NPV_RiskReduced\" , npvproj. \"UDCFG_BusinessAreaCode\" , npvproj. \"Plan_ID\" , \"Project_ID\" , \"Defer_ID\" , npvproj. \"resType\" , \"YearIndex\" , \"StartYear\" + \"YearIndex\" AS \"RunningYear\" , \"EndYear\" as \"ScenarioEndYear\" , \"StartMonth\" As \"ScenarioStartMonth\" , \"defer_ori_start_Month\" , \"proj_start_Month\" , \"ProjectStatus\" , TO_DATE(CONCAT(\'1\', \'-\', \"StartMonth\", \'-\', \"StartYear\"), \'DD-MM-YYYY\') as \"ScenarioStartDate\", \"PenaltyPercentage\" , \"ProjectPenalties\" FROM ( SELECT proj. \"Plan_ID\" , proj. \"NPV_RiskReduced\" , proj. \"Project_ID\" , proj. \"Defer_ID\" , proj. \"resType\" , proj. \"Total_Budget\" , mp. \"Id\" , mp. \"UDCFG_GeoStateCode\" , mp. \"UDCFG_BusinessAreaCode\", mp. \"UDProjectType\" , mp. \"UDVoltagekV\" , mp. \"UDStrategicObjective\" , mp. \"PenaltyPercentage\" , mp. \"ProjectPenalties\" , case when \"resType\" = \'Defer\' then proj. \"start_Month\" else null end as \"proj_start_Month\" , mp. \"ProjectStatus\" , generate_series(0, 7) AS \"YearIndex\", LEAST(defer. \"Start_Month_Scope_1\", defer. \"Start_Month_Scope_2\", defer. \"Start_Month_Scope_3\", defer. \"Start_Month_Scope_4\") as \"defer_ori_start_Month\" FROM ( SELECT case when \"Defer_ID\" is null and \"Defer\" = true then \'Deprio/Cancel\' when \"Defer_ID\" is not null and \"Defer\" = true then \'Defer\' else null end as \"resType\" , \"Plan_ID\" , \"Project_ID\" , \"Defer_ID\" , \"Project_Definition\" , \"Mandatory\" , \"Project_Score\" , \"Risk_Reduced\" , \"Total_Budget\" , \"Budget_Before_Revised\", \"TCO_Opex\" , \"TCO_TotalProjectCost\" , \"NPV_RiskReduced\" , NULL AS \"Replace\" , \"Defer\" , \"Option1_Safety\" , \"Option1_Compliance\" , \"Option1_Financial\" , \"Option1_Reliability\" , \"Option1_Environment\" , \"Option1_Customer\" , LEAST(\"Start_Month_Scope_1\", \"Start_Month_Scope_2\", \"Start_Month_Scope_3\", \"Start_Month_Scope_4\") as \"start_Month\" FROM public. \"PortfolioOpt_Approved_Proj\" UNION SELECT \'Deprio/Cancel\' AS \"resType\", \"Plan_ID\" , \"Project_ID\" , null as \"Defer_ID\" , \"Project_Definition\" , \"Mandatory\" , \"Project_Score\" , \"Risk_Reduced\" , \"Total_Budget\" , \"Budget_Before_Revised\" , \"TCO_Opex\" , \"TCO_TotalProjectCost\" , \"NPV_RiskReduced\" , \"Replace\" , NULL AS \"Defer\" , \"Option1_Safety\" , \"Option1_Compliance\" , \"Option1_Financial\" , \"Option1_Reliability\" , \"Option1_Environment\" , \"Option1_Customer\" , null as \"start_Month\" FROM public. \"PortfolioOpt_Rejected_Proj\") AS proj INNER JOIN public. \"MP_Project\" AS mp ON proj. \"Project_ID\" = mp. \"Id\" Left JOIN public. \"PortfolioOpt_Deferred_Proj\" AS defer ON proj. \"Defer_ID\" = \"ID\" WHERE proj. \"Plan_ID\" IN ( SELECT \"Plan_ID\" FROM PlanData) AND ( \"resType\" is not null and( \"Replace\" is null or \"Replace\" is false)) AND (proj.\"Defer\" is null) ) AS npvproj INNER JOIN public. \"AIPM_PortfolioScenario\" AS ps ON npvproj. \"Plan_ID\" = ps. \"Id\" WHERE \"EndYear\" - \"StartYear\" >= \"YearIndex\") AS yearly_prj_list left join public. \"MP_BudgetSchedule\" AS d ON yearly_prj_list. \"Project_ID\" = d. \"MP_ProjectId\" where yearly_prj_list. \"proj_start_Month\" is null or ( \"RunningYear\" < extract(Year FROM(yearly_prj_list. \"proj_start_Month\")))) as yearly_prj_list_filtered LEFT JOIN ( SELECT \"CFG_BusinessAreaCode\", \"Year\" , max(\"GrowthRate\") as \"GrowthRate\" FROM ( SELECT distinct b. \"CFG_BusinessAreaCode\", b. \"Year\" , CASE WHEN b. \"GrowthRate\" <= 0 THEN 0 ELSE b. \"GrowthRate\" END AS \"GrowthRate\" FROM ( SELECT \"Id\" FROM ( SELECT \"cycleId\" FROM public. \"AIPM_PortfolioScenario\" WHERE \"Id\" IN ( SELECT \"Plan_ID\" FROM PlanData)) AS cycleid INNER JOIN public. \"LF_Project\" AS LF ON cycleid. \"cycleId\" = LF. \"CFG_CycleId\" WHERE \"WorkflowStatus\" != \'PendingSubmission\' AND \"ForecastType\" = \'Demand\' AND \"Deleted\" = \'false\') AS LFID INNER JOIN public. \"LF_GrowthResult\" AS b ON LFID. \"Id\" = b. \"LF_ProjectId\") AS npvgrowth group by \"CFG_BusinessAreaCode\", \"Year\") AS distinctnpvgrowth on yearly_prj_list_filtered. \"RunningYear\" = distinctnpvgrowth. \"Year\" AND yearly_prj_list_filtered. \"UDCFG_BusinessAreaCode\" = distinctnpvgrowth. \"CFG_BusinessAreaCode\" order by \"Project_ID\" , \"RunningYear\", \"resType\") AS yearly_list_filtered order by \"resType\" , \"Project_ID\", \"RunningYear\") AS finaltable Group By \"resType\", \"RunningYear\" Order By \"resType\", \"RunningYear\") as crossjoin) as transposestep1) as finaltable order by \"RunningYear\", \"porder\") select * from ScenarioData";

            var innerparams = new { id = scenarioId };
            var summary = (await DbHelper.ExecuteDql<PortfolioOSRiskDataSummaryResult>(innerSql, innerparams));

            /*
            var summaryReturnResult = new List<PortfolioOSRiskDataSummaryResult>();
            summaryReturnResult.Add(summary);*/

            return summary;
        }
//===============================================================
// TEMPLATE END: ScenarioManager.cs.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: ScenarioManager.cs.2.1.tpl
//===============================================================
        public static async Task<IEnumerable<PortfolioAnnualBudgetDataAltSummaryResult>> PortfolioAnnualBudgetDataAltSummary(int scenarioId, AipmPortfolioResultFilter filter)
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
            var innerSql = $"SELECT \"YearIndex\" + \"StartYear\" AS \"Year\" , null as \"FILLER\", SUM(\"BUDY\")/1000000 AS \"BUDY\" FROM ( SELECT proj.\"YearIndex\" , proj.\"Plan_ID\" , proj.\"Project_ID\" , proj.\"BUDY\" , proj.\"resType\" , mp.\"Id\" , mp.\"UDCFG_GeoStateCode\" , mp.\"UDCFG_BusinessAreaCode\", mp.\"UDProjectType\" , mp.\"UDVoltagekV\" , mp.\"UDStrategicObjective\" , config.\"StartYear\" , config.\"EndYear\" FROM ( SELECT case when \"Defer\" = true then \'Defer\' else \'Prioritised\' end AS \"resType\" , 0 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY1\" AS \"BUDY\" , \"Defer\" , \"Defer_ID\" FROM public.\"PortfolioOpt_Approved_Proj\" UNION SELECT case when \"Defer\" = true then \'Defer\' else \'Prioritised\' end AS \"resType\" , 1 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY2\" AS \"BUDY\" , \"Defer\" , \"Defer_ID\" FROM public.\"PortfolioOpt_Approved_Proj\" UNION SELECT case when \"Defer\" = true then \'Defer\' else \'Prioritised\' end AS \"resType\" , 2 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY3\" AS \"BUDY\" , \"Defer\" , \"Defer_ID\" FROM public.\"PortfolioOpt_Approved_Proj\" UNION SELECT case when \"Defer\" = true then \'Defer\' else \'Prioritised\' end AS \"resType\" , 3 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY4\" AS \"BUDY\" , \"Defer\" , \"Defer_ID\" FROM public.\"PortfolioOpt_Approved_Proj\" UNION SELECT case when \"Defer\" = true then \'Defer\' else \'Prioritised\' end AS \"resType\" , 4 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY5\" AS \"BUDY\" , \"Defer\" , \"Defer_ID\" FROM public.\"PortfolioOpt_Approved_Proj\" UNION SELECT case when \"Defer\" = true then \'Defer\' else \'Prioritised\' end AS \"resType\" , 5 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY6\" AS \"BUDY\" , \"Defer\" , \"Defer_ID\" FROM public.\"PortfolioOpt_Approved_Proj\" UNION SELECT case when \"Defer\" = true then \'Defer\' else \'Prioritised\' end AS \"resType\" , 6 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY7\" AS \"BUDY\" , \"Defer\" , \"Defer_ID\" FROM public.\"PortfolioOpt_Approved_Proj\" UNION SELECT case when \"Defer\" = true then \'Defer\' else \'Prioritised\' end AS \"resType\" , 7 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY8\" AS \"BUDY\" , \"Defer\" , \"Defer_ID\" FROM public.\"PortfolioOpt_Approved_Proj\" UNION SELECT \'Alternate\' AS \"resType\" , 0 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY1\" AS \"BUDY\" , NULL AS \"Defer\" , NULL AS \"Defer_ID\" FROM public.\"PortfolioOpt_Alternate_Proj\" UNION SELECT \'Alternate\' AS \"resType\" , 1 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY2\" AS \"BUDY\" , NULL AS \"Defer\" , NULL AS \"Defer_ID\" FROM public.\"PortfolioOpt_Alternate_Proj\" UNION SELECT \'Alternate\' AS \"resType\" , 2 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY3\" AS \"BUDY\" , NULL AS \"Defer\" , NULL AS \"Defer_ID\" FROM public.\"PortfolioOpt_Alternate_Proj\" UNION SELECT \'Alternate\' AS \"resType\" , 3 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY4\" AS \"BUDY\" , NULL AS \"Defer\" , NULL AS \"Defer_ID\" FROM public.\"PortfolioOpt_Alternate_Proj\" UNION SELECT \'Alternate\' AS \"resType\" , 4 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY5\" AS \"BUDY\" , NULL AS \"Defer\" , NULL AS \"Defer_ID\" FROM public.\"PortfolioOpt_Alternate_Proj\" UNION SELECT \'Alternate\' AS \"resType\" , 5 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY6\" AS \"BUDY\" , NULL AS \"Defer\" , NULL AS \"Defer_ID\" FROM public.\"PortfolioOpt_Alternate_Proj\" UNION SELECT \'Alternate\' AS \"resType\" , 6 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY7\" AS \"BUDY\" , NULL AS \"Defer\" , NULL AS \"Defer_ID\" FROM public.\"PortfolioOpt_Alternate_Proj\" UNION SELECT \'Alternate\' AS \"resType\" , 7 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY8\" AS \"BUDY\" , NULL AS \"Defer\" , NULL AS \"Defer_ID\" FROM public.\"PortfolioOpt_Alternate_Proj\" ) AS proj INNER JOIN public.\"MP_Project\" AS mp ON proj.\"Project_ID\" = mp.\"Id\" INNER JOIN public.\"AIPM_PortfolioScenario\" as config on proj.\"Plan_ID\" = config.\"Id\" WHERE proj.\"Plan_ID\" = (@id) AND ( ( \"resType\" = \'Prioritised\') OR ( \"resType\" = \'Defer\' AND \"Defer_ID\" IS Not NULL ) OR ( \"resType\" = \'Alternate\' ) ) " + where + " ) AS resultset Where \"YearIndex\" + \"StartYear\" <= \"EndYear\" GROUP BY \"YearIndex\", \"Plan_ID\" , \"StartYear\", \"EndYear\" order by \"YearIndex\";";

            var innerparams = new { id = scenarioId };
            var summary = (await DbHelper.ExecuteDql<PortfolioAnnualBudgetDataAltSummaryResult>(innerSql, innerparams));

            /*
            var summaryReturnResult = new List<PortfolioAnnualBudgetDataAltSummaryResult>();
            summaryReturnResult.Add(summary);*/

            return summary;
        }
//===============================================================
// TEMPLATE END: ScenarioManager.cs.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: ScenarioManager.cs.2.1.tpl
//===============================================================
        public static async Task<IEnumerable<PortfolioBudgetvsStratDataAltSummaryResult>> PortfolioBudgetvsStratDataAltSummary(int scenarioId, AipmPortfolioResultFilter filter)
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
            var innerSql = $"SELECT \"YearIndex\" + \"StartYear\" AS \"Year\", \"UDStrategicObjective\" , SUM(\"BUDY\")/1000000 AS \"BUDY\" FROM ( SELECT proj.\"YearIndex\" , proj.\"Plan_ID\" , proj.\"Project_ID\" , proj.\"BUDY\" , proj.\"resType\" , mp.\"Id\" , mp.\"UDCFG_GeoStateCode\" , mp.\"UDCFG_BusinessAreaCode\", mp.\"UDProjectType\" , mp.\"UDVoltagekV\" , mp.\"UDStrategicObjective\" , config.\"StartYear\" , config.\"EndYear\" FROM ( SELECT case when \"Defer\" = true then \'Defer\' else \'Prioritised\' end AS \"resType\" , 0 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY1\" AS \"BUDY\" , \"Defer\" , \"Defer_ID\" FROM public.\"PortfolioOpt_Approved_Proj\" UNION SELECT case when \"Defer\" = true then \'Defer\' else \'Prioritised\' end AS \"resType\" , 1 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY2\" AS \"BUDY\" , \"Defer\" , \"Defer_ID\" FROM public.\"PortfolioOpt_Approved_Proj\" UNION SELECT case when \"Defer\" = true then \'Defer\' else \'Prioritised\' end AS \"resType\" , 2 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY3\" AS \"BUDY\" , \"Defer\" , \"Defer_ID\" FROM public.\"PortfolioOpt_Approved_Proj\" UNION SELECT case when \"Defer\" = true then \'Defer\' else \'Prioritised\' end AS \"resType\" , 3 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY4\" AS \"BUDY\" , \"Defer\" , \"Defer_ID\" FROM public.\"PortfolioOpt_Approved_Proj\" UNION SELECT case when \"Defer\" = true then \'Defer\' else \'Prioritised\' end AS \"resType\" , 4 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY5\" AS \"BUDY\" , \"Defer\" , \"Defer_ID\" FROM public.\"PortfolioOpt_Approved_Proj\" UNION SELECT case when \"Defer\" = true then \'Defer\' else \'Prioritised\' end AS \"resType\" , 5 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY6\" AS \"BUDY\" , \"Defer\" , \"Defer_ID\" FROM public.\"PortfolioOpt_Approved_Proj\" UNION SELECT case when \"Defer\" = true then \'Defer\' else \'Prioritised\' end AS \"resType\" , 6 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY7\" AS \"BUDY\" , \"Defer\" , \"Defer_ID\" FROM public.\"PortfolioOpt_Approved_Proj\" UNION SELECT case when \"Defer\" = true then \'Defer\' else \'Prioritised\' end AS \"resType\" , 7 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY8\" AS \"BUDY\" , \"Defer\" , \"Defer_ID\" FROM public.\"PortfolioOpt_Approved_Proj\" UNION SELECT \'Alternate\' AS \"resType\" , 0 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY1\" AS \"BUDY\" , NULL AS \"Defer\" , NULL AS \"Defer_ID\" FROM public.\"PortfolioOpt_Alternate_Proj\" UNION SELECT \'Alternate\' AS \"resType\" , 1 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY2\" AS \"BUDY\" , NULL AS \"Defer\" , NULL AS \"Defer_ID\" FROM public.\"PortfolioOpt_Alternate_Proj\" UNION SELECT \'Alternate\' AS \"resType\" , 2 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY3\" AS \"BUDY\" , NULL AS \"Defer\" , NULL AS \"Defer_ID\" FROM public.\"PortfolioOpt_Alternate_Proj\" UNION SELECT \'Alternate\' AS \"resType\" , 3 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY4\" AS \"BUDY\" , NULL AS \"Defer\" , NULL AS \"Defer_ID\" FROM public.\"PortfolioOpt_Alternate_Proj\" UNION SELECT \'Alternate\' AS \"resType\" , 4 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY5\" AS \"BUDY\" , NULL AS \"Defer\" , NULL AS \"Defer_ID\" FROM public.\"PortfolioOpt_Alternate_Proj\" UNION SELECT \'Alternate\' AS \"resType\" , 5 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY6\" AS \"BUDY\" , NULL AS \"Defer\" , NULL AS \"Defer_ID\" FROM public.\"PortfolioOpt_Alternate_Proj\" UNION SELECT \'Alternate\' AS \"resType\" , 6 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY7\" AS \"BUDY\" , NULL AS \"Defer\" , NULL AS \"Defer_ID\" FROM public.\"PortfolioOpt_Alternate_Proj\" UNION SELECT \'Alternate\' AS \"resType\" , 7 AS \"YearIndex\", \"Plan_ID\" , \"Project_ID\" , \"BUDY8\" AS \"BUDY\" , NULL AS \"Defer\" , NULL AS \"Defer_ID\" FROM public.\"PortfolioOpt_Alternate_Proj\" ) AS proj INNER JOIN public.\"MP_Project\" AS mp ON proj.\"Project_ID\" = mp.\"Id\" INNER JOIN public.\"AIPM_PortfolioScenario\" as config on proj.\"Plan_ID\" = config.\"Id\" WHERE proj.\"Plan_ID\" = (@id) AND ( ( \"resType\" = \'Prioritised\') OR ( \"resType\" = \'Defer\' AND \"Defer_ID\" IS Not NULL ) OR ( \"resType\" = \'Alternate\' ) ) " + where + " ) AS resultset Where \"YearIndex\" + \"StartYear\" <= \"EndYear\" GROUP BY \"YearIndex\", \"Plan_ID\" , \"StartYear\", \"EndYear\" , \"UDStrategicObjective\" order by \"YearIndex\";";

            var innerparams = new { id = scenarioId };
            var summary = (await DbHelper.ExecuteDql<PortfolioBudgetvsStratDataAltSummaryResult>(innerSql, innerparams));

            /*
            var summaryReturnResult = new List<PortfolioBudgetvsStratDataAltSummaryResult>();
            summaryReturnResult.Add(summary);*/

            return summary;
        }
//===============================================================
// TEMPLATE END: ScenarioManager.cs.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: ScenarioManager.cs.2.1.tpl
//===============================================================
        public static async Task<IEnumerable<PortfolioNPVvsCommMthDataAltSummaryResult>> PortfolioNPVvsCommMthDataAltSummary(int scenarioId, AipmPortfolioResultFilter filter)
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
            var innerSql = $"SELECT \"Year\" , \"YearIndex\", case when \"Year\" - \"StartYear\" > \"YearIndex\" then 0 else \"NPV_RiskReduced\" end as \"NPV_RiskReduced\" from ( Select \"Count\" as \"Year\" , generate_series(0, \"EndYear\"-\"StartYear\") AS \"YearIndex\" , max (resultset3.\"NPV_RiskReduced\") as \"NPV_RiskReduced\", \"StartYear\" , \"EndYear\" from ( Select \"Count\", case when \"CommYear\"=\"Count\" then \"NPV_RiskReduced\" else 0 end as \"NPV_RiskReduced\", \"StartYear\" , \"EndYear\" from ( SELECT \"StartYear\" , \"CommYear\" , \"EndYear\" , sum(\"NPV_RiskReduced\")/ 1000000 as \"NPV_RiskReduced\", generate_series(\"StartYear\",\"EndYear\") AS \"Count\" FROM ( SELECT proj.\"Plan_ID\" , proj.\"Project_ID\" , proj.\"NPV_RiskReduced\" , proj.\"resType\" , EXTRACT( YEAR FROM proj.\"Comm_Month\" ) as \"CommYear\", mp.\"Id\" , mp.\"UDCFG_GeoStateCode\" , mp.\"UDCFG_BusinessAreaCode\" , mp.\"UDProjectType\" , mp.\"UDVoltagekV\" , mp.\"UDStrategicObjective\" , config.\"StartYear\" , config.\"EndYear\" FROM ( SELECT case when \"Defer\" = true then \'Defer\' else \'Prioritised\' end AS \"resType\" , \"Comm_Month\" , \"Plan_ID\" , \"Project_ID\" , \"NPV_RiskReduced\" , \"Defer\" , \"Defer_ID\" FROM public.\"PortfolioOpt_Approved_Proj\" UNION SELECT \'Alternate\' AS \"resType\", \"Comm_Month\" , \"Plan_ID\" , \"Project_ID\" , \"NPV_RiskReduced\" , NULL AS \"Defer\" , NULL AS \"Defer_ID\" FROM public.\"PortfolioOpt_Alternate_Proj\" ) AS proj INNER JOIN public.\"MP_Project\" AS mp ON proj.\"Project_ID\" = mp.\"Id\" INNER JOIN public.\"AIPM_PortfolioScenario\" as config on proj.\"Plan_ID\" = config.\"Id\" WHERE proj.\"Plan_ID\" = (@id) AND ( ( \"resType\" = \'Prioritised\') OR ( \"resType\" = \'Defer\' AND \"Defer_ID\" IS Not NULL ) OR ( \"resType\" = \'Alternate\' ) ) " + where + " ) AS resultset GROUP BY \"StartYear\", \"CommYear\" , \"Count\" , \"EndYear\" ORDER BY \"Count\" ASC, \"CommYear\" ASC) as resultset2) as resultset3 group by \"Year\" , \"StartYear\", \"EndYear\") as resultset4 WHERE \"Year\" is not null order by \"YearIndex\", \"Year\";";

            var innerparams = new { id = scenarioId };
            var summary = (await DbHelper.ExecuteDql<PortfolioNPVvsCommMthDataAltSummaryResult>(innerSql, innerparams));

            /*
            var summaryReturnResult = new List<PortfolioNPVvsCommMthDataAltSummaryResult>();
            summaryReturnResult.Add(summary);*/

            return summary;
        }
//===============================================================
// TEMPLATE END: ScenarioManager.cs.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: ScenarioManager.cs.2.1.tpl
//===============================================================
        public static async Task<IEnumerable<PortfolioNPVvsStratDataAltSummaryResult>> PortfolioNPVvsStratDataAltSummary(int scenarioId, AipmPortfolioResultFilter filter)
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
            var innerSql = $"WITH PlanData AS ( SELECT DISTINCT ON (\"Plan_ID\") \"Plan_ID\" FROM public.\"PortfolioOpt_Approved_Proj\" WHERE \"Plan_ID\" = (@id) ), ScenarioData AS ( SELECT \"Year\" , yearmatch.\"UDStrategicObjective\", SUM(finalresult.\"NPV_RiskReduced\") OVER ( PARTITION BY yearmatch.\"UDStrategicObjective\" ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW ) AS \"NPV_RiskReduced\" FROM ( SELECT \"StartYear\" + \"YearIndex\" AS \"Year\", \"UDStrategicObjective\" FROM ( SELECT DISTINCT mp.\"UDStrategicObjective\" , generate_series(0, 7) AS \"YearIndex\", ps.\"StartYear\" , ps.\"EndYear\" FROM ( SELECT case when \"Defer\" = true then \'Defer\' else \'Prioritised\' end AS \"resType\" , \"Plan_ID\" , \"Project_ID\" , \"Defer\" , \"Defer_ID\" FROM public.\"PortfolioOpt_Approved_Proj\" UNION SELECT \'Alternate\' AS \"resType\", \"Plan_ID\" , \"Project_ID\" , NULL AS \"Defer\" , NULL AS \"Defer_ID\" FROM public.\"PortfolioOpt_Alternate_Proj\" ) AS proj INNER JOIN public.\"MP_Project\" AS mp ON proj.\"Project_ID\" = mp.\"Id\" INNER JOIN public.\"AIPM_PortfolioScenario\" AS ps ON proj.\"Plan_ID\" = ps.\"Id\" WHERE proj.\"Plan_ID\" IN ( SELECT \"Plan_ID\" FROM PlanData) AND ( ( \"resType\" = \'Prioritised\') OR ( \"resType\" = \'Defer\' AND \"Defer_ID\" IS Not NULL ) OR ( \"resType\" = \'Alternate\') ) ) AS rowgeneration WHERE \"StartYear\" + \"YearIndex\" <= \"EndYear\" ORDER BY \"UDStrategicObjective\", \"YearIndex\" ) AS yearmatch LEFT JOIN ( SELECT \"CommYear\" , \"UDStrategicObjective\", COALESCE(\"NPV_RiskReduced\",0) as \"NPV_RiskReduced\" FROM ( SELECT \"UDStrategicObjective\" AS \"UDStrategicObjective\", SUM(\"NPV_RiskReduced\") / 1000000 AS \"NPV_RiskReduced\" , EXTRACT(YEAR FROM \"Comm_Month\") AS \"CommYear\" FROM ( SELECT proj.\"NPV_RiskReduced\" , proj.\"Project_ID\" , proj.\"Comm_Month\" , mp.\"Id\" , mp.\"UDCFG_GeoStateCode\" , mp.\"UDCFG_BusinessAreaCode\", mp.\"UDProjectType\" , mp.\"UDVoltagekV\" , mp.\"UDStrategicObjective\" FROM ( SELECT \'Approved\' AS resType , \"Plan_ID\" , \"Project_ID\" , \"Project_Definition\" , \"Start_Month_Scope_1\" , \"Month_Scope_1\" , \"Start_Month_Scope_2\" , \"Month_Scope_2\" , \"Start_Month_Scope_3\" , \"Month_Scope_3\" , \"Start_Month_Scope_4\" , \"Month_Scope_4\" , \"Comm_Month\" , \"Target_Comm_Month\" , \"Mandatory\" , \"Budget_Before_Revised\", \"Total_Budget\" , \"BUDY1\" , \"BUDY2\" , \"BUDY3\" , \"BUDY4\" , \"BUDY5\" , \"BUDY6\" , \"BUDY7\" , \"BUDY8\" , \"Project_Score\" , \"Risk_Reduced\" , \"TCO_Opex\" , \"TCO_TotalProjectCost\" , \"NPV_RiskReduced\" , \"Defer\" , \"Option1_Safety\" , \"Option1_Compliance\" , \"Option1_Financial\" , \"Option1_Reliability\" , \"Option1_Environment\" , \"Option1_Customer\" FROM public.\"PortfolioOpt_Approved_Proj\" UNION SELECT \'Alternate\' AS resType , \"Plan_ID\" , \"Project_ID\" , \"Project_Definition\" , \"Start_Month_Scope_1\" , \"Month_Scope_1\" , \"Start_Month_Scope_2\" , \"Month_Scope_2\" , \"Start_Month_Scope_3\" , \"Month_Scope_3\" , \"Start_Month_Scope_4\" , \"Month_Scope_4\" , \"Comm_Month\" , \"Target_Comm_Month\" , \"Mandatory\" , \"Budget_Before_Revised\", \"Total_Budget\" , \"BUDY1\" , \"BUDY2\" , \"BUDY3\" , \"BUDY4\" , \"BUDY5\" , \"BUDY6\" , \"BUDY7\" , \"BUDY8\" , \"Project_Score\" , \"Risk_Reduced\" , \"TCO_Opex\" , \"TCO_TotalProjectCost\" , \"NPV_RiskReduced\" , NULL AS \"Defer\" , \"Option1_Safety\" , \"Option1_Compliance\" , \"Option1_Financial\" , \"Option1_Reliability\" , \"Option1_Environment\" , \"Option1_Customer\" FROM public.\"PortfolioOpt_Alternate_Proj\" ) AS proj INNER JOIN public.\"MP_Project\" AS mp ON proj.\"Project_ID\" = mp.\"Id\" WHERE \"Plan_ID\" IN ( SELECT \"Plan_ID\" FROM PlanData) AND ( ( resType = \'Approved\' AND ( \"Defer\" IS NULL OR \"Defer\" IS FALSE)) OR ( resType = \'Alternate\') ) " + where + " ) AS projresult GROUP BY \"UDStrategicObjective\", EXTRACT(YEAR FROM \"Comm_Month\") ORDER BY \"UDStrategicObjective\" ASC, EXTRACT(YEAR FROM \"Comm_Month\") ASC ) AS resultbyyear ) AS finalresult ON yearmatch.\"Year\" = finalresult.\"CommYear\" AND yearmatch.\"UDStrategicObjective\" = finalresult.\"UDStrategicObjective\" ORDER BY \"UDStrategicObjective\", \"Year\" ) SELECT * from ScenarioData";

            var innerparams = new { id = scenarioId };
            var summary = (await DbHelper.ExecuteDql<PortfolioNPVvsStratDataAltSummaryResult>(innerSql, innerparams));

            /*
            var summaryReturnResult = new List<PortfolioNPVvsStratDataAltSummaryResult>();
            summaryReturnResult.Add(summary);*/

            return summary;
        }
//===============================================================
// TEMPLATE END: ScenarioManager.cs.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: ScenarioManager.cs.2.1.tpl
//===============================================================
        public static async Task<IEnumerable<PortfolioCumalRiskvsEleDataAltSummaryResult>> PortfolioCumalRiskvsEleDataAltSummary(int scenarioId, AipmPortfolioResultFilter filter)
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
            var innerSql = $"SELECT CommYear , PrjCnt , SUM(Option1_Safety) OVER ( ORDER BY CommYear ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW )/1000 AS Safety , SUM(Option1_Compliance) OVER ( ORDER BY CommYear ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW ) AS Compliance , SUM(Option1_Financial) OVER ( ORDER BY CommYear ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW ) /1000 AS Financial , SUM(Option1_Reliability) OVER ( ORDER BY CommYear ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW )/1000 AS Reliability, SUM(Option1_Environment) OVER ( ORDER BY CommYear ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW )/1000 AS Environment, SUM(Option1_Customer) OVER ( ORDER BY CommYear ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW ) /1000 AS Customer FROM ( select EXTRACT( YEAR FROM \"Comm_Month\" ) as CommYear , count(distinct \"Project_ID\") as PrjCnt , sum(\"Option1_Safety\") as Option1_Safety , sum(\"Option1_Compliance\") as Option1_Compliance , sum(\"Option1_Financial\") as Option1_Financial , sum(\"Option1_Reliability\") as Option1_Reliability, sum(\"Option1_Environment\") as Option1_Environment, sum(\"Option1_Customer\") as Option1_Customer from ( select proj.\"Option1_Safety\" , proj.\"Option1_Compliance\" , proj.\"Option1_Financial\" , proj.\"Option1_Reliability\" , proj.\"Option1_Environment\" , proj.\"Option1_Customer\" , proj.\"Comm_Month\" , proj.\"Project_ID\" , mp.\"Id\" , mp.\"UDCFG_GeoStateCode\" , mp.\"UDCFG_BusinessAreaCode\", mp.\"UDProjectType\" , mp.\"UDVoltagekV\" , mp.\"UDStrategicObjective\" from ( SELECT case when \"Defer\" = true then \'Defer\' else \'Prioritised\' end AS \"resType\" , \"Plan_ID\" , \"Project_ID\" , \"Project_Definition\" , \"Start_Month_Scope_1\" , \"Month_Scope_1\" , \"Start_Month_Scope_2\" , \"Month_Scope_2\" , \"Start_Month_Scope_3\" , \"Month_Scope_3\" , \"Start_Month_Scope_4\" , \"Month_Scope_4\" , \"Comm_Month\" , \"Target_Comm_Month\" , \"Mandatory\" , \"Budget_Before_Revised\", \"Total_Budget\" , \"BUDY1\" , \"BUDY2\" , \"BUDY3\" , \"BUDY4\" , \"BUDY5\" , \"BUDY6\" , \"BUDY7\" , \"BUDY8\" , \"Project_Score\" , \"Risk_Reduced\" , \"TCO_Opex\" , \"TCO_TotalProjectCost\" , \"NPV_RiskReduced\" , \"Defer\" , \"Option1_Safety\" , \"Option1_Compliance\" , \"Option1_Financial\" , \"Option1_Reliability\" , \"Option1_Environment\" , \"Option1_Customer\", \"Defer_ID\" FROM public.\"PortfolioOpt_Approved_Proj\" union SELECT \'Alternate\' as \"resType\" , \"Plan_ID\" , \"Project_ID\" , \"Project_Definition\" , \"Start_Month_Scope_1\" , \"Month_Scope_1\" , \"Start_Month_Scope_2\" , \"Month_Scope_2\" , \"Start_Month_Scope_3\" , \"Month_Scope_3\" , \"Start_Month_Scope_4\" , \"Month_Scope_4\" , \"Comm_Month\" , \"Target_Comm_Month\" , \"Mandatory\" , \"Budget_Before_Revised\" , \"Total_Budget\" , \"BUDY1\" , \"BUDY2\" , \"BUDY3\" , \"BUDY4\" , \"BUDY5\" , \"BUDY6\" , \"BUDY7\" , \"BUDY8\" , \"Project_Score\" , \"Risk_Reduced\" , \"TCO_Opex\" , \"TCO_TotalProjectCost\" , \"NPV_RiskReduced\" , null as \"Defer\" , \"Option1_Safety\" , \"Option1_Compliance\" , \"Option1_Financial\" , \"Option1_Reliability\" , \"Option1_Environment\" , \"Option1_Customer\", NULL AS \"Defer_ID\" FROM public.\"PortfolioOpt_Alternate_Proj\" ) as proj inner join public.\"MP_Project\" as mp on proj.\"Project_ID\" = mp.\"Id\" where proj.\"Plan_ID\" =(@id) and ( ( \"resType\" = \'Prioritised\') OR ( \"resType\" = \'Defer\' AND \"Defer_ID\" IS Not NULL ) or ( \"resType\" = \'Alternate\') ) " + where + " ) as resultset group by EXTRACT( YEAR FROM \"Comm_Month\" ) order by EXTRACT( YEAR FROM \"Comm_Month\" ) asc ) AS data";

            var innerparams = new { id = scenarioId };
            var summary = (await DbHelper.ExecuteDql<PortfolioCumalRiskvsEleDataAltSummaryResult>(innerSql, innerparams));

            /*
            var summaryReturnResult = new List<PortfolioCumalRiskvsEleDataAltSummaryResult>();
            summaryReturnResult.Add(summary);*/

            return summary;
        }
//===============================================================
// TEMPLATE END: ScenarioManager.cs.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: ScenarioManager.cs.2.1.tpl
//===============================================================
        public static async Task<IEnumerable<PortfolioOSRiskDataAltSummaryResult>> PortfolioOSRiskDataAltSummary(int scenarioId, AipmPortfolioResultFilter filter)
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
            var innerSql = $"WITH PlanData AS ( SELECT DISTINCT ON(\"Plan_ID\") \"Plan_ID\" FROM public. \"PortfolioOpt_Approved_Proj\" WHERE \"Plan_ID\" = (@id)), ScenarioData AS ( Select \"RunningYear\" As \"Year\", \"Description\" , \"Value\" / 1000000 as \"Value\" from ( Select * , case when \"DescripOrder\" = 0 and \"resType\" = \'Deprio/Cancel\' then 1 when \"DescripOrder\" = 1 and \"resType\" = \'Deprio/Cancel\' then 2 when \"DescripOrder\" = 2 and \"resType\" = \'Deprio/Cancel\' then 3 when \"DescripOrder\" = 3 and \"resType\" = \'Deprio/Cancel\' then 4 when \"DescripOrder\" = 0 and \"resType\" = \'Defer\' then 5 when \"DescripOrder\" = 1 and \"resType\" = \'Defer\' then 6 when \"DescripOrder\" = 2 and \"resType\" = \'Defer\' then 7 when \"DescripOrder\" = 3 and \"resType\" = \'Defer\' then 8 end as \"porder\", case when \"DescripOrder\" = 0 and \"resType\" = \'Deprio/Cancel\' then \'NPV_RiskReduced - Deprio/Cancel\' when \"DescripOrder\" = 1 and \"resType\" = \'Deprio/Cancel\' then \'Inflation - Deprio/Cancel\' when \"DescripOrder\" = 2 and \"resType\" = \'Deprio/Cancel\' then \'NPV_RiskReducedGrowth - Deprio/Cancel\' when \"DescripOrder\" = 3 and \"resType\" = \'Deprio/Cancel\' then \'Penalty - Deprio/Cancel\' when \"DescripOrder\" = 0 and \"resType\" = \'Defer\' then \'NPV_RiskReduced - Defer\' when \"DescripOrder\" = 1 and \"resType\" = \'Defer\' then \'Inflation - Defer\' when \"DescripOrder\" = 2 and \"resType\" = \'Defer\' then \'NPV_RiskReducedGrowth - Defer\' when \"DescripOrder\" = 3 and \"resType\" = \'Defer\' then \'Penalty - Defer\' end as \"Description\", case when \"DescripOrder\" = 0 and \"resType\" = \'Deprio/Cancel\' then \"NPV_RiskReduced\" when \"DescripOrder\" = 1 and \"resType\" = \'Deprio/Cancel\' then \"Inflation\" when \"DescripOrder\" = 2 and \"resType\" = \'Deprio/Cancel\' then \"NPV_RiskReducedGrowth\" when \"DescripOrder\" = 3 and \"resType\" = \'Deprio/Cancel\' then \"Penalty\" when \"DescripOrder\" = 0 and \"resType\" = \'Defer\' then \"NPV_RiskReduced\" when \"DescripOrder\" = 1 and \"resType\" = \'Defer\' then \"Inflation\" when \"DescripOrder\" = 2 and \"resType\" = \'Defer\' then \"NPV_RiskReducedGrowth\" when \"DescripOrder\" = 3 and \"resType\" = \'Defer\' then \"Penalty\" end as \"Value\" from ( Select * , generate_series(0, 3) AS \"DescripOrder\" from ( SELECT \"RunningYear\" , \"resType\" , SUM(\"NPV_RiskReduced\") AS \"NPV_RiskReduced\" , SUM(\"Inflation\") AS \"Inflation\" , SUM(\"Prj_NPV_RiskReducedGrowth\") AS \"NPV_RiskReducedGrowth\", SUM(\"Penalty\") AS \"Penalty\" FROM ( SELECT \"Project_ID\" , \"GrowthRate\" , \"RunningYear\" , \"UDCFG_BusinessAreaCode\", \"NPV_RiskReduced\" , SUM(\"NPV_RiskReducedGrowth\") OVER ( partition by \"Project_ID\" ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW ) AS \"Prj_NPV_RiskReducedGrowth\", (\"NPV_RiskReduced\" * \"GrowthRate\" / 100) AS \"NPV_RiskReducedGrowth\" , (\"NPV_RiskReduced\" * (1 + 0.04) ^ (\"YearIndex\" + 1) - \"NPV_RiskReduced\") AS \"Inflation\" , \"Penalty\" , \"resType\" , \"YearIndex\" , \"ScenarioEndYear\" FROM ( SELECT \"Project_ID\" , \"GrowthRate\" , \"RunningYear\" , \"UDCFG_BusinessAreaCode\" , \"NPV_RiskReduced\" , (\"NPV_RiskReduced\" * \"GrowthRate\" / 100) AS \"NPV_RiskReducedGrowth\", (\"NPV_RiskReduced\" * (1 + 0.04) ^ (\"YearIndex\" + 1) - \"NPV_RiskReduced\") AS \"Inflation\" , \"Penalty\" , \"resType\" , \"YearIndex\" , \"ScenarioEndYear\" FROM ( SELECT \"Project_ID\" , \"RunningYear\" , \"UDCFG_BusinessAreaCode\" , \"resType\" , \"YearIndex\" , \"ScenarioEndYear\" , COALESCE(\"NPV_RiskReduced\", 0) AS \"NPV_RiskReduced\", CASE WHEN EXTRACT(YEAR FROM AGE(\"proj_start_Month\", \"ScenarioStartDate\")) > 1 or \"resType\" = \'Deprio/Cancel\' THEN COALESCE(\"ProjectPenalties\", 0) + COALESCE(d. \"UDScope1ActualCost\", d. \"Scope1ActualCost\", 0.00) + COALESCE(d. \"UDScope2ActualCost\", d. \"Scope2ActualCost\", 0.00) + COALESCE(d. \"UDScope3ActualCost\", d. \"Scope3ActualCost\", 0.00) + COALESCE(d. \"UDScope4ActualCost\", d. \"Scope4ActualCost\", 0.00) ELSE 0 END AS \"Penalty\" from ( SELECT \"Total_Budget\" , \"NPV_RiskReduced\" , npvproj. \"UDCFG_BusinessAreaCode\" , npvproj. \"Plan_ID\" , \"Project_ID\" , \"Defer_ID\" , npvproj. \"resType\" , \"YearIndex\" , \"StartYear\" + \"YearIndex\" AS \"RunningYear\" , \"EndYear\" as \"ScenarioEndYear\" , \"StartMonth\" As \"ScenarioStartMonth\" , \"defer_ori_start_Month\" , \"proj_start_Month\" , \"ProjectStatus\" , TO_DATE(CONCAT(\'1\', \'-\', \"StartMonth\", \'-\', \"StartYear\"), \'DD-MM-YYYY\') as \"ScenarioStartDate\", \"PenaltyPercentage\" , \"ProjectPenalties\" FROM ( SELECT proj. \"Plan_ID\" , proj. \"NPV_RiskReduced\" , proj. \"Project_ID\" , proj. \"Defer_ID\" , proj. \"resType\" , proj. \"Total_Budget\" , mp. \"Id\" , mp. \"UDCFG_GeoStateCode\" , mp. \"UDCFG_BusinessAreaCode\", mp. \"UDProjectType\" , mp. \"UDVoltagekV\" , mp. \"UDStrategicObjective\" , mp. \"PenaltyPercentage\" , mp. \"ProjectPenalties\" , case when \"resType\" = \'Defer\' then proj. \"start_Month\" else null end as \"proj_start_Month\" , mp. \"ProjectStatus\" , generate_series(0, 7) AS \"YearIndex\", LEAST(defer. \"Start_Month_Scope_1\", defer. \"Start_Month_Scope_2\", defer. \"Start_Month_Scope_3\", defer. \"Start_Month_Scope_4\") as \"defer_ori_start_Month\" FROM ( SELECT case when \"Defer_ID\" is null and \"Defer\" = true then \'Deprio/Cancel\' when \"Defer_ID\" is not null and \"Defer\" = true then \'Defer\' else null end as \"resType\" , \"Plan_ID\" , \"Project_ID\" , \"Defer_ID\" , \"Project_Definition\" , \"Mandatory\" , \"Project_Score\" , \"Risk_Reduced\" , \"Total_Budget\" , \"Budget_Before_Revised\", \"TCO_Opex\" , \"TCO_TotalProjectCost\" , \"NPV_RiskReduced\" , NULL AS \"Replace\" , \"Defer\" , \"Option1_Safety\" , \"Option1_Compliance\" , \"Option1_Financial\" , \"Option1_Reliability\" , \"Option1_Environment\" , \"Option1_Customer\" , LEAST(\"Start_Month_Scope_1\", \"Start_Month_Scope_2\", \"Start_Month_Scope_3\", \"Start_Month_Scope_4\") as \"start_Month\" FROM public. \"PortfolioOpt_Approved_Proj\" UNION SELECT \'Deprio/Cancel\' AS \"resType\", \"Plan_ID\" , \"Project_ID\" , null as \"Defer_ID\" , \"Project_Definition\" , \"Mandatory\" , \"Project_Score\" , \"Risk_Reduced\" , \"Total_Budget\" , \"Budget_Before_Revised\" , \"TCO_Opex\" , \"TCO_TotalProjectCost\" , \"NPV_RiskReduced\" , \"Replace\" , NULL AS \"Defer\" , \"Option1_Safety\" , \"Option1_Compliance\" , \"Option1_Financial\" , \"Option1_Reliability\" , \"Option1_Environment\" , \"Option1_Customer\" , null as \"start_Month\" FROM public. \"PortfolioOpt_Rejected_Proj\") AS proj INNER JOIN public. \"MP_Project\" AS mp ON proj. \"Project_ID\" = mp. \"Id\" Left JOIN public. \"PortfolioOpt_Deferred_Proj\" AS defer ON proj. \"Defer_ID\" = \"ID\" WHERE proj. \"Plan_ID\" IN ( SELECT \"Plan_ID\" FROM PlanData) AND ( \"resType\" is not null and( \"Replace\" is null or \"Replace\" is false))) AS npvproj INNER JOIN public. \"AIPM_PortfolioScenario\" AS ps ON npvproj. \"Plan_ID\" = ps. \"Id\" WHERE \"EndYear\" - \"StartYear\" >= \"YearIndex\") AS yearly_prj_list left join public. \"MP_BudgetSchedule\" AS d ON yearly_prj_list. \"Project_ID\" = d. \"MP_ProjectId\" where yearly_prj_list. \"proj_start_Month\" is null or ( \"RunningYear\" < extract(Year FROM(yearly_prj_list. \"proj_start_Month\")))) as yearly_prj_list_filtered LEFT JOIN ( SELECT \"CFG_BusinessAreaCode\", \"Year\" , max(\"GrowthRate\") as \"GrowthRate\" FROM ( SELECT distinct b. \"CFG_BusinessAreaCode\", b. \"Year\" , CASE WHEN b. \"GrowthRate\" <= 0 THEN 0 ELSE b. \"GrowthRate\" END AS \"GrowthRate\" FROM ( SELECT \"Id\" FROM ( SELECT \"cycleId\" FROM public. \"AIPM_PortfolioScenario\" WHERE \"Id\" IN ( SELECT \"Plan_ID\" FROM PlanData)) AS cycleid INNER JOIN public. \"LF_Project\" AS LF ON cycleid. \"cycleId\" = LF. \"CFG_CycleId\" WHERE \"WorkflowStatus\" != \'PendingSubmission\' AND \"ForecastType\" = \'Demand\' AND \"Deleted\" = \'false\') AS LFID INNER JOIN public. \"LF_GrowthResult\" AS b ON LFID. \"Id\" = b. \"LF_ProjectId\") AS npvgrowth group by \"CFG_BusinessAreaCode\", \"Year\") AS distinctnpvgrowth on yearly_prj_list_filtered. \"RunningYear\" = distinctnpvgrowth. \"Year\" AND yearly_prj_list_filtered. \"UDCFG_BusinessAreaCode\" = distinctnpvgrowth. \"CFG_BusinessAreaCode\" order by \"Project_ID\" , \"RunningYear\", \"resType\") AS yearly_list_filtered order by \"resType\" , \"Project_ID\", \"RunningYear\") AS finaltable Group By \"resType\", \"RunningYear\" Order By \"resType\", \"RunningYear\") as crossjoin) as transposestep1) as finaltable order by \"RunningYear\", \"porder\") select * from ScenarioData";

            var innerparams = new { id = scenarioId };
            var summary = (await DbHelper.ExecuteDql<PortfolioOSRiskDataAltSummaryResult>(innerSql, innerparams));

            /*
            var summaryReturnResult = new List<PortfolioOSRiskDataAltSummaryResult>();
            summaryReturnResult.Add(summary);*/

            return summary;
        }
//===============================================================
// TEMPLATE END: ScenarioManager.cs.2.1.tpl
//===============================================================

        /* GENCODE:MARKER:2:END */

        public static async Task<IEnumerable<PortfolioOptSummaryResult>> PortfolioAlternateResultsSummary(int scenarioId, AipmPortfolioResultFilter filter)
        {
            //MR&HPA
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

            if (filter.SubObjective != null && filter.SubObjective.Count > 0)
            {
                var subObjective = string.Join("', '", filter.SubObjective);
                where += " AND b.\"UDIBRNarrativeMR\" IN ('" + subObjective + "')";
            }

            if (filter.SubObjectiveHPA != null && filter.SubObjectiveHPA.Count > 0)
            {
                var subOjectiveHPA = string.Join("', '", filter.SubObjectiveHPA);
                where += " AND b.\"UDIBRNarrativeHPA\" IN ('" + subOjectiveHPA + "')";
            }

            if (filter.Voltage != null && filter.Voltage.Count > 0)
            {
                var voltage = string.Join("', '", filter.Voltage);
                where += " AND b.\"UDVoltagekV\" IN ('" + voltage + "')";
            }

            var approvedSql = $"SELECT\r\nCOALESCE(SUM(a.\r\n    \"Budget_Before_Revised\"), 0.00) AS \"BudgetBeforeRevised\",\r\n  COALESCE(SUM(a.\r\n    \"Total_Budget\"), 0.00) AS \"TotalBudget\",\r\n  COALESCE(SUM(a.\r\n    \"Project_Score\"), 0.00) AS \"ProjectScore\",\r\n  COALESCE(SUM(a.\r\n    \"TCO_Opex\"), 0.00) * 1000000 AS \"TCOOpex\",\r\n  COALESCE(SUM(a.\r\n    \"TCO_TotalProjectCost\"), 0.00) * 1000000 AS \"TCOTotalProjectCost\",\r\n  COALESCE(SUM(a.\r\n    \"NPV_RiskReduced\"), 0.00) AS \"NPVRiskReduced\",\r\n  COALESCE(SUM(a.\r\n    \"Risk_Reduced\"), 0.00) * 1000000 AS \"RiskReduced\",\r\n  COALESCE(SUM(a.\r\n    \"BUDY1\"), 0.00) AS \"BUDY1\",\r\n  COALESCE(SUM(a.\r\n    \"BUDY2\"), 0.00) AS \"BUDY2\",\r\n  COALESCE(SUM(a.\r\n    \"BUDY3\"), 0.00) AS \"BUDY3\",\r\n  COALESCE(SUM(a.\r\n    \"BUDY4\"), 0.00) AS \"BUDY4\",\r\n  COALESCE(SUM(a.\r\n    \"BUDY5\"), 0.00) AS \"BUDY5\",\r\n  COALESCE(SUM(a.\r\n    \"BUDY6\"), 0.00) AS \"BUDY6\",\r\n  COALESCE(SUM(a.\r\n    \"BUDY7\"), 0.00) AS \"BUDY7\",\r\n  COALESCE(SUM(a.\r\n    \"BUDY8\"), 0.00) AS \"BUDY8\",\r\n  COALESCE(SUM(a.\r\n    \"Total_Budget\"), 0.00) - (COALESCE(SUM(a.\r\n    \"BUDY1\"), 0.00) + COALESCE(SUM(a.\r\n    \"BUDY2\"), 0.00) + COALESCE(SUM(a.\r\n    \"BUDY3\"), 0.00) + COALESCE(SUM(a.\r\n    \"BUDY4\"), 0.00) + COALESCE(SUM(a.\r\n    \"BUDY5\"), 0.00) + COALESCE(SUM(a.\r\n    \"BUDY6\"), 0.00) + COALESCE(SUM(a.\r\n    \"BUDY7\"), 0.00) + COALESCE(SUM(a.\r\n    \"BUDY8\"), 0.00)) AS \"BeyondHorizon\",\r\n  COUNT( * ) AS \"TotalProject\"\r\nFROM\r\npublic.\r\n\"PortfolioOpt_Approved_Proj\"\r\nAS a\r\nINNER JOIN\r\npublic.\r\n\"MP_Project\"\r\nAS b\r\nON\r\na.\r\n\"Project_ID\" = b.\r\n\"Id\"\r\nWHERE\r\na.\r\n\"Plan_ID\" = (@id)\r\nAND(\r\n  a.\r\n  \"Defer\"\r\n  IS NULL OR a.\r\n  \"Defer\" = false)" + where;

            var approvedParams = new { id = scenarioId };
            var approvedSummary = (await DbHelper.ExecuteDql<PortfolioOptSummaryResult>(approvedSql, approvedParams)).FirstOrDefault();
            approvedSummary.Summary = "Prioritised";

            var alternateSql = $"SELECT\r\nCOALESCE(SUM(a.\r\n    \"Budget_Before_Revised\"), 0.00) AS \"BudgetBeforeRevised\",\r\n  COALESCE(SUM(a.\r\n    \"Total_Budget\"), 0.00) AS \"TotalBudget\",\r\n  COALESCE(SUM(a.\r\n    \"Project_Score\"), 0.00) AS \"ProjectScore\",\r\n  COALESCE(SUM(a.\r\n    \"TCO_Opex\"), 0.00) * 1000000 AS \"TCOOpex\",\r\n  COALESCE(SUM(a.\r\n    \"TCO_TotalProjectCost\"), 0.00) * 1000000 AS \"TCOTotalProjectCost\",\r\n  COALESCE(SUM(a.\r\n    \"NPV_RiskReduced\"), 0.00) AS \"NPVRiskReduced\",\r\n  COALESCE(SUM(a.\r\n    \"Risk_Reduced\"), 0.00) * 1000000 AS \"RiskReduced\",\r\n  COALESCE(SUM(a.\r\n    \"BUDY1\"), 0.00) AS \"BUDY1\",\r\n  COALESCE(SUM(a.\r\n    \"BUDY2\"), 0.00) AS \"BUDY2\",\r\n  COALESCE(SUM(a.\r\n    \"BUDY3\"), 0.00) AS \"BUDY3\",\r\n  COALESCE(SUM(a.\r\n    \"BUDY4\"), 0.00) AS \"BUDY4\",\r\n  COALESCE(SUM(a.\r\n    \"BUDY5\"), 0.00) AS \"BUDY5\",\r\n  COALESCE(SUM(a.\r\n    \"BUDY6\"), 0.00) AS \"BUDY6\",\r\n  COALESCE(SUM(a.\r\n    \"BUDY7\"), 0.00) AS \"BUDY7\",\r\n  COALESCE(SUM(a.\r\n    \"BUDY8\"), 0.00) AS \"BUDY8\",\r\n  COALESCE(SUM(a.\r\n    \"Total_Budget\"), 0.00) - (COALESCE(SUM(a.\r\n    \"BUDY1\"), 0.00) + COALESCE(SUM(a.\r\n    \"BUDY2\"), 0.00) + COALESCE(SUM(a.\r\n    \"BUDY3\"), 0.00) + COALESCE(SUM(a.\r\n    \"BUDY4\"), 0.00) + COALESCE(SUM(a.\r\n    \"BUDY5\"), 0.00) + COALESCE(SUM(a.\r\n    \"BUDY6\"), 0.00) + COALESCE(SUM(a.\r\n    \"BUDY7\"), 0.00) + COALESCE(SUM(a.\r\n    \"BUDY8\"), 0.00)) AS \"BeyondHorizon\",\r\n  COUNT( * ) AS \"TotalProject\"\r\nFROM\r\npublic.\r\n\"PortfolioOpt_Alternate_Proj\"\r\nAS a\r\nINNER JOIN\r\npublic.\r\n\"MP_Project\"\r\nAS b\r\nON\r\na.\r\n\"Project_ID\" = b.\r\n\"Id\"\r\nWHERE\r\na.\r\n\"Plan_ID\" = (@id)" + where;

            var alternateParams = new { id = scenarioId };
            var alternateSummary = (await DbHelper.ExecuteDql<PortfolioOptSummaryResult>(alternateSql, alternateParams)).FirstOrDefault();
            alternateSummary.Summary = "Alternate";
            /*
            approvedSummary.BudgetBeforeRevised += (alternateSummary.TotalBudget != null ? alternateSummary.TotalBudget : 0);
            approvedSummary.TotalBudget += (alternateSummary.TotalBudget != null ? alternateSummary.TotalBudget : 0);
            approvedSummary.RiskReduced += (alternateSummary.RiskReduced != null ? alternateSummary.RiskReduced : 0);
            approvedSummary.ProjectScore += (alternateSummary.ProjectScore != null ? alternateSummary.ProjectScore : 0);
            approvedSummary.TCOOpex += (alternateSummary.TCOOpex != null ? alternateSummary.TCOOpex : 0);
            approvedSummary.TCOTotalProjectCost += (alternateSummary.TCOTotalProjectCost != null ? alternateSummary.TCOTotalProjectCost : 0);
            approvedSummary.NPVRiskReduced += (alternateSummary.NPVRiskReduced != null ? alternateSummary.NPVRiskReduced : 0);
            approvedSummary.TotalProject += alternateSummary.TotalProject;
            */

            var supplySql = $"SELECT COALESCE(SUM(a.\"Total_Budget\"), 0.00) AS \"TotalBudget\", COALESCE(SUM(a.\"Project_Score\"), 0.00) AS \"ProjectScore\", COALESCE(SUM(a.\"TCO_Opex\"), 0.00)*1000000 AS \"TCOOpex\", COALESCE(SUM(a.\"TCO_TotalProjectCost\"), 0.00)*1000000 AS \"TCOTotalProjectCost\", COALESCE(SUM(a.\"NPV_RiskReduced\"), 0.00) AS \"NPVRiskReduced\", COALESCE(SUM(a.\"Risk_Reduced\"), 0.00)*1000000 AS \"RiskReduced\", COUNT(*) AS \"TotalProject\" FROM public.\"PortfolioOpt_Supply_Proj\" AS a INNER JOIN public.\"MP_Project\" AS b ON a.\"Project_ID\" = b.\"Id\" WHERE a.\"Plan_ID\"=(@id)" + where;
            var supplyParams = new { id = scenarioId };
            var supplySummary = (await DbHelper.ExecuteDql<PortfolioOptSummaryResult>(supplySql, supplyParams)).FirstOrDefault();
            supplySummary.Summary = "Supply";

            /*
            approvedSummary.BudgetBeforeRevised += (supplySummary.TotalBudget != null ? supplySummary.TotalBudget : 0);
            approvedSummary.TotalBudget += (supplySummary.TotalBudget != null ? supplySummary.TotalBudget : 0);
            approvedSummary.RiskReduced += (supplySummary.RiskReduced != null ? supplySummary.RiskReduced : 0);
            approvedSummary.ProjectScore += (supplySummary.ProjectScore != null ? supplySummary.ProjectScore : 0);
            approvedSummary.TCOOpex += (supplySummary.TCOOpex != null ? supplySummary.TCOOpex : 0);
            approvedSummary.TCOTotalProjectCost += (supplySummary.TCOTotalProjectCost != null ? supplySummary.TCOTotalProjectCost : 0);
            approvedSummary.NPVRiskReduced += (supplySummary.NPVRiskReduced != null ? supplySummary.NPVRiskReduced : 0);
            approvedSummary.TotalProject += supplySummary.TotalProject;
            */

            // Retrieve deferred project summary
            var deferredSql = $"SELECT\r\nCOALESCE(SUM(a.\r\n    \"Budget_Before_Revised\"), 0.00) AS \"BudgetBeforeRevised\",\r\n  COALESCE(SUM(a.\r\n    \"Total_Budget\"), 0.00) AS \"TotalBudget\",\r\n  COALESCE(SUM(a.\r\n    \"Project_Score\"), 0.00) AS \"ProjectScore\",\r\n  COALESCE(SUM(a.\r\n    \"TCO_Opex\"), 0.00) * 1000000 AS \"TCOOpex\",\r\n  COALESCE(SUM(a.\r\n    \"TCO_TotalProjectCost\"), 0.00) * 1000000 AS \"TCOTotalProjectCost\",\r\n  COALESCE(SUM(a.\r\n    \"NPV_RiskReduced\"), 0.00) AS \"NPVRiskReduced\",\r\n  COALESCE(SUM(a.\r\n    \"Risk_Reduced\"), 0.00) * 1000000 AS \"RiskReduced\",\r\n  COALESCE(SUM(a.\r\n    \"BUDY1\"), 0.00) AS \"BUDY1\",\r\n  COALESCE(SUM(a.\r\n    \"BUDY2\"), 0.00) AS \"BUDY2\",\r\n  COALESCE(SUM(a.\r\n    \"BUDY3\"), 0.00) AS \"BUDY3\",\r\n  COALESCE(SUM(a.\r\n    \"BUDY4\"), 0.00) AS \"BUDY4\",\r\n  COALESCE(SUM(a.\r\n    \"BUDY5\"), 0.00) AS \"BUDY5\",\r\n  COALESCE(SUM(a.\r\n    \"BUDY6\"), 0.00) AS \"BUDY6\",\r\n  COALESCE(SUM(a.\r\n    \"BUDY7\"), 0.00) AS \"BUDY7\",\r\n  COALESCE(SUM(a.\r\n    \"BUDY8\"), 0.00) AS \"BUDY8\",\r\n  COALESCE(SUM(a.\r\n    \"Total_Budget\"), 0.00) - (COALESCE(SUM(a.\r\n    \"BUDY1\"), 0.00) + COALESCE(SUM(a.\r\n    \"BUDY2\"), 0.00) + COALESCE(SUM(a.\r\n    \"BUDY3\"), 0.00) + COALESCE(SUM(a.\r\n    \"BUDY4\"), 0.00) + COALESCE(SUM(a.\r\n    \"BUDY5\"), 0.00) + COALESCE(SUM(a.\r\n    \"BUDY6\"), 0.00) + COALESCE(SUM(a.\r\n    \"BUDY7\"), 0.00) + COALESCE(SUM(a.\r\n    \"BUDY8\"), 0.00)) AS \"BeyondHorizon\",\r\n  COUNT( * ) AS \"TotalProject\"\r\nFROM\r\npublic.\r\n\"PortfolioOpt_Approved_Proj\"\r\nAS a\r\nINNER JOIN\r\npublic.\r\n\"MP_Project\"\r\nAS b\r\nON\r\na.\r\n\"Project_ID\" = b.\r\n\"Id\"\r\nWHERE\r\na.\r\n\"Plan_ID\" = (@id)\r\nAND a.\r\n\"Defer\" = true\r\nand a.\r\n\"Defer_ID\"\r\nis not null" + where;

            var deferredParams = new { id = scenarioId };
            var deferredSummary = (await DbHelper.ExecuteDql<PortfolioOptSummaryResult>(deferredSql, deferredParams)).FirstOrDefault();

            deferredSummary.Summary = "Deferred";

            var cancelledSql = $"SELECT\r\nCOALESCE(SUM(a.\r\n    \"Budget_Before_Revised\"), 0.00) AS \"BudgetBeforeRevised\",\r\n  COALESCE(SUM(a.\r\n    \"Total_Budget\"), 0.00) AS \"TotalBudget\",\r\n  COALESCE(SUM(a.\r\n    \"Project_Score\"), 0.00) AS \"ProjectScore\",\r\n  COALESCE(SUM(a.\r\n    \"TCO_Opex\"), 0.00) * 1000000 AS \"TCOOpex\",\r\n  COALESCE(SUM(a.\r\n    \"TCO_TotalProjectCost\"), 0.00) * 1000000 AS \"TCOTotalProjectCost\",\r\n  COALESCE(SUM(a.\r\n    \"NPV_RiskReduced\"), 0.00) AS \"NPVRiskReduced\",\r\n  COALESCE(SUM(a.\r\n    \"Risk_Reduced\"), 0.00) * 1000000 AS \"RiskReduced\",\r\n  COALESCE(SUM(a.\r\n    \"BUDY1\"), 0.00) AS \"BUDY1\",\r\n  COALESCE(SUM(a.\r\n    \"BUDY2\"), 0.00) AS \"BUDY2\",\r\n  COALESCE(SUM(a.\r\n    \"BUDY3\"), 0.00) AS \"BUDY3\",\r\n  COALESCE(SUM(a.\r\n    \"BUDY4\"), 0.00) AS \"BUDY4\",\r\n  COALESCE(SUM(a.\r\n    \"BUDY5\"), 0.00) AS \"BUDY5\",\r\n  COALESCE(SUM(a.\r\n    \"BUDY6\"), 0.00) AS \"BUDY6\",\r\n  COALESCE(SUM(a.\r\n    \"BUDY7\"), 0.00) AS \"BUDY7\",\r\n  COALESCE(SUM(a.\r\n    \"BUDY8\"), 0.00) AS \"BUDY8\",\r\n  COALESCE(SUM(a.\r\n    \"Total_Budget\"), 0.00) AS \"BeyondHorizon\",\r\n  COUNT( * ) AS \"TotalProject\"\r\nFROM\r\npublic.\r\n\"PortfolioOpt_Approved_Proj\"\r\nAS a\r\nINNER JOIN\r\npublic.\r\n\"MP_Project\"\r\nAS b\r\nON\r\na.\r\n\"Project_ID\" = b.\r\n\"Id\"\r\nWHERE\r\na.\r\n\"Plan_ID\" = (@id)\r\nAND a.\r\n\"Defer\" = true\r\nand a.\r\n\"Defer_ID\"\r\nis null" + where;

            var cancelledParams = new { id = scenarioId };
            var cancelledSummary = (await DbHelper.ExecuteDql<PortfolioOptSummaryResult>(cancelledSql, cancelledParams)).FirstOrDefault();

            cancelledSummary.Summary = "Cancelled";

            var rejectSql = $"SELECT\r\nCOALESCE(SUM(a.\r\n    \"Budget_Before_Revised\"), 0.00) AS \"BudgetBeforeRevised\",\r\n  COALESCE(SUM(a.\r\n    \"Total_Budget\"), 0.00) AS \"TotalBudget\",\r\n  COALESCE(SUM(a.\r\n    \"Project_Score\"), 0.000) AS \"ProjectScore\",\r\n  COALESCE(SUM(a.\r\n    \"TCO_Opex\"), 0.00) * 1000000 AS \"TCOOpex\",\r\n  COALESCE(SUM(a.\r\n    \"TCO_TotalProjectCost\"), 0.00) * 1000000 AS \"TCOTotalProjectCost\",\r\n  COALESCE(SUM(a.\r\n    \"NPV_RiskReduced\"), 0.00) AS \"NPVRiskReduced\",\r\n  COALESCE(SUM(a.\r\n    \"Risk_Reduced\"), 0.000) * 1000000 AS \"RiskReduced\",\r\n  COALESCE(SUM(a.\r\n    \"Total_Budget\"), 0.00) AS \"BeyondHorizon\",\r\n  COUNT( * ) AS \"TotalProject\"\r\nFROM\r\npublic.\r\n\"PortfolioOpt_Rejected_Proj\"\r\nAS a\r\nINNER JOIN\r\npublic.\r\n\"MP_Project\"\r\nAS b\r\nON\r\na.\r\n\"Project_ID\" = b.\r\n\"Id\"\r\nWHERE\r\na.\r\n\"Plan_ID\" = (@id)\r\nAND(\r\n  a.\r\n  \"Replace\"\r\n  IS NULL OR a.\r\n  \"Replace\" = false)" + where;
            var rejectParams = new { id = scenarioId };
            var rejectSummary = (await DbHelper.ExecuteDql<PortfolioOptSummaryResult>(rejectSql, rejectParams)).FirstOrDefault();

            rejectSummary.Summary = "Deprioritised";
            rejectSummary.BUDY1 = 0.00;
            rejectSummary.BUDY2 = 0.00;
            rejectSummary.BUDY3 = 0.00;
            rejectSummary.BUDY4 = 0.00;
            rejectSummary.BUDY5 = 0.00;
            rejectSummary.BUDY6 = 0.00;
            rejectSummary.BUDY7 = 0.00;
            rejectSummary.BUDY8 = 0.00;

            var totalSummary = new PortfolioOptSummaryResult
            {
                Plan_ID = scenarioId,
                Summary = "Total",
                BudgetBeforeRevised = approvedSummary.BudgetBeforeRevised + (rejectSummary.BudgetBeforeRevised != null ? rejectSummary.BudgetBeforeRevised : 0) + (deferredSummary.BudgetBeforeRevised != null ? deferredSummary.BudgetBeforeRevised : 0),
                TotalBudget = approvedSummary.TotalBudget + (rejectSummary.TotalBudget != null ? rejectSummary.TotalBudget : 0) + (deferredSummary.TotalBudget != null ? deferredSummary.TotalBudget : 0),
                RiskReduced = approvedSummary.RiskReduced + (rejectSummary.RiskReduced != null ? rejectSummary.RiskReduced : 0) + (deferredSummary.RiskReduced != null ? deferredSummary.RiskReduced : 0),
                ProjectScore = approvedSummary.ProjectScore + (rejectSummary.ProjectScore != null ? rejectSummary.ProjectScore : 0) + (deferredSummary.ProjectScore != null ? deferredSummary.ProjectScore : 0),
                TCOOpex = approvedSummary.TCOOpex + (rejectSummary.TCOOpex != null ? rejectSummary.TCOOpex : 0) + (deferredSummary.TCOOpex != null ? deferredSummary.TCOOpex : 0),
                TCOTotalProjectCost = approvedSummary.TCOTotalProjectCost + (rejectSummary.TCOTotalProjectCost != null ? rejectSummary.TCOTotalProjectCost : 0) + (deferredSummary.TCOTotalProjectCost != null ? deferredSummary.TCOTotalProjectCost : 0),
                NPVRiskReduced = approvedSummary.NPVRiskReduced + (rejectSummary.NPVRiskReduced != null ? rejectSummary.NPVRiskReduced : 0) + (deferredSummary.NPVRiskReduced != null ? deferredSummary.NPVRiskReduced : 0),
                BUDY1 = approvedSummary.BUDY1 + (deferredSummary.BUDY1 != null ? deferredSummary.BUDY1 : 0),
                BUDY2 = approvedSummary.BUDY2 + (deferredSummary.BUDY2 != null ? deferredSummary.BUDY2 : 0),
                BUDY3 = approvedSummary.BUDY3 + (deferredSummary.BUDY3 != null ? deferredSummary.BUDY3 : 0),
                BUDY4 = approvedSummary.BUDY4 + (deferredSummary.BUDY4 != null ? deferredSummary.BUDY4 : 0),
                BUDY5 = approvedSummary.BUDY5 + (deferredSummary.BUDY5 != null ? deferredSummary.BUDY5 : 0),
                BUDY6 = approvedSummary.BUDY6 + (deferredSummary.BUDY6 != null ? deferredSummary.BUDY6 : 0),
                BUDY7 = approvedSummary.BUDY7 + (deferredSummary.BUDY7 != null ? deferredSummary.BUDY7 : 0),
                BUDY8 = approvedSummary.BUDY8 + (deferredSummary.BUDY8 != null ? deferredSummary.BUDY8 : 0)
            };

            approvedSummary.ProjectScore = (approvedSummary.TCOOpex + approvedSummary.TCOTotalProjectCost) != 0 ? approvedSummary.NPVRiskReduced / (approvedSummary.TCOOpex + approvedSummary.TCOTotalProjectCost) : 0;
            deferredSummary.ProjectScore = (deferredSummary.TCOOpex + deferredSummary.TCOTotalProjectCost) != 0 ? deferredSummary.NPVRiskReduced / (deferredSummary.TCOOpex + deferredSummary.TCOTotalProjectCost) : 0;
            rejectSummary.ProjectScore = (rejectSummary.TCOOpex + rejectSummary.TCOTotalProjectCost) != 0 ? rejectSummary.NPVRiskReduced / (rejectSummary.TCOOpex + rejectSummary.TCOTotalProjectCost) : 0;
            totalSummary.ProjectScore = (totalSummary.TCOOpex + totalSummary.TCOTotalProjectCost) != 0 ? totalSummary.NPVRiskReduced / (totalSummary.TCOOpex + totalSummary.TCOTotalProjectCost) : 0;
            totalSummary.TotalProject = approvedSummary.TotalProject + rejectSummary.TotalProject + deferredSummary.TotalProject;

            var summaryReturnResult = new List<PortfolioOptSummaryResult>();
            summaryReturnResult.Add(approvedSummary);
            summaryReturnResult.Add(deferredSummary);
            summaryReturnResult.Add(cancelledSummary);
            summaryReturnResult.Add(alternateSummary);
            summaryReturnResult.Add(rejectSummary);
            summaryReturnResult.Add(supplySummary);
            //summaryReturnResult.Add(totalSummary);

            return summaryReturnResult;
        }

        //public static async Task<List<PortfolioOptApprovedProj>> PortfolioResultsAlternateProject(int scenarioId, AipmPortfolioResultFilter filter)
        public static async Task<List<Dictionary<string, object>>> PortfolioResultsAlternateProject(int scenarioId, AipmPortfolioResultFilter filter)
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
                where += " AND b.\"UDIBRNarrativeMR\" IN ('" + subObjective + "')";
            }

            if (filter.SubObjectiveHPA != null && filter.SubObjectiveHPA.Count > 0)
            {
                var subOjectiveHPA = string.Join("', '", filter.SubObjectiveHPA);
                where += " AND b.\"UDIBRNarrativeHPA\" IN ('" + subOjectiveHPA + "')";
            }

            if (filter.Voltage != null && filter.Voltage.Count > 0)
            {
                var voltage = string.Join("', '", filter.Voltage);
                where += " AND b.\"UDVoltagekV\" IN ('" + voltage + "')";
            }

            if (!string.IsNullOrEmpty(filter.SortByColumn))
            {
                sortBy = " ORDER BY ";
                if (filter.SortByColumn == "budget_Before_Revised")
                {
                    sortBy += " a.\"Budget_Before_Revised\" " + filter.SortDirection;
                }
                else if (filter.SortByColumn == "total_Budget")
                {
                    sortBy += " a.\"Total_Budget\" " + filter.SortDirection;
                }
                else if (filter.SortByColumn == "risk_Reduced")
                {
                    sortBy += " a.\"Risk_Reduced\" " + filter.SortDirection;
                }
                else if (filter.SortByColumn == "tcO_Opex")
                {
                    sortBy += " a.\"TCO_Opex\" " + filter.SortDirection;
                }
                else if (filter.SortByColumn == "tcO_TotalProjectCost")
                {
                    sortBy += " a.\"TCO_TotalProjectCost\" " + filter.SortDirection;
                }
                else if (filter.SortByColumn == "npV_RiskReduced")
                {
                    sortBy += " a.\"NPV_RiskReduced\" " + filter.SortDirection;
                }
                else if (filter.SortByColumn == "project_Score")
                {
                    sortBy += " a.\"Project_Score\" " + filter.SortDirection;
                }
            }

            var commandText = $"SELECT a.*, a.\"Risk_Reduced\"*1000000 AS \"Risk_Reduced\", a.\"TCO_Opex\"*1000000 AS \"TCO_Opex\", a.\"TCO_TotalProjectCost\"*1000000 AS \"TCO_TotalProjectCost\", a.\"Reproposal_IDs\", b.\"ProjectDefinition\", b.\"UDProjectDescription\", b.\"UDStrategicObjective\", b.\"UDIBRNarrativeMR\", b.\"UDIBRNarrativeHPA\", b.\"UDCategory\", b.\"UDProjectType\", b.\"UDVoltagekV\", c.\"Name\" AS \"StateName\", d.\"AreaName\" AS \"BusinessAreaName\" FROM public.\"PortfolioOpt_Alternate_Proj\" AS a INNER JOIN public.\"MP_Project\" AS b ON a.\"Project_ID\" = b.\"Id\" INNER JOIN public.\"CFG_GeoState\" AS c ON b.\"UDCFG_GeoStateCode\" = c.\"Code\" INNER JOIN public.\"CFG_BusinessArea\" AS d ON b.\"UDCFG_BusinessAreaCode\" = d.\"AreaCode\" WHERE a.\"Plan_ID\"=(@id)" + where + sortBy;

            var parameters = new { id = scenarioId };
            var result = await DbHelper.ExecuteDql(commandText, parameters);
            return result.ToList();
            //return (await DbHelper.ExecuteDql<PortfolioOptApprovedProj>(commandText, parameters)).ToList();
        }

        public static async Task<bool> PortfolioResultsAlternateProjectInsert(int scenarioId, int projectId, IConfiguration configuration, DateTime startDate, string reproposallist)
        {
            //var commandText = $"SELECT \"ProjectDefinition\" AS \"Project_Definition\" FROM public.\"MP_Project\" WHERE \"Id\"=(@projectId)";
            //var parameters = new { projectId = projectId };
            //var projectDetails =  (await DbHelper.ExecuteDql<PortfolioOptAlternateProjects>(commandText, parameters)).FirstOrDefault();

            var sbQuery = new StringBuilder("INSERT INTO  public.\"PortfolioOpt_Alternate_Proj\" (\"Plan_ID\",\"Project_ID\",\"Project_Definition\", \"Project_Score\", \"Risk_Reduced\", \"Total_Budget\", \"TCO_Opex\", \"TCO_TotalProjectCost\", \"NPV_RiskReduced\", \"Target_Comm_Month\", \"Reproposal_IDs\") ");
            sbQuery.Append($"SELECT {scenarioId},{projectId}, a.\"ProjectDefinition\", COALESCE(a.\"ProjectScore\", 0.000), COALESCE(a.\"TotalRiskAnnual_RiskReduced\", 0.000), (" +
                $"CASE WHEN b.\"UDScope1Budget\" IS NOT NULL THEN b.\"UDScope1Budget\" ELSE COALESCE(b.\"Scope1Budget\",0) END + " +
                $"CASE WHEN b.\"UDScope2Budget\" IS NOT NULL THEN b.\"UDScope2Budget\" ELSE COALESCE(b.\"Scope2Budget\",0) END +" +
                $"CASE WHEN b.\"UDScope3Budget\" IS NOT NULL THEN b.\"UDScope3Budget\" ELSE COALESCE(b.\"Scope3Budget\",0) END +" +
                $"CASE WHEN b.\"UDScope4Budget\" IS NOT NULL THEN b.\"UDScope4Budget\" ELSE COALESCE(b.\"Scope4Budget\",0) END" +
                $") AS \"TotalBudget\", a.\"CapexInvest_Opex\", a.\"CapexInvest_TotalProjectCost\", a.\"NPVTotalRiskReducedInThousand_EI\"::double precision, CAST(a.\"UDTargetCommissionDate\" AS DATE), {(string.IsNullOrEmpty(reproposallist) ? "NULL" : $"'{reproposallist}'")}");
            var commandText1 = sbQuery + " FROM public.\"MP_Project\" AS a LEFT JOIN public.\"MP_BudgetSchedule\" AS b ON a.\"Id\" = b.\"MP_ProjectId\" WHERE a.\"Id\" = " + projectId + ";";
            commandText1 += "UPDATE public.\"PortfolioOpt_Rejected_Proj\" SET \"Replace\" = true WHERE \"Plan_ID\" = " + scenarioId + " AND \"Project_ID\" = " + projectId + ";";
            var response = await DbHelper.ExecuteDml(commandText1);
            if (response)
            {
                response = await BackEndHelper(scenarioId, projectId, startDate, configuration, "AlternateSASStorProc");
            }
            return response;
        }

        public static async Task<bool> PortfolioResultsAlternateProjectDelete(int scenarioId, int projectId)
        {
            var commandText1 = "DELETE FROM public.\"PortfolioOpt_Alternate_Proj\" WHERE \"Project_ID\" = " + projectId + " AND \"Plan_ID\" = " + scenarioId + ";";
            commandText1 += "UPDATE public.\"PortfolioOpt_Rejected_Proj\" SET \"Replace\" = false WHERE \"Plan_ID\" = " + scenarioId + " AND \"Project_ID\" = " + projectId + ";";
            return await DbHelper.ExecuteDml(commandText1);
        }
        //public static async Task<List<PortfolioOptApprovedProj>> ResultSystemProjectFromDefer(int scenarioId, AipmPortfolioResultFilter filter, bool alternate = false)
        public static async Task<List<Dictionary<string, object>>> ResultSystemProjectFromDefer(int scenarioId, AipmPortfolioResultFilter filter, bool alternate = false)
        {
            //MR&HPA

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
                where += " AND b.\"UDIBRNarrativeMR\" IN ('" + subObjective + "')";
            }

            if (filter.SubObjectiveHPA != null && filter.SubObjectiveHPA.Count > 0)
            {
                var subOjectiveHPA = string.Join("', '", filter.SubObjectiveHPA);
                where += " AND b.\"UDIBRNarrativeHPA\" IN ('" + subOjectiveHPA + "')";
            }

            if (filter.Voltage != null && filter.Voltage.Count > 0)
            {
                var voltage = string.Join("', '", filter.Voltage);
                where += " AND b.\"UDVoltagekV\" IN ('" + voltage + "')";
            }

            //if (alternate)
            //{
            //    where += " AND a.\"Defer\" = false ";
            //}

            if (!string.IsNullOrEmpty(filter.SortByColumn))
            {
                sortBy = " ORDER BY ";
                if (filter.SortByColumn == "budget_Before_Revised")
                {
                    sortBy += " a.\"Budget_Before_Revised\" " + filter.SortDirection;
                }
                else if (filter.SortByColumn == "total_Budget")
                {
                    sortBy += " a.\"Total_Budget\" " + filter.SortDirection;
                }
                else if (filter.SortByColumn == "risk_Reduced")
                {
                    sortBy += " a.\"Risk_Reduced\" " + filter.SortDirection;
                }
                else if (filter.SortByColumn == "tcO_Opex")
                {
                    sortBy += " a.\"TCO_Opex\" " + filter.SortDirection;
                }
                else if (filter.SortByColumn == "tcO_TotalProjectCost")
                {
                    sortBy += " a.\"TCO_TotalProjectCost\" " + filter.SortDirection;
                }
                else if (filter.SortByColumn == "npV_RiskReduced")
                {
                    sortBy += " a.\"NPV_RiskReduced\" " + filter.SortDirection;
                }
                else if (filter.SortByColumn == "project_Score")
                {
                    sortBy += " a.\"Project_Score\" " + filter.SortDirection;
                }
            }

            var commandText = $"SELECT "
                + "a.\"Plan_ID\",a.\"Project_ID\",a.\"Project_Definition\",a.\"Start_Month_Scope_1\",a.\"Month_Scope_1\",a.\"Start_Month_Scope_2\",a.\"Month_Scope_2\",a.\"Start_Month_Scope_3\",a.\"Month_Scope_3\",a.\"Start_Month_Scope_4\",a.\"Month_Scope_4\",a.\"Comm_Month\",a.\"Target_Comm_Month\",a.\"Mandatory\",a.\"Budget_Before_Revised\",a.\"Total_Budget\",a.\"BUDY1\",a.\"BUDY2\",a.\"BUDY3\",a.\"BUDY4\",a.\"BUDY5\",a.\"BUDY6\",a.\"BUDY7\",a.\"BUDY8\",a.\"Project_Score\",a.\"Risk_Reduced\",a.\"TCO_Opex\",a.\"TCO_TotalProjectCost\",a.\"NPV_RiskReduced\",a.\"Defer\",a.\"Option1_Safety\",a.\"Option1_Compliance\",a.\"Option1_Financial\",a.\"Option1_Reliability\",a.\"Option1_Environment\",a.\"Option1_Customer\","
                + " a.\"Risk_Reduced\"*1000000 AS \"Risk_Reduced\", a.\"TCO_Opex\"*1000000 AS \"TCO_Opex\", a.\"TCO_TotalProjectCost\"*1000000 AS \"TCO_TotalProjectCost\", b.\"ProjectDefinition\", b.\"UDProjectDescription\", b.\"UDStrategicObjective\", b.\"UDIBRNarrativeMR\", b.\"UDIBRNarrativeHPA\", b.\"UDCategory\", b.\"UDProjectType\", b.\"UDVoltagekV\", c.\"Name\" AS \"StateName\", d.\"AreaName\" AS \"BusinessAreaName\""
                + " FROM public.\"PortfolioOpt_Approved_Proj\" AS a INNER JOIN public.\"MP_Project\" AS b ON a.\"Project_ID\" = b.\"Id\" INNER JOIN public.\"CFG_GeoState\" AS c ON b.\"UDCFG_GeoStateCode\" = c.\"Code\" INNER JOIN public.\"CFG_BusinessArea\" AS d ON b.\"UDCFG_BusinessAreaCode\" = d.\"AreaCode\" WHERE a.\"Plan_ID\"=(@id) and (a.\"Defer\"=false or a.\"Defer\" is null)"
                + " union SELECT "
                + "a.\"Plan_ID\",a.\"Project_ID\",a.\"Project_Definition\",a.\"Start_Month_Scope_1\",a.\"Month_Scope_1\",a.\"Start_Month_Scope_2\",a.\"Month_Scope_2\",a.\"Start_Month_Scope_3\",a.\"Month_Scope_3\",a.\"Start_Month_Scope_4\",a.\"Month_Scope_4\",a.\"Comm_Month\",a.\"Target_Comm_Month\",a.\"Mandatory\",a.\"Budget_Before_Revised\",a.\"Total_Budget\",a.\"BUDY1\",a.\"BUDY2\",a.\"BUDY3\",a.\"BUDY4\",a.\"BUDY5\",a.\"BUDY6\",a.\"BUDY7\",a.\"BUDY8\",a.\"Project_Score\",a.\"Risk_Reduced\",a.\"TCO_Opex\",a.\"TCO_TotalProjectCost\",a.\"NPV_RiskReduced\",a.\"Defer\",a.\"Option1_Safety\",a.\"Option1_Compliance\",a.\"Option1_Financial\",a.\"Option1_Reliability\",a.\"Option1_Environment\",a.\"Option1_Customer\","
                + " a.\"Risk_Reduced\"*1000000 AS \"Risk_Reduced\", a.\"TCO_Opex\"*1000000 AS \"TCO_Opex\", a.\"TCO_TotalProjectCost\"*1000000 AS \"TCO_TotalProjectCost\", b.\"ProjectDefinition\", b.\"UDProjectDescription\", b.\"UDStrategicObjective\", b.\"UDIBRNarrativeMR\" , b.\"UDIBRNarrativeHPA\", b.\"UDCategory\", b.\"UDProjectType\", b.\"UDVoltagekV\", c.\"Name\" AS \"StateName\", d.\"AreaName\" AS \"BusinessAreaName\""
                + " FROM ( SELECT aa.* from public.\"PortfolioOpt_Deferred_Proj\" AS aa where aa.\"ID\" in ("
                    + " select \"Defer_ID\" from public.\"PortfolioOpt_Approved_Proj\")) As a"
                + " INNER JOIN public.\"MP_Project\" AS b ON a.\"Project_ID\" = b.\"Id\" INNER JOIN public.\"CFG_GeoState\" AS c ON b.\"UDCFG_GeoStateCode\" = c.\"Code\" INNER JOIN public.\"CFG_BusinessArea\" AS d ON b.\"UDCFG_BusinessAreaCode\" = d.\"AreaCode\" WHERE a.\"Plan_ID\"=(@id2)"
                + where + sortBy;

            var parameters = new { 
                id = scenarioId,
                id2 = scenarioId
            };
            //var t = await DbHelper.ExecuteDql<PortfolioOptApprovedProj>(commandText, parameters);
            //return (await DbHelper.ExecuteDql<PortfolioOptApprovedProj>(commandText, parameters)).ToList();
            //return t.ToList();
            var result = await DbHelper.ExecuteDql(commandText, parameters);
            return result.ToList();
        }

        /*
        public static async Task<List<PortfolioOptApprovedProj>> ResultSystemProject(int scenarioId, AipmPortfolioResultFilter filter, bool alternate = false)
        */ 
        public static async Task<List<Dictionary<string, object>>> ResultSystemProject(int scenarioId, AipmPortfolioResultFilter filter, bool alternate = false)
        {
            //MR&HPA

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
                where += " AND b.\"UDIBRNarrativeMR\" IN ('" + subObjective + "')";
            }

            if (filter.SubObjectiveHPA != null && filter.SubObjectiveHPA.Count > 0)
            {
                var subOjectiveHPA = string.Join("', '", filter.SubObjectiveHPA);
                where += " AND b.\"UDIBRNarrativeHPA\" IN ('" + subOjectiveHPA + "')";
            }

            if (filter.Voltage != null && filter.Voltage.Count > 0)
            {
                var voltage = string.Join("', '", filter.Voltage);
                where += " AND b.\"UDVoltagekV\" IN ('" + voltage + "')";
            }

            //if (alternate)
            //{
            //    where += " AND a.\"Defer\" = false ";
            //}

            if (!string.IsNullOrEmpty(filter.SortByColumn))
            {
                sortBy = " ORDER BY ";
                if (filter.SortByColumn == "budget_Before_Revised")
                {
                    sortBy += " a.\"Budget_Before_Revised\" " + filter.SortDirection;
                }
                else if (filter.SortByColumn == "total_Budget")
                {
                    sortBy += " a.\"Total_Budget\" " + filter.SortDirection;
                }
                else if (filter.SortByColumn == "risk_Reduced")
                {
                    sortBy += " a.\"Risk_Reduced\" " + filter.SortDirection;
                }
                else if (filter.SortByColumn == "tcO_Opex")
                {
                    sortBy += " a.\"TCO_Opex\" " + filter.SortDirection;
                }
                else if (filter.SortByColumn == "tcO_TotalProjectCost")
                {
                    sortBy += " a.\"TCO_TotalProjectCost\" " + filter.SortDirection;
                }
                else if (filter.SortByColumn == "npV_RiskReduced")
                {
                    sortBy += " a.\"NPV_RiskReduced\" " + filter.SortDirection;
                }
                else if (filter.SortByColumn == "project_Score")
                {
                    sortBy += " a.\"Project_Score\" " + filter.SortDirection;
                }
            }

            var commandText = $"SELECT a.*, 'Degbugging' as \"DEBUGTABLE\", a.\"Risk_Reduced\"*1000000 AS \"Risk_Reduced\", a.\"TCO_Opex\"*1000000 AS \"TCO_Opex\", a.\"TCO_TotalProjectCost\"*1000000 AS \"TCO_TotalProjectCost\", a.\"Defer_Action\" AS \"defer_Action\", a.\"Justification\" AS \"justification\", b.\"ProjectDefinition\", b.\"UDProjectDescription\", b.\"UDStrategicObjective\", b.\"UDIBRNarrativeMR\", b.\"UDIBRNarrativeHPA\", b.\"UDCategory\", b.\"UDProjectType\", b.\"UDVoltagekV\", c.\"Name\" AS \"StateName\", d.\"AreaName\" AS \"BusinessAreaName\" FROM public.\"PortfolioOpt_Approved_Proj\" AS a INNER JOIN public.\"MP_Project\" AS b ON a.\"Project_ID\" = b.\"Id\" INNER JOIN public.\"CFG_GeoState\" AS c ON b.\"UDCFG_GeoStateCode\" = c.\"Code\" INNER JOIN public.\"CFG_BusinessArea\" AS d ON b.\"UDCFG_BusinessAreaCode\" = d.\"AreaCode\" WHERE a.\"Plan_ID\"=(@id) { where + sortBy}";

            var parameters = new { id = scenarioId };
            /*
            return (await DbHelper.ExecuteDql<PortfolioOptApprovedProj>(commandText, parameters)).ToList();
            */
            
            var result = await DbHelper.ExecuteDql(commandText, parameters);

            return result.ToList();
        }

        /* GENCODE:MARKER:3:START */

//===============================================================
// TEMPLATE START: AipmPortfolioScenarioManager.cs.3.2.tpl
//===============================================================
        public static async Task<List<Dictionary<string, object>>> GetSupplyProjectGrid(int scenarioId, AipmPortfolioResultFilter filter, bool alternate = false)
        {
            //MR&HPA
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
                where += " AND b.\"UDIBRNarrativeMR\" IN ('" + subObjective + "')";
            }
            
            if (filter.SubObjectiveHPA != null && filter.SubObjectiveHPA.Count > 0)
            {
                var subOjectiveHPA = string.Join("', '", filter.SubObjectiveHPA);
                where += " AND b.\"UDIBRNarrativeHPA\" IN ('" + subOjectiveHPA + "')";
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
        
            var commandText = $"SELECT a.\"Plan_ID\", a.\"Project_ID\", a.\"Project_Definition\", COALESCE(a.\"Total_Budget\", 0.000) AS \"Total_Budget\", COALESCE(a.\"Project_Score\", 0.00) AS \"Project_Score\", COALESCE(a.\"Risk_Reduced\"*1000000, 0.00) AS \"Risk_Reduced\", COALESCE(a.\"TCO_Opex\"*1000000, 0.00) AS \"TCO_Opex\", COALESCE(a.\"TCO_TotalProjectCost\"*1000000, 0.00) AS \"TCO_TotalProjectCost\", COALESCE(a.\"NPV_RiskReduced\", 0.00) AS \"NPV_RiskReduced\", b.\"ProjectDefinition\", b.\"UDProjectDescription\", b.\"UDStrategicObjective\", b.\"UDIBRNarrativeMR\", b.\"UDIBRNarrativeHPA\", b.\"UDCategory\", b.\"UDProjectType\", b.\"UDVoltagekV\", c.\"Name\" AS \"StateName\", d.\"AreaName\" AS \"BusinessAreaName\"   FROM public.\"PortfolioOpt_Supply_Proj\" AS a INNER JOIN public.\"MP_Project\" AS b ON a.\"Project_ID\" = b.\"Id\" INNER JOIN public.\"CFG_GeoState\" AS c ON b.\"UDCFG_GeoStateCode\" = c.\"Code\" INNER JOIN public.\"CFG_BusinessArea\" AS d ON b.\"UDCFG_BusinessAreaCode\" = d.\"AreaCode\"   WHERE a.\"Plan_ID\"=(@id){where + sortBy}";

            var parameters = new { id = scenarioId };
            var result = await DbHelper.ExecuteDql(commandText, parameters);
        
            return result.ToList();
        }
//===============================================================
// TEMPLATE END: AipmPortfolioScenarioManager.cs.3.2.tpl
//===============================================================

        /* GENCODE:MARKER:3:END */

        public static async Task<bool> PortfolioResultsSupplyInsert(int scenarioId, int projectId)
        {
            //var commandText = $"SELECT \"ProjectDefinition\" AS \"Project_Definition\" FROM public.\"MP_Project\" WHERE \"Id\"=(@projectId)";
            //var parameters = new { projectId = projectId };
            //var projectDetails =  (await DbHelper.ExecuteDql<PortfolioOptAlternateProjects>(commandText, parameters)).FirstOrDefault();

            var sbQuery = new StringBuilder("INSERT INTO  public.\"PortfolioOpt_Supply_Proj\" (\"Plan_ID\",\"Project_ID\",\"Project_Definition\", \"Project_Score\", \"Risk_Reduced\", \"Total_Budget\", \"TCO_Opex\", \"TCO_TotalProjectCost\", \"NPV_RiskReduced\") ");
            sbQuery.Append("SELECT " + scenarioId + "," + projectId + ", a.\"ProjectDefinition\", COALESCE(a.\"ProjectScore\", 0.000), COALESCE(a.\"TotalRiskAnnual_RiskReduced\", 0.000), (COALESCE(b.\"Scope1Budget\",0) + COALESCE(b.\"Scope2Budget\",0) + COALESCE(b.\"Scope3Budget\",0) + COALESCE(b.\"Scope4Budget\",0)) AS \"TotalBudget\", a.\"CapexInvest_Opex\", a.\"CapexInvest_TotalProjectCost\", CAST(a.\"NPVTotalRiskReducedInThousand_EI\" AS DOUBLE PRECISION)");
            var commandText1 = sbQuery + " FROM public.\"MP_Project\" AS a LEFT JOIN public.\"MP_BudgetSchedule\" AS b ON a.\"Id\" = b.\"MP_ProjectId\" WHERE a.\"Id\" = " + projectId + ";";
            return await DbHelper.ExecuteDml(commandText1);
        }

        public static async Task<bool> PortfolioResultsSupplyDelete(int scenarioId, int projectId)
        {
            var commandText1 = "DELETE FROM public.\"PortfolioOpt_Supply_Proj\" WHERE \"Project_ID\" = " + projectId + " AND \"Plan_ID\" = " + scenarioId + ";";
            return await DbHelper.ExecuteDml(commandText1);
        }

        //public static async Task<List<PortfolioOptSupplyProj>> ResultSupplyProject(int scenarioId)
        //{
        //    var commandText = $"SELECT a.*, b.\"ProjectDefinition\", b.\"UDProjectDescription\", b.\"UDStrategicObjective\", b.\"UDCategory\", b.\"UDProjectType\", b.\"UDVoltagekV\", c.\"Name\" AS \"StateName\", d.\"AreaName\" AS \"BusinessAreaName\" FROM public.\"PortfolioOpt_Alternate_Proj\" AS a INNER JOIN public.\"MP_Project\" AS b ON a.\"Project_ID\" = b.\"Id\" INNER JOIN public.\"CFG_GeoState\" AS c ON b.\"UDCFG_GeoStateCode\" = c.\"Code\" INNER JOIN public.\"CFG_BusinessArea\" AS d ON b.\"UDCFG_BusinessAreaCode\" = d.\"AreaCode\" WHERE \"Plan_ID\"=(@id)";
        //    var parameters = new { id = scenarioId };
        //    return (await DbHelper.ExecuteDql<PortfolioOptSupplyProj>(commandText, parameters)).ToList();
        //}

        public static async Task<List<Dictionary<string,object>>> ResultRejectedProject(int scenarioId, AipmPortfolioResultFilter filter, bool alternate = false)
        {
            //MR&HPA

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
                where += " AND b.\"UDIBRNarrativeMR\" IN ('" + subObjective + "')";
            }

            if (filter.SubObjectiveHPA != null && filter.SubObjectiveHPA.Count > 0)
            {
                var subOjectiveHPA = string.Join("', '", filter.SubObjectiveHPA);
                where += " AND b.\"UDIBRNarrativeHPA\" IN ('" + subOjectiveHPA + "')";
            }

            if (filter.Voltage != null && filter.Voltage.Count > 0)
            {
                var voltage = string.Join("', '", filter.Voltage);
                where += " AND b.\"UDVoltagekV\" IN ('" + voltage + "')";
            }

            if (alternate)
            {
                where += " AND (a.\"Replace\" IS NULL OR a.\"Replace\" = false) ";
            }

            if (!string.IsNullOrEmpty(filter.SortByColumn))
            {
                sortBy = " ORDER BY ";
                if (filter.SortByColumn == "budgetBeforeRevised")
                {
                    sortBy += " a.\"Budget_Before_Revised\" " + filter.SortDirection;
                }
                else if (filter.SortByColumn == "totalBudget")
                {
                    sortBy += " a.\"Total_Budget\" " + filter.SortDirection;
                }
                else if (filter.SortByColumn == "riskReduced")
                {
                    sortBy += " a.\"Risk_Reduced\" " + filter.SortDirection;
                }
                else if (filter.SortByColumn == "tcoOpex")
                {
                    sortBy += " a.\"TCO_Opex\" " + filter.SortDirection;
                }
                else if (filter.SortByColumn == "tcoTotalProjectCost")
                {
                    sortBy += " a.\"TCO_TotalProjectCost\" " + filter.SortDirection;
                }
                else if (filter.SortByColumn == "npvRiskReduced")
                {
                    sortBy += " a.\"NPV_RiskReduced\" " + filter.SortDirection;
                }
                else if (filter.SortByColumn == "projectScore")
                {
                    sortBy += " a.\"Project_Score\" " + filter.SortDirection;
                }
            }

            /*
            HOZA { get; set; }
            StateName { get; set; }
            BusinessAreaName { get; set; }
            UDStrategicObjective { get; set; }
            SubObjectiveDdl { get; set; }
            UDVoltagekV { get; set; }
            UDCategory { get; set; }
            UDProjectType { get; set; }
            Total_Project { get; set; }
            Budget_Before_Revised { get; set; }
            Total_Budget { get; set; }
            Risk_Reduced { get; set; }
            TCO_Opex { get; set; }
            TCO_TotalProjectCost { get; set; }
            NPV_RiskReduced { get; set; }
            Project_Score { get; set; }
             
             */

            var commandText = "SELECT a.\"Budget_Before_Revised\" AS \"budgetBeforeRevised\"" +
                ", a.\"Total_Budget\" AS \"totalBudget\"" +
                ", a.\"Risk_Reduced\"*1000000 AS \"riskReduced\"" +
                ", a.\"TCO_Opex\"*1000000 AS \"tcoOpex\"" +
                ", a.\"TCO_TotalProjectCost\"*1000000 AS \"tcoTotalProjectCost\"" +
                ", a.\"NPV_RiskReduced\" AS \"npvRiskReduced\"" +
                ", a.\"Project_Score\" AS \"projectScore\"" +
                ", b.\"ProjectDefinition\" AS \"projectDefinition\"" +
                ", b.\"UDProjectDescription\" AS \"udProjectDescription\"" +
                ", b.\"UDStrategicObjective\" AS \"udStrategicObjective\"" +
                ", b.\"UDIBRNarrativeMR\" AS \"udIBRNarrativeMR\"" +
                ", b.\"UDIBRNarrativeHPA\" AS \"udIBRNarrativeHPA\"" +
                ", b.\"UDCategory\" AS \"udCategory\"" +
                ", b.\"UDProjectType\" AS \"udProjectType\"" +
                ", b.\"UDVoltagekV\" AS \"udVoltagekV\"" +
                ", c.\"Name\" AS \"udcfG_GeoStateCode\"" +
                ", d.\"AreaName\" AS \"udcfG_BusinessAreaName\"" +
                " FROM public.\"PortfolioOpt_Rejected_Proj\" AS a INNER JOIN public.\"MP_Project\" AS b ON a.\"Project_ID\" = b.\"Id\" INNER JOIN public.\"CFG_GeoState\" AS c ON b.\"UDCFG_GeoStateCode\" = c.\"Code\" INNER JOIN public.\"CFG_BusinessArea\" AS d ON b.\"UDCFG_BusinessAreaCode\" = d.\"AreaCode\" WHERE a.\"Plan_ID\"=(@id)" + where + sortBy;

            var parameters = new { id = scenarioId };
            return (await DbHelper.ExecuteDql(commandText, parameters)).ToList();
        }


        public static async Task<AipmPortfolioResultChartModel> GetChart(int scenarioId, AipmPortfolioResultFilter filter)
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

            if (filter.SubObjective != null && filter.SubObjective.Count > 0)
            {
                var subObjective = string.Join("', '", filter.SubObjective);
                where += " AND b.\"UDIBRNarrativeMR\" IN ('" + subObjective + "')";
            }

            if (filter.SubObjectiveHPA != null && filter.SubObjectiveHPA.Count > 0)
            {
                var subOjectiveHPA = string.Join("', '", filter.SubObjectiveHPA);
                where += " AND b.\"UDIBRNarrativeHPA\" IN ('" + subOjectiveHPA + "')";
            }

            if (filter.Voltage != null && filter.Voltage.Count > 0)
            {
                var voltage = string.Join("', '", filter.Voltage);
                where += " AND b.\"UDVoltagekV\" IN ('" + voltage + "')";
            }

            var parameters = new { id = scenarioId };

            //var rejectedSql = $"SELECT a.\"Plan_ID\", a.\"Project_ID\", a.\"Project_Score\" AS \"TotalProjectScore\", a.\"Total_Budget\" AS \"TotalBudget\", a.\"Total_Budget\" AS \"x\", (a.\"Risk_Reduced\"*1000000) AS \"TotalRiskReduced\", (a.\"Risk_Reduced\"*1000000) AS \"y\", (CASE WHEN (a.\"Project_Score\"*3) < 5 THEN 5 ELSE (CASE WHEN (a.\"Project_Score\"*3) > 15 THEN 15 ELSE (a.\"Project_Score\"*3) END) END) as \"r\", b.\"ProjectDefinition\" FROM public.\"PortfolioOpt_Rejected_Proj\" AS a INNER JOIN public.\"MP_Project\" AS b ON a.\"Project_ID\" = b.\"Id\" WHERE a.\"Plan_ID\"=(@id)" + where;

            //var approvedSql = $"SELECT a.\"Plan_ID\", a.\"Project_ID\", a.\"Project_Score\" AS \"TotalProjectScore\", a.\"Total_Budget\" AS \"TotalBudget\", a.\"Total_Budget\" AS \"x\", (a.\"Risk_Reduced\"*1000000) AS \"TotalRiskReduced\", (a.\"Risk_Reduced\"*1000000) AS \"y\", (CASE WHEN (a.\"Project_Score\"*3) < 5 THEN 5 ELSE (CASE WHEN (a.\"Project_Score\"*3) > 15 THEN 15 ELSE (a.\"Project_Score\"*3) END) END) as \"r\", b.\"ProjectDefinition\" FROM public.\"PortfolioOpt_Approved_Proj\" AS a INNER JOIN public.\"MP_Project\" AS b ON a.\"Project_ID\" = b.\"Id\" WHERE a.\"Plan_ID\"=(@id)" + where;

            var rejectedSql = $"SELECT a.\"Plan_ID\", a.\"Project_ID\", a.\"Project_Score\" AS \"TotalProjectScore\", a.\"Total_Budget\" AS \"TotalBudget\", a.\"TCO_Opex\"*1000000 AS \"TCOOpex\", a.\"TCO_TotalProjectCost\"*1000000 AS \"TCOTotalProjectCost\", (a.\"TCO_Opex\" + a.\"TCO_TotalProjectCost\")*1000000 AS \"TotalTCO\", (a.\"TCO_Opex\" + a.\"TCO_TotalProjectCost\")*1000000 AS \"x\", (a.\"Risk_Reduced\") AS \"TotalRiskReduced\", (a.\"NPV_RiskReduced\") AS \"NPVRiskReduced\", (a.\"NPV_RiskReduced\") AS \"y\", 5 as \"r\", b.\"ProjectDefinition\", b.\"UDStrategicObjective\" AS \"StrategicObjective\", d.\"Id\" AS \"StrategicObjectiveId\", c.mandatory AS \"Mandatory\" FROM public.\"PortfolioOpt_Rejected_Proj\" AS a INNER JOIN public.\"MP_Project\" AS b ON a.\"Project_ID\" = b.\"Id\" INNER JOIN public.\"AIPM_PortfolioProjects\" AS c ON a.\"Project_ID\" = c.projectid AND a.\"Plan_ID\" = c.scenarioid LEFT JOIN public.\"MP_DropDown\" AS d ON b.\"UDStrategicObjective\" = d.\"Name\" AND d.\"ParentId\" = 1 WHERE a.\"Plan_ID\"=(@id)" + where;

            var approvedSql = $"SELECT a.\"Plan_ID\", a.\"Project_ID\", a.\"Project_Score\" AS \"TotalProjectScore\", a.\"Total_Budget\" AS \"TotalBudget\", a.\"TCO_Opex\"*1000000 AS \"TCOOpex\", a.\"TCO_TotalProjectCost\"*1000000 AS \"TCOTotalProjectCost\", (a.\"TCO_Opex\" + a.\"TCO_TotalProjectCost\")*1000000 AS \"TotalTCO\", (a.\"TCO_Opex\" + a.\"TCO_TotalProjectCost\")*1000000 AS \"x\", (a.\"Risk_Reduced\") AS \"TotalRiskReduced\", (a.\"NPV_RiskReduced\") AS \"NPVRiskReduced\", (a.\"NPV_RiskReduced\") AS \"y\", 5 as \"r\", b.\"ProjectDefinition\", b.\"UDStrategicObjective\" AS \"StrategicObjective\", d.\"Id\" AS \"StrategicObjectiveId\", CASE WHEN a.\"Mandatory\" = '1' THEN true ELSE false END AS \"Mandatory\" FROM public.\"PortfolioOpt_Approved_Proj\" AS a INNER JOIN public.\"MP_Project\" AS b ON a.\"Project_ID\" = b.\"Id\" LEFT JOIN public.\"MP_DropDown\" AS d ON b.\"UDStrategicObjective\" = d.\"Name\" AND d.\"ParentId\" = 1 WHERE a.\"Plan_ID\"=(@id)" + where;

            var approvedList = (await DbHelper.ExecuteDql<AipmPortfolioResultData>(approvedSql, parameters)).ToList();
            var rejectedList = (await DbHelper.ExecuteDql<AipmPortfolioResultData>(rejectedSql, parameters)).ToList();

            if (approvedList.Count == 0 && rejectedList.Count == 0)
            {
                return new AipmPortfolioResultChartModel
                {
                    Datasets = new List<AipmPortfolioResultDataset>()
                };
            }

            var strategicObjectiveColors = new Dictionary<int, string>();
            strategicObjectiveColors.Add(18, "rgb(190, 189, 127)");
            strategicObjectiveColors.Add(19, "rgb(32, 33, 79)");
            strategicObjectiveColors.Add(20, "rgb(214, 174, 1)");
            strategicObjectiveColors.Add(21, "rgb(48, 25, 52)");
            strategicObjectiveColors.Add(22, "rgb(164, 125, 144)");
            strategicObjectiveColors.Add(36, "rgb(127, 181, 181)");
            strategicObjectiveColors.Add(37, "rgb(34, 113, 179)");
            strategicObjectiveColors.Add(133, "rgb(203, 208, 204)");
            strategicObjectiveColors.Add(134, "rgb(214 ,211, 240)");
            strategicObjectiveColors.Add(135, "rgb(241, 143, 1)");

            var approvedListColors = new List<string>();
            foreach (var item in approvedList)
            {
                if (item.StrategicObjectiveId != 0)
                {
                    approvedListColors.Add(strategicObjectiveColors[item.StrategicObjectiveId]);
                }
                else
                {
                    approvedListColors.Add("rgb(25, 135, 84, 0.5)");
                }
            }

            var rejectedListColors = new List<string>();
            foreach (var item in rejectedList)
            {
                if (item.StrategicObjectiveId != 0)
                {
                    rejectedListColors.Add(strategicObjectiveColors[item.StrategicObjectiveId]);
                }
                else
                {
                    rejectedListColors.Add("rgb(248,108,107,0.5)");
                }
            }

            var thresholdColor = new List<string>();
            thresholdColor.Add("grey");

            var approvedDataset = new AipmPortfolioResultDataset
            {
                Type = "bubble",
                Label = "Prioritised",
                Data = approvedList,
                BorderColor = "rgb(25, 135, 84)",
                BackgroundColor = approvedListColors,
                Fill = true
            };

            var rejectedDataset = new AipmPortfolioResultDataset
            {
                Type = "bubble",
                Label = "Deprioritised",
                Data = rejectedList,
                BorderColor = "rgb(248,108,107)",
                BackgroundColor = rejectedListColors,
                Fill = true
            };

            var maxApprovedBudget = approvedList.Count > 0 ? approvedList.Max(a => a.TCOOpex + a.TCOTotalProjectCost) : 0;
            var maxApprovedRiskReduced = approvedList.Count > 0 ? approvedList.Max(a => a.NPVRiskReduced) : 0;
            var maxRejectedBudget = rejectedList.Count > 0 ? rejectedList.Max(a => a.TCOOpex + a.TCOTotalProjectCost) : 0;
            var maxRejectedRiskReduced = rejectedList.Count > 0 ? rejectedList.Max(a => a.NPVRiskReduced) : 0;

            var maxList = new List<decimal>();
            maxList.Add(maxApprovedBudget);
            maxList.Add(maxApprovedRiskReduced);
            maxList.Add(maxRejectedBudget);
            maxList.Add(maxRejectedRiskReduced);

            var max = maxList.Max(a => a);
            var maxValue = new AipmPortfolioResultData
            {
                x = max,
                y = max
            };
            var baseValue = new AipmPortfolioResultData
            {
                x = 0,
                y = 0
            };

            var lineData = new List<AipmPortfolioResultData>();
            lineData.Add(baseValue);
            lineData.Add(maxValue);

            var lineDataset = new AipmPortfolioResultDataset
            {
                Type = "line",
                Label = "Threshold",
                Data = lineData,
                BorderColor = "lightgrey",
                BackgroundColor = thresholdColor,
                Fill = false
            };


            var datasetList = new List<AipmPortfolioResultDataset>();
            datasetList.Add(approvedDataset);
            datasetList.Add(rejectedDataset);
            datasetList.Add(lineDataset);

            var returnData = new AipmPortfolioResultChartModel
            {
                Datasets = datasetList
            };

            return returnData;
        }

        public static async Task<AipmPortfolioResultChartModel> GetAlternateChart(int scenarioId, AipmPortfolioResultFilter filter)
        {
            //MR&HPA

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

            if (filter.SubObjective != null && filter.SubObjective.Count > 0)
            {
                var subObjective = string.Join("', '", filter.SubObjective);
                where += " AND b.\"UDIBRNarrativeMR\" IN ('" + subObjective + "')";
            }

            if (filter.SubObjectiveHPA != null && filter.SubObjectiveHPA.Count > 0)
            {
                var subOjectiveHPA = string.Join("', '", filter.SubObjectiveHPA);
                where += " AND b.\"UDIBRNarrativeHPA\" IN ('" + subOjectiveHPA + "')";
            }

            if (filter.Voltage != null && filter.Voltage.Count > 0)
            {
                var voltage = string.Join("', '", filter.Voltage);
                where += " AND b.\"UDVoltagekV\" IN ('" + voltage + "')";
            }

            var parameters = new { id = scenarioId };

            //var rejectedSql = $"SELECT a.\"Plan_ID\", a.\"Project_ID\", a.\"Project_Score\" AS \"TotalProjectScore\", a.\"Total_Budget\" AS \"TotalBudget\", a.\"Total_Budget\" AS \"x\", (a.\"Risk_Reduced\"*1000000) AS \"TotalRiskReduced\", (a.\"Risk_Reduced\"*1000000) AS \"y\", (CASE WHEN (a.\"Project_Score\"*3) < 5 THEN 5 ELSE (CASE WHEN (a.\"Project_Score\"*3) > 15 THEN 15 ELSE (a.\"Project_Score\"*3) END) END) as \"r\", b.\"ProjectDefinition\" FROM public.\"PortfolioOpt_Rejected_Proj\" AS a INNER JOIN public.\"MP_Project\" AS b ON a.\"Project_ID\" = b.\"Id\" WHERE a.\"Plan_ID\"=(@id)" + where;

            //var approvedSql = $"SELECT a.\"Plan_ID\", a.\"Project_ID\", a.\"Project_Score\" AS \"TotalProjectScore\", a.\"Total_Budget\" AS \"TotalBudget\", a.\"Total_Budget\" AS \"x\", (a.\"Risk_Reduced\"*1000000) AS \"TotalRiskReduced\", (a.\"Risk_Reduced\"*1000000) AS \"y\", (CASE WHEN (a.\"Project_Score\"*3) < 5 THEN 5 ELSE (CASE WHEN (a.\"Project_Score\"*3) > 15 THEN 15 ELSE (a.\"Project_Score\"*3) END) END) as \"r\", b.\"ProjectDefinition\" FROM public.\"PortfolioOpt_Approved_Proj\" AS a INNER JOIN public.\"MP_Project\" AS b ON a.\"Project_ID\" = b.\"Id\" WHERE a.\"Plan_ID\"=(@id)" + where;

            var rejectedSql = $"SELECT a.\"Plan_ID\", a.\"Project_ID\", a.\"Project_Score\" AS \"TotalProjectScore\", a.\"Total_Budget\" AS \"TotalBudget\", a.\"TCO_Opex\"*1000000 AS \"TCOOpex\", a.\"TCO_TotalProjectCost\"*1000000 AS \"TCOTotalProjectCost\", (a.\"TCO_Opex\" + a.\"TCO_TotalProjectCost\")*1000000 AS \"TotalTCO\", (a.\"TCO_Opex\" + a.\"TCO_TotalProjectCost\")*1000000 AS \"x\", (a.\"Risk_Reduced\") AS \"TotalRiskReduced\", (a.\"NPV_RiskReduced\") AS \"NPVRiskReduced\", (a.\"NPV_RiskReduced\") AS \"y\", 5 as \"r\", b.\"ProjectDefinition\", b.\"UDStrategicObjective\" AS \"StrategicObjective\", d.\"Id\" AS \"StrategicObjectiveId\", c.mandatory AS \"Mandatory\" FROM public.\"PortfolioOpt_Rejected_Proj\" AS a INNER JOIN public.\"MP_Project\" AS b ON a.\"Project_ID\" = b.\"Id\" INNER JOIN public.\"AIPM_PortfolioProjects\" AS c ON a.\"Project_ID\" = c.projectid AND a.\"Plan_ID\" = c.scenarioid LEFT JOIN public.\"MP_DropDown\" AS d ON b.\"UDStrategicObjective\" = d.\"Name\" AND d.\"ParentId\" = 1 WHERE a.\"Plan_ID\"=(@id) AND (a.\"Replace\" IS NULL OR a.\"Replace\" = false)" + where;

            var approvedSql = $"SELECT a.\"Plan_ID\", a.\"Project_ID\", a.\"Project_Score\" AS \"TotalProjectScore\", a.\"Total_Budget\" AS \"TotalBudget\", a.\"TCO_Opex\"*1000000 AS \"TCOOpex\", a.\"TCO_TotalProjectCost\"*1000000 AS \"TCOTotalProjectCost\", (a.\"TCO_Opex\" + a.\"TCO_TotalProjectCost\")*1000000 AS \"TotalTCO\", (a.\"TCO_Opex\" + a.\"TCO_TotalProjectCost\")*1000000 AS \"x\", (a.\"Risk_Reduced\") AS \"TotalRiskReduced\", (a.\"NPV_RiskReduced\") AS \"NPVRiskReduced\", (a.\"NPV_RiskReduced\") AS \"y\", 5 as \"r\", b.\"ProjectDefinition\", b.\"UDStrategicObjective\" AS \"StrategicObjective\", d.\"Id\" AS \"StrategicObjectiveId\", CASE WHEN a.\"Mandatory\" = '1' THEN true ELSE false END AS \"Mandatory\" FROM public.\"PortfolioOpt_Approved_Proj\" AS a INNER JOIN public.\"MP_Project\" AS b ON a.\"Project_ID\" = b.\"Id\" LEFT JOIN public.\"MP_DropDown\" AS d ON b.\"UDStrategicObjective\" = d.\"Name\" AND d.\"ParentId\" = 1 WHERE a.\"Plan_ID\"=(@id) AND (a.\"Defer\" IS NULL OR a.\"Defer\" = false) " + where;

            var alternateSql = $"SELECT a.\"Plan_ID\", a.\"Project_ID\", a.\"Project_Score\" AS \"TotalProjectScore\", a.\"Total_Budget\" AS \"TotalBudget\", a.\"TCO_Opex\"*1000000 AS \"TCOOpex\", a.\"TCO_TotalProjectCost\"*1000000 AS \"TCOTotalProjectCost\", (a.\"TCO_Opex\" + a.\"TCO_TotalProjectCost\")*1000000 AS \"TotalTCO\", (a.\"TCO_Opex\" + a.\"TCO_TotalProjectCost\")*1000000 AS \"x\", (a.\"Risk_Reduced\") AS \"TotalRiskReduced\", (a.\"NPV_RiskReduced\") AS \"NPVRiskReduced\", (a.\"NPV_RiskReduced\") AS \"y\", 5 as \"r\", b.\"ProjectDefinition\", b.\"UDStrategicObjective\" AS \"StrategicObjective\", d.\"Id\" AS \"StrategicObjectiveId\", CASE WHEN a.\"Mandatory\" = '1' THEN true ELSE false END AS \"Mandatory\" FROM public.\"PortfolioOpt_Alternate_Proj\" AS a INNER JOIN public.\"MP_Project\" AS b ON a.\"Project_ID\" = b.\"Id\" LEFT JOIN public.\"MP_DropDown\" AS d ON b.\"UDStrategicObjective\" = d.\"Name\" AND d.\"ParentId\" = 1 WHERE a.\"Plan_ID\"=(@id)" + where;

            var approvedList = (await DbHelper.ExecuteDql<AipmPortfolioResultData>(approvedSql, parameters)).ToList();
            var alternateList = (await DbHelper.ExecuteDql<AipmPortfolioResultData>(alternateSql, parameters)).ToList();
            var rejectedList = (await DbHelper.ExecuteDql<AipmPortfolioResultData>(rejectedSql, parameters)).ToList();

            var newApprovedList = approvedList.Concat(alternateList).ToList();

            if (newApprovedList.Count == 0 && rejectedList.Count == 0)
            {
                return new AipmPortfolioResultChartModel
                {
                    Datasets = new List<AipmPortfolioResultDataset>()
                };
            }

            var strategicObjectiveColors = new Dictionary<int, string>();
            strategicObjectiveColors.Add(18, "rgb(190, 189, 127)");
            strategicObjectiveColors.Add(19, "rgb(32, 33, 79)");
            strategicObjectiveColors.Add(20, "rgb(214, 174, 1)");
            strategicObjectiveColors.Add(21, "rgb(48, 25, 52)");
            strategicObjectiveColors.Add(22, "rgb(164, 125, 144)");
            strategicObjectiveColors.Add(36, "rgb(127, 181, 181)");
            strategicObjectiveColors.Add(37, "rgb(34, 113, 179)");
            strategicObjectiveColors.Add(133, "rgb(203, 208, 204)");
            strategicObjectiveColors.Add(134, "rgb(214 ,211, 240)");
            strategicObjectiveColors.Add(135, "rgb(241, 143, 1)");

            var approvedListColors = new List<string>();
            foreach (var item in newApprovedList)
            {
                if (item.StrategicObjectiveId != 0)
                {
                    approvedListColors.Add(strategicObjectiveColors[item.StrategicObjectiveId]);
                }
                else
                {
                    approvedListColors.Add("rgb(25, 135, 84, 0.5)");
                }
            }

            var rejectedListColors = new List<string>();
            foreach (var item in rejectedList)
            {
                if (item.StrategicObjectiveId != 0)
                {
                    rejectedListColors.Add(strategicObjectiveColors[item.StrategicObjectiveId]);
                }
                else
                {
                    rejectedListColors.Add("rgb(248,108,107,0.5)");
                }
            }

            var thresholdColor = new List<string>();
            thresholdColor.Add("grey");

            var approvedDataset = new AipmPortfolioResultDataset
            {
                Type = "bubble",
                Label = "Prioritised",
                Data = newApprovedList,
                BorderColor = "rgb(25, 135, 84)",
                BackgroundColor = approvedListColors,
                Fill = true
            };

            var rejectedDataset = new AipmPortfolioResultDataset
            {
                Type = "bubble",
                Label = "Deprioritised",
                Data = rejectedList,
                BorderColor = "rgb(248,108,107)",
                BackgroundColor = rejectedListColors,
                Fill = true
            };

            //var maxApprovedBudget = newApprovedList.Count > 0 ? approvedList.Max(a => a.TCOOpex + a.TCOTotalProjectCost) : 0;
            //var maxApprovedRiskReduced = newApprovedList.Count > 0 ? approvedList.Max(a => a.NPVRiskReduced) : 0;
            var maxApprovedBudget = newApprovedList.Count > 0 ? newApprovedList.Max(a => a.TCOOpex + a.TCOTotalProjectCost) : 0;
            var maxApprovedRiskReduced = newApprovedList.Count > 0 ? newApprovedList.Max(a => a.NPVRiskReduced) : 0;
            var maxRejectedBudget = rejectedList.Count > 0 ? rejectedList.Max(a => a.TCOOpex + a.TCOTotalProjectCost) : 0;
            var maxRejectedRiskReduced = rejectedList.Count > 0 ? rejectedList.Max(a => a.NPVRiskReduced) : 0;

            var maxList = new List<decimal>();
            maxList.Add(maxApprovedBudget);
            maxList.Add(maxApprovedRiskReduced);
            maxList.Add(maxRejectedBudget);
            maxList.Add(maxRejectedRiskReduced);

            var max = maxList.Max(a => a);
            var maxValue = new AipmPortfolioResultData
            {
                x = max,
                y = max
            };
            var baseValue = new AipmPortfolioResultData
            {
                x = 0,
                y = 0
            };

            var lineData = new List<AipmPortfolioResultData>();
            lineData.Add(baseValue);
            lineData.Add(maxValue);

            var lineDataset = new AipmPortfolioResultDataset
            {
                Type = "line",
                Label = "Threshold",
                Data = lineData,
                BorderColor = "lightgrey",
                BackgroundColor = thresholdColor,
                Fill = false
            };


            var datasetList = new List<AipmPortfolioResultDataset>();
            datasetList.Add(approvedDataset);
            datasetList.Add(rejectedDataset);
            datasetList.Add(lineDataset);

            var returnData = new AipmPortfolioResultChartModel
            {
                Datasets = datasetList
            };

            return returnData;
        }

        public static async Task<AipmPortfolioResultBarNLineChartModel> GetBudgetChart(int scenarioId, AipmPortfolioResultFilter filter)
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

            var parameters = new { id = scenarioId };

            var summaryData = await PortfolioResultsSummary(scenarioId, filter);
            var prioritisedData = summaryData.Where(x => x.Summary == "Prioritised").FirstOrDefault();

            var barChartModel = new AipmPortfolioResultBarChartModel();
            barChartModel.Labels.Add("Current Scenario");


            for (var i = 0; i < 8; i++)
            {
                var dataModel = new AipmPortfolioResultBarChartDataModel();
                dataModel.yAxisID = "annualBudget";
                //dataModel.Order = 0;
                dataModel.Type = "bar";
                switch (i)
                {
                    case 0:
                        dataModel.Label = "Year 1";
                        //dataModel.Data.Add(prioritisedData.BUDY1.HasValue ? prioritisedData.BUDY1.Value : 0);
                        dataModel.Data.Add((double)decimal.Parse(prioritisedData.BUDY1.Value.ToString("0.00")) / 1000000);
                        dataModel.BackgroundColor = "rgb(255, 99, 132)";
                        break;

                    case 1:
                        dataModel.Label = "Year 2";
                        //dataModel.Data.Add(prioritisedData.BUDY2.HasValue ? prioritisedData.BUDY2.Value : 0);
                        dataModel.Data.Add((double)decimal.Parse(prioritisedData.BUDY2.Value.ToString("0.00")) / 1000000);
                        dataModel.BackgroundColor = "rgb(54, 162, 235)";
                        break;

                    case 2:
                        dataModel.Label = "Year 3";
                        //dataModel.Data.Add(prioritisedData.BUDY3.HasValue ? prioritisedData.BUDY3.Value : 0);
                        dataModel.Data.Add((double)decimal.Parse(prioritisedData.BUDY3.Value.ToString("0.00")) / 1000000);
                        dataModel.BackgroundColor = "rgb(255, 205, 86)";
                        break;

                    case 3:
                        dataModel.Label = "Year 4";
                        //dataModel.Data.Add(prioritisedData.BUDY4.HasValue ? prioritisedData.BUDY4.Value : 0);
                        dataModel.Data.Add((double)decimal.Parse(prioritisedData.BUDY4.Value.ToString("0.00")) / 1000000);
                        dataModel.BackgroundColor = "rgb(75, 192, 192)";
                        break;

                    case 4:
                        dataModel.Label = "Year 5";
                        //dataModel.Data.Add(prioritisedData.BUDY5.HasValue ? prioritisedData.BUDY5.Value : 0);
                        dataModel.Data.Add((double)decimal.Parse(prioritisedData.BUDY5.Value.ToString("0.00")) / 1000000);
                        dataModel.BackgroundColor = "rgb(153, 103, 255)";
                        break;

                    case 5:
                        dataModel.Label = "Year 6";
                        //dataModel.Data.Add(prioritisedData.BUDY6.HasValue ? prioritisedData.BUDY6.Value : 0);
                        dataModel.Data.Add((double)decimal.Parse(prioritisedData.BUDY6.Value.ToString("0.00")) / 1000000);
                        dataModel.BackgroundColor = "rgb(185, 122, 87)";
                        break;

                    case 6:
                        dataModel.Label = "Year 7";
                        //dataModel.Data.Add(prioritisedData.BUDY7.HasValue ? prioritisedData.BUDY7.Value : 0);
                        dataModel.Data.Add((double)decimal.Parse(prioritisedData.BUDY7.Value.ToString("0.00")) / 1000000);
                        dataModel.BackgroundColor = "rgb(52, 185, 182)";
                        break;

                    case 7:
                        dataModel.Label = "Year 8";
                        //dataModel.Data.Add(prioritisedData.BUDY8.HasValue ? prioritisedData.BUDY8.Value : 0);
                        dataModel.Data.Add((double)decimal.Parse(prioritisedData.BUDY8.Value.ToString("0.00")) / 1000000);
                        dataModel.BackgroundColor = "rgb(185, 140, 19)";
                        break;
                }

                //add Bar Chart Data Model to Bar Chart Model
                barChartModel.Datasets.Add(dataModel);
            }

            var lineChart = new AipmPortfolioResultBarChartDataModel
            {
                yAxisID = "totalBudget",
                Label = "Total Budget",
                Type = "line",
                BackgroundColor = "rgb(255, 159, 64)"
            };
            //lineChart.Data.Add(prioritisedData.TotalBudget.Value);
            lineChart.Data.Add((double)decimal.Parse(prioritisedData.TotalBudget.Value.ToString("0.00")) / 1000000);
            barChartModel.Datasets.Add(lineChart);
            //var lineChartModel = new AipmPortfolioResultLineChartModel();
            //var lineData = new AipmPortfolioResultLineChartDataModel{
            //    Label = "Total Budget",
            //    Order = 1,
            //    Type = "line",
            //    TotalBudget = prioritisedData.TotalBudget.Value,
            //};

            //lineChartModel.Dataset.Add(lineData);

            var allData = new AipmPortfolioResultBarNLineChartModel
            {
                Labels = barChartModel.Labels,
                Datasets = barChartModel.Datasets
            };

            return allData;
        }

        /* GENCODE:MARKER:1:START */

//===============================================================
// TEMPLATE START: ScenarioManager.cs.1.6.tpl
//===============================================================
        public static async Task<PortfolioAnnualBudgetDataSummaryChartModel> GetLeftBarLineBudgetResultChart(int scenarioId, AipmPortfolioResultFilter filter)
        {
            var summaryData = await PortfolioAnnualBudgetDataSummary(scenarioId, filter);
            var barChartModel = new PortfolioAnnualBudgetDataSummaryInternalChartModel();
            // Get uniq labels
            Dictionary<string, int> labelArray = new Dictionary<string, int>();
            var lblIdx=0;
            foreach (var row in summaryData)
            {
                var value = 0;
                var token = row.Year==null?"null":row.Year;
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
                var token = row.Year==null?"null":row.Year;
                bool hasValue = legendArray.TryGetValue(token, out value);
                if (!hasValue) {
                    legendArray.Add(token, lgdIdx);
                    lgdIdx++;
                }
            }

            Dictionary<int, string> legendColorArray = new Dictionary<int, string>();
            int lclIdx=0;
            
 legendColorArray.Add(lclIdx++, "rgba(255, 99, 132,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(54, 162, 235,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(255, 205, 86,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(75, 192, 192,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(153, 103, 255,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(185, 122, 87,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(52, 185, 182,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(185, 140, 19,0.7)");

            Dictionary<int, string> legendBorderColorArray = new Dictionary<int, string>();
            int lbclIdx=0;
            
 legendBorderColorArray.Add(lbclIdx++, "rgba(255, 99, 132,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(54, 162, 235,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(255, 205, 86,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(75, 192, 192,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(153, 103, 255,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(185, 122, 87,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(52, 185, 182,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(185, 140, 19,1)");

            var dataModel = new PortfolioAnnualBudgetDataSummaryDatasets();
            double? BUDYTotal = null;
            dataModel.yAxisID = "yaxis1";
            dataModel.Type = "bar";
            foreach (var legend in legendArray) {
                foreach (var p in summaryData.Where(p => (p.Year==null?"null":p.Year) == legend.Key)) {
                    var token = p.Year==null?"null":p.Year;
                    dataModel.Data.Add((double)decimal.Parse(p.BUDY==null?"0.00":p.BUDY.Value.ToString("0.00")) );
                    BUDYTotal = BUDYTotal == null ? (p.BUDY==null? 0.0: p.BUDY.Value) : (BUDYTotal + (p.BUDY == null ? 0.0 : p.BUDY.Value));
                    dataModel.BackgroundColor.Add(legendColorArray[labelArray[token]]);
                }
            }
            //add Bar Chart Data Model to Bar Chart Model
            barChartModel.Datasets.Add(dataModel);

            var lineChart = new PortfolioAnnualBudgetDataSummaryDatasets
            {
                yAxisID = "yaxis2",
                //Label = "Total BUDY",
                Type = "line",
                Fill = false
                //BackgroundColor = "rgb(255, 159, 64)"
            };
            foreach (var legend in legendArray) {
                lineChart.Data.Add((double)decimal.Parse(BUDYTotal==null?"0.00":BUDYTotal.Value.ToString("0.00")) );
                lineChart.BackgroundColor.Add("rgba(201, 203, 207, 0.2)");
            }
            
            barChartModel.Datasets.Add(lineChart);

            var allData = new PortfolioAnnualBudgetDataSummaryChartModel
            {
                Labels = barChartModel.Labels,
                Datasets = barChartModel.Datasets,
                SQLData = summaryData.ToList()
            };

            return allData;
        }
//===============================================================
// TEMPLATE END: ScenarioManager.cs.1.6.tpl
//===============================================================


//===============================================================
// TEMPLATE START: ScenarioManager.cs.1.3.tpl
//===============================================================
        public static async Task<PortfolioBudgetvsStratDataSummaryChartModel> GetLeftStackedBarBudgetResultChart(int scenarioId, AipmPortfolioResultFilter filter)
        {
            var summaryData = await PortfolioBudgetvsStratDataSummary(scenarioId, filter);
            var barChartModel = new PortfolioBudgetvsStratDataSummaryChartModel();
            // Get uniq labels
            Dictionary<string, int> labelArray = new Dictionary<string, int>();
            var lblIdx=0;
            foreach (var row in summaryData)
            {
                var value = 0;
                var token = row.Year==null?"null":row.Year;
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
                var token = row.UDStrategicObjective==null?"null":row.UDStrategicObjective;
                bool hasValue = legendArray.TryGetValue(token, out value);
                if (!hasValue) {
                    legendArray.Add(token, lgdIdx);
                    lgdIdx++;
                }
            }

            Dictionary<int, string> legendColorArray = new Dictionary<int, string>();
            int lclIdx=0;
            
 legendColorArray.Add(lclIdx++, "rgba(255, 99, 132,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(54, 162, 235,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(255, 205, 86,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(75, 192, 192,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(153, 103, 255,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(185, 122, 87,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(52, 185, 182,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(185, 140, 19,0.7)");

            Dictionary<int, string> legendBorderColorArray = new Dictionary<int, string>();
            int lbclIdx=0;
            
 legendBorderColorArray.Add(lbclIdx++, "rgba(255, 99, 132,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(54, 162, 235,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(255, 205, 86,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(75, 192, 192,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(153, 103, 255,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(185, 122, 87,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(52, 185, 182,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(185, 140, 19,1)");

            foreach (var legend in legendArray) {
                var dataModel = new PortfolioBudgetvsStratDataSummaryDatasets();
                foreach (var p in summaryData.Where(p => (p.UDStrategicObjective==null?"null":p.UDStrategicObjective) == legend.Key)) {
                    var token = p.UDStrategicObjective==null?"null":p.UDStrategicObjective;
                    dataModel.Data.Add((double)decimal.Parse(p.BUDY==null?"0.00":p.BUDY.Value.ToString("0.00")) );
                    dataModel.Label = p.UDStrategicObjective==null?"null":p.UDStrategicObjective;
                    dataModel.BorderWidth = 1;
                    dataModel.CategoryPercentage = 0.5;
                    dataModel.Fill = true;
                    dataModel.BackgroundColor = legendColorArray[legendArray[token]];
                    dataModel.BorderColor = legendBorderColorArray[legendArray[token]];
                }

                //add Bar Chart Data Model to Bar Chart Model
                barChartModel.Datasets.Add(dataModel);
            }

            var allData = new PortfolioBudgetvsStratDataSummaryChartModel
            {
                Labels = barChartModel.Labels,
                Datasets = barChartModel.Datasets,
                SQLData = summaryData.ToList()
            };

            return allData;
        }
//===============================================================
// TEMPLATE END: ScenarioManager.cs.1.3.tpl
//===============================================================


//===============================================================
// TEMPLATE START: ScenarioManager.cs.1.7.tpl
//===============================================================
        public static async Task<PortfolioNPVvsCommMthDataSummaryChartModel> GetLeftBarLineNPVResultChart(int scenarioId, AipmPortfolioResultFilter filter)
        {
            var summaryData = await PortfolioNPVvsCommMthDataSummary(scenarioId, filter);
            var barChartModel = new PortfolioNPVvsCommMthDataSummaryInternalChartModel();
            // Get uniq labels
            Dictionary<string, int> fieldArray = new Dictionary<string, int>();
            var i=0;
            foreach (var row in summaryData)
            {
                var value = 0;
                var token = row.Year==null?"null":row.Year;
                bool hasValue = fieldArray.TryGetValue(row.Year, out value);
                if (!hasValue) {
                    fieldArray.Add(row.Year==null? "null": row.Year, i);
                    i++;
                }
            }

            // Add uniq labels to the chart
            foreach (var row in fieldArray)
            {
                barChartModel.Labels.Add(row.Key);
            }
            //barChartModel.Labels.Add("Current Scenario");

            Dictionary<string, int> stackArray = new Dictionary<string, int>();
            var idx=0;
            foreach (var row in summaryData)
            {
                var value = 0;
                var token = row.Year==null?"null":row.Year;
                bool hasValue = stackArray.TryGetValue(row.Year, out value);
                if (!hasValue) {
                    stackArray.Add(row.Year==null? "null": row.Year, idx);
                    idx++;
                }
            }

            foreach (var row in fieldArray)
            {
                var dataModel = new PortfolioNPVvsCommMthDataSummaryDatasets();
                dataModel.Type = "bar";
                foreach (var p in summaryData.Where(p => ((p.Year==null? "null": p.Year) == row.Key)))
                {
                    dataModel.Data.Add((double)decimal.Parse(p.NPV_RiskReduced==null?"0.00":p.NPV_RiskReduced.Value.ToString("0.00")) );
                    switch (fieldArray[p.Year==null ? "null" : p.Year]) {
                        case 0:
                            dataModel.Label = p.Year==null? "null":p.Year;
                            dataModel.BackgroundColor = "rgba(255, 99, 132,0.7)";
                            break;
    
                        case 1:
                            dataModel.Label = p.Year==null? "null":p.Year;
                            dataModel.BackgroundColor = "rgba(54, 162, 235,0.7)";
                            break;
    
                        case 2:
                            dataModel.Label = p.Year==null? "null":p.Year;
                            dataModel.BackgroundColor = "rgba(255, 205, 86,0.7)";
                            break;
    
                        case 3:
                            dataModel.Label = p.Year==null? "null":p.Year;
                            dataModel.BackgroundColor = "rgba(75, 192, 192,0.7)";
                            break;
    
                        case 4:
                            dataModel.Label = p.Year==null? "null":p.Year;
                            dataModel.BackgroundColor = "rgba(153, 103, 255,0.7)";
                            break;
    
                        case 5:
                            dataModel.Label = p.Year==null? "null":p.Year;
                            dataModel.BackgroundColor = "rgba(185, 122, 87,0.7)";
                            break;
    
                        case 6:
                            dataModel.Label = p.Year==null? "null":p.Year;
                            dataModel.BackgroundColor = "rgba(52, 185, 182,0.7)";
                            break;
    
                        case 7:
                            dataModel.Label = p.Year==null? "null":p.Year;
                            dataModel.BackgroundColor = "rgba(185, 140, 19,0.7)";
                            break;
                    }
                }

                //add Bar Chart Data Model to Bar Chart Model
                barChartModel.Datasets.Add(dataModel);
            }

            var allData = new PortfolioNPVvsCommMthDataSummaryChartModel
            {
                Labels = barChartModel.Labels,
                Datasets = barChartModel.Datasets,
                SQLData = summaryData.ToList()
            };

            return allData;
        }
//===============================================================
// TEMPLATE END: ScenarioManager.cs.1.7.tpl
//===============================================================


//===============================================================
// TEMPLATE START: ScenarioManager.cs.1.3.tpl
//===============================================================
        public static async Task<PortfolioNPVvsStratDataSummaryChartModel> GetLeftStackedBarNPVResultChart(int scenarioId, AipmPortfolioResultFilter filter)
        {
            var summaryData = await PortfolioNPVvsStratDataSummary(scenarioId, filter);
            var barChartModel = new PortfolioNPVvsStratDataSummaryChartModel();
            // Get uniq labels
            Dictionary<string, int> labelArray = new Dictionary<string, int>();
            var lblIdx=0;
            foreach (var row in summaryData)
            {
                var value = 0;
                var token = row.Year==null?"null":row.Year;
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
                var token = row.UDStrategicObjective==null?"null":row.UDStrategicObjective;
                bool hasValue = legendArray.TryGetValue(token, out value);
                if (!hasValue) {
                    legendArray.Add(token, lgdIdx);
                    lgdIdx++;
                }
            }

            Dictionary<int, string> legendColorArray = new Dictionary<int, string>();
            int lclIdx=0;
            
 legendColorArray.Add(lclIdx++, "rgba(255, 99, 132,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(54, 162, 235,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(255, 205, 86,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(75, 192, 192,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(153, 103, 255,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(185, 122, 87,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(52, 185, 182,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(185, 140, 19,0.7)");

            Dictionary<int, string> legendBorderColorArray = new Dictionary<int, string>();
            int lbclIdx=0;
            
 legendBorderColorArray.Add(lbclIdx++, "rgba(255, 99, 132,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(54, 162, 235,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(255, 205, 86,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(75, 192, 192,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(153, 103, 255,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(185, 122, 87,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(52, 185, 182,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(185, 140, 19,1)");

            foreach (var legend in legendArray) {
                var dataModel = new PortfolioNPVvsStratDataSummaryDatasets();
                foreach (var p in summaryData.Where(p => (p.UDStrategicObjective==null?"null":p.UDStrategicObjective) == legend.Key)) {
                    var token = p.UDStrategicObjective==null?"null":p.UDStrategicObjective;
                    dataModel.Data.Add((double)decimal.Parse(p.NPV_RiskReduced==null?"0.00":p.NPV_RiskReduced.Value.ToString("0.00")) );
                    dataModel.Label = p.UDStrategicObjective==null?"null":p.UDStrategicObjective;
                    dataModel.BorderWidth = 1;
                    dataModel.CategoryPercentage = 0.5;
                    dataModel.Fill = true;
                    dataModel.BackgroundColor = legendColorArray[legendArray[token]];
                    dataModel.BorderColor = legendBorderColorArray[legendArray[token]];
                }

                //add Bar Chart Data Model to Bar Chart Model
                barChartModel.Datasets.Add(dataModel);
            }

            var allData = new PortfolioNPVvsStratDataSummaryChartModel
            {
                Labels = barChartModel.Labels,
                Datasets = barChartModel.Datasets,
                SQLData = summaryData.ToList()
            };

            return allData;
        }
//===============================================================
// TEMPLATE END: ScenarioManager.cs.1.3.tpl
//===============================================================


//===============================================================
// TEMPLATE START: ScenarioManager.cs.1.2.tpl
//===============================================================
        public static async Task<PortfolioCumalRiskvsEleDataSummaryChartModel> GetLeftRadarElementResultChart(int scenarioId, AipmPortfolioResultFilter filter)
        {
            var summaryData = await PortfolioCumalRiskvsEleDataSummary(scenarioId, filter);

            var barChartModel = new PortfolioCumalRiskvsEleDataSummaryChartModel();
            barChartModel.Labels.Add("Safety RM (Thousand)");
            barChartModel.Labels.Add("Reliability RM (Thousand)");
            barChartModel.Labels.Add("Compliance RM (Thousand)");
            barChartModel.Labels.Add("Customer RM (Thousand)");
            barChartModel.Labels.Add("Financial RM (Mil)");
            barChartModel.Labels.Add("Environment RM (Thousand)");
/*
            // Get uniq labels
            Dictionary<string, int> fieldArray = new Dictionary<string, int>();
            var i=0;
            foreach (var row in summaryData)
            {
                var value = 0;
                var token = row.CommYear==null?"null":row.CommYear;
                bool hasValue = fieldArray.TryGetValue(row.CommYear, out value);
                if (!hasValue) {
                    fieldArray.Add(row.CommYear==null? "null": row.CommYear, i);
                    i++;
                }
            }
*/
            var i = 0;
            Dictionary<string, int> fieldArray = new Dictionary<string, int>();
            fieldArray.Add("Year 1", 0);
            fieldArray.Add("Year 2", 1);
            fieldArray.Add("Year 3", 2);
            fieldArray.Add("Year 4", 3);
            fieldArray.Add("Year 5", 4);
            fieldArray.Add("Year 6", 5);
            fieldArray.Add("Year 7", 6);
            fieldArray.Add("Year 8", 7);

            foreach (var row in summaryData)
            {
                var dataModel = new PortfolioCumalRiskvsEleDataSummaryDatasets();
                dataModel.Label = row.CommYear==null? "blank":row.CommYear;
                dataModel.Data.Add((double)decimal.Parse(row.Safety==null?"0.00":row.Safety.Value.ToString("0.0000")));
                dataModel.Data.Add((double)decimal.Parse(row.Reliability==null?"0.00":row.Reliability.Value.ToString("0.0000")));
                dataModel.Data.Add((double)decimal.Parse(row.Compliance==null?"0.00":row.Compliance.Value.ToString("0.0000")));
                dataModel.Data.Add((double)decimal.Parse(row.Customer==null?"0.00":row.Customer.Value.ToString("0.0000")));
                dataModel.Data.Add((double)decimal.Parse(row.Financial==null?"0.00":row.Financial.Value.ToString("0.0000")));
                dataModel.Data.Add((double)decimal.Parse(row.Environment==null?"0.00":row.Environment.Value.ToString("0.0000")));
                //switch (fieldArray[row.CommYear==null? "null": row.CommYear])
                switch (i)
                {
                    case 0:
                        dataModel.BorderColor = "rgba(255, 99, 132,1)";
                        dataModel.BorderWidth = 1;
                        dataModel.BackgroundColor = "rgba(255, 99, 132,0.7)";
                        dataModel.Fill = false;
                        break;

                    case 1:
                        dataModel.BorderColor = "rgba(54, 162, 235,1)";
                        dataModel.BorderWidth = 1;
                        dataModel.BackgroundColor = "rgba(54, 162, 235,0.7)";
                        dataModel.Fill = false;
                        break;

                    case 2:
                        dataModel.BorderColor = "rgba(255, 205, 86,1)";
                        dataModel.BorderWidth = 1;
                        dataModel.BackgroundColor = "rgba(255, 205, 86,0.7)";
                        dataModel.Fill = false;
                        break;

                    case 3:
                        dataModel.BorderColor = "rgba(75, 192, 192,1)";
                        dataModel.BorderWidth = 1;
                        dataModel.BackgroundColor = "rgba(75, 192, 192,0.7)";
                        dataModel.Fill = false;
                        break;

                    case 4:
                        dataModel.BorderColor = "rgba(153, 103, 255,1)";
                        dataModel.BorderWidth = 1;
                        dataModel.BackgroundColor = "rgba(153, 103, 255,0.7)";
                        dataModel.Fill = false;
                        break;

                    case 5:
                        dataModel.BorderColor = "rgba(185, 122, 87,1)";
                        dataModel.BorderWidth = 1;
                        dataModel.BackgroundColor = "rgba(185, 122, 87,0.7)";
                        dataModel.Fill = false;

                        break;

                    case 6:
                        dataModel.BorderColor = "rgba(52, 185, 182,1)";
                        dataModel.BorderWidth = 1;
                        dataModel.BackgroundColor = "rgba(52, 185, 182,0.7)";
                        dataModel.Fill = false;
                        break;

                    case 7:
                        dataModel.BorderColor = "rgba(185, 140, 19,1)";
                        dataModel.BorderWidth = 1;
                        dataModel.BackgroundColor = "rgba(185, 140, 19,0.7)";
                        dataModel.Fill = false;
                        break;
                }
                i++;
                //add Bar Chart Data Model to Bar Chart Model
                barChartModel.Datasets.Add(dataModel);
            }

            var allData = new PortfolioCumalRiskvsEleDataSummaryChartModel
            {
                Labels = barChartModel.Labels,
                Datasets = barChartModel.Datasets,
                SQLData = summaryData.ToList()
            };

            return allData;
        }
//===============================================================
// TEMPLATE END: ScenarioManager.cs.1.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: ScenarioManager.cs.1.3.tpl
//===============================================================
        public static async Task<PortfolioOSRiskDataSummaryChartModel> GetLeftStackedBarOSRiskResultChart(int scenarioId, AipmPortfolioResultFilter filter)
        {
            var summaryData = await PortfolioOSRiskDataSummary(scenarioId, filter);
            var barChartModel = new PortfolioOSRiskDataSummaryChartModel();
            // Get uniq labels
            Dictionary<string, int> labelArray = new Dictionary<string, int>();
            var lblIdx=0;
            foreach (var row in summaryData)
            {
                var value = 0;
                var token = row.Year==null?"null":row.Year;
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
                var token = row.Description==null?"null":row.Description;
                bool hasValue = legendArray.TryGetValue(token, out value);
                if (!hasValue) {
                    legendArray.Add(token, lgdIdx);
                    lgdIdx++;
                }
            }

            Dictionary<int, string> legendColorArray = new Dictionary<int, string>();
            int lclIdx=0;
            
 legendColorArray.Add(lclIdx++, "rgba(255, 99, 132,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(54, 162, 235,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(255, 205, 86,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(75, 192, 192,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(153, 103, 255,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(185, 122, 87,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(52, 185, 182,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(185, 140, 19,0.7)");

            Dictionary<int, string> legendBorderColorArray = new Dictionary<int, string>();
            int lbclIdx=0;
            
 legendBorderColorArray.Add(lbclIdx++, "rgba(255, 99, 132,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(54, 162, 235,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(255, 205, 86,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(75, 192, 192,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(153, 103, 255,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(185, 122, 87,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(52, 185, 182,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(185, 140, 19,1)");

            foreach (var legend in legendArray) {
                var dataModel = new PortfolioOSRiskDataSummaryDatasets();
                foreach (var p in summaryData.Where(p => (p.Description==null?"null":p.Description) == legend.Key)) {
                    var token = p.Description==null?"null":p.Description;
                    dataModel.Data.Add((double)decimal.Parse(p.Value==null?"0.00":p.Value.Value.ToString("0.00")) );
                    dataModel.Label = p.Description==null?"null":p.Description;
                    dataModel.BorderWidth = 1;
                    dataModel.CategoryPercentage = 0.5;
                    dataModel.Fill = true;
                    dataModel.BackgroundColor = legendColorArray[legendArray[token]];
                    dataModel.BorderColor = legendBorderColorArray[legendArray[token]];
                }

                //add Bar Chart Data Model to Bar Chart Model
                barChartModel.Datasets.Add(dataModel);
            }

            var allData = new PortfolioOSRiskDataSummaryChartModel
            {
                Labels = barChartModel.Labels,
                Datasets = barChartModel.Datasets,
                SQLData = summaryData.ToList()
            };

            return allData;
        }
//===============================================================
// TEMPLATE END: ScenarioManager.cs.1.3.tpl
//===============================================================


//===============================================================
// TEMPLATE START: ScenarioManager.cs.1.6.tpl
//===============================================================
        public static async Task<PortfolioAnnualBudgetDataAltSummaryChartModel> GetLeftBarLineBudgetChart(int scenarioId, AipmPortfolioResultFilter filter)
        {
            var summaryData = await PortfolioAnnualBudgetDataAltSummary(scenarioId, filter);
            var barChartModel = new PortfolioAnnualBudgetDataAltSummaryInternalChartModel();
            // Get uniq labels
            Dictionary<string, int> labelArray = new Dictionary<string, int>();
            var lblIdx=0;
            foreach (var row in summaryData)
            {
                var value = 0;
                var token = row.Year==null?"null":row.Year;
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
                var token = row.Year==null?"null":row.Year;
                bool hasValue = legendArray.TryGetValue(token, out value);
                if (!hasValue) {
                    legendArray.Add(token, lgdIdx);
                    lgdIdx++;
                }
            }

            Dictionary<int, string> legendColorArray = new Dictionary<int, string>();
            int lclIdx=0;
            
 legendColorArray.Add(lclIdx++, "rgba(255, 99, 132,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(54, 162, 235,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(255, 205, 86,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(75, 192, 192,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(153, 103, 255,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(185, 122, 87,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(52, 185, 182,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(185, 140, 19,0.7)");

            Dictionary<int, string> legendBorderColorArray = new Dictionary<int, string>();
            int lbclIdx=0;
            
 legendBorderColorArray.Add(lbclIdx++, "rgba(255, 99, 132,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(54, 162, 235,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(255, 205, 86,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(75, 192, 192,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(153, 103, 255,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(185, 122, 87,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(52, 185, 182,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(185, 140, 19,1)");

            var dataModel = new PortfolioAnnualBudgetDataAltSummaryDatasets();
            double? BUDYTotal = null;
            dataModel.yAxisID = "yaxis1";
            dataModel.Type = "bar";
            foreach (var legend in legendArray) {
                foreach (var p in summaryData.Where(p => (p.Year==null?"null":p.Year) == legend.Key)) {
                    var token = p.Year==null?"null":p.Year;
                    dataModel.Data.Add((double)decimal.Parse(p.BUDY==null?"0.00":p.BUDY.Value.ToString("0.00")) );
                    BUDYTotal = BUDYTotal == null ? (p.BUDY==null? 0.0: p.BUDY.Value) : (BUDYTotal + (p.BUDY == null ? 0.0 : p.BUDY.Value));
                    dataModel.BackgroundColor.Add(legendColorArray[labelArray[token]]);
                }
            }
            //add Bar Chart Data Model to Bar Chart Model
            barChartModel.Datasets.Add(dataModel);

            var lineChart = new PortfolioAnnualBudgetDataAltSummaryDatasets
            {
                yAxisID = "yaxis2",
                //Label = "Total BUDY",
                Type = "line",
                Fill = false
                //BackgroundColor = "rgb(255, 159, 64)"
            };
            foreach (var legend in legendArray) {
                lineChart.Data.Add((double)decimal.Parse(BUDYTotal==null?"0.00":BUDYTotal.Value.ToString("0.00")) );
                lineChart.BackgroundColor.Add("rgba(201, 203, 207, 0.2)");
            }
            
            barChartModel.Datasets.Add(lineChart);

            var allData = new PortfolioAnnualBudgetDataAltSummaryChartModel
            {
                Labels = barChartModel.Labels,
                Datasets = barChartModel.Datasets,
                SQLData = summaryData.ToList()
            };

            return allData;
        }
//===============================================================
// TEMPLATE END: ScenarioManager.cs.1.6.tpl
//===============================================================


//===============================================================
// TEMPLATE START: ScenarioManager.cs.1.6.tpl
//===============================================================
        public static async Task<PortfolioAnnualBudgetDataAltSummaryChartModel> GetRightBarLineBudgetChart(int scenarioId, AipmPortfolioResultFilter filter)
        {
            var summaryData = await PortfolioAnnualBudgetDataAltSummary(scenarioId, filter);
            var barChartModel = new PortfolioAnnualBudgetDataAltSummaryInternalChartModel();
            // Get uniq labels
            Dictionary<string, int> labelArray = new Dictionary<string, int>();
            var lblIdx=0;
            foreach (var row in summaryData)
            {
                var value = 0;
                var token = row.Year==null?"null":row.Year;
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
                var token = row.Year==null?"null":row.Year;
                bool hasValue = legendArray.TryGetValue(token, out value);
                if (!hasValue) {
                    legendArray.Add(token, lgdIdx);
                    lgdIdx++;
                }
            }

            Dictionary<int, string> legendColorArray = new Dictionary<int, string>();
            int lclIdx=0;
            
 legendColorArray.Add(lclIdx++, "rgba(255, 99, 132,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(54, 162, 235,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(255, 205, 86,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(75, 192, 192,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(153, 103, 255,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(185, 122, 87,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(52, 185, 182,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(185, 140, 19,0.7)");

            Dictionary<int, string> legendBorderColorArray = new Dictionary<int, string>();
            int lbclIdx=0;
            
 legendBorderColorArray.Add(lbclIdx++, "rgba(255, 99, 132,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(54, 162, 235,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(255, 205, 86,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(75, 192, 192,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(153, 103, 255,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(185, 122, 87,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(52, 185, 182,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(185, 140, 19,1)");

            var dataModel = new PortfolioAnnualBudgetDataAltSummaryDatasets();
            double? BUDYTotal = null;
            dataModel.yAxisID = "yaxis1";
            dataModel.Type = "bar";
            foreach (var legend in legendArray) {
                foreach (var p in summaryData.Where(p => (p.Year==null?"null":p.Year) == legend.Key)) {
                    var token = p.Year==null?"null":p.Year;
                    dataModel.Data.Add((double)decimal.Parse(p.BUDY==null?"0.00":p.BUDY.Value.ToString("0.00")) );
                    BUDYTotal = BUDYTotal == null ? (p.BUDY==null? 0.0: p.BUDY.Value) : (BUDYTotal + (p.BUDY == null ? 0.0 : p.BUDY.Value));
                    dataModel.BackgroundColor.Add(legendColorArray[labelArray[token]]);
                }
            }
            //add Bar Chart Data Model to Bar Chart Model
            barChartModel.Datasets.Add(dataModel);

            var lineChart = new PortfolioAnnualBudgetDataAltSummaryDatasets
            {
                yAxisID = "yaxis2",
                //Label = "Total BUDY",
                Type = "line",
                Fill = false
                //BackgroundColor = "rgb(255, 159, 64)"
            };
            foreach (var legend in legendArray) {
                lineChart.Data.Add((double)decimal.Parse(BUDYTotal==null?"0.00":BUDYTotal.Value.ToString("0.00")) );
                lineChart.BackgroundColor.Add("rgba(201, 203, 207, 0.2)");
            }
            
            barChartModel.Datasets.Add(lineChart);

            var allData = new PortfolioAnnualBudgetDataAltSummaryChartModel
            {
                Labels = barChartModel.Labels,
                Datasets = barChartModel.Datasets,
                SQLData = summaryData.ToList()
            };

            return allData;
        }
//===============================================================
// TEMPLATE END: ScenarioManager.cs.1.6.tpl
//===============================================================


//===============================================================
// TEMPLATE START: ScenarioManager.cs.1.3.tpl
//===============================================================
        public static async Task<PortfolioBudgetvsStratDataAltSummaryChartModel> GetLeftStackedBarBudgetChart(int scenarioId, AipmPortfolioResultFilter filter)
        {
            var summaryData = await PortfolioBudgetvsStratDataAltSummary(scenarioId, filter);
            var barChartModel = new PortfolioBudgetvsStratDataAltSummaryChartModel();
            // Get uniq labels
            Dictionary<string, int> labelArray = new Dictionary<string, int>();
            var lblIdx=0;
            foreach (var row in summaryData)
            {
                var value = 0;
                var token = row.Year==null?"null":row.Year;
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
                var token = row.UDStrategicObjective==null?"null":row.UDStrategicObjective;
                bool hasValue = legendArray.TryGetValue(token, out value);
                if (!hasValue) {
                    legendArray.Add(token, lgdIdx);
                    lgdIdx++;
                }
            }

            Dictionary<int, string> legendColorArray = new Dictionary<int, string>();
            int lclIdx=0;
            
 legendColorArray.Add(lclIdx++, "rgba(255, 99, 132,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(54, 162, 235,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(255, 205, 86,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(75, 192, 192,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(153, 103, 255,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(185, 122, 87,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(52, 185, 182,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(185, 140, 19,0.7)");

            Dictionary<int, string> legendBorderColorArray = new Dictionary<int, string>();
            int lbclIdx=0;
            
 legendBorderColorArray.Add(lbclIdx++, "rgba(255, 99, 132,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(54, 162, 235,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(255, 205, 86,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(75, 192, 192,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(153, 103, 255,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(185, 122, 87,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(52, 185, 182,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(185, 140, 19,1)");

            foreach (var legend in legendArray) {
                var dataModel = new PortfolioBudgetvsStratDataAltSummaryDatasets();
                foreach (var p in summaryData.Where(p => (p.UDStrategicObjective==null?"null":p.UDStrategicObjective) == legend.Key)) {
                    var token = p.UDStrategicObjective==null?"null":p.UDStrategicObjective;
                    dataModel.Data.Add((double)decimal.Parse(p.BUDY==null?"0.00":p.BUDY.Value.ToString("0.00")) );
                    dataModel.Label = p.UDStrategicObjective==null?"null":p.UDStrategicObjective;
                    dataModel.BorderWidth = 1;
                    dataModel.CategoryPercentage = 0.5;
                    dataModel.Fill = true;
                    dataModel.BackgroundColor = legendColorArray[legendArray[token]];
                    dataModel.BorderColor = legendBorderColorArray[legendArray[token]];
                }

                //add Bar Chart Data Model to Bar Chart Model
                barChartModel.Datasets.Add(dataModel);
            }

            var allData = new PortfolioBudgetvsStratDataAltSummaryChartModel
            {
                Labels = barChartModel.Labels,
                Datasets = barChartModel.Datasets,
                SQLData = summaryData.ToList()
            };

            return allData;
        }
//===============================================================
// TEMPLATE END: ScenarioManager.cs.1.3.tpl
//===============================================================


//===============================================================
// TEMPLATE START: ScenarioManager.cs.1.3.tpl
//===============================================================
        public static async Task<PortfolioBudgetvsStratDataAltSummaryChartModel> GetRightStackedBarBudgetChart(int scenarioId, AipmPortfolioResultFilter filter)
        {
            var summaryData = await PortfolioBudgetvsStratDataAltSummary(scenarioId, filter);
            var barChartModel = new PortfolioBudgetvsStratDataAltSummaryChartModel();
            // Get uniq labels
            Dictionary<string, int> labelArray = new Dictionary<string, int>();
            var lblIdx=0;
            foreach (var row in summaryData)
            {
                var value = 0;
                var token = row.Year==null?"null":row.Year;
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
                var token = row.UDStrategicObjective==null?"null":row.UDStrategicObjective;
                bool hasValue = legendArray.TryGetValue(token, out value);
                if (!hasValue) {
                    legendArray.Add(token, lgdIdx);
                    lgdIdx++;
                }
            }

            Dictionary<int, string> legendColorArray = new Dictionary<int, string>();
            int lclIdx=0;
            
 legendColorArray.Add(lclIdx++, "rgba(255, 99, 132,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(54, 162, 235,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(255, 205, 86,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(75, 192, 192,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(153, 103, 255,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(185, 122, 87,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(52, 185, 182,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(185, 140, 19,0.7)");

            Dictionary<int, string> legendBorderColorArray = new Dictionary<int, string>();
            int lbclIdx=0;
            
 legendBorderColorArray.Add(lbclIdx++, "rgba(255, 99, 132,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(54, 162, 235,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(255, 205, 86,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(75, 192, 192,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(153, 103, 255,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(185, 122, 87,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(52, 185, 182,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(185, 140, 19,1)");

            foreach (var legend in legendArray) {
                var dataModel = new PortfolioBudgetvsStratDataAltSummaryDatasets();
                foreach (var p in summaryData.Where(p => (p.UDStrategicObjective==null?"null":p.UDStrategicObjective) == legend.Key)) {
                    var token = p.UDStrategicObjective==null?"null":p.UDStrategicObjective;
                    dataModel.Data.Add((double)decimal.Parse(p.BUDY==null?"0.00":p.BUDY.Value.ToString("0.00")) );
                    dataModel.Label = p.UDStrategicObjective==null?"null":p.UDStrategicObjective;
                    dataModel.BorderWidth = 1;
                    dataModel.CategoryPercentage = 0.5;
                    dataModel.Fill = true;
                    dataModel.BackgroundColor = legendColorArray[legendArray[token]];
                    dataModel.BorderColor = legendBorderColorArray[legendArray[token]];
                }

                //add Bar Chart Data Model to Bar Chart Model
                barChartModel.Datasets.Add(dataModel);
            }

            var allData = new PortfolioBudgetvsStratDataAltSummaryChartModel
            {
                Labels = barChartModel.Labels,
                Datasets = barChartModel.Datasets,
                SQLData = summaryData.ToList()
            };

            return allData;
        }
//===============================================================
// TEMPLATE END: ScenarioManager.cs.1.3.tpl
//===============================================================


//===============================================================
// TEMPLATE START: ScenarioManager.cs.1.7.tpl
//===============================================================
        public static async Task<PortfolioNPVvsCommMthDataAltSummaryChartModel> GetLeftBarLineNPVChart(int scenarioId, AipmPortfolioResultFilter filter)
        {
            var summaryData = await PortfolioNPVvsCommMthDataAltSummary(scenarioId, filter);
            var barChartModel = new PortfolioNPVvsCommMthDataAltSummaryInternalChartModel();
            // Get uniq labels
            Dictionary<string, int> fieldArray = new Dictionary<string, int>();
            var i=0;
            foreach (var row in summaryData)
            {
                var value = 0;
                var token = row.Year==null?"null":row.Year;
                bool hasValue = fieldArray.TryGetValue(row.Year, out value);
                if (!hasValue) {
                    fieldArray.Add(row.Year==null? "null": row.Year, i);
                    i++;
                }
            }

            // Add uniq labels to the chart
            foreach (var row in fieldArray)
            {
                barChartModel.Labels.Add(row.Key);
            }
            //barChartModel.Labels.Add("Current Scenario");

            Dictionary<string, int> stackArray = new Dictionary<string, int>();
            var idx=0;
            foreach (var row in summaryData)
            {
                var value = 0;
                var token = row.Year==null?"null":row.Year;
                bool hasValue = stackArray.TryGetValue(row.Year, out value);
                if (!hasValue) {
                    stackArray.Add(row.Year==null? "null": row.Year, idx);
                    idx++;
                }
            }

            foreach (var row in fieldArray)
            {
                var dataModel = new PortfolioNPVvsCommMthDataAltSummaryDatasets();
                dataModel.Type = "bar";
                foreach (var p in summaryData.Where(p => ((p.Year==null? "null": p.Year) == row.Key)))
                {
                    dataModel.Data.Add((double)decimal.Parse(p.NPV_RiskReduced==null?"0.00":p.NPV_RiskReduced.Value.ToString("0.00")) );
                    switch (fieldArray[p.Year==null ? "null" : p.Year]) {
                        case 0:
                            dataModel.Label = p.Year==null? "null":p.Year;
                            dataModel.BackgroundColor = "rgba(255, 99, 132,0.7)";
                            break;
    
                        case 1:
                            dataModel.Label = p.Year==null? "null":p.Year;
                            dataModel.BackgroundColor = "rgba(54, 162, 235,0.7)";
                            break;
    
                        case 2:
                            dataModel.Label = p.Year==null? "null":p.Year;
                            dataModel.BackgroundColor = "rgba(255, 205, 86,0.7)";
                            break;
    
                        case 3:
                            dataModel.Label = p.Year==null? "null":p.Year;
                            dataModel.BackgroundColor = "rgba(75, 192, 192,0.7)";
                            break;
    
                        case 4:
                            dataModel.Label = p.Year==null? "null":p.Year;
                            dataModel.BackgroundColor = "rgba(153, 103, 255,0.7)";
                            break;
    
                        case 5:
                            dataModel.Label = p.Year==null? "null":p.Year;
                            dataModel.BackgroundColor = "rgba(185, 122, 87,0.7)";
                            break;
    
                        case 6:
                            dataModel.Label = p.Year==null? "null":p.Year;
                            dataModel.BackgroundColor = "rgba(52, 185, 182,0.7)";
                            break;
    
                        case 7:
                            dataModel.Label = p.Year==null? "null":p.Year;
                            dataModel.BackgroundColor = "rgba(185, 140, 19,0.7)";
                            break;
                    }
                }

                //add Bar Chart Data Model to Bar Chart Model
                barChartModel.Datasets.Add(dataModel);
            }

            var allData = new PortfolioNPVvsCommMthDataAltSummaryChartModel
            {
                Labels = barChartModel.Labels,
                Datasets = barChartModel.Datasets,
                SQLData = summaryData.ToList()
            };

            return allData;
        }
//===============================================================
// TEMPLATE END: ScenarioManager.cs.1.7.tpl
//===============================================================


//===============================================================
// TEMPLATE START: ScenarioManager.cs.1.7.tpl
//===============================================================
        public static async Task<PortfolioNPVvsCommMthDataAltSummaryChartModel> GetRightBarLineNPVChart(int scenarioId, AipmPortfolioResultFilter filter)
        {
            var summaryData = await PortfolioNPVvsCommMthDataAltSummary(scenarioId, filter);
            var barChartModel = new PortfolioNPVvsCommMthDataAltSummaryInternalChartModel();
            // Get uniq labels
            Dictionary<string, int> fieldArray = new Dictionary<string, int>();
            var i=0;
            foreach (var row in summaryData)
            {
                var value = 0;
                var token = row.Year==null?"null":row.Year;
                bool hasValue = fieldArray.TryGetValue(row.Year, out value);
                if (!hasValue) {
                    fieldArray.Add(row.Year==null? "null": row.Year, i);
                    i++;
                }
            }

            // Add uniq labels to the chart
            foreach (var row in fieldArray)
            {
                barChartModel.Labels.Add(row.Key);
            }
            //barChartModel.Labels.Add("Current Scenario");

            Dictionary<string, int> stackArray = new Dictionary<string, int>();
            var idx=0;
            foreach (var row in summaryData)
            {
                var value = 0;
                var token = row.Year==null?"null":row.Year;
                bool hasValue = stackArray.TryGetValue(row.Year, out value);
                if (!hasValue) {
                    stackArray.Add(row.Year==null? "null": row.Year, idx);
                    idx++;
                }
            }

            foreach (var row in fieldArray)
            {
                var dataModel = new PortfolioNPVvsCommMthDataAltSummaryDatasets();
                dataModel.Type = "bar";
                foreach (var p in summaryData.Where(p => ((p.Year==null? "null": p.Year) == row.Key)))
                {
                    dataModel.Data.Add((double)decimal.Parse(p.NPV_RiskReduced==null?"0.00":p.NPV_RiskReduced.Value.ToString("0.00")) );
                    switch (fieldArray[p.Year==null ? "null" : p.Year]) {
                        case 0:
                            dataModel.Label = p.Year==null? "null":p.Year;
                            dataModel.BackgroundColor = "rgba(255, 99, 132,0.7)";
                            break;
    
                        case 1:
                            dataModel.Label = p.Year==null? "null":p.Year;
                            dataModel.BackgroundColor = "rgba(54, 162, 235,0.7)";
                            break;
    
                        case 2:
                            dataModel.Label = p.Year==null? "null":p.Year;
                            dataModel.BackgroundColor = "rgba(255, 205, 86,0.7)";
                            break;
    
                        case 3:
                            dataModel.Label = p.Year==null? "null":p.Year;
                            dataModel.BackgroundColor = "rgba(75, 192, 192,0.7)";
                            break;
    
                        case 4:
                            dataModel.Label = p.Year==null? "null":p.Year;
                            dataModel.BackgroundColor = "rgba(153, 103, 255,0.7)";
                            break;
    
                        case 5:
                            dataModel.Label = p.Year==null? "null":p.Year;
                            dataModel.BackgroundColor = "rgba(185, 122, 87,0.7)";
                            break;
    
                        case 6:
                            dataModel.Label = p.Year==null? "null":p.Year;
                            dataModel.BackgroundColor = "rgba(52, 185, 182,0.7)";
                            break;
    
                        case 7:
                            dataModel.Label = p.Year==null? "null":p.Year;
                            dataModel.BackgroundColor = "rgba(185, 140, 19,0.7)";
                            break;
                    }
                }

                //add Bar Chart Data Model to Bar Chart Model
                barChartModel.Datasets.Add(dataModel);
            }

            var allData = new PortfolioNPVvsCommMthDataAltSummaryChartModel
            {
                Labels = barChartModel.Labels,
                Datasets = barChartModel.Datasets,
                SQLData = summaryData.ToList()
            };

            return allData;
        }
//===============================================================
// TEMPLATE END: ScenarioManager.cs.1.7.tpl
//===============================================================


//===============================================================
// TEMPLATE START: ScenarioManager.cs.1.3.tpl
//===============================================================
        public static async Task<PortfolioNPVvsStratDataAltSummaryChartModel> GetLeftStackedBarNPVChart(int scenarioId, AipmPortfolioResultFilter filter)
        {
            var summaryData = await PortfolioNPVvsStratDataAltSummary(scenarioId, filter);
            var barChartModel = new PortfolioNPVvsStratDataAltSummaryChartModel();
            // Get uniq labels
            Dictionary<string, int> labelArray = new Dictionary<string, int>();
            var lblIdx=0;
            foreach (var row in summaryData)
            {
                var value = 0;
                var token = row.Year==null?"null":row.Year;
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
                var token = row.UDStrategicObjective==null?"null":row.UDStrategicObjective;
                bool hasValue = legendArray.TryGetValue(token, out value);
                if (!hasValue) {
                    legendArray.Add(token, lgdIdx);
                    lgdIdx++;
                }
            }

            Dictionary<int, string> legendColorArray = new Dictionary<int, string>();
            int lclIdx=0;
            
 legendColorArray.Add(lclIdx++, "rgba(255, 99, 132,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(54, 162, 235,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(255, 205, 86,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(75, 192, 192,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(153, 103, 255,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(185, 122, 87,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(52, 185, 182,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(185, 140, 19,0.7)");

            Dictionary<int, string> legendBorderColorArray = new Dictionary<int, string>();
            int lbclIdx=0;
            
 legendBorderColorArray.Add(lbclIdx++, "rgba(255, 99, 132,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(54, 162, 235,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(255, 205, 86,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(75, 192, 192,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(153, 103, 255,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(185, 122, 87,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(52, 185, 182,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(185, 140, 19,1)");

            foreach (var legend in legendArray) {
                var dataModel = new PortfolioNPVvsStratDataAltSummaryDatasets();
                foreach (var p in summaryData.Where(p => (p.UDStrategicObjective==null?"null":p.UDStrategicObjective) == legend.Key)) {
                    var token = p.UDStrategicObjective==null?"null":p.UDStrategicObjective;
                    dataModel.Data.Add((double)decimal.Parse(p.NPV_RiskReduced==null?"0.00":p.NPV_RiskReduced.Value.ToString("0.00")) );
                    dataModel.Label = p.UDStrategicObjective==null?"null":p.UDStrategicObjective;
                    dataModel.BorderWidth = 1;
                    dataModel.CategoryPercentage = 0.5;
                    dataModel.Fill = true;
                    dataModel.BackgroundColor = legendColorArray[legendArray[token]];
                    dataModel.BorderColor = legendBorderColorArray[legendArray[token]];
                }

                //add Bar Chart Data Model to Bar Chart Model
                barChartModel.Datasets.Add(dataModel);
            }

            var allData = new PortfolioNPVvsStratDataAltSummaryChartModel
            {
                Labels = barChartModel.Labels,
                Datasets = barChartModel.Datasets,
                SQLData = summaryData.ToList()
            };

            return allData;
        }
//===============================================================
// TEMPLATE END: ScenarioManager.cs.1.3.tpl
//===============================================================


//===============================================================
// TEMPLATE START: ScenarioManager.cs.1.3.tpl
//===============================================================
        public static async Task<PortfolioNPVvsStratDataAltSummaryChartModel> GetRightStackedBarNPVChart(int scenarioId, AipmPortfolioResultFilter filter)
        {
            var summaryData = await PortfolioNPVvsStratDataAltSummary(scenarioId, filter);
            var barChartModel = new PortfolioNPVvsStratDataAltSummaryChartModel();
            // Get uniq labels
            Dictionary<string, int> labelArray = new Dictionary<string, int>();
            var lblIdx=0;
            foreach (var row in summaryData)
            {
                var value = 0;
                var token = row.Year==null?"null":row.Year;
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
                var token = row.UDStrategicObjective==null?"null":row.UDStrategicObjective;
                bool hasValue = legendArray.TryGetValue(token, out value);
                if (!hasValue) {
                    legendArray.Add(token, lgdIdx);
                    lgdIdx++;
                }
            }

            Dictionary<int, string> legendColorArray = new Dictionary<int, string>();
            int lclIdx=0;
            
 legendColorArray.Add(lclIdx++, "rgba(255, 99, 132,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(54, 162, 235,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(255, 205, 86,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(75, 192, 192,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(153, 103, 255,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(185, 122, 87,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(52, 185, 182,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(185, 140, 19,0.7)");

            Dictionary<int, string> legendBorderColorArray = new Dictionary<int, string>();
            int lbclIdx=0;
            
 legendBorderColorArray.Add(lbclIdx++, "rgba(255, 99, 132,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(54, 162, 235,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(255, 205, 86,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(75, 192, 192,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(153, 103, 255,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(185, 122, 87,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(52, 185, 182,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(185, 140, 19,1)");

            foreach (var legend in legendArray) {
                var dataModel = new PortfolioNPVvsStratDataAltSummaryDatasets();
                foreach (var p in summaryData.Where(p => (p.UDStrategicObjective==null?"null":p.UDStrategicObjective) == legend.Key)) {
                    var token = p.UDStrategicObjective==null?"null":p.UDStrategicObjective;
                    dataModel.Data.Add((double)decimal.Parse(p.NPV_RiskReduced==null?"0.00":p.NPV_RiskReduced.Value.ToString("0.00")) );
                    dataModel.Label = p.UDStrategicObjective==null?"null":p.UDStrategicObjective;
                    dataModel.BorderWidth = 1;
                    dataModel.CategoryPercentage = 0.5;
                    dataModel.Fill = true;
                    dataModel.BackgroundColor = legendColorArray[legendArray[token]];
                    dataModel.BorderColor = legendBorderColorArray[legendArray[token]];
                }

                //add Bar Chart Data Model to Bar Chart Model
                barChartModel.Datasets.Add(dataModel);
            }

            var allData = new PortfolioNPVvsStratDataAltSummaryChartModel
            {
                Labels = barChartModel.Labels,
                Datasets = barChartModel.Datasets,
                SQLData = summaryData.ToList()
            };

            return allData;
        }
//===============================================================
// TEMPLATE END: ScenarioManager.cs.1.3.tpl
//===============================================================


//===============================================================
// TEMPLATE START: ScenarioManager.cs.1.2.tpl
//===============================================================
        public static async Task<PortfolioCumalRiskvsEleDataAltSummaryChartModel> GetLeftRadarElementChart(int scenarioId, AipmPortfolioResultFilter filter)
        {
            var summaryData = await PortfolioCumalRiskvsEleDataAltSummary(scenarioId, filter);

            var barChartModel = new PortfolioCumalRiskvsEleDataAltSummaryChartModel();
            barChartModel.Labels.Add("Safety RM (Thousand)");
            barChartModel.Labels.Add("Reliability RM (Thousand)");
            barChartModel.Labels.Add("Compliance RM (Thousand)");
            barChartModel.Labels.Add("Customer RM (Thousand)");
            barChartModel.Labels.Add("Financial RM (Mil)");
            barChartModel.Labels.Add("Environment RM (Thousand)");
/*
            // Get uniq labels
            Dictionary<string, int> fieldArray = new Dictionary<string, int>();
            var i=0;
            foreach (var row in summaryData)
            {
                var value = 0;
                var token = row.CommYear==null?"null":row.CommYear;
                bool hasValue = fieldArray.TryGetValue(row.CommYear, out value);
                if (!hasValue) {
                    fieldArray.Add(row.CommYear==null? "null": row.CommYear, i);
                    i++;
                }
            }
*/
            var i = 0;
            Dictionary<string, int> fieldArray = new Dictionary<string, int>();
            fieldArray.Add("Year 1", 0);
            fieldArray.Add("Year 2", 1);
            fieldArray.Add("Year 3", 2);
            fieldArray.Add("Year 4", 3);
            fieldArray.Add("Year 5", 4);
            fieldArray.Add("Year 6", 5);
            fieldArray.Add("Year 7", 6);
            fieldArray.Add("Year 8", 7);

            foreach (var row in summaryData)
            {
                var dataModel = new PortfolioCumalRiskvsEleDataAltSummaryDatasets();
                dataModel.Label = row.CommYear==null? "blank":row.CommYear;
                dataModel.Data.Add((double)decimal.Parse(row.Safety==null?"0.00":row.Safety.Value.ToString("0.0000")));
                dataModel.Data.Add((double)decimal.Parse(row.Reliability==null?"0.00":row.Reliability.Value.ToString("0.0000")));
                dataModel.Data.Add((double)decimal.Parse(row.Compliance==null?"0.00":row.Compliance.Value.ToString("0.0000")));
                dataModel.Data.Add((double)decimal.Parse(row.Customer==null?"0.00":row.Customer.Value.ToString("0.0000")));
                dataModel.Data.Add((double)decimal.Parse(row.Financial==null?"0.00":row.Financial.Value.ToString("0.0000")));
                dataModel.Data.Add((double)decimal.Parse(row.Environment==null?"0.00":row.Environment.Value.ToString("0.0000")));
                //switch (fieldArray[row.CommYear==null? "null": row.CommYear])
                switch (i)
                {
                    case 0:
                        dataModel.BorderColor = "rgba(255, 99, 132,1)";
                        dataModel.BorderWidth = 1;
                        dataModel.BackgroundColor = "rgba(255, 99, 132,0.7)";
                        dataModel.Fill = false;
                        break;

                    case 1:
                        dataModel.BorderColor = "rgba(54, 162, 235,1)";
                        dataModel.BorderWidth = 1;
                        dataModel.BackgroundColor = "rgba(54, 162, 235,0.7)";
                        dataModel.Fill = false;
                        break;

                    case 2:
                        dataModel.BorderColor = "rgba(255, 205, 86,1)";
                        dataModel.BorderWidth = 1;
                        dataModel.BackgroundColor = "rgba(255, 205, 86,0.7)";
                        dataModel.Fill = false;
                        break;

                    case 3:
                        dataModel.BorderColor = "rgba(75, 192, 192,1)";
                        dataModel.BorderWidth = 1;
                        dataModel.BackgroundColor = "rgba(75, 192, 192,0.7)";
                        dataModel.Fill = false;
                        break;

                    case 4:
                        dataModel.BorderColor = "rgba(153, 103, 255,1)";
                        dataModel.BorderWidth = 1;
                        dataModel.BackgroundColor = "rgba(153, 103, 255,0.7)";
                        dataModel.Fill = false;
                        break;

                    case 5:
                        dataModel.BorderColor = "rgba(185, 122, 87,1)";
                        dataModel.BorderWidth = 1;
                        dataModel.BackgroundColor = "rgba(185, 122, 87,0.7)";
                        dataModel.Fill = false;

                        break;

                    case 6:
                        dataModel.BorderColor = "rgba(52, 185, 182,1)";
                        dataModel.BorderWidth = 1;
                        dataModel.BackgroundColor = "rgba(52, 185, 182,0.7)";
                        dataModel.Fill = false;
                        break;

                    case 7:
                        dataModel.BorderColor = "rgba(185, 140, 19,1)";
                        dataModel.BorderWidth = 1;
                        dataModel.BackgroundColor = "rgba(185, 140, 19,0.7)";
                        dataModel.Fill = false;
                        break;
                }
                i++;
                //add Bar Chart Data Model to Bar Chart Model
                barChartModel.Datasets.Add(dataModel);
            }

            var allData = new PortfolioCumalRiskvsEleDataAltSummaryChartModel
            {
                Labels = barChartModel.Labels,
                Datasets = barChartModel.Datasets,
                SQLData = summaryData.ToList()
            };

            return allData;
        }
//===============================================================
// TEMPLATE END: ScenarioManager.cs.1.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: ScenarioManager.cs.1.2.tpl
//===============================================================
        public static async Task<PortfolioCumalRiskvsEleDataAltSummaryChartModel> GetRightRadarElementChart(int scenarioId, AipmPortfolioResultFilter filter)
        {
            var summaryData = await PortfolioCumalRiskvsEleDataAltSummary(scenarioId, filter);

            var barChartModel = new PortfolioCumalRiskvsEleDataAltSummaryChartModel();
            barChartModel.Labels.Add("Safety RM (Thousand)");
            barChartModel.Labels.Add("Reliability RM (Thousand)");
            barChartModel.Labels.Add("Compliance RM (Thousand)");
            barChartModel.Labels.Add("Customer RM (Thousand)");
            barChartModel.Labels.Add("Financial RM (Mil)");
            barChartModel.Labels.Add("Environment RM (Thousand)");
/*
            // Get uniq labels
            Dictionary<string, int> fieldArray = new Dictionary<string, int>();
            var i=0;
            foreach (var row in summaryData)
            {
                var value = 0;
                var token = row.CommYear==null?"null":row.CommYear;
                bool hasValue = fieldArray.TryGetValue(row.CommYear, out value);
                if (!hasValue) {
                    fieldArray.Add(row.CommYear==null? "null": row.CommYear, i);
                    i++;
                }
            }
*/
            var i = 0;
            Dictionary<string, int> fieldArray = new Dictionary<string, int>();
            fieldArray.Add("Year 1", 0);
            fieldArray.Add("Year 2", 1);
            fieldArray.Add("Year 3", 2);
            fieldArray.Add("Year 4", 3);
            fieldArray.Add("Year 5", 4);
            fieldArray.Add("Year 6", 5);
            fieldArray.Add("Year 7", 6);
            fieldArray.Add("Year 8", 7);

            foreach (var row in summaryData)
            {
                var dataModel = new PortfolioCumalRiskvsEleDataAltSummaryDatasets();
                dataModel.Label = row.CommYear==null? "blank":row.CommYear;
                dataModel.Data.Add((double)decimal.Parse(row.Safety==null?"0.00":row.Safety.Value.ToString("0.0000")));
                dataModel.Data.Add((double)decimal.Parse(row.Reliability==null?"0.00":row.Reliability.Value.ToString("0.0000")));
                dataModel.Data.Add((double)decimal.Parse(row.Compliance==null?"0.00":row.Compliance.Value.ToString("0.0000")));
                dataModel.Data.Add((double)decimal.Parse(row.Customer==null?"0.00":row.Customer.Value.ToString("0.0000")));
                dataModel.Data.Add((double)decimal.Parse(row.Financial==null?"0.00":row.Financial.Value.ToString("0.0000")));
                dataModel.Data.Add((double)decimal.Parse(row.Environment==null?"0.00":row.Environment.Value.ToString("0.0000")));
                //switch (fieldArray[row.CommYear==null? "null": row.CommYear])
                switch (i)
                {
                    case 0:
                        dataModel.BorderColor = "rgba(255, 99, 132,1)";
                        dataModel.BorderWidth = 1;
                        dataModel.BackgroundColor = "rgba(255, 99, 132,0.7)";
                        dataModel.Fill = false;
                        break;

                    case 1:
                        dataModel.BorderColor = "rgba(54, 162, 235,1)";
                        dataModel.BorderWidth = 1;
                        dataModel.BackgroundColor = "rgba(54, 162, 235,0.7)";
                        dataModel.Fill = false;
                        break;

                    case 2:
                        dataModel.BorderColor = "rgba(255, 205, 86,1)";
                        dataModel.BorderWidth = 1;
                        dataModel.BackgroundColor = "rgba(255, 205, 86,0.7)";
                        dataModel.Fill = false;
                        break;

                    case 3:
                        dataModel.BorderColor = "rgba(75, 192, 192,1)";
                        dataModel.BorderWidth = 1;
                        dataModel.BackgroundColor = "rgba(75, 192, 192,0.7)";
                        dataModel.Fill = false;
                        break;

                    case 4:
                        dataModel.BorderColor = "rgba(153, 103, 255,1)";
                        dataModel.BorderWidth = 1;
                        dataModel.BackgroundColor = "rgba(153, 103, 255,0.7)";
                        dataModel.Fill = false;
                        break;

                    case 5:
                        dataModel.BorderColor = "rgba(185, 122, 87,1)";
                        dataModel.BorderWidth = 1;
                        dataModel.BackgroundColor = "rgba(185, 122, 87,0.7)";
                        dataModel.Fill = false;

                        break;

                    case 6:
                        dataModel.BorderColor = "rgba(52, 185, 182,1)";
                        dataModel.BorderWidth = 1;
                        dataModel.BackgroundColor = "rgba(52, 185, 182,0.7)";
                        dataModel.Fill = false;
                        break;

                    case 7:
                        dataModel.BorderColor = "rgba(185, 140, 19,1)";
                        dataModel.BorderWidth = 1;
                        dataModel.BackgroundColor = "rgba(185, 140, 19,0.7)";
                        dataModel.Fill = false;
                        break;
                }
                i++;
                //add Bar Chart Data Model to Bar Chart Model
                barChartModel.Datasets.Add(dataModel);
            }

            var allData = new PortfolioCumalRiskvsEleDataAltSummaryChartModel
            {
                Labels = barChartModel.Labels,
                Datasets = barChartModel.Datasets,
                SQLData = summaryData.ToList()
            };

            return allData;
        }
//===============================================================
// TEMPLATE END: ScenarioManager.cs.1.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: ScenarioManager.cs.1.3.tpl
//===============================================================
        public static async Task<PortfolioOSRiskDataAltSummaryChartModel> GetLeftStackedBarOSRiskChart(int scenarioId, AipmPortfolioResultFilter filter)
        {
            var summaryData = await PortfolioOSRiskDataAltSummary(scenarioId, filter);
            var barChartModel = new PortfolioOSRiskDataAltSummaryChartModel();
            // Get uniq labels
            Dictionary<string, int> labelArray = new Dictionary<string, int>();
            var lblIdx=0;
            foreach (var row in summaryData)
            {
                var value = 0;
                var token = row.Year==null?"null":row.Year;
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
                var token = row.Description==null?"null":row.Description;
                bool hasValue = legendArray.TryGetValue(token, out value);
                if (!hasValue) {
                    legendArray.Add(token, lgdIdx);
                    lgdIdx++;
                }
            }

            Dictionary<int, string> legendColorArray = new Dictionary<int, string>();
            int lclIdx=0;
            
 legendColorArray.Add(lclIdx++, "rgba(255, 99, 132,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(54, 162, 235,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(255, 205, 86,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(75, 192, 192,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(153, 103, 255,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(185, 122, 87,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(52, 185, 182,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(185, 140, 19,0.7)");

            Dictionary<int, string> legendBorderColorArray = new Dictionary<int, string>();
            int lbclIdx=0;
            
 legendBorderColorArray.Add(lbclIdx++, "rgba(255, 99, 132,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(54, 162, 235,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(255, 205, 86,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(75, 192, 192,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(153, 103, 255,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(185, 122, 87,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(52, 185, 182,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(185, 140, 19,1)");

            foreach (var legend in legendArray) {
                var dataModel = new PortfolioOSRiskDataAltSummaryDatasets();
                foreach (var p in summaryData.Where(p => (p.Description==null?"null":p.Description) == legend.Key)) {
                    var token = p.Description==null?"null":p.Description;
                    dataModel.Data.Add((double)decimal.Parse(p.Value==null?"0.00":p.Value.Value.ToString("0.00")) );
                    dataModel.Label = p.Description==null?"null":p.Description;
                    dataModel.BorderWidth = 1;
                    dataModel.CategoryPercentage = 0.5;
                    dataModel.Fill = true;
                    dataModel.BackgroundColor = legendColorArray[legendArray[token]];
                    dataModel.BorderColor = legendBorderColorArray[legendArray[token]];
                }

                //add Bar Chart Data Model to Bar Chart Model
                barChartModel.Datasets.Add(dataModel);
            }

            var allData = new PortfolioOSRiskDataAltSummaryChartModel
            {
                Labels = barChartModel.Labels,
                Datasets = barChartModel.Datasets,
                SQLData = summaryData.ToList()
            };

            return allData;
        }
//===============================================================
// TEMPLATE END: ScenarioManager.cs.1.3.tpl
//===============================================================


//===============================================================
// TEMPLATE START: ScenarioManager.cs.1.3.tpl
//===============================================================
        public static async Task<PortfolioOSRiskDataAltSummaryChartModel> GetRightStackedBarOSRiskChart(int scenarioId, AipmPortfolioResultFilter filter)
        {
            var summaryData = await PortfolioOSRiskDataAltSummary(scenarioId, filter);
            var barChartModel = new PortfolioOSRiskDataAltSummaryChartModel();
            // Get uniq labels
            Dictionary<string, int> labelArray = new Dictionary<string, int>();
            var lblIdx=0;
            foreach (var row in summaryData)
            {
                var value = 0;
                var token = row.Year==null?"null":row.Year;
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
                var token = row.Description==null?"null":row.Description;
                bool hasValue = legendArray.TryGetValue(token, out value);
                if (!hasValue) {
                    legendArray.Add(token, lgdIdx);
                    lgdIdx++;
                }
            }

            Dictionary<int, string> legendColorArray = new Dictionary<int, string>();
            int lclIdx=0;
            
 legendColorArray.Add(lclIdx++, "rgba(255, 99, 132,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(54, 162, 235,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(255, 205, 86,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(75, 192, 192,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(153, 103, 255,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(185, 122, 87,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(52, 185, 182,0.7)");
 legendColorArray.Add(lclIdx++, "rgba(185, 140, 19,0.7)");

            Dictionary<int, string> legendBorderColorArray = new Dictionary<int, string>();
            int lbclIdx=0;
            
 legendBorderColorArray.Add(lbclIdx++, "rgba(255, 99, 132,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(54, 162, 235,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(255, 205, 86,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(75, 192, 192,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(153, 103, 255,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(185, 122, 87,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(52, 185, 182,1)");
 legendBorderColorArray.Add(lbclIdx++, "rgba(185, 140, 19,1)");

            foreach (var legend in legendArray) {
                var dataModel = new PortfolioOSRiskDataAltSummaryDatasets();
                foreach (var p in summaryData.Where(p => (p.Description==null?"null":p.Description) == legend.Key)) {
                    var token = p.Description==null?"null":p.Description;
                    dataModel.Data.Add((double)decimal.Parse(p.Value==null?"0.00":p.Value.Value.ToString("0.00")) );
                    dataModel.Label = p.Description==null?"null":p.Description;
                    dataModel.BorderWidth = 1;
                    dataModel.CategoryPercentage = 0.5;
                    dataModel.Fill = true;
                    dataModel.BackgroundColor = legendColorArray[legendArray[token]];
                    dataModel.BorderColor = legendBorderColorArray[legendArray[token]];
                }

                //add Bar Chart Data Model to Bar Chart Model
                barChartModel.Datasets.Add(dataModel);
            }

            var allData = new PortfolioOSRiskDataAltSummaryChartModel
            {
                Labels = barChartModel.Labels,
                Datasets = barChartModel.Datasets,
                SQLData = summaryData.ToList()
            };

            return allData;
        }
//===============================================================
// TEMPLATE END: ScenarioManager.cs.1.3.tpl
//===============================================================


//===============================================================
// TEMPLATE START: AipmPortfolioScenarioManager.cs.1.3.tpl
//===============================================================
        public static async Task<List<Dictionary<string, object>>> ResultSystemProjectGroupBy(int scenarioId, AipmPortfolioResultFilter filter, bool alternate = false)
        {
            //MR&HPA
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
                where += " AND b.\"UDIBRNarrativeMR\" IN ('" + subObjective + "')";
            }
            
            if (filter.SubObjectiveHPA != null && filter.SubObjectiveHPA.Count > 0)
            {
                var subOjectiveHPA = string.Join("', '", filter.SubObjectiveHPA);
                where += " AND b.\"UDIBRNarrativeHPA\" IN ('" + subOjectiveHPA + "')";
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
        
            var commandText = $"SELECT \"UDStrategicObjective\" AS \"udStrategicObjective\", \"UDIBRNarrativeMR\" AS \"uDIBRNarrativeMR\", \"UDIBRNarrativeHPA\" AS \"uDIBRNarrativeHPA\", \"UDVoltagekV\" AS \"udVoltagekV\", COUNT(*) AS \"total_Project\", SUM (\"Budget_Before_Revised\") AS \"budget_Before_Revised\", SUM(\"Total_Budget\") AS \"total_Budget\", SUM(\"nRisk_Reduced\") AS \"risk_Reduced\", SUM(\"Project_Score\") AS \"project_Score\", SUM(COALESCE(\"nTCO_Opex\",0)) AS \"tcO_Opex\", SUM(COALESCE(\"nTCO_TotalProjectCost\",0 )) AS \"tcO_TotalProjectCost\", SUM(COALESCE(\"NPV_RiskReduced\" ,0)) AS \"npV_RiskReduced\", SUM(\"BUDY1\") AS \"budY1\", SUM(\"BUDY2\") AS \"budY2\", SUM(\"BUDY3\") AS \"budY3\", SUM(\"BUDY4\") AS \"budY4\", SUM(\"BUDY5\") AS \"budY5\", SUM(\"BUDY6\") AS \"budY6\", SUM(\"BUDY7\") AS \"budY7\", SUM(\"BUDY8\") AS \"budY8\" FROM (SELECT b.\"UDStrategicObjective\", b.\"UDIBRNarrativeMR\", b.\"UDIBRNarrativeHPA\", b.\"UDVoltagekV\", a.\"Budget_Before_Revised\", a.\"Total_Budget\", a.\"Risk_Reduced\" * 1000000 AS \"nRisk_Reduced\", a.\"Project_Score\", a.\"TCO_Opex\" * 1000000 AS \"nTCO_Opex\" , a.\"TCO_TotalProjectCost\" *1000000 AS \"nTCO_TotalProjectCost\" , a.\"NPV_RiskReduced\" , a.\"BUDY1\", a.\"BUDY2\", a.\"BUDY3\", a.\"BUDY4\", a.\"BUDY5\", a.\"BUDY6\", a.\"BUDY7\", a.\"BUDY8\" FROM public.\"PortfolioOpt_Approved_Proj\" AS a INNER JOIN public.\"MP_Project\" AS b ON a.\"Project_ID\" = b.\"Id\" INNER JOIN public.\"CFG_GeoState\" AS c ON b.\"UDCFG_GeoStateCode\" = c.\"Code\" INNER JOIN public.\"CFG_BusinessArea\" AS d ON b.\"UDCFG_BusinessAreaCode\" = d.\"AreaCode\" WHERE a.\"Plan_ID\"=(@id){where + sortBy}) AS f GROUP BY \"udStrategicObjective\", \"uDIBRNarrativeMR\", \"uDIBRNarrativeHPA\", \"udVoltagekV\"";
            commandText += "ORDER BY \"UDStrategicObjective\", \"UDIBRNarrativeMR\", \"UDIBRNarrativeHPA\", \"UDVoltagekV\"";

            var parameters = new { id = scenarioId };
            var result = await DbHelper.ExecuteDql(commandText, parameters);
        
            return result.ToList();
        }
//===============================================================
// TEMPLATE END: AipmPortfolioScenarioManager.cs.1.3.tpl
//===============================================================


//===============================================================
// TEMPLATE START: AipmPortfolioScenarioManager.cs.2.2.tpl
//===============================================================
        public static async Task<List<Dictionary<string, object>>> ResultRejectedProjectGroupBy(int scenarioId, AipmPortfolioResultFilter filter, bool alternate = false)
        {
            //MR&HPA

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
                where += " AND b.\"UDIBRNarrativeMR\" IN ('" + subObjective + "')";
            }
            
            if (filter.SubObjectiveHPA != null && filter.SubObjectiveHPA.Count > 0)
            {
                var subOjectiveHPA = string.Join("', '", filter.SubObjectiveHPA);
                where += " AND b.\"UDIBRNarrativeHPA\" IN ('" + subOjectiveHPA + "')";
            }
        
        	if (filter.Voltage != null && filter.Voltage.Count > 0)
        	{
        		var voltage = string.Join("', '", filter.Voltage);
        		where += " AND b.\"UDVoltagekV\" IN ('" + voltage + "')";
        	}
        
        	if (alternate)
        	{
        		where += " AND (a.\"Replace\" IS NULL OR a.\"Replace\" = false) ";
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
        
            var commandText = $"SELECT \"UDStrategicObjective\" AS \"udStrategicObjective\", \"UDIBRNarrativeMR\" AS \"uDIBRNarrativeMR\", \"UDIBRNarrativeHPA\" AS \"uDIBRNarrativeHPA\", \"UDVoltagekV\" AS \"udVoltagekV\", COUNT(*) AS \"total_Project\", SUM(\"Budget_Before_Revised\") AS \"budget_Before_Revised\", SUM(\"Total_Budget\") AS \"total_Budget\", SUM(\"nRisk_Reduced\") AS \"risk_Reduced\", SUM(COALESCE(\"nTCO_Opex\",0)) AS \"tcO_Opex\", SUM(COALESCE(\"nTCO_TotalProjectCost\", 0)) AS \"tcO_TotalProjectCost\", SUM(COALESCE(\"NPV_RiskReduced\", 0)) AS \"npV_RiskReduced\", SUM(\"Project_Score\") AS \"project_Score\" FROM (SELECT b.\"UDStrategicObjective\", b.\"UDIBRNarrativeMR\", b.\"UDIBRNarrativeHPA\", b.\"UDVoltagekV\", a.\"Budget_Before_Revised\", a.\"Total_Budget\", a.\"Risk_Reduced\" * 1000000 AS \"nRisk_Reduced\", a.\"Project_Score\", a.\"TCO_Opex\" * 1000000 AS \"nTCO_Opex\", a.\"TCO_TotalProjectCost\" * 1000000 AS \"nTCO_TotalProjectCost\", a.\"NPV_RiskReduced\" FROM public.\"PortfolioOpt_Rejected_Proj\" AS a INNER JOIN public.\"MP_Project\" AS b ON a.\"Project_ID\" = b.\"Id\" INNER JOIN public.\"CFG_GeoState\" AS c ON b.\"UDCFG_GeoStateCode\" = c.\"Code\" INNER JOIN public.\"CFG_BusinessArea\" AS d ON b.\"UDCFG_BusinessAreaCode\" = d.\"AreaCode\" WHERE a.\"Plan_ID\"=(@id){where}) AS f GROUP BY \"udStrategicObjective\", \"uDIBRNarrativeMR\", \"uDIBRNarrativeHPA\", \"udVoltagekV\"{sortBy}";
            commandText += "ORDER BY \"UDStrategicObjective\", \"UDIBRNarrativeMR\", \"UDIBRNarrativeHPA\", \"UDVoltagekV\"";
        
            var parameters = new { id = scenarioId };
            var result = await DbHelper.ExecuteDql(commandText, parameters);
        
            return result.ToList();
        }

//===============================================================
// TEMPLATE END: AipmPortfolioScenarioManager.cs.2.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: AipmPortfolioScenarioManager.cs.1.1.tpl
//===============================================================
        public static async Task<List<Dictionary<string, object>>> ResultSystemProjectGroupBy2(int scenarioId, AipmPortfolioResultFilter filter, bool alternate = false)
        {
            //MR&HPA
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
                where += " AND b.\"UDIBRNarrativeMR\" IN ('" + subObjective + "')";
            }
            
            if (filter.SubObjectiveHPA != null && filter.SubObjectiveHPA.Count > 0)
            {
                var subOjectiveHPA = string.Join("', '", filter.SubObjectiveHPA);
                where += " AND b.\"UDIBRNarrativeHPA\" IN ('" + subOjectiveHPA + "')";
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
        
            var commandText = $"SELECT \"UDStrategicObjective\" AS \"udStrategicObjective\", \"UDVoltagekV\" AS \"udVoltagekV\", COUNT(*) AS \"total_Project\", SUM (\"Budget_Before_Revised\") AS \"budget_Before_Revised\", SUM(\"Total_Budget\") AS \"total_Budget\", SUM(\"nRisk_Reduced\") AS \"risk_Reduced\", SUM(\"Project_Score\") AS \"project_Score\", SUM(COALESCE(\"nTCO_Opex\",0)) AS \"tcO_Opex\", SUM(COALESCE(\"nTCO_TotalProjectCost\",0 )) AS \"tcO_TotalProjectCost\", SUM(COALESCE(\"NPV_RiskReduced\" ,0)) AS \"npV_RiskReduced\", SUM(\"BUDY1\") AS \"budY1\", SUM(\"BUDY2\") AS \"budY2\", SUM(\"BUDY3\") AS \"budY3\", SUM(\"BUDY4\") AS \"budY4\", SUM(\"BUDY5\") AS \"budY5\", SUM(\"BUDY6\") AS \"budY6\", SUM(\"BUDY7\") AS \"budY7\", SUM(\"BUDY8\") AS \"budY8\" FROM (SELECT b.\"UDStrategicObjective\", b.\"UDVoltagekV\", a.\"Budget_Before_Revised\", a.\"Total_Budget\", a.\"Risk_Reduced\" * 1000000 AS \"nRisk_Reduced\", a.\"Project_Score\", a.\"TCO_Opex\" * 1000000 AS \"nTCO_Opex\" , a.\"TCO_TotalProjectCost\" *1000000 AS \"nTCO_TotalProjectCost\" , a.\"NPV_RiskReduced\" , a.\"BUDY1\", a.\"BUDY2\", a.\"BUDY3\", a.\"BUDY4\", a.\"BUDY5\", a.\"BUDY6\", a.\"BUDY7\", a.\"BUDY8\" FROM public.\"PortfolioOpt_Approved_Proj\" AS a INNER JOIN public.\"MP_Project\" AS b ON a.\"Project_ID\" = b.\"Id\" INNER JOIN public.\"CFG_GeoState\" AS c ON b.\"UDCFG_GeoStateCode\" = c.\"Code\" INNER JOIN public.\"CFG_BusinessArea\" AS d ON b.\"UDCFG_BusinessAreaCode\" = d.\"AreaCode\" WHERE a.\"Plan_ID\"=(@id){where + sortBy}) AS f GROUP BY \"udStrategicObjective\" , \"udVoltagekV\"";

            var parameters = new { id = scenarioId };
            var result = await DbHelper.ExecuteDql(commandText, parameters);
        
            return result.ToList();
        }
//===============================================================
// TEMPLATE END: AipmPortfolioScenarioManager.cs.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: AipmPortfolioScenarioManager.cs.2.1.tpl
//===============================================================
        public static async Task<List<Dictionary<string, object>>> ResultRejectedProjectGroupBy2(int scenarioId, AipmPortfolioResultFilter filter, bool alternate = false)
        {
            //MR&HPA

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
                where += " AND b.\"UDIBRNarrativeMR\" IN ('" + subObjective + "')";
            }
            
            if (filter.SubObjectiveHPA != null && filter.SubObjectiveHPA.Count > 0)
            {
                var subOjectiveHPA = string.Join("', '", filter.SubObjectiveHPA);
                where += " AND b.\"UDIBRNarrativeHPA\" IN ('" + subOjectiveHPA + "')";
            }
        
        	if (filter.Voltage != null && filter.Voltage.Count > 0)
        	{
        		var voltage = string.Join("', '", filter.Voltage);
        		where += " AND b.\"UDVoltagekV\" IN ('" + voltage + "')";
        	}
        
        	if (alternate)
        	{
        		where += " AND (a.\"Replace\" IS NULL OR a.\"Replace\" = false) ";
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
        
            var commandText = $"SELECT \"UDStrategicObjective\" AS \"udStrategicObjective\", \"UDVoltagekV\" AS \"udVoltagekV\", COUNT(*) AS \"total_Project\", SUM(\"Budget_Before_Revised\") AS \"budget_Before_Revised\", SUM(\"Total_Budget\") AS \"total_Budget\", SUM(\"nRisk_Reduced\") AS \"risk_Reduced\", SUM(COALESCE(\"nTCO_Opex\",0)) AS \"tcO_Opex\", SUM(COALESCE(\"nTCO_TotalProjectCost\", 0)) AS \"tcO_TotalProjectCost\", SUM(COALESCE(\"NPV_RiskReduced\", 0)) AS \"npV_RiskReduced\", SUM(\"Project_Score\") AS \"project_Score\" FROM (SELECT b.\"UDStrategicObjective\", b.\"UDVoltagekV\", a.\"Budget_Before_Revised\", a.\"Total_Budget\", a.\"Risk_Reduced\" * 1000000 AS \"nRisk_Reduced\", a.\"Project_Score\", a.\"TCO_Opex\" * 1000000 AS \"nTCO_Opex\", a.\"TCO_TotalProjectCost\" * 1000000 AS \"nTCO_TotalProjectCost\", a.\"NPV_RiskReduced\" FROM public.\"PortfolioOpt_Rejected_Proj\" AS a INNER JOIN public.\"MP_Project\" AS b ON a.\"Project_ID\" = b.\"Id\" INNER JOIN public.\"CFG_GeoState\" AS c ON b.\"UDCFG_GeoStateCode\" = c.\"Code\" INNER JOIN public.\"CFG_BusinessArea\" AS d ON b.\"UDCFG_BusinessAreaCode\" = d.\"AreaCode\" WHERE a.\"Plan_ID\"=(@id){where}) AS f GROUP BY \"udStrategicObjective\", \"udVoltagekV\"{sortBy}";
        
            var parameters = new { id = scenarioId };
            var result = await DbHelper.ExecuteDql(commandText, parameters);
        
            return result.ToList();
        }

//===============================================================
// TEMPLATE END: AipmPortfolioScenarioManager.cs.2.1.tpl
//===============================================================

        /* GENCODE:MARKER:1:END */

        public static async Task<List<Dictionary<string, object>>> GetBudgetConfig(int scenarioId, int numberOfYears, string state)
        {
            /*
             * [
             *  { 
             *      "voltage": "All Voltages", 
             *      "config": [
             *          {
             *              "state": "Perlis", 
             *              "businessArea": "", 
             *              "minBudY1": 0,
             *              "maxBudY1": 0,
             *              ...
             *          },
             *          {
             *              "state": "Perlis", 
             *              "businessArea": "", 
             *              "minBudY1": 0,
             *              "maxBudY1": 0,
             *              ...
             *          },
             *          ...
             *      ]
             *  },
             *  { 
             *      "voltage": "6.6 kV", 
             *      "config": [
             *          {
             *              "state": "Perlis", 
             *              "businessArea": "", 
             *              "minBudY1": 0,
             *              "maxBudY1": 0,
             *              ...
             *          },
             *          {
             *              "state": "Perlis", 
             *              "businessArea": "", 
             *              "minBudY1": 0,
             *              "maxBudY1": 0,
             *              ...
             *          },
             *          ...
             *      ]
             *  },
             *  ...
             * ]
             * 
             * SELECT s."Code" AS "stateCode", s."Name" AS "state", b."AreaName" AS "businessArea", b."AreaCode" AS "areaCode", 
             * c."MinBudY1" AS "minBudY1", c."MaxBudY1" AS "maxBudY1", c."MinBudY2" AS "minBudY2", c."MaxBudY2" AS "maxBudY2", ...
             * FROM public."CFG_GeoState" AS s
             * INNER JOIN public."CFG_BusinessArea" AS b ON b."CFG_GeoStateCode" = s."Code"
             * LEFT JOIN public."AIPM_PortfolioBudgetConfig" AS c ON c."ScenarioId" = (@scenarioId) AND c."Voltage" = (@voltage) AND c."AreaCode" = b."AreaCode"
             * WHERE s."Code" = (@state)
             */

            List<Dictionary<string, object>> dictResp = new List<Dictionary<string, object>>();
            string[] voltageArr = new string[5] { "All Voltages", "6.6 kV", "11 kV", "22 kV", "33 kV" };
            string budgetTableName = "public.\"AIPM_PortfolioBudgetConfig\"";

            foreach (string voltage in voltageArr)
            {
                var commandText = "SELECT s.\"Name\" AS \"state\", b.\"AreaName\" AS \"businessArea\", b.\"AreaCode\" AS \"areaCode\", s.\"Code\" AS \"StateCode\", c.\"Id\" AS \"configId\"";

                // Append select min/max year column
                for (int i = 0; i < numberOfYears; i++)
                {
                    commandText += $", c.\"MinBudY{(i + 1)}\" AS \"minBudY{(i + 1)}\", c.\"MaxBudY{(i + 1)}\" AS \"maxBudY{(i + 1)}\"" +
                        $", c.\"MinBudY{(i + 1)}\" AS \"oriminBudY{(i + 1)}\", c.\"MaxBudY{(i + 1)}\" AS \"orimaxBudY{(i + 1)}\"";
                }

                commandText += " FROM public.\"CFG_GeoState\" AS s " +
                    " INNER JOIN public.\"CFG_BusinessArea\" AS b ON b.\"CFG_GeoStateCode\" = s.\"Code\" " +
                    $" LEFT JOIN {budgetTableName} AS c ON c.\"ScenarioId\" = (@scenarioId) AND c.\"Voltage\" = (@voltage) AND c.\"AreaCode\" = b.\"AreaCode\"";

                var parameters = new DynamicParameters();
                if (state == "national")
                {
                    // for national, only state
                    var commandText2 = "union SELECT s.\"Name\" AS \"state\", null AS \"businessArea\", null AS \"areaCode\", s.\"Code\" AS \"StateCode\", c.\"Id\" AS \"configId\"";

                    // Append select min/max year column
                    for (int i = 0; i < numberOfYears; i++)
                    {
                        commandText2 += $", c.\"MinBudY{(i + 1)}\" AS \"minBudY{(i + 1)}\", c.\"MaxBudY{(i + 1)}\" AS \"maxBudY{(i + 1)}\"" +
                            $", c.\"MinBudY{(i + 1)}\" AS \"oriminBudY{(i + 1)}\", c.\"MaxBudY{(i + 1)}\" AS \"orimaxBudY{(i + 1)}\"";
                    }

                    commandText2 += " FROM public.\"CFG_GeoState\" AS s " +
                        " INNER JOIN public.\"CFG_BusinessArea\" AS b ON b.\"CFG_GeoStateCode\" = s.\"Code\" " +
                        $" LEFT JOIN {budgetTableName} AS c ON c.\"ScenarioId\" = (@scenarioId2) AND c.\"Voltage\" = (@voltage2) AND c.\"StateCode\" = b.\"CFG_GeoStateCode\" AND c.\"AreaCode\" is null";
                    int scenarioId2 = scenarioId;
                    string voltage2 = voltage;

                    commandText += commandText2 + " ORDER BY \"state\", \"businessArea\"";
                    parameters.Add("@scenarioId", scenarioId);
                    parameters.Add("@voltage", voltage);
                    parameters.Add("@state", state);
                    parameters.Add("@scenarioId2", scenarioId);
                    parameters.Add("@voltage2", voltage);
                }
                else
                {
                    commandText += " WHERE s.\"Code\" = (@state) ORDER BY \"state\", \"businessArea\"";
                    parameters.Add("@scenarioId", scenarioId);
                    parameters.Add("@voltage", voltage);
                    parameters.Add("@state", state);
                }


                var result = (await DbHelper.ExecuteDql(commandText, parameters, false)).ToList();
                dictResp.Add(new Dictionary<string, object>() {
                    { "voltage", voltage },
                    { "config", result }
                });
            }
            return dictResp;

            /*   Test
            string[] arrState = new string[] { "JHR", "PLS", "MLK", "SGR" };
            Random rand = new Random(10000);
            foreach (string voltage in voltageArr)
            {
                // query result
                List<Dictionary<string, object>> dictConfig = new List<Dictionary<string, object>>();

                foreach (string s in arrState)
                {
                    for (int i = 0; i < 10; i++)
                    {
                        Dictionary<string, object> dictRow = new Dictionary<string, object>() {
                            { "state", s }, { "businessArea", $"BA{(i+1)}" }
                        };

                        // Add year column
                        for (int j = 0; j < numOfYears; j++)
                        {
                            int min = rand.Next(1000000);
                            dictRow.Add($"minBudY{(j + 1)}", min);
                            dictRow.Add($"maxBudY{(j + 1)}", rand.Next(min + 1, 10000000));
                        }
                        dictConfig.Add(dictRow);
                    }
                }

                dictResp.Add(new Dictionary<string, object>() {
                    { "voltage", voltage },
                    { "config", dictConfig }
                });
            }

            return dictResp;
            //*/
        }
        public static async Task<bool> SaveBudgetConfig(int scenarioId, int numberOfYears, List<Dictionary<string, object>> data)
        {
            var sqlStmt = "";
            double _value = 0;

            foreach (var row in data)
            {
                if (int.TryParse(row["configId"]?.ToString() ?? "", out int configId) && configId != 0)
                {
                    string upList = "";

                    for (int i = 1; i <= numberOfYears; i++)
                    {
                        if (double.TryParse(row[$"minBudY{i}"]?.ToString() ?? "", out _value))
                        {
                            upList += $"{(upList == "" ? "" : ", ")} \"MinBudY{i}\"={_value}";
                        }
                        else { 
                            upList += $"{(upList == "" ? "" : ", ")} \"MinBudY{i}\"=NULL";
                        }

                        if (double.TryParse(row[$"maxBudY{i}"]?.ToString() ?? "", out _value))
                        {
                            upList += $"{(upList == "" ? "" : ", ")} \"MaxBudY{i}\"={_value}";
                        }
                        else
                        {
                            upList += $"{(upList == "" ? "" : ", ")} \"MaxBudY{i}\"=NULL";
                        }
                    }

                    // Create record
                    sqlStmt += $"UPDATE public.\"AIPM_PortfolioBudgetConfig\" SET {upList} WHERE \"Id\"={configId};";
                }
                else
                {
                    string colList = "\"ScenarioId\", \"Voltage\", \"AreaCode\", \"StateCode\"";
                    //string valList = $"{scenarioId},'{row["voltage"].ToString()}','{row["areaCode"].ToString()}'";
                    string valList = $"{scenarioId}, '{row["voltage"]}', {(row["areaCode"] == null ? "NULL" : $"'{row["areaCode"]}'")}, '{row["StateCode"].ToString()}'";
                    for (int i = 1; i <= numberOfYears; i++)
                    {
                        colList += $", \"MinBudY{i}\", \"MaxBudY{i}\"";
                        valList += $",{GetBudgetValue(row, i, "min")?.ToString() ?? "NULL"},{GetBudgetValue(row, i, "max")?.ToString() ?? "NULL"}";
                    }

                    sqlStmt += $"INSERT INTO public.\"AIPM_PortfolioBudgetConfig\"({colList}) VALUES ({valList});";
                }
            }

            if (data.Count != 0 && sqlStmt != "")
                return await DbHelper.ExecuteDml(sqlStmt, null);

            return true;// response;
        }
        private static double? GetBudgetValue(Dictionary<string, object> data, int year, string type = "min")
        {
            if (data is Dictionary<string, object> && data.ContainsKey($"{type}BudY{year}") && data[$"{type}BudY{year}"] != null && double.TryParse(data[$"{type}BudY{year}"].ToString(), out double _value))
            {
                return _value;
            }
            return null;
        }

    }
}