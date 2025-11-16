import "./Footer.css";
import img from "../assets/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">

        <div className="footer-logo">
          <img src={img} alt="TMDB Logo" width="130" height="94" />
          <a href="#"><h2>JOIN THE COMMUNITY</h2></a>
        </div>

        <div>
          <h3>The Basics</h3>
          <ul>
            <li><a href="#">About TMDB</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Support Forums</a></li>
            <li><a href="#">API</a></li>
            <li><a href="#">System Status</a></li>
          </ul>
        </div>

        <div>
          <h3>Get Involved</h3>
          <ul>
            <li><a href="#">Contribute to TMDB</a></li>
            <li><a href="#">Submit a Bug</a></li>
            <li><a href="#">Suggest an Improvement</a></li>
            <li><a href="#">Join Our Team</a></li>
          </ul>
        </div>

        <div>
          <h3>Legal</h3>
          <ul>
            <li><a href="#">Terms of Use</a></li>
            <li><a href="#">API Terms of Use</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>

      </div>
    </footer>
  );
}
