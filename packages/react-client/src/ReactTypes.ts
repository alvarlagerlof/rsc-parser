/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ConsoleTask = any;

export type ReactCallSite = [
  string, // function name
  string, // file name TODO: model nested eval locations as nested arrays
  number, // line number
  number, // column number
];

export type ReactStackTrace = Array<ReactCallSite>;

export type ReactComponentInfo = {
  name?: string;
  env?: string;
  owner?: null | ReactComponentInfo;
  stack?: null | string;
  task?: null | ConsoleTask;
};

export type ReactEnvironmentInfo = {
  env: string;
};

export type ReactErrorInfoProd = {
  digest: string;
};

export type ReactErrorInfoDev = {
  digest?: string;
  name: string;
  message: string;
  stack: ReactStackTrace;
  env: string;
};

export type ReactErrorInfo = ReactErrorInfoProd | ReactErrorInfoDev;

export type ReactAsyncInfo = {
  started?: number;
  completed?: number;
  stack?: string;
};

export type ReactDebugInfo = Array<ReactComponentInfo | ReactAsyncInfo>;
