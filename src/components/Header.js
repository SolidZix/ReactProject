import { useState, useEffect } from 'react'; // 👈 Import useState and useEffect
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

  // State to manage the visibility class (initially visible)
  const [isVisible, setIsVisible] = useState(true);

  // State to track the previous scroll position (start at 0)
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const scrollThreshold = 70; // Only start hiding after scrolling 70px down

      if (prevScrollPos > currentScrollPos) {
        // Scrolling UP - Always show navbar
        setIsVisible(true);
      } else if (currentScrollPos > scrollThreshold) {
        // Scrolling DOWN and past the threshold - Hide navbar
        setIsVisible(false);
      }
      
      // Update the previous scroll position
      setPrevScrollPos(currentScrollPos);
    };

    // Attach the scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prevScrollPos]); // Re-run effect when prevScrollPos changes to update the listener's closure

  // Construct the class name based on the state
  const navClassName = `tmdb-nav ${!isVisible ? 'navbar-hidden' : ''}`;

  return (
    <>
      {/* ⭐ Use the dynamic class name */}
      <nav className={navClassName}> 
        <div className="tmdb-container">

          {/* Left */}
          <div className="nav-left">
            <Link to="/" className="logoH">
              <img
                src={img}
                alt="The Movie Database (TMDB)"
                width="154"
                height="20"
              />
            </Link>

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
          </div>

        </div>
      </nav>
<div style={{ height: '64px' }}></div>
      {/* ⭐ Show only on home page */}
      {isHome && <Search />}
    </>
  );
}