  do##BLOCK##() {
    function drawDatasetPointsLabels(obj) {
      var chartInstance = obj.chart;
      var ctx = chartInstance.ctx;
      ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
      ctx.textAlign = "center";
      ctx.fillStyle = "#666";

      var plotted = {};
      var idx=0;
      Chart.helpers.each(obj.data.datasets.forEach(function (dataset, i) {
        var meta = chartInstance.controller.getDatasetMeta(i);
        var hidden = chartInstance.controller.getDatasetMeta(i).hidden;

        if (hidden==null || hidden !=true) {
          plotted[idx]={};
          var type = meta.type;
          Chart.helpers.each(meta.data.forEach(function (bar, index) {
            var centerPoint = bar.getCenterPoint();
            var pad=0;
            
            plotted[idx][index] = {
              'val':dataset.data[index],
              'x':centerPoint.x,
              'y':centerPoint.y,
              'visible':hidden,
              'type':type
            };
          }),obj);
          idx++;
        }            
      }),obj);
      
      var lineMinX=null;
      var lineMinY=null;
      var lineMaxX=null;
      var lineMaxY=null;
      var lineFlag=null;
      var lineVal="";
      for (var row in plotted) {
        var i = Number(row);
        for (var column in plotted[row]) {
          var c = Number(column);
          var pad=0;
          if (plotted[i][c]['type']=='bar') {
            // Suppress if 0
            if (plotted[i][c]['val']!=0) {
                  // check overlap
                  /* Commented doesn't work for negative value
                  var prev=1;
                  if (i>0) {
                      while (i-prev>0 && plotted[i-prev][c]['val']==0) {
                          prev++;
                      }
                      if (plotted[i-prev][c]['val']!=0) {
                          var gap = (plotted[i][c]['y']+10) - plotted[i-prev][c]['y'];
                          if (gap>0) {
                              pad = gap;
                          }
                      }
                  } else {
                      var gap = plotted[i][c]['y'];
                  }
                  plotted[i][c]['y']=plotted[i][c]['y']-pad; */
                  ctx.fillText(plotted[i][c]['val'], plotted[i][c]['x'], plotted[i][c]['y']);
            }
          } else {
            lineFlag=1;
            lineVal=plotted[i][c]['val'];
            if (lineMinX>plotted[i][c]['x'] || lineMinX == null) {
              lineMinX = plotted[i][c]['x'];
            }
            if (lineMaxX<plotted[i][c]['x'] || lineMaxX == null) {
              lineMaxX = plotted[i][c]['x'];
            }
            if (lineMinY>plotted[i][c]['y'] || lineMinY == null) {
              lineMinY = plotted[i][c]['y'];
            }
            if (lineMaxY<plotted[i][c]['y'] || lineMaxY == null) {
              lineMaxY = plotted[i][c]['y'];
            }
          }
        }
      }
      if (lineFlag) {
        var midX = (lineMinX+lineMaxX)/2;
        var midY = (lineMinY+lineMaxY)/2;
        ctx.fillText(lineVal, midX, midY);
      }
    }

    if (this.##BLOCK##) {
      this.##BLOCK##.destroy();
    }

    var ##BLOCK##DS = this.##BLOCK##Data.datasets.filter(a => a.type == "bar");
    var maxBarData = 0;
    ##BLOCK##DS[0].data.forEach(x =>{
      if (maxBarData < x){
        maxBarData = x;
      }
    });

    var ##BLOCK##_Y2 = (Math.ceil(this.##BLOCK##Data.datasets.filter(a => a.type == "line")[0].data[0]/10)) * 11;
    var ##BLOCK##_Y = (Math.ceil(maxBarData/10)) * 11;

    this.##BLOCK## = new Chart(this.##BLOCK##Ref.nativeElement, {
      type: "bar",
      data: this.##BLOCK##Data,      
      options: {
        legend: {
            display: false
        },
        title: {
            display: true,
            text: '##RESOLVE(Title, TitleText, 1)##',
            fontSize: ##RESOLVE(Title, TitleFontSize, 1)##,
        },
        responsive: true,
        scales: {
          xAxes: [{
          }],
          yAxes: [{
            id: "##RESOLVE(Title, YAxes1ID, 1)##",
            position: 'left',
            scaleLabel: {
              display: true,
              labelString: "##RESOLVE(Title, YAxes1, 1)##"
            },
            ticks: {  
              callback: function(label, index, labels) {
                return label.toLocaleString('en-GB', {style:"currency", currency:"MYR"}).replace('MYR', '') + ' (Mil)';
              },
              beginAtZero: true,
              max: ##BLOCK##_Y,
              stepSize: ##BLOCK##_Y/10
            }
          },
          {
            id:"##RESOLVE(Title, YAxes2ID, 1)##",
            position: 'right',
            scaleLabel: {
              display: true,
              labelString: "##RESOLVE(Title, YAxes2, 1)##"
            },
            ticks: {
              callback: function(label, index, labels) {
                return label.toLocaleString('en-GB', {style:"currency", currency:"MYR"}).replace('MYR', '') + ' (Mil)';
              },
              beginAtZero: true,
              max: ##BLOCK##_Y2,
              stepSize: ##BLOCK##_Y2/10
            }
          }]
        },
        animation: {
          onProgress: function () {drawDatasetPointsLabels(this)},
          onComplete: function () {drawDatasetPointsLabels(this)}
        }
      },
    });
  }