import { Link } from "react-router-dom"
import Cookies from "js-cookie"
import "./navbar.css"

const Navbar = ({ history }) => {

  const onClickLogout = () => {
    Cookies.remove("jwt_token")
    history.replace("/login")
  }

  return (
    <nav className="navbar">

      <div className="navbar-brand">
        <div className="navbar-logo-icon">
          <span className="logo-letter">H</span>
        </div>
        <span className="navbar-logo-text">HireLoop</span>
      </div>

      <ul className="navbar-links">
        <li>
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
        </li>
        <li>
          <Link to="/problems" className="nav-link">Problems</Link>
        </li>
        <li>
          <Link to="/applications" className="nav-link">Applications</Link>
        </li>
      </ul>

      <div className="navbar-right">
        <button className="logout-btn" onClick={onClickLogout}>
          Logout
        </button>
      </div>

    </nav>
  )
}

export default Navbar