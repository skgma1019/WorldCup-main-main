import { useState, useEffect } from "react";
import "../styles/Match.css";

export default function Match({ left, right, onSelect }) {
  const [animatingSide, setAnimatingSide] = useState(null);

  // 새로운 대결이 시작되면 애니메이션 상태 초기화
  useEffect(() => {
    setAnimatingSide(null);
  }, [left, right]);

  const handleSelectMovie = (selectedSide) => {
    if (animatingSide) return;

    setAnimatingSide(selectedSide);

    // 0.8초 뒤에 실제 데이터 변경 (애니메이션이 끝난 후)
    setTimeout(() => {
      if (selectedSide === "left") {
        onSelect(left);
      } else {
        onSelect(right);
      }
    }, 800);
  };

  return (
    <div
      className={`match-container ${
        animatingSide ? `animating-${animatingSide}` : ""
      }`}
    >
      {/* 🔥🔥🔥 핵심 수정 사항 🔥🔥🔥
         key={left.id}를 추가하여, 데이터가 바뀌면
         React가 이 div를 아예 새로 만들도록 강제합니다.
         (중앙에 있던 녀석이 돌아가는 게 아니라, 새 녀석이 제자리에 뿅 하고 나타남)
      */}
      <div
        key={left.id}
        className={`movie movie-left ${
          animatingSide === "right" ? "loser" : ""
        }`}
        onClick={() => handleSelectMovie("left")}
      >
        <div className="img-wrapper">
          <img src={left.img} alt={left.name} />
          <div className="movie-title">{left.name}</div>
        </div>
      </div>

      {/* VS 텍스트 */}
      <div className={`vs-text ${animatingSide ? "fade-out" : ""}`}>VS</div>

      {/* 🔥🔥🔥 핵심 수정 사항 🔥🔥🔥
         여기도 key={right.id} 추가!
      */}
      <div
        key={right.id}
        className={`movie movie-right ${
          animatingSide === "left" ? "loser" : ""
        }`}
        onClick={() => handleSelectMovie("right")}
      >
        <div className="img-wrapper">
          <img src={right.img} alt={right.name} />
          <div className="movie-title">{right.name}</div>
        </div>
      </div>
    </div>
  );
}
