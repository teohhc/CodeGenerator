/* Call the macro */
%let dsname=##BLOCK##;
data &dsname.;
    input Name $ Age Height Weight;
    datalines;
John 25 175 70
Jane 30 165 60
Tom 22 180 75
Lucy 28 170 65
;
run;
%create_and_print_dataset(&dsname.);