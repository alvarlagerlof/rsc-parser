export function splitToCleanLines(payload: string) {
  const lines = payload.split("\n");

  if (lines.at(-1) !== "") {
    throw new Error(
      "RSC payload is missing an empty newline at the end indicating that it is not complete."
    );
  }

  lines.pop();

  return lines;
}

export const COLON = "COLON" as const;
export const DOUBLE_QUOTE = "DOUBLE_QUOTE" as const;
export const LEFT_BRACE = "LEFT_BRACE" as const;
export const LEFT_BRACKET = "LEFT_BRACKET" as const;
export const RIGHT_BRACE = "RIGHT_BRACE" as const;
export const RIGHT_BRACKET = "RIGHT_BRACKET" as const;
export const UNKNOWN = "UNKNOWN" as const;

export function lexer(line: string) {
  const chars = line.split("");

  return chars.map((char) => {
    switch (char) {
      case ":":
        return {
          type: COLON,
          value: char,
        };
      case '"':
        return {
          type: DOUBLE_QUOTE,
          value: char,
        };
      case "[":
        return {
          type: LEFT_BRACKET,
          value: char,
        };
      case "{":
        return {
          type: LEFT_BRACE,
          value: char,
        };
      case "]":
        return {
          type: RIGHT_BRACKET,
          value: char,
        };
      case "}":
        return {
          type: RIGHT_BRACE,
          value: char,
        };
      default:
        return {
          type: UNKNOWN,
          value: char,
        };
    }
  });
}

//

//

//

export function parse(tokens: ReturnType<typeof lexer>) {
  const getSignifier = () => {
    const firstColonIndex = tokens.findIndex((token) => token.type === "COLON");
    const tokensBeforeColon = tokens.slice(0, firstColonIndex);
    const signifer = tokensBeforeColon.map((token) => token.value).join("");

    return signifer;
  };

  const getType = () => {
    const firstColonIndex = tokens.findIndex((token) => token.type === "COLON");
    const firstJsonStartIndex = tokens.findIndex(
      (token) =>
        token.type === "DOUBLE_QUOTE" ||
        token.type === "LEFT_BRACE" ||
        token.type === "LEFT_BRACKET"
    );
    const tokensBetweenColonAndJson = tokens.slice(
      firstColonIndex + 1,
      firstJsonStartIndex
    );
    const type = tokensBetweenColonAndJson.map((token) => token.value).join("");

    return type;
  };

  function getData() {
    const firstJsonStartIndex = tokens.findIndex(
      (token) =>
        token.type === "DOUBLE_QUOTE" ||
        token.type === "LEFT_BRACE" ||
        token.type === "LEFT_BRACKET"
    );
    const tokensAfterJsonStart = tokens.slice(firstJsonStartIndex);
    const data = tokensAfterJsonStart.map((token) => token.value).join("");

    return data;
  }

  return {
    signifier: getSignifier(),
    type: getType(),
    data: getData(),
  };

  // let signifier = "";
  // let type = "";
  // let data = "";

  // const parsed: ReturnType<typeof lexer> = [];

  // let state: "START" | "SIGNIFIER" | "TYPE" | "DATA" | "END" = "START";

  // const iterator = tokens.entries();

  // while (state !== "END") {
  //   switch (state) {
  //     case "START":
  //       const token = iterator.next().value;

  //       if (token.type !== UNKNOWN) {
  //         throw new Error("fail");
  //       }
  //       signifier += token.value;
  //       state = "SIGNIFIER";
  //       break;

  //     case "SIGNIFIER": {
  //       let done = false;

  //       while (!done) {
  //         const token = iterator.next().value;
  //         if (token.type === UNKNOWN) {
  //           signifier += token.value;
  //         } else {
  //           state = "TYPE";
  //           done = true;
  //         }
  //       }
  //     }

  //     case "SIGNIFIER": {
  //       let done = false;

  //       while (!done) {
  //         const token = iterator.next().value;
  //         if (token.type === UNKNOWN) {
  //           signifier += token.value;
  //         } else {
  //           state = "TYPE";
  //           done = true;
  //         }
  //       }
  //     }
  //   }

  // for (const token of tokens) {
  //   switch (state) {
  //     case "START":
  //       if (token.type !== UNKNOWN) {
  //         throw new Error("fail");
  //       }

  //       signifier +=
  //   }

  // 0, 2, a, b before :
  /*if (
      token.type === "UNKNOWN" &&
      !parsed.find((token) => token.type === "COLON")
    ) {
      signifer += token.value;
    }

    // Has passed :
    if (parsed.find((token) => token.type === "COLON")) {
      // Found type
      if (
        !parsed.find((token) => token.type === DOUBLE_QUOTE) &&
        !parsed.find((token) => token.type === LEFT_BRACE) &&
        !parsed.find((token) => token.type === LEFT_BRACKET) &&
        !parsed.find((token) => token.type === RIGHT_BRACE) &&
        !parsed.find((token) => token.type === RIGHT_BRACKET) &&
        token.type === "UNKNOWN"
      ) {
        type += token.value;
      }

      // Found JSON start
      if (
        token.type === DOUBLE_QUOTE ||
        token.type === LEFT_BRACE ||
        token.type === LEFT_BRACKET
      ) {
        data += token.value;
      }

      // Continue with JSON when JSON start has been found
      if (
        !parsed.find((token) => token.type === DOUBLE_QUOTE) ||
        !parsed.find((token) => token.type === LEFT_BRACE) ||
        !parsed.find((token) => token.type === LEFT_BRACKET)
      ) {
        data += token.value;
      }
    }

    parsed.push(token);*/
  // }

  // return {
  //   signifier,
  //   type,
  //   data,
  // };
}

//

//

//

//

//

//

//

//

//

export function getLineType(line: string) {
  // eg. I[] or {"a":"b"} or [[]] or HZ[{"a":"b"}]

  if (line.startsWith("{") || line.startsWith("[") || line.startsWith('"')) {
    return undefined;
  }

  let type: string | undefined = undefined;

  for (const char of line.split("")) {
    if (char === "{" || char == "[") {
      if (type === undefined) {
        return undefined;
      }

      if (type !== undefined) {
        return type;
      }
    } else {
      if (type === undefined) {
        type = char;
      } else {
        type += char;
      }
    }
  }

  return type;
}

export function refineLineType(rawType: string | undefined) {
  switch (rawType) {
    case "": {
      return "data";
    }
    case "I": {
      return "import";
    }
    case "HL": {
      return "css";
    }
    default: {
      return "unknown";
    }
  }
}

export function splitLine(line: string) {
  // eg. 0:I{"a":"b"} or 0:{"a":"v"} or a:[{"a":"b"}]

  const [signifier, ...dataArray] = line.split(":");

  if (signifier === "") {
    throw new Error(`Invalid line. Signifier exist.".`);
  }

  if (!/^[A-Za-z0-9]*$/.test(signifier)) {
    throw new Error(
      `Invalid line. Signifier must be a number or a letter. Found "${signifier}".`
    );
  }

  if (dataArray.length == 0) {
    throw new Error("Invalid line. Missing data after signifier.");
  }

  let data = dataArray.join(":");
  const rawType = getLineType(data);
  const type = refineLineType(rawType);

  if (rawType) {
    data = data.replace(rawType, "");
  }

  return { signifier, type, data };
}
