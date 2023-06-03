export const runtime = "edge";

export async function POST(request: Request) {
  const formData = await request.formData();

  const payload = formData.get("payload")?.toString();

  if (payload) {
    const templateLiteral = "`";

    const modifiedPayload = Buffer.from(JSON.stringify(payload)).toString(
      "base64"
    );

    const html = `
        <script>
            localStorage.setItem("payload", JSON.parse(window.atob(${templateLiteral}${modifiedPayload}${templateLiteral})));
            window.location = "/";
        </script>`;

    return new Response(html, {
      headers: {
        "Content-Type": "text / html",
      },
    });
  }

  return new Response("Invalid format", {
    status: 403,
  });
}
