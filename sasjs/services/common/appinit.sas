/**
  @file appinit.sas
  @brief Initialisation service - runs on app startup
  @details  This is always the first service called when the app is opened.

  The deployed code includes the `serviceinit.sas`, as defined in the
  `sasjs/sasjsconfig.json` file.

  <h4> SAS Macros </h4>

**/

proc sql;
create table areas as select distinct area
  from mydb.springs;

%webout(OPEN)
%webout(OBJ,areas)
%webout(CLOSE)
