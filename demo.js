const Tokenizer = require("./tokenizer");
const tokenizer = new Tokenizer();
tokenizer.train("hello world this is a simple tokenizer example");
console.log("Vocabulary:", tokenizer.vocab);
let encoded = tokenizer.encode("hello world");
console.log("Encoded:", encoded);
let decoded = tokenizer.decode(encoded);
console.log("Decoded:", decoded);
