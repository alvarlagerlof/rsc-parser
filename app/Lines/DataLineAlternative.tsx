import { createContext, useContext } from "react";
import { JsonObject, JsonValue } from "type-fest";
import { TabContext, stringToKilobytes } from "../Parser";

interface TreeOther {
  type: "OTHER";
  value: string | number | boolean | JsonObject | null;
}

type Props = {
  [x: string]: JsonValue | TreeItem;
} & {
  [x: string]: JsonValue | undefined | TreeItem;
};

interface TreeComponent {
  type: "COMPONENT";
  value: {
    tag: string;
    props: Props;
  };
}

type TreeItem = TreeOther | TreeComponent | TreeArray;

interface TreeArray {
  type: "ARRAY";
  value: TreeItem[];
}

export function parseData(data: JsonValue): TreeItem {
  if (!Array.isArray(data) && !(data instanceof Array)) {
    return {
      type: "OTHER",
      value: data,
    } satisfies TreeOther;
  }

  if (data === null) {
    return {
      type: "OTHER",
      value: data,
    } satisfies TreeOther;
  }

  if (
    data.length === 4 &&
    data[0] === "$" &&
    typeof data[1] === "string" &&
    typeof data[3] === "object" &&
    data[3] !== null &&
    !(data[3] instanceof Array)
  ) {
    // eg. ["$","ul",null,{}]

    const base = {
      type: "COMPONENT",
      value: {
        tag: data[1],
        props: data[3] satisfies Props,
      },
    } satisfies TreeComponent;

    if ("children" in base.value.props) {
      return {
        ...base,
        value: {
          ...base.value,
          props: {
            ...base.value.props,
            children: parseData(data[3].children),
          } satisfies Props,
        },
      } satisfies TreeComponent;
    }

    return base satisfies TreeComponent;
  }

  return {
    type: "ARRAY",
    value: data.map((item) => {
      if (!Array.isArray(item) && !(item instanceof Array)) {
        return {
          type: "OTHER",
          value: item,
        } satisfies TreeOther;
      }

      const parseTest = parseData(item);

      return parseTest;
    }),
  } satisfies TreeArray;
}

function isPropsWithChildren(props: unknown): props is Record<string, unknown> {
  return (
    typeof props === "object" && props instanceof Object && "children" in props
  );
}

function isTreeItem(item: Props[keyof Props]): item is TreeItem {
  return (
    typeof item === "object" &&
    item instanceof Object &&
    "type" in item &&
    "value" in item
  );
}

function removeChildren(myObj: Record<string, unknown>) {
  return Object.keys(myObj)
    .filter((key) => key !== "children")
    .reduce<Record<string, unknown>>((result, current) => {
      result[current] = myObj[current];
      return result;
    }, {});
}

export default function DataLineAlternative({ data }: { data: string }) {
  const json = JSON.parse(data);
  const parsed = parseData(json);

  return (
    <>
      <Node treeItem={parsed} />
      {/* <pre>{JSON.stringify(parsed, null, 2)}</pre> */}
    </>
  );
}

export const BackgroundColorLightnessContext = createContext<number>(290);

function Node({ treeItem }: { treeItem: TreeItem }) {
  const backgroundColorLightness = useContext(BackgroundColorLightnessContext);

  switch (treeItem.type) {
    case "ARRAY":
      return (
        <details
          className="flex flex-col space-y-1 rounded-md px-2 py-px"
          style={{
            //  `hsl(200, 100%, ${backgroundColorLightness}%)`,
            backgroundColor: `hsl(${backgroundColorLightness}, 100%, 90%)`,
          }}
          open={treeItem.value.length !== 0}
        >
          <summary className="hover:bg-black hover:text-white px-2 py-px rounded-md transition-all duration-100 cursor-pointer">
            [] ({treeItem.value.length}{" "}
            {treeItem.value.length === 1 ? "item" : "items"})
          </summary>
          <div className="pl-4 flex flex-col space-y-1">
            {treeItem.value.length > 0
              ? treeItem.value.map((item) => (
                  <BackgroundColorLightnessContext.Provider
                    key={JSON.stringify(item.value)}
                    value={backgroundColorLightness - 30}
                  >
                    <Node treeItem={item} />
                  </BackgroundColorLightnessContext.Provider>
                ))
              : "No items."}
          </div>
        </details>
      );

    case "OTHER":
      return (
        <p className="px-2 py-px rounded-md transition-all duration-100 font-semibold">
          {JSON.stringify(treeItem.value)}
        </p>
      );

    case "COMPONENT":
      return (
        <div
          className="flex flex-col space-y-1 rounded-md px-2 py-px"
          style={{
            // backgroundColor: `hsl(200, 100%, ${backgroundColorLightness}%)`,
            backgroundColor: `hsl(${backgroundColorLightness}, 100%, 90%)`,
          }}
        >
          <Header treeItem={treeItem} />
          <Props treeItem={treeItem} />
        </div>
      );
  }
}

function Header({ treeItem }: { treeItem: TreeComponent }) {
  const tab = useContext(TabContext);

  return (
    <div className="flex flex-row gap-4">
      <span className="whitespace-nowrap flex flex-row gap-4 items-center">
        <span className="font-semibold">{String(treeItem.value.tag)}</span>
        {String(treeItem.value.tag).startsWith("$L") ? (
          <button
            className="underline p-0"
            onClick={() => {
              tab?.select("line");

              if (
                treeItem.value instanceof Object &&
                treeItem.value &&
                "tag" in treeItem.value &&
                tab !== undefined &&
                tab !== null
              ) {
                const signifier = String(treeItem.value.tag).replace("$L", "");

                const id = tab
                  .getState()
                  .items?.find((item) => item.id.startsWith(signifier))?.id;

                tab.setSelectedId(id);
              }
            }}
          >
            Ref to: &quot;
            {String(treeItem.value.tag).replace("$L", "")}
            &quot;
          </button>
        ) : null}
      </span>
    </div>
  );
}

function Props({ treeItem }: { treeItem: TreeComponent }) {
  const backgroundColorLightness = useContext(BackgroundColorLightnessContext);

  const props = isPropsWithChildren(treeItem.value.props)
    ? removeChildren(treeItem.value.props)
    : treeItem.value.props;

  // if (Object.keys(props).length === 0 && !("children" in props)) {
  //   return null;
  // }

  const formattedJSON = JSON.stringify(props, null, 2);

  return (
    <>
      {Object.keys(props).length !== 0 ? (
        <span>
          <details
            open={formattedJSON.length < 300}
            className="flex flex-col space-y-1 rounded-md px-2 py-px"
            style={{
              // backgroundColor: `hsl(200, 100%, ${backgroundColorLightness}%)`,
              backgroundColor: `hsl(${
                backgroundColorLightness - 30
              }, 100%, 90%)`,
            }}
          >
            <summary className="hover:bg-black hover:text-white px-2 py-px rounded-md transition-all duration-100 cursor-pointer">
              Props ({stringToKilobytes(formattedJSON)} KB)
            </summary>
            <pre className="break-all whitespace-break-spaces">
              {formattedJSON}
            </pre>
          </details>
        </span>
      ) : null}

      {"children" in treeItem.value.props &&
      isTreeItem(treeItem.value.props.children) ? (
        <div>
          <pre>children: </pre>
          <div className="pl-4 py-1">
            <BackgroundColorLightnessContext.Provider
              value={backgroundColorLightness - 30}
            >
              <Node treeItem={treeItem.value.props.children} />
            </BackgroundColorLightnessContext.Provider>
          </div>
        </div>
      ) : null}
    </>
  );
}
