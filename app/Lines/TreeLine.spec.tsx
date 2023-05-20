import { JsonValue } from "type-fest";
import {
  refineRawTreeNode,
  TYPE_OTHER,
  TYPE_ELEMENT,
  TYPE_ARRAY,
} from "./TreeLine";
import { ParsedModel, parsedElement } from "../parse-payload";

describe("getTreeNode", () => {
  it("handles a null", () => {
    const rawValue: ParsedModel = null;
    const refined = refineRawTreeNode(rawValue);

    expect(refined.type).toBe(TYPE_OTHER);
    expect(refined.value).toBe(rawValue);
  });

  it("handles a string", () => {
    const rawValue: ParsedModel = "test";
    const refined = refineRawTreeNode(rawValue);

    expect(refined.type).toBe(TYPE_OTHER);
    expect(refined.value).toBe(rawValue);
  });

  it("handles a number", () => {
    const rawValue: ParsedModel = 10;
    const refined = refineRawTreeNode(rawValue);

    expect(refined.type).toBe(TYPE_OTHER);
    expect(refined.value).toBe(rawValue);
  });

  it("handles an empty array", () => {
    const rawValue: ParsedModel = [];
    const refined = refineRawTreeNode(rawValue);

    expect(refined.type).toBe(TYPE_ARRAY);
    expect(refined.value).toBe(rawValue);
  });

  it("handles an array with null", () => {
    const rawValue: ParsedModel = [null];
    const refined = refineRawTreeNode(rawValue);

    expect(refined.type).toBe(TYPE_ARRAY);
    expect(refined.value).toBe(rawValue);
  });

  it("handles an array four null", () => {
    // A length for 4 is part of the matcher for the COMPONENT
    // type, but it shoukld not trigger here because the
    // array does not start with "$"
    const rawValue: ParsedModel = [null, null, null, null];
    const refined = refineRawTreeNode(rawValue);

    expect(refined.type).toBe(TYPE_ARRAY);
    expect(refined.value).toBe(rawValue);
  });

  it("handles a react element", () => {
    // A length for 4 is part of the matcher for the COMPONENT
    // type, but it shoukld not trigger here because the
    // array does not start with "$"
    const rawValue: ParsedModel = parsedElement(
      "$La",
      "36c4cb3f-3940-4d09-a711-a47abf53b566",
      {
        _id: "36c4cb3f-3940-4d09-a711-a47abf53b566",
        name: "Scoreboarder",
        description: "Website for Discord bot managing scoreboards",
        link: "https://scoreboarder.xyz",
      }
    );
    const refined = refineRawTreeNode(rawValue);

    expect(refined.type).toBe(TYPE_ELEMENT);
    expect(refined.value).toStrictEqual(rawValue);
  });

  it("handles an object", () => {
    // A length for 4 is part of the matcher for the COMPONENT
    // type, but it shoukld not trigger here because the
    // array does not start with "$"
    const rawValue: ParsedModel = { x: 3 };
    const refined = refineRawTreeNode(rawValue);

    expect(refined.type).toBe(TYPE_OTHER);
    expect(refined.value).toStrictEqual(rawValue);
  });
});
