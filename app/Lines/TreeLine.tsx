import React, { ReactNode, createContext, useContext } from "react";
import { JsonObject, JsonValue } from "type-fest";
import { PayloadContext, TabContext, stringToKilobytes } from "../Parser";
import { lexer, parse, splitToCleanLines } from "../parse";
import { ErrorBoundary } from "react-error-boundary";
import { GenericErrorBoundaryFallback } from "../GenericErrorBoundaryFallback";

export const TYPE_OTHER = "TYPE_OTHER";
export const TYPE_COMPONENT = "TYPE_COMPONENT";
export const TYPE_ARRAY = "TYPE_ARRAY";

export function refineRawTreeNode(value: JsonValue) {
  if (!Array.isArray(value) && !(value instanceof Array)) {
    return {
      type: TYPE_OTHER,
      value: value,
    } as const;
  }

  if (
    value.length === 4 &&
    value[0] === "$" &&
    typeof value[1] === "string" &&
    typeof value[3] === "object" &&
    value[3] !== null &&
    !(value[3] instanceof Array)
  ) {
    // eg. ["$","ul",null,{}]
    return {
      type: TYPE_COMPONENT,
      value: [value[0], value[1], value[2], value[3]] as const,
    } as const;
  }

  return {
    type: TYPE_ARRAY,
    value: value,
  } as const;
}

export function TreeLine({ data }: { data: string }) {
  const json = JSON.parse(data);

  return <Node value={json} />;
}

function Node({ value }: { value: JsonValue }) {
  const refinedNode = refineRawTreeNode(value);

  switch (refinedNode.type) {
    case TYPE_OTHER:
      return (
        <ErrorBoundary
          FallbackComponent={GenericErrorBoundaryFallback}
          key={refinedNode.value?.toString()}
        >
          <NodeOther value={refinedNode.value} />
        </ErrorBoundary>
      );
    case TYPE_ARRAY:
      return (
        <ErrorBoundary
          FallbackComponent={GenericErrorBoundaryFallback}
          key={refinedNode.value?.toString()}
        >
          <NodeArray values={refinedNode.value} />
        </ErrorBoundary>
      );
    case TYPE_COMPONENT: {
      const [reactComponentMarker, tag, unknown, props] = refinedNode.value;

      return (
        <ErrorBoundary
          FallbackComponent={GenericErrorBoundaryFallback}
          key={refinedNode.value?.toString()}
        >
          <NodeComponent tag={tag} props={props} />
        </ErrorBoundary>
      );
    }
  }
}

function NodeOther({ value }: { value: JsonValue }) {
  return <p className="font-semibold">{JSON.stringify(value)}</p>;
}

export const BackgroundColorLightnessContext = createContext<number>(290);

function NodeArray({ values }: { values: JsonValue[] | readonly JsonValue[] }) {
  const backgroundColorLightness = useContext(BackgroundColorLightnessContext);

  if (values.length == 0) {
    return <>No items</>;
  }

  return (
    <ul className="flex flex-col gap-4">
      {values.map((subValue, i) => {
        const refinedSubNode = refineRawTreeNode(subValue);

        return (
          <BackgroundColorLightnessContext.Provider
            key={
              JSON.stringify(refinedSubNode.value) +
              String(i) +
              String(backgroundColorLightness)
            }
            value={backgroundColorLightness - 30}
          >
            <li>
              <Node value={refinedSubNode.value} />
            </li>
          </BackgroundColorLightnessContext.Provider>
        );
      })}
    </ul>
  );
}

function NodeComponent({ tag, props }: { tag: string; props: JsonObject }) {
  const backgroundColorLightness = useContext(BackgroundColorLightnessContext);

  return (
    <div
      className="flex flex-col space-y-1 rounded-md items-start w-full"
      style={{
        backgroundColor: `hsl(${backgroundColorLightness}, 100%, 90%)`,
      }}
    >
      <Expandable summary={<ComponentHeader tag={tag} />} open>
        {tag.startsWith("$L") ? <ComponentImportReference tag={tag} /> : null}

        <ComponentProps props={props} />

        {"children" in props ? (
          <div>
            <Expandable summary="Children" open>
              <BackgroundColorLightnessContext.Provider
                value={backgroundColorLightness - 30}
              >
                <Node value={props.children} />
              </BackgroundColorLightnessContext.Provider>
            </Expandable>
          </div>
        ) : null}
      </Expandable>
    </div>
  );
}

function ComponentHeader({ tag }: { tag: string }) {
  return <span className="font-bold">{tag}</span>;
}

function ComponentImportReference({ tag }: { tag: string }) {
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

  if (tag.startsWith("$L")) {
    return (
      <button
        className="underline p-0 text-left w-auto px-2"
        onClick={() => {
          if (tag) {
            const buttonIdentifier = tag.replace("$L", "");

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
        {tag.replace("$L", "")}
        &quot;
      </button>
    );
  }

  return null;
}

function removeKey(object: Record<string, unknown>, key: string) {
  return Object.keys(object)
    .filter((objectKey) => objectKey !== key)
    .reduce<Record<string, unknown>>((result, current) => {
      result[current] = object[current];
      return result;
    }, {});
}

function ComponentProps({ props }: { props: JsonObject }) {
  const propsWithoutChildren =
    "children" in props ? removeKey(props, "children") : props;
  const formattedProps = JSON.stringify(propsWithoutChildren, null, 2);

  return (
    <>
      {Object.keys(props).length !== 0 ? (
        <span>
          <Expandable
            open={formattedProps.length < 300}
            summary={<>Props ({stringToKilobytes(formattedProps)} KB)</>}
          >
            <pre className="break-all whitespace-break-spaces text-sm">
              {formattedProps}
            </pre>
          </Expandable>
        </span>
      ) : null}
    </>
  );
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
