  do##BLOCK##() {
    if (this.##BLOCK##) {
      this.##BLOCK##.destroy();
    }

    this.##BLOCK## = new Chart(this.##BLOCK##Ref.nativeElement, {
        type: "radar",
        data: this.##BLOCK##Data,
        options : {
            title: {
                display: ##RESOLVE(Title, TitleDisplay, 1)##,
                text: '##RESOLVE(Title, TitleText, 1)##',
                fontSize: ##RESOLVE(Title, TitleFontSize, 1)##
            },
        
            scale: {
                angleLines: {
                    display: false
                },
            }
        }
    });
  }