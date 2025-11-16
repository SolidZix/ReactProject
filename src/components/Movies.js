import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Movies.css";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const navigate = useNavigate();

  // Pending filters (user changes but not applied)
  const [pendingFilters, setPendingFilters] = useState({
    sortBy: "popularity",
    genre: "",
    year: "",
    rating: "",
  });

  // Applied filters (after clicking Search)
  const [filters, setFilters] = useState({
    sortBy: "popularity",
    genre: "",
    year: "",
    rating: "",
  });

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [infiniteScrollEnabled, setInfiniteScrollEnabled] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(true); // 🔥 NEW: Collapsible sidebar

  const API_KEY = "9ef90895ce09ed23ddc34426f2334aad";

  // Fetch movies
  const fetchMovies = async (pageNumber) => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${pageNumber}`
      );
      const data = await res.json();

      if (!Array.isArray(data.results)) return;

      setMovies((prev) => {
        const combined = [...prev, ...data.results];

        // Remove duplicates
        const unique = combined.filter(
          (v, i, a) => a.findIndex((x) => x.id === v.id) === i
        );

        applyFilters(filters, unique);
        return unique;
      });
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch genres list
  const fetchGenres = async () => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`
      );
      const data = await res.json();
      setGenres(data.genres || []);
    } catch (err) {
      console.log(err);
    }
  };

  // Load initial data
  useEffect(() => {
    const load = async () => {
      await fetchMovies(1);
      await fetchGenres();
      setLoading(false);
    };
    load();
  }, []);

  // Infinite scroll listener
  useEffect(() => {
    if (!infiniteScrollEnabled) return;

    const handleScroll = () => {
      const bottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 200;

      if (bottom) {
        loadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [infiniteScrollEnabled, page]);

  const getRatingColor = (rating) => {
    if (rating >= 70) return "#21d07a";
    if (rating >= 40) return "#d2d531";
    return "#db2360";
  };

  // Load next page
  const loadMore = async () => {
    const next = page + 1;
    setPage(next);
    await fetchMovies(next);
  };

  // First click enables infinite scroll → next pages load automatically
  const handleLoadMore = () => {
    if (!infiniteScrollEnabled) setInfiniteScrollEnabled(true);
    loadMore();
  };

  // APPLY FILTERS + SORTING
  const applyFilters = (newFilters, baseMovies = movies) => {
    setFilters(newFilters);

    let result = [...baseMovies];

    // Genre
    if (newFilters.genre !== "") {
      result = result.filter((movie) =>
        movie.genre_ids.includes(Number(newFilters.genre))
      );
    }

    // Year
    if (newFilters.year !== "") {
      result = result.filter((movie) =>
        movie.release_date?.startsWith(newFilters.year)
      );
    }

    // Min rating
    if (newFilters.rating !== "") {
      result = result.filter(
        (movie) => movie.vote_average * 10 >= Number(newFilters.rating)
      );
    }

    // Sorting
    switch (newFilters.sortBy) {
      case "rating":
        result.sort((a, b) => b.vote_average - a.vote_average);
        break;

      case "release":
        result.sort(
          (a, b) => new Date(b.release_date) - new Date(a.release_date)
        );
        break;

      case "alpha":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;

      default:
        result.sort((a, b) => b.popularity - a.popularity);
    }

    setFilteredMovies(result);
  };

  // Reset filters
  const resetFilters = () => {
    const reset = {
      sortBy: "popularity",
      genre: "",
      year: "",
      rating: "",
    };

    setPendingFilters(reset);
    applyFilters(reset);
  };

  if (loading) return <h2>Loading...</h2>;

  return (
    <div className="movies-layout">

      {/* 🔥 SIDEBAR (with collapse button) */}
      <div className={`filters-sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <button
          className="collapse-btn"
          onClick={() => setSidebarOpen((prev) => !prev)}
        >
          {sidebarOpen ? "←" : "→"}
        </button>

        {sidebarOpen && (
          <>
            <h2 className="movies-title">Popular Movies</h2>
            <h3 className="filter-title">Filters & Sorting</h3>

            {/* Sort */}
            <div className="filter-box">
              <label>Sort By:</label>
              <select
                value={pendingFilters.sortBy}
                onChange={(e) =>
                  setPendingFilters({
                    ...pendingFilters,
                    sortBy: e.target.value,
                  })
                }
              >
                <option value="popularity">Popularity</option>
                <option value="rating">Rating</option>
                <option value="release">Release Date</option>
                <option value="alpha">A → Z</option>
              </select>
            </div>

            {/* Genre */}
            <div className="filter-box">
              <label>Genre:</label>
              <select
                value={pendingFilters.genre}
                onChange={(e) =>
                  setPendingFilters({
                    ...pendingFilters,
                    genre: e.target.value,
                  })
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
                value={pendingFilters.year}
                onChange={(e) =>
                  setPendingFilters({
                    ...pendingFilters,
                    year: e.target.value,
                  })
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
                value={pendingFilters.rating}
                onChange={(e) =>
                  setPendingFilters({
                    ...pendingFilters,
                    rating: e.target.value,
                  })
                }
              />
            </div>

            {/* Search Button */}
            <button
              className="search-btn"
              onClick={() => applyFilters(pendingFilters)}
            >
              Search
            </button>

            {/* Reset Button */}
            <button className="reset-btn" onClick={resetFilters}>
              Reset Filters
            </button>
          </>
        )}
      </div>

      {/* MOVIES GRID */}
      <div className="movies-page">
        <div className="movies-grid">
  {filteredMovies.map((m) => (
    <Link
      to={`/movie/${m.id}`}
      key={m.id}
      className="movie-card"
      style={{ textDecoration: "none" }}
    >
      <div className="poster-wrapper">
        <img
          className="movie-poster"
          src={`https://image.tmdb.org/t/p/w500${m.poster_path}`}
          alt={m.title}
        />

        <div
          className="movie-rating"
          style={{
            borderColor: getRatingColor(Math.round(m.vote_average * 10)),
          }}
        >
          {Math.round(m.vote_average * 10)}%
        </div>
      </div>

      <div className="movie-info">
        <h3>{m.title}</h3>
        <p className="movie-date">{m.release_date}</p>
      </div>
    </Link>
  ))}
</div>



        {/* LOAD MORE BUTTON */}
        <button className="load-more-btn" onClick={handleLoadMore}>
          {infiniteScrollEnabled ? "Loading..." : "Load More"}
        </button>
      </div>
    </div>
  );
};

export default Movies;
