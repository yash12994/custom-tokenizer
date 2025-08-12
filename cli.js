const fs = require('fs');
const path = require('path');
const { Tokenizer } = require('./tokenizer');

const args = process.argv.slice(2);

function usage() {
  console.log(`Usage:
  node cli.js train <corpus.txt> <out-vocab.json> [vocabSize]
  node cli.js encode <vocab.json> "<text to encode>"
  node cli.js decode <vocab.json> <id1,id2,id3,...>
Examples:
  node cli.js train corpus.txt vocab.json 5000
  node cli.js encode vocab.json "Hello world!"
  node cli.js decode vocab.json 3,4,5
`);
}

if (args.length === 0) { usage(); process.exit(0); }

const cmd = args[0];

if (cmd === 'train') {
  const [,, corpusPath, outPath, vs] = process.argv;
  if (!corpusPath || !outPath) { usage(); process.exit(1); }
  const text = fs.readFileSync(corpusPath, 'utf8');
  const target = Number(vs) || 3000;
  const tok = new Tokenizer();
  console.log('Training... this may take a bit for large corpora');
  const info = tok.train(text, target);
  tok.saveToFile(outPath);
  console.log('Saved vocab to', outPath, info);
} else if (cmd === 'encode') {
  const [,, vocabPath, ...rest] = process.argv;
  if (!vocabPath || rest.length === 0) { usage(); process.exit(1); }
  const text = rest.join(' ');
  const tok = Tokenizer.loadFromFile(vocabPath);
  const ids = tok.encode(text, { addBos:true, addEos:true });
  console.log('IDs:', ids.join(','));
} else if (cmd === 'decode') {
  const [,, vocabPath, idsStr] = process.argv;
  if (!vocabPath || !idsStr) { usage(); process.exit(1); }
  const tok = Tokenizer.loadFromFile(vocabPath);
  const ids = idsStr.split(',').map(x=>Number(x));
  const text = tok.decode(ids);
  console.log('Text:', text);
} else {
  usage();
  process.exit(1);
}
