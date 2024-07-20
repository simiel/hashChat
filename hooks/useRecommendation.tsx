import { useState, useEffect } from 'react';
import data from '../data/data.json';
import { TFIDF } from './tfidf';

interface DataItem {
  question: string;
  response: string;
}

interface RecommendationResult {
  question: string;
  response: string;
}

const useRecommendation = () => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<RecommendationResult[]>([]);
  const tfidf = new TFIDF();

  useEffect(() => {
    data.forEach((item: DataItem) => {
      tfidf.addDocument(item.question);
    });
  }, []);

  const handleSearch = (searchQuery: string) => {
    const scores = tfidf.computeTFIDF(searchQuery);

    const filteredData = scores.map((score) => {
      const item = data.find((d) => d.question === score.text);
      return item ? item : { question: score.text, response: '' };
    });
    setResults(filteredData);
  };

  return { query, setQuery, results, handleSearch };
};

export default useRecommendation;
