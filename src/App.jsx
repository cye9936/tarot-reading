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

function App() {
  const [cards, setCards] = useState([]);
  const [question, setQuestion] = useState('');
  const [delayMessage, setDelayMessage] = useState('');
  const [numCards, setNumCards] = useState(3); // Default to 3-card spread
  const [selectedSpread, setSelectedSpread] = useState(''); // New state for the selected spread
  const [titles, setTitles] = useState([]); // New state for the titles
  const [questionError, setQuestionError] = useState(false); // New state for the question error message
  const [nextNumCards, setNextNumCards] = useState(3); // New state for the number of cards in the next reading
  const [textFieldLabel, setTextFieldLabel] = useState('Ask something casual...'); // New state for the TextField label

  // Function to draw cards
  const drawCards = async (numCards) => {
    const response = await fetch('/data/tarot-images.json');
    const data = await response.json();
    const shuffled = data.cards.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numCards);
  };

  // Function to fetch cards
  const fetchCards = async () => {
    // Reset the error messages
    setQuestionError(false);

    // Check if a question has been written
    if (!question) {
      setQuestionError(true);
      return;
    }
    // Clear the current cards
    setCards([]);
    
    setDelayMessage('I call upon my guides, angels and higher self to protect me and my energy during this reading.');

    // Wait for 5 seconds (5000 milliseconds)
    await new Promise((resolve) => setTimeout(resolve, 5000));

    const drawnCards = await drawCards(nextNumCards); // Use nextNumCards directly
    setDelayMessage('');
    // Set the spread and titles after the delay
    setNumCards(nextNumCards);
    setCards(drawnCards);
    setTitles(nextNumCards === 3 ? ['Past', 'Present', 'Future'] : ['Current State', 'Result of Choice A', 'Result of Choice B', 'Future of Choice A', 'Future of Choice B']);
  };
  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12}>
        <FormControl>
          <InputLabel id="spread-select-label">Select a spread</InputLabel>
          <Select
            style={{ minWidth: 200 }}
            labelId="spread-select-label"
            id="spread-select"
            value={selectedSpread}
            onChange={(e) => {
              setSelectedSpread(e.target.value);
              setNextNumCards(e.target.value === '3-Card Casual Reading Spread' ? 3 : 5);
              setTextFieldLabel(e.target.value === '3-Card Casual Reading Spread' ? 'Ask something casual...' : 'Should I choose A or B...');
            }}
          >
            <MenuItem value="3-Card Casual Reading Spread">3-Card Casual Reading Spread</MenuItem>
            <MenuItem value="5-card decision-making spread">5-Card Decision-Making Spread</MenuItem>
          </Select>
        </FormControl>

      </Grid>
      {selectedSpread && ( 
        <>
          <Grid item xs={12}>
            <TextField
              style={{ minWidth: 500 }}
              label={textFieldLabel}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              error={questionError}
            />
            {questionError && <p className="error-message">{questionError}</p>}
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={fetchCards} disabled={!!delayMessage}>
              {delayMessage ? 'Loading...' : 'Get Tarot Reading'}
            </Button>
          </Grid>
          {delayMessage && (
            <Grid item xs={12}>
              <p className="delay-message">{delayMessage}</p>
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
