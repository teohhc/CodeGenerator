        [HttpPost("##RESOLVEVAR(Token, 7)##/{scenarioId}")]
        public async Task<IActionResult> ##RESOLVEVAR(Token, 7)##(int scenarioId, AipmPortfolioResultFilter filter)
        {
            if (_workContext.Username == null || !await _permissionService.AuthorizeAsync(_workContext.Username, PermissionDefaults.ViewPO))
                return Unauthorized();
        
            var result = await AipmPortfolioScenarioManager.##RESOLVEDATA(Datapoint, FunctionName, 1)##(scenarioId, filter, true);
            return Ok(result);
        }