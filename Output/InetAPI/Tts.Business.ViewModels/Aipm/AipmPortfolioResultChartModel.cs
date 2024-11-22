using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tts.Business.ViewModels.Aipm
{
    #region bubble chart
    public class AipmPortfolioResultChartModel
    {
        public List<AipmPortfolioResultDataset> Datasets { get; set; }
    }

    public class AipmPortfolioResultDataset
    {
        public string Type { get; set; }
        public string Label { get; set; }
        public List<AipmPortfolioResultData> Data { get; set; }
        public string BorderColor { get; set; }
        public List<string> BackgroundColor { get; set; }
        public bool Fill { get; set; }
    }

    public class AipmPortfolioResultData
    {
        public string ProjectDefinition { get; set; }
        public int StrategicObjectiveId { get; set; }
        public string StrategicObjective { get; set; }
        public bool Mandatory { get; set; }
        public decimal TotalBudget { get; set; }
        public decimal TotalRiskReduced { get; set; }
        public decimal TCOOpex { get; set; }
        public decimal TCOTotalProjectCost { get; set; }
        public decimal TotalTCO { get; set; }
        public decimal NPVRiskReduced { get; set; }
        public decimal TotalProjectScore { get; set; }
        public decimal x { get; set; }
        public decimal y { get; set; }
        public int r { get; set; }
    }
    #endregion

    #region bar chart
    public class AipmPortfolioResultBarChartModel
    {
        public AipmPortfolioResultBarChartModel()
        {
            Labels = new List<string>();
            Datasets = new List<AipmPortfolioResultBarChartDataModel>();
        }

        public List<string> Labels { get; set; }
        public List<AipmPortfolioResultBarChartDataModel> Datasets { get; set; }
    }

    public class AipmPortfolioResultBarChartModelv2
    {
        public AipmPortfolioResultBarChartModelv2()
        {
            Labels = new List<string>();
            Datasets = new List<AipmPortfolioResultBarChartDataModelv2>();
        }

        public List<string> Labels { get; set; }
        public List<AipmPortfolioResultBarChartDataModelv2> Datasets { get; set; }
    }

    public class AipmPortfolioResultBarChartDataModel
    {
        public AipmPortfolioResultBarChartDataModel()
        {
            Data = new List<double>();
        }
        public string yAxisID { get; set; }
        public string Label { get; set; }
        public List<double> Data { get; set; }
        public string BackgroundColor { get; set; }
        public string Type { get; set; }
        //public int Order { get; set; }
    }

    public class AipmPortfolioResultBarChartDataModelv2
    {
        public AipmPortfolioResultBarChartDataModelv2()
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
        //public int Order { get; set; }
    }

    public class AipmPortfolioResultGanttDataModel
    {
        public AipmPortfolioResultGanttDataModel()
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
        //public int Order { get; set; }
    }

    public class AipmPortfolioResultGanttModel
    {
        public AipmPortfolioResultGanttModel()
        {
            Labels = new List<string>();
            Datasets = new List<AipmPortfolioResultGanttDataModel>();
        }

        public List<string> Labels { get; set; }
        public List<AipmPortfolioResultGanttDataModel> Datasets { get; set; }
    }

    public class BarData
    {
        public string x { get; set; }
        public double y { get; set; }
    }
    #endregion

    #region line chart
    public class AipmPortfolioResultLineChartModel
    {
        public AipmPortfolioResultLineChartModel()
        {
            Dataset = new List<AipmPortfolioResultLineChartDataModel>();
        }
        public List<AipmPortfolioResultLineChartDataModel> Dataset { get; set; }
    }
    public class AipmPortfolioResultLineChartDataModel
    {
        public string Label { get; set; }
        public double TotalBudget { get; set; }
        public string BackgroundColor { get; set; }
        public string Type { get; set; }
        //public int Order { get; set; }
    }

    public class LineChartModel
    {
        public LineChartModel()
        {
            Labels = new List<string>();
            Datasets = new List<LineChartDataModel>();
        }

        public List<string> Labels { get; set; }
        public List<LineChartDataModel> Datasets { get; set; }
    }

    public class LineChartDataModel
    {
        public LineChartDataModel()
        {
            Data = new List<double>();
        }
        public string yAxisID { get; set; }
        public string Label { get; set; }
        public List<double> Data { get; set; }
        public string BackgroundColor { get; set; }
        public int BorderWidth { get; set; }
        public bool Fill { get; set; }
        public string Type { get; set; }
        //public int Order { get; set; }
    }
    #endregion

    public class AipmPortfolioResultBarNLineChartModel
    {
        public List<string> Labels { get; set; }
        public List<AipmPortfolioResultBarChartDataModel> Datasets { get; set; }
    }

    public class AipmPortfolioResultBarNLineChartModelv2
    {
        public List<string> Labels { get; set; }
        public List<AipmPortfolioResultBarChartDataModelv2> Datasets { get; set; }
    }

    public class RadarChartDataModel
    {
        public RadarChartDataModel()
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
        //public int Order { get; set; }
    }

    public class StackBarDataModel
    {
        public StackBarDataModel()
        {
            Data = new List<double>();
        }
        public double CategoryPercentage { get; set; }
        //public double BarPercentage { get; set; }
        //public int BarThickness { get; set; }
        //public int MaxBarThickness { get; set; }
        //public int MinBarLength { get; set; }
        public bool Fill { get; set; }
        public string Label { get; set; }
        public List<double> Data { get; set; }
        public string BorderColor { get; set; }
        public string Stack { get; set; }
        public int BorderWidth { get; set; }
        public string BackgroundColor { get; set; }
    }

    #region stack chart
    public class AipmPortfolioResultStackChartModel
    {
        public AipmPortfolioResultStackChartModel()
        {
            Labels = new List<string>();
            Datasets = new List<StackBarDataModel>();
        }

        public List<string> Labels { get; set; }
        public List<StackBarDataModel> Datasets { get; set; }
    }
    #endregion

    #region radar chart
    public class AipmPortfolioResultRadarChartModel
    {
        public AipmPortfolioResultRadarChartModel()
        {
            Labels = new List<string>();
            Datasets = new List<RadarChartDataModel>();
        }

        public List<string> Labels { get; set; }
        public List<RadarChartDataModel> Datasets { get; set; }
    }
    #endregion

    #region Generated Code
    /* GENCODE:MARKER:1:START */

//===============================================================
// TEMPLATE START: AipmPortfolioResultChartModel.cs.1.1.tpl
//===============================================================
    public class PortfolioAnnualBudgetDataSummaryChartModel
    {
        public List<string> Labels { get; set; }
        public List<PortfolioAnnualBudgetDataSummaryDatasets> Datasets { get; set; }
        public List<PortfolioAnnualBudgetDataSummaryResult> SQLData { get; set; }
    } 

    public class PortfolioAnnualBudgetDataSummaryDatasets
    {
        public PortfolioAnnualBudgetDataSummaryDatasets()
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

    public class PortfolioAnnualBudgetDataSummaryInternalChartModel
    {
        public PortfolioAnnualBudgetDataSummaryInternalChartModel()
        {
            Labels = new List<string>();
            Datasets = new List<PortfolioAnnualBudgetDataSummaryDatasets>();
            SQLData = new List<PortfolioAnnualBudgetDataSummaryResult>();
        }

        public List<string> Labels { get; set; }
        public List<PortfolioAnnualBudgetDataSummaryDatasets> Datasets { get; set; }
        public List<PortfolioAnnualBudgetDataSummaryResult> SQLData { get; set; }
    }
//===============================================================
// TEMPLATE END: AipmPortfolioResultChartModel.cs.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: AipmPortfolioResultChartModel.cs.1.2.tpl
//===============================================================
    public class PortfolioBudgetvsStratDataSummaryChartModel
    {
        public PortfolioBudgetvsStratDataSummaryChartModel()
        {
            Labels = new List<string>();
            Datasets = new List<PortfolioBudgetvsStratDataSummaryDatasets>();
            SQLData = new List<PortfolioBudgetvsStratDataSummaryResult>();
        }
        public List<string> Labels { get; set; }
        public List<PortfolioBudgetvsStratDataSummaryDatasets> Datasets { get; set; }
        public List<PortfolioBudgetvsStratDataSummaryResult> SQLData { get; set; }
    }

    public class PortfolioBudgetvsStratDataSummaryDatasets
    {
        public PortfolioBudgetvsStratDataSummaryDatasets()
        {
            Data = new List<double>();
        }
        public double CategoryPercentage { get; set; }
        public bool Fill { get; set; }
        public string Label { get; set; }
        public List<double> Data { get; set; }
        public string BorderColor { get; set; }
        public string Stack { get; set; }
        public int BorderWidth { get; set; }
        public string BackgroundColor { get; set; }
    }
//===============================================================
// TEMPLATE END: AipmPortfolioResultChartModel.cs.1.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: AipmPortfolioResultChartModel.cs.1.3.tpl
//===============================================================
    public class PortfolioNPVvsCommMthDataSummaryChartModel
    {
        public List<string> Labels { get; set; }
        public List<PortfolioNPVvsCommMthDataSummaryDatasets> Datasets { get; set; }
        public List<PortfolioNPVvsCommMthDataSummaryResult> SQLData { get; set; }
    } 

    public class PortfolioNPVvsCommMthDataSummaryDatasets
    {
        public PortfolioNPVvsCommMthDataSummaryDatasets()
        {
            Data = new List<double>();
        }
        public string yAxisID { get; set; }
        public string Label { get; set; }
        public List<double> Data { get; set; }
        public string BackgroundColor { get; set; }
        public string Type { get; set; }
    }

    public class PortfolioNPVvsCommMthDataSummaryInternalChartModel
    {
        public PortfolioNPVvsCommMthDataSummaryInternalChartModel()
        {
            Labels = new List<string>();
            Datasets = new List<PortfolioNPVvsCommMthDataSummaryDatasets>();
            SQLData = new List<PortfolioNPVvsCommMthDataSummaryResult>();
        }

        public List<string> Labels { get; set; }
        public List<PortfolioNPVvsCommMthDataSummaryDatasets> Datasets { get; set; }
        public List<PortfolioNPVvsCommMthDataSummaryResult> SQLData { get; set; }
    }
//===============================================================
// TEMPLATE END: AipmPortfolioResultChartModel.cs.1.3.tpl
//===============================================================


//===============================================================
// TEMPLATE START: AipmPortfolioResultChartModel.cs.1.2.tpl
//===============================================================
    public class PortfolioNPVvsStratDataSummaryChartModel
    {
        public PortfolioNPVvsStratDataSummaryChartModel()
        {
            Labels = new List<string>();
            Datasets = new List<PortfolioNPVvsStratDataSummaryDatasets>();
            SQLData = new List<PortfolioNPVvsStratDataSummaryResult>();
        }
        public List<string> Labels { get; set; }
        public List<PortfolioNPVvsStratDataSummaryDatasets> Datasets { get; set; }
        public List<PortfolioNPVvsStratDataSummaryResult> SQLData { get; set; }
    }

    public class PortfolioNPVvsStratDataSummaryDatasets
    {
        public PortfolioNPVvsStratDataSummaryDatasets()
        {
            Data = new List<double>();
        }
        public double CategoryPercentage { get; set; }
        public bool Fill { get; set; }
        public string Label { get; set; }
        public List<double> Data { get; set; }
        public string BorderColor { get; set; }
        public string Stack { get; set; }
        public int BorderWidth { get; set; }
        public string BackgroundColor { get; set; }
    }
//===============================================================
// TEMPLATE END: AipmPortfolioResultChartModel.cs.1.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: AipmPortfolioResultChartModel.cs.1.4.tpl
//===============================================================
    public class PortfolioCumalRiskvsEleDataSummaryChartModel
    {
        public PortfolioCumalRiskvsEleDataSummaryChartModel()
        {
            Labels = new List<string>();
            Datasets = new List<PortfolioCumalRiskvsEleDataSummaryDatasets>();
            SQLData = new List<PortfolioCumalRiskvsEleDataSummaryResult>();
        }
        public List<string> Labels { get; set; }
        public List<PortfolioCumalRiskvsEleDataSummaryDatasets> Datasets { get; set; }
        public List<PortfolioCumalRiskvsEleDataSummaryResult> SQLData { get; set; }
    }

    public class PortfolioCumalRiskvsEleDataSummaryDatasets
    {
        public PortfolioCumalRiskvsEleDataSummaryDatasets()
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
//===============================================================
// TEMPLATE END: AipmPortfolioResultChartModel.cs.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: AipmPortfolioResultChartModel.cs.1.2.tpl
//===============================================================
    public class PortfolioOSRiskDataSummaryChartModel
    {
        public PortfolioOSRiskDataSummaryChartModel()
        {
            Labels = new List<string>();
            Datasets = new List<PortfolioOSRiskDataSummaryDatasets>();
            SQLData = new List<PortfolioOSRiskDataSummaryResult>();
        }
        public List<string> Labels { get; set; }
        public List<PortfolioOSRiskDataSummaryDatasets> Datasets { get; set; }
        public List<PortfolioOSRiskDataSummaryResult> SQLData { get; set; }
    }

    public class PortfolioOSRiskDataSummaryDatasets
    {
        public PortfolioOSRiskDataSummaryDatasets()
        {
            Data = new List<double>();
        }
        public double CategoryPercentage { get; set; }
        public bool Fill { get; set; }
        public string Label { get; set; }
        public List<double> Data { get; set; }
        public string BorderColor { get; set; }
        public string Stack { get; set; }
        public int BorderWidth { get; set; }
        public string BackgroundColor { get; set; }
    }
//===============================================================
// TEMPLATE END: AipmPortfolioResultChartModel.cs.1.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: AipmPortfolioResultChartModel.cs.1.1.tpl
//===============================================================
    public class PortfolioAnnualBudgetDataAltSummaryChartModel
    {
        public List<string> Labels { get; set; }
        public List<PortfolioAnnualBudgetDataAltSummaryDatasets> Datasets { get; set; }
        public List<PortfolioAnnualBudgetDataAltSummaryResult> SQLData { get; set; }
    } 

    public class PortfolioAnnualBudgetDataAltSummaryDatasets
    {
        public PortfolioAnnualBudgetDataAltSummaryDatasets()
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

    public class PortfolioAnnualBudgetDataAltSummaryInternalChartModel
    {
        public PortfolioAnnualBudgetDataAltSummaryInternalChartModel()
        {
            Labels = new List<string>();
            Datasets = new List<PortfolioAnnualBudgetDataAltSummaryDatasets>();
            SQLData = new List<PortfolioAnnualBudgetDataAltSummaryResult>();
        }

        public List<string> Labels { get; set; }
        public List<PortfolioAnnualBudgetDataAltSummaryDatasets> Datasets { get; set; }
        public List<PortfolioAnnualBudgetDataAltSummaryResult> SQLData { get; set; }
    }
//===============================================================
// TEMPLATE END: AipmPortfolioResultChartModel.cs.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: AipmPortfolioResultChartModel.cs.1.2.tpl
//===============================================================
    public class PortfolioBudgetvsStratDataAltSummaryChartModel
    {
        public PortfolioBudgetvsStratDataAltSummaryChartModel()
        {
            Labels = new List<string>();
            Datasets = new List<PortfolioBudgetvsStratDataAltSummaryDatasets>();
            SQLData = new List<PortfolioBudgetvsStratDataAltSummaryResult>();
        }
        public List<string> Labels { get; set; }
        public List<PortfolioBudgetvsStratDataAltSummaryDatasets> Datasets { get; set; }
        public List<PortfolioBudgetvsStratDataAltSummaryResult> SQLData { get; set; }
    }

    public class PortfolioBudgetvsStratDataAltSummaryDatasets
    {
        public PortfolioBudgetvsStratDataAltSummaryDatasets()
        {
            Data = new List<double>();
        }
        public double CategoryPercentage { get; set; }
        public bool Fill { get; set; }
        public string Label { get; set; }
        public List<double> Data { get; set; }
        public string BorderColor { get; set; }
        public string Stack { get; set; }
        public int BorderWidth { get; set; }
        public string BackgroundColor { get; set; }
    }
//===============================================================
// TEMPLATE END: AipmPortfolioResultChartModel.cs.1.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: AipmPortfolioResultChartModel.cs.1.3.tpl
//===============================================================
    public class PortfolioNPVvsCommMthDataAltSummaryChartModel
    {
        public List<string> Labels { get; set; }
        public List<PortfolioNPVvsCommMthDataAltSummaryDatasets> Datasets { get; set; }
        public List<PortfolioNPVvsCommMthDataAltSummaryResult> SQLData { get; set; }
    } 

    public class PortfolioNPVvsCommMthDataAltSummaryDatasets
    {
        public PortfolioNPVvsCommMthDataAltSummaryDatasets()
        {
            Data = new List<double>();
        }
        public string yAxisID { get; set; }
        public string Label { get; set; }
        public List<double> Data { get; set; }
        public string BackgroundColor { get; set; }
        public string Type { get; set; }
    }

    public class PortfolioNPVvsCommMthDataAltSummaryInternalChartModel
    {
        public PortfolioNPVvsCommMthDataAltSummaryInternalChartModel()
        {
            Labels = new List<string>();
            Datasets = new List<PortfolioNPVvsCommMthDataAltSummaryDatasets>();
            SQLData = new List<PortfolioNPVvsCommMthDataAltSummaryResult>();
        }

        public List<string> Labels { get; set; }
        public List<PortfolioNPVvsCommMthDataAltSummaryDatasets> Datasets { get; set; }
        public List<PortfolioNPVvsCommMthDataAltSummaryResult> SQLData { get; set; }
    }
//===============================================================
// TEMPLATE END: AipmPortfolioResultChartModel.cs.1.3.tpl
//===============================================================


//===============================================================
// TEMPLATE START: AipmPortfolioResultChartModel.cs.1.2.tpl
//===============================================================
    public class PortfolioNPVvsStratDataAltSummaryChartModel
    {
        public PortfolioNPVvsStratDataAltSummaryChartModel()
        {
            Labels = new List<string>();
            Datasets = new List<PortfolioNPVvsStratDataAltSummaryDatasets>();
            SQLData = new List<PortfolioNPVvsStratDataAltSummaryResult>();
        }
        public List<string> Labels { get; set; }
        public List<PortfolioNPVvsStratDataAltSummaryDatasets> Datasets { get; set; }
        public List<PortfolioNPVvsStratDataAltSummaryResult> SQLData { get; set; }
    }

    public class PortfolioNPVvsStratDataAltSummaryDatasets
    {
        public PortfolioNPVvsStratDataAltSummaryDatasets()
        {
            Data = new List<double>();
        }
        public double CategoryPercentage { get; set; }
        public bool Fill { get; set; }
        public string Label { get; set; }
        public List<double> Data { get; set; }
        public string BorderColor { get; set; }
        public string Stack { get; set; }
        public int BorderWidth { get; set; }
        public string BackgroundColor { get; set; }
    }
//===============================================================
// TEMPLATE END: AipmPortfolioResultChartModel.cs.1.2.tpl
//===============================================================


//===============================================================
// TEMPLATE START: AipmPortfolioResultChartModel.cs.1.4.tpl
//===============================================================
    public class PortfolioCumalRiskvsEleDataAltSummaryChartModel
    {
        public PortfolioCumalRiskvsEleDataAltSummaryChartModel()
        {
            Labels = new List<string>();
            Datasets = new List<PortfolioCumalRiskvsEleDataAltSummaryDatasets>();
            SQLData = new List<PortfolioCumalRiskvsEleDataAltSummaryResult>();
        }
        public List<string> Labels { get; set; }
        public List<PortfolioCumalRiskvsEleDataAltSummaryDatasets> Datasets { get; set; }
        public List<PortfolioCumalRiskvsEleDataAltSummaryResult> SQLData { get; set; }
    }

    public class PortfolioCumalRiskvsEleDataAltSummaryDatasets
    {
        public PortfolioCumalRiskvsEleDataAltSummaryDatasets()
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
//===============================================================
// TEMPLATE END: AipmPortfolioResultChartModel.cs.1.4.tpl
//===============================================================


//===============================================================
// TEMPLATE START: AipmPortfolioResultChartModel.cs.1.2.tpl
//===============================================================
    public class PortfolioOSRiskDataAltSummaryChartModel
    {
        public PortfolioOSRiskDataAltSummaryChartModel()
        {
            Labels = new List<string>();
            Datasets = new List<PortfolioOSRiskDataAltSummaryDatasets>();
            SQLData = new List<PortfolioOSRiskDataAltSummaryResult>();
        }
        public List<string> Labels { get; set; }
        public List<PortfolioOSRiskDataAltSummaryDatasets> Datasets { get; set; }
        public List<PortfolioOSRiskDataAltSummaryResult> SQLData { get; set; }
    }

    public class PortfolioOSRiskDataAltSummaryDatasets
    {
        public PortfolioOSRiskDataAltSummaryDatasets()
        {
            Data = new List<double>();
        }
        public double CategoryPercentage { get; set; }
        public bool Fill { get; set; }
        public string Label { get; set; }
        public List<double> Data { get; set; }
        public string BorderColor { get; set; }
        public string Stack { get; set; }
        public int BorderWidth { get; set; }
        public string BackgroundColor { get; set; }
    }
//===============================================================
// TEMPLATE END: AipmPortfolioResultChartModel.cs.1.2.tpl
//===============================================================

    /* GENCODE:MARKER:1:END */
    #endregion
}