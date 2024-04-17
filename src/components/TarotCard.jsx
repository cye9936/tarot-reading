import React from 'react';
import CardTitle from './CardTitle';

function TarotCard({ card, title }) {
  return (
    <div className="card">
      <CardTitle title={title} />
      <div className="card-image-container">
        <img src={`/data/cards/${card.img}`} alt={card.name} />
      </div>
      <div className="card-content">
        <h2 className="card-name">{card.name}</h2>
        <p>{card.meanings.light.join(', ')}</p>
        <p>{card.meanings.shadow.join(', ')}</p>
      </div>
    </div>
  );
}

export default TarotCard;