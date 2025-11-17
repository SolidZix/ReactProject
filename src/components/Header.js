import { useState, useEffect } from 'react';
import './Header.css';
import Search from './Search';
import "./Search.css";
import img from '../assets/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg';
import search from '../assets/glyphicons-basic-28-search-blue-177462d06db81ff2a02aa022c1c0be5ba4200d7bd3f51091ed9298980e3a26a1.svg';
import plus from '../assets/glyphicons-basic-371-plus-white-0bac34f16124808a12ea863b4d9cc6e599dee7c0a80658cfe9ead26939e64517.svg';
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  const [isVisible, setIsVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  // Mobile menu state
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const scrollThreshold = 70;

      if (prevScrollPos > currentScrollPos) {
        setIsVisible(true);
      } else if (currentScrollPos > scrollThreshold) {
        setIsVisible(false);
      }

      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  const navClassName = `tmdb-nav ${!isVisible ? 'navbar-hidden' : ''}`;

  return (
    <>
      <nav className={navClassName}>
        <div className="tmdb-container">

          {/* Left */}
          <div className="nav-left">
            <Link to="/" className="logoH">
              <img src={img} alt="TMDB" />
            </Link>

            {/* Desktop Links */}
            <ul className="nav-links">
              <Link to="/movies"><li>Movies</li></Link>
              <Link to="/TvShows"><li>TV Shows</li></Link>
              <li>People</li>
              <li>More</li>
            </ul>
          </div>

          {/* Right */}
          <div className="nav-right">
            <img className="icon-btn" src={plus} alt="Add" width="24" height="24" />
            <button className="lang-btn">EN</button>
            <a className="login">Login</a>
            <a className="join">Join TMDB</a>
            <img className="icon-btn" src={search} alt="Search" width="30" height="45" />

            {/* Hamburger for mobile */}
            <div 
              className="hamburger" 
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
            </div>
          </div>
        </div>

        {/* Mobile Full Menu (slides from left) */}
        <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
          <div className="mobile-header">
            <Link to="/" onClick={() => setMenuOpen(false)} className="logoH">
              <img src={img} alt="TMDB" />
            </Link>
            <button className="close-btn" onClick={() => setMenuOpen(false)}>×</button>
          </div>

          <div className="mobile-content">
            <Link to="/movies" onClick={() => setMenuOpen(false)}>Movies</Link>
            <Link to="/TvShows" onClick={() => setMenuOpen(false)}>TV Shows</Link>
            <Link to="/" onClick={() => setMenuOpen(false)}>People</Link>
            <Link to="/" onClick={() => setMenuOpen(false)}>More</Link>

            <div className="mobile-icons">
              <img className="icon-btn" src={plus} alt="Add" width="24" height="24" />
              <button className="lang-btn">EN</button>
              <a className="login">Login</a>
              <a className="join">Join TMDB</a>
              <img className="icon-btn" src={search} alt="Search" width="30" height="45" />
            </div>
          </div>
        </div>

      </nav>

      <div style={{ height: '64px' }}></div>

      {isHome && <Search />}
    </>
  );
}
