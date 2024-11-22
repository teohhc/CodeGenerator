using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using TNB.ApiGateways.Web.Admin.HttpAggregator.Infrastructure;
using TNB.ApiGateways.Web.Admin.HttpAggregator.Models;
using Tts.Business.Entities.Aipm;
using Tts.Business.Helpers;
using Tts.Business.Logic.Aipm;
using Tts.Business.ViewModels.Aipm;
using Tts.Business.ViewModels;
using Newtonsoft.Json;
using System.Net.Http;
using System.Text;
using System;
using System.Collections.Generic;
using TNB.ApiGateways.Web.Admin.HttpAggregator.Security;
using TNB.Services.INet.Users;

namespace Web.Admin.HttpAggregator.Controllers.Tts.Aipm
{
    [Route("[controller]")]
    [ApiController]
    public class AipmCostOptimizationScenarioController : ControllerBase
    {
        private readonly IWorkContext _workContext;
        private readonly IPermissionService _permissionService;
        public AipmCostOptimizationScenarioController(
            IWorkContext workContext,
            IPermissionService permissionService
            )
        {
            _workContext = workContext;
            _permissionService = permissionService;
        }

        [HttpPost("List")]
        public async Task<IActionResult> List(AipmBudgetCostOptimizationScenarioSearch search)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ViewHPE))
                return Unauthorized();

            var results = await AipmCostOptimizationScenarioManager.List(search, _workContext.Username);
            return Ok(new ResponseModel<Pagination<AipmCostOptimizationScenario>>
            {
                Success = true,
                Entity = results
            });
        }

        [HttpPost("ImportList")]
        public async Task<IActionResult> ImportList(AipmBudgetCostOptimizationScenarioSearch search)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ViewPO))
                return Unauthorized();

            var results = await AipmCostOptimizationScenarioManager.ImportList(search);
            return Ok(new ResponseModel<Pagination<AipmCostOptimizationScenario>>
            {
                Success = true,
                Entity = results
            });
        }

        [HttpPost("ListWithResult")]
        public async Task<IActionResult> ListWithResult(AipmBudgetCostOptimizationScenarioSearch search)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ManageBCO))
                return Unauthorized();

            var results = await AipmCostOptimizationScenarioManager.ListWithResult(search, _workContext.Username);
            return Ok(new ResponseModel<Pagination<AipmCostOptimizationScenario>>
            {
                Success = true,
                Entity = results
            });
        }

        [HttpPost("Create")]
        public virtual async Task<IActionResult> Create(AipmCostOptimizationScenario model)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ManageHPE))
                return Unauthorized();

            model.CreatedBy = _workContext.Username;
            model.ModifiedBy = _workContext.Username;
            model.CreatedDt = DateTimeHelper.ToLocalDateTime();
            model.ModifiedDt = DateTimeHelper.ToLocalDateTime();

            if (model.IsNational == false)
            {
                if (model.StateCode == null || model.StateCode == "")
                {
                    return Ok(new ResponseModel<string>
                    {
                        Success = false,
                        ErrorMessage = "State cannot be empty",
                        Entity = ""
                    });
                }
            }

            await AipmCostOptimizationScenarioManager.Create(model);
            var details = await AipmCostOptimizationScenarioManager.ReadByName(model.ScenarioName);
            //AipmCostOptimizationScenarioManager.RunSaveScenario(details.Id);
            return Ok(new ResponseModel<AipmCostOptimizationScenario>
            {
                Success = true,
                Entity = details
            });
        }

        [HttpPost("Delete/{id}")]
        public virtual async Task<IActionResult> Delete(int id)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ManageHPE))
                return Unauthorized();

            var returnData = await AipmCostOptimizationScenarioManager.Delete(id);
            return Ok(new ResponseModel
            {
                Success = returnData,
                ErrorMessage = ""
            });
        }

        [HttpPost("GetById/{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ViewHPE))
                return Unauthorized();

            var results = await AipmCostOptimizationScenarioManager.ReadById(id);
            var returnData = new ResponseModel<AipmCostOptimizationScenario>
            {
                Success = true,
                Editable = results.CreatedBy == _workContext.Username,
                Entity = results
            };
            return Ok(returnData);
        }

        [HttpPost("Run")]
        public async Task<IActionResult> Run(AipmCostRunScenario model)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ManageHPE))
                return Unauthorized();

            var runHistogram = await AipmCostOptimizationScenarioManager.RunSaveScenario(model.ScenarioId);

            if (runHistogram)
            {
                //var clientHandler = new HttpClientHandler();
                //try
                //{
                //    var json = JsonConvert.SerializeObject("");
                //    var data = new StringContent(json, Encoding.UTF8, "application/json");
                //    var endPoint = "https://ncpsas-stg.hq.tnb.com.my:8343/SASStoredProcess/do?_program=%2FINET+Data+Management%2F03+Jobs%2F02+Data+Mart%2FBudget+Schedule+Profiling_Percent&_username=sas.admin&_password=S@Ssystem18&plan_id=" + model.ScenarioId;
                //    clientHandler.ServerCertificateCustomValidationCallback = (sender, cert, chain, sslPolicyErrors) => true;
                //    var client = new HttpClient(clientHandler);
                //    client.PostAsync(endPoint, data);
                //}
                //catch (Exception ex)
                //{
                //    // ignored the endpoint bugs, since it's always bug
                //}
                return Ok(new ResponseModel { Success = true });
            }
            else
            {
                return Ok(new ResponseModel { Success = false });
            }
        }

        [HttpPost("RunChart/{scenarioId}")]
        public async Task<IActionResult> RunChart(int scenarioId, AipmCostFilters model)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ViewHPE))
                return Unauthorized();

            var chartData = await AipmCostOptimizationScenarioManager.RunChart(scenarioId, model);
            return Ok(chartData);
        }

        [HttpPost("RunChartDurationTable/{scenarioId}")]
        public async Task<IActionResult> RunChartDurationTable(int scenarioId, AipmCostFilters model)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ViewHPE))
                return Unauthorized();

            var chartData = await AipmCostOptimizationScenarioManager.RunChartDurationTable(scenarioId, model);
            return Ok(chartData);
        }

        [HttpPost("RunChartBudgetTable/{scenarioId}")]
        public async Task<IActionResult> RunChartBudgetTable(int scenarioId, AipmCostFilters model)
        {
            if (_workContext.Username == null)
                return Unauthorized();

            var chartData = await AipmCostOptimizationScenarioManager.RunChartBudgetTable(scenarioId, model);
            return Ok(chartData);
        }

        [HttpPost("RunChartBudgetTableUpdate")]
        public virtual async Task<IActionResult> RunChartBudgetTableUpdate(List<AipmCostResultTableInput> model)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ViewHPE))
                return Unauthorized();

            await AipmCostOptimizationScenarioManager.RunChartBudgetTableUpdate(model);
            return Ok(new ResponseModel
            {
                Success = true
            });
        }

        [HttpPost("HistogramProjectList")]
        public async Task<IActionResult> HistogramProjectList(AipmHistogramProjectListFilter model)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ViewHPE))
                return Unauthorized();

            var chartData = await AipmCostOptimizationScenarioManager.HistogramProjectList(model);
            return Ok(new ResponseModel<Pagination<AipmHistoricalProjectDetails>>
            {
                Success = true,
                Entity = chartData
            });
        }

        [HttpPost("ConfigDurationChart")]
        public async Task<IActionResult> ConfigDurationChart(AipmCostFilters model)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ViewHPE))
                return Unauthorized();

            var chartData = await AipmCostOptimizationScenarioManager.ConfigDurationChart(model);
            return Ok(chartData);
        }

        [HttpPost("ConfigBudgetChart")]
        public async Task<IActionResult> ConfigBudgetChart(AipmCostFilters model)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ViewHPE))
                return Unauthorized();

            var chartData = await AipmCostOptimizationScenarioManager.ConfigBudgetChart(model);
            return Ok(chartData);
        }
    }
}