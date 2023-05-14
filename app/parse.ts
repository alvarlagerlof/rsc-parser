import { z } from "zod";

export function refineLineType(rawType: string | undefined) {
  switch (rawType) {
    case undefined: {
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

export function splitToCleanLines(payload: string) {
  const lines = payload.split("\n").map((line) => line.trim());

  if (lines.at(-1) !== "") {
    throw new Error(
      "RSC payload is missing an empty newline at the end indicating that it is not complete."
    );
  }

  lines.pop();

  return lines;
}

export function splitSignifierFromRest(input: string) {
  const [signifier, ...data] = input.split(":");

  if (signifier === "") {
    throw new Error(`Invalid line. Signifier exist.".`);
  }

  if (!/^[A-Za-z0-9]*$/.test(signifier)) {
    throw new Error(
      `Invalid line. Signifier must be a number or a letter. Found "${signifier}".`
    );
  }

  if (data.length == 0) {
    throw new Error("Invalid line. Missing data after signifier.");
  }

  return { signifier, data: data.join(":") };
}

export function getType(input: string) {
  // eg. I[] or {"a":"b"} or [[]] or HZ[{"a":"b"}]

  if (input.startsWith("{") || input.startsWith("[") || input.startsWith('"')) {
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

export function parseLine(line: string) {
  // eg. 0:I{"a":"b"} or 0:{"a":"v"} or a:[{"a":"b"}]

  const { signifier, data } = splitSignifierFromRest(line);
  const rawType = getType(data);
  const type = refineLineType(rawType);

  if (rawType) {
    return {
      signifier,
      rawType,
      type,
      rawJson: data.replace(rawType, ""),
    };
  }

  return {
    signifier,
    rawType,
    type,
    rawJson: data,
  };
}
