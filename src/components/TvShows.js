import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Movies.css"; // same styling
const Dropdown = ({ label, options, value, onChange }) => {
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

const TVShows = () => {
  const [shows, setShows] = useState([]);
  const [filteredShows, setFilteredShows] = useState([]);
  const [genres, setGenres] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  const API_KEY = "9ef90895ce09ed23ddc34426f2334aad";
const handleSearch = () => {
  setPage(1);       
  setShows([]);     
  fetchShows(1, pendingFilters); 
};
 const fetchShows = async (pageNumber, appliedFilters = {}) => {
  try {
    const genre = appliedFilters.genre ? `&with_genres=${appliedFilters.genre}` : "";
    const yearQuery = appliedFilters.year ? `&primary_release_year=${appliedFilters.year}` : "";

    const sortByMap = {
      popularity: "popularity.desc",
      rating: "vote_average.desc",
      release: "first_air_date.desc",
      alpha: "name.asc",
    };
    const sort = sortByMap[appliedFilters.sortBy || "popularity"] || "popularity.desc";

    const currentDate = new Date().toISOString().split('T')[0]; 
    const res = await fetch(
`https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=en-US&sort_by=${sort}${genre}${yearQuery}&page=${pageNumber}&air_date.lte=${currentDate}`);


    const data = await res.json();
    if (!Array.isArray(data.results)) return;

    setShows((prev) => {
      const combined = pageNumber === 1 ? [...data.results] : [...prev, ...data.results];
      const unique = combined.filter(
        (v, i, a) => a.findIndex((x) => x.id === v.id) === i
      );
      setFilteredShows(unique); 
      return unique;
    });
  } catch (err) {
    console.log(err);
  }
};



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

    const applyFilters = (newFilters, baseMovies = shows) => {
    setFilters(newFilters);

    let result = [...baseMovies];

    if (newFilters.genre !== "") {
      result = result.filter((movie) =>
        movie.genre_ids.includes(Number(newFilters.genre))
      );
    }

    if (newFilters.year !== "") {
      result = result.filter((movie) =>
        movie.release_date?.startsWith(newFilters.year)
      );
    }

    if (newFilters.rating !== "") {
      result = result.filter(
        (movie) => movie.vote_average * 10 >= Number(newFilters.rating)
      );
    }

    switch (newFilters.sortBy) {
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
    const reset = { sortBy: "popularity", genre: "", year: "", rating: "" };
    setPendingFilters(reset);
    applyFilters(reset);
  };

  useEffect(() => {
    setFilteredShows(shows);
  }, [shows]);

  if (loading) return <h2>Loading...</h2>;

  return (
    <div className="movies-layout">
      {/* LEFT SIDEBAR */}
       <div>
        <h1 className="movies-title">Pupular TvShows</h1>
        <h4 className="hard-coded " style={{border: "1px solid #ccc",
          padding: "10px 10px",
          cursor: "pointer",
          width: "100%",
          background: "#fff",
          boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
          borderRadius: "8px",          }}>Sort</h4>
          <h4 className="hard-coded" style={{border: "1px solid #ccc",
          padding: "10px 10px",
          cursor: "pointer",
          width: "100%",
          background: "#fff",
          boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
          borderRadius: "8px",
          }}>Where to Watch</h4>
      <div className={`filters-sidebar ${sidebarOpen ? "open" : "closed"}`} style={{boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",}}>
        
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
          setPendingFilters({ ...pendingFilters, year: e.target.value })
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
          setPendingFilters({ ...pendingFilters, rating: e.target.value })
        }
      />
        </div>

        {/* Search */}
        <button className="search-btn"  onClick={() => applyFilters(handleSearch)}>
          Search
        </button>

        {/* Reset */}
        <button className="reset-btn" onClick={resetFilters}>
          Reset Filters
        </button>
        </>
        )}
      </div>
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
