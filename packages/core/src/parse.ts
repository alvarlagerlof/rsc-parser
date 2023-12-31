export function splitToCleanRows(payload: string) {
  if (typeof payload !== "string") {
    throw new Error("Payload is not a string.");
  }

  console.log(payload.split("--------n"));

  const rows = payload.split("--------");

  if (rows.at(-1) !== "") {
    console.error(
      "RSC payload is missing an empty newline at the end indicating that it is not complete.",
    );
    // throw new Error(
    //   "RSC payload is missing an empty newline at the end indicating that it is not complete.",
    // );
  }

  rows.pop();

  return rows;
}

export const COLON = "COLON" as const;
export const DOUBLE_QUOTE = "DOUBLE_QUOTE" as const;
export const LEFT_BRACE = "LEFT_BRACE" as const;
export const LEFT_BRACKET = "LEFT_BRACKET" as const;
export const RIGHT_BRACE = "RIGHT_BRACE" as const;
export const RIGHT_BRACKET = "RIGHT_BRACKET" as const;
export const LETTER_N = "LETTER_N" as const; // for null being sent as a tree type
export const UNKNOWN = "UNKNOWN" as const;

export function lexer(row: string) {
  const chars = row.split("");

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
      case "n":
        return {
          type: LETTER_N,
          value: char,
        };
      case ",":
        return {
          type: "COMMA",
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

export function parse(tokens: ReturnType<typeof lexer>) {
  const getIdentifier = () => {
    const firstColonIndex = tokens.findIndex((token) => token.type === "COLON");
    const tokensBeforeColon = tokens.slice(0, firstColonIndex);
    const identifier = tokensBeforeColon.map((token) => token.value).join("");

    if (identifier === "") {
      throw new Error("No identifier found.");
    }

    return identifier;
  };

  const getType = () => {
    const firstColonIndex = tokens.findIndex((token) => token.type === "COLON");
    const firstJsonStartIndex = tokens.findIndex(
      (token) =>
        token.type === "DOUBLE_QUOTE" ||
        token.type === "LEFT_BRACE" ||
        token.type === "LEFT_BRACKET" ||
        token.type === "LETTER_N",
    );
    const tokensBetweenColonAndJson = tokens.slice(
      firstColonIndex + 1,
      firstJsonStartIndex,
    );
    const type = tokensBetweenColonAndJson.map((token) => token.value).join("");

    if (type.startsWith("T")) {
      return "T";
    }

    return type;
  };

  function getData() {
    if (getType() === "T") {
      const firstCommaIndex = tokens.findIndex(
        (token) => token.type === "COMMA",
      );

      return tokens
        .slice(firstCommaIndex + 1)
        .map((token) => token.value)
        .join("");
    }

    const firstJsonStartIndex = tokens.findIndex(
      (token) =>
        token.type === "DOUBLE_QUOTE" ||
        token.type === "LEFT_BRACE" ||
        token.type === "LEFT_BRACKET" ||
        token.type === "LETTER_N",
    );
    const tokensAfterJsonStart = tokens.slice(firstJsonStartIndex);
    const data = tokensAfterJsonStart.map((token) => token.value).join("");

    if (data === "") {
      throw new Error("No data found.");
    }

    return data;
  }

  return {
    identifier: getIdentifier(),
    type: getType(),
    data: getData(),
  };
}

export function refineRowType(rawType: string | undefined) {
  switch (rawType) {
    case "": {
      return "tree";
    }
    case "I": {
      return "client ref";
    }
    case "HL": {
      return "hint";
    }
    case "T": {
      return "text";
    }
    default: {
      return "unknown";
    }
  }
}
