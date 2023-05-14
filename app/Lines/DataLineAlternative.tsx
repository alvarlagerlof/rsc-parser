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

  const tset = data.map((item) => {
    if (!Array.isArray(item) && !(item instanceof Array)) {
      return {
        type: "OTHER",
        value: item,
      } satisfies TreeOther;
    }

    if (
      item.length === 4 &&
      item[0] === "$" &&
      typeof item[1] === "string" &&
      typeof item[3] === "object" &&
      item[3] !== null &&
      !(item[3] instanceof Array)
    ) {
      // eg. ["$","ul",null,{}]

      const base = {
        type: "COMPONENT",
        value: {
          tag: item[1],
          props: item[3] satisfies Props,
        },
      } satisfies TreeComponent;

      if ("children" in base.value.props) {
        return {
          ...base,
          value: {
            ...base.value,
            props: {
              ...base.value.props,
              children: parseData(item[3].children),
            } satisfies Props,
          },
        } satisfies TreeComponent;
      }

      return base satisfies TreeComponent;
    }

    const parseTest = parseData(item);

    return parseTest;
  });

  return {
    type: "ARRAY",
    value: tset,
  } satisfies TreeArray;
}

export default function DataLineAlternative({ data }: { data: string }) {
  const json = JSON.parse(data);
  const parsed = parseData(json);

  return (
    <>
      <p>Alternative parsing</p>
      <pre>{JSON.stringify(parsed, null, 2)}</pre>
    </>
  );
}
