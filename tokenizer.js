// tokenizer.js

class Tokenizer {
    constructor() {
        this.vocab = {};
        this.reverseVocab = {};
        this.specialTokens = {
            PAD: "<PAD>",
            UNK: "<UNK>",
            SOS: "<SOS>",
            EOS: "<EOS>"
        };
        this._initSpecialTokens();
    }

    _initSpecialTokens() {
        let id = 0;
        for (let token of Object.values(this.specialTokens)) {
            this.vocab[token] = id;
            this.reverseVocab[id] = token;
            id++;
        }
    }

    train(corpus) {
        let words = corpus.split(/\s+/);
        let id = Object.keys(this.vocab).length;
        for (let word of words) {
            if (!this.vocab.hasOwnProperty(word)) {
                this.vocab[word] = id;
                this.reverseVocab[id] = word;
                id++;
            }
        }
    }

    encode(text) {
        let words = text.split(/\s+/);
        let tokens = [this.vocab[this.specialTokens.SOS]];
        for (let word of words) {
            tokens.push(
                this.vocab.hasOwnProperty(word)
                    ? this.vocab[word]
                    : this.vocab[this.specialTokens.UNK]
            );
        }
        tokens.push(this.vocab[this.specialTokens.EOS]);
        return tokens;
    }

    decode(tokenIds) {
        let words = [];
        for (let id of tokenIds) {
            let word = this.reverseVocab[id] || this.specialTokens.UNK;
            if (![this.specialTokens.SOS, this.specialTokens.EOS, this.specialTokens.PAD].includes(word)) {
                words.push(word);
            }
        }
        return words.join(" ");
    }
}

module.exports = Tokenizer;
