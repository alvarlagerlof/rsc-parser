import { ReactNode, createContext, useContext } from "react";
import { JsonObject, JsonValue } from "type-fest";
import { PayloadContext, TabContext, stringToKilobytes } from "../Parser";
import { lexer, parse, splitToCleanLines } from "../parse";

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

export function TreeLine({ data }: { data: string }) {
  const json = JSON.parse(data);
  const parsed = parseData(json);

  return <Node treeItem={parsed} />;
}

export const BackgroundColorLightnessContext = createContext<number>(290);

function Node({ treeItem }: { treeItem: TreeItem }) {
  const backgroundColorLightness = useContext(BackgroundColorLightnessContext);

  switch (treeItem.type) {
    case "ARRAY":
      return (
        <>
          <span>
            ({treeItem.value.length}{" "}
            {treeItem.value.length === 1 ? "item" : "items"})
          </span>

          {treeItem.value.length > 0 ? (
            <ul className="flex flex-col gap-4">
              {treeItem.value.map((item) => (
                <BackgroundColorLightnessContext.Provider
                  key={JSON.stringify(item.value)}
                  value={backgroundColorLightness - 30}
                >
                  <li>
                    <Node treeItem={item} />
                  </li>
                </BackgroundColorLightnessContext.Provider>
              ))}
            </ul>
          ) : (
            "No items."
          )}
        </>
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
          className="flex flex-col space-y-1 rounded-md items-start w-full"
          style={{
            // backgroundColor: `hsl(200, 100%, ${backgroundColorLightness}%)`,
            backgroundColor: `hsl(${backgroundColorLightness}, 100%, 90%)`,
          }}
        >
          <Expandable summary={<ComponentHeader treeItem={treeItem} />} open>
            <ComponentImportReference treeItem={treeItem} />
            <ComponentProps treeItem={treeItem} />
          </Expandable>
        </div>
      );
  }
}

function Expandable({
  summary,
  open,
  children,
}: {
  summary: ReactNode;
  open?: boolean;
  children: ReactNode;
}) {
  return (
    <details open={open} className="flex flex-col space-y-1 rounded-md w-full">
      <summary className="hover:bg-black hover:text-white px-2 py-px rounded-md transition-all duration-100 cursor-pointer">
        {summary}
      </summary>
      <div className="px-2 flex flex-col space-y-1 pb-2">{children}</div>
    </details>
  );
}

function ComponentHeader({ treeItem }: { treeItem: TreeComponent }) {
  return <span className="font-bold">{String(treeItem.value.tag)}</span>;
}

function ComponentImportReference({ treeItem }: { treeItem: TreeComponent }) {
  const tab = useContext(TabContext);
  if (tab === undefined) {
    throw new Error("TabContext must be used within a TabContext.Provder");
  }

  const payload = useContext(PayloadContext);
  if (tab === undefined) {
    throw new Error(
      "PayloadContext must be used within a PayloadContext.Provder"
    );
  }

  if (String(treeItem.value.tag).startsWith("$L")) {
    return (
      <button
        className="underline p-0 text-left w-auto px-2"
        onClick={() => {
          if (
            treeItem.value instanceof Object &&
            treeItem.value &&
            "tag" in treeItem.value &&
            tab !== undefined &&
            tab !== null
          ) {
            const buttonIdentifier = String(treeItem.value.tag).replace(
              "$L",
              ""
            );

            const lines = splitToCleanLines(payload);

            for (const line of lines) {
              const tokens = lexer(line);
              const { identifier } = parse(tokens);

              if (buttonIdentifier === identifier) {
                tab.setTab(line);
              }
            }
          }
        }}
      >
        Ref to: &quot;
        {String(treeItem.value.tag).replace("$L", "")}
        &quot;
      </button>
    );
  }

  return null;
}

function ComponentProps({ treeItem }: { treeItem: TreeComponent }) {
  const backgroundColorLightness = useContext(BackgroundColorLightnessContext);

  const props = isPropsWithChildren(treeItem.value.props)
    ? removeChildren(treeItem.value.props)
    : treeItem.value.props;

  const formattedJSON = JSON.stringify(props, null, 2);

  return (
    <>
      {Object.keys(props).length !== 0 ? (
        <span>
          <Expandable
            open={formattedJSON.length < 300}
            summary={<>Props ({stringToKilobytes(formattedJSON)} KB)</>}
          >
            <pre className="break-all whitespace-break-spaces text-sm">
              {formattedJSON}
            </pre>
          </Expandable>
        </span>
      ) : null}

      {"children" in treeItem.value.props &&
      isTreeItem(treeItem.value.props.children) ? (
        <div>
          <Expandable summary="Children" open>
            <BackgroundColorLightnessContext.Provider
              value={backgroundColorLightness - 30}
            >
              <Node treeItem={treeItem.value.props.children} />
            </BackgroundColorLightnessContext.Provider>
          </Expandable>
        </div>
      ) : null}
    </>
  );
}
