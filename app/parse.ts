export function splitToCleanLines(payload: string) {
  if (typeof payload !== "string") {
    throw new Error("Payload is not a string.");
  }

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
}

export function refineLineType(rawType: string | undefined) {
  switch (rawType) {
    case "": {
      return "tree";
    }
    case "I": {
      return "import";
    }
    case "HL": {
      return "asset";
    }
    default: {
      return "unknown";
    }
  }
}
