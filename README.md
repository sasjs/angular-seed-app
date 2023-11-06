# Overview
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-8-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

This seed app provides a quick start for building an Angular Web app on Viya, SAS EBI or Foundation SAS with the SASjs DevOps framework.

## Frontend Web

Clone the repo, `cd` into it, and `npm install`.

Next, update the following attributes in `index.html`:

- `appLoc` - this is the folder (eg in metadata or SAS Drive) under which the SAS services are created.
- `serverType` - either SAS9, SASVIYA or SASJS.
- `serverUrl` - only relevant if not serving from the SAS domain (`!SASCONFIG/LevX/Web/WebServer/htdocs` in SAS9 or `/var/www/html` on SAS Viya)
- `useComputeApi` - can be `true` or `false`, it's a switch for SASjs adapter whether to use `Compute` approach while doing requests.
- `contextName` - only relevant if `useComputeApi` is true. Provides a context name that will be used in adapter.
- `LoginMechanism` - either Default or Redirected. See SAS Logon section.
- `requestHistoryLimit` - Request history limit. Increasing this limit may affect browser performance, especially with debug (logs) enabled. Default is 10.
- `debug` - if true then SAS Logs and extra debug information is returned.

More details in official @SASjs/adapter documentation: https://sasjs.io/sasjs-adapter/#configuration

If you are running locally you will either need to whitelist `localhost` on the server, or enable CORS as described [here](https://sasjs.io/cors)

## Backend Services

Normally services would be compiled and deployed using the [SASjs CLI](https://cli.sasjs.io), however for speedy setup you can simply run the following code in Studio:

```
%let appLoc=/Public/app/angular;  /* Root folder in Metadata or Drive */
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
%mx_createwebservice(path=&appLoc/services/common, name=appinit)
parmcards4;
    %webout(FETCH)
    proc sql;
    create table springs as select * from sashelp.springs
      where area in (select area from areas);
    %webout(OPEN)
    %webout(OBJ,springs)
    %webout(CLOSE)
;;;;
%mx_createwebservice(path=&appLoc/services/common, name=getdata)
```

To use the CLI, first run `sasjs add` and follow the prompts to create a target.  You can then run `sasjs cbd -t yourtargetname` to compile, build, and deploy your backend.

If you set `streamWeb:true` in the `streamConfig` of your `sasjs/sasjsconfig.json` file you can also run as a [streaming app](https://sasapps.io/sas-streamed-apps) (without a web server).

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/allanbowe"><img src="https://avatars.githubusercontent.com/u/4420615?v=4?s=100" width="100px;" alt="Allan Bowe"/><br /><sub><b>Allan Bowe</b></sub></a><br /><a href="https://github.com/sasjs/angular-seed-app/commits?author=allanbowe" title="Code">💻</a> <a href="https://github.com/sasjs/angular-seed-app/commits?author=allanbowe" title="Tests">⚠️</a> <a href="https://github.com/sasjs/angular-seed-app/pulls?q=is%3Apr+reviewed-by%3Aallanbowe" title="Reviewed Pull Requests">👀</a> <a href="#video-allanbowe" title="Videos">📹</a> <a href="https://github.com/sasjs/angular-seed-app/commits?author=allanbowe" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://www.erudicat.com/"><img src="https://avatars.githubusercontent.com/u/25773492?v=4?s=100" width="100px;" alt="Yury Shkoda"/><br /><sub><b>Yury Shkoda</b></sub></a><br /><a href="https://github.com/sasjs/angular-seed-app/commits?author=YuryShkoda" title="Code">💻</a> <a href="https://github.com/sasjs/angular-seed-app/commits?author=YuryShkoda" title="Tests">⚠️</a> <a href="#projectManagement-YuryShkoda" title="Project Management">📆</a> <a href="#video-YuryShkoda" title="Videos">📹</a> <a href="https://github.com/sasjs/angular-seed-app/commits?author=YuryShkoda" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://krishna-acondy.io/"><img src="https://avatars.githubusercontent.com/u/2980428?v=4?s=100" width="100px;" alt="Krishna Acondy"/><br /><sub><b>Krishna Acondy</b></sub></a><br /><a href="https://github.com/sasjs/angular-seed-app/commits?author=krishna-acondy" title="Code">💻</a> <a href="https://github.com/sasjs/angular-seed-app/commits?author=krishna-acondy" title="Tests">⚠️</a> <a href="https://github.com/sasjs/angular-seed-app/pulls?q=is%3Apr+reviewed-by%3Akrishna-acondy" title="Reviewed Pull Requests">👀</a> <a href="#infra-krishna-acondy" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#platform-krishna-acondy" title="Packaging/porting to new platform">📦</a> <a href="#maintenance-krishna-acondy" title="Maintenance">🚧</a> <a href="#content-krishna-acondy" title="Content">🖋</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/saadjutt01"><img src="https://avatars.githubusercontent.com/u/8914650?v=4?s=100" width="100px;" alt="Muhammad Saad "/><br /><sub><b>Muhammad Saad </b></sub></a><br /><a href="https://github.com/sasjs/angular-seed-app/commits?author=saadjutt01" title="Code">💻</a> <a href="https://github.com/sasjs/angular-seed-app/commits?author=saadjutt01" title="Tests">⚠️</a> <a href="https://github.com/sasjs/angular-seed-app/pulls?q=is%3Apr+reviewed-by%3Asaadjutt01" title="Reviewed Pull Requests">👀</a> <a href="#mentoring-saadjutt01" title="Mentoring">🧑‍🏫</a> <a href="https://github.com/sasjs/angular-seed-app/commits?author=saadjutt01" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/sabhas"><img src="https://avatars.githubusercontent.com/u/82647447?v=4?s=100" width="100px;" alt="Sabir Hassan"/><br /><sub><b>Sabir Hassan</b></sub></a><br /><a href="https://github.com/sasjs/angular-seed-app/commits?author=sabhas" title="Code">💻</a> <a href="https://github.com/sasjs/angular-seed-app/commits?author=sabhas" title="Tests">⚠️</a> <a href="https://github.com/sasjs/angular-seed-app/pulls?q=is%3Apr+reviewed-by%3Asabhas" title="Reviewed Pull Requests">👀</a> <a href="#ideas-sabhas" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/medjedovicm"><img src="https://avatars.githubusercontent.com/u/18329105?v=4?s=100" width="100px;" alt="Mihajlo Medjedovic"/><br /><sub><b>Mihajlo Medjedovic</b></sub></a><br /><a href="https://github.com/sasjs/angular-seed-app/commits?author=medjedovicm" title="Code">💻</a> <a href="https://github.com/sasjs/angular-seed-app/commits?author=medjedovicm" title="Tests">⚠️</a> <a href="https://github.com/sasjs/angular-seed-app/pulls?q=is%3Apr+reviewed-by%3Amedjedovicm" title="Reviewed Pull Requests">👀</a> <a href="#infra-medjedovicm" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/VladislavParhomchik"><img src="https://avatars.githubusercontent.com/u/83717836?v=4?s=100" width="100px;" alt="Vladislav Parhomchik"/><br /><sub><b>Vladislav Parhomchik</b></sub></a><br /><a href="https://github.com/sasjs/angular-seed-app/commits?author=VladislavParhomchik" title="Tests">⚠️</a> <a href="https://github.com/sasjs/angular-seed-app/pulls?q=is%3Apr+reviewed-by%3AVladislavParhomchik" title="Reviewed Pull Requests">👀</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="http://rudvfaden.github.io/"><img src="https://avatars.githubusercontent.com/u/2445577?v=4?s=100" width="100px;" alt="Rud Faden"/><br /><sub><b>Rud Faden</b></sub></a><br /><a href="https://github.com/sasjs/angular-seed-app/issues?q=author%3Arudvfaden" title="Bug reports">🐛</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
