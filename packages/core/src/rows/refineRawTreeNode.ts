import { JsonObject, JsonValue } from "type-fest";
import { isElement } from "../react/ReactFlightClient";

export const TYPE_OTHER = "TYPE_OTHER";
export const TYPE_ELEMENT = "TYPE_ELEMENT";
export const TYPE_ARRAY = "TYPE_ARRAY";

export function refineRawTreeNode(value: unknown) {
  if (isElement(value)) {
    return {
      type: TYPE_ELEMENT,
      value: [
        value.$$typeof,
        value.type as string,
        value.key,
        value.props as JsonObject,
      ] as const,
    } as const;
  }

  if (Array.isArray(value)) {
    return {
      type: TYPE_ARRAY,
      value: value,
    } as const;
  }

  return {
    type: TYPE_OTHER,
    value: value as JsonValue,
  } as const;
}
