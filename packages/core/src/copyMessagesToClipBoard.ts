import { RscChunkMessage } from "./types";

export function copyMessagesToClipBoard({
  messages,
}: {
  messages: RscChunkMessage[];
}) {
  const stingifiedMessages = JSON.stringify(messages);
  console.log(stingifiedMessages);
  const input = document.createElement("input");
  // @ts-expect-error This is a hack
  input.style = "position: absolute; left: -1000px; top: -1000px";
  input.value = stingifiedMessages;
  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  document.body.removeChild(input);
  alert("Copied messages to clipboard");
}
