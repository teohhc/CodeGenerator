using System.Collections.Generic;

namespace Tts.Business.ViewModels.Aipm
{
    public class PortfolioOptSummaryProjects
    {
        public int Plan_ID { get; set; }
        public double? Total_Budget { get; set; }
        public double? BUDY1 { get; set; }
        public double? BUDY2 { get; set; }
        public double? BUDY3 { get; set; }
        public double? BUDY4 { get; set; }
        public double? BUDY5 { get; set; }
        public double? BUDY6 { get; set; }
        public double? BUDY7 { get; set; }
        public double? BUDY8 { get; set; }
        public double? Project_Score { get; set; }
        public double? Risk_Reduced { get; set; }
    }
    public class PortfolioOptSummaryResult
    {
        public int ID { get; set; }
        public int Plan_ID { get; set; }
        public string Summary { get; set; }
        public double? BudgetBeforeRevised { get; set; }
        public double? TotalBudget { get; set; }
        public double? ProjectScore { get; set; }
        public double? RiskReduced { get; set; }
        public double? TCOOpex { get; set; }
        public double? TCOTotalProjectCost { get; set; }
        public double? NPVRiskReduced { get; set; }
        public double? BUDY1 { get; set; }
        public double? BUDY2 { get; set; }
        public double? BUDY3 { get; set; }
        public double? BUDY4 { get; set; }
        public double? BUDY5 { get; set; }
        public double? BUDY6 { get; set; }
        public double? BUDY7 { get; set; }
        public double? BUDY8 { get; set; }
        public double? BeyondHorizon { get; set; }
        public int TotalProject { get; set; }
    }
    public class UIGrid
    {
        public List<UIGridColumn> Columns { get; set; } = new List<UIGridColumn>();
        public UIGridRule Rule { get; set; } = new UIGridRule();
        public List<Dictionary<string, object>> Data { get; set; } = new List<Dictionary<string, object>>();
        public void AddColumn(UIGridColumn column)
        {
            int idx = Columns.FindIndex(x => x.columnName == column.columnName);
            if (idx >= 0)
            {
                Columns[idx] = null;
                Columns[idx] = column;
            }
            else
                Columns.Add(column);
        }

    }

    public class UIGridColumn
    {
        // These are copied from the existing configuration at UI
        public string displayName { get; set; } = ""; // display text
        public string columnName { get; set; } = ""; // Must be unique
        public int columnTypeId { get; set; } = 1; // { 1:Text, 2:DropDown, 3:Date_Range, 4:Number, 5:Number_Range, 6:Boolean }
        public string columnType { get; set; } = UIGridColumnType.Text;
        public string columnWidth { get; set; } = "auto";
        public bool isSearchable { get; set; } = false;
        public bool isSortable { get; set; } = false;
        public bool display { get; set; } = true;
        public int order { get; set; } = 1;
        public string toolTip { get; set; } = "";
        public string value { get; set; } = "";
    }
    public static class UIGridColumnType
    {
        public static readonly string Text = "Text";
        public static readonly string DropDownList = "DropDown";
    }

    public class UIGridRule
    {
        public UIGridFreezeColumn Freeze { get; set; } = new UIGridFreezeColumn();

        // Sample: [{ ColumnName, { 'type': 'number', 'format': 1.2-2 } }]
        public Dictionary<string, UIGridColumnFormat> Format { get; set; } = new Dictionary<string, UIGridColumnFormat>();

        // Method (Freeze)
        public void AddLeftFreeze(string columnName)
        {
            if (this.VerifyFreezeRule(columnName, "left"))
                Freeze.Left.Add(columnName);
        }
        public void AddRightFreeze(string columnName)
        {
            if (this.VerifyFreezeRule(columnName, "right"))
                Freeze.Right.Add(columnName);
        }
        private bool VerifyFreezeRule(string columnName, string position)
        {
            if (string.IsNullOrEmpty(columnName.Trim()))
                return false;
            else
            {
                int lidx = Freeze.Left.FindIndex(x => x == columnName);
                int ridx = Freeze.Right.FindIndex(x => x == columnName);
                if (
                    (lidx > -1 && ridx > -1) ||
                    (position == "left" && lidx > -1) ||
                    (position == "right" && ridx > -1)
                )
                    return false;
            }

            return true;
        }

        // Method (Format)
        public void SetNumberFormat(string columnName, int minIntegerDigits, int minFractionDigits, int maxFractionDigits)
        {
            if (maxFractionDigits < minFractionDigits)
                maxFractionDigits = minFractionDigits;

            this.SetFormat(columnName, "number", $"{minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}");
        }
        public void SetDateTimeFormat(string columnName, string format)
        {
            this.SetFormat(columnName, "date", format);
        }
        private void SetFormat(string columnName, string formatType, string format)
        {
            if (!string.IsNullOrEmpty(columnName.Trim()) && !Format.ContainsKey(columnName))
                Format.Add(columnName, new UIGridColumnFormat(formatType, format));
        }

    }
    
    public class UIGridFreezeColumn
    {
        public List<string> Left { get; set; } = new List<string>();
        public List<string> Right { get; set; } = new List<string>();
    }

    public class UIGridColumnFormat
    {
        public UIGridColumnFormat(string type, string format)
        {
            this.Type = type;
            this.Format = format;
        }
        public string Type { get; set; }
        public string Format { get; set; }

        public class FormatType
        {
            public static readonly string Number = "number";
            public static readonly string Date = "date";
        }
    }

    /* GENCODE:MARKER:1:START */

//===============================================================
// TEMPLATE START: PortfolioOptSummaryProjects.cs.1.1.tpl
//===============================================================
    public class PortfolioAnnualBudgetDataSummaryResult
    {
        
 public string Year { get; set; }
 public string Filler { get; set; }
 public double? BUDY { get; set; }
    }
//===============================================================
// TEMPLATE END: PortfolioOptSummaryProjects.cs.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: PortfolioOptSummaryProjects.cs.1.1.tpl
//===============================================================
    public class PortfolioBudgetvsStratDataSummaryResult
    {
        
 public string Year { get; set; }
 public string UDStrategicObjective { get; set; }
 public double? BUDY { get; set; }
    }
//===============================================================
// TEMPLATE END: PortfolioOptSummaryProjects.cs.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: PortfolioOptSummaryProjects.cs.1.1.tpl
//===============================================================
    public class PortfolioNPVvsCommMthDataSummaryResult
    {
        
 public string Year { get; set; }
 public int? YearIndex { get; set; }
 public double? NPV_RiskReduced { get; set; }
    }
//===============================================================
// TEMPLATE END: PortfolioOptSummaryProjects.cs.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: PortfolioOptSummaryProjects.cs.1.1.tpl
//===============================================================
    public class PortfolioNPVvsStratDataSummaryResult
    {
        
 public string Year { get; set; }
 public string UDStrategicObjective { get; set; }
 public double? NPV_RiskReduced { get; set; }
    }
//===============================================================
// TEMPLATE END: PortfolioOptSummaryProjects.cs.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: PortfolioOptSummaryProjects.cs.1.1.tpl
//===============================================================
    public class PortfolioCumalRiskvsEleDataSummaryResult
    {
        
 public string CommYear { get; set; }
 public int? PrjCnt { get; set; }
 public double? Safety { get; set; }
 public double? Compliance { get; set; }
 public double? Financial { get; set; }
 public double? Reliability { get; set; }
 public double? Environment { get; set; }
 public double? Customer { get; set; }
    }
//===============================================================
// TEMPLATE END: PortfolioOptSummaryProjects.cs.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: PortfolioOptSummaryProjects.cs.1.1.tpl
//===============================================================
    public class PortfolioOSRiskDataSummaryResult
    {
        
 public string Year { get; set; }
 public string Description { get; set; }
 public double? Value { get; set; }
    }
//===============================================================
// TEMPLATE END: PortfolioOptSummaryProjects.cs.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: PortfolioOptSummaryProjects.cs.1.1.tpl
//===============================================================
    public class PortfolioAnnualBudgetDataAltSummaryResult
    {
        
 public string Year { get; set; }
 public string Filler { get; set; }
 public double? BUDY { get; set; }
    }
//===============================================================
// TEMPLATE END: PortfolioOptSummaryProjects.cs.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: PortfolioOptSummaryProjects.cs.1.1.tpl
//===============================================================
    public class PortfolioBudgetvsStratDataAltSummaryResult
    {
        
 public string Year { get; set; }
 public string UDStrategicObjective { get; set; }
 public double? BUDY { get; set; }
    }
//===============================================================
// TEMPLATE END: PortfolioOptSummaryProjects.cs.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: PortfolioOptSummaryProjects.cs.1.1.tpl
//===============================================================
    public class PortfolioNPVvsCommMthDataAltSummaryResult
    {
        
 public string Year { get; set; }
 public int? YearIndex { get; set; }
 public double? NPV_RiskReduced { get; set; }
    }
//===============================================================
// TEMPLATE END: PortfolioOptSummaryProjects.cs.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: PortfolioOptSummaryProjects.cs.1.1.tpl
//===============================================================
    public class PortfolioNPVvsStratDataAltSummaryResult
    {
        
 public string Year { get; set; }
 public string UDStrategicObjective { get; set; }
 public double? NPV_RiskReduced { get; set; }
    }
//===============================================================
// TEMPLATE END: PortfolioOptSummaryProjects.cs.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: PortfolioOptSummaryProjects.cs.1.1.tpl
//===============================================================
    public class PortfolioCumalRiskvsEleDataAltSummaryResult
    {
        
 public string CommYear { get; set; }
 public int? PrjCnt { get; set; }
 public double? Safety { get; set; }
 public double? Compliance { get; set; }
 public double? Financial { get; set; }
 public double? Reliability { get; set; }
 public double? Environment { get; set; }
 public double? Customer { get; set; }
    }
//===============================================================
// TEMPLATE END: PortfolioOptSummaryProjects.cs.1.1.tpl
//===============================================================


//===============================================================
// TEMPLATE START: PortfolioOptSummaryProjects.cs.1.1.tpl
//===============================================================
    public class PortfolioOSRiskDataAltSummaryResult
    {
        
 public string Year { get; set; }
 public string Description { get; set; }
 public double? Value { get; set; }
    }
//===============================================================
// TEMPLATE END: PortfolioOptSummaryProjects.cs.1.1.tpl
//===============================================================

    /* GENCODE:MARKER:1:END */
}