# Word binary writer

Source: https://github.com/Alpaq92/JSDoc
Commit: 821695a884e0c0bb8592a635d9524bb3e116cd67
License: 0BSD (see LICENSE).

text-to-doc.mjs is src/textToDoc.js with its UMD wrapper replaced by an ES-module export. The binary document writer and its blank-document skeleton are unchanged. It runs locally without network requests.

tests/vendor/doc-reader.cjs is the matching upstream reader, used only for regression verification. Neither private lessons nor teacher data are included in the template.
