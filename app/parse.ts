export function parse(payload: string) {
  if (typeof payload !== "string") {
    throw new Error("Payload is not a string");
  }

  const lines = splitToCleanLines(payload);
  const extracted = extract(lines);
  const parsed = parseLines(extracted);

  return parsed;
}

export function parseLines(lines: ReturnType<typeof extract>) {
  return lines.map((line) => {
    const json = JSON.parse(line.rawJson);

    switch (line.rawType) {
      case undefined: {
        return { ...line, type: "data", json } as const;
      }
      case "I": {
        return { ...line, type: "import", json } as const;
      }
      case "HZ": {
        return { ...line, type: "css", json } as const;
      }
      default: {
        return { ...line, type: "unknown", json } as const;
      }
    }
  });
}

export function splitToCleanLines(payload: string) {
  return payload
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line != "");
}

export function splitFirst(input: string, character: string) {
  const [first, ...rest] = input.split(character);
  return [first, rest.join(character)];
}

export function getType(input: string) {
  // eg. I[] or {"a":"b"} or [[]] or HZ[{"a":"b"}]

  if (input.startsWith("{") || input.startsWith("[")) {
    return undefined;
  }

  let type: string | undefined = undefined;

  for (const char of input.split("")) {
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

export function extract(lines: string[]) {
  return lines
    .map((line) => {
      // eg. 0:I{"a":"b"} or 0:{"a":"v"} or a:[{"a":"b"}]

      const [signifier, restSplit] = splitFirst(line, ":");
      const rawType = getType(restSplit);

      if (rawType) {
        return {
          signifier,
          rawType,
          rawJson: restSplit.replace(rawType, ""),
        };
      }

      return {
        signifier,
        rawType,
        rawJson: restSplit,
      };
    })
    .filter((line) => line.rawJson.trim() !== "");
}
