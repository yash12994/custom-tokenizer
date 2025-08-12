const Tokenizer = require('./tokenizer');

const tokenizer = new Tokenizer();
 
tokenizer.buildVocab('corpus.txt', 'vocab.json');

 
const tokenizer2 = new Tokenizer('vocab.json');

 
const text = "Hello world from GenAI";
const encoded = tokenizer2.encode(text);
const decoded = tokenizer2.decode(encoded);

console.log("Original:", text);
console.log("Encoded:", encoded);
console.log("Decoded:", decoded);
