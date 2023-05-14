import { JsonObject, JsonValue } from "type-fest";

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

export default function DataLineAlternative({ data }: { data: string }) {
  const json = JSON.parse(data);
  const parsed = parseData(json);

  return (
    <>
      <Node treeItem={parsed} />

      <pre>{JSON.stringify(parsed, null, 2)}</pre>
    </>
  );
}

function Node({ treeItem }: { treeItem: TreeItem }) {
  if (treeItem.type === "ARRAY") {
    return (
      <div>
        <div className="bg-green-300">ARRAY</div>
        <div className="pl-4">
          {treeItem.value.map((item) => (
            <Node key={JSON.stringify(item.value)} treeItem={item} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-300 flex flex-row gap-4">
      <span>{treeItem.type}</span>
      {treeItem.value instanceof Object && "tag" in treeItem.value ? (
        <span>TAG: {String(treeItem.value.tag)}</span>
      ) : (
        <span>RAW: {JSON.stringify(treeItem.value)}</span>
      )}
    </div>
  );
}
