%macro create_and_print_dataset(dsname);

/* Print the dataset */
proc print data=&dsname.;
run;

%mend create_and_print_dataset;

/* GENCODE:MARKER:1:START */
/* GENCODE:MARKER:1:END */

/* Some other code blocks */
%put Do some other stuff here;

/* GENCODE:MARKER:2:START */
/* GENCODE:MARKER:2:END */