import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Movies.css";

const Dropdown = ({ label, options, value, onChange }) => { //for filtering
  const [isOpen, setIsOpen] = useState(false);

  const selectedLabel =
    options.find((opt) => String(opt.value) === String(value))?.label ||
    "Select";
  return (
    <div className="filter-box" style={{ position: "relative" }}>
      <label>{label}</label>
      <div
        className="dropdown-selected"
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          border: "1px solid #ccc",
          padding: "5px 10px",
          cursor: "pointer",
          width: "100%",
          background: "#fff",
        }}
      >
        {selectedLabel}
      </div>
      {isOpen && options.length > 0 && (
        <ul
          className="dropdown-options"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            width: "150px",
            border: "1px solid #ccc",
            background: "#fff",
            zIndex: 1000,
            listStyle: "none",
            margin: 0,
            padding: 0,
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          {options.map((opt) => (
            <li
              key={opt.value}
              onClick={() => {
                onChange(String(opt.value));
                setIsOpen(false);
              }}
              style={{
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [genres, setGenres] = useState([]);

  const [pendingFilters, setPendingFilters] = useState({
    sortBy: "popularity",
    genre: "",
    year: "",
    rating: "",
  });

  const [filters, setFilters] = useState({
    sortBy: "popularity",
    genre: "",
    year: "",
    rating: "",
  });

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [infiniteScrollEnabled, setInfiniteScrollEnabled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const API_KEY = "9ef90895ce09ed23ddc34426f2334aad";

  const fetchMovies = async (pageNumber, appliedFilters = {}) => {
    try {
      const genre = appliedFilters.genre
        ? `&with_genres=${appliedFilters.genre}`
        : "";
      const yearQuery = appliedFilters.year
        ? `&primary_release_year=${appliedFilters.year}`
        : "";

      const sortByMap = {
        popularity: "popularity.desc", //what the user selects, and what the API expects
        rating: "vote_average.desc",
        release: "release_date.desc",
        alpha: "original_title.asc",
      };
      const sort =
        sortByMap[appliedFilters.sortBy || "popularity"] || "popularity.desc";
      const currentDate = new Date().toISOString().split("T")[0]; //to get the movies released before today
      const res = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=${sort}${genre}${yearQuery}&page=${pageNumber}&primary_release_date.lte=${currentDate}`
      ); //fetch movies

      const data = await res.json();
      if (!Array.isArray(data.results)) return; // if there is no result exit (wont happen just in case)

      setMovies((prev) => {
        const validMovies = data.results.filter(
          (m) => m.release_date && !isNaN(new Date(m.release_date).getTime()) // the movies should have a release date
        );

        const combined =
          pageNumber === 1 ? [...validMovies] : [...prev, ...validMovies]; // for page 1 replace movies, if >1 append
        const unique = combined.filter(  //remove duplicates
          (v, i, a) => a.findIndex((x) => x.id === v.id) === i
        );
        setFilteredMovies(unique);
        return unique;
      });
    } catch (err) {
      console.log(err);
    }
  };

  const fetchGenres = async () => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`
      );
      const data = await res.json();
      setGenres(data.genres || []); //store the genres in the state if there are any
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchMovies(1); //to fetch only one page (20 movies)
      await fetchGenres();
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    if (!infiniteScrollEnabled) return;

    const handleScroll = () => {
      const bottom =
        window.innerHeight + window.scrollY >= //Height of the visible part of the screen + How much the user has scrolled
        document.documentElement.scrollHeight - 200; // Total height of the page
      if (bottom) loadMore(); //get more movies
    };

    window.addEventListener("scroll", handleScroll); //run on every scroll (event for the window, runs on each scroll)
    return () => window.removeEventListener("scroll", handleScroll);
  }, [infiniteScrollEnabled, page]);

  const getRatingColor = (rating) => { //to get the color of the rating (circle)
    if (rating >= 70) return "#21d07a";
    if (rating >= 40) return "#d2d531";
    return "#db2360";
  };

  const loadMore = async () => { //to get more movies
    const next = page + 1;
    setPage(next);
    await fetchMovies(next);
  };
  const handleSearch = () => { //for filtering
    setPage(1);
    setMovies([]);
    fetchMovies(1, pendingFilters);
  };

  const handleLoadMore = () => { //nce we press load more, infinite movies will be loaded
    if (!infiniteScrollEnabled) setInfiniteScrollEnabled(true);
    loadMore();
  };

  const applyFilters = (newFilters, baseMovies = movies) => { //newFilters containing the selected filters by the user
    setFilters(newFilters);

    let result = [...baseMovies]; // baseMovies --> all movies by defaullt

    if (newFilters.genre !== "") { //filters by genre
      result = result.filter((movie) =>
        movie.genre_ids.includes(Number(newFilters.genre))
      );
    }

    if (newFilters.rating !== "") { //filters by rating
      result = result.filter(
        (movie) => movie.vote_average * 10 >= Number(newFilters.rating)
      );
    }

    switch (newFilters.sortBy) {
      case "rating":
        result.sort((a, b) => b.vote_average - a.vote_average);
        break;
      case "release":
        result = result
          .filter((m) => m.release_date)
          .sort(
            (a, b) =>
              new Date(b.release_date).getTime() -
              new Date(a.release_date).getTime()
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

  const resetFilters = () => { //to reset the filters (called by the reset button)
    const reset = { sortBy: "popularity", genre: "", year: "", rating: "" };
    setPendingFilters(reset);
    applyFilters(reset);
  };

  if (loading) return <h2>Loading...</h2>;

  return (
    <div className="movies-layout">
      <div>
        <h1 className="movies-title">Pupular Movies</h1>
        <h4
          className="hard-coded "
          style={{
            border: "1px solid #ccc",
            padding: "10px 10px",
            cursor: "pointer",
            width: "100%",
            background: "#fff",
            boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
            borderRadius: "8px",
          }}
        >
          Sort
        </h4>
        <h4
          className="hard-coded"
          style={{
            border: "1px solid #ccc",
            padding: "10px 10px",
            cursor: "pointer",
            width: "100%",
            background: "#fff",
            boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
            borderRadius: "8px",
          }}
        >
          Where to Watch
        </h4>
        <div
          className={`filters-sidebar ${sidebarOpen ? "open" : "closed"}`}  // Side bar (filters)
          style={{ boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)" }}
        >
          <button
            className="collapse-btn"
            onClick={() => setSidebarOpen((prev) => !prev)}
          >
            {sidebarOpen ? "←" : "→"}
          </button>

          {sidebarOpen && (
            <>
              <h2 className="movies-title">Filters</h2>
              <h3 className="filter-title">Filters & Sorting</h3>

              {/* Sort */}
              <Dropdown
                label="Sort By:"
                value={pendingFilters.sortBy}
                onChange={(val) =>
                  setPendingFilters({ ...pendingFilters, sortBy: val })
                }
                options={[
                  { value: "popularity", label: "Popularity" },
                  { value: "rating", label: "Rating" },
                  { value: "release", label: "Release Date" },
                  { value: "alpha", label: "A → Z" },
                ]}
              />

              {/* Genre */}
              <Dropdown
                label="Genre:"
                value={pendingFilters.genre}
                onChange={(val) =>
                  setPendingFilters({ ...pendingFilters, genre: val })
                }
                options={[
                  { value: "", label: "All" },
                  ...genres.map((g) => ({ value: g.id, label: g.name })),
                ]}
              />

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

              {/* Search & Reset */}
              <button className="search-btn" onClick={handleSearch}>
                Search
              </button>

              <button className="reset-btn" onClick={resetFilters}>
                Reset Filters
              </button>
            </>
          )}
        </div>
      </div>
      {/* MOVIES GRID */}
      <div className="movies-page">
        <div className="movies-grid">
          {filteredMovies.map((m) => ( //filteredMovies is an array of movies
            <Link
              to={`/movie/${m.id}`}
              key={m.id}
              className="movie-card"
              style={{ textDecoration: "none" }}
            >
              <div className="poster-wrapper">
                <img
                  className="movie-poster"
                  src={`https://image.tmdb.org/t/p/w500${m.poster_path}`} // to get a valid full sized image, poster path is a relative path(from api)
                  alt={m.title}
                />
                <div
                  className="movie-rating"
                  style={{
                    borderColor: getRatingColor(
                      Math.round(m.vote_average * 10) // vote average also a relative path from api
                    ),
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
