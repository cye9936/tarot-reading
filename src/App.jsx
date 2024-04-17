import React, { useState } from 'react';
import TarotCard from './components/TarotCard';
import './App.css';

const drawCards = async () => {
  const response = await fetch('/data/tarot-images.json');
  const data = await response.json();
  const shuffled = data.cards.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 5);
};

function App() {
  const [cards, setCards] = useState([]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [delayMessage, setDelayMessage] = useState('');

  const fetchCards = async () => {
    // delay message is true and it has text; if the delay message is an empty string, it is false. don't need the loading state.
    setLoading(true);
    setDelayMessage('I call upon my guides, angels and higher self to protect me and my energy during this reading.');

    // Wait for 5 seconds (5000 milliseconds)
    await new Promise((resolve) => setTimeout(resolve, 5000));

    const drawnCards = await drawCards();
    setCards(drawnCards);
    setLoading(false);
    setDelayMessage('');
  };

  const titles = [
    'Result of Choice A',
    'Result of Choice B',
    'Future of Choice A',
    'Future of Choice B',
    'Current State',
  ];

  return (
    <div className="App">
      <input
        type="text"
        placeholder="Write your question here..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button onClick={fetchCards} disabled={loading}>
        {loading ? 'Loading...' : 'Get Tarot Reading'}
      </button>
      {delayMessage && <p className="delay-message">{delayMessage}</p>}
      <div className="cards">
        {cards.map((card, index) => (
          <TarotCard key={index} card={card} title={titles[index]} />
        ))}
      </div>
    </div>
  );
}

export default App;