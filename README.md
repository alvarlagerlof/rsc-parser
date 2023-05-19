# RSC Parser

This is a parser for React Server Components (RSC) when sent over the network. React uses a format to represent a tree of components/html or metadata such as requiered imports, suspense boundaries, and css/fonts that needs to be loaded. 

I made this tool to more easily let you understand the data and explore it visually.

With this tool:

<img width="739" alt="image" src="https://github.com/alvarlagerlof/rsc-parser/assets/14835120/34ab2a44-2acb-459b-97c1-d0a933fdf234">

Without this tool:

<img width="427" alt="image" src="https://github.com/alvarlagerlof/rsc-parser/assets/14835120/1c60f150-1b17-407f-a1b3-1130f212563f">

## How do I use this?

1. Go to a site that uses the NextJS App router or generally is based on React Server components.
2. Open the network tab in your dev tools
3. Reload.
4. Look for fetch responses the payload roughly looks like json, but each like starts with something like `O:`, `1:I`, `b:` or similar.
5. Copy the text and paste it into the form on https://rsc-parser.vercel.app/
6. Explore!


## It crashed!
Please make an issue on https://github.com/alvarlagerlof/rsc-parser/issues/new and include the text content that the parser was unable to handle.


## Future plans

Currently this is is a standalone site, which means that it is not able to handle live streaming payloads, but I plan on exploring using doing this as a browser extension or possibly an embedded debugging component similar to the [React Query devtools](https://tanstack.com/query/v4/docs/react/devtools). The latter would probably need a service worker to intercept network requests. If you know anything about this I'd love to talk. I'm [@alvarlagerlof](https://twitter.com/alvarlagerlof) on Twitter.

I'm also considering a rendering of the component tree that looks more like your code itself. I think it should be possible to replicate it pretty well. In this area I am also considering attempting to combine the different lines in the stream and stitch them together into a single tree.

Another area of improvment is better rendering of sizes of lines/objects. Browsers and servers have compression like gzip and brotli, but this codes does not take that into account.

I do want to note that all of this was put together quickly, so it likely needs a bit of refactoring to make more sense.


## Running locally

This site is made in Next.js using the App router, but all of interesting things are inside a single server component. 

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


