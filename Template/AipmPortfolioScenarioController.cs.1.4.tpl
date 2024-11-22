        [HttpPost("Get##BLOCK##/{scenarioId}")]
        public async Task<IActionResult> Get##BLOCK##(int scenarioId, ##RESOLVEDATA(URI, UriParameter, 1)## filter)
        {
            if (_workContext.Username == null)
                return Unauthorized();
        
            var result = await ##RESOLVEDATA(URI, Module, 1)##.##RESOLVEDATA(Datapoint, FunctionName, 1)##(scenarioId, filter);
            return Ok(result);
        }