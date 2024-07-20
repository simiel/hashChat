interface Document {
  text: string;
  words: string[];
}

export class TFIDF {
  private documents: Document[] = [];
  private termFrequency: Map<string, number>[] = [];
  private documentFrequency: Map<string, number> = new Map();

  addDocument(text: string) {
    const words = text.split(/\W+/).map((word) => word.toLowerCase());
    const termFreq = new Map<string, number>();

    words.forEach((word) => {
      if (termFreq.has(word)) {
        termFreq.set(word, (termFreq.get(word) || 0) + 1);
      } else {
        termFreq.set(word, 1);
      }
    });

    this.documents.push({ text, words });
    this.termFrequency.push(termFreq);

    termFreq.forEach((_, word) => {
      if (this.documentFrequency.has(word)) {
        this.documentFrequency.set(
          word,
          (this.documentFrequency.get(word) || 0) + 1
        );
      } else {
        this.documentFrequency.set(word, 1);
      }
    });
  }

  computeTFIDF(query: string): { text: string; score: number }[] {
    const queryWords = query.split(/\W+/).map((word) => word.toLowerCase());
    const queryTermFreq = new Map<string, number>();

    queryWords.forEach((word) => {
      if (queryTermFreq.has(word)) {
        queryTermFreq.set(word, (queryTermFreq.get(word) || 0) + 1);
      } else {
        queryTermFreq.set(word, 1);
      }
    });

    return this.documents
      .map((doc, index) => {
        const score = queryWords.reduce((sum, word) => {
          const tf = this.termFrequency[index].get(word) || 0;
          const idf = Math.log(
            this.documents.length / (this.documentFrequency.get(word) || 1)
          );
          return sum + tf * idf;
        }, 0);
        return { text: doc.text, score };
      })
      .sort((a, b) => b.score - a.score);
  }
}
