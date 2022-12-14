// *******************************************************************************************************
// This script is to generate a nodejs main.ts file that imports all the packages 
// Importing it, and console.log the result
// Usage: node tools/scripts/gen-nodejs.mjs
// *******************************************************************************************************

import { exit } from "process";
import { writeFile, getFiles, greenLog} from "./utils.mjs";

// ------ Config ------
const TARGET_DIR = 'apps/nodejs/';
const TARGET_FILE = 'main.ts';
const HTML_FILE = TARGET_DIR + TARGET_FILE;
const DIST_DIR = 'dist/packages/';
const PACKAGE_NAME = '@lit-protocol/';
const banner = '// THIS FILE IS AUTOMATICALLY GENERATED FROM tools/scripts/gen-nodejs.mjs';

const TEMPLATE = {
    HEADER: `${banner} \n\nimport { hasItems } from './helper';
import { manualTest } from './manual-test';
\n`,
    BODY: ``,
    FOOTER: `

manualTest();`
}

const files = (await getFiles(DIST_DIR))
    .filter((file) => ! file.includes('vanilla') && !file.includes('index.zip') && !file.includes('.DS_Store'))

const scriptTags = files.map((file) => {
    let varName = file.split('/').pop().replace('.js', '');
    varName = varName.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

    return `import * as ${varName} from '${PACKAGE_NAME}${file}';`
})

let consoleLogs = files.map((file) => { 
    
    let varName = file.split('/').pop().replace('.js', '');
    
    // replace hyphens with underscores and capitalize the first letter
    varName = varName.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

    return `console.log("${varName}:", hasItems(${varName}));`
})

TEMPLATE.BODY = scriptTags.join('\n') + '\n\n' + consoleLogs.join('\n');

const data = TEMPLATE.HEADER + TEMPLATE.BODY + TEMPLATE.FOOTER;

await writeFile(HTML_FILE, data);

greenLog(`Updated ${HTML_FILE}`);
exit();