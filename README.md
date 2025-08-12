
# Custom Tokenizer (GenAI with JavaScript 1.0)

## Setup
1. Install Node.js
2. Clone repo & navigate into it
3. Run:
   npm init -y

## Usage
### Build vocabulary:
node demo.js

This generates `vocab.json` from `corpus.txt`.

### Encode:

const tokenizer = new Tokenizer('vocab.json'); console.log(tokenizer.encode("Hello world"));

### Decode:

console.log(tokenizer.decode([4, 5]));

## Special Tokens
- <PAD> = Padding
- <UNK> = Unknown token
- <BOS> = Beginning of sentence
- <EOS> = End of sentence

