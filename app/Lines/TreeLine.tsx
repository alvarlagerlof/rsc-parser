import React, {
  ChangeEvent,
  ReactNode,
  Suspense,
  createContext,
  useContext,
  useState,
} from "react";
import { JsonObject, JsonValue } from "type-fest";
import { stringToKiloBytes } from "../stringtoKiloBytes";
import { lexer, parse, splitToCleanLines } from "../parse";
import { ErrorBoundary } from "react-error-boundary";
import { GenericErrorBoundaryFallback } from "../GenericErrorBoundaryFallback";
import { TabContext } from "../TabContext";
import { PayloadContext } from "../PayloadContext";

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

  return (
    <div className="bg-slate-100">
      <Node value={json} />
    </div>
  );
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
          <Suspense>
            <NodeArray values={refinedNode.value} />
          </Suspense>
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

function JSValue({ value }: { value: JsonValue }) {
  return (
    <span>
      {/* left curly brace */}
      <span className="text-blue-500">&#123;</span>
      <code className="break-all whitespace-break-spaces text-sm">
        {typeof value === "string" ? value : JSON.stringify(value, null, 2)}
      </code>
      {/* right curly brace */}
      <span className="text-blue-500">&#125;</span>
    </span>
  );
}

function StringValue({ value }: { value: string }) {
  return (
    <div className="inline-flex flex-col gap-2">
      <span className="text-yellow-600">&quot;{value}&quot;</span>
      {value.startsWith("$L") ? (
        <ComponenTreeReference reference={value} />
      ) : null}
    </div>
  );
}

function NodeOther({ value }: { value: JsonValue }) {
  if (value === "$undefined") {
    return <JSValue value="undefined" />;
  }

  if (value === null) {
    return <JSValue value="null" />;
  }

  if (value === undefined) {
    return <JSValue value="undefined" />;
  }

  if (typeof value !== "string") {
    return <JSValue value={value} />;
  }

  return <StringValue value={value} />;
}

function NodeArray({ values }: { values: JsonValue[] | readonly JsonValue[] }) {
  const isInsideProps = useContext(PropsContext);

  if (values.length == 0) {
    return <>&#91;&#93;</>;
  }

  return (
    <>
      {/* left curly brace and square bracket */}
      {isInsideProps ? (
        <>
          <span className="text-blue-500">&#123;</span>&#91;
        </>
      ) : null}
      <ul
        className={`flex flex-col gap-2 w-full ${
          isInsideProps ? "pl-4" : "my-2 "
        }`}
      >
        {values.map((subValue, i) => {
          const refinedSubNode = refineRawTreeNode(subValue);

          return (
            <li key={JSON.stringify(refinedSubNode.value) + String(i)}>
              <Suspense>
                <Node value={refinedSubNode.value} />
              </Suspense>
            </li>
          );
        })}
      </ul>
      {/* right curly brace and square bracket */}
      {isInsideProps ? (
        <>
          <span className="text-blue-500">&#125;</span>&#93;
        </>
      ) : null}
    </>
  );
}

const PropsContext = createContext(false);

function Prop({ propKey, value }: { propKey: string; value: JsonValue }) {
  return (
    <>
      <span className="text-green-700">{propKey}</span>
      <span className="text-pink-700">{`=`}</span>
      <PropsContext.Provider value={true}>
        <Node value={value} />
      </PropsContext.Provider>
    </>
  );
}

function Props({ props }: { props: JsonObject }) {
  const rootProps = Object.keys(props);

  if (
    rootProps.length === 0 ||
    (rootProps.length === 1 && rootProps[0] === "children")
  ) {
    return null;
  }

  // Only show props inline if there is just one prop
  if (
    rootProps.length === 1 &&
    // Long props should break the line
    String(props[rootProps[0]]).length < 80
  ) {
    return (
      <>
        {" "}
        <Prop propKey={rootProps[0]} value={props[rootProps[0]]} />
      </>
    );
  }

  return (
    <div className="pl-4 flex flex-col">
      {rootProps
        .filter((rootProp) => rootProp !== "children")
        .map((rootProp, i) => {
          return (
            <span key={rootProp}>
              <Prop propKey={rootProp} value={props[rootProp]} />
              {i < rootProps.length - 1 ? " " : null}
            </span>
          );
        })}
    </div>
  );
}

function NodeComponent({ tag, props }: { tag: string; props: JsonObject }) {
  const isInsideProps = useContext(PropsContext);
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {/* left curly brace */}
      {isInsideProps ? (
        <>
          <span className="text-blue-500">&#123;</span>
        </>
      ) : null}
      <details
        className="flex flex-col gap-1 w-full"
        open={isOpen}
        onToggle={(event: ChangeEvent<HTMLDetailsElement>) => {
          event.stopPropagation();
          setIsOpen(event.target.open);
        }}
      >
        <summary className="cursor-pointer rounded-lg hover:bg-gray-200 px-2 py-1 -mx-2 -my-1">
          {isOpen ? (
            <>
              <span className="text-purple-500">&lt;</span>
              <span className="text-pink-700">{tag}</span>
              <Props props={props} />
              <span className="text-purple-500">&gt;</span>
            </>
          ) : (
            <>
              <span className="text-purple-500">&lt;</span>
              <span className="text-pink-700">{tag}</span>
              <span className="text-purple-500">&gt;</span>
              <span className="rounded-lg border-1 border-slate-400 border-solid px-1.5 mx-1">
                ⋯
              </span>
              <span className="text-purple-500">&lt;/</span>
              <span className="text-pink-700">{tag}</span>
              <span className="text-purple-500">&gt;</span>
            </>
          )}
        </summary>

        <div className="pl-4 flex flex-col gap-2 items-start">
          {tag.startsWith("$L") ? <ComponentImportReference tag={tag} /> : null}
          <Node value={props.children} />
        </div>

        <div>
          <span className="text-purple-500">&lt;/</span>
          <span className="text-pink-700">{tag}</span>
          <span className="text-purple-500">&gt;</span>
        </div>
      </details>
      {/* right curly brace */}
      {isInsideProps ? (
        <>
          <span className="text-blue-500">&#125;</span>
        </>
      ) : null}
    </>
  );
}

function TabJumpButton({
  destinationTab,
  children,
}: {
  destinationTab: string;
  children: ReactNode;
}) {
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

  return (
    <button
      className="text-left bg-blue-800 text-white rounded px-2 py-1"
      onClick={() => {
        if (destinationTab) {
          const buttonIdentifier = destinationTab.replace("$L", "");

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
      {children}
    </button>
  );
}

function InfoBox({ children }: { children: ReactNode }) {
  return (
    <div className="bg-blue-200 rounded-md text-sm p-1 flex flex-row gap-2 px-2 items-center">
      {children}
    </div>
  );
}

function ComponentImportReference({ tag }: { tag: string }) {
  return (
    <InfoBox>
      <span className="text-blue-700 font-semibold">INFO</span>
      <span>{tag} indicates an imported component</span>
      <TabJumpButton destinationTab={tag}>
        Go to &quot;
        {tag.replace("$L", "")}
        &quot;
      </TabJumpButton>
    </InfoBox>
  );
}

function ComponenTreeReference({ reference }: { reference: string }) {
  return (
    <InfoBox>
      <span className="text-blue-700 font-semibold">INFO</span>
      <span>{reference} indicates an a tree renference</span>
      <TabJumpButton destinationTab={reference}>
        Go to &quot;
        {reference.replace("$L", "")}
        &quot;
      </TabJumpButton>
    </InfoBox>
  );
}
