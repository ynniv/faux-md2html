import { readFileSync } from 'fs';
import { format, parse, tokenize } from "./md2html"

const usageText = 
`Usage:

md2html <file>`;

function main() {
    if (process.argv.length < 3) {
        console.log(usageText);
        return;
    }

    let [_interp, _script, inputFilename] = process.argv;
    const input = readFileSync(inputFilename, 'utf8');
    console.log(format(parse(tokenize(input.toString()))))
}

main();
