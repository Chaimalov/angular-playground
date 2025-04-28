import fs from 'fs';
import {
  createSourceFile,
  isJSDocCommentContainingNode,
  isPropertySignature,
  isTypeAliasDeclaration,
  isTypeLiteralNode,
  JSDoc,
  Node,
  ScriptTarget,
} from 'typescript';

interface VSCodeSnippet {
  name: string;
  description: string;
}

interface SnippetCollection {
  [key: string]: VSCodeSnippet;
}

// Read the input file
const core = fs.readFileSync('node_modules/ag-grid-community/dist/types/src/theming/core/core-css.d.ts', 'utf8');

// Create source file
const sourceFile = createSourceFile('core-css.d.ts', core, ScriptTarget.Latest, true);

// Create snippet object
const snippets = [] as VSCodeSnippet[];

// Process declarations
function processNode(node: Node): void {
  if (isTypeAliasDeclaration(node) && node.name.text === 'CoreParams') {
    const typeNode = node.type;

    if (isTypeLiteralNode(typeNode)) {
      typeNode.members.forEach(member => {
        if (isPropertySignature(member)) {
          const name = member.name.getText(sourceFile);
          const type = member.type?.getText(sourceFile) ?? 'any';
          // @ts-expect-error
          const jsDoc = member.jsDoc?.[0] as JSDoc | undefined;
          const property = `--ag-${name.replace(/([A-Z])/g, '-$1').toLowerCase()}`;

          snippets.push({
            name: property,
            // @ts-expect-error
            description: jsDoc?.comment ?? '',
          });
        }
      });
    }
  }

  node.forEachChild(processNode);
}

// Process the source file
processNode(sourceFile);

const snippetsFile = {
  version: 0.1,
  properties: snippets,
};

// Write the snippets to a JSON file
fs.writeFileSync('ag-grid-theme-snippets.json', JSON.stringify(snippetsFile, null, 2), 'utf8');

console.log('Theme snippets file generated successfully!');

export {};
