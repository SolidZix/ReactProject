import './Search.css';
import img from '../assets/glyphicons-basic-28-search-3992eb97b2b749f09793f9653407c499aa896d99535cb35cc66682d26a49df13.svg'
export default function Search()
{
    return(
        <div className="search-section">
  <div className="search-container">
    <div className='search-text'>
        <img src={img} alt="Add" width="20" height="20" />
    <input
      type="text"
      className="search-input"
      placeholder="   Search for a movie, tv show, person......"
    />
    </div>
  </div>


</div>
    )
}