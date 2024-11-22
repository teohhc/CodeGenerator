        [HttpPost("##RESOLVEDATA(Datapoint, FunctionName, 1)##/{scenarioId}")]
        public async Task<IActionResult> ##RESOLVEDATA(Datapoint, FunctionName, 1)##(int scenarioId, ##RESOLVEDATA(URI, UriParameter, 1)## filter)
        {
            if (_workContext.Username == null)
                return Unauthorized();
        
            var result = await ##RESOLVEDATA(URI, Module, 1)##.get##RESOLVEDATA(Datapoint, FunctionName, 1)##(scenarioId, filter);
            return Ok(result);
        }