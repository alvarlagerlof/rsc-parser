import React, {
  ReactNode,
  createContext,
  useContext,
  useState,
  useTransition,
} from "react";
import * as Ariakit from "@ariakit/react";
import { ErrorBoundary } from "react-error-boundary";

import { GenericErrorBoundaryFallback } from "./GenericErrorBoundaryFallback.jsx";
import { DownArrowIcon, RightArrowIcon } from "./FlightResponseIcons.jsx";
import {
  ParsedObject,
  isElement,
  isParsedObject,
} from "../react/ReactFlightClient.js";

export const ClickIDContext = createContext<{
  onClickID: (name: string) => void;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
}>(null);

export function FlightResponseChunkModel({
  data,
  onClickID,
}: {
  data: unknown;
  onClickID: (name: string) => void;
}) {
  return (
    <div className="font-code ligatures-none">
      <ClickIDContext.Provider value={{ onClickID: onClickID }}>
        <Node value={data} />
      </ClickIDContext.Provider>
    </div>
  );
}

function Node({ value }: { value: unknown }) {
  return (
    <ErrorBoundary
      FallbackComponent={GenericErrorBoundaryFallback}
      key={JSON.stringify(value)}
    >
      <NodeSwitch value={value} />
    </ErrorBoundary>
  );
}

function NodeSwitch({ value }: { value: unknown }) {
  if (isElement(value)) {
    return <NodeElement tag={value.type} props={value.props} />;
  }

  if (Array.isArray(value)) {
    return <NodeArray values={value} />;
  }

  if (isParsedObject(value)) {
    return <NodeParsedObject value={value} />;
  }

  if (value instanceof Set) {
    return <NodeSet value={value} />;
  }

  if (typeof value === "symbol") {
    return <NodeSymbol value={value} />;
  }

  if (value instanceof Date) {
    return <NodeDate value={value} />;
  }

  if (Number.isNaN(value)) {
    return <NodeNaN />;
  }

  if (typeof value === "bigint") {
    return <NodeBigInt value={value} />;
  }

  if (typeof value === "number" && isFinite(value) === false && value > 0) {
    return <NodePositiveInfinity />;
  }

  if (typeof value === "number" && isFinite(value) === false && value < 0) {
    return <NodeNegativeInfinity />;
  }

  if (typeof value === "number") {
    return <NodeNumber value={value} />;
  }

  if (value === undefined) {
    return <NodeUndefined />;
  }

  if (value === null) {
    return <NodeNull />;
  }

  if (typeof value === "string") {
    return <NodeString value={value} />;
  }

  if (
    value !== null &&
    typeof value === "object" &&
    Array.isArray(value) === false &&
    !(value instanceof Array)
  ) {
    return <NodeObject value={value} />;
  }

  return <NodeUnknown value={value} />;
}

function removeChildren(props: Record<string, unknown>) {
  return Object.keys(props)
    .filter((key) => key !== "children")
    .reduce<Record<string, unknown>>((result, current) => {
      result[current] = props[current];
      return result;
    }, {});
}

function NodeElement({
  tag,
  props,
}: {
  tag: string;
  props: { [key: string]: unknown };
}) {
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

  const isInsideProps = useContext(PropsContext);

  if (isInsideProps === undefined) {
    throw new Error("PropsContext must be used within a PropsContext.Provider");
  }

  const propsWithoutChildren = removeChildren(props);
  const hasVisibleProps =
    propsWithoutChildren !== undefined &&
    Object.keys(propsWithoutChildren).length > 0;

  const newTag = typeof tag === "string" ? tag : <Node value={tag} />;

  if (Object.keys(props).length === 0) {
    return (
      <div>
        <span className={isInsideProps ? "" : "ml-[18px]"}>
          <Purple>
            <LeftArrow />
          </Purple>
          <Pink>{newTag}</Pink>{" "}
          <Purple>
            /<RightArrow />
          </Purple>
        </span>
      </div>
    );
  }

  return (
    <ObjectContext.Provider value={false}>
      <Ariakit.Disclosure
        store={disclosure}
        className="-my-0.5 cursor-pointer rounded-lg py-0.5 outline outline-2 outline-transparent transition-all duration-200 ligatures-none hover:bg-slate-700/10 focus:bg-slate-700/10 dark:hover:bg-white/10 dark:focus:bg-white/10"
        style={{ opacity: isPending ? 0.7 : 1 }}
      >
        {isOpen ? <DownArrowIcon /> : <RightArrowIcon />}

        <Purple>
          <LeftArrow />
        </Purple>
        <Pink>{newTag}</Pink>
        {isOpen ? (
          <>
            {hasVisibleProps ? null : (
              <Purple>
                {props.children === undefined ? (
                  <>
                    {" "}
                    /<RightArrow />
                  </>
                ) : (
                  <RightArrow />
                )}
              </Purple>
            )}
          </>
        ) : (
          <>
            <Purple>
              <RightArrow />
            </Purple>

            <span className="mx-1 rounded-lg border-1 border-solid border-slate-400 px-1.5">
              ⋯
            </span>
            <Purple>
              <LeftArrow />/
            </Purple>
            <Pink>{newTag}</Pink>
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
                <div className="pl-[18px]">
                  {props.children === undefined ? (
                    <>
                      <Purple>
                        /<RightArrow />
                      </Purple>
                    </>
                  ) : (
                    <Purple>
                      <RightArrow />
                    </Purple>
                  )}
                </div>
              </>
            ) : null}

            {props.children === undefined ? null : (
              <>
                <PropsContext.Provider value={false}>
                  <div className="flex flex-col items-start gap-2 pl-[calc(2ch+18px)]">
                    <ErrorBoundary fallback={<p>fail here</p>}>
                      <Node value={props.children} />
                    </ErrorBoundary>
                  </div>
                </PropsContext.Provider>

                <div className="pl-[18px]">
                  <Purple>
                    <LeftArrow />/
                  </Purple>
                  <Pink>{newTag}</Pink>
                  <Purple>
                    <RightArrow />
                  </Purple>
                </div>
              </>
            )}
          </>
        ) : null}
      </Ariakit.DisclosureContent>
    </ObjectContext.Provider>
  );
}

const PropsContext = createContext(false);

function Prop({ propKey, value }: { propKey: string; value: unknown }) {
  return (
    <>
      <Green>{propKey}</Green>
      <Pink>{`=`}</Pink>
      {(typeof value === "string" && value === "$undefined") ||
      typeof value !== "string" ? (
        <Blue>
          <LeftCurlyBrace />
        </Blue>
      ) : null}

      <PropsContext.Provider value={true}>
        <Node value={value} />
      </PropsContext.Provider>

      {(typeof value === "string" && value === "$undefined") ||
      typeof value !== "string" ? (
        <Blue>
          <RightCurlyBrace />
        </Blue>
      ) : null}
    </>
  );
}

function Props({ props }: { props: { [key: string]: unknown } }) {
  if (isParsedObject(props)) {
    return (
      <div className="pl-[3ch]">
        <Node value={props} />
      </div>
    );
  }

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

function NodeArray({ values }: { values: unknown[] }) {
  const isInsideProps = useContext(PropsContext);

  if (isInsideProps === undefined) {
    throw new Error("PropsContext must be used within a PropsContext.Provider");
  }

  if (values.length == 0) {
    return (
      <div>
        <LeftSquareBracket />
        <RightSquareBracket />
      </div>
    );
  }

  return (
    <div>
      {isInsideProps ? (
        <div className="pl-[2ch]">
          <LeftSquareBracket />
        </div>
      ) : null}
      <ul
        className={`flex w-full flex-col ${
          isInsideProps ? "pl-[4ch]" : "gap-1"
        }`}
      >
        {/* TODO: Why is this spread needed for arrays like `[undefined]` ? */}
        {[...values].map((subValue, i) => {
          return (
            <li key={JSON.stringify(subValue) + String(i)}>
              <Node value={subValue} />
              {isInsideProps && i !== values.length - 1 ? (
                <span className="">,</span>
              ) : null}
            </li>
          );
        })}
      </ul>
      {isInsideProps ? (
        <div className="pl-[2ch]">
          <RightSquareBracket />
        </div>
      ) : null}
    </div>
  );
}

function NodeParsedObject({ value }: { value: ParsedObject }) {
  return (
    <span className="inline-flex flex-row gap-2">
      <TabJumpButton destinationTab={value.id}>
        {value.id} ({value.identifier === "" ? null : `${value.identifier} - `}
        {value.type})
      </TabJumpButton>
    </span>
  );
}

function TabJumpButton({
  destinationTab,
  children,
}: {
  destinationTab: string;
  children: ReactNode;
}) {
  const { onClickID } = useContext(ClickIDContext);

  return (
    <button
      className="inline-flex flex-row items-center gap-1 rounded bg-blue-200 px-1 py-0.5 text-left text-white dark:bg-slate-700"
      onClick={() => {
        onClickID(destinationTab);
      }}
    >
      {children}{" "}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width="16px"
        height="16px"
      >
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          <path
            d="M15.0001 13.5V9M15.0001 9H10.5001M15.0001 9L9.00024 14.9999M7.20024 20H16.8002C17.9203 20 18.4804 20 18.9082 19.782C19.2845 19.5903 19.5905 19.2843 19.7823 18.908C20.0002 18.4802 20.0002 17.9201 20.0002 16.8V7.2C20.0002 6.0799 20.0002 5.51984 19.7823 5.09202C19.5905 4.71569 19.2845 4.40973 18.9082 4.21799C18.4804 4 17.9203 4 16.8002 4H7.20024C6.08014 4 5.52009 4 5.09226 4.21799C4.71594 4.40973 4.40998 4.71569 4.21823 5.09202C4.00024 5.51984 4.00024 6.07989 4.00024 7.2V16.8C4.00024 17.9201 4.00024 18.4802 4.21823 18.908C4.40998 19.2843 4.71594 19.5903 5.09226 19.782C5.52009 20 6.08014 20 7.20024 20Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </g>
      </svg>
    </button>
  );
}

function NodeSet({ value }: { value: Set<unknown> }) {
  return (
    <JSContainerWrapperForObjects>
      Set([{[...value.values()].join(",")}])
    </JSContainerWrapperForObjects>
  );
}

function NodeSymbol({ value }: { value: symbol }) {
  return (
    <JSContainerWrapperForObjects>
      {value.toString()}
    </JSContainerWrapperForObjects>
  );
}

function NodeDate({ value }: { value: Date }) {
  return (
    <JSContainerWrapperForObjects>
      JS Date: {value.toString()}
    </JSContainerWrapperForObjects>
  );
}

function NodeNaN() {
  return <JSContainerWrapperForObjects>NaN</JSContainerWrapperForObjects>;
}

function NodeBigInt({ value }: { value: bigint }) {
  return (
    <JSContainerWrapperForObjects>
      BigInt: {value.toString()}
    </JSContainerWrapperForObjects>
  );
}

function NodePositiveInfinity() {
  return <JSContainerWrapperForObjects>Infinity</JSContainerWrapperForObjects>;
}

function NodeNegativeInfinity() {
  return <JSContainerWrapperForObjects>-Infinity</JSContainerWrapperForObjects>;
}

function NodeNumber({ value }: { value: number }) {
  return (
    <JSContainerWrapperForObjects>
      {value.toString()}
    </JSContainerWrapperForObjects>
  );
}

function NodeNull() {
  return <JSContainerWrapperForObjects>null</JSContainerWrapperForObjects>;
}

function NodeUndefined() {
  return <JSContainerWrapperForObjects>undefined</JSContainerWrapperForObjects>;
}

function NodeString({ value }: { value: string }) {
  const isInsideProps = useContext(PropsContext);

  if (isInsideProps === undefined) {
    throw new Error("PropsContext must be used within a PropsContext.Provider");
  }

  const needsSpecialHandling =
    value.includes("\\") ||
    value.includes("{") ||
    value.includes("}") ||
    value.includes("<") ||
    value.includes(">") ||
    value.includes("(") ||
    value.includes(")") ||
    value.includes("`");

  const formattedString = value
    .replaceAll(`"`, `&#92;"`)
    .replaceAll(`\``, "\\`");

  if (!isInsideProps) {
    return (
      <div className="inline flex-col gap-2">
        {needsSpecialHandling ? (
          <>
            <Blue>
              <LeftCurlyBrace />
            </Blue>
            <Yellow>
              `
              <span
                className=""
                dangerouslySetInnerHTML={{ __html: formattedString }}
              />
              `
            </Yellow>
            <Blue>
              <RightCurlyBrace />
            </Blue>
          </>
        ) : (
          <span
            className=""
            dangerouslySetInnerHTML={{ __html: formattedString }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="inline flex-col gap-2">
      <Yellow>
        &quot;
        <span dangerouslySetInnerHTML={{ __html: formattedString }} />
        &quot;
      </Yellow>
    </div>
  );
}

function NodeObject({ value }: { value: object }) {
  return (
    <ObjectContext.Provider value={true}>
      <JSObjectValue value={value} />
    </ObjectContext.Provider>
  );
}

function NodeUnknown({ value }: { value: unknown }) {
  return (
    <JSContainerWrapperForObjects>
      {JSON.stringify(value, null, 2)}
    </JSContainerWrapperForObjects>
  );
}

function JSContainer({ children }: { children: ReactNode }) {
  const isInsideProps = useContext(PropsContext);

  if (isInsideProps === undefined) {
    throw new Error("PropsContext must be used within a PropsContext.Provider");
  }

  return (
    <span>
      {isInsideProps ? null : (
        <Blue>
          <LeftCurlyBrace />
        </Blue>
      )}

      <code className="whitespace-break-spaces break-all">{children}</code>

      {isInsideProps ? null : (
        <Blue>
          <RightCurlyBrace />
        </Blue>
      )}
    </span>
  );
}

const ObjectContext = createContext(false);

function isLetter(letter: string) {
  return RegExp(/^\p{L}/, "u").test(letter);
}

function JSObjectValue({ value }: { value: object }) {
  const isInsideProps = useContext(PropsContext);

  if (isInsideProps === undefined) {
    throw new Error("PropsContext must be used within a PropsContext.Provider");
  }

  return (
    <JSContainer>
      {isInsideProps ? (
        <Blue>
          <LeftCurlyBrace />
        </Blue>
      ) : null}

      <div className="flex flex-col pl-[2ch]">
        {Object.entries(value).map(([entryKey, entryValue], i) => {
          const needsDoubleQuotes = !isLetter(entryKey[0]);
          return (
            <span key={entryKey}>
              <span>
                {needsDoubleQuotes ? `"` : null}
                {entryKey}
                {needsDoubleQuotes ? `"` : null}:{" "}
              </span>
              <Node value={entryValue} />
              {i !== Object.keys(value).length - 1 ? <>,</> : null}
            </span>
          );
        })}
      </div>

      {isInsideProps ? (
        <Blue>
          <RightCurlyBrace />
        </Blue>
      ) : null}
    </JSContainer>
  );
}

function JSContainerWrapperForObjects({ children }: { children: ReactNode }) {
  const isInsideObject = useContext(ObjectContext);

  if (isInsideObject === undefined) {
    throw new Error(
      "ObjectContext must be used within a ObjectContext.Provider",
    );
  }

  if (isInsideObject) {
    return <JSContainer>{children}</JSContainer>;
  }

  return children;
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
