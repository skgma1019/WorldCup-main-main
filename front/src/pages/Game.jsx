import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Loading from "../components/Loading";
import Match from "../components/Match";
import Result from "../components/Result";
import "../styles/Game.css";

export default function Game() {
  const location = useLocation();
  const navigate = useNavigate();

  const { round = 16, genre = "ALL" } = location.state || {};

  const genreNames = {
    ALL: "전체 랜덤",
    28: "액션",
    10749: "로맨스",
    35: "코미디",
    27: "공포",
    878: "SF / 판타지",
    16: "애니메이션",
    18: "드라마",
    80: "범죄",
  };

  const genreName = genreNames[genre] || "장르";

  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextRound, setNextRound] = useState([]);
  const [matchCount, setMatchCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [winner, setWinner] = useState(null);

  // 1. 후보 불러오기
  useEffect(() => {
    if (!round) return;

    setLoading(true);
    setErrorMsg("");
    setWinner(null);

    api
      .get(`/movies`, {
        params: {
          round,
          genre: genre === "ALL" ? undefined : genre,
        },
      })
      .then((res) => {
        const raw = res.data || [];
        const list = raw.map((m) => ({
          ...m,
          name: m.name || m.title || "제목 없음",
        }));

        if (list.length === 0) {
          setErrorMsg("조건에 맞는 영화가 부족합니다.");
        } else {
          setMovies(list);
          setCurrentIndex(0);
          setNextRound([]);
          setMatchCount(0);
        }
      })
      .catch(() => setErrorMsg("서버와 연결할 수 없습니다."))
      .finally(() => setLoading(false));
  }, [genre, round]);

  // 2. 영화 선택
  const handleSelect = async (winnerMovie) => {
    const left = movies[currentIndex];
    const right = movies[currentIndex + 1];
    if (!left || !right) return;

    const winnerId = winnerMovie.id;
    const loserId = left.id === winnerId ? right.id : left.id;

    try {
      await api.post(`/movies/result`, { winnerId, loserId });
    } catch {}

    setMatchCount((prev) => prev + 1);
    const updatedNextRound = [...nextRound, winnerMovie];
    setNextRound(updatedNextRound);

    const nextIndex = currentIndex + 2;
    const isRoundFinished = nextIndex >= movies.length;

    if (isRoundFinished) {
      if (updatedNextRound.length === 1) {
        setWinner(updatedNextRound[0]);
        return;
      }
      setMovies(updatedNextRound);
      setCurrentIndex(0);
      setNextRound([]);
    } else {
      setCurrentIndex(nextIndex);
    }
  };

  // Winner 확인
  if (winner) {
    return <Result movie={winner} onRestart={() => navigate("/")} />;
  }

  if (loading) return <Loading />;
  if (errorMsg) return <div className="error-msg">{errorMsg}</div>;
  if (movies.length === 0) return null;

  const left = movies[currentIndex];
  const right = movies[currentIndex + 1];

  if (!left || !right) return <div className="error-msg">매칭 데이터 오류</div>;

  const currentRoundSize = movies.length;
  const currentRoundLabel =
    currentRoundSize === 2 ? "결승" : `${currentRoundSize}강`;
  const totalMatchesThisRound = currentRoundSize / 2;
  const currentMatchInRound = Math.floor(currentIndex / 2) + 1;

  return (
    <>
      <h2 className="round-label">
        {`${genreName} 영화 월드컵 `}
        {currentRoundLabel} ({currentMatchInRound}/{totalMatchesThisRound})
      </h2>
      <div className="tournament-container">
        <Match left={left} right={right} onSelect={handleSelect} />
      </div>
    </>
  );
}
