import { useContext } from "react";
import { JsonObject, JsonValue } from "type-fest";
import { TabContext } from "../Parser";

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

function Node({ treeItem }: { treeItem: TreeItem }) {
  if (treeItem.type === "ARRAY") {
    return (
      <div className="flex flex-col gap-1">
        <div className="bg-green-300">ARRAY</div>
        <div className="pl-4 flex flex-col gap-1">
          {treeItem.value.map((item) => (
            <Node key={JSON.stringify(item.value)} treeItem={item} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-300 flex flex-col gap-1">
      <Header treeItem={treeItem} />

      <Props treeItem={treeItem} />
    </div>
  );
}

function Header({ treeItem }: { treeItem: TreeItem }) {
  const tab = useContext(TabContext);

  return (
    <div className="flex flex-row gap-4">
      <span className="font-semibold text-lg">{treeItem.type}</span>

      {treeItem.value instanceof Object && "tag" in treeItem.value ? (
        <>
          <span className="whitespace-nowrap flex flex-row gap-4 items-center">
            {String(treeItem.value.tag)}
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
                    const signifier = String(treeItem.value.tag).replace(
                      "$L",
                      ""
                    );

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
        </>
      ) : null}
    </div>
  );
}

function Props({ treeItem }: { treeItem: TreeItem }) {
  if (
    treeItem.value instanceof Object &&
    "props" in treeItem.value &&
    treeItem.value.props instanceof Object
  ) {
    return (
      <>
        <span>
          Props:{" "}
          <pre className="break-all whitespace-break-spaces">
            {isPropsWithChildren(treeItem.value.props)
              ? JSON.stringify(removeChildren(treeItem.value.props), null, 2)
              : JSON.stringify(treeItem.value.props, null, 2)}
          </pre>
        </span>

        {"children" in treeItem.value.props &&
        isTreeItem(treeItem.value.props.children) ? (
          <div>
            Children:{" "}
            <div className="pl-4 py-2 bg-blue-300">
              <Node treeItem={treeItem.value.props.children} />
            </div>
          </div>
        ) : null}
      </>
    );
  }

  return <span>Raw: {JSON.stringify(treeItem.value)}</span>;
}
