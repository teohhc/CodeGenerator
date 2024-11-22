    public class ##RESOLVEDATA(Datapoint, FunctionName, 1)##ChartModel
    {
        public List<string> Labels { get; set; }
        public List<##RESOLVEDATA(Datapoint, FunctionName, 1)##Datasets> Datasets { get; set; }
        public List<##RESOLVEDATA(Datapoint, FunctionName, 1)##Result> SQLData { get; set; }
    } 

    public class ##RESOLVEDATA(Datapoint, FunctionName, 1)##Datasets
    {
        public ##RESOLVEDATA(Datapoint, FunctionName, 1)##Datasets()
        {
            Data = new List<double>();
            BackgroundColor = new List<string>();
            borderColor = new List<string>();
        }
        public string yAxisID { get; set; }
        public string Label { get; set; }
        public List<double> Data { get; set; }
        public List<string> BackgroundColor { get; set; }
        public List<string> borderColor { get; set; }
        public bool Fill { get; set; }
        public string Type { get; set; }
    }

    public class ##RESOLVEDATA(Datapoint, FunctionName, 1)##InternalChartModel
    {
        public ##RESOLVEDATA(Datapoint, FunctionName, 1)##InternalChartModel()
        {
            Labels = new List<string>();
            Datasets = new List<##RESOLVEDATA(Datapoint, FunctionName, 1)##Datasets>();
            SQLData = new List<##RESOLVEDATA(Datapoint, FunctionName, 1)##Result>();
        }

        public List<string> Labels { get; set; }
        public List<##RESOLVEDATA(Datapoint, FunctionName, 1)##Datasets> Datasets { get; set; }
        public List<##RESOLVEDATA(Datapoint, FunctionName, 1)##Result> SQLData { get; set; }
    }