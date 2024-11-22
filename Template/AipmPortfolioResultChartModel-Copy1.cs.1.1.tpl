    public class ##RESOLVEDATA(Datapoint, FunctionName, 1)##Model
    {
        public ##RESOLVEDATA(Datapoint, FunctionName, 1)##Model()
        {
            Labels = new List<string>();
            Datasets = new List<StackBarDataModel>();
            SQLData = new List<##RESOLVEDATA(Datapoint, FunctionName, 1)##>();
        }

        public List<string> Labels { get; set; }
        public List<StackBarDataModel> Datasets { get; set; }
        public List<##RESOLVEDATA(Datapoint, FunctionName, 1)##> Datasets { get; set; }
    }

    public class PortfolioNPVvsCommMthDataSummaryModel
    {
        public PortfolioNPVvsCommMthDataSummaryModel()
        {
            Labels = new List<string>();
            Datasets = new List<StackBarDataModel>();
            SQLData = new List<PortfolioNPVvsCommMthDataSummary>();
        }

        public List<string> Labels { get; set; }
        public List<StackBarDataModel> Datasets { get; set; }
        public List<PortfolioNPVvsCommMthDataSummary> Datasets { get; set; }
    }