import './App.css';
import React, { useState, useEffect } from 'react';
import TarotCard from './components/TarotCard';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/Grid';

const drawCards = async (numCards) => {
  const response = await fetch('/data/tarot-images.json');
  const data = await response.json();
  const shuffled = data.cards.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numCards);
};

function App() {
  const [cards, setCards] = useState([]);
  const [question, setQuestion] = useState('');
  const [delayMessage, setDelayMessage] = useState('');
  const [numCards, setNumCards] = useState(3); // Default to 3-card spread
  const [spread, setSpread] = useState(''); // New state for the spread type
  const [selectedSpread, setSelectedSpread] = useState(''); // New state for the selected spread
  const [titles, setTitles] = useState([]); // New state for the titles

  useEffect(() => {
    if (delayMessage === '' && selectedSpread !== '') {
      setSpread(selectedSpread);
    }
  }, [delayMessage, selectedSpread]);

  const fetchCards = async () => {
    setDelayMessage('I call upon my guides, angels and higher self to protect me and my energy during this reading.');

    // Wait for 5 seconds (5000 milliseconds)
    await new Promise((resolve) => setTimeout(resolve, 5000));

    const drawnCards = await drawCards(numCards);
    setCards(drawnCards);
    setDelayMessage('');

    // Set the titles after the delay
    setTitles(numCards === 3 ? ['Past', 'Present', 'Future'] : ['Result of Choice A', 'Result of Choice B', 'Future of Choice A', 'Future of Choice B', 'Current State']);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <FormControl>
          <InputLabel id="spread-select-label">Select a spread</InputLabel>
          <Select
            labelId="spread-select-label"
            id="spread-select"
            value={selectedSpread}
            onChange={(e) => { setSelectedSpread(e.target.value); setNumCards(e.target.value === '3-card spread' ? 3 : 5); }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="3-card spread">3-Card Spread</MenuItem>
            <MenuItem value="5-card decision-making spread">5-Card Decision-Making Spread</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      {spread && (
        <>
          <Grid item xs={12}>
            <TextField
              label="Write your question here..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={fetchCards} disabled={!!delayMessage}>
              {delayMessage ? 'Loading...' : 'Get Tarot Reading'}
            </Button>
          </Grid>
          {delayMessage && (
            <Grid item xs={12}>
              <p className={`delay-message`}>{delayMessage}</p>
            </Grid>
          )}
          <Grid container spacing={2}>
            {cards.map((card, index) => (
              <Grid item xs={12} sm={numCards === 3 ? 4 : 2}>
                <TarotCard key={index} card={card} title={titles[index]} />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Grid>
  );
}

export default App;
