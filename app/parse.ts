export function parse(payload: string) {
  if (typeof payload !== "string") {
    throw new Error("Payload is not a string");
  }

  return true;
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
    console.log(char);
    if (char === "{" || char == "[") {
      console.log("(1) char with { pr [");

      if (type === undefined) {
        console.log("(1) type is undefined");
        return undefined;
      }

      if (type !== undefined) {
        console.log("(1) type is NOT undefined");
        return type;
      }
    } else {
      if (type === undefined) {
        console.log("(2) type is undefined");
        type = char;
      } else {
        console.log("(2) type is NOT undefined");
        type += char;
      }
    }
  }

  return type;
}

export function extract(lines: string[]) {
  return lines.map((line) => {
    // eg. 0:I{"a":"b"} or 0:{"a":"v"} or a:[{"a":"b"}]

    const [signifier, restSplit] = splitFirst(line, ":");
    const rawType = getType(restSplit);

    if (rawType) {
      return {
        signifier,
        rawType,
        data: restSplit.replace(rawType, ""),
      };
    }

    return {
      signifier,
      rawType,
      data: restSplit,
    };
  });
}
