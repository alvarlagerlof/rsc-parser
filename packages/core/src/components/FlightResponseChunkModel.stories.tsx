import type { Meta, StoryObj } from "@storybook/react";

import { FlightResponseChunkModel } from "./FlightResponseChunkModel";
import { REACT_ELEMENT_TYPE } from "../react/ReactSymbols";

const meta: Meta<typeof FlightResponseChunkModel> = {
  argTypes: { onClickID: { action: "clicked client reference" } },
  component: FlightResponseChunkModel,
};

export default meta;
type Story = StoryObj<typeof FlightResponseChunkModel>;

export const String: Story = {
  args: {
    data: "L7SkxK6dEGIxPChCswhi8",
  },
};

export const StringArray: Story = {
  args: {
    data: ["L7SkxK6dEGIxPChCswhi8", "children", "main"],
  },
};

export const Boolean: Story = {
  args: {
    data: true,
  },
};

export const Number: Story = {
  args: {
    data: 0,
  },
};

export const Undefined: Story = {
  args: {
    data: undefined,
  },
};

export const Null: Story = {
  args: {
    data: null,
  },
};

export const EmptyElement: Story = {
  args: {
    data: { $$typeof: REACT_ELEMENT_TYPE, type: "br", key: "0", props: {} },
  },
};

export const ElementWithChildren: Story = {
  args: {
    data: {
      $$typeof: REACT_ELEMENT_TYPE,
      type: "p",
      key: "0",
      props: { children: "Hello world" },
    },
  },
};

export const ElementsWithCodeChildren: Story = {
  args: {
    data: [
      {
        $$typeof: REACT_ELEMENT_TYPE,
        type: "p",
        key: "0",
        props: { children: "{}" },
      },
      {
        $$typeof: REACT_ELEMENT_TYPE,
        type: "p",
        key: "0",
        props: { children: "()" },
      },
      {
        $$typeof: REACT_ELEMENT_TYPE,
        type: "p",
        key: "0",
        props: { children: "<>" },
      },
      {
        $$typeof: REACT_ELEMENT_TYPE,
        type: "p",
        key: "0",
        props: { children: "`" },
      },
      {
        $$typeof: REACT_ELEMENT_TYPE,
        type: "p",
        key: "0",
        props: { children: "``" },
      },
    ],
  },
};

export const StringProp: Story = {
  args: {
    data: {
      $$typeof: REACT_ELEMENT_TYPE,
      type: "div",
      key: "0",
      props: { className: "test" },
    },
  },
};

export const EscapedStringProp: Story = {
  args: {
    data: {
      $$typeof: REACT_ELEMENT_TYPE,
      type: "div",
      key: "0",
      props: { className: 'this a "quote"' },
    },
  },
};

export const NumberProp: Story = {
  args: {
    data: {
      $$typeof: REACT_ELEMENT_TYPE,
      type: "Component",
      key: "0",
      props: { something: 0 },
    },
  },
};

export const BooleanProp: Story = {
  args: {
    data: {
      $$typeof: REACT_ELEMENT_TYPE,
      type: "Component",
      key: "0",
      props: { something: true },
    },
  },
};

export const ElementProp: Story = {
  args: {
    data: {
      $$typeof: REACT_ELEMENT_TYPE,
      type: "Component",
      key: "0",
      props: {
        element: {
          $$typeof: REACT_ELEMENT_TYPE,
          type: "div",
          key: "0",
          props: {},
        },
      },
    },
  },
};

export const ObjectProps: Story = {
  args: {
    data: {
      $$typeof: REACT_ELEMENT_TYPE,
      type: "div",
      key: "0",
      props: { data: { some: "thing", foo: "bar" } },
    },
  },
};

export const NestedObjectProps: Story = {
  args: {
    data: {
      $$typeof: REACT_ELEMENT_TYPE,
      type: "div",
      key: "0",
      props: { data: { some: "thing", foo: { baz: "bar" } } },
    },
  },
};

export const ArrayProp: Story = {
  args: {
    data: {
      $$typeof: REACT_ELEMENT_TYPE,
      type: "div",
      key: "0",
      props: { data: ["test", "hello"] },
    },
  },
};

export const ArrayObjectProp: Story = {
  args: {
    data: {
      $$typeof: REACT_ELEMENT_TYPE,
      type: "div",
      key: "0",
      props: { x: { y: [{ foo: "bar" }, { foo: "bar" }] } },
    },
  },
};

export const ElementArray: Story = {
  args: {
    data: [
      {
        $$typeof: REACT_ELEMENT_TYPE,
        type: "br",
        key: "0",
        props: {},
      },
      {
        $$typeof: REACT_ELEMENT_TYPE,
        type: "br",
        key: "0",
        props: {},
      },
      {
        $$typeof: REACT_ELEMENT_TYPE,
        type: "br",
        key: "0",
        props: {},
      },
    ],
  },
};

export const NestedElementArray: Story = {
  args: {
    data: [
      {
        $$typeof: REACT_ELEMENT_TYPE,
        type: "div",
        key: "0",
        props: {
          children: [
            {
              $$typeof: REACT_ELEMENT_TYPE,
              type: "br",
              key: "0",
              props: {},
            },
            {
              $$typeof: REACT_ELEMENT_TYPE,
              type: "br",
              key: "0",
              props: {},
            },
          ],
        },
      },
      {
        $$typeof: REACT_ELEMENT_TYPE,
        type: "div",
        key: "0",
        props: {
          children: [
            {
              $$typeof: REACT_ELEMENT_TYPE,
              type: "br",
              key: "0",
              props: {},
            },
            {
              $$typeof: REACT_ELEMENT_TYPE,
              type: "br",
              key: "0",
              props: {},
            },
          ],
        },
      },
      {
        $$typeof: REACT_ELEMENT_TYPE,
        type: "div",
        key: "0",
        props: {
          children: [
            {
              $$typeof: REACT_ELEMENT_TYPE,
              type: "br",
              key: "0",
              props: {},
            },
            {
              $$typeof: REACT_ELEMENT_TYPE,
              type: "br",
              key: "0",
              props: {},
            },
          ],
        },
      },
    ],
  },
};

export const ClientRef: Story = {
  args: {
    data: {
      $$typeof: REACT_ELEMENT_TYPE,
      type: "$L9",
      key: "0",
      props: {},
    },
  },
};

export const FirstRowExample: Story = {
  args: {
    data: [
      "L7SkxK6dEGIxPChCswhi8",
      [
        [
          "children",
          "(main)",
          "children",
          "projects",
          ["projects", { children: ["__PAGE__", {}] }],
          "$L1",
          [
            [],
            [
              "$L2",
              {
                $$typeof: REACT_ELEMENT_TYPE,
                type: "meta",
                key: null,
                props: { name: "next-size-adjust" },
              },
            ],
          ],
        ],
      ],
    ],
  },
};
export const MetaTagsExample: Story = {
  args: {
    data: [
      {
        $$typeof: REACT_ELEMENT_TYPE,
        type: "meta",
        key: "0",
        props: { charSet: "utf-8" },
      },
      {
        $$typeof: REACT_ELEMENT_TYPE,
        type: "title",
        key: "1",
        props: { children: "Projects" },
      },
      {
        $$typeof: REACT_ELEMENT_TYPE,
        type: "meta",
        key: "2",
        props: {
          name: "description",
          content: "These are some of the projects I've worked on",
        },
      },
      {
        $$typeof: REACT_ELEMENT_TYPE,
        type: "meta",
        key: "3",
        props: { name: "theme-color", content: "#16a34a" },
      },
      {
        $$typeof: REACT_ELEMENT_TYPE,
        type: "meta",
        key: "4",
        props: {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
      },
      {
        $$typeof: REACT_ELEMENT_TYPE,
        type: "link",
        key: "5",
        props: {
          rel: "alternate",
          type: "application/rss+xml",
          href: "https://alvar.dev/feed.xml",
        },
      },
      {
        $$typeof: REACT_ELEMENT_TYPE,
        type: "meta",
        key: "6",
        props: { property: "og:site_name", content: "alvar.dev" },
      },
      {
        $$typeof: REACT_ELEMENT_TYPE,
        type: "meta",
        key: "7",
        props: { property: "og:image:type", content: "image/png" },
      },
      {
        $$typeof: REACT_ELEMENT_TYPE,
        type: "meta",
        key: "8",
        props: {
          property: "og:image",
          content:
            "https://alvar.dev/projects/opengraph-image-7gbxx9?92712a71ecaaf7f6",
        },
      },
      {
        $$typeof: REACT_ELEMENT_TYPE,
        type: "meta",
        key: "9",
        props: { property: "og:image:width", content: "1200" },
      },
      {
        $$typeof: REACT_ELEMENT_TYPE,
        type: "meta",
        key: "10",
        props: { property: "og:image:height", content: "630" },
      },
      {
        $$typeof: REACT_ELEMENT_TYPE,
        type: "meta",
        key: "11",
        props: { name: "twitter:card", content: "summary_large_image" },
      },
      {
        $$typeof: REACT_ELEMENT_TYPE,
        type: "meta",
        key: "12",
        props: { name: "twitter:site", content: "@alvarlagerlof" },
      },
      {
        $$typeof: REACT_ELEMENT_TYPE,
        type: "meta",
        key: "13",
        props: { name: "twitter:creator", content: "@alvarlagerlof" },
      },
      {
        $$typeof: REACT_ELEMENT_TYPE,
        type: "meta",
        key: "14",
        props: { name: "twitter:image:type", content: "image/png" },
      },
      {
        $$typeof: REACT_ELEMENT_TYPE,
        type: "meta",
        key: "15",
        props: {
          name: "twitter:image",
          content:
            "https://alvar.dev/projects/opengraph-image-7gbxx9?92712a71ecaaf7f6",
        },
      },
      {
        $$typeof: REACT_ELEMENT_TYPE,
        type: "meta",
        key: "16",
        props: { name: "twitter:image:width", content: "1200" },
      },
      {
        $$typeof: REACT_ELEMENT_TYPE,
        type: "meta",
        key: "17",
        props: { name: "twitter:image:height", content: "630" },
      },
      {
        $$typeof: REACT_ELEMENT_TYPE,
        type: "link",
        key: "18",
        props: { rel: "icon", href: "/favicons/favicon.ico" },
      },
      {
        $$typeof: REACT_ELEMENT_TYPE,
        type: "link",
        key: "19",
        props: {
          rel: "icon",
          href: "/favicons/favicon-16x16.png",
          sizes: "16x16",
        },
      },
      {
        $$typeof: REACT_ELEMENT_TYPE,
        type: "link",
        key: "20",
        props: {
          rel: "icon",
          href: "/favicons/favicon-32x32.png",
          sizes: "32x32",
        },
      },
      {
        $$typeof: REACT_ELEMENT_TYPE,
        type: "link",
        key: "21",
        props: {
          rel: "icon",
          href: "/favicons/favicon-192x192.png",
          sizes: "192x192",
        },
      },
    ],
  },
};

export const NextJsExample: Story = {
  args: {
    data: [
      {
        $$typeof: REACT_ELEMENT_TYPE,
        type: "html",
        key: null,
        props: {
          lang: "en",
          suppressHydrationWarning: true,
          children: [
            {
              $$typeof: REACT_ELEMENT_TYPE,
              type: "head",
              key: null,
              props: {},
            },
            {
              $$typeof: REACT_ELEMENT_TYPE,
              type: "body",
              key: null,
              props: {
                children: [
                  {
                    $$typeof: REACT_ELEMENT_TYPE,
                    type: "$L6",
                    key: null,
                    props: {},
                  },
                  {
                    $$typeof: REACT_ELEMENT_TYPE,
                    type: "$L7",
                    key: null,
                    props: {},
                  },
                  {
                    $$typeof: REACT_ELEMENT_TYPE,
                    type: "$L8",
                    key: null,
                    props: {
                      children: [
                        {
                          $$typeof: REACT_ELEMENT_TYPE,
                          type: "$L9",
                          key: null,
                          props: {},
                        },
                        {
                          $$typeof: REACT_ELEMENT_TYPE,
                          type: "main",
                          key: null,
                          props: {
                            children: {
                              $$typeof: REACT_ELEMENT_TYPE,
                              type: "$La",
                              key: null,
                              props: {
                                parallelRouterKey: "children",
                                segmentPath: ["children"],
                                error: "$undefined",
                                errorStyles: "$undefined",
                                loading: "$undefined",
                                loadingStyles: "$undefined",
                                hasLoading: false,
                                template: {
                                  $$typeof: REACT_ELEMENT_TYPE,
                                  type: "$Lb",
                                  key: null,
                                  props: {},
                                },
                                templateStyles: "$undefined",
                                notFound: "$undefined",
                                notFoundStyles: "$undefined",
                                childProp: {
                                  current: [
                                    {
                                      $$typeof: REACT_ELEMENT_TYPE,
                                      type: "div",
                                      key: null,
                                      props: {
                                        className: "home_root__yKyeQ",
                                        children: [
                                          {
                                            $$typeof: REACT_ELEMENT_TYPE,
                                            type: "div",
                                            key: null,
                                            props: {
                                              id: "geist-skip-nav",
                                              tabIndex: -1,
                                            },
                                          },
                                          {
                                            $$typeof: REACT_ELEMENT_TYPE,
                                            type: "$Lc",
                                            key: null,
                                            props: {},
                                          },
                                          {
                                            $$typeof: REACT_ELEMENT_TYPE,
                                            type: "$Ld",
                                            key: null,
                                            props: {
                                              children: {
                                                $$typeof: REACT_ELEMENT_TYPE,
                                                type: "$Le",
                                                key: null,
                                                props: {},
                                              },
                                            },
                                          },
                                          {
                                            $$typeof: REACT_ELEMENT_TYPE,
                                            type: "$Ld",
                                            key: null,
                                            props: {
                                              children: {
                                                $$typeof: REACT_ELEMENT_TYPE,
                                                type: "$Lf",
                                                key: null,
                                                props: {},
                                              },
                                            },
                                          },
                                          {
                                            $$typeof: REACT_ELEMENT_TYPE,
                                            type: "$Ld",
                                            key: null,
                                            props: {
                                              children: {
                                                $$typeof: REACT_ELEMENT_TYPE,
                                                type: "$L10",
                                                key: null,
                                                props: {},
                                              },
                                            },
                                          },
                                          {
                                            $$typeof: REACT_ELEMENT_TYPE,
                                            type: "$Ld",
                                            key: null,
                                            props: {
                                              children: {
                                                $$typeof: REACT_ELEMENT_TYPE,
                                                type: "$L11",
                                                key: null,
                                                props: {},
                                              },
                                            },
                                          },
                                        ],
                                      },
                                    },
                                    null,
                                  ],
                                  segment: "__PAGE__",
                                },
                                styles: [
                                  {
                                    $$typeof: REACT_ELEMENT_TYPE,
                                    type: "link",
                                    key: "0",
                                    props: {
                                      rel: "stylesheet",
                                      href: "/_next/static/css/9a9aedd1f702c897.css?dpl=dpl_DWRqk7ufoR23bkEq1XgenPvDAjTK",
                                      precedence: "next",
                                    },
                                  },
                                ],
                              },
                            },
                          },
                        },
                        {
                          $$typeof: REACT_ELEMENT_TYPE,
                          type: "$Ld",
                          key: null,
                          props: {
                            children: {
                              $$typeof: REACT_ELEMENT_TYPE,
                              type: "$L12",
                              key: null,
                              props: {},
                            },
                          },
                        },
                      ],
                    },
                  },
                  {
                    $$typeof: REACT_ELEMENT_TYPE,
                    type: "$L13",
                    key: null,
                    props: {},
                  },
                ],
              },
            },
          ],
        },
      },
      null,
    ],
  },
};
