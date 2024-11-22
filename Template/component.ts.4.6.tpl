  do##BLOCK##() {
    if (this.##BLOCK##) {
      this.##BLOCK##.destroy();
    }

    this.##BLOCK## = new Chart(this.##BLOCK##Ref.nativeElement, {
      type: "line",
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
              beginAtZero: true
            }
          }]
        },
      },
    });
  }