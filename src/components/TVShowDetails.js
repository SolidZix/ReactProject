import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./TvShowDetails.css";

export default function TvShowDetails() {
  const { id } = useParams();
  const [show, setShow] = useState(null);

  const API_KEY = "9ef90895ce09ed23ddc34426f2334aad";

  useEffect(() => {
    const fetchShow = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&append_to_response=credits`
      );
      const data = await res.json();
      setShow(data);
    };

    fetchShow();
  }, [id]);

  if (!show) return <h2>Loading...</h2>;

  const bg = `https://image.tmdb.org/t/p/original${show.backdrop_path}`;
  const poster = `https://image.tmdb.org/t/p/w500${show.poster_path}`;
  const rating = Math.round(show.vote_average * 10);

  return (
    <div className="details-page">

      {/* Background */}
      <div
  className="details-hero"
  style={{
    backgroundImage: `
      linear-gradient(to right, rgba(10,10,10,0.9), rgba(10,10,10,0.6)),
      url(${bg})
    `,
    backgroundPosition: 'center top',  // <-- shift top
    backgroundSize: 'cover',
    paddingTop: '118px',                // add top padding
  }}
>
        <div className="details-content fade-in">

          {/* Poster */}
          <img className="details-poster" src={poster} alt={show.name} />

          {/* Info */}
          <div className="details-info">
            <h1 className="details-title">
              {show.name}{" "}
              <span>({show.first_air_date?.slice(0, 4)})</span>
            </h1>

            {/* Meta info */}
            <p className="details-meta">
              {show.first_air_date} •{" "}
              {show.genres?.map(g => g.name).join(", ")} •{" "}
              {show.episode_run_time?.[0]}m •{" "}
              {show.number_of_seasons} Season(s)
            </p>

            {/* Rating circle */}
            <div className="rating-section">
              <div className="rating-circle">
                <span>{rating}%</span>
              </div>
              <p className="rating-label">User Score</p>
            </div>

            {/* Tagline */}
            {show.tagline && <p className="tagline">{show.tagline}</p>}

            {/* Overview */}
            <h2>Overview</h2>
            <p className="overview">{show.overview}</p>

            {/* Creators */}
            <div className="crew-list">
              {show.created_by?.map(c => (
                <div key={c.id} className="crew-member">
                  <strong>{c.name}</strong>
                  <span>Creator</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
