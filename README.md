# Overview

This seed app provides a wrapper for `@sasjs/adapter`, a lightning fast adapter for talking to both SAS 9 and Viya.

## Frontend Web

Clone the repo, `cd` into it, and `npm install`.  Then update the following in `sas.service.ts`:

* `appLoc` - the location in the metadata or viya folder tree where the backend services will be located.
* `serverType` - either SAS9 or SASVIYA.
* `serverUrl` - only relevant if not serving from the SAS domain (`!SASCONFIG/LevX/Web/WebServer/htdocs` in SAS9 or `/var/www/html` on SAS Viya)
* `useComputeApi` - can be `true` or `false`, it's a switch for SASjs adapter whether to use `Compute` approach while doing requests.
* `contextName` - only relevant if `useComputeApi` is true. Provides a context name that will be used in adapter.

More details in official @SASjs/adapter documentation: https://sasjs.io/sasjs-adapter/#configuration

If you are running locally you will either need to whitelist `localhost` on the server, or enable CORS as described [here](https://sasjs.io/cors)

## Backend Services

Creating services in SAS 9 or Viya can be done entirely in SAS Studio using the code below.

```
%let appLoc=/Public/app/angular;  /* Metadata or Viya root folder */
filename mc url "https://raw.githubusercontent.com/sasjs/core/main/all.sas";
%inc mc;  /* download and compile macro core library */
filename ft15f001 temp;
parmcards4;
    proc sql;
    create table areas as select distinct area from sashelp.springs;
    %webout(OPEN)
    %webout(OBJ,areas)
    %webout(CLOSE)
;;;;
%mp_createwebservice(path=&appLoc/common, name=appinit)
parmcards4;
    %webout(FETCH)
    proc sql;
    create table springs as select * from sashelp.springs
      where area in (select area from areas);
    %webout(OPEN)
    %webout(OBJ,springs)
    %webout(CLOSE)
;;;;
%mp_createwebservice(path=&appLoc/common, name=getdata)
```

For building anything other than a seed app, we recommend the `@sasjs/cli` tool for project configuration.




