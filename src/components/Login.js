import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import AOS from 'aos';
import "../css/Login.css"
import 'aos/dist/aos.css';
import Cookies from 'js-cookie'; // Import the js-cookie library
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css" 
import FirstContext from '../context/firstContext'

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", pass: "" })
  const context = useContext(FirstContext);
  const {calltoast} = context;  

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5004/api/auth/login", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: credentials.email, pass: credentials.pass })
      });
  
      const json = await response.json();
      console.log(json);
      if (!json.success) {
        calltoast("Incorrect Credentials!", "error")
      }
  
      if (json.role ==='mentor') {
        // Set cookies instead of using localStorage
        Cookies.set('auth-Token', json.authToken);
        Cookies.set('working_field', json.working_field);
        Cookies.set('role', json.role);
        
        navigate('/MentorHomescreen');
      }
      else if(json.role ==='director')
      {
        Cookies.set('auth-Token', json.authToken);
        Cookies.set('role', json.role);
        navigate('/Director');
      }
      else if(json.role ==='user')
      {
        Cookies.set('auth-Token', json.authToken)
        Cookies.set('working_field', json.working_field);
        Cookies.set('role', json.role);
        navigate('/Intern');
        
      }

      else if(json.role ==='superuser')
      {
        Cookies.set('auth-Token', json.authToken)
        // Cookies.set('working_field', json.working_field);
        Cookies.set('role', json.role);
        navigate('/Managerusers');

      }
    } catch (error) {
      console.log(error);
    }
  };

  const showPass = () => {
    const cont = document.getElementById('exampleCheck1');
    const passCont = document.getElementById('pass');
    if (cont.checked)
      passCont.type = 'text';
    else
      passCont.type = 'password'
  }

  useEffect(() => {
    AOS.init({ duration: 1000, });
  }, [])

  return (
    
    <div className='login-grandfather-cont'>
       <ToastContainer
    position="bottom-right"
    autoClose={5000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="colored"
  />
      <div className='login-container' data-aos='fade-right'>
        <div className='container my-3 inner-login-container' >
          <h2 className='my-4 h3'>Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Email Address</label>
              <input type="email" className="form-control" id="exampleInputEmail1" name='email' value={credentials.email} aria-describedby="emailHelp" onChange={onChange} placeholder="Enter Email" />
            </div>
            <div className="form-group">
              <label htmlFor="exampleInputPassword1">Password</label>
              <input type="password" className="form-control" id="pass" value={credentials.pass} name='pass' onChange={onChange} placeholder="Password" />
            </div>
            <div className="form-check">
              <input type="checkbox" className="form-check-input forgot" onClick={showPass} id="exampleCheck1" />
              <label className="form-check-label" htmlFor="exampleCheck1">Show Password</label>
              <Link to='/Forgotpassword' className='forgotpass'>Forgot Password?</Link>
            </div>

            <center>
              <button type="primary" className="btn btn-primary my-2">Log In</button>
            </center>
          </form>
          <hr className='my-2'/>
          <div>

          </div>
          <center>

            <div className='form-caption my-2'>
              <p style={{ marginTop: '0px' }}><b> Don't Have An Account?<Link to="/Signup" style={{ color: 'black' }}> Signup</Link></b></p>
            </div>
          </center>

        </div>
      </div>
    </div>
  )
}

export default Login