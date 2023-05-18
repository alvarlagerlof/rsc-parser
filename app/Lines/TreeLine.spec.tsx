import { JsonValue } from "type-fest";
import { refineRawTreeNode, parseData } from "./TreeLine";

describe("parseData", () => {
  it("handles a string", () => {
    const parsed = parseData("$Sreact.suspense");

    expect(parsed).toStrictEqual({ type: "OTHER", value: "$Sreact.suspense" });
  });

  it("handles a null", () => {
    const parsed = parseData(null);

    expect(parsed).toStrictEqual({ type: "OTHER", value: null });
  });

  it("handles an array of null", () => {
    const parsed = parseData([null, null, null]);

    expect(parsed).toStrictEqual({
      type: "ARRAY",
      value: [
        { type: "OTHER", value: null },
        { type: "OTHER", value: null },
        { type: "OTHER", value: null },
      ],
    });
  });

  it("handles an array of strings", () => {
    const parsed = parseData(["children", "(main)", "children", "__PAGE__"]);

    expect(parsed).toStrictEqual({
      type: "ARRAY",
      value: [
        { type: "OTHER", value: "children" },
        { type: "OTHER", value: "(main)" },
        { type: "OTHER", value: "children" },
        { type: "OTHER", value: "__PAGE__" },
      ],
    });
  });

  it("handles a nested array of null", () => {
    const parsed = parseData([null, null, null, [null, [null, null]]]);

    expect(parsed).toStrictEqual({
      type: "ARRAY",
      value: [
        { type: "OTHER", value: null },
        { type: "OTHER", value: null },
        { type: "OTHER", value: null },
        {
          type: "ARRAY",
          value: [
            { type: "OTHER", value: null },
            {
              type: "ARRAY",
              value: [
                { type: "OTHER", value: null },
                { type: "OTHER", value: null },
              ],
            },
          ],
        },
      ],
    });
  });

  it("handles an array with a react component", () => {
    const parsed = parseData([["$", "ul", null, {}]]);

    expect(parsed).toStrictEqual({
      type: "ARRAY",
      value: [
        {
          type: "COMPONENT",
          value: {
            tag: "ul",
            props: {},
          },
        },
      ],
    });
  });

  it("handles an array with a react component with props", () => {
    const parsed = parseData([["$", "ul", null, { className: "p-4" }]]);

    expect(parsed).toStrictEqual({
      type: "ARRAY",
      value: [
        {
          type: "COMPONENT",
          value: {
            tag: "ul",
            props: { className: "p-4" },
          },
        },
      ],
    });
  });

  it("handles an array with two react components plus other things", () => {
    const parsed = parseData([
      null,
      null,
      ["$", "ul", null, {}],
      ["$", "h1", null, { className: "text-2xl" }],
      "foobar",
    ]);

    expect(parsed).toStrictEqual({
      type: "ARRAY",
      value: [
        {
          type: "OTHER",
          value: null,
        },
        {
          type: "OTHER",
          value: null,
        },
        {
          type: "COMPONENT",
          value: {
            tag: "ul",
            props: {},
          },
        },
        {
          type: "COMPONENT",
          value: {
            tag: "h1",
            props: { className: "text-2xl" },
          },
        },
        {
          type: "OTHER",
          value: "foobar",
        },
      ],
    });
  });

  it("handles a react component with basic children", () => {
    const parsed = parseData([
      ["$", "ul", null, { children: [null, null, "foobar"] }],
    ]);

    expect(parsed).toStrictEqual({
      type: "ARRAY",
      value: [
        {
          type: "COMPONENT",
          value: {
            tag: "ul",
            props: {
              children: {
                type: "ARRAY",
                value: [
                  {
                    type: "OTHER",
                    value: null,
                  },
                  {
                    type: "OTHER",
                    value: null,
                  },
                  {
                    type: "OTHER",
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
    const parsed = parseData([
      ["$", "ul", null, { children: [["$", "ul", null, {}]] }],
    ]);

    expect(parsed).toStrictEqual({
      type: "ARRAY",
      value: [
        {
          type: "COMPONENT",
          value: {
            tag: "ul",
            props: {
              children: {
                type: "ARRAY",
                value: [
                  {
                    type: "COMPONENT",
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
    const parsed = parseData(["$", "ul", null, {}]);

    expect(parsed).toStrictEqual({
      type: "COMPONENT",
      value: {
        tag: "ul",
        props: {},
      },
    });
  });

  it("handles a react component directly in children", () => {
    const parsed = parseData([
      "$",
      "div",
      null,
      {
        children: ["$", "div", null, {}],
      },
    ]);

    expect(parsed).toStrictEqual({
      type: "COMPONENT",
      value: {
        tag: "div",
        props: {
          children: {
            type: "COMPONENT",
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
    const parsed = parseData([
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
      type: "ARRAY",
      value: [
        {
          type: "COMPONENT",
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
    const parsed = parseData([
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
      type: "ARRAY",
      value: [
        {
          type: "COMPONENT",
          value: {
            tag: "ul",
            props: {
              className: "space-y-6 md:space-y-8",
              children: {
                type: "ARRAY",
                value: [
                  {
                    type: "COMPONENT",
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
    const rawNode: JsonValue = null;
    const refined = refineRawTreeNode(rawNode);

    expect(refined.type).toBe("OTHER");
    expect(refined.node).toBe(rawNode);
  });

  it("handles a string", () => {
    const rawNode: JsonValue = "test";
    const refined = refineRawTreeNode(rawNode);

    expect(refined.type).toBe("OTHER");
    expect(refined.node).toBe(rawNode);
  });

  it("handles a number", () => {
    const rawNode: JsonValue = 10;
    const refined = refineRawTreeNode(rawNode);

    expect(refined.type).toBe("OTHER");
    expect(refined.node).toBe(rawNode);
  });

  it("handles an empty array", () => {
    const rawNode: JsonValue = [];
    const refined = refineRawTreeNode(rawNode);

    expect(refined.type).toBe("ARRAY");
    expect(refined.node).toBe(rawNode);
  });

  it("handles an array with null", () => {
    const rawNode: JsonValue = [null];
    const refined = refineRawTreeNode(rawNode);

    expect(refined.type).toBe("ARRAY");
    expect(refined.node).toBe(rawNode);
  });

  it("handles an array four null", () => {
    // A length for 4 is part of the matcher for the COMPONENT
    // type, but it shoukld not trigger here because the
    // array does not start with "$"
    const rawNode: JsonValue = [null, null, null, null];
    const refined = refineRawTreeNode(rawNode);

    expect(refined.type).toBe("ARRAY");
    expect(refined.node).toBe(rawNode);
  });

  it("handles an array four null", () => {
    // A length for 4 is part of the matcher for the COMPONENT
    // type, but it shoukld not trigger here because the
    // array does not start with "$"
    const rawNode: JsonValue = [null, null, null, null];
    const refined = refineRawTreeNode(rawNode);

    expect(refined.type).toBe("ARRAY");
    expect(refined.node).toBe(rawNode);
  });

  it("handles a react component", () => {
    // A length for 4 is part of the matcher for the COMPONENT
    // type, but it shoukld not trigger here because the
    // array does not start with "$"
    const rawNode: JsonValue = [
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
    const refined = refineRawTreeNode(rawNode);

    expect(refined.type).toBe("COMPONENT");
    expect(refined.node).toStrictEqual(rawNode);
  });
});
