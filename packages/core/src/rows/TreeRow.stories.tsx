import type { Meta, StoryObj } from "@storybook/react";

import { TreeRow } from "./TreeRow";

const meta: Meta<typeof TreeRow> = {
  argTypes: { onClickClientReference: { action: "clicked client reference" } },
  component: TreeRow,
};

export default meta;
type Story = StoryObj<typeof TreeRow>;

export const String: Story = {
  args: {
    data: JSON.stringify("L7SkxK6dEGIxPChCswhi8"),
  },
};

export const StringArray: Story = {
  args: {
    data: JSON.stringify(["L7SkxK6dEGIxPChCswhi8", "children", "main"]),
  },
};

export const Boolean: Story = {
  args: {
    data: JSON.stringify(true),
  },
};

export const Number: Story = {
  args: {
    data: JSON.stringify(0),
  },
};

export const Undefined: Story = {
  args: {
    data: JSON.stringify("$undefined"),
  },
};

export const Null: Story = {
  args: {
    data: JSON.stringify(null),
  },
};

export const EmptyElement: Story = {
  args: {
    data: JSON.stringify(["$", "br", "0", {}]),
  },
};

export const ElementWithChildren: Story = {
  args: {
    data: JSON.stringify(["$", "p", "0", { children: "Hello world" }]),
  },
};

export const StringProp: Story = {
  args: {
    data: JSON.stringify(["$", "div", "0", { className: "test" }]),
  },
};

export const NumberProp: Story = {
  args: {
    data: JSON.stringify(["$", "Component", "0", { something: 0 }]),
  },
};

export const BooleanProp: Story = {
  args: {
    data: JSON.stringify(["$", "Component", "0", { something: true }]),
  },
};

export const ElementProp: Story = {
  args: {
    data: JSON.stringify([
      "$",
      "Component",
      "0",
      { element: ["$", "div", "0", {}] },
    ]),
  },
};

export const ObjectProps: Story = {
  args: {
    data: JSON.stringify([
      "$",
      "div",
      "0",
      { data: { some: "thing", foo: "bar" } },
    ]),
  },
};

export const NestedObjectProps: Story = {
  args: {
    data: JSON.stringify([
      "$",
      "div",
      "0",
      { data: { some: "thing", foo: { baz: "bar" } } },
    ]),
  },
};

export const ArrayProp: Story = {
  args: {
    data: JSON.stringify(["$", "div", "0", { data: ["test", "hello"] }]),
  },
};

export const ElementArray: Story = {
  args: {
    data: JSON.stringify([
      ["$", "br", "0", {}],
      ["$", "br", "0", {}],
      ["$", "br", "0", {}],
    ]),
  },
};

export const NestedElementArray: Story = {
  args: {
    data: JSON.stringify([
      [
        "$",
        "div",
        "0",
        {
          children: [
            ["$", "br", "0", {}],
            ["$", "br", "0", {}],
          ],
        },
      ],
      [
        "$",
        "div",
        "0",
        {
          children: [
            ["$", "br", "0", {}],
            ["$", "br", "0", {}],
          ],
        },
      ],
      [
        "$",
        "div",
        "0",
        {
          children: [
            ["$", "br", "0", {}],
            ["$", "br", "0", {}],
          ],
        },
      ],
    ]),
  },
};

export const ClientRef: Story = {
  args: {
    data: JSON.stringify(["$", "$L9", "0", {}]),
  },
};

export const FirstRowExample: Story = {
  args: {
    data: JSON.stringify([
      "L7SkxK6dEGIxPChCswhi8",
      [
        [
          "children",
          "(main)",
          "children",
          "projects",
          ["projects", { children: ["__PAGE__", {}] }],
          "$L1",
          [[], ["$L2", ["$", "meta", null, { name: "next-size-adjust" }]]],
        ],
      ],
    ]),
  },
};

export const MetaTagsExample: Story = {
  args: {
    data: JSON.stringify([
      ["$", "meta", "0", { charSet: "utf-8" }],
      ["$", "title", "1", { children: "Projects" }],
      [
        "$",
        "meta",
        "2",
        {
          name: "description",
          content: "These are some of the projects I've worked on",
        },
      ],
      ["$", "meta", "3", { name: "theme-color", content: "#16a34a" }],
      [
        "$",
        "meta",
        "4",
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
      [
        "$",
        "link",
        "5",
        {
          rel: "alternate",
          type: "application/rss+xml",
          href: "https://alvar.dev/feed.xml",
        },
      ],
      ["$", "meta", "6", { property: "og:site_name", content: "alvar.dev" }],
      ["$", "meta", "7", { property: "og:image:type", content: "image/png" }],
      [
        "$",
        "meta",
        "8",
        {
          property: "og:image",
          content:
            "https://alvar.dev/projects/opengraph-image-7gbxx9?92712a71ecaaf7f6",
        },
      ],
      ["$", "meta", "9", { property: "og:image:width", content: "1200" }],
      ["$", "meta", "10", { property: "og:image:height", content: "630" }],
      [
        "$",
        "meta",
        "11",
        { name: "twitter:card", content: "summary_large_image" },
      ],
      ["$", "meta", "12", { name: "twitter:site", content: "@alvarlagerlof" }],
      [
        "$",
        "meta",
        "13",
        { name: "twitter:creator", content: "@alvarlagerlof" },
      ],
      ["$", "meta", "14", { name: "twitter:image:type", content: "image/png" }],
      [
        "$",
        "meta",
        "15",
        {
          name: "twitter:image",
          content:
            "https://alvar.dev/projects/opengraph-image-7gbxx9?92712a71ecaaf7f6",
        },
      ],
      ["$", "meta", "16", { name: "twitter:image:width", content: "1200" }],
      ["$", "meta", "17", { name: "twitter:image:height", content: "630" }],
      ["$", "link", "18", { rel: "icon", href: "/favicons/favicon.ico" }],
      [
        "$",
        "link",
        "19",
        { rel: "icon", href: "/favicons/favicon-16x16.png", sizes: "16x16" },
      ],
      [
        "$",
        "link",
        "20",
        { rel: "icon", href: "/favicons/favicon-32x32.png", sizes: "32x32" },
      ],
      [
        "$",
        "link",
        "21",
        {
          rel: "icon",
          href: "/favicons/favicon-192x192.png",
          sizes: "192x192",
        },
      ],
    ]),
  },
};

export const NextJsExample: Story = {
  args: {
    data: JSON.stringify([
      [
        "$",
        "html",
        null,
        {
          lang: "en",
          suppressHydrationWarning: true,
          children: [
            ["$", "head", null, {}],
            [
              "$",
              "body",
              null,
              {
                children: [
                  ["$", "$L6", null, {}],
                  ["$", "$L7", null, {}],
                  [
                    "$",
                    "$L8",
                    null,
                    {
                      children: [
                        ["$", "$L9", null, {}],
                        [
                          "$",
                          "main",
                          null,
                          {
                            children: [
                              "$",
                              "$La",
                              null,
                              {
                                parallelRouterKey: "children",
                                segmentPath: ["children"],
                                error: "$undefined",
                                errorStyles: "$undefined",
                                loading: "$undefined",
                                loadingStyles: "$undefined",
                                hasLoading: false,
                                template: ["$", "$Lb", null, {}],
                                templateStyles: "$undefined",
                                notFound: "$undefined",
                                notFoundStyles: "$undefined",
                                childProp: {
                                  current: [
                                    [
                                      "$",
                                      "div",
                                      null,
                                      {
                                        className: "home_root__yKyeQ",
                                        children: [
                                          [
                                            "$",
                                            "div",
                                            null,
                                            {
                                              id: "geist-skip-nav",
                                              tabIndex: -1,
                                            },
                                          ],
                                          ["$", "$Lc", null, {}],
                                          [
                                            "$",
                                            "$Ld",
                                            null,
                                            {
                                              children: ["$", "$Le", null, {}],
                                            },
                                          ],
                                          [
                                            "$",
                                            "$Ld",
                                            null,
                                            {
                                              children: ["$", "$Lf", null, {}],
                                            },
                                          ],
                                          [
                                            "$",
                                            "$Ld",
                                            null,
                                            {
                                              children: ["$", "$L10", null, {}],
                                            },
                                          ],
                                          [
                                            "$",
                                            "$Ld",
                                            null,
                                            {
                                              children: ["$", "$L11", null, {}],
                                            },
                                          ],
                                        ],
                                      },
                                    ],
                                    null,
                                  ],
                                  segment: "__PAGE__",
                                },
                                styles: [
                                  [
                                    "$",
                                    "link",
                                    "0",
                                    {
                                      rel: "stylesheet",
                                      href: "/_next/static/css/9a9aedd1f702c897.css?dpl=dpl_DWRqk7ufoR23bkEq1XgenPvDAjTK",
                                      precedence: "next",
                                    },
                                  ],
                                ],
                              },
                            ],
                          },
                        ],
                        [
                          "$",
                          "$Ld",
                          null,
                          { children: ["$", "$L12", null, {}] },
                        ],
                      ],
                    },
                  ],
                  ["$", "$L13", null, {}],
                ],
              },
            ],
          ],
        },
      ],
      null,
    ]),
  },
};
