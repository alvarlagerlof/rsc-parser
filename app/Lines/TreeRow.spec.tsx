import { JsonValue } from "type-fest";
import {
  refineRawTreeNode,
  TYPE_OTHER,
  TYPE_ELEMENT,
  TYPE_ARRAY,
} from "./TreeRow";

describe("getTreeNode", () => {
  it("handles a null", () => {
    const rawValue: JsonValue = null;
    const refined = refineRawTreeNode(rawValue);

    expect(refined.type).toBe(TYPE_OTHER);
    expect(refined.value).toBe(rawValue);
  });

  it("handles a string", () => {
    const rawValue: JsonValue = "test";
    const refined = refineRawTreeNode(rawValue);

    expect(refined.type).toBe(TYPE_OTHER);
    expect(refined.value).toBe(rawValue);
  });

  it("handles a number", () => {
    const rawValue: JsonValue = 10;
    const refined = refineRawTreeNode(rawValue);

    expect(refined.type).toBe(TYPE_OTHER);
    expect(refined.value).toBe(rawValue);
  });

  it("handles an empty array", () => {
    const rawValue: JsonValue = [];
    const refined = refineRawTreeNode(rawValue);

    expect(refined.type).toBe(TYPE_ARRAY);
    expect(refined.value).toBe(rawValue);
  });

  it("handles an array with null", () => {
    const rawValue: JsonValue = [null];
    const refined = refineRawTreeNode(rawValue);

    expect(refined.type).toBe(TYPE_ARRAY);
    expect(refined.value).toBe(rawValue);
  });

  it("handles an array four null", () => {
    // A length for 4 is part of the matcher for the COMPONENT
    // type, but it shoukld not trigger here because the
    // array does not start with "$"
    const rawValue: JsonValue = [null, null, null, null];
    const refined = refineRawTreeNode(rawValue);

    expect(refined.type).toBe(TYPE_ARRAY);
    expect(refined.value).toBe(rawValue);
  });

  it("handles an array four null", () => {
    // A length for 4 is part of the matcher for the COMPONENT
    // type, but it shoukld not trigger here because the
    // array does not start with "$"
    const rawValue: JsonValue = [null, null, null, null];
    const refined = refineRawTreeNode(rawValue);

    expect(refined.type).toBe(TYPE_ARRAY);
    expect(refined.value).toBe(rawValue);
  });

  it("handles a react component", () => {
    // A length for 4 is part of the matcher for the COMPONENT
    // type, but it shoukld not trigger here because the
    // array does not start with "$"
    const rawValue: JsonValue = [
      "$",
      "$La",
      "36c4cb3f-3940-4d09-a711-a47abf53b566",
      {
        _id: "36c4cb3f-3940-4d09-a711-a47abf53b566",
        name: "Scoreboarder",
        description: "Website for Discord bot managing scoreboards",
        link: "https://scoreboarder.xyz",
      },
    ];
    const refined = refineRawTreeNode(rawValue);

    expect(refined.type).toBe(TYPE_ELEMENT);
    expect(refined.value).toStrictEqual(rawValue);
  });
});
