

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1)
}
export default class Markov {
  constructor (corpus, order) {
    this.corpus           = corpus;
    this.order            = order;
    this.cleanedSentences = this._cleanText();
    this.tokens           = this._tokenize();
    this.dict             = this._generateDictionary();
  //  this.generate("trump has")
  }

  _cleanText() {
    return this.corpus.replace(/U\.S\./gi, "US")
    .replace(/\.\s/g,"<END>")
    .replace(/\(|\)|,/g,"")
    .replace(/(\r\n|\n|\r)/gm, "")
    .replace(/\[.*\]/g, "")
    .split("<END>")
  }
  _tokenize() {
    var tokens = [[]];
    for(let [i,c] of this.cleanedSentences.entries()){
      tokens[i] = c.split(" ").filter((el) => {
        return el.length !== 0
      })
    }

    return tokens;
  }
  _generateDictionary() {
    if(this.order >= (this.corpus.length / 2)){
      alert(`Either your corpus needs to be much larger or your order needs to be much smaller!`)
      return;
    }
  //  var dict = {"key": ["value", count]}
    var dict = {};
      //  console.log(this.tokens);
    for(let i = 0; i < this.tokens.length; i++){
      for(let k = 0; k < this.tokens[i].length - 1; k++)
      {
        let skip = false;
        let word = ""
        for(let j = 0; j < this.order ; j++)
        {
          if(this.tokens[i][k + j] === undefined)
            {
              skip = true;
              break;
            }
          word += ((this.order > 1 && word.length !== 0) ? " " : "") + this.tokens[i][k + j].toLowerCase();
        }
        if(skip)
          continue;
        let nextWord = this.tokens[i][k + this.order];
        if(nextWord !== undefined)
          nextWord = nextWord.toLowerCase()
        if(word.length === 0)
          continue;
        if(dict[word] === undefined){
          dict[word] = {}
        }

        if(dict[word][nextWord] === undefined)
        {
          if(nextWord === undefined)
            nextWord = "<END>"
          dict[word][nextWord] = 1;
        } else {
          dict[word][nextWord]++;
        }
    //    dict[this.tokens[i][k]][1]++;
      }
    }
    return dict;
  }

  _pickNext(input) {
  //  console.log(input)
    let word = this.dict[input.toLowerCase()];
    let arr = []
    for(let w in word)
    {
      for(let i = 0; i < word[w]; i++)
      {
        arr[arr.length] = w;
      }
    }
    var chosen = arr[Math.floor(Math.random() *arr.length)]
    if(chosen === "<END>")
      return {nextPhrase: undefined, chosen: "."};
    //console.log(this.dict)
    //console.log(arr)
    let nextPhrase = chosen;
    if(this.order > 1)
    {
      let p = input.split(" ");
      p.shift();
      p += " "+chosen;
      nextPhrase = p;
    }
    return {nextPhrase: nextPhrase, chosen: chosen};
  }
  _random(obj) {
    var keys = Object.keys(obj)
    return keys[ keys.length * Math.random() << 0];
};
  generateForMe(max = 20) {
  //  console.log(this.dict)

    var seed = this._random(this.dict)
    console.log(seed)
    return this.generate(seed, max)
  }
  generate(seed, max = 20)
  {
  //  console.log(!seed)
    if(!seed)
    {
      return this.generateForMe();
    }
    if(seed.split(" ").length !== this.order)
    {
      alert("The length of your input string and the order must be the same!")
      return ":(";
    }
    let finalString = seed;
    let retVal = this._pickNext(seed);
    for(let i = 0; i < max; i++) {
      if(!retVal.nextPhrase)
      {
        finalString += ".";
        break;
      } else{
        finalString += " " +retVal.chosen;
      }
      if(retVal.chosen === ".")
        break;
    //  console.log(retVal)
      retVal = this._pickNext(retVal.nextPhrase);
    }
    return finalString;
  }
}
