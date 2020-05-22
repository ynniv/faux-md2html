import { format, parse, tokenize, TokenType, HtmlTag  } from "../md2html"
import { sampleInput1, sampleOutput1, sampleInput2, sampleOutput2 } from "./sampleDocuments"

describe("tokenizing", () => {
    it("accept an empty string", () => {
        expect(tokenize("")).toEqual([])
    })

    it("ignore blank lines", () => {
        expect(tokenize("\n    \n\n"))
        .toEqual([{ type: TokenType.Newline }, { type: TokenType.Newline }, { type: TokenType.Newline }])
    })

    it("recognizes headers", () => {
        expect(tokenize("### Header3    "))
        .toEqual([
            { type: TokenType.Header, level: 3 }, 
            { type: TokenType.Text, text: "Header3" }
        ])

        expect(tokenize("Not a # Header1    "))
        .toEqual([
            { type: TokenType.Text, text: "Not a # Header1" }
        ])
    })

    it("recoginizes links in text", () => {
        expect(tokenize("This is a paragraph [with an inline link](http://google.com). Neat, eh?"))
        .toEqual([
            { type: TokenType.Text, text: "This is a paragraph" },
            { type: TokenType.Link, text: "with an inline link", url: "http://google.com" },
            { type: TokenType.Text, text: ". Neat, eh?" },
        ])
    })

    it("recoginizes links in headers", () => {
        expect(tokenize("## This is a header [with a link](http://yahoo.com)"))
        .toEqual([
            { type: TokenType.Header, level: 2 },
            { type: TokenType.Text, text: "This is a header" },
            { type: TokenType.Link, text: "with a link", url: "http://yahoo.com" },
        ])
    })
})

describe("parsing", () => {
    it("puts unformatted text into <p> tags", () => {
        expect(parse(tokenize("Hello there")))
        .toEqual([{ tag: "p", children: ["Hello there"] }])
    })

    it("puts links into <a> tags", () => {
        expect(parse(tokenize("[Hello there](http://localhost)")))
        .toEqual([{ tag: "p", children: [{ tag: "a", children: ["Hello there"], attributes: { href: "http://localhost" }}]}])
    })

    it("puts headers into <h> tags", () => {
        expect(parse(tokenize("### Header3")))
        .toEqual([{ tag: "h3", children: ["Header3"] }])
    })
})

describe("formatting", () => {
    it("makes basic tags", () => {
        expect(format([{ tag: "p", children: ["hello world"]}]))
        .toEqual("<p>hello world</p>")
    })

    it("supports attributes", () => {
        expect(format([{ tag: "a", attributes: { href: "about:blank" }, children: ["hello world"]}]))
        .toEqual('<a href="about:blank">hello world</a>')
    })

    it("handles nested tags", () => {
        expect(format([
            { tag: "h1", children: [
                "this is a header",
                { tag: "a", attributes: { href: "about:blank" }, children: ["hello world"]}
            ]}
        ]))
        .toEqual('<h1>this is a header <a href="about:blank">hello world</a></h1>')
    })

})

describe("reference documents", () => {
    const clean = (s:string) => s.replace(/[ \t\n]+/g, " ")
    it("should have the expected output for sample document 1", () => {
        expect(clean(format(parse(tokenize(sampleInput1)))))
        .toEqual(clean(sampleOutput1))
    })
    it("should have the expected output for sample document 2", () => {
        expect(clean(format(parse(tokenize(sampleInput2)))))
        .toEqual(clean(sampleOutput2))
    })
})