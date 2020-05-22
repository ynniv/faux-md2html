export const sampleInput1 = `# Sample Document

Hello!

This is sample markdown for the [sample](https://www.ynniv.com) homework assignment.`

export const sampleOutput1 = `<h1>Sample Document</h1>

<p>Hello!</p>

<p>This is sample markdown for the <a href="https://www.ynniv.com">sample</a> homework assignment.</p>`

export const sampleInput2 = `# Header one

Hello there

How are you?
What's going on?

## Another Header

This is a paragraph [with an inline link](http://google.com). Neat, eh?

## This is a header [with a link](http://yahoo.com)`

export const sampleOutput2 = `<h1>Header one</h1>

<p>Hello there</p>

<p>How are you?
What's going on?</p>

<h2>Another Header</h2>

<p>This is a paragraph <a href="http://google.com">with an inline link</a> . Neat, eh?</p>

<h2>This is a header <a href="http://yahoo.com">with a link</a></h2>`
