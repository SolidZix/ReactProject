import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Movies from './components/Movies';
import TvShows from './components/TvShows';
import MovieDetails from './components/MovieDetails';
import TVShowDetails from './components/TVShowDetails';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Header />

      {/* This is the search bar you want on ALL pages */}

      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/TvShows" element={<TvShows />} />

        {/* DETAILS */}
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/tv/:id" element={<TVShowDetails />} />




        
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
