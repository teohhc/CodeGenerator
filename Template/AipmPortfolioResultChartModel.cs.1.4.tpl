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
            Data = new List<double>();
        }

        public string Label { get; set; }
        public int BorderWidth { get; set; }
        public string BorderColor { get; set; }
        public string BackgroundColor { get; set; }
        public List<double> Data { get; set; }
        public string Type { get; set; }
        public bool Fill { get; set; }
    }