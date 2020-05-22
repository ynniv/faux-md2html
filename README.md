# md2html: A Toy Markdown-Subset Parser

Setup: `npm i`
Building: `npm run-script build`
Testing: `npm test`
Running: `node md2html-cli <file>`

Tests are located in [spec/md2htmlSpec.js](spec/md2htmlSpec.js).

The basic outline is to tokenize the input, create a parse tree from the tokens,
and then format the parse tree into the appropriate output. This is a simple
abstracted flow but keeps the full parsed document in memory, limiting
its ability to operate on very large documents. A quick check suggests that
it will parse 4MB in about one second using 160MB of memory (40MB per 1MB of input).

Whitespace is not preserved, which results in a single space around elements
even when the input has none. For example `(link)[url].` becomes 
`<a href="url">link</a> .` (note the space after the `<a>` tag.)

## Features

Only a few syntaxes are supported:
  - `###`-style headers
  - links
  - multi-line paragraphs
