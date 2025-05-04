# @rsc-parser/core

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
  - @rsc-parser/react-client@1.0.0

## 0.9.2

### Patch Changes

- 5fb463b: Specify "files" for @rsc-parser/react-client
- Updated dependencies [5fb463b]
  - @rsc-parser/react-client@0.9.2

## 0.9.1

### Patch Changes

- 71a3eac: Properly externalize react in the core and embedded packages
- Updated dependencies [71a3eac]
  - @rsc-parser/react-client@0.9.1

## 0.9.0

### Minor Changes

- 0f2a24a: Fix network graph max call stack error

### Patch Changes

- Updated dependencies [0f2a24a]
  - @rsc-parser/react-client@0.9.0

## 0.8.0

### Minor Changes

- 3db1a5f: Don't flip recording state when running triggerReadNextJsScriptTags
- 1478826: Add one error boundary per tab panel in RequestDetail

### Patch Changes

- Updated dependencies [3db1a5f]
- Updated dependencies [1478826]
  - @rsc-parser/react-client@0.8.0

## 0.7.0

### Minor Changes

- 531f06e: Update fork of ReactFlightClient.js
- 4bf3887: Make it possible to read Next.js script tags from the Chrome extension

### Patch Changes

- Updated dependencies [531f06e]
- Updated dependencies [4bf3887]
  - @rsc-parser/react-client@0.7.0

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
  - @rsc-parser/react-client@0.6.0

## 0.5.1

### Patch Changes

- 1c0b883: Fix `contentScript.ts` bundling to avoid ESM imports
- d3228c2: Remove debug console.log statements
- Updated dependencies [1c0b883]
- Updated dependencies [d3228c2]
  - @rsc-parser/react-client@0.5.1

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
- Updated dependencies [56627ae]
- Updated dependencies [4096674]
- Updated dependencies [57c8a9b]
- Updated dependencies [a4eca6d]
- Updated dependencies [65d0acd]
  - @rsc-parser/react-client@0.5.0

## 0.4.2

### Patch Changes

- 5356856: Only show links for which there are nodes in FlightResponseTabNetwork

## 0.4.1

### Patch Changes

- e129d14: Specify files in @rsc-parser/core

## 0.4.0

### Minor Changes

- 61a3d5a: Expose `unstable_Viewer`

## 0.3.1

### Patch Changes

- 4542777: Fix Chrome Extension bundling
- e09465a: Add typecheck command
- 4f48e76: Add format command everywher
- ed20b59: Remove console logs

## 0.3.0

### Minor Changes

- f313d13: Compile Chrome extension scripts using Vite
- ee03219: Move fetch patching code to @rsc-parser/core
- 4d0f42e: Added support for server actions

### Patch Changes

- 2cd0dd4: Export `unstable_createFlightResponse`
- 2836e57: Add a button to read Next.js payload script tags
- faa158f: Export `unstable_createFlightResponse`

## 0.2.4

### Patch Changes

- 71e069c: Set a higher z-index for the BottomPanel when when open

## 0.2.3

### Patch Changes

- f181ce8: Scope styles for RscDevtoolsPanel
- 39e168a: Stop wrapping <style> in <head> in RscDevtoolsPanel

## 0.2.2

### Patch Changes

- 268463a: Make @rsc-parser/core dependency in @rsc-parser/embedded a dev dependency

## 0.2.1

### Patch Changes

- f7390f2: Make @rsc-parser/embedded non-private

## 0.2.0

### Minor Changes

- cbfa10f: Move some UI previously defined in @rsc-parser/chrome-extension into @rsc-parser/core
- c4d4a03: Introduce @rsc-parser/embedded and @rsc-parser/embeded-example
- 583cf09: Create a `useRscMessages` hook

## 0.1.15

### Patch Changes

- 38bff39: Use `chunk` name instead of `row`
- d621e61: Improved rendering for unknown chunks #771
- d621e61: Added more data to `originalValue` #772
- 1207d60: Add network graph tab to FlightResponse
- d621e61: Added support for debug info chunks #769

## 0.1.14

### Patch Changes

- ecb36c4: Fix extension button color in light mode

## 0.1.13

### Patch Changes

- f6ed105: Stop rendering the end time

## 0.1.12

### Patch Changes

- 8dede95: Made font sizes more consistent

## 0.1.11

### Patch Changes

- 611207b: Integrate parser from the ReactFlightClient source
- c3240e7: Remove unuzed zod dependency

## 0.1.10

### Patch Changes

- 09b3e5e: Fixed parsing (react updated its format)

## 0.1.9

### Patch Changes

- ab6c252: Fix zip path for release upload

## 0.1.8

### Patch Changes

- d77eb98: Add id

## 0.1.7

### Patch Changes

- 6050c00: Change publish logic

## 0.1.6

### Patch Changes

- d32eda1: Test release

## 0.1.5

### Patch Changes

- 6593bb5: Don't run CI workflow on pushes to main

## 0.1.3

### Patch Changes

- 5ed8752: Continued setting up changesets
