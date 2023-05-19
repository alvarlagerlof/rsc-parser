import React, {
  ChangeEvent,
  ReactNode,
  Suspense,
  createContext,
  useContext,
  useState,
  useTransition,
} from "react";
import { JsonObject, JsonValue } from "type-fest";
import { lexer, parse, splitToCleanRows } from "../parse";
import { ErrorBoundary } from "react-error-boundary";
import { GenericErrorBoundaryFallback } from "../GenericErrorBoundaryFallback";
import { TabContext } from "../TabContext";
import { PayloadContext } from "../PayloadContext";
import { JetBrains_Mono } from "next/font/google";

const jetBrainsMono = JetBrains_Mono({ subsets: ["latin-ext"] });

export const TYPE_OTHER = "TYPE_OTHER";
export const TYPE_ELEMENT = "TYPE_ELEMENT";
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
      type: TYPE_ELEMENT,
      value: [value[0], value[1], value[2], value[3]] as const,
    } as const;
  }

  return {
    type: TYPE_ARRAY,
    value: value,
  } as const;
}

export function TreeRow({ data }: { data: string }) {
  const json = JSON.parse(data);

  return (
    <div className={`${jetBrainsMono.className} text-sm`}>
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
    case TYPE_ELEMENT: {
      const [reactElementMarker, elementType, unknown, props] =
        refinedNode.value;

      return (
        <ErrorBoundary
          FallbackComponent={GenericErrorBoundaryFallback}
          key={refinedNode.value?.toString()}
        >
          <NodeElement tag={elementType} props={props} />
        </ErrorBoundary>
      );
    }
  }
}

function JSContainer({ children }: { children: ReactNode }) {
  return (
    <span>
      <Blue>
        <LeftCurlyBrace />
      </Blue>
      <code className="break-all whitespace-break-spaces">{children}</code>

      <Blue>
        <RightCurlyBrace />
      </Blue>
    </span>
  );
}

const ObjectContext = createContext(false);

function JSObjectValue({ value }: { value: JsonObject }) {
  return (
    <JSContainer>
      <div className="flex flex-col pl-[2ch]">
        {Object.entries(value).map(([entryKey, entryValue], i) => {
          return (
            <span key={entryKey}>
              <span>{entryKey}: </span>
              <Node value={entryValue} />
              {i !== Object.keys(value).length - 1 ? <>,</> : null}
            </span>
          );
        })}
      </div>
    </JSContainer>
  );
}

function NodeOther({ value }: { value: JsonValue }) {
  const isInsideObject = useContext(ObjectContext);

  if (isInsideObject === undefined) {
    throw new Error(
      "ObjectContext must be used within a ObjectContext.Provider"
    );
  }

  if (value === "$undefined") {
    // TODO: These isInsideObject conditions are a bit messy,
    // I need to find another way to handle it.
    if (isInsideObject) {
      return <>undefined</>;
    }
    return <JSContainer>undefined</JSContainer>;
  }

  if (value === undefined) {
    if (isInsideObject) {
      return <>undefined</>;
    }
    return <JSContainer>undefined</JSContainer>;
    // TODO: Potentially don't render {undefined}
    // return null;
  }

  if (value === null) {
    if (isInsideObject) {
      return <>null</>;
    }
    return <JSContainer>null</JSContainer>;
  }

  if (typeof value === "string") {
    return <StringValue value={value} />;
  }

  if (
    value !== null &&
    typeof value === "object" &&
    Array.isArray(value) === false &&
    !(value instanceof Array)
  ) {
    return (
      <ObjectContext.Provider value={true}>
        <JSObjectValue value={value} />
      </ObjectContext.Provider>
    );
  }

  if (isInsideObject) {
    return <>{JSON.stringify(value, null, 2)}</>;
  }

  return <JSContainer>{JSON.stringify(value, null, 2)}</JSContainer>;
}

function StringValue({ value }: { value: string }) {
  const isInsideProp = useContext(PropsContext);

  if (isInsideProp === undefined) {
    throw new Error("PropsContext must be used within a PropsContext.Provider");
  }

  if (!isInsideProp) {
    return (
      <div className="inline flex-col gap-2">
        <span>{value}</span>
        {value.startsWith("$L") ? (
          <TreeReferenceAnnotation reference={value} />
        ) : null}
      </div>
    );
  }

  return (
    <div className="inline flex-col gap-2">
      <Yellow>&quot;{value}&quot;</Yellow>
      {value.startsWith("$L") ? (
        <TreeReferenceAnnotation reference={value} />
      ) : null}
    </div>
  );
}

function NodeArray({ values }: { values: JsonValue[] | readonly JsonValue[] }) {
  const isInsideProps = useContext(PropsContext);

  if (values.length == 0) {
    return (
      <>
        <LeftSquareBracket />
        <RightSquareBracket />
      </>
    );
  }

  return (
    <>
      {isInsideProps ? (
        <>
          <Blue>
            <LeftCurlyBrace />
          </Blue>
          <LeftSquareBracket />
        </>
      ) : null}
      <ul
        className={`flex flex-col w-full ${
          isInsideProps ? "pl-[2ch]" : "my-2 gap-2"
        }`}
      >
        {values.map((subValue, i) => {
          const refinedSubNode = refineRawTreeNode(subValue);

          return (
            <li key={JSON.stringify(refinedSubNode.value) + String(i)}>
              <Suspense>
                <Node value={refinedSubNode.value} />
                {isInsideProps && i !== values.length - 1 ? <>,</> : null}
              </Suspense>
            </li>
          );
        })}
      </ul>
      {isInsideProps ? (
        <>
          <Blue>
            <RightCurlyBrace />
          </Blue>
          <RightSquareBracket />
        </>
      ) : null}
    </>
  );
}

const PropsContext = createContext(false);

function Prop({ propKey, value }: { propKey: string; value: JsonValue }) {
  return (
    <>
      <Green>{propKey}</Green>
      <Pink>{`=`}</Pink>
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
    // Long props should break the row
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
    <div className="pl-[3ch]">
      {rootProps
        .filter((rootProp) => rootProp !== "children")
        .map((rootProp, i) => {
          return (
            <div key={rootProp}>
              <Prop propKey={rootProp} value={props[rootProp]} />
              {i < rootProps.length - 1 ? " " : null}
            </div>
          );
        })}
    </div>
  );
}

function removeChildren(props: Record<string, unknown>) {
  return Object.keys(props)
    .filter((key) => key !== "children")
    .reduce<Record<string, unknown>>((result, current) => {
      result[current] = props[current];
      return result;
    }, {});
}

function NodeElement({ tag, props }: { tag: string; props: JsonObject }) {
  const isInsideProps = useContext(PropsContext);
  const [isOpen, setIsOpen] = useState(true);
  const [isPending, startTransition] = useTransition();

  const propsWithoutChildren = removeChildren(props);
  const hasVisibleProps =
    propsWithoutChildren !== undefined &&
    Object.keys(propsWithoutChildren).length > 0;

  return (
    <ObjectContext.Provider value={false}>
      {/* left curly brace */}
      {isInsideProps ? (
        <>
          <Blue>&#123;</Blue>
        </>
      ) : null}
      <details
        className="flex flex-col gap-1 w-full"
        open={isOpen}
        onToggle={(event: ChangeEvent<HTMLDetailsElement>) => {
          event.stopPropagation();
          startTransition(() => {
            setIsOpen(event.target.open);
          });
        }}
      >
        <summary
          className="cursor-pointer rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 px-2 py-1 -mx-2 -my-1 transition-opacity duration-75"
          style={{ opacity: isPending ? 0.7 : 1 }}
        >
          <Purple>
            <LeftArrow />
          </Purple>
          <Pink>{tag}</Pink>
          {isOpen ? (
            <>
              {hasVisibleProps ? null : (
                <Purple>
                  <RightArrow />
                </Purple>
              )}
            </>
          ) : (
            <>
              <Purple>
                <RightArrow />
              </Purple>

              <span className="rounded-lg border-1 border-slate-400 border-solid px-1.5 mx-1">
                ⋯
              </span>
              <Purple>
                <LeftArrow />/
              </Purple>
              <Pink>{tag}</Pink>
              <Purple>
                <RightArrow />
              </Purple>
            </>
          )}
        </summary>

        {isOpen ? (
          // This is kind of misusing <details><summary>, but it lets us
          // avoid rendering the children if it is not open
          <>
            {hasVisibleProps ? (
              <>
                <Props props={props} />
                <div className="pl-[2ch]">
                  <Purple>
                    <RightArrow />
                  </Purple>
                </div>
              </>
            ) : null}

            <PropsContext.Provider value={false}>
              <div className="pl-[2ch] flex flex-col gap-2 items-start">
                {tag.startsWith("$L") ? (
                  <ClientReferenceAnnotation tag={tag} />
                ) : null}
                <Node value={props.children} />
              </div>
            </PropsContext.Provider>

            <div>
              <Purple>
                <LeftArrow />/
              </Purple>
              <Pink>{tag}</Pink>
              <Purple>
                <RightArrow />
              </Purple>
            </div>
          </>
        ) : null}
      </details>
      {/* right curly brace */}
      {isInsideProps ? (
        <>
          <Blue>&#125;</Blue>
        </>
      ) : null}
    </ObjectContext.Provider>
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
    throw new Error("TabContext must be used within a TabContext.Provider");
  }

  const payload = useContext(PayloadContext);
  if (tab === undefined) {
    throw new Error(
      "PayloadContext must be used within a PayloadContext.Provider"
    );
  }

  return (
    <button
      className="text-left bg-blue-800 text-white rounded px-2 py-1"
      onClick={() => {
        if (destinationTab) {
          const buttonIdentifier = destinationTab.replace("$L", "");

          const rows = splitToCleanRows(payload);

          for (const row of rows) {
            const tokens = lexer(row);
            const { identifier } = parse(tokens);

            if (buttonIdentifier === identifier) {
              // TODO: Don't hard-code this
              window.scrollTo(0, 680);
              tab.setTab(row);
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
    <div className="bg-blue-200 dark:bg-slate-600 rounded-md text-sm p-1 flex flex-row gap-2 px-2 items-center">
      <span className="text-blue-700 dark:text-blue-300 font-semibold">
        INFO
      </span>
      {children}
    </div>
  );
}

function ClientReferenceAnnotation({ tag }: { tag: string }) {
  return (
    <InfoBox>
      <span>{tag} indicates an a client reference</span>
      <TabJumpButton destinationTab={tag}>
        Go to &quot;
        {tag.replace("$L", "")}
        &quot;
      </TabJumpButton>
    </InfoBox>
  );
}

function TreeReferenceAnnotation({ reference }: { reference: string }) {
  return (
    <InfoBox>
      <span>{reference} indicates a tree reference</span>
      <TabJumpButton destinationTab={reference}>
        Go to &quot;
        {reference.replace("$L", "")}
        &quot;
      </TabJumpButton>
    </InfoBox>
  );
}

function Purple({ children }: { children: ReactNode }) {
  return <span className="text-purple-500">{children}</span>;
}

function Pink({ children }: { children: ReactNode }) {
  return <span className="text-pink-700 dark:text-pink-500">{children}</span>;
}

function Yellow({ children }: { children: ReactNode }) {
  return (
    <span className="text-yellow-600 dark:text-yellow-300">{children}</span>
  );
}

function Blue({ children }: { children: ReactNode }) {
  return <span className="text-blue-500">{children}</span>;
}

function Green({ children }: { children: ReactNode }) {
  return <span className="text-green-700 dark:text-green-400">{children}</span>;
}

function LeftCurlyBrace() {
  return <>&#123;</>;
}

function RightCurlyBrace() {
  return <>&#125;</>;
}

function LeftSquareBracket() {
  return <>&#91;</>;
}

function RightSquareBracket() {
  return <>&#93;</>;
}

function LeftArrow() {
  return <>&lt;</>;
}

function RightArrow() {
  return <>&gt;</>;
}
