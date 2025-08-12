# Custom Tokenizer (GenAI with JavaScript 1.0)

A simple JavaScript-based tokenizer for text processing — supports vocabulary generation, encoding, decoding, and special tokens.  
This project demonstrates the basics of how tokenizers work in NLP and GenAI models.

---

# Features
- Generate vocabulary from a text corpus.
- Encode text into token IDs.
- Decode token IDs back into text.
- Supports **special tokens**:
  - `<PAD>` — Padding
  - `<UNK>` — Unknown token
  - `<BOS>` — Beginning of sentence
  - `<EOS>` — End of sentence

---

# File Structure
custom-tokenizer/
│
├── corpus.txt # Input text corpus
├── vocab.json # Generated vocabulary file
├── tokenizer.js # Tokenizer class
├── demo.js # Example usage script
└── README.md # Project documentation



## ⚙️ Setup

### 1️⃣ Install Node.js
Download & install from [https://nodejs.org](https://nodejs.org).

### 2️⃣ Clone the Repository

(https://github.com/yash12994/custom-tokenizer.git)
cd custom-tokenizer

3️⃣ Initialize Project
npm init -y
💻 Usage
1. Build Vocabulary
From corpus.txt, run:
node demo.js
This generates vocab.json with tokens mapped to IDs.

2. Encode Text
javascript
const Tokenizer = require('./tokenizer');
const tokenizer = new Tokenizer('vocab.json');

console.log(tokenizer.encode("Hello world"));

3. Decode Tokens
javascript
console.log(tokenizer.decode([4, 5]));

📌 Example
corpus.txt
Hello world
This is a tokenizer demo

Generated vocab.json
{
  "<PAD>": 0,
  "<UNK>": 1,
  "<BOS>": 2,
  "<EOS>": 3,
  "Hello": 4,
  "world": 5,
  "This": 6,
  "is": 7,
  "a": 8,
  "tokenizer": 9,
  "demo": 10
}




