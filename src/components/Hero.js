import { useEffect, useState } from "react";
import "./Hero.css"; 

const Hero = () => {
  const [bgImage, setBgImage] = useState("");

  useEffect(() => {
    const fetchRandomBackground = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/trending/movie/week?api_key=9ef90895ce09ed23ddc34426f2334aad`
        );
        const data = await res.json();

        const randomMovie =
          data.results[Math.floor(Math.random() * data.results.length)]; // length is the number of movies we got 

        const url = `https://image.tmdb.org/t/p/original${randomMovie.backdrop_path}`; //to get a valid full sized image
        setBgImage(url);
      } catch (error) {
        console.log(error);
      }
    };

    fetchRandomBackground();
  }, []);

  return (
    <div
      className="hero"
      style={{ "--bg-image": `url(${bgImage})` }}
    >
      <div className="hero-overlay"></div>

      <div className="hero-content">
        <h2>Welcome.</h2>
        <h3>Millions of movies, TV shows and people to discover. Explore now.</h3>

        <div className="search-wrapper"></div>
        <div className="search-c">
          <input
            type="text"
            placeholder="Search for a movie, tv show, person..."
          />
          <button>Search</button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
