export function Meter({ fraction }: { fraction: number }) {
  return (
    <meter
      value={fraction}
      min="0"
      max="1"
      className={[
        "h-3 w-14",
        "[&::-webkit-meter-bar]:rounded-lg",
        "[&::-webkit-meter-optimum-value]:rounded-lg",
        "[&::-webkit-meter-bar]:border-0",
        "[&::-webkit-meter-optimum-value]:border-0",
        "[&::-webkit-meter-bar]:bg-slate-300",
        "dark:[&::-webkit-meter-bar]:bg-slate-500",
        "[&::-webkit-meter-optimum-value]:bg-black",
        "dark:[&::-webkit-meter-optimum-value]:bg-white",
      ].join(" ")}
    >
      {(fraction * 100).toFixed(2)}%
    </meter>
  );
}
