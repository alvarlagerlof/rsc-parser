import { RscEvent } from "./events";

export function copyEventsToClipboard({ events }: { events: RscEvent[] }) {
  const stingifiedEvents = JSON.stringify(events);
  console.log(stingifiedEvents);
  const input = document.createElement("input");
  // @ts-expect-error This is a hack
  input.style = "position: absolute; left: -1000px; top: -1000px";
  input.value = stingifiedEvents;
  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  document.body.removeChild(input);
  alert("Copied events to clipboard");
}
