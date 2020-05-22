
export enum TokenType {
    Header = "header",
    Text = "text",
    Link = "link",
    Newline = "newline",
}

type NewlineToken = {
    type: TokenType.Newline
}

type UnformattedTextToken = {
    type: TokenType.Text,
    text: string,
}

type HeaderToken = {
    type: TokenType.Header,
    level: number,
}

type LinkToken = {
    type: TokenType.Link,
    text: string,
    url: string,
}

type Token = NewlineToken | UnformattedTextToken | HeaderToken | LinkToken

export function tokenize(input: string) : Token[] {

    let pos = 0, tokens: Token[] = [];
    let lastToken: Token = { type: TokenType.Newline }

    while (pos < input.length) {
        const [token, length] = nextToken(input.substr(pos), lastToken);
        tokens.push(token);
        lastToken = token;
        pos += length;
    }

    return tokens;
}

function nextToken(input: string, lastToken: Token) : [Token, number] {

    // parse blank lines as newline tokens
    const newLine = input.match(/^[ \t]*\n/);
    if (newLine) {
        return [{ type: TokenType.Newline }, newLine[0].length]
    }

    if (lastToken.type == TokenType.Newline && input[0] == '#') {
        const level = input.match(/^#+/)[0].length; // count the number of #'s

        const token: Token = { 
            type: TokenType.Header,
            level: level
        }
        return [token, level]
    }

    if (input[0] == '[') {
        const linkResult = nextLinkToken(input);
        if (linkResult) {
            return linkResult;
        }
    }

    // the default case is unformatted text
    const text = input.match(/^[^[\n]+/)?.[0];
    if (text != undefined) {
        return [{ type: TokenType.Text, text: text.trim() }, text.length]
    }

    const ellipsis = input.length > 40 ? '...' : '';
    throw Error(`Unable to tokenize input: '${input.substr(0, 40)}${ellipsis}'`)
}

function nextLinkToken(input: string) : [Token, number] {
    // try to parse a link
    const text = input.match(/^\[([^\n]+)]/)?.[1];
    if (text == undefined) return;

    input = input.substr(text.length + 2) // 'text' doesn't include '[' and ']'
    const url = input.match(/^\(([^\n]+)\)/)?.[1];

    if (url == undefined) return;

    const token: Token = {
        type: TokenType.Link,
        text: text.trim(),
        url: url.trim()
    }
    return [token, text.length + 2 + url.length + 2]
}

export type HtmlTag = string

type HtmlNode = {
    tag: HtmlTag,
    attributes?: Record<string, string>,
    children?: (HtmlNode|string)[],
    parent?: HtmlNode,
}

export function parse(input: Token[]) : HtmlNode[] {
    let result: HtmlNode[] = [];
    let currentNode: HtmlNode = null;
    let lastToken = null;

    const ensureCurrentNode = (tag?: string) => {
        if (currentNode == null) currentNode = { tag: tag ?? "p", children: [] }
    }

    for (const token of input) {
        switch (token.type) {
            case TokenType.Text:
                ensureCurrentNode();
                currentNode.children.push(token.text);
                break;
            case TokenType.Link:
                ensureCurrentNode();
                currentNode.children.push({ 
                    tag: "a", 
                    children: [token.text], 
                    attributes: { href: token.url }})
                break;
            case TokenType.Header:
                ensureCurrentNode("h" + token.level)
                break;
            case TokenType.Newline:
                if (currentNode) {
                    if (currentNode.tag[0] == "h" || lastToken?.type == TokenType.Newline) {
                        // headers cannot be multiline, but two newlines cancel anything
                        result.push(currentNode);
                        currentNode = null;
                    }
                    }
                break;
        }
        lastToken = token;
    }

    if (currentNode != null) result.push(currentNode);
    
    return result;
}

export function format(input: (HtmlNode|string)[], nested?: boolean) : string {
    if (input == null || input.length == 0) return "";
    return Object.values(input).map(node => {
        if (typeof node == "string") {
            return node;
        } else {
            const attribs = Object.entries(node.attributes || {})
                                  .map(([k,v]) => `${k}="${v}"`)
                                  .join(" ");
            const tag = node.tag + (attribs != '' ? ` ${attribs}` : '');
            return `<${tag}>` + format(node.children, true) + `</${node.tag}>`;
        }
    }).join(nested ? " " : "\n");
}
