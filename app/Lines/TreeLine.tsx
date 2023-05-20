import React, {
  ChangeEvent,
  ReactNode,
  Suspense,
  createContext,
  useContext,
  useState,
} from "react";
import { ErrorBoundary } from "react-error-boundary";
import { GenericErrorBoundaryFallback } from "../GenericErrorBoundaryFallback";
import { TabContext } from "../TabContext";
import { PayloadContext } from "../PayloadContext";
import {
  LazyComponentReference,
  ParsedElement,
  ParsedModel,
  ParsedPayload,
  PickVariant,
  SomeTreeReference as SomeReference,
  isComponentReference,
  isLazyReference,
  isPromiseReference,
} from "../parse-payload";
import { JetBrains_Mono } from "next/font/google";

const jetBrainsMono = JetBrains_Mono({ subsets: ["latin-ext"] });

export const TYPE_OTHER = "TYPE_OTHER";
export const TYPE_ELEMENT = "TYPE_ELEMENT";
export const TYPE_ARRAY = "TYPE_ARRAY";

type RefinedNode = ReturnType<typeof refineRawTreeNode>;

export function refineRawTreeNode(value: ParsedModel) {
  if (typeof value !== "object" || !value) {
    return {
      type: TYPE_OTHER,
      value: value,
    } as const;
  }

  if (Array.isArray(value)) {
    return {
      type: TYPE_ARRAY,
      value: value,
    } as const;
  }

  if (!("type" in value) || value.type !== "element") {
    return {
      type: TYPE_OTHER,
      value: value as Exclude<typeof value, ParsedElement>,
    } as const;
  }

  return {
    type: TYPE_ELEMENT,
    value: value as ParsedElement,
  } as const;
}

export function TreeLine({ data }: { data: any }) {
  return (
    <div className={`${jetBrainsMono.className} text-sm`}>
      <Node value={data} />
    </div>
  );
}

function Node({ value }: { value: ParsedModel }) {
  const refinedNode = refineRawTreeNode(value);
  console.log("Node", refinedNode);

  // if (typeof refinedNode !== "object") {
  //   return JSON.stringify(refinedNode);
  // }

  // if (!("type" in refinedNode) || typeof refinedNode.type !== "string") {
  //   return JSON.stringify(refinedNode);
  // }

  switch (refinedNode.type) {
    case TYPE_OTHER:
      return (
        <ErrorBoundary FallbackComponent={GenericErrorBoundaryFallback}>
          <NodeOther value={refinedNode.value} />
        </ErrorBoundary>
      );
    case TYPE_ARRAY:
      return (
        <ErrorBoundary FallbackComponent={GenericErrorBoundaryFallback}>
          <Suspense>
            <NodeArray values={refinedNode.value} />
          </Suspense>
        </ErrorBoundary>
      );
    case TYPE_ELEMENT: {
      const { elementType, props } = refinedNode.value;

      return (
        <ErrorBoundary FallbackComponent={GenericErrorBoundaryFallback}>
          <NodeComponent elementType={elementType} props={props} />
        </ErrorBoundary>
      );
    }
    default: {
      throw new Error("huh?");
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

function JSObjectValue({ value }: { value: Record<string, ParsedModel> }) {
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

function NodeOther({
  value,
}: {
  value: PickVariant<RefinedNode, "TYPE_OTHER">["value"];
}) {
  const isInsideObject = useContext(ObjectContext);

  if (isInsideObject === undefined) {
    throw new Error(
      "ObjectContext must be used within a ObjectContext.Provder"
    );
  }

  if (value === undefined) {
    // TODO: These isInsideObject conditions are a bit messy,
    // I need to find antoher way to handle it.
    if (isInsideObject) {
      return <>undefined</>;
    }
    return <JSContainer>undefined</JSContainer>;
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

  if (typeof value === "symbol") {
    return (
      <JSContainer>Symbol.for({JSON.stringify(value.toString())})</JSContainer>
    );
  }

  if (
    typeof value === "object" &&
    !Array.isArray(value) &&
    !(value instanceof Array)
  ) {
    if (isLazyReference(value)) {
      return <ComponentTreeReference reference={value} />;
    }

    if (isPromiseReference(value)) {
      return <ComponentTreeReference reference={value} />;
    }

    if (value instanceof Date) {
      return <JSContainer>new Date({value.toJSON()})</JSContainer>;
    }
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
    throw new Error("PropsContext must be used within a PropsContext.Provder");
  }

  if (!isInsideProp) {
    return (
      <div className="inline flex-col gap-2">
        <span>{value}</span>
      </div>
    );
  }

  return (
    <div className="inline flex-col gap-2">
      <Yellow>&quot;{value}&quot;</Yellow>
    </div>
  );
}

function NodeArray({
  values,
}: {
  values: ParsedModel[] | readonly ParsedModel[];
}) {
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

function Prop({ propKey, value }: { propKey: string; value: ParsedModel }) {
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

function Props({ props }: { props: Record<string, ParsedModel> }) {
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
    <div className="pl-[3ch] flex flex-col">
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

const getComponentNameForTag = (
  tag: ParsedElement["elementType"],
  chunks: ParsedPayload["chunks"]
  // parsed: ParsedPayload
) => {
  if (typeof tag === "string") {
    return tag;
  }
  // TODO: read component name from chunks

  const ref = chunks.get(tag.id);
  if (ref?.type === "module-import") {
    return ref.meta.name || `unnamed(${tag.id})`;
  }
  if (ref?.type === "model") {
    console.log("got model", ref.data);
    if (typeof ref.data === "symbol") {
      return ref.data.description;
    }
    return JSON.stringify(ref.data);
  }
  return `unresolved(${tag.id})`;
};

function NodeComponent({
  elementType,
  props,
}: {
  elementType: ParsedElement["elementType"];
  props: ParsedElement["config"];
}) {
  const isInsideProps = useContext(PropsContext);
  const [isOpen, setIsOpen] = useState(true);

  const { chunks } = useContext(PayloadContext);

  // const parsedPayload = parsePayload(payload);

  const componentLabel = getComponentNameForTag(elementType, chunks);

  const ComponentName = isComponentReference(elementType) ? Blue : Pink;

  const componentLabelEl = <ComponentName>{componentLabel}</ComponentName>;

  // const componentLabel = componentName
  //   ? `${componentName} (${elementType})`
  //   : elementType;

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
          setIsOpen(event.target.open);
        }}
      >
        <summary className="cursor-pointer rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 px-2 py-1 -mx-2 -my-1">
          {isOpen ? (
            <>
              <Purple>
                <LeftArrow />
              </Purple>
              {componentLabelEl}
              <Props props={props} />
              <Purple>
                <RightArrow />
              </Purple>
            </>
          ) : (
            <>
              <Purple>
                <LeftArrow />
              </Purple>
              {componentLabelEl}
              <Purple>
                <RightArrow />
              </Purple>
              <span className="rounded-lg border-1 border-slate-400 border-solid px-1.5 mx-1">
                ⋯
              </span>
              <Purple>
                <LeftArrow />/
              </Purple>
              {componentLabelEl}
              {/* <Pink>{elementType}</Pink> */}
              <Purple>
                <RightArrow />
              </Purple>
            </>
          )}
        </summary>

        <PropsContext.Provider value={false}>
          <div className="pl-[2ch] flex flex-col gap-2 items-start">
            {isComponentReference(elementType) ? (
              <ComponentImportReference reference={elementType} />
            ) : null}
            {props.children !== undefined && <Node value={props.children} />}
          </div>
        </PropsContext.Provider>

        <div>
          <Purple>
            <LeftArrow />/
          </Purple>
          {componentLabelEl}
          <Purple>
            <RightArrow />
          </Purple>
        </div>
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
  destinationTab: number;
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
          // const buttonIdentifier = getRowIdFromTag(destinationTab);
          window.scrollTo(0, 680);
          tab.setTab(destinationTab);
        }
      }}
    >
      {children}
    </button>
  );
}

function getRowIdFromTag(tag: string) {
  const referenceRegex = /\$(L|@)(\d+)/;
  return tag.match(referenceRegex)?.[1] ?? null;
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

function ComponentImportReference({
  reference,
}: {
  reference: LazyComponentReference;
}) {
  const textReference = `$L${reference.id}`;
  return (
    <InfoBox>
      <span>{textReference} indicates a client component</span>
      <TabJumpButton destinationTab={reference.id}>
        Go to &quot;
        {reference.id}
        &quot;
      </TabJumpButton>
    </InfoBox>
  );
}

// function PromiseReference({ reference }: { reference: string }) {
//   const textReference = `$@${reference.id}`;
//   return (
//     <InfoBox>
//       <span>{reference} indicates a promise</span>
//       <TabJumpButton destinationTab={reference.id}>
//         Go to &quot;
//         {getRowIdFromTag(reference)}
//         &quot;
//       </TabJumpButton>
//     </InfoBox>
//   );
// }

const getTextReference = (ref: SomeReference) => {
  switch (ref.type) {
    case "lazy-reference":
      return `$L${ref.id}`;
    case "promise-reference":
      return `$@${ref.id}`;
  }
};

function ComponentTreeReference({ reference }: { reference: SomeReference }) {
  const textReference = getTextReference(reference);
  const referenceType = () => {
    switch (reference.type) {
      case "lazy-reference":
        return "async tree reference";
      case "promise-reference":
        return "promise reference";
    }
  };
  return (
    <InfoBox>
      <span>
        {textReference} indicates a {referenceType()}
      </span>
      <TabJumpButton destinationTab={reference.id}>
        Go to &quot;
        {reference.id}
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
