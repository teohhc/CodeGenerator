  do##BLOCK##() {

    function drawDatasetPointsLabels(obj) {
      var chartInstance = obj.chart;
      var ctx = chartInstance.ctx;
      ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
      ctx.textAlign = "center";
      var plotted = {};
      var idx=0;
      Chart.helpers.each(obj.data.datasets.forEach(function (dataset, i) {
        var meta = chartInstance.controller.getDatasetMeta(i);
        var hidden = chartInstance.controller.getDatasetMeta(i).hidden;

        if (hidden==null || hidden !=true) {
          plotted[idx]={};
          Chart.helpers.each(meta.data.forEach(function (bar, index) {
            var centerPoint = bar.getCenterPoint();
            var pad=0;
            
            plotted[idx][index] = {
              'val':dataset.data[index],
              'x':centerPoint.x,
              'y':centerPoint.y,
              'visible':hidden
            };
          }),obj);
          idx++;
        }            
      }),obj);
      
      for (var row in plotted) {
        var i = Number(row);
        for (var column in plotted[row]) {
          var c = Number(column);
          var pad=0;
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
        }
      }
    }

    if (this.##BLOCK##) {
      this.##BLOCK##.destroy();
    }

    this.##BLOCK##Data = this.adjustColor('##RESOLVE(Title, TitleText, 1)##', this.##BLOCK##Data);

    this.##BLOCK## = new Chart(this.##BLOCK##Ref.nativeElement, {
        type: "bar",
        data: this.##BLOCK##Data,      
   
        options: {
            title: {
                display: true,
                text: '##RESOLVE(Title, TitleText, 1)##',
                fontSize: ##RESOLVE(Title, TitleFontSize, 1)##
            },
            scales: {
                xAxes: [{
                    stacked: true
                }],
                yAxes: [{
                    stacked: true,
                    scaleLabel: {
                            display: true,
                            labelString: "##RESOLVE(Title, YAxes1, 1)##",
                    },
                    ticks: {
                            callback: function(value, index, values) {
                                    // Customize the currency sign and format
                                    return 'MYR' + value + ' (Mil)';
                            }
                    }
                }]
            },
            animation: {
              onProgress: function () {drawDatasetPointsLabels(this)},
              onComplete: function () {drawDatasetPointsLabels(this)}
            }
        }
    });
  }