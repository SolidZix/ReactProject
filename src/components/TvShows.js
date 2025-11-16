import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Movies.css"; // same styling

const TVShows = () => {
  const [shows, setShows] = useState([]);
  const [filteredShows, setFilteredShows] = useState([]);
  const [genres, setGenres] = useState([]);

  const [filters, setFilters] = useState({
    sortBy: "popularity",
    genre: "",
    year: "",
    rating: "",
  });

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [infiniteScrollEnabled, setInfiniteScrollEnabled] = useState(false);

  const API_KEY = "9ef90895ce09ed23ddc34426f2334aad";

  // Fetch TV shows
  const fetchShows = async (pageNumber) => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=en-US&page=${pageNumber}`
      );
      const data = await res.json();

      if (!Array.isArray(data.results)) return;

      setShows((prev) => {
        const combined = [...prev, ...data.results];

        const unique = combined.filter(
          (v, i, a) => a.findIndex((x) => x.id === v.id) === i
        );

        return unique;
      });
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch TV genres
  const fetchGenres = async () => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/genre/tv/list?api_key=${API_KEY}&language=en-US`
      );
      const data = await res.json();
      setGenres(data.genres || []);
    } catch (err) {
      console.log(err);
    }
  };

  // Load initial
  useEffect(() => {
    const load = async () => {
      await fetchShows(1);
      await fetchGenres();
      setLoading(false);
    };
    load();
  }, []);

  // Infinite scroll
  useEffect(() => {
    if (!infiniteScrollEnabled) return;

    const handleScroll = () => {
      const bottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 200;

      if (bottom) loadMore();
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [infiniteScrollEnabled, page]);

  const loadMore = async () => {
    const next = page + 1;
    setPage(next);
    await fetchShows(next);
  };

  const handleLoadMore = () => {
    if (!infiniteScrollEnabled) setInfiniteScrollEnabled(true);
    loadMore();
  };

  // APPLY FILTERS (Search button) */
  const applyFilters = () => {
    let result = [...shows];

    if (filters.genre !== "") {
      result = result.filter((s) =>
        s.genre_ids.includes(Number(filters.genre))
      );
    }

    if (filters.year !== "") {
      result = result.filter((s) =>
        s.first_air_date?.startsWith(filters.year)
      );
    }

    if (filters.rating !== "") {
      result = result.filter(
        (s) => s.vote_average * 10 >= Number(filters.rating)
      );
    }

    switch (filters.sortBy) {
      case "rating":
        result.sort((a, b) => b.vote_average - a.vote_average);
        break;
      case "release":
        result.sort(
          (a, b) => new Date(b.first_air_date) - new Date(a.first_air_date)
        );
        break;
      case "alpha":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        result.sort((a, b) => b.popularity - a.popularity);
    }

    setFilteredShows(result);
  };

  // RESET FILTERS
  const resetFilters = () => {
    setFilters({
      sortBy: "popularity",
      genre: "",
      year: "",
      rating: "",
    });

    setFilteredShows(shows);
  };

  useEffect(() => {
    setFilteredShows(shows);
  }, [shows]);

  if (loading) return <h2>Loading...</h2>;

  return (
    <div className="movies-layout">
      {/* LEFT SIDEBAR */}
      <div className="filters-sidebar">
        <h2 className="movies-title">Popular TV Shows</h2>
        <h3 className="filter-title">Filters & Sorting</h3>

        {/* Sort */}
        <div className="filter-box">
          <label>Sort By:</label>
          <select
            value={filters.sortBy}
            onChange={(e) =>
              setFilters({ ...filters, sortBy: e.target.value })
            }
          >
            <option value="popularity">Popularity</option>
            <option value="rating">Rating</option>
            <option value="release">First Air Date</option>
            <option value="alpha">A → Z</option>
          </select>
        </div>

        {/* Genre */}
        <div className="filter-box">
          <label>Genre:</label>
          <select
            value={filters.genre}
            onChange={(e) =>
              setFilters({ ...filters, genre: e.target.value })
            }
          >
            <option value="">All</option>
            {genres.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        {/* Year */}
        <div className="filter-box">
          <label>Year:</label>
          <input
            type="number"
            placeholder="2020"
            value={filters.year}
            onChange={(e) =>
              setFilters({ ...filters, year: e.target.value })
            }
          />
        </div>

        {/* Rating */}
        <div className="filter-box">
          <label>Min Rating (%):</label>
          <input
            type="number"
            placeholder="70"
            min="0"
            max="100"
            value={filters.rating}
            onChange={(e) =>
              setFilters({ ...filters, rating: e.target.value })
            }
          />
        </div>

        {/* Search */}
        <button className="search-btn" onClick={applyFilters}>
          Search
        </button>

        {/* Reset */}
        <button className="reset-btn" onClick={resetFilters}>
          Reset Filters
        </button>
      </div>

      {/* SHOWS GRID */}
      <div className="movies-page">
        <div className="movies-grid">
  {filteredShows.map((s) => (
    <Link to={`/tv/${s.id}`} key={s.id} className="movie-card-link">
      <div className="movie-card">
        <div className="poster-wrapper">
          <img
            className="movie-poster"
            src={`https://image.tmdb.org/t/p/w500${s.poster_path}`}
            alt={s.name}
          />

          <div
            className="movie-rating"
            style={{
              borderColor:
                s.vote_average >= 7
                  ? "#21d07a"
                  : s.vote_average >= 4
                  ? "#d2d531"
                  : "#db2360",
            }}
          >
            {Math.round(s.vote_average * 10)}%
          </div>
        </div>

        <div className="movie-info">
          <h3>{s.name}</h3>
          <p className="movie-date">{s.first_air_date}</p>
        </div>
      </div>
    </Link>
  ))}
</div>


        <button className="load-more-btn" onClick={handleLoadMore}>
          {infiniteScrollEnabled ? "Loading…" : "Load More"}
        </button>
      </div>
    </div>
  );
};

export default TVShows;
