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
import * as Ariakit from "@ariakit/react";

// import { lexer, parse, splitToCleanRows } from "../parse.js";
import { ErrorBoundary } from "react-error-boundary";
import { GenericErrorBoundaryFallback } from "../GenericErrorBoundaryFallback.js";
// import { PayloadContext } from "../PayloadContext.js";
// import { TabContext } from "../TabContext.js";

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

export const ClickClientReferenceContext = createContext<{
  onClickClientReference: (name: string) => void;
  // @ts-ignore
}>(null);

export function TreeRow({
  data,
  onClickClientReference,
}: {
  data: string;
  onClickClientReference: (name: string) => void;
}) {
  const json = JSON.parse(data);

  return (
    <div className="font-code text-md">
      <ClickClientReferenceContext.Provider
        value={{ onClickClientReference: onClickClientReference }}
      >
        <Node value={json} />
      </ClickClientReferenceContext.Provider>
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
      <code className="whitespace-break-spaces break-all dark:text-white">
        {children}
      </code>

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
        <span className="dark:text-white">{value}</span>
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
      <div className="dark:text-white">
        <LeftSquareBracket />
        <RightSquareBracket />
      </div>
    );
  }

  return (
    <>
      {isInsideProps ? (
        <div className="dark:text-white">
          <Blue>
            <LeftCurlyBrace />
          </Blue>
          <LeftSquareBracket />
        </div>
      ) : null}
      <ul
        className={`flex w-full flex-col ${
          isInsideProps ? "pl-[2ch]" : "my-2 gap-2"
        }`}
      >
        {values.map((subValue, i) => {
          const refinedSubNode = refineRawTreeNode(subValue);

          return (
            <li key={JSON.stringify(refinedSubNode.value) + String(i)}>
              <Suspense>
                <Node value={refinedSubNode.value} />
                {isInsideProps && i !== values.length - 1 ? (
                  <span className="dark:text-white">,</span>
                ) : null}
              </Suspense>
            </li>
          );
        })}
      </ul>
      {isInsideProps ? (
        <div className="dark:text-white">
          <Blue>
            <RightCurlyBrace />
          </Blue>
          <RightSquareBracket />
        </div>
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

function DownArrowIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={18}
      className="inline text-slate-900 dark:text-slate-100"
    >
      <title>Down arrow</title>
      <path d="M12 16L6 10H18L12 16Z" fill="currentColor"></path>
    </svg>
  );
}

function RightArrowIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={18}
      className="inline text-slate-900 dark:text-slate-100"
    >
      <title>Right arrow</title>
      <path d="M16 12L10 18V6L16 12Z" fill="currentColor"></path>
    </svg>
  );
}

function NodeElement({ tag, props }: { tag: string; props: JsonObject }) {
  const isInsideProps = useContext(PropsContext);
  const [isOpen, setIsOpen] = useState(true);
  const [isPending, startTransition] = useTransition();
  const disclosure = Ariakit.useDisclosureStore({
    open: isOpen,
    setOpen: (open) => {
      startTransition(() => {
        setIsOpen(open);
      });
    },
  });

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
      <Ariakit.Disclosure
        store={disclosure}
        className="-mx-2 -my-1 cursor-pointer rounded-lg p-1 outline outline-2 outline-transparent transition-all duration-200 hover:bg-slate-700/10 focus:bg-slate-700/10 dark:hover:bg-white/10 dark:focus:bg-white/10"
        style={{ opacity: isPending ? 0.7 : 1 }}
      >
        {isOpen ? <DownArrowIcon /> : <RightArrowIcon />}
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

            <span className="mx-1 rounded-lg border-1 border-solid border-slate-400 px-1.5 dark:text-white">
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
      </Ariakit.Disclosure>

      <Ariakit.DisclosureContent store={disclosure}>
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
              <div className="flex flex-col items-start gap-2 py-1 pl-[2ch]">
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
      </Ariakit.DisclosureContent>

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
  const { onClickClientReference } = useContext(ClickClientReferenceContext);

  return (
    <button
      className="rounded bg-blue-800 px-2 py-1 text-left text-white"
      onClick={() => {
        onClickClientReference(destinationTab);
      }}
    >
      {children}
    </button>
  );
}

// function TabJumpButton({
//   destinationTab,
//   children,
// }: {
//   destinationTab: string;
//   children: ReactNode;
// }) {
//   const tab = useContext(TabContext);
//   if (tab === undefined) {
//     throw new Error("TabContext must be used within a TabContext.Provider");
//   }

//   const payload = useContext(PayloadContext);
//   if (tab === undefined) {
//     throw new Error(
//       "PayloadContext must be used within a PayloadContext.Provider"
//     );
//   }

//   return (
//     <button
//       className="rounded bg-blue-800 px-2 py-1 text-left text-white"
//       onClick={() => {
//         if (destinationTab) {
//           const buttonIdentifier = destinationTab.replace("$L", "");

//           const rows = splitToCleanRows(payload);

//           for (const row of rows) {
//             const tokens = lexer(row);
//             const { identifier } = parse(tokens);

//             if (buttonIdentifier === identifier) {
//               // TODO: Don't hard-code this
//               window.scrollTo(0, 680);
//               tab.setSelectedId(row);
//             }
//           }
//         }
//       }}
//     >
//       {children}
//     </button>
//   );
// }

function InfoBox({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-row items-center gap-2 rounded-md bg-blue-200 p-0.5 px-2 dark:bg-slate-600">
      <span className="font-semibold text-blue-700 dark:text-blue-300">
        INFO
      </span>
      {children}
    </div>
  );
}

function ClientReferenceAnnotation({ tag }: { tag: string }) {
  return (
    <InfoBox>
      <span className="dark:text-white">
        {tag} indicates a client reference
      </span>
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
      <span className="dark:text-white">
        {reference} indicates a tree reference
      </span>
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
