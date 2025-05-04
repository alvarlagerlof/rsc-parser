# @rsc-parser/embedded-example

## 1.0.0

### Major Changes

- 65231fc: Fix dev check in the Chrome extension

  BREAKING: `createFlightResponse` from @rsc-parser/react-client now takes a `__DEV__` parameter.

### Patch Changes

- 44cc2a8: Fix meter styling
- 1860787: Fixed a few react runtime errors
- Updated dependencies [44cc2a8]
- Updated dependencies [1860787]
- Updated dependencies [65231fc]
  - @rsc-parser/embedded@1.0.0

## 0.9.2

### Patch Changes

- 5fb463b: Specify "files" for @rsc-parser/react-client
- Updated dependencies [5fb463b]
  - @rsc-parser/embedded@0.9.2

## 0.9.1

### Patch Changes

- 71a3eac: Properly externalize react in the core and embedded packages
- Updated dependencies [71a3eac]
  - @rsc-parser/embedded@0.9.1

## 0.9.0

### Minor Changes

- 0f2a24a: Fix network graph max call stack error

### Patch Changes

- Updated dependencies [0f2a24a]
  - @rsc-parser/embedded@0.9.0

## 0.8.0

### Minor Changes

- 3db1a5f: Don't flip recording state when running triggerReadNextJsScriptTags
- 1478826: Add one error boundary per tab panel in RequestDetail

### Patch Changes

- Updated dependencies [3db1a5f]
- Updated dependencies [1478826]
  - @rsc-parser/embedded@0.8.0

## 0.7.0

### Minor Changes

- 531f06e: Update fork of ReactFlightClient.js
- 4bf3887: Make it possible to read Next.js script tags from the Chrome extension

### Patch Changes

- Updated dependencies [531f06e]
- Updated dependencies [4bf3887]
  - @rsc-parser/embedded@0.7.0

## 0.6.0

### Minor Changes

- 3f5a1c5: Make the "Headers" tab table column 1 min-size smaller, and make the `BottomPanel` default size larger
- 22cbbbf: Redesign `RequestTab` again
- f8836e5: Make request tab multiline by default

### Patch Changes

- 0002b9a: Add flex wrapping to the tabs in `RequestDetail`
- Updated dependencies [3f5a1c5]
- Updated dependencies [0002b9a]
- Updated dependencies [22cbbbf]
- Updated dependencies [f8836e5]
  - @rsc-parser/embedded@0.6.0

## 0.5.1

### Patch Changes

- 1c0b883: Fix `contentScript.ts` bundling to avoid ESM imports
- d3228c2: Remove debug console.log statements
- Updated dependencies [1c0b883]
- Updated dependencies [d3228c2]
  - @rsc-parser/embedded@0.5.1

## 0.5.0

### Minor Changes

- 44a478e: Create a Timings tab
- b07521b: Capture request and response headers
- 2aa4133: Refactor fetch patching and events
- c937a64: Rename Chrome extension root component from `App` to `RscDevtoolsExtension`
- 8ae76c5: Make the `BottomPanel` easier to resize
- 56627ae: Improve Headers tab design and add general information
- 4096674: Improve the `Raw` tab
- 2883dd1: Restructure @rsc-parser/chrome-extension files
- e155780: Create an `OverflowButton` for less important actions in `PanelLayout`
- a4eca6d: Add text on top of links in `RequestDetailTabNetwork`
- 65d0acd: Create `@rsc-parser/react-client`

### Patch Changes

- fe3446e: Make it possible to position the `BottomPanel` on the right
- 57c8a9b: Refactor `ViewerStreams` internals to allow a single list of tabs
- 095e40e: Ensure that `react` and `react-dom` are externalized
- a3a202c: Sync the version @rsc-parser/embedded-example with the other packages
- 800fced: Decrease the minimum panel sizes in `FlightResponseSelector`
- Updated dependencies [44a478e]
- Updated dependencies [b07521b]
- Updated dependencies [2aa4133]
- Updated dependencies [fe3446e]
- Updated dependencies [c937a64]
- Updated dependencies [8ae76c5]
- Updated dependencies [56627ae]
- Updated dependencies [4096674]
- Updated dependencies [57c8a9b]
- Updated dependencies [2883dd1]
- Updated dependencies [095e40e]
- Updated dependencies [a3a202c]
- Updated dependencies [800fced]
- Updated dependencies [e155780]
- Updated dependencies [a4eca6d]
- Updated dependencies [65d0acd]
  - @rsc-parser/embedded@0.5.0

## 0.18.2

### Patch Changes

- 5356856: Only show links for which there are nodes in FlightResponseTabNetwork
- Updated dependencies [5356856]
  - @rsc-parser/embedded@0.4.2

## 0.18.1

### Patch Changes

- e129d14: Specify files in @rsc-parser/core
- Updated dependencies [e129d14]
  - @rsc-parser/embedded@0.4.1

## 0.18.0

### Minor Changes

- 61a3d5a: Expose `unstable_Viewer`

### Patch Changes

- Updated dependencies [61a3d5a]
  - @rsc-parser/embedded@0.4.0

## 0.17.1

### Patch Changes

- 4542777: Fix Chrome Extension bundling
- e09465a: Add typecheck command
- 4f48e76: Add format command everywher
- ed20b59: Remove console logs
- Updated dependencies [4542777]
- Updated dependencies [e09465a]
- Updated dependencies [4f48e76]
- Updated dependencies [ed20b59]
  - @rsc-parser/embedded@0.3.1

## 0.17.0

### Minor Changes

- f313d13: Compile Chrome extension scripts using Vite
- ee03219: Move fetch patching code to @rsc-parser/core
- 4d0f42e: Added support for server actions

### Patch Changes

- 2cd0dd4: Export `unstable_createFlightResponse`
- 2836e57: Add a button to read Next.js payload script tags
- faa158f: Export `unstable_createFlightResponse`
- Updated dependencies [f313d13]
- Updated dependencies [2cd0dd4]
- Updated dependencies [2836e57]
- Updated dependencies [ee03219]
- Updated dependencies [faa158f]
- Updated dependencies [4d0f42e]
  - @rsc-parser/embedded@0.3.0

## 0.16.4

### Patch Changes

- 71e069c: Set a higher z-index for the BottomPanel when when open
- Updated dependencies [71e069c]
  - @rsc-parser/embedded@0.2.4

## 0.16.3

### Patch Changes

- f181ce8: Scope styles for RscDevtoolsPanel
- 39e168a: Stop wrapping <style> in <head> in RscDevtoolsPanel
- Updated dependencies [f181ce8]
- Updated dependencies [39e168a]
  - @rsc-parser/embedded@0.2.3

## 0.16.2

### Patch Changes

- 268463a: Make @rsc-parser/core dependency in @rsc-parser/embedded a dev dependency
- Updated dependencies [268463a]
  - @rsc-parser/embedded@0.2.2

## 0.16.1

### Patch Changes

- f7390f2: Make @rsc-parser/embedded non-private
- Updated dependencies [f7390f2]
  - @rsc-parser/embedded@0.2.1

## 0.16.0

### Minor Changes

- c4d4a03: Introduce @rsc-parser/embedded and @rsc-parser/embeded-example

### Patch Changes

- Updated dependencies [c4d4a03]
  - @rsc-parser/embedded@0.2.0
