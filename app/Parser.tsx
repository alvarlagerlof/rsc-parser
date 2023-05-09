"use client";

import { FormEvent, useState } from "react";
import { JSONTree } from "react-json-tree";
import { z } from "zod";

const rscImportSchema = z
  .object({
    async: z.boolean(),
    id: z.string(),
    name: z.string(),
    chunks: z.array(z.string()),
  })
  .strict();

const rscComponentSchema = z.tuple([
  z.literal("$").describe("component"),
  z.string().describe("element type"),
  z.union([z.null(), z.string().describe("maybe id")]),
  z.intersection(
    z.object({
      children: z.array(z.unknown()).optional(),
    }),
    z.record(z.string(), z.unknown())
  ),
]);

const defaultPayload = `0:[["children","(main)","children","__PAGE__",["__PAGE__",{}],"$L1",[[],["$L2",["$","meta",null,{"name":"next-size-adjust"}]]]]]
3:I{"id":"29854","chunks":["414:static/chunks/414-9ee1a4f70730f5c0.js","1004:static/chunks/1004-456f71c9bb70e7ee.js","3213:static/chunks/3213-648f64f230debb40.js","7974:static/chunks/app/(main)/page-16ca770141ca5c0a.js"],"name":"Pronunciation","async":false}
4:I{"id":"90414","chunks":["414:static/chunks/414-9ee1a4f70730f5c0.js","3517:static/chunks/app/(main)/blog/page-e34a27ef633cfac9.js"],"name":"","async":false}
5:"$Sreact.suspense"
6:I{"id":"61981","chunks":["414:static/chunks/414-9ee1a4f70730f5c0.js","1004:static/chunks/1004-456f71c9bb70e7ee.js","3213:static/chunks/3213-648f64f230debb40.js","7974:static/chunks/app/(main)/page-16ca770141ca5c0a.js"],"name":"ItemLoading","async":false}
8:I{"id":"25548","chunks":["414:static/chunks/414-9ee1a4f70730f5c0.js","1004:static/chunks/1004-456f71c9bb70e7ee.js","3213:static/chunks/3213-648f64f230debb40.js","7974:static/chunks/app/(main)/page-16ca770141ca5c0a.js"],"name":"ItemLoading","async":false}
1:[["$","div",null,{"className":"inflate-y-8 md:inflate-y-14 divide-y-2 divide-separator divide-solid","children":[["$","header",null,{"children":[["$","h1",null,{"className":"font-heading text-4xl md:text-7xl mb-4","children":"I'm Alvar LagerlÃ¶f"}],["$","$L3",null,{}],["$","h2",null,{"className":"font-subheading text-xl md:text-2xl max-w-[50ch]","children":["A developer and designer. My story starts with a $2 computer from a flea market."," ",["$","$L4",null,{"href":"/about","target":"_self","rel":"","className":"text-primary font-semibold no-underline hover:underline","children":["Learn more"," â†’"]}]]}]]}],["$","div",null,{"className":"inflate-y-8 md:inflate-x-14 md:inflate-y-0 divide-y-2 md:divide-y-0 md:divide-x-2 divide-solid divide-separator divide-solid flex flex-col md:flex-row","children":[["$","section",null,{"className":"md:w-1/2","children":[["$","h3",null,{"className":"font-heading text-2xl md:text-4xl mb-6 md:mb-8","children":"Featured projects"}],["$","$5",null,{"fallback":["$","div",null,{"className":"space-y-8","children":[["$","$L6",null,{}],["$","$L6",null,{}],["$","$L6",null,{}]]}],"children":"$L7"}]]}],["$","section",null,{"className":"md:w-1/2","children":[["$","h3",null,{"className":"font-heading text-2xl md:text-4xl mb-6 md:mb-8","children":"Recent blog posts"}],["$","ul",null,{"className":"space-y-4 md:space-y-8","children":["$","$5",null,{"fallback":[["$","$L8",null,{}],["$","$L8",null,{}],["$","$L8",null,{}],["$","$L8",null,{}]],"children":"$L9"}]}],["$","h4",null,{"className":"text-xl font-subheading mt-12","children":["$","$L4",null,{"href":"/blog","target":"_self","rel":"","className":"text-primary font-semibold no-underline hover:underline","children":["All posts"," â†’"]}]}]]}]]}]]}],null]
2:[[["$","meta",null,{"charSet":"utf-8"}],["$","title",null,{"children":"Alvar LagerlÃ¶f"}],["$","meta",null,{"name":"description","content":"Developer and designer from Stockholm"}],null,null,null,null,null,null,[["$","meta",null,{"name":"theme-color","content":"#16a34a"}]],null,["$","meta",null,{"name":"viewport","content":"width=device-width, initial-scale=1"}],null,null,null,null,null,null,null,null,null,null,[]],[null,null,null,null],null,null,[null,null,null,null,null],null,[null,null,null,null,null,null,null,null,[[["$","meta",null,{"property":"og:image","content":"https://portfolio-oggzsm2ux-lagerlof.vercel.app/og/default?title=Alvar%20Lagerl%C3%B6f&description=Developer%20and%20designer%20from%20Stockholm"}]]],null,null,null,null,null,null,"$undefined"],[["$","meta",null,{"name":"twitter:card","content":"summary_large_image"}],["$","meta",null,{"name":"twitter:site","content":"@alvarlagerlof"}],null,["$","meta",null,{"name":"twitter:creator","content":"@alvarlagerlof"}],null,null,null,null,null,null],null,[null,[["$","link",null,{"rel":"icon","href":"/favicons/favicon.ico"}],["$","link",null,{"rel":"icon","href":"/favicons/favicon-16x16.png","sizes":"16x16"}],["$","link",null,{"rel":"icon","href":"/favicons/favicon-32x32.png","sizes":"32x32"}],["$","link",null,{"rel":"icon","href":"/favicons/favicon-192x192.png","sizes":"192x192"}]],[],null]]
a:I{"id":"61981","chunks":["414:static/chunks/414-9ee1a4f70730f5c0.js","1004:static/chunks/1004-456f71c9bb70e7ee.js","3213:static/chunks/3213-648f64f230debb40.js","7974:static/chunks/app/(main)/page-16ca770141ca5c0a.js"],"name":"Item","async":false}
7:[["$","ul",null,{"className":"space-y-6 md:space-y-8","children":[["$","$La","36c4cb3f-3940-4d09-a711-a47abf53b566",{"_id":"36c4cb3f-3940-4d09-a711-a47abf53b566","name":"Scoreboarder","description":"Website for Discord bot managing scoreboards","link":"https://scoreboarder.xyz","banner":{"asset":{"originalFilename":"Frame 17.png","assetId":"591e25a3975b7cce87abb2652ce75b80001ffbfb","_type":"sanity.imageAsset","mimeType":"image/png","size":193160,"sha1hash":"591e25a3975b7cce87abb2652ce75b80001ffbfb","url":"https://cdn.sanity.io/images/crizldqq/production/591e25a3975b7cce87abb2652ce75b80001ffbfb-3245x2000.png","metadata":{"lqip":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAMCAYAAABiDJ37AAAACXBIWXMAAAsTAAALEwEAmpwYAAABD0lEQVQokbVSy0rDUBDNTzXNq72PZBJLa0DUVJOGWGO13XSna3EtuBH8AsG/PDL3FhN3onFxGObAnDnzcFxPwvUHgifh9InxAKJOPxl5FoMI+qGEEAqTqcI4sPZHP4TbM+FwEkQSp3mMfZvhpiJkpDEV6qsBQ0gFKZXhOefIuRAKYSStCRbkDlorPOyO8PGS4+1pgXVJKE4S1AWhPEtQnSdYXxLaitAsyfCrggzXLAmLmTamOkGlcL/N8P58jNfHOa4urOB1SQZceFun2DYp7uoUm1VqOI5tScjncSdoRg6lIbmIuyexHTnWFvoQmbfoOK0Voslh7/2jeIE0u+DjmPf59VH872/z10f/38ceAp9y5aLUMyVXKAAAAABJRU5ErkJggg==","dimensions":{"aspectRatio":1.6225,"height":2000,"_type":"sanity.imageDimensions","width":3245},"isOpaque":true,"blurHash":"V28zrs~8M~of0Qt7oLj@azaz054@$~WV~7ogR+WCoLoe","_type":"sanity.imageMetadata","palette":{"darkMuted":{"background":"#59452f","_type":"sanity.imagePaletteSwatch","foreground":"#fff","title":"#fff","population":0.55},"muted":{"background":"#a48557","_type":"sanity.imagePaletteSwatch","foreground":"#fff","title":"#fff","population":0.28},"lightVibrant":{"background":"#e6c882","_type":"sanity.imagePaletteSwatch","foreground":"#000","title":"#000","population":0.58},"darkVibrant":{"background":"#3b310b","_type":"sanity.imagePaletteSwatch","foreground":"#fff","title":"#fff","population":0.56},"lightMuted":{"background":"#7f6019","_type":"sanity.imagePaletteSwatch","foreground":"#fff","title":"#fff","population":0},"vibrant":{"background":"#e7c737","_type":"sanity.imagePaletteSwatch","foreground":"#000","title":"#fff","population":0.27},"dominant":{"foreground":"#000","title":"#000","population":0.58,"background":"#e6c882","_type":"sanity.imagePaletteSwatch"},"_type":"sanity.imagePalette"},"hasAlpha":true},"_rev":"g9aAx0KW4Ne3S6JwzAuU4r","_updatedAt":"2022-04-03T10:17:08Z","_createdAt":"2022-04-03T10:17:08Z","_id":"image-591e25a3975b7cce87abb2652ce75b80001ffbfb-3245x2000-png","extension":"png","uploadId":"wwRrbnDCSIpUoR0AEbMZdPsazU0io8hr","path":"images/crizldqq/production/591e25a3975b7cce87abb2652ce75b80001ffbfb-3245x2000.png"}}}],["$","$La","90b92320-3572-4ae7-a6ad-664a69f07566",{"_id":"90b92320-3572-4ae7-a6ad-664a69f07566","name":"next-banner","description":"Generate Open Graph images for Next.js at build","link":"https://github.com/alvarlagerlof/next-banner","banner":{"asset":{"url":"https://cdn.sanity.io/images/crizldqq/production/a7367e3a460ed37db301d49a7ff011a3367e0bba-902x507.jpg","path":"images/crizldqq/production/a7367e3a460ed37db301d49a7ff011a3367e0bba-902x507.jpg","_createdAt":"2021-10-07T23:26:29Z","extension":"jpg","_updatedAt":"2021-10-07T23:26:29Z","size":116245,"_id":"image-a7367e3a460ed37db301d49a7ff011a3367e0bba-902x507-jpg","uploadId":"bQ1PLr5C0nFn9HWTTpMhHDBVibcLafnQ","sha1hash":"a7367e3a460ed37db301d49a7ff011a3367e0bba","_rev":"Rfna04Xn7gw6L6GeeQ264h","_type":"sanity.imageAsset","metadata":{"lqip":"data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAALABQDASIAAhEBAxEB/8QAGQAAAgMBAAAAAAAAAAAAAAAAAAcEBQYI/8QAJBAAAgEDAgYDAAAAAAAAAAAAAQIDAAQFERMGBxIhMWEUFTP/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/EAB0RAAEEAgMAAAAAAAAAAAAAAAABAgMREiExUfD/2gAMAwEAAhEDEQA/AFpwthY722iY3Nqss8m2scqEke61lrwE86R63eLQNIY9Sh1HupvKyCJ8Fjy8aMTdkEka0y7aONNlVjjA+Sx06RRW6y9Yo8G62vuzl/P4/wCry91ZbqzbLletewNFWXMHvxjlPH7HwKKUhXk//9k=","dimensions":{"aspectRatio":1.7790927021696252,"height":507,"_type":"sanity.imageDimensions","width":902},"isOpaque":true,"_type":"sanity.imageMetadata","palette":{"darkMuted":{"background":"#2c3444","_type":"sanity.imagePaletteSwatch","foreground":"#fff","title":"#fff","population":0},"muted":{"background":"#9d756a","_type":"sanity.imagePaletteSwatch","foreground":"#fff","title":"#fff","population":0.17},"lightVibrant":{"_type":"sanity.imagePaletteSwatch","foreground":"#000","title":"#fff","population":5.32,"background":"#f87d6f"},"darkVibrant":{"_type":"sanity.imagePaletteSwatch","foreground":"#fff","title":"#fff","population":0.12,"background":"#6c201e"},"lightMuted":{"background":"#cab7b9","_type":"sanity.imagePaletteSwatch","foreground":"#000","title":"#fff","population":0.59},"vibrant":{"background":"#ed697b","_type":"sanity.imagePaletteSwatch","foreground":"#fff","title":"#fff","population":1.05},"dominant":{"background":"#f87d6f","_type":"sanity.imagePaletteSwatch","foreground":"#000","title":"#fff","population":5.32},"_type":"sanity.imagePalette"},"hasAlpha":false},"mimeType":"image/jpeg","assetId":"a7367e3a460ed37db301d49a7ff011a3367e0bba","originalFilename":"Banner.jpeg"}}}],["$","$La","b81eba47-6833-4380-b4b5-48d0f1eaca6f",{"banner":{"asset":{"uploadId":"siC3FnkMSHMcFRtiPLOrEI5In2PYErGO","sha1hash":"b9052ea6be1d8ed8483759d56dd80262800c6114","_rev":"5E9TySyS7SQBnYMKIPpe6m","_createdAt":"2021-10-07T21:25:50Z","_id":"image-b9052ea6be1d8ed8483759d56dd80262800c6114-828x480-png","_updatedAt":"2021-10-07T21:25:50Z","path":"images/crizldqq/production/b9052ea6be1d8ed8483759d56dd80262800c6114-828x480.png","url":"https://cdn.sanity.io/images/crizldqq/production/b9052ea6be1d8ed8483759d56dd80262800c6114-828x480.png","originalFilename":"neurodiversity.png","_type":"sanity.imageAsset","extension":"png","mimeType":"image/png","size":32665,"assetId":"b9052ea6be1d8ed8483759d56dd80262800c6114","metadata":{"palette":{"muted":{"background":"#985295","_type":"sanity.imagePaletteSwatch","foreground":"#fff","title":"#fff","population":0.33},"lightVibrant":{"population":0.09,"background":"#e197ec","_type":"sanity.imagePaletteSwatch","foreground":"#000","title":"#fff"},"darkVibrant":{"title":"#fff","population":0.92,"background":"#570e5e","_type":"sanity.imagePaletteSwatch","foreground":"#fff"},"lightMuted":{"background":"#c18dbd","_type":"sanity.imagePaletteSwatch","foreground":"#000","title":"#fff","population":0.51},"vibrant":{"background":"#bd5fcf","_type":"sanity.imagePaletteSwatch","foreground":"#fff","title":"#fff","population":0.07},"dominant":{"title":"#fff","population":0.92,"background":"#570e5e","_type":"sanity.imagePaletteSwatch","foreground":"#fff"},"_type":"sanity.imagePalette","darkMuted":{"foreground":"#fff","title":"#fff","population":0.12,"background":"#5e325a","_type":"sanity.imagePaletteSwatch"}},"hasAlpha":false,"lqip":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAMCAIAAADtbgqsAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA0UlEQVQokc2RTYvCMBRF+///ldRYRxA0aR1xFpq8j35gWze2mVZSiWJx4cDgZgbO4iZwwn0vwVDR2wR/Lbv6J/gp8D0P9ZPsSuxy05K2bGyqbWosmxb1GfYN6pZ0g7rBg2Wfz2b/zdod0cuupr6A0+eOI5UtkmK5yRZJOo9RSDNZQbjGmUQhIZQcKZz6y1Ju+wyGigNX0aWA0/ZrlNOPmCNFQnlTSJoprwlJU4mhf6hOdn0OY23qchhrt3yDHjyODR7uU3Q5uPJXC3vNP/nn9+Qr6jyYUW4JwRcAAAAASUVORK5CYII=","dimensions":{"height":480,"_type":"sanity.imageDimensions","width":828,"aspectRatio":1.725},"isOpaque":true,"_type":"sanity.imageMetadata"}}},"_id":"b81eba47-6833-4380-b4b5-48d0f1eaca6f","name":"Neurodiversity Wiki","description":"Website educating the public about neurodiversity","link":"https://neurodiversity.wiki?utm_source=alvar.dev"}]]}],["$","h4",null,{"className":"text-xl font-subheading mt-12","children":["$","$L4",null,{"href":"/projects","target":"_self","rel":"","className":"text-primary font-semibold no-underline hover:underline","children":["All projects"," â†’"]}]}]]
b:I{"id":"25548","chunks":["414:static/chunks/414-9ee1a4f70730f5c0.js","1004:static/chunks/1004-456f71c9bb70e7ee.js","3213:static/chunks/3213-648f64f230debb40.js","7974:static/chunks/app/(main)/page-16ca770141ca5c0a.js"],"name":"Item","async":false}
`;

//9:[["$","$Lb","9b1d7e4d-d418-46ff-a539-9fab5bc4ab7b",{"post":{"_id":"9b1d7e4d-d418-46ff-a539-9fab5bc4ab7b","slug":{"current":"skeleton-loading-with-suspense-in-next-js-13","_type":"slug"},"title":"Skeleton Loading with Suspense in Next.js 13","description":"My strategy for handling skeleton loading with Suspense.","date":{"published":"2022-12-29","updated":"2022-12-29"}}}],["$","$Lb","7cdcfec7-d8c4-40f7-9b71-cc323c2e8136",{"post":{"title":"TailwindCSS with @next/font","description":"Here's how to integrate the new @next/font in Next.js 13 with TailwindCSS.","date":{"published":"2022-10-30","updated":"2022-10-30"},"_id":"7cdcfec7-d8c4-40f7-9b71-cc323c2e8136","slug":{"current":"tailwindcss-with-next-font","_type":"slug"}}}],["$","$Lb","eb686ea0-cdd4-48eb-89d0-0876e5a39e01",{"post":{"_id":"eb686ea0-cdd4-48eb-89d0-0876e5a39e01","slug":{"current":"thoughts-on-photography-tools","_type":"slug"},"title":"Thoughts on Photography Tools","description":"The tool I'm looking for doesn't seem to exist","date":{"published":"2022-07-15","updated":null}}}],["$","$Lb","a32c3dcf-6a61-42dd-ab7a-c36fa21016ac",{"post":{"_id":"a32c3dcf-6a61-42dd-ab7a-c36fa21016ac","slug":{"_type":"slug","current":"always-add-name-to-type-radio"},"title":"Always add \"name to type=\"radio\"","description":"Otherwise, youâ€™ll think your tab keys hate you","date":{"published":"2022-04-06","updated":null}}}]]

function stringToKilobytes(data: string) {
  return ((encodeURI(data).split(/%..|./).length - 1) / 1024).toFixed(2);
}

export function Parser() {
  const [payload, setPayload] = useState("");
  const [parsedLines, setParsedLines] = useState<
    ReturnType<typeof payloadToParsedLines>
  >([]);

  function payloadToParsedLines(payload: string) {
    return payload
      .split("\n")
      .filter((line) => line != "")
      .map((line) => {
        const [signifier, ...rest] = line.split(":");
        const restLine = rest.join(":");
        if (restLine.startsWith("I")) {
          return {
            signifier,
            import: true,
            data: restLine.substring(1),
          };
        } else {
          return {
            signifier,
            import: false,
            data: restLine,
          };
        }
      })
      .map((line) => {
        return {
          ...line,
          json: JSON.parse(line.data),
        };
      })
      .map((line) => {
        if (line.import) {
          return {
            ...line,
            parsed: rscImportSchema.safeParse(line.json),
          };
        } else {
          const walk = (children: z.infer<typeof rscComponentSchema>[]) => {
            return children.map((component) => {
              const result = rscComponentSchema.safeParse(component);

              if (result.success) {
                const data = result.data[3];
                const { children } = data;
                if (
                  typeof children !== "undefined" &&
                  Array.isArray(children)
                ) {
                  const newResult: z.infer<typeof rscComponentSchema> = [
                    result.data[0],
                    result.data[1],
                    result.data[2],
                    {
                      ...result.data[3],
                      children: walk(
                        children as z.infer<typeof rscComponentSchema>[]
                      ),
                    },
                  ];
                  return newResult;
                } else {
                  const newResult: z.infer<typeof rscComponentSchema> = [
                    result.data[0],
                    result.data[1],
                    result.data[2],
                    result.data[3],
                  ];
                  return newResult;
                }
              }
              return {
                ...result,
              };
              // return component as z.infer<typeof rscComponentSchema>;
            });
          };

          return {
            ...line,
            parsed: Array.isArray(line.json)
              ? { data: walk(line.json), success: true }
              : { data: line.json, success: true },
          };
        }
      });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const formPayload = formData.get("payload") as string;

    // console.log(lines);
    setParsedLines(payloadToParsedLines(formPayload));
    // console.log(lines[0].json);
    // console.log(lines[0].parsed.data);
    // console.log(lines[0].parsed.success);
    // console.log(lines[0].parsed.error);

    setPayload(formPayload);
  }

  return (
    <div className="flex flex-col gap-6">
      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        <label htmlFor="paylod" className="font-medium">
          Payload
        </label>
        <textarea
          name="payload"
          placeholder="RCS paylod"
          className="bg-slate-200 outline-none focus:outline-blue-400 rounded-lg p-3 resize-none"
          rows={16}
          defaultValue={defaultPayload}
        />
        <button
          type="submit"
          className="bg-blue-600 px-4 inline-block rounded-lg py-3 text-white font-semibold"
        >
          Parse
        </button>
      </form>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row justify-between">
          <h2 className="font-medium">Result</h2>
          <p>Total size: {stringToKilobytes(payload)} KB</p>
        </div>
        {parsedLines.map((line) => {
          return (
            <div
              className="bg-slate-200 rounded-lg p-3 flex flex-col gap-3"
              key={line.signifier}
            >
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-xl inline-block rounded-full">
                  $L{line.signifier}
                </h3>
                <h3>
                  {line.import ? <p className="font-medium">IMPORT</p> : null}
                </h3>
              </div>

              <h3>Size: {stringToKilobytes(line.data)} KB</h3>

              {line.parsed.success ? (
                <>
                  <p className="font-bold text-green-600">Pased: Success</p>

                  {line.import ? (
                    <>
                      <table className="inline-block text-left table-auto">
                        <thead>
                          <tr>
                            <th className="border border-gray-400 p-2">Key</th>
                            <th className="border border-gray-400 p-2">
                              Value
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-gray-400 p-2">
                              Async
                            </td>
                            <td className="border border-gray-400 p-2">
                              {String(line.parsed.data.async)}
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-gray-400 p-2">Name</td>
                            <td className="border border-gray-400 p-2">
                              {line.parsed.data.name}
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-gray-400 p-2">ID</td>
                            <td className="border border-gray-400 p-2">
                              {line.parsed.data.id}
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-gray-400 p-2">
                              Chunks
                            </td>
                            <td className="border border-gray-400 p-2">
                              <ul className="">
                                {/* @ts-ignore */}
                                {line.parsed.data.chunks.map((item) => {
                                  return <li key={item}>{item}</li>;
                                })}
                              </ul>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      {/* <p>Aync: {String(line.parsed.data.async)}</p>
                      <p>Name: {line.parsed.data.name}</p>
                      <p>ID: {line.parsed.data.id}</p>
                      <p>Chunks:</p>
                      <ul className="">
                        {line.parsed.data.chunks.map((item) => {
                          return <li>{item}</li>;
                        })}
                      </ul> */}
                    </>
                  ) : (
                    <>
                      <details>
                        <summary className="cursor-pointer">DATA</summary>
                        <JSONTree
                          data={line.parsed.data}
                          shouldExpandNodeInitially={() => true}
                        />
                      </details>
                    </>
                  )}

                  {/* <pre className="bg-slate-100 rounded-lg p-3">
                      {JSON.stringify(line.parsed.data, null, 2)}
                    </pre> */}
                  {/* </details> */}
                </>
              ) : (
                <>
                  <p className="font-bold text-red-500">Pased: Failed</p>
                  <details>
                    <summary className="cursor-pointer">MESSAGE</summary>
                    <JSONTree
                      data={line.parsed.success}
                      shouldExpandNodeInitially={() => true}
                    />
                    {/* <pre>{JSON.stringify(line.parsed.error, null, 2)}</pre> */}
                  </details>
                </>
              )}
              <div className="bg-slate-400 h-0.5 w-full" />
              <details>
                <summary className="cursor-pointer">RAW JSON</summary>
                <pre className="bg-slate-100 rounded-lg p-3">
                  <JSONTree
                    data={line.json}
                    shouldExpandNodeInitially={() => true}
                  />
                  {/* {JSON.stringify(line.json, null, 2)} */}
                </pre>
              </details>
            </div>
          );
        })}
        {/* <p>{payload}</p> */}
      </div>
    </div>
  );
}
