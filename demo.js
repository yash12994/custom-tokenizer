const Tokenizer = require('./tokenizer');
const fs = require('fs');

const vocabFile = 'vocab.json';
const corpusFile = 'corpus.txt';


if (!fs.existsSync(vocabFile)) {
    const tokenizer = new Tokenizer();
    tokenizer.buildVocabulary(corpusFile, vocabFile);
} else {
    console.log("Vocabulary already exists. Skipping build...");
}

const tokenizer = new Tokenizer(vocabFile);


const encoded = tokenizer.encode("Hello world");
console.log("Encoded:", encoded);


const decoded = tokenizer.decode(encoded);
console.log("Decoded:", decoded);
