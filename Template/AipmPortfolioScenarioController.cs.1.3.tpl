        [HttpPost("Get##BLOCK##/{scenarioId}")]
        public async Task<IActionResult> Get##BLOCK##(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ViewPO))
                return Unauthorized();
        
            var result = await AipmPortfolioScenarioManager.##RESOLVEDATA(Datapoint, FunctionName, 1)##(scenarioId, filter);
            return Ok(result);
        }