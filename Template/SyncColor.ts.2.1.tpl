  normalizeLabel(token) {
    var result = token;
    if (token=='') {
      result = '#BLANK#';
    }
    return result;
  }

  getColorbyLabel(title, label, color) {
    var found = false;
    if (this.compareChartColors.hasOwnProperty(title)) {
      if (this.compareChartColors[title]['LABEL'].hasOwnProperty(label)) {
        found = true;
        color = this.compareChartColors[title]['LABEL'][this.normalizeLabel(label)]
      }
    }
    return {'found':found, 'color':color}
  }

  checkColor(title, color) {
    var found = false;
    if (this.compareChartColors.hasOwnProperty(title)) {
      if (this.compareChartColors[title]['COLOR'].hasOwnProperty(color)) {
        found = true;
      }
    }
    return {'found':found, 'color':color}
  }

  getNewColor(title) {
    var colorIdx=0;
    var color = this.compareFixedColorList[colorIdx];
    while (this.checkColor(title, color).found) {
      if (this.compareFixedColorList.length-1 > colorIdx) {
        ++colorIdx;
        // color = this.compareFixedColorList[colorIdx];
        color = this.modifyAlpha(this.compareFixedColorList[colorIdx], 0.5);
      } else {
        color = "rgba(255,255,255,0.5)";
        break;
      }
    }
    return color;
  }

  addChartColor(title, color, label) {
    if (!this.compareChartColors.hasOwnProperty(title)) {
      this.compareChartColors[title]={};
    }
    if (!this.compareChartColors[title].hasOwnProperty('COLOR')) {
      this.compareChartColors[title]['COLOR']={};
    }
    if (!this.compareChartColors[title]['COLOR'].hasOwnProperty(color)) {
      this.compareChartColors[title]['COLOR'][color] = label;
    }
  }

  addChartLabel(title, color, label) {
    if (!this.compareChartColors.hasOwnProperty(title)) {
      this.compareChartColors[title]={};
    }
    if (!this.compareChartColors[title].hasOwnProperty('LABEL')) {
      this.compareChartColors[title]['LABEL']={};
    }
    if (!this.compareChartColors[title]['LABEL'].hasOwnProperty(label)) {
      this.compareChartColors[title]['LABEL'][label] = color;
    }    
  }

  modifyAlpha(rgbaString, alphaValue) {
    // Use a regular expression to match the rgba values
    const rgbaRegex = ##PRESERVE(/rgba\((\d{1,3}),(\d{1,3}),(\d{1,3}),(\d*\.?\d+)\)/)##;
    
    // Replace the existing alpha value with the new alphaValue parameter
    const newRgbaString = rgbaString.replace(rgbaRegex, `rgba($1,$2,$3,${alphaValue})`);
    
    return newRgbaString;
  }

  adjustColor(title, chartData) {
    for (var row in chartData['datasets']) {
      var label = this.normalizeLabel(chartData['datasets'][row]['label']);
      var color = chartData['datasets'][row]['backgroundColor'];
      var labelResult = this.getColorbyLabel(title, label, color);
      // Check for existing label
      if (labelResult.found) {
        chartData['datasets'][row]['backgroundColor'] = labelResult.color;
        chartData['datasets'][row]['borderColor'] = this.modifyAlpha(labelResult.color, 1);
      } else {
        // New label treatment
        var colorResult = this.checkColor(title, color);
        if (colorResult.found) { // existing color is in use
          color = this.getNewColor(title);
          chartData['datasets'][row]['backgroundColor'] = color;
          // chartData['datasets'][row]['borderColor'] = this.modifyAlpha(color, 1);
          chartData['datasets'][row]['borderColor'] = color;
        }
        this.addChartColor(title, color, label);
        this.addChartLabel(title, color, label);
      }
    }
    return chartData;
  }