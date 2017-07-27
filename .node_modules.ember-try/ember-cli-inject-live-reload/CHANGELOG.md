# Change Log

## [v1.6.1](https://github.com/ember-cli/ember-cli-inject-live-reload/tree/v1.6.1) (2017-01-19)
[Full Changelog](https://github.com/ember-cli/ember-cli-inject-live-reload/compare/v1.6.0...v1.6.1)

**Closed issues:**

- Live Reload not working when not using Ember CLI server to serve assets [\#13](https://github.com/ember-cli/ember-cli-inject-live-reload/issues/13)

**Merged pull requests:**

- Change the name of middleware to broccoli-watcher [\#41](https://github.com/ember-cli/ember-cli-inject-live-reload/pull/41) ([kratiahuja](https://github.com/kratiahuja))

## [v1.6.0](https://github.com/ember-cli/ember-cli-inject-live-reload/tree/v1.6.0) (2017-01-19)
[Full Changelog](https://github.com/ember-cli/ember-cli-inject-live-reload/compare/v1.5.0...v1.6.0)

**Merged pull requests:**

- Update this addon to run before the new serve-file middleware [\#39](https://github.com/ember-cli/ember-cli-inject-live-reload/pull/39) ([kratiahuja](https://github.com/kratiahuja))

## [v1.5.0](https://github.com/ember-cli/ember-cli-inject-live-reload/tree/v1.5.0) (2017-01-19)
[Full Changelog](https://github.com/ember-cli/ember-cli-inject-live-reload/compare/v1.4.1...v1.5.0)

**Closed issues:**

- Live reload on master not working \(500 error\) [\#35](https://github.com/ember-cli/ember-cli-inject-live-reload/issues/35)
- liveReloadBaseUrl with absolute url no longer supported [\#33](https://github.com/ember-cli/ember-cli-inject-live-reload/issues/33)
- Injected script not being appropriately fingerprinted [\#32](https://github.com/ember-cli/ember-cli-inject-live-reload/issues/32)
- Requirements [\#31](https://github.com/ember-cli/ember-cli-inject-live-reload/issues/31)
- Use `EMBER\_CLI\_INJECT\_LIVE\_RELOAD\_BASEURL` in the injected script  [\#30](https://github.com/ember-cli/ember-cli-inject-live-reload/issues/30)

**Merged pull requests:**

- Handle `liveReloadOptions` being undefined. [\#40](https://github.com/ember-cli/ember-cli-inject-live-reload/pull/40) ([rwjblue](https://github.com/rwjblue))
- Support Advanced Configuration [\#25](https://github.com/ember-cli/ember-cli-inject-live-reload/pull/25) ([chrislopresto](https://github.com/chrislopresto))

## [v1.4.1](https://github.com/ember-cli/ember-cli-inject-live-reload/tree/v1.4.1) (2016-07-18)
[Full Changelog](https://github.com/ember-cli/ember-cli-inject-live-reload/compare/v1.4.0...v1.4.1)

**Closed issues:**

- baseURL is being removed from ember [\#27](https://github.com/ember-cli/ember-cli-inject-live-reload/issues/27)
- \[Question\]: starting point to hot reload JS like we do w/ css today? [\#26](https://github.com/ember-cli/ember-cli-inject-live-reload/issues/26)
- Livereload reloads whole page even if only the css has changed [\#11](https://github.com/ember-cli/ember-cli-inject-live-reload/issues/11)

**Merged pull requests:**

- Fix overriding baseURL [\#28](https://github.com/ember-cli/ember-cli-inject-live-reload/pull/28) ([jgoclawski](https://github.com/jgoclawski))

## [v1.4.0](https://github.com/ember-cli/ember-cli-inject-live-reload/tree/v1.4.0) (2015-12-08)
[Full Changelog](https://github.com/ember-cli/ember-cli-inject-live-reload/compare/v1.3.1...v1.4.0)

**Merged pull requests:**

- Allow to force baseURL [\#24](https://github.com/ember-cli/ember-cli-inject-live-reload/pull/24) ([jbescoyez](https://github.com/jbescoyez))
- Create LICENSE.md [\#21](https://github.com/ember-cli/ember-cli-inject-live-reload/pull/21) ([JohnQuaresma](https://github.com/JohnQuaresma))

## [v1.3.1](https://github.com/ember-cli/ember-cli-inject-live-reload/tree/v1.3.1) (2015-01-30)
[Full Changelog](https://github.com/ember-cli/ember-cli-inject-live-reload/compare/v1.3.0...v1.3.1)

**Closed issues:**

- Where can I find `ember-cli-live-reload.js`  [\#16](https://github.com/ember-cli/ember-cli-inject-live-reload/issues/16)
- live-reload does not work if rootURL is a subdirectory [\#15](https://github.com/ember-cli/ember-cli-inject-live-reload/issues/15)

**Merged pull requests:**

- Add baseUrl to script path for ember-cli-live-reload.js [\#18](https://github.com/ember-cli/ember-cli-inject-live-reload/pull/18) ([pixelhandler](https://github.com/pixelhandler))
- connect-livereload dependency is not required anymore [\#17](https://github.com/ember-cli/ember-cli-inject-live-reload/pull/17) ([Dremora](https://github.com/Dremora))
- Wrap dynamic script to avoid globals [\#12](https://github.com/ember-cli/ember-cli-inject-live-reload/pull/12) ([teddyzeenny](https://github.com/teddyzeenny))

## [v1.3.0](https://github.com/ember-cli/ember-cli-inject-live-reload/tree/v1.3.0) (2014-10-13)
[Full Changelog](https://github.com/ember-cli/ember-cli-inject-live-reload/compare/v1.2.3...v1.3.0)

**Closed issues:**

- Support dynamic or configurable hostname \(besides localhost\) [\#8](https://github.com/ember-cli/ember-cli-inject-live-reload/issues/8)

**Merged pull requests:**

- Dynamically generate livereload script. [\#10](https://github.com/ember-cli/ember-cli-inject-live-reload/pull/10) ([rwjblue](https://github.com/rwjblue))

## [v1.2.3](https://github.com/ember-cli/ember-cli-inject-live-reload/tree/v1.2.3) (2014-10-06)
[Full Changelog](https://github.com/ember-cli/ember-cli-inject-live-reload/compare/v1.2.2...v1.2.3)

**Closed issues:**

- make injected script protocol relative [\#6](https://github.com/ember-cli/ember-cli-inject-live-reload/issues/6)

**Merged pull requests:**

- protocol-relative + misc [\#7](https://github.com/ember-cli/ember-cli-inject-live-reload/pull/7) ([stefanpenner](https://github.com/stefanpenner))

## [v1.2.2](https://github.com/ember-cli/ember-cli-inject-live-reload/tree/v1.2.2) (2014-10-03)
[Full Changelog](https://github.com/ember-cli/ember-cli-inject-live-reload/compare/v1.2.1...v1.2.2)

## [v1.2.1](https://github.com/ember-cli/ember-cli-inject-live-reload/tree/v1.2.1) (2014-10-03)
[Full Changelog](https://github.com/ember-cli/ember-cli-inject-live-reload/compare/v1.2.0...v1.2.1)

**Closed issues:**

- Insert livereload-script? [\#2](https://github.com/ember-cli/ember-cli-inject-live-reload/issues/2)

**Merged pull requests:**

- Uses LiveReload port from ENV [\#3](https://github.com/ember-cli/ember-cli-inject-live-reload/pull/3) ([unwiredbrain](https://github.com/unwiredbrain))

## [v1.2.0](https://github.com/ember-cli/ember-cli-inject-live-reload/tree/v1.2.0) (2014-10-03)
[Full Changelog](https://github.com/ember-cli/ember-cli-inject-live-reload/compare/v1.1.0...v1.2.0)

## [v1.1.0](https://github.com/ember-cli/ember-cli-inject-live-reload/tree/v1.1.0) (2014-09-22)
[Full Changelog](https://github.com/ember-cli/ember-cli-inject-live-reload/compare/v1.0.3...v1.1.0)

## [v1.0.3](https://github.com/ember-cli/ember-cli-inject-live-reload/tree/v1.0.3) (2014-09-21)
[Full Changelog](https://github.com/ember-cli/ember-cli-inject-live-reload/compare/v1.0.2...v1.0.3)

**Merged pull requests:**

- Create README.md [\#1](https://github.com/ember-cli/ember-cli-inject-live-reload/pull/1) ([quaertym](https://github.com/quaertym))

## [v1.0.2](https://github.com/ember-cli/ember-cli-inject-live-reload/tree/v1.0.2) (2014-08-13)
[Full Changelog](https://github.com/ember-cli/ember-cli-inject-live-reload/compare/v1.0.1...v1.0.2)

## [v1.0.1](https://github.com/ember-cli/ember-cli-inject-live-reload/tree/v1.0.1) (2014-08-12)
[Full Changelog](https://github.com/ember-cli/ember-cli-inject-live-reload/compare/v1.0.0...v1.0.1)

## [v1.0.0](https://github.com/ember-cli/ember-cli-inject-live-reload/tree/v1.0.0) (2014-08-12)


\* *This Change Log was automatically generated by [github_changelog_generator](https://github.com/skywinder/Github-Changelog-Generator)*