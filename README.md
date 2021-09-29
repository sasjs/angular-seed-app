# Overview
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-7-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

This seed app provides a wrapper for `@sasjs/adapter`, a lightning fast adapter for talking to both SAS 9 and Viya.

## Frontend Web

Clone the repo, `cd` into it, and `npm install`. Then update the following in `sas.service.ts`:

- `appLoc` - the location in the metadata or viya folder tree where the backend services will be located.
- `serverType` - either SAS9 or SASVIYA.
- `serverUrl` - only relevant if not serving from the SAS domain (`!SASCONFIG/LevX/Web/WebServer/htdocs` in SAS9 or `/var/www/html` on SAS Viya)
- `useComputeApi` - can be `true` or `false`, it's a switch for SASjs adapter whether to use `Compute` approach while doing requests.
- `contextName` - only relevant if `useComputeApi` is true. Provides a context name that will be used in adapter.

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
%mp_createwebservice(path=&appLoc/services/common, name=appinit)
parmcards4;
    %webout(FETCH)
    proc sql;
    create table springs as select * from sashelp.springs
      where area in (select area from areas);
    %webout(OPEN)
    %webout(OBJ,springs)
    %webout(CLOSE)
;;;;
%mp_createwebservice(path=&appLoc/services/common, name=getdata)
```

For building anything other than a seed app, we recommend the `@sasjs/cli` tool for project configuration.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/allanbowe"><img src="https://avatars.githubusercontent.com/u/4420615?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Allan Bowe</b></sub></a><br /><a href="https://github.com/sasjs/angular-seed-app/commits?author=allanbowe" title="Code">💻</a> <a href="https://github.com/sasjs/angular-seed-app/commits?author=allanbowe" title="Tests">⚠️</a> <a href="https://github.com/sasjs/angular-seed-app/pulls?q=is%3Apr+reviewed-by%3Aallanbowe" title="Reviewed Pull Requests">👀</a> <a href="#video-allanbowe" title="Videos">📹</a> <a href="https://github.com/sasjs/angular-seed-app/commits?author=allanbowe" title="Documentation">📖</a></td>
    <td align="center"><a href="https://www.erudicat.com/"><img src="https://avatars.githubusercontent.com/u/25773492?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Yury Shkoda</b></sub></a><br /><a href="https://github.com/sasjs/angular-seed-app/commits?author=YuryShkoda" title="Code">💻</a> <a href="https://github.com/sasjs/angular-seed-app/commits?author=YuryShkoda" title="Tests">⚠️</a> <a href="#projectManagement-YuryShkoda" title="Project Management">📆</a> <a href="#video-YuryShkoda" title="Videos">📹</a> <a href="https://github.com/sasjs/angular-seed-app/commits?author=YuryShkoda" title="Documentation">📖</a></td>
    <td align="center"><a href="https://krishna-acondy.io/"><img src="https://avatars.githubusercontent.com/u/2980428?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Krishna Acondy</b></sub></a><br /><a href="https://github.com/sasjs/angular-seed-app/commits?author=krishna-acondy" title="Code">💻</a> <a href="https://github.com/sasjs/angular-seed-app/commits?author=krishna-acondy" title="Tests">⚠️</a> <a href="https://github.com/sasjs/angular-seed-app/pulls?q=is%3Apr+reviewed-by%3Akrishna-acondy" title="Reviewed Pull Requests">👀</a> <a href="#infra-krishna-acondy" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#platform-krishna-acondy" title="Packaging/porting to new platform">📦</a> <a href="#maintenance-krishna-acondy" title="Maintenance">🚧</a> <a href="#content-krishna-acondy" title="Content">🖋</a></td>
    <td align="center"><a href="https://github.com/saadjutt01"><img src="https://avatars.githubusercontent.com/u/8914650?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Muhammad Saad </b></sub></a><br /><a href="https://github.com/sasjs/angular-seed-app/commits?author=saadjutt01" title="Code">💻</a> <a href="https://github.com/sasjs/angular-seed-app/commits?author=saadjutt01" title="Tests">⚠️</a> <a href="https://github.com/sasjs/angular-seed-app/pulls?q=is%3Apr+reviewed-by%3Asaadjutt01" title="Reviewed Pull Requests">👀</a> <a href="#mentoring-saadjutt01" title="Mentoring">🧑‍🏫</a> <a href="https://github.com/sasjs/angular-seed-app/commits?author=saadjutt01" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/sabhas"><img src="https://avatars.githubusercontent.com/u/82647447?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Sabir Hassan</b></sub></a><br /><a href="https://github.com/sasjs/angular-seed-app/commits?author=sabhas" title="Code">💻</a> <a href="https://github.com/sasjs/angular-seed-app/commits?author=sabhas" title="Tests">⚠️</a> <a href="https://github.com/sasjs/angular-seed-app/pulls?q=is%3Apr+reviewed-by%3Asabhas" title="Reviewed Pull Requests">👀</a> <a href="#ideas-sabhas" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/medjedovicm"><img src="https://avatars.githubusercontent.com/u/18329105?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Mihajlo Medjedovic</b></sub></a><br /><a href="https://github.com/sasjs/angular-seed-app/commits?author=medjedovicm" title="Code">💻</a> <a href="https://github.com/sasjs/angular-seed-app/commits?author=medjedovicm" title="Tests">⚠️</a> <a href="https://github.com/sasjs/angular-seed-app/pulls?q=is%3Apr+reviewed-by%3Amedjedovicm" title="Reviewed Pull Requests">👀</a> <a href="#infra-medjedovicm" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
    <td align="center"><a href="https://github.com/VladislavParhomchik"><img src="https://avatars.githubusercontent.com/u/83717836?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Vladislav Parhomchik</b></sub></a><br /><a href="https://github.com/sasjs/angular-seed-app/commits?author=VladislavParhomchik" title="Tests">⚠️</a> <a href="https://github.com/sasjs/angular-seed-app/pulls?q=is%3Apr+reviewed-by%3AVladislavParhomchik" title="Reviewed Pull Requests">👀</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/VladislavParhomchik"><img src="https://avatars.githubusercontent.com/u/83717836?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Vladislav Parhomchik</b></sub></a><br /><a href="https://github.com/sasjs/angular-seed-app/pulls?q=is%3Apr+reviewed-by%3AVladislavParhomchik" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/sasjs/angular-seed-app/commits?author=VladislavParhomchik" title="Tests">⚠️</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!