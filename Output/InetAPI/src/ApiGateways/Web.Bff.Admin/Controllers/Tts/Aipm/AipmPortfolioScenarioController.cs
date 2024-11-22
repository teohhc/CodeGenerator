using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using TNB.ApiGateways.Web.Admin.HttpAggregator.Infrastructure;
using TNB.ApiGateways.Web.Admin.HttpAggregator.Models;
using Tts.Business.Entities.Aipm;
using Tts.Business.Helpers;
using Tts.Business.Logic.Aipm;
using Tts.Business.ViewModels.Aipm;
using Tts.Business.ViewModels;
using TNB.Services.INet.Users;
using TNB.ApiGateways.Web.Admin.HttpAggregator.Security;
using System.Collections.Generic;
using Microsoft.Extensions.Configuration;
using System;

namespace Web.Admin.HttpAggregator.Controllers.Tts.Aipm
{
    [Route("[controller]")]
    [ApiController]
    public class AipmPortfolioScenarioController : ControllerBase
    {
        private readonly IWorkContext _workContext;
        private readonly IPermissionService _permissionService;
        private readonly IConfiguration _configuration; // Inject IConfiguration
        public AipmPortfolioScenarioController(
            IWorkContext workContext,
            IPermissionService permissionService,
            IConfiguration configuration
            )
        {
            _workContext = workContext;
            _permissionService = permissionService;
            _configuration = configuration; // Assign injected IConfiguration
        }

        [HttpPost("List")]
        public async Task<IActionResult> List(AipmPortfolioScenarioSearch search)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ViewPO))
                return Unauthorized();

            var results = await AipmPortfolioScenarioManager.List(search, _workContext.Username);
            return Ok(new ResponseModel<Pagination<AipmPortfolioScenario>>
            {
                Success = true,
                Entity = results
            });
        }

        [HttpPost("ListWithResult")]
        public async Task<IActionResult> ListWithResult(AipmPortfolioScenarioSearch search)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ViewPO))
                return Unauthorized();

            var results = await AipmPortfolioScenarioManager.ListWithResult(search, _workContext.Username);
            return Ok(new ResponseModel<Pagination<AipmPortfolioScenario>>
            {
                Success = true,
                Entity = results
            });
        }

        [HttpPost("ImportList")]
        public async Task<IActionResult> ImportList(AipmPortfolioScenarioSearch search)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ViewPO))
                return Unauthorized();

            var results = await AipmPortfolioScenarioManager.ImportList(search);
            return Ok(new ResponseModel<Pagination<AipmPortfolioScenario>>
            {
                Success = true,
                Entity = results
            });
        }

        [HttpPost("Create")]
        public virtual async Task<IActionResult> Create(AipmPortfolioScenario model)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ManagePO))
                return Unauthorized();

            model.CreatedBy = _workContext.Username;
            model.UpdatedBy = _workContext.Username;
            model.CreatedOnUtc = DateTimeHelper.ToLocalDateTime();
            model.UpdatedOnUtc = DateTimeHelper.ToLocalDateTime();

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

            await AipmPortfolioScenarioManager.Create(model);
            var details = await AipmPortfolioScenarioManager.ReadByName(model.ScenarioName);
            //AipmCostOptimizationScenarioManager.RunSaveScenario(details.Id);
            return Ok(new ResponseModel<AipmPortfolioScenario>
            {
                Success = true,
                Entity = details
            });
        }

        [HttpPost("Delete/{id}")]
        public virtual async Task<IActionResult> Delete(int id)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ManagePO))
                return Unauthorized();

            var returnData = await AipmPortfolioScenarioManager.Delete(id);
            return Ok(new ResponseModel
            {
                Success = returnData,
                ErrorMessage = ""
            });
        }

        [HttpPost("GetById/{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ViewPO))
                return Unauthorized();

            var results = await AipmPortfolioScenarioManager.ReadById(id);
            var returnData = new ResponseModel<AipmPortfolioScenario>
            {
                Success = true,
                Editable = results.CreatedBy == _workContext.Username,
                Entity = results
            };
            return Ok(returnData);
        }

        [HttpGet("Config/{scenarioId}")]
        public async Task<IActionResult> Config(int scenarioId)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ViewPO))
                return Unauthorized();

            var results = await AipmPortfolioScenarioManager.GetConfigByScenarioId(scenarioId);
            return Ok(new ResponseModel<AipmPortfolioConfig>
            {
                Success = true,
                Entity = results
            });
        }

        [HttpPost("SaveConfig")]
        public virtual async Task<IActionResult> SaveConfig(AipmPortfolioConfig model)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ManagePO))
                return Unauthorized();

            model.CreatedBy = _workContext.Username;
            model.UpdatedBy = _workContext.Username;
            model.CreatedOnUtc = DateTimeHelper.ToLocalDateTime();
            model.UpdatedOnUtc = DateTimeHelper.ToLocalDateTime();

            var res = await AipmPortfolioScenarioManager.SaveConfig(model);
            //var details = await AipmPortfolioScenarioManager.ReadByName(model.ScenarioName);
            //AipmCostOptimizationScenarioManager.RunSaveScenario(details.Id);
            return Ok(new ResponseModel<string>
            {
                Success = true,
                Entity = ""
            });
        }

        [HttpPost("RunScenario")]
        public virtual async Task<IActionResult> RunScenario(AipmPortfolioRunScenario model)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ManagePO))
                return Unauthorized();

            var runResult = await AipmPortfolioScenarioManager.Run(model);
            return Ok(new ResponseModel { Success = runResult });
        }

        //[HttpPost("RunAlternate")]
        //public virtual async Task<IActionResult> RunAlternate(AipmPortfolioRunScenario model)
        //{
        //    if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ManagePO))
        //        return Unauthorized();

        //    var runResult = await AipmPortfolioScenarioManager.RunAlternate(model);
        //    return Ok(new ResponseModel { Success = runResult });
        //}

/*        [HttpPost("PortfolioResultsSummary/{scenarioId}")]
        public async Task<IActionResult> PortfolioResultsSummary(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ViewPO))
                return Unauthorized();

            var chartData = await AipmPortfolioScenarioManager.PortfolioResultsSummary(scenarioId, filter);
            return Ok(chartData);
        }*/
        
        [HttpPost("PortfolioCompareResultsSummary/{scenarioIds}")]
        public async Task<IActionResult> PortfolioCompareResultsSummary(string scenarioIds, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ViewPO))
                return Unauthorized();

            var chartData = await AipmPortfolioScenarioManager.PortfolioCompareResultsSummary(scenarioIds, filter);
            return Ok(chartData);
        }

        /* GENCODE:MARKER:2:START */

//===============================================================
// TEMPLATE START: AipmPortfolioScenarioController.cs.1.2.tpl
//===============================================================
        [HttpPost("PortfolioResultsRejected/{scenarioId}")]
        public async Task<IActionResult> PortfolioResultsRejected(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ViewPO))
                return Unauthorized();
        
            var result = await AipmPortfolioScenarioManager.ResultRejectedProject(scenarioId, filter);
            return Ok(result);
        }
//===============================================================
// TEMPLATE END: AipmPortfolioScenarioController.cs.1.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: AipmPortfolioScenarioController.cs.1.3.tpl
//===============================================================
        [HttpPost("GetSupplyProjectGrid/{scenarioId}")]
        public async Task<IActionResult> GetSupplyProjectGrid(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ViewPO))
                return Unauthorized();
        
            var result = await AipmPortfolioScenarioManager.GetSupplyProjectGrid(scenarioId, filter);
            return Ok(result);
        }
//===============================================================
// TEMPLATE END: AipmPortfolioScenarioController.cs.1.3.tpl
//===============================================================


//===============================================================
// TEMPLATE START: AipmPortfolioScenarioController.cs.1.2.tpl
//===============================================================
        [HttpPost("PortfolioResultsAlternateProject/{scenarioId}")]
        public async Task<IActionResult> PortfolioResultsAlternateProject(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ViewPO))
                return Unauthorized();
        
            var result = await AipmPortfolioScenarioManager.PortfolioResultsAlternateProject(scenarioId, filter);
            return Ok(result);
        }
//===============================================================
// TEMPLATE END: AipmPortfolioScenarioController.cs.1.2.tpl
//===============================================================

        /* GENCODE:MARKER:2:END */

        /* GENCODE:MARKER:3:START */

//===============================================================
// TEMPLATE START: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================
        [HttpPost("GetResultSummaryGrid/{scenarioId}")]
        public async Task<IActionResult> GetResultSummaryGrid(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null)
                return Unauthorized();
        
            var result = await AipmPortfolioScenarioManager.PortfolioResultsSummary(scenarioId, filter);
            return Ok(result);
        }
//===============================================================
// TEMPLATE END: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================
        [HttpPost("GetResultPrioritisedGrid/{scenarioId}")]
        public async Task<IActionResult> GetResultPrioritisedGrid(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null)
                return Unauthorized();
        
            var result = await AipmPortfolioScenarioManager.ResultSystemProjectFromDefer(scenarioId, filter);
            return Ok(result);
        }
//===============================================================
// TEMPLATE END: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================
        [HttpPost("GetResultCategorizedPrio_1Grid/{scenarioId}")]
        public async Task<IActionResult> GetResultCategorizedPrio_1Grid(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null)
                return Unauthorized();
        
            var result = await AipmPortfolioScenarioManager.ResultSystemProjectGroupBy(scenarioId, filter);
            return Ok(result);
        }
//===============================================================
// TEMPLATE END: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================
        [HttpPost("GetResultCategorizedPrio_2Grid/{scenarioId}")]
        public async Task<IActionResult> GetResultCategorizedPrio_2Grid(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null)
                return Unauthorized();
        
            var result = await AipmPortfolioScenarioManager.ResultSystemProjectGroupBy2(scenarioId, filter);
            return Ok(result);
        }
//===============================================================
// TEMPLATE END: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================
        [HttpPost("GetResultSupplyGrid/{scenarioId}")]
        public async Task<IActionResult> GetResultSupplyGrid(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null)
                return Unauthorized();
        
            var result = await AipmPortfolioScenarioManager.GetSupplyProjectGrid(scenarioId, filter);
            return Ok(result);
        }
//===============================================================
// TEMPLATE END: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================
        [HttpPost("GetResultDeprioritizedGrid/{scenarioId}")]
        public async Task<IActionResult> GetResultDeprioritizedGrid(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null)
                return Unauthorized();
        
            var result = await AipmPortfolioScenarioManager.ResultRejectedProject(scenarioId, filter);
            return Ok(result);
        }
//===============================================================
// TEMPLATE END: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================
        [HttpPost("GetResultCategorizedDeprio_1Grid/{scenarioId}")]
        public async Task<IActionResult> GetResultCategorizedDeprio_1Grid(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null)
                return Unauthorized();
        
            var result = await AipmPortfolioScenarioManager.ResultRejectedProjectGroupBy(scenarioId, filter);
            return Ok(result);
        }
//===============================================================
// TEMPLATE END: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================
        [HttpPost("GetResultCategorizedDeprio_2Grid/{scenarioId}")]
        public async Task<IActionResult> GetResultCategorizedDeprio_2Grid(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null)
                return Unauthorized();
        
            var result = await AipmPortfolioScenarioManager.ResultRejectedProjectGroupBy2(scenarioId, filter);
            return Ok(result);
        }
//===============================================================
// TEMPLATE END: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================

        /* GENCODE:MARKER:3:END */

        /* GENCODE:MARKER:4:START */

//===============================================================
// TEMPLATE START: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================
        [HttpPost("GetAlternateResultSummaryGrid/{scenarioId}")]
        public async Task<IActionResult> GetAlternateResultSummaryGrid(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null)
                return Unauthorized();
        
            var result = await AipmPortfolioScenarioManager.PortfolioAlternateResultsSummary(scenarioId, filter);
            return Ok(result);
        }
//===============================================================
// TEMPLATE END: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================
        [HttpPost("GetAlternateResultPrioritisedGrid/{scenarioId}")]
        public async Task<IActionResult> GetAlternateResultPrioritisedGrid(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null)
                return Unauthorized();
        
            var result = await AipmPortfolioScenarioManager.ResultSystemProject(scenarioId, filter);
            return Ok(result);
        }
//===============================================================
// TEMPLATE END: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================
        [HttpPost("GetAlternateResultCategorizedPrio_1Grid/{scenarioId}")]
        public async Task<IActionResult> GetAlternateResultCategorizedPrio_1Grid(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null)
                return Unauthorized();
        
            var result = await AipmPortfolioScenarioManager.ResultSystemProjectGroupBy(scenarioId, filter);
            return Ok(result);
        }
//===============================================================
// TEMPLATE END: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================
        [HttpPost("GetAlternateResultCategorizedPrio_2Grid/{scenarioId}")]
        public async Task<IActionResult> GetAlternateResultCategorizedPrio_2Grid(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null)
                return Unauthorized();
        
            var result = await AipmPortfolioScenarioManager.ResultSystemProjectGroupBy2(scenarioId, filter);
            return Ok(result);
        }
//===============================================================
// TEMPLATE END: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================
        [HttpPost("GetAlternateResultAlternateProjGrid/{scenarioId}")]
        public async Task<IActionResult> GetAlternateResultAlternateProjGrid(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null)
                return Unauthorized();
        
            var result = await AipmPortfolioScenarioManager.PortfolioResultsAlternateProject(scenarioId, filter);
            return Ok(result);
        }
//===============================================================
// TEMPLATE END: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================
        [HttpPost("GetAlternateResultSupplyGrid/{scenarioId}")]
        public async Task<IActionResult> GetAlternateResultSupplyGrid(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null)
                return Unauthorized();
        
            var result = await AipmPortfolioScenarioManager.GetSupplyProjectGrid(scenarioId, filter);
            return Ok(result);
        }
//===============================================================
// TEMPLATE END: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================
        [HttpPost("GetAlternateResultDeprioritizedGrid/{scenarioId}")]
        public async Task<IActionResult> GetAlternateResultDeprioritizedGrid(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null)
                return Unauthorized();
        
            var result = await AipmPortfolioScenarioManager.ResultRejectedProject(scenarioId, filter);
            return Ok(result);
        }
//===============================================================
// TEMPLATE END: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================
        [HttpPost("GetAlternateResultCategorizedDeprio_1Grid/{scenarioId}")]
        public async Task<IActionResult> GetAlternateResultCategorizedDeprio_1Grid(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null)
                return Unauthorized();
        
            var result = await AipmPortfolioScenarioManager.ResultRejectedProjectGroupBy(scenarioId, filter);
            return Ok(result);
        }
//===============================================================
// TEMPLATE END: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================
        [HttpPost("GetAlternateResultCategorizedDeprio_2Grid/{scenarioId}")]
        public async Task<IActionResult> GetAlternateResultCategorizedDeprio_2Grid(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null)
                return Unauthorized();
        
            var result = await AipmPortfolioScenarioManager.ResultRejectedProjectGroupBy2(scenarioId, filter);
            return Ok(result);
        }
//===============================================================
// TEMPLATE END: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================

        /* GENCODE:MARKER:4:END */

        /* GENCODE:MARKER:5:START */

//===============================================================
// TEMPLATE START: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================
        [HttpPost("GetComparisonSummaryGrid/{scenarioId}")]
        public async Task<IActionResult> GetComparisonSummaryGrid(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null)
                return Unauthorized();
        
            var result = await AipmPortfolioScenarioManager.PortfolioAlternateResultsSummary(scenarioId, filter);
            return Ok(result);
        }
//===============================================================
// TEMPLATE END: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================
        [HttpPost("GetComparisonPrioritisedGrid/{scenarioId}")]
        public async Task<IActionResult> GetComparisonPrioritisedGrid(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null)
                return Unauthorized();
        
            var result = await AipmPortfolioScenarioManager.ResultSystemProject(scenarioId, filter);
            return Ok(result);
        }
//===============================================================
// TEMPLATE END: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================
        [HttpPost("GetComparisonDeprioritizedGrid/{scenarioId}")]
        public async Task<IActionResult> GetComparisonDeprioritizedGrid(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null)
                return Unauthorized();
        
            var result = await AipmPortfolioScenarioManager.ResultRejectedProject(scenarioId, filter);
            return Ok(result);
        }
//===============================================================
// TEMPLATE END: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================
        [HttpPost("GetComparisonCategorizedPrio_1Grid/{scenarioId}")]
        public async Task<IActionResult> GetComparisonCategorizedPrio_1Grid(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null)
                return Unauthorized();
        
            var result = await AipmPortfolioScenarioManager.ResultSystemProjectGroupBy(scenarioId, filter);
            return Ok(result);
        }
//===============================================================
// TEMPLATE END: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================
        [HttpPost("GetComparisonCategorizedPrio_2Grid/{scenarioId}")]
        public async Task<IActionResult> GetComparisonCategorizedPrio_2Grid(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null)
                return Unauthorized();
        
            var result = await AipmPortfolioScenarioManager.ResultSystemProjectGroupBy2(scenarioId, filter);
            return Ok(result);
        }
//===============================================================
// TEMPLATE END: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================
        [HttpPost("GetComparisonCategorizedDeprio_1Grid/{scenarioId}")]
        public async Task<IActionResult> GetComparisonCategorizedDeprio_1Grid(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null)
                return Unauthorized();
        
            var result = await AipmPortfolioScenarioManager.ResultRejectedProjectGroupBy(scenarioId, filter);
            return Ok(result);
        }
//===============================================================
// TEMPLATE END: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================
        [HttpPost("GetComparisonCategorizedDeprio_2Grid/{scenarioId}")]
        public async Task<IActionResult> GetComparisonCategorizedDeprio_2Grid(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null)
                return Unauthorized();
        
            var result = await AipmPortfolioScenarioManager.ResultRejectedProjectGroupBy2(scenarioId, filter);
            return Ok(result);
        }
//===============================================================
// TEMPLATE END: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================
        [HttpPost("GetComparisonAlternateProjGrid/{scenarioId}")]
        public async Task<IActionResult> GetComparisonAlternateProjGrid(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null)
                return Unauthorized();
        
            var result = await AipmPortfolioScenarioManager.PortfolioResultsAlternateProject(scenarioId, filter);
            return Ok(result);
        }
//===============================================================
// TEMPLATE END: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================
        [HttpPost("GetComparisonSupplyGrid/{scenarioId}")]
        public async Task<IActionResult> GetComparisonSupplyGrid(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null)
                return Unauthorized();
        
            var result = await AipmPortfolioScenarioManager.GetSupplyProjectGrid(scenarioId, filter);
            return Ok(result);
        }
//===============================================================
// TEMPLATE END: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================

        /* GENCODE:MARKER:5:END */

        /* GENCODE:MARKER:6:START */

//===============================================================
// TEMPLATE START: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================
        [HttpPost("GetComparisonRightSummaryGrid/{scenarioId}")]
        public async Task<IActionResult> GetComparisonRightSummaryGrid(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null)
                return Unauthorized();
        
            var result = await AipmPortfolioScenarioManager.PortfolioAlternateResultsSummary(scenarioId, filter);
            return Ok(result);
        }
//===============================================================
// TEMPLATE END: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================
        [HttpPost("GetComparisonRightPrioritisedGrid/{scenarioId}")]
        public async Task<IActionResult> GetComparisonRightPrioritisedGrid(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null)
                return Unauthorized();
        
            var result = await AipmPortfolioScenarioManager.ResultSystemProject(scenarioId, filter);
            return Ok(result);
        }
//===============================================================
// TEMPLATE END: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================
        [HttpPost("GetComparisonRightDeprioritizedGrid/{scenarioId}")]
        public async Task<IActionResult> GetComparisonRightDeprioritizedGrid(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null)
                return Unauthorized();
        
            var result = await AipmPortfolioScenarioManager.ResultRejectedProject(scenarioId, filter);
            return Ok(result);
        }
//===============================================================
// TEMPLATE END: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================
        [HttpPost("GetComparisonRightCategorizedPrio_1Grid/{scenarioId}")]
        public async Task<IActionResult> GetComparisonRightCategorizedPrio_1Grid(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null)
                return Unauthorized();
        
            var result = await AipmPortfolioScenarioManager.ResultSystemProjectGroupBy(scenarioId, filter);
            return Ok(result);
        }
//===============================================================
// TEMPLATE END: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================
        [HttpPost("GetComparisonRightCategorizedPrio_2Grid/{scenarioId}")]
        public async Task<IActionResult> GetComparisonRightCategorizedPrio_2Grid(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null)
                return Unauthorized();
        
            var result = await AipmPortfolioScenarioManager.ResultSystemProjectGroupBy2(scenarioId, filter);
            return Ok(result);
        }
//===============================================================
// TEMPLATE END: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================
        [HttpPost("GetComparisonRightCategorizedDeprio_1Grid/{scenarioId}")]
        public async Task<IActionResult> GetComparisonRightCategorizedDeprio_1Grid(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null)
                return Unauthorized();
        
            var result = await AipmPortfolioScenarioManager.ResultRejectedProjectGroupBy(scenarioId, filter);
            return Ok(result);
        }
//===============================================================
// TEMPLATE END: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================
        [HttpPost("GetComparisonRightCategorizedDeprio_2Grid/{scenarioId}")]
        public async Task<IActionResult> GetComparisonRightCategorizedDeprio_2Grid(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null)
                return Unauthorized();
        
            var result = await AipmPortfolioScenarioManager.ResultRejectedProjectGroupBy2(scenarioId, filter);
            return Ok(result);
        }
//===============================================================
// TEMPLATE END: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================
        [HttpPost("GetComparisonRightAlternateProjGrid/{scenarioId}")]
        public async Task<IActionResult> GetComparisonRightAlternateProjGrid(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null)
                return Unauthorized();
        
            var result = await AipmPortfolioScenarioManager.PortfolioResultsAlternateProject(scenarioId, filter);
            return Ok(result);
        }
//===============================================================
// TEMPLATE END: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================
        [HttpPost("GetComparisonRightSupplyGrid/{scenarioId}")]
        public async Task<IActionResult> GetComparisonRightSupplyGrid(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null)
                return Unauthorized();
        
            var result = await AipmPortfolioScenarioManager.GetSupplyProjectGrid(scenarioId, filter);
            return Ok(result);
        }
//===============================================================
// TEMPLATE END: AipmPortfolioScenarioController.cs.1.4.tpl
//===============================================================

        /* GENCODE:MARKER:6:END */

        [HttpPost("PortfolioResultsSupplyInsert")]
        public virtual async Task<IActionResult> PortfolioResultsSupplyInsert(int scenarioId, int projectId)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ManagePO))
                return Unauthorized();

            var res = await AipmPortfolioScenarioManager.PortfolioResultsSupplyInsert(scenarioId, projectId);
            return Ok(new ResponseModel<string>
            {
                Success = res,
                Entity = ""
            });
        }

        [HttpPost("PortfolioResultsSupplyDelete")]
        public virtual async Task<IActionResult> PortfolioResultsSupplyDelete(AipmPortfolioDeleteAlternativeRequestModel model)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ManagePO))
                return Unauthorized();

            var res = await AipmPortfolioScenarioManager.PortfolioResultsSupplyDelete(model.scenarioId, model.projectId);
            return Ok(new ResponseModel<string>
            {
                Success = res,
                Entity = ""
            });
        }

/*        [HttpPost("PortfolioResultsApprovedDefer/{scenarioId}")]
        public async Task<IActionResult> PortfolioResultsApprovedDefer(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ViewPO))
                return Unauthorized();

            var chartData = await AipmPortfolioScenarioManager.ResultSystemProjectFromDefer(scenarioId, filter);
            return Ok(chartData);
        }*/

        [HttpPost("PortfolioResultsApproved/{scenarioId}")]
        public async Task<IActionResult> PortfolioResultsApproved(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ViewPO))
                return Unauthorized();

            var chartData = await AipmPortfolioScenarioManager.ResultSystemProject(scenarioId, filter);
            return Ok(chartData);
        }

/*        [HttpPost("PortfolioResultsRejected/{scenarioId}")]
        public async Task<IActionResult> PortfolioResultsRejected(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ViewPO))
                return Unauthorized();

            var chartData = await AipmPortfolioScenarioManager.ResultRejectedProject(scenarioId, filter);
            return Ok(chartData);
        }*/

        [HttpPost("GetChart/{scenarioId}")]
        public async Task<IActionResult> GetChart(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ViewPO))
                return Unauthorized();

            var chartData = await AipmPortfolioScenarioManager.GetChart(scenarioId, filter);
            return Ok(chartData);
        }

        [HttpPost("PortfolioResultsAlternateProjectInsert")]
        public virtual async Task<IActionResult> PortfolioResultsAlternateProjectInsert(int scenarioId, int projectId, DateTime startDate, string reproposal)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ManagePO))
                return Unauthorized();

            var res = await AipmPortfolioScenarioManager.PortfolioResultsAlternateProjectInsert(scenarioId, projectId, _configuration, startDate, reproposal);
            return Ok(new ResponseModel<string>
            {
                Success = res,
                Entity = ""
            });
        }

        [HttpPost("PortfolioResultsAlternateProjectDelete")]
        public virtual async Task<IActionResult> PortfolioResultsAlternateDelete(AipmPortfolioDeleteAlternativeRequestModel model)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ManagePO))
                return Unauthorized();

            var res = await AipmPortfolioScenarioManager.PortfolioResultsAlternateProjectDelete(model.scenarioId, model.projectId);
            return Ok(new ResponseModel<string>
            {
                Success = res,
                Entity = ""
            });
        }

        [HttpPost("PortfolioAlternateResultsSummary/{scenarioId}")]
        public async Task<IActionResult> PortfolioAlternateResultsSummary(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ViewPO))
                return Unauthorized();

            var chartData = await AipmPortfolioScenarioManager.PortfolioAlternateResultsSummary(scenarioId, filter);
            return Ok(chartData);
        }

        [HttpPost("PortfolioAlternateResultsApproved/{scenarioId}")]
        public async Task<IActionResult> PortfolioAlternateResultsApproved(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ViewPO))
                return Unauthorized();

            var chartData = await AipmPortfolioScenarioManager.ResultSystemProject(scenarioId, filter, true);
            return Ok(chartData);
        }
        

        [HttpPost("PortfolioAlternateResultsRejected/{scenarioId}")]
        public async Task<IActionResult> PortfolioAlternateResultsRejected(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ViewPO))
                return Unauthorized();

            var chartData = await AipmPortfolioScenarioManager.ResultRejectedProject(scenarioId, filter, true);
            return Ok(chartData);
        }

        
        [HttpPost("GetAlternativeChart/{scenarioId}")]
        public async Task<IActionResult> GetAlternateChart(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ViewPO))
                return Unauthorized();

            var chartData = await AipmPortfolioScenarioManager.GetAlternateChart(scenarioId, filter);
            return Ok(chartData);
        }

        //Siti
        [HttpPost("GetBudgetChart/{scenarioId}")]
        public async Task<IActionResult> GetBudgetChart(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ViewPO))
                return Unauthorized();

            var chartData = await AipmPortfolioScenarioManager.GetBudgetChart(scenarioId, filter);
            return Ok(chartData);
        }

        /* GENCODE:MARKER:1:START */

//===============================================================
// TEMPLATE START: ScenarioController.cs.1.1.tpl
//===============================================================
        [HttpPost("GetLeftBarLineBudgetResultChart/{scenarioId}")]
        public async Task<IActionResult> GetLeftBarLineBudgetResultChart(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ViewPO))
                return Unauthorized();

            var chartData = await AipmPortfolioScenarioManager.GetLeftBarLineBudgetResultChart(scenarioId, filter);
            return Ok(chartData);
        }
//===============================================================
// TEMPLATE END: ScenarioController.cs.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: ScenarioController.cs.1.1.tpl
//===============================================================
        [HttpPost("GetLeftStackedBarBudgetResultChart/{scenarioId}")]
        public async Task<IActionResult> GetLeftStackedBarBudgetResultChart(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ViewPO))
                return Unauthorized();

            var chartData = await AipmPortfolioScenarioManager.GetLeftStackedBarBudgetResultChart(scenarioId, filter);
            return Ok(chartData);
        }
//===============================================================
// TEMPLATE END: ScenarioController.cs.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: ScenarioController.cs.1.1.tpl
//===============================================================
        [HttpPost("GetLeftBarLineNPVResultChart/{scenarioId}")]
        public async Task<IActionResult> GetLeftBarLineNPVResultChart(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ViewPO))
                return Unauthorized();

            var chartData = await AipmPortfolioScenarioManager.GetLeftBarLineNPVResultChart(scenarioId, filter);
            return Ok(chartData);
        }
//===============================================================
// TEMPLATE END: ScenarioController.cs.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: ScenarioController.cs.1.1.tpl
//===============================================================
        [HttpPost("GetLeftStackedBarNPVResultChart/{scenarioId}")]
        public async Task<IActionResult> GetLeftStackedBarNPVResultChart(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ViewPO))
                return Unauthorized();

            var chartData = await AipmPortfolioScenarioManager.GetLeftStackedBarNPVResultChart(scenarioId, filter);
            return Ok(chartData);
        }
//===============================================================
// TEMPLATE END: ScenarioController.cs.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: ScenarioController.cs.1.1.tpl
//===============================================================
        [HttpPost("GetLeftRadarElementResultChart/{scenarioId}")]
        public async Task<IActionResult> GetLeftRadarElementResultChart(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ViewPO))
                return Unauthorized();

            var chartData = await AipmPortfolioScenarioManager.GetLeftRadarElementResultChart(scenarioId, filter);
            return Ok(chartData);
        }
//===============================================================
// TEMPLATE END: ScenarioController.cs.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: ScenarioController.cs.1.1.tpl
//===============================================================
        [HttpPost("GetLeftStackedBarOSRiskResultChart/{scenarioId}")]
        public async Task<IActionResult> GetLeftStackedBarOSRiskResultChart(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ViewPO))
                return Unauthorized();

            var chartData = await AipmPortfolioScenarioManager.GetLeftStackedBarOSRiskResultChart(scenarioId, filter);
            return Ok(chartData);
        }
//===============================================================
// TEMPLATE END: ScenarioController.cs.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: ScenarioController.cs.1.1.tpl
//===============================================================
        [HttpPost("GetLeftBarLineBudgetChart/{scenarioId}")]
        public async Task<IActionResult> GetLeftBarLineBudgetChart(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ViewPO))
                return Unauthorized();

            var chartData = await AipmPortfolioScenarioManager.GetLeftBarLineBudgetChart(scenarioId, filter);
            return Ok(chartData);
        }
//===============================================================
// TEMPLATE END: ScenarioController.cs.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: ScenarioController.cs.1.1.tpl
//===============================================================
        [HttpPost("GetRightBarLineBudgetChart/{scenarioId}")]
        public async Task<IActionResult> GetRightBarLineBudgetChart(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ViewPO))
                return Unauthorized();

            var chartData = await AipmPortfolioScenarioManager.GetRightBarLineBudgetChart(scenarioId, filter);
            return Ok(chartData);
        }
//===============================================================
// TEMPLATE END: ScenarioController.cs.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: ScenarioController.cs.1.1.tpl
//===============================================================
        [HttpPost("GetLeftStackedBarBudgetChart/{scenarioId}")]
        public async Task<IActionResult> GetLeftStackedBarBudgetChart(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ViewPO))
                return Unauthorized();

            var chartData = await AipmPortfolioScenarioManager.GetLeftStackedBarBudgetChart(scenarioId, filter);
            return Ok(chartData);
        }
//===============================================================
// TEMPLATE END: ScenarioController.cs.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: ScenarioController.cs.1.1.tpl
//===============================================================
        [HttpPost("GetRightStackedBarBudgetChart/{scenarioId}")]
        public async Task<IActionResult> GetRightStackedBarBudgetChart(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ViewPO))
                return Unauthorized();

            var chartData = await AipmPortfolioScenarioManager.GetRightStackedBarBudgetChart(scenarioId, filter);
            return Ok(chartData);
        }
//===============================================================
// TEMPLATE END: ScenarioController.cs.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: ScenarioController.cs.1.1.tpl
//===============================================================
        [HttpPost("GetLeftBarLineNPVChart/{scenarioId}")]
        public async Task<IActionResult> GetLeftBarLineNPVChart(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ViewPO))
                return Unauthorized();

            var chartData = await AipmPortfolioScenarioManager.GetLeftBarLineNPVChart(scenarioId, filter);
            return Ok(chartData);
        }
//===============================================================
// TEMPLATE END: ScenarioController.cs.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: ScenarioController.cs.1.1.tpl
//===============================================================
        [HttpPost("GetRightBarLineNPVChart/{scenarioId}")]
        public async Task<IActionResult> GetRightBarLineNPVChart(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ViewPO))
                return Unauthorized();

            var chartData = await AipmPortfolioScenarioManager.GetRightBarLineNPVChart(scenarioId, filter);
            return Ok(chartData);
        }
//===============================================================
// TEMPLATE END: ScenarioController.cs.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: ScenarioController.cs.1.1.tpl
//===============================================================
        [HttpPost("GetLeftStackedBarNPVChart/{scenarioId}")]
        public async Task<IActionResult> GetLeftStackedBarNPVChart(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ViewPO))
                return Unauthorized();

            var chartData = await AipmPortfolioScenarioManager.GetLeftStackedBarNPVChart(scenarioId, filter);
            return Ok(chartData);
        }
//===============================================================
// TEMPLATE END: ScenarioController.cs.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: ScenarioController.cs.1.1.tpl
//===============================================================
        [HttpPost("GetRightStackedBarNPVChart/{scenarioId}")]
        public async Task<IActionResult> GetRightStackedBarNPVChart(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ViewPO))
                return Unauthorized();

            var chartData = await AipmPortfolioScenarioManager.GetRightStackedBarNPVChart(scenarioId, filter);
            return Ok(chartData);
        }
//===============================================================
// TEMPLATE END: ScenarioController.cs.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: ScenarioController.cs.1.1.tpl
//===============================================================
        [HttpPost("GetLeftRadarElementChart/{scenarioId}")]
        public async Task<IActionResult> GetLeftRadarElementChart(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ViewPO))
                return Unauthorized();

            var chartData = await AipmPortfolioScenarioManager.GetLeftRadarElementChart(scenarioId, filter);
            return Ok(chartData);
        }
//===============================================================
// TEMPLATE END: ScenarioController.cs.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: ScenarioController.cs.1.1.tpl
//===============================================================
        [HttpPost("GetRightRadarElementChart/{scenarioId}")]
        public async Task<IActionResult> GetRightRadarElementChart(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ViewPO))
                return Unauthorized();

            var chartData = await AipmPortfolioScenarioManager.GetRightRadarElementChart(scenarioId, filter);
            return Ok(chartData);
        }
//===============================================================
// TEMPLATE END: ScenarioController.cs.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: ScenarioController.cs.1.1.tpl
//===============================================================
        [HttpPost("GetLeftStackedBarOSRiskChart/{scenarioId}")]
        public async Task<IActionResult> GetLeftStackedBarOSRiskChart(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ViewPO))
                return Unauthorized();

            var chartData = await AipmPortfolioScenarioManager.GetLeftStackedBarOSRiskChart(scenarioId, filter);
            return Ok(chartData);
        }
//===============================================================
// TEMPLATE END: ScenarioController.cs.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: ScenarioController.cs.1.1.tpl
//===============================================================
        [HttpPost("GetRightStackedBarOSRiskChart/{scenarioId}")]
        public async Task<IActionResult> GetRightStackedBarOSRiskChart(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ViewPO))
                return Unauthorized();

            var chartData = await AipmPortfolioScenarioManager.GetRightStackedBarOSRiskChart(scenarioId, filter);
            return Ok(chartData);
        }
//===============================================================
// TEMPLATE END: ScenarioController.cs.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: AipmPortfolioScenarioController.cs.1.1.tpl
//===============================================================
        [HttpPost("resultRejectedGroupBy/{scenarioId}")]
        public async Task<IActionResult> resultRejectedGroupBy(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ViewPO))
                return Unauthorized();
        
            var result = await AipmPortfolioScenarioManager.ResultRejectedProjectGroupBy(scenarioId, filter);
            return Ok(result);
        }
//===============================================================
// TEMPLATE END: AipmPortfolioScenarioController.cs.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: AipmPortfolioScenarioController.cs.2.1.tpl
//===============================================================
        [HttpPost("AlternateResultApprovedGroupBy/{scenarioId}")]
        public async Task<IActionResult> AlternateResultApprovedGroupBy(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ViewPO))
                return Unauthorized();
        
            var result = await AipmPortfolioScenarioManager.ResultSystemProjectGroupBy(scenarioId, filter, true);
            return Ok(result);
        }
//===============================================================
// TEMPLATE END: AipmPortfolioScenarioController.cs.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: AipmPortfolioScenarioController.cs.2.1.tpl
//===============================================================
        [HttpPost("AlternateResultRejectedGroupBy/{scenarioId}")]
        public async Task<IActionResult> AlternateResultRejectedGroupBy(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ViewPO))
                return Unauthorized();
        
            var result = await AipmPortfolioScenarioManager.ResultRejectedProjectGroupBy(scenarioId, filter, true);
            return Ok(result);
        }
//===============================================================
// TEMPLATE END: AipmPortfolioScenarioController.cs.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: AipmPortfolioScenarioController.cs.1.1.tpl
//===============================================================
        [HttpPost("resultApprovedGroupBy/{scenarioId}")]
        public async Task<IActionResult> resultApprovedGroupBy(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ViewPO))
                return Unauthorized();
        
            var result = await AipmPortfolioScenarioManager.ResultSystemProjectGroupBy(scenarioId, filter);
            return Ok(result);
        }
//===============================================================
// TEMPLATE END: AipmPortfolioScenarioController.cs.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: AipmPortfolioScenarioController.cs.1.1.tpl
//===============================================================
        [HttpPost("resultApprovedGroupBy2/{scenarioId}")]
        public async Task<IActionResult> resultApprovedGroupBy2(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ViewPO))
                return Unauthorized();
        
            var result = await AipmPortfolioScenarioManager.ResultSystemProjectGroupBy2(scenarioId, filter);
            return Ok(result);
        }
//===============================================================
// TEMPLATE END: AipmPortfolioScenarioController.cs.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: AipmPortfolioScenarioController.cs.1.1.tpl
//===============================================================
        [HttpPost("resultRejectedGroupBy2/{scenarioId}")]
        public async Task<IActionResult> resultRejectedGroupBy2(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ViewPO))
                return Unauthorized();
        
            var result = await AipmPortfolioScenarioManager.ResultRejectedProjectGroupBy2(scenarioId, filter);
            return Ok(result);
        }
//===============================================================
// TEMPLATE END: AipmPortfolioScenarioController.cs.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: AipmPortfolioScenarioController.cs.2.1.tpl
//===============================================================
        [HttpPost("AlternateResultApprovedGroupBy2/{scenarioId}")]
        public async Task<IActionResult> AlternateResultApprovedGroupBy2(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ViewPO))
                return Unauthorized();
        
            var result = await AipmPortfolioScenarioManager.ResultSystemProjectGroupBy2(scenarioId, filter, true);
            return Ok(result);
        }
//===============================================================
// TEMPLATE END: AipmPortfolioScenarioController.cs.2.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: AipmPortfolioScenarioController.cs.2.1.tpl
//===============================================================
        [HttpPost("AlternateResultRejectedGroupBy2/{scenarioId}")]
        public async Task<IActionResult> AlternateResultRejectedGroupBy2(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ViewPO))
                return Unauthorized();
        
            var result = await AipmPortfolioScenarioManager.ResultRejectedProjectGroupBy2(scenarioId, filter, true);
            return Ok(result);
        }
//===============================================================
// TEMPLATE END: AipmPortfolioScenarioController.cs.2.1.tpl
//===============================================================

        /* GENCODE:MARKER:1:END */
        
        [HttpPost("GetBudgetConfig/scenarioId={scenarioId}&noy={numberOfYears}&state={state}")]
        public async Task<IActionResult> GetBudgetConfig(int scenarioId, int numberOfYears, string state)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ViewPO))
                return Unauthorized();

            var results = await AipmPortfolioScenarioManager.GetBudgetConfig(scenarioId, numberOfYears, state);
            return Ok(results);
        }

        [HttpPost("SaveBudgetConfig/id={scenarioId}&noy={numberOfYears}")]
        public virtual async Task<IActionResult> SaveBudgetConfig(int scenarioId, int numberOfYears, List<Dictionary<string, object>> data)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ManagePO))
                return Unauthorized();

            var res = await AipmPortfolioScenarioManager.SaveBudgetConfig(scenarioId, numberOfYears, data);
            return Ok(new ResponseModel<string>
            {
                Success = true,
                Entity = ""
            });
        }

    }
}