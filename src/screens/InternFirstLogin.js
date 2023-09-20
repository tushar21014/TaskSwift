import React, { useContext, useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';
import FirstContext from '../context/firstContext'
import { ToastContainer } from 'react-toastify'
import {AiFillEye,AiFillEyeInvisible} from 'react-icons/ai'

const InternFirstLogin = (props) => {
  // const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [credentials, setCredentials] = useState({ pass: "", cpass: "" });
  const navigate = useNavigate();
  const context = useContext(FirstContext);
  const { calltoast } = context;
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);

  const updatePass = async () => {
    try {
      const res = await fetch('http://localhost:5004/api/intern/internFirstlogin', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pass: credentials.pass }), // Send the password as an object
      });

      if (res.ok) {
        alert('Password Changed Successfully');
        console.log('Password Changed');
        navigate('/Intern');
        window.location.reload()
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleCPasswordVisibility = () => {
    setShowCPassword(!showCPassword);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();

    // Add your validation logic here
    if (credentials.pass === '' || credentials.cpass === '') {
      alert('Please fill in both password fields.');
      console.log("Sahi bhar")
      return
    }
    else if (credentials.pass !== credentials.cpass) {
      calltoast("Passwords Do not match","warning")
      return
    }
    else {
      setShowModal(false);
      updatePass();
      calltoast("Password Updated!", "success")
      navigate('/InternScreen')
    }
  };

  const modalFunction = () => (
    <Modal style={{ width: "100vw" }}
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      show={showModal}
      onHide={() => setShowModal(false)}
    >
      {/* <Modal.Dialog style={{width:"100vw"}}></Modal.Dialog> */}
      <Modal.Header className='justify-content-center'>
        <Modal.Title id="contained-modal-title-vcenter">
          <center>{title}</center>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>

      <div className='container d-flex justify-content-center'>
      <form onSubmit={handleSubmit} method='put'>
        <div className='my-4'>
          New Password<br />
          <input
            type={showPassword ? 'text' : 'password'} // Toggle password visibility
            id='pass'
            name='pass'
            required
            minLength={6}
            value={credentials.pass}
            onChange={(e) => setCredentials({ ...credentials, pass: e.target.value })}
            className='form-control'
            aria-label='Sizing example input'
            aria-describedby='inputGroup-sizing-default'
          />
          <span
            className='showpassword'
            id='eye'
            onClick={togglePasswordVisibility}
            style={{ position: 'absolute', top: '10vh', left: '40vw', cursor: 'pointer' }}
          >
            {!showPassword ? <AiFillEye/> : <AiFillEyeInvisible/>}
          </span>
          <br />
        </div>
        <div className='mt-4'>
          Confirm New Password<br />
          <input
            type={showCPassword ? 'text' : 'password'}
            name='cpass'
            value={credentials.cpass}
            onChange={(e) => setCredentials({ ...credentials, cpass: e.target.value })}
            required
            minLength={6}
            className='form-control'
            aria-label='Sizing example input'
            aria-describedby='inputGroup-sizing-default'
          />
          <span
            className='showpassword'
            id='eye'
            onClick={toggleCPasswordVisibility}
            style={{ position: 'absolute', top: '25.3vh', left: '40vw', cursor: 'pointer' }}
          >
            {!showCPassword ? <AiFillEye/> : <AiFillEyeInvisible/>}
          </span>
          <br />
        </div>
        <div className='d-flex justify-content-center align-items-center'>
          <button type='submit' className='btn btn-primary'>
            Submit
          </button>
        </div>
      </form>
    </div>
      </Modal.Body>
      
    </Modal>
  );

  const handleShowModal = () => {
    setShowModal(true);
  };

  useEffect(() => {
    handleShowModal();
    setTitle("Change Password");
    return () => {
    }
  }, []);

  return (
    <div>
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
      {modalFunction()}
    </div>
  );
}

export default InternFirstLogin;
