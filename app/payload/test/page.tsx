export default function TestPayloadSend() {
  return (
    <form method="POST" action="/payload/send" className="p-20">
      <textarea
        name="payload"
        placeholder="Enter payload"
        className="w-full rounded bg-slate-100 p-3"
        rows={15}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
