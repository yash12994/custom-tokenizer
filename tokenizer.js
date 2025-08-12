const fs = require('fs');

class Tokenizer {
  constructor({ specialTokens = ['<PAD>','<UNK>','<BOS>','<EOS>'], separator='</w>' } = {}) {
    this.separator = separator; 
    this.specialTokens = specialTokens;
    this.vocab = {};  
    this.id2tok = [];
    this.merges = [];  
  }
  static simpleWords(text) {
    return text
      .replace(/\r\n?/g, '\n')
      .toLowerCase()
      .replace(/(\p{P})/gu, ' $1 ') 
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ');
  }

 
  train(text, targetVocabSize = 10000) {
    if (typeof text !== 'string') throw new Error('text must be a string');

    const words = Tokenizer.simpleWords(text);
    const wordseqs = words.map(w => (w.split('')).concat([this.separator]));


    const freq = {};
    for (let seq of wordseqs) {
      const key = seq.join(' ');
      freq[key] = (freq[key] || 0) + 1;
    }
    let seqs = [];
    for (let [k, c] of Object.entries(freq)) {
      const s = k.split(' ');
      for (let i = 0; i < c; i++) seqs.push(s.slice()); 
    }

    const vocab = new Set();
    for (let s of seqs) for (let sym of s) vocab.add(sym);
    for (let tok of this.specialTokens) this._addToken(tok);
    for (let tok of vocab) this._addToken(tok);
      
    while (this.id2tok.length < targetVocabSize) {
      const pairs = this._countPairs(seqs);
      if (!pairs || Object.keys(pairs).length === 0) break;
      const best = Object.entries(pairs).sort((a,b)=>b[1]-a[1])[0];
      if (!best || best[1] < 2) break; 
      const pair = best[0];
      const newSymbol = pair.replace(' ', '');
      this.merges.push(pair);
   
      seqs = seqs.map(s => this._mergeSeq(s, pair.split(' ')));

      this._addToken(newSymbol);
    }
    this._finalize();
    return {
      vocabSize: this.id2tok.length,
      merges: this.merges.length
    };
  }

  _countPairs(seqs) {
    const counts = {};
    for (let s of seqs) {
      for (let i = 0; i < s.length - 1; i++) {
        const pair = `${s[i]} ${s[i+1]}`;
        counts[pair] = (counts[pair] || 0) + 1;
      }
    }
    return counts;
  }

  _mergeSeq(seq, pair) {
    const [a,b] = pair;
    const merged = [];
    for (let i = 0; i < seq.length; i++) {
      if (i < seq.length - 1 && seq[i] === a && seq[i+1] === b) {
        merged.push(a + b);
        i++;
      } else {
        merged.push(seq[i]);
      }
    }
    return merged;
  }

  _addToken(tok) {
    if (!(tok in this.vocab)) {
      const id = this.id2tok.length;
      this.vocab[tok] = id;
      this.id2tok.push(tok);
    }
  }

  _finalize() {
  
    this.id2tok = Array.from(this.id2tok);
    this.vocab = {};
    this.id2tok.forEach((t,i)=>this.vocab[t]=i);
  }
  _encodeWord(word) {
 
    let s = word.split('').concat([this.separator]).join('');
    const tokens = [];
    let i = 0;
    while (i < s.length) {
      let end = s.length;
      let found = null;
      while (end > i) {
        const cand = s.slice(i, end);
        if (cand in this.vocab) { found = cand; break; }
        end--;
      }
      if (found === null) {
      
        const char = s[i];
        if (char in this.vocab) {
          tokens.push(char);
        } else {
          tokens.push('<UNK>');
        }
        i++;
      } else {
        tokens.push(found);
        i += found.length;
      }
    }
    return tokens;
  }

 
  encode(text, { addBos=false, addEos=false, returnTokens=false } = {}) {
    const words = Tokenizer.simpleWords(text);
    const toks = [];
    if (addBos) toks.push(this.vocab['<BOS>']);
    for (let w of words) {
      const subtoks = this._encodeWord(w);
      for (let t of subtoks) {
        toks.push(returnTokens ? t : (this.vocab[t] ?? this.vocab['<UNK>']));
      }
    }
    if (addEos) toks.push(this.vocab['<EOS>']);
    return toks;
  }

 
  decode(ids, { inputIsTokens=false } = {}) {
    const toks = inputIsTokens ? ids : ids.map(i => this.id2tok[i] ?? '<UNK>');
 
    const pieces = [];
    let cur = '';
    for (let t of toks) {
      if (t === '<BOS>' || t === '<EOS>' || t === '<PAD>') continue;
      if (t === '<UNK>') { cur += '?'; continue; }
      if (t.endsWith(this.separator)) {
        cur += t.slice(0, -this.separator.length);
        pieces.push(cur);
        cur = '';
      } else {
        cur += t;
      }
    }
    if (cur.length) pieces.push(cur);
    return pieces.join(' ');
  }

  saveToFile(path) {
    const data = {
      separator: this.separator,
      specialTokens: this.specialTokens,
      id2tok: this.id2tok,
      merges: this.merges
    };
    fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
  }

  static loadFromFile(path) {
    const raw = fs.readFileSync(path, 'utf8');
    const data = JSON.parse(raw);
    const tok = new Tokenizer({ specialTokens: data.specialTokens, separator: data.separator });
    tok.id2tok = data.id2tok;
    tok.vocab = {};
    tok.id2tok.forEach((t,i)=>tok.vocab[t]=i);
    tok.merges = data.merges || [];
    return tok;
  }
}

module.exports = { Tokenizer };
