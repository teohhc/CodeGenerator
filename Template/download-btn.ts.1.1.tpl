  downloadChart(chartName) {
    //console.log('Downloading Chart:'+chartName);
    var node:any = document.getElementById(chartName);
    htmlToImage.toJpeg(node)
      .then(function (dataUrl) {
        var img = new Image();
        img.src = dataUrl;
        saveAs(img.src, chartName+'.jpg');
      })
      .catch(function (error) {
        console.error('oops, something went wrong!', error);
      });
  }

  downloadExcel(chartName, chartData) {
    //console.log('Downloading Excel:');
    //console.log(chartData.sqlData);
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(chartData.sqlData);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, chartName);
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  /* tag consists:-
    This functions will create the sqlData dict.
    It takes an object and creates the sqlData as a child if doesn't exists.
    Then it takes resultset from data. Each resultset is a group of records.
    Tag is the name given to the group. Tagname is the logical group of these tags.
    Tagname appears as a column name in the final excel.
  */
  appendToSqlData(obj, data, tag, tagname, suppressTag) {
    if (!obj.hasOwnProperty('sqlData')) {
      obj.sqlData = [];
    }
    for (var rowIdx=0; rowIdx < data.length; rowIdx++) {
      var resultSet = data[rowIdx].data;
      if (tag[rowIdx]) {
        for (var row in resultSet) {
          var newRow = resultSet[row];
          newRow[tagname]=tag[rowIdx];
          for (var i in suppressTag) {
            if (newRow.hasOwnProperty(suppressTag[i])) {
              delete newRow[suppressTag[i]];
            }
          }
          obj.sqlData.push(newRow);
        }
      }
    }
  }

  downloadExcelTreated(chartName, chartData, tag, tagname, suppressTag) {
    if (chartData.hasOwnProperty('sqlData')) {
      delete chartData.sqlData;
    }
    this.appendToSqlData(chartData, chartData, tag, tagname, suppressTag);
    this.downloadExcel(chartName, chartData);
  }