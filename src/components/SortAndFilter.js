import { useEffect, useState } from "react";

export default function SortAndFilter({ onChange, genres }) {
  const [isOpen, setIsOpen] = useState(true);

  const [filters, setFilters] = useState({
    sortBy: "popularity",
    genre: "",
    year: "",
    rating: "",
  });

  useEffect(() => {
    onChange(filters);
  }, [filters]);

  const resetFilters = () => {
    setFilters({
      sortBy: "popularity",
      genre: "",
      year: "",
      rating: "",
    });
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      {/* Toggle Button */}
      <button className="collapse-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "←" : "→"}
      </button>

      {/* Sidebar Content */}
      {isOpen && (
        <div className="sidebar-content">
          <h3 className="sidebar-title">Sort & Filter</h3>

          {/* Sort */}
          <div className="filter-section">
            <label>Sort By:</label>
            <select
              value={filters.sortBy}
              onChange={(e) =>
                setFilters({ ...filters, sortBy: e.target.value })
              }
            >
              <option value="popularity">Popularity</option>
              <option value="rating">Rating</option>
              <option value="release">Release Date</option>
              <option value="alpha">A → Z</option>
            </select>
          </div>

          {/* Genre */}
          <div className="filter-section">
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
          <div className="filter-section">
            <label>Year:</label>
            <input
              type="number"
              placeholder="2023"
              value={filters.year}
              onChange={(e) =>
                setFilters({ ...filters, year: e.target.value })
              }
            />
          </div>

          {/* Rating */}
          <div className="filter-section">
            <label>Min Rating:</label>
            <input
              type="number"
              min="1"
              max="10"
              placeholder="7"
              value={filters.rating}
              onChange={(e) =>
                setFilters({ ...filters, rating: e.target.value })
              }
            />
          </div>

          {/* Reset Button */}
          <button className="reset-btn" onClick={resetFilters}>
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
