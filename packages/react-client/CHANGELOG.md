# @rsc-parser/react-client

## 1.0.0

### Major Changes

- 65231fc: Fix dev check in the Chrome extension

  BREAKING: `createFlightResponse` from @rsc-parser/react-client now takes a `__DEV__` parameter.

### Patch Changes

- 44cc2a8: Fix meter styling
- 1860787: Fixed a few react runtime errors

## 0.9.2

### Patch Changes

- 5fb463b: Specify "files" for @rsc-parser/react-client

## 0.9.1

### Patch Changes

- 71a3eac: Properly externalize react in the core and embedded packages

## 0.9.0

### Minor Changes

- 0f2a24a: Fix network graph max call stack error

## 0.8.0

### Minor Changes

- 3db1a5f: Don't flip recording state when running triggerReadNextJsScriptTags
- 1478826: Add one error boundary per tab panel in RequestDetail

## 0.7.0

### Minor Changes

- 531f06e: Update fork of ReactFlightClient.js
- 4bf3887: Make it possible to read Next.js script tags from the Chrome extension

## 0.6.0

### Minor Changes

- 3f5a1c5: Make the "Headers" tab table column 1 min-size smaller, and make the `BottomPanel` default size larger
- 22cbbbf: Redesign `RequestTab` again
- f8836e5: Make request tab multiline by default

### Patch Changes

- 0002b9a: Add flex wrapping to the tabs in `RequestDetail`

## 0.5.1

### Patch Changes

- 1c0b883: Fix `contentScript.ts` bundling to avoid ESM imports
- d3228c2: Remove debug console.log statements

## 0.5.0

### Minor Changes

- 44a478e: Create a Timings tab
- 56627ae: Improve Headers tab design and add general information
- 4096674: Improve the `Raw` tab
- a4eca6d: Add text on top of links in `RequestDetailTabNetwork`
- 65d0acd: Create `@rsc-parser/react-client`

### Patch Changes

- 57c8a9b: Refactor `ViewerStreams` internals to allow a single list of tabs
