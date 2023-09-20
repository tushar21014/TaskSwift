import React from 'react'
import { Link, useLocation, useNavigate } from "react-router-dom"
// import { BsPerson } from "react-icons/bs"
import { IoPersonCircleSharp } from "react-icons/io5"
import Cookies from 'js-cookie'

const Naviagtion = () => {
  const navigate = useNavigate();
  let location = useLocation();
  
  const handleLogout = () => {
    localStorage.clear();
    navigate('/Login')
  }
  return (
    <div style={{'overflowX':"hidden"}}>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <Link className="navbar-brand mx-4" >JIRA</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent" >
          <ul className="navbar-nav mr-auto" style={{ justifyContent: "center", alignItems: "center" }}>
            {/* <li className="nav-item active">
              <Link className="nav-link" >Home</Link>
            </li> */}
            {Cookies.get("role") === "director" ? (
              <>
            <li className={`nav-item ${location.pathname === "/Home" ? "active" : ""}`}>
              <Link className="nav-link" >Home</Link>
            </li>
            
            <li className={`nav-item ${location.pathname === "/Home" ? "active" : ""}`}>
                  <Link className="nav-link">Mentors</Link>
                </li>
                <li className={`nav-item ${location.pathname === "/Director" ? "active" : ""}`}>
                  <Link to='/Director'className="nav-link">Interns</Link>
                </li>
                <li style={{ display: "flex", width: "75vw", justifyContent: "end" }}>
                  <button onClick={handleLogout} className="btn btn-danger">
                    LogOut
                  </button>
                </li>
                <li className="nav-item" style={{ marginLeft: "80vw" }}
                >
                  <Link
                    to="/MyProfile"
                    className="nav-link mx-2"
                    style={{ fontSize: "24px", display: "flex", justifyContent: "center", alignItems: "center",
                    }}
                  >
                    <IoPersonCircleSharp />
                  </Link>
                </li>
              </>
            ) : Cookies.get("role") === "mentor" ? (
              <>
              <li className={`nav-item ${location.pathname === "/MentorHomescreen" ? "active" : ""}`}>
              {/* <li className="nav-item active"> */}
              <Link to='/MentorHomescreen' className="nav-link" >Home</Link>
            </li>
            <li className={`nav-item ${location.pathname === "/MentorInterns" ? "active" : ""}`}>
                {/* <li className="nav-item"> */}
                  <Link to='/MentorInterns' className="nav-link">
                    Interns
                  </Link>
                </li>
                <li className={`nav-item ${location.pathname === "/AssignTasks" ? "active" : ""}`}>
                  <Link to="/AssignTasks" className="nav-link">
                    Assign Task
                  </Link>
                </li>
                <li style={{ display: "flex", width: "75vw", justifyContent: "end" }}>
                  <button onClick={handleLogout} className="btn btn-danger">
                    LogOut
                  </button>
                </li>
              </>
            ) : Cookies.get("role") === "user"? (
              <>
              <li className="nav-item active">
              <Link className="nav-link" >Home</Link>
            </li>
            
                <li className="nav-item">
                  <Link className="nav-link">
                    You are a intern
                  </Link>
                </li>
                <li style={{ display: "flex", width: "75vw", justifyContent: "end" }}>
                  <button onClick={handleLogout} className="btn btn-danger">
                    LogOut
                  </button>
                </li>
              </>
            ):(<></>)}
          </ul>
        </div>
      </nav>
    </div>
  )
}

export default Naviagtion