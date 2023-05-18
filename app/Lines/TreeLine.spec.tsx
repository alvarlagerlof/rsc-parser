import { JsonValue } from "type-fest";
import {
  refineRawTreeNode,
  parseRawNode,
  TYPE_OTHER,
  TYPE_COMPONENT,
  TYPE_ARRAY,
} from "./TreeLine";

describe("parseRawNode", () => {
  it("handles a string", () => {
    const parsed = parseRawNode("$Sreact.suspense");

    expect(parsed).toStrictEqual({
      type: TYPE_OTHER,
      value: "$Sreact.suspense",
    });
  });

  it("handles a null", () => {
    const parsed = parseRawNode(null);

    expect(parsed).toStrictEqual({ type: TYPE_OTHER, value: null });
  });

  it("handles an array of null", () => {
    const parsed = parseRawNode([null, null, null]);

    expect(parsed).toStrictEqual({
      type: TYPE_ARRAY,
      value: [
        { type: TYPE_OTHER, value: null },
        { type: TYPE_OTHER, value: null },
        { type: TYPE_OTHER, value: null },
      ],
    });
  });

  it("handles an array of strings", () => {
    const parsed = parseRawNode(["children", "(main)", "children", "__PAGE__"]);

    expect(parsed).toStrictEqual({
      type: TYPE_ARRAY,
      value: [
        { type: TYPE_OTHER, value: "children" },
        { type: TYPE_OTHER, value: "(main)" },
        { type: TYPE_OTHER, value: "children" },
        { type: TYPE_OTHER, value: "__PAGE__" },
      ],
    });
  });

  it("handles a nested array of null", () => {
    const parsed = parseRawNode([null, null, null, [null, [null, null]]]);

    expect(parsed).toStrictEqual({
      type: TYPE_ARRAY,
      value: [
        { type: TYPE_OTHER, value: null },
        { type: TYPE_OTHER, value: null },
        { type: TYPE_OTHER, value: null },
        {
          type: TYPE_ARRAY,
          value: [
            { type: TYPE_OTHER, value: null },
            {
              type: TYPE_ARRAY,
              value: [
                { type: TYPE_OTHER, value: null },
                { type: TYPE_OTHER, value: null },
              ],
            },
          ],
        },
      ],
    });
  });

  it("handles an array with a react component", () => {
    const parsed = parseRawNode([["$", "ul", null, {}]]);

    expect(parsed).toStrictEqual({
      type: TYPE_ARRAY,
      value: [
        {
          type: TYPE_COMPONENT,
          value: {
            tag: "ul",
            props: {},
          },
        },
      ],
    });
  });

  it("handles an array with a react component with props", () => {
    const parsed = parseRawNode([["$", "ul", null, { className: "p-4" }]]);

    expect(parsed).toStrictEqual({
      type: TYPE_ARRAY,
      value: [
        {
          type: TYPE_COMPONENT,
          value: {
            tag: "ul",
            props: { className: "p-4" },
          },
        },
      ],
    });
  });

  it("handles an array with two react components plus other things", () => {
    const parsed = parseRawNode([
      null,
      null,
      ["$", "ul", null, {}],
      ["$", "h1", null, { className: "text-2xl" }],
      "foobar",
    ]);

    expect(parsed).toStrictEqual({
      type: TYPE_ARRAY,
      value: [
        {
          type: TYPE_OTHER,
          value: null,
        },
        {
          type: TYPE_OTHER,
          value: null,
        },
        {
          type: TYPE_COMPONENT,
          value: {
            tag: "ul",
            props: {},
          },
        },
        {
          type: TYPE_COMPONENT,
          value: {
            tag: "h1",
            props: { className: "text-2xl" },
          },
        },
        {
          type: TYPE_OTHER,
          value: "foobar",
        },
      ],
    });
  });

  it("handles a react component with basic children", () => {
    const parsed = parseRawNode([
      ["$", "ul", null, { children: [null, null, "foobar"] }],
    ]);

    expect(parsed).toStrictEqual({
      type: TYPE_ARRAY,
      value: [
        {
          type: TYPE_COMPONENT,
          value: {
            tag: "ul",
            props: {
              children: {
                type: TYPE_ARRAY,
                value: [
                  {
                    type: TYPE_OTHER,
                    value: null,
                  },
                  {
                    type: TYPE_OTHER,
                    value: null,
                  },
                  {
                    type: TYPE_OTHER,
                    value: "foobar",
                  },
                ],
              },
            },
          },
        },
      ],
    });
  });

  it("handles a react component with another react component in children", () => {
    const parsed = parseRawNode([
      ["$", "ul", null, { children: [["$", "ul", null, {}]] }],
    ]);

    expect(parsed).toStrictEqual({
      type: TYPE_ARRAY,
      value: [
        {
          type: TYPE_COMPONENT,
          value: {
            tag: "ul",
            props: {
              children: {
                type: TYPE_ARRAY,
                value: [
                  {
                    type: TYPE_COMPONENT,
                    value: {
                      tag: "ul",
                      props: {},
                    },
                  },
                ],
              },
            },
          },
        },
      ],
    });
  });

  it("handles a react component directly at the root", () => {
    const parsed = parseRawNode(["$", "ul", null, {}]);

    expect(parsed).toStrictEqual({
      type: TYPE_COMPONENT,
      value: {
        tag: "ul",
        props: {},
      },
    });
  });

  it("handles a react component directly in children", () => {
    const parsed = parseRawNode([
      "$",
      "div",
      null,
      {
        children: ["$", "div", null, {}],
      },
    ]);

    expect(parsed).toStrictEqual({
      type: TYPE_COMPONENT,
      value: {
        tag: "div",
        props: {
          children: {
            type: TYPE_COMPONENT,
            value: {
              tag: "div",
              props: {},
            },
          },
        },
      },
    });
  });

  it("special", () => {
    const parsed = parseRawNode([
      [
        "$",
        "$La",
        "36c4cb3f-3940-4d09-a711-a47abf53b566",
        {
          _id: "36c4cb3f-3940-4d09-a711-a47abf53b566",
          name: "Scoreboarder",
          description: "Website for Discord bot managing scoreboards",
          link: "https://scoreboarder.xyz",
        },
      ],
    ]);

    expect(parsed).toStrictEqual({
      type: TYPE_ARRAY,
      value: [
        {
          type: TYPE_COMPONENT,
          value: {
            tag: "$La",
            props: {
              _id: "36c4cb3f-3940-4d09-a711-a47abf53b566",
              name: "Scoreboarder",
              description: "Website for Discord bot managing scoreboards",
              link: "https://scoreboarder.xyz",
            },
          },
        },
      ],
    });
  });

  it("special nested", () => {
    const parsed = parseRawNode([
      [
        "$",
        "ul",
        null,
        {
          className: "space-y-6 md:space-y-8",
          children: [
            [
              "$",
              "$La",
              "36c4cb3f-3940-4d09-a711-a47abf53b566",
              {
                _id: "36c4cb3f-3940-4d09-a711-a47abf53b566",
                name: "Scoreboarder",
                description: "Website for Discord bot managing scoreboards",
                link: "https://scoreboarder.xyz",
              },
            ],
          ],
        },
      ],
    ]);

    expect(parsed).toStrictEqual({
      type: TYPE_ARRAY,
      value: [
        {
          type: TYPE_COMPONENT,
          value: {
            tag: "ul",
            props: {
              className: "space-y-6 md:space-y-8",
              children: {
                type: TYPE_ARRAY,
                value: [
                  {
                    type: TYPE_COMPONENT,
                    value: {
                      tag: "$La",
                      props: {
                        _id: "36c4cb3f-3940-4d09-a711-a47abf53b566",
                        name: "Scoreboarder",
                        description:
                          "Website for Discord bot managing scoreboards",
                        link: "https://scoreboarder.xyz",
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      ],
    });
  });
});

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

    expect(refined.type).toBe(TYPE_COMPONENT);
    expect(refined.value).toStrictEqual(rawValue);
  });
});
