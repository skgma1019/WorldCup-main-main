// src/components/Match.jsx
import "../styles/match.css";
export default function Match({ left, right, onSelect }) {
  return (
    <div className="match-container">
      <div className="movie" onClick={() => onSelect(left)}>
        <div className="img-wrapper">
          <img src={left.img} alt={left.name} />
          <p className="movie-title">{left.name}</p>
        </div>
      </div>

      <h2>VS</h2>

      <div className="movie" onClick={() => onSelect(right)}>
        <div className="img-wrapper">
          <img src={right.img} alt={right.name} />
          <p className="movie-title">{right.name}</p>
        </div>
      </div>
    </div>
  );
}
