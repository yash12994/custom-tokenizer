const fs = require('fs');

class Tokenizer {
    constructor(vocabPath, specialTokens = ["<PAD>", "<UNK>", "<BOS>", "<EOS>"]) {
        this.vocab = {};
        this.invVocab = {};
        this.specialTokens = specialTokens;

        if (vocabPath && fs.existsSync(vocabPath)) {
            this.vocab = JSON.parse(fs.readFileSync(vocabPath, 'utf-8'));
            this.invVocab = Object.fromEntries(Object.entries(this.vocab).map(([k, v]) => [v, k]));
        }
    }

    buildVocab(corpusPath, vocabPath) {
        const text = fs.readFileSync(corpusPath, 'utf-8').toLowerCase();
        const words = text.split(/\s+/);

        let vocabSet = new Set(this.specialTokens);
        words.forEach(word => vocabSet.add(word));

        let vocabObj = {};
        Array.from(vocabSet).forEach((word, idx) => {
            vocabObj[word] = idx;
        });

        this.vocab = vocabObj;
        this.invVocab = Object.fromEntries(Object.entries(vocabObj).map(([k, v]) => [v, k]));

        fs.writeFileSync(vocabPath, JSON.stringify(vocabObj, null, 2), 'utf-8');
        console.log(`Vocab built with ${Object.keys(vocabObj).length} tokens.`);
    }

    encode(text) {
        return text
            .toLowerCase()
            .split(/\s+/)
            .map(word => this.vocab[word] !== undefined ? this.vocab[word] : this.vocab["<UNK>"]);
    }

    decode(tokenIds) {
        return tokenIds.map(id => this.invVocab[id] || "<UNK>").join(" ");
    }
}

module.exports = Tokenizer;