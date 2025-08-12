const fs = require('fs');

class Tokenizer {
    constructor(vocabFile) {
        this.vocab = {};
        this.invVocab = {};
        this.specialTokens = {
            PAD: '<PAD>',
            UNK: '<UNK>',
            BOS: '<BOS>',
            EOS: '<EOS>'
        };

        if (vocabFile && fs.existsSync(vocabFile)) {
            this.vocab = JSON.parse(fs.readFileSync(vocabFile));
            this.invVocab = Object.fromEntries(
                Object.entries(this.vocab).map(([k, v]) => [v, k])
            );
        }
    }

    buildVocabulary(corpusFile, vocabFile) {
        if (!fs.existsSync(corpusFile)) {
            throw new Error(`Corpus file "${corpusFile}" not found.`);
        }

        const text = fs.readFileSync(corpusFile, 'utf-8');
        const words = text.split(/\s+/);
        const uniqueWords = [...new Set(words)];

        let vocab = {};
        let id = 0;

        // Add special tokens first
        for (let token of Object.values(this.specialTokens)) {
            vocab[token] = id++;
        }

        // Add unique words
        uniqueWords.forEach(word => {
            if (!vocab[word]) {
                vocab[word] = id++;
            }
        });

        fs.writeFileSync(vocabFile, JSON.stringify(vocab, null, 2));
        console.log(`Vocabulary built and saved to ${vocabFile}`);
    }

    encode(text) {
        if (!this.vocab || Object.keys(this.vocab).length === 0) {
            throw new Error("Vocabulary is empty. Build or load vocab first.");
        }

        const tokens = text.split(/\s+/);
        return [this.vocab[this.specialTokens.BOS], 
            ...tokens.map(t => this.vocab[t] ?? this.vocab[this.specialTokens.UNK]),
            this.vocab[this.specialTokens.EOS]
        ];
    }

    decode(tokenIds) {
        if (!this.invVocab || Object.keys(this.invVocab).length === 0) {
            throw new Error("Inverse vocabulary is empty.");
        }

        return tokenIds
            .map(id => this.invVocab[id] ?? this.specialTokens.UNK)
            .filter(tok => !Object.values(this.specialTokens).includes(tok))
            .join(' ');
    }
}

module.exports = Tokenizer;
