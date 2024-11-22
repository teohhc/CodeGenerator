        [HttpPost("Get##BLOCK##/{scenarioId}")]
        public async Task<IActionResult> Get##BLOCK##(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ViewPO))
                return Unauthorized();

            var chartData = await AipmPortfolioScenarioManager.Get##BLOCK##(scenarioId, filter);
            return Ok(chartData);
        }