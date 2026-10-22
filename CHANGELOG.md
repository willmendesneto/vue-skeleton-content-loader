# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased][]

### Changed

- Upgrading project to Node.js v24, Vite v8, Vitest v5, ESLint v10 (flat config), TypeScript v6 and latest versions of other dev dependencies
- Decreasing bundle size from 998B to 874B (ES) and from 966B to 938B (UMD) - gzip - by minifying the ES output and removing `Symbol.toStringTag` from the generated code
- Replacing `bundlesize` with `bundlesize2`, since `bundlesize` native dependencies don't work in Node.js v24
- Removing unused dev dependencies and configurations
- Adding CI via GitHub Actions: lint (including formatting), type check, unit tests, build, bundle size, SSR rendering of the built package (`npm run test:ssr`) and demo build, plus Dependabot updates for GitHub Actions

## [1.2.0][] - 2025-08-27

### Added

- Adding info about `measure-unit` usage on `README.md` file
- Adding support for different CSS measurement units via `measure-unit` input attribute

### Fixed

- Removing unnecessary folders from package distribution

## [1.1.1][] - 2025-06-13

### Changed

- Improving internal types

### Fixed

- Fixing `npm run lint` command. The command was complaining with ESLint config file format, so it was moved to CJS.

## [1.1.0][] - 2025-06-11

### Changed

- Updating docs to reflect new appearance for `square` option
- Updating docs to reflect new `size` props to be used when chosen appearance is `square`
- Updating examples with latest changes

### Added
- Adding new appearance for `square`. This one will also accept and require `size` as prop. So that, it can render a square.

## [1.0.2][] - 2025-06-09

### Added

- Moving CSS Params into CSS Vars

## [1.0.1][] - 2025-06-09

### Added

- Adding bundlesize validation

### Changed

- Fixing docs to refer to correct StackBlitz link

## [1.0.0][] - 2025-06-09

### Added
- Created `VueSkeletonContentLoader` package


[Unreleased]: https://github.com/willmendesneto/vue-skeleton-content-loader/compare/v1.2.0...HEAD
[1.2.0]: https://github.com/willmendesneto/vue-skeleton-content-loader/compare/v1.1.1...v1.2.0
[1.1.1]: https://github.com/willmendesneto/vue-skeleton-content-loader/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/willmendesneto/vue-skeleton-content-loader/compare/v1.0.2...v1.1.0
[1.0.2]: https://github.com/willmendesneto/vue-skeleton-content-loader/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/willmendesneto/vue-skeleton-content-loader/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/willmendesneto/vue-skeleton-content-loader/tree/v1.0.0
