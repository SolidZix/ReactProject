    import { useEffect, useState } from "react";
    import { useParams } from "react-router-dom";
    import "./MovieDetails.css";

    export default function MovieDetails() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);

    const API_KEY = "9ef90895ce09ed23ddc34426f2334aad";

    useEffect(() => {
        const fetchMovie = async () => {
        const res = await fetch(
            `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&append_to_response=credits`
        );
        const data = await res.json();
        setMovie(data);
        };

        fetchMovie();
    }, [id]);

    if (!movie) return <h2>Loading...</h2>;

    const bg = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
    const poster = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    const rating = Math.round(movie.vote_average * 10);

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
    backgroundPosition: 'center top', 
    backgroundSize: 'cover',
    paddingTop: '118px',               
  }}
>

            <div className="details-content fade-in">

            {/* Poster */}
            <img className="details-poster" src={poster} alt={movie.title} />

            {/* Info */}
            <div className="details-info">
                <h1 className="details-title">
                {movie.title}{" "}
                <span>({movie.release_date?.slice(0, 4)})</span>
                </h1>

                {/* Meta info */}
                <p className="details-meta">
                {movie.release_date} • {movie.genres?.map(g => g.name).join(", ")} • {movie.runtime}m
                </p>

                {/* Rating circle */}
                <div className="rating-section">
                <div className="rating-circle" >
                    <span>{rating}%</span>
                </div>
                <p className="rating-label">User Score</p>
                </div>

                {/* Tagline */}
                {movie.tagline && <p className="tagline">{movie.tagline}</p>}

                {/* Overview */}
                <h2>Overview</h2>
                <p className="overview">{movie.overview}</p>

                {/* Crew */}
                <div className="crew-list">
                {movie.credits?.crew
                    ?.filter(c => c.job === "Director" || c.job === "Writer")
                    .slice(0, 4)
                    .map(c => (
                    <div key={c.id} className="crew-member">
                        <strong>{c.name}</strong>
                        <span>{c.job}</span>
                    </div>
                    ))}
                </div>

            </div>
            </div>
        </div>

        </div>
    );
    }
