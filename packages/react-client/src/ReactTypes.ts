/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ConsoleTask = any;

export type ReactComponentInfo = {
  name?: string;
  env?: string;
  owner?: null | ReactComponentInfo;
  stack?: null | string;
  task?: null | ConsoleTask;
};

export type ReactAsyncInfo = {
  started?: number;
  completed?: number;
  stack?: string;
};

export type ReactDebugInfo = Array<ReactComponentInfo | ReactAsyncInfo>;
