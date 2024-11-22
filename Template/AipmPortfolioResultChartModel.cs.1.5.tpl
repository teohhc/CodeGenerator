    public class ##RESOLVEDATA(Datapoint, FunctionName, 1)##ChartModel
    {
        public ##RESOLVEDATA(Datapoint, FunctionName, 1)##ChartModel()
        {
            Labels = new List<string>();
            Datasets = new List<##RESOLVEDATA(Datapoint, FunctionName, 1)##Datasets>();
            SQLData = new List<##RESOLVEDATA(Datapoint, FunctionName, 1)##Result>();
        }
        public List<string> Labels { get; set; }
        public List<##RESOLVEDATA(Datapoint, FunctionName, 1)##Datasets> Datasets { get; set; }
        public List<##RESOLVEDATA(Datapoint, FunctionName, 1)##Result> SQLData { get; set; }
    }

    public class ##RESOLVEDATA(Datapoint, FunctionName, 1)##Datasets
    {
        public ##RESOLVEDATA(Datapoint, FunctionName, 1)##Datasets()
        {
            Start = new List<string>();
            End = new List<string>();
        }

        public string yAxisID { get; set; }
        public string Label { get; set; }
        public List<string> Start { get; set; }
        public List<string> End { get; set; }
        public string BackgroundColor { get; set; }
        public string Type { get; set; }
    }