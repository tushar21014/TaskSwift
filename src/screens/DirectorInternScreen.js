import React, { useContext,useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import '../css/MentorScreen.css'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { AiFillCheckCircle, AiFillCloseCircle,AiOutlineClose } from 'react-icons/ai'
import 'aos/dist/aos.css';
import AOS from 'aos';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import FirstContext from '../context/firstContext';

const DirectorInternScreen = () => {
  const [pending, setPending] = useState(0)
  const [approved, setApproved] = useState(0)
  const [rejected, setRejected] = useState(0)
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState('')
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [tempid, setTempid] = useState()
  const [modalData, setModalData] = useState([])
  const [filter, setFilter] = useState('default');
  const context = useContext(FirstContext);
  const {calltoast} = context;

  const navigate = useNavigate();
  useEffect(() => {
    fetchInterns();
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const filteredData = data.filter(user => {
    if (filter === 'approved') {
      return user.approval_director;
    }
    if (filter === 'rejected') {
      return user.rejected && !user.approval_director && user.approval_mentor;
    }
    return !user.rejected && !user.approval_director;
  });

  const handleFilter = (selectedFilter) => {
    setFilter(selectedFilter);
  };

  const countReq = async() => {
    let ans = await fetch('http://localhost:5004/api/director/directorCountreqapproved',{
      method:'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data = await ans.json();
    console.log(data);  
    setRejected(data.count.rejected)
    setApproved(data.count.approved)
    setPending(data.count.pending)
    // await console.log(rejected)

  }

  const acceptIntern = async (id) => {
    try {
      setLoading(true);
      // console.log(JSON.stringify(id));
      let response = await fetch('http://localhost:5004/api/director/directorAcceptintern', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id }),
      });
      // calltoast("Intern Accepted!", "success");
      
      const data = await response.json();
      console.log(data);
      fetchInterns();
      setLoading(false);
      // window.location.reload();
    } catch (error) {
      console.log(error);
    }
  }

  const rejectIntern = async (id) => {
    try {
      // console.log(JSON.stringify(id));
      let response = await fetch('http://localhost:5004/api/director/directorRejectintern', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id }),
      });
      const data = await response.json();
      console.log(data);
      fetchInterns();
      calltoast("Intern Rejected!", "warning");

      // window.location.reload();
    } catch (error) {
      console.log(error);
    }
  }

  const handleDownload = async (id, name) => {
    try {
      let response = await fetch('http://localhost:5004/api/mentor/mentorResumedownload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Set the correct Content-Type header
        },
        body: JSON.stringify({ id: id }), // Use id directly as an object property
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        // Create a temporary anchor element to trigger the download
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = name + ' resume.pdf'; // Set the desired filename
        anchor.click();

        // Clean up by revoking the object URL
        URL.revokeObjectURL(url);
      } else {
        console.log('Error downloading resume');
      }
    } catch (error) {
      console.log(error);
    }
  };


  const fetchInterns = async (id) => {
    try {

      let url = 'http://localhost:5004/api/director/directorGetinterns';
      if (id) {
        url += `/${id}`;
      }

      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-type': 'application/json',
        },
      });
      if (id) {
        const json = await response.json();
        setModalData(json.users);
        console.log(json);
      }
      else {
        const json = await response.json();
        setData(json.users);
        setLoading(false);
        console.log(data);
      }
      setTitle('Intern Details')      
      countReq();

    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    AOS.init({ duration: 1000, });
  }, [])

  return (
    <div>
        <div>
      <Modal show={show} onHide={handleClose} animation={true}>
      <Modal.Header style={{ flexDirection: "row-reverse" }} > <span className='btn-close' onClick={handleClose}><AiOutlineClose /></span>
          <Modal.Title>{title} </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='container'>
            {type == 'acceptIntern' ? (<>
              {message}
            </>) : type==='rejectIntern'? (<>
              {message}
            </>) : (<>
              {modalData.map((e) => {
                return <div key={e._id}>
                  <b>Full Name:</b> {e.first_name} {e.middle_name}<br />
                  <b>College:</b> {e.college}<br />
                  <b>Course:</b> {e.course}<br />
                  <b>Working field:</b> {e.working_field}<br/>
                  <b>Year:</b> {e.year}<br />
                  <b>Semester:</b> {e.sem}<br />
                  <b>Address:</b> {e.address1} {e.address2}<br />
                  <b>State:</b> {e.state}<br />
                  <b>Enrollment Id:</b> {e.e_rollno}<br />
                  <b>Email:</b> {e.email}<br />
                  <b>Phone Number:</b> {e.phone}<br />
                </div>
              })}
            </>)}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>
          {type === 'acceptIntern' ? (<>
            <Button variant="success" onClick={() => { handleClose(); acceptIntern(tempid) }}>
              Ok
            </Button>
          </>) : type==='rejectIntern'? (<>
            <Button variant="success" onClick={() => { handleClose(); rejectIntern(tempid) }}>
              Ok
            </Button>
          </>):
          <>
            <Button variant="success" onClick={() => { handleClose(); }}>
              Ok
            </Button>
          
          </>}
        </Modal.Footer>
      </Modal>
      <div>
        <Navigation />
      </div>
      <div className='container my-4'>
        {loading ? (
          <p>Accepting Intern.This might take a while... </p>
        ) : (
          <div className='row'>
            <div className='col-3'>
              <button className={`btn sideButtons btn-warning my-2 ${filter === 'default' ? 'active' : ''}`} onClick={() => handleFilter('default')}>Pending <span>({pending})</span></button>
              <button className={`btn sideButtons btn-warning my-2 ${filter === 'approved' ? 'active' : ''}`} onClick={() => handleFilter('approved')}>Approved <span>({approved})</span></button>
              <button className={`btn sideButtons btn-warning my-2 ${filter === 'rejected' ? 'active' : ''}`} onClick={() => handleFilter('rejected')}>Rejected <span>({rejected})</span></button>
              {/* <button type="button" data-aos="fade-right" data-aos-delay="100" className="btn sideButtons btn-warning my-2">Approved <span></span></button> */}
              {/* <button type="button" data-aos="fade-right" data-aos-delay="150" className="btn sideButtons btn-warning my-2" >Pending <span></span></button> */}
              {/* <button type="button" data-aos="fade-right" data-aos-delay="200" className="btn sideButtons btn-warning my-2">Rejected <span></span></button> */}
              <button type="button" className="btn sideButtons btn-danger my-2" onClick={() => {Object.keys(Cookies.get()).forEach((cookieName) => {Cookies.remove(cookieName);});navigate('/Login');}}>LogOut</button>
            </div>
            <div className='col-9'>
              {filteredData.length === 0 ? <div className='h1 text-center'>There are no new applications</div>:<>
              {filteredData.map((user) => (
                <div
                className={`row intern-row 
                  ${filter === 'approved' && user.approval_director ? 'highlight-accept' : ''}
                  ${filter === 'rejected' && user.rejected && !user.approval_director ? 'highlight-reject' : ''}
                  ${filter === 'default' && !user.rejected && !user.approval_director ? 'highlight-default' : ''}`}key={user._id}>
                {/* <div className={`row intern-row ${filter === 'approved' && user.approval_mentor ? 'highlight-accept' : ''}`} key={user._id}> */}
                  <div className='col-6'>
                    <p>Name: {user.first_name} {user.middle_name}</p>
                    <p>Course: {user.course}</p>
                    <p>Specialization: {user.specialization}</p>
                  </div>
                  <div className='col-3'>
                    <button type="button" className="btn btn-primary my-2" id='detail-button' onClick={() => { handleShow(); fetchInterns(user._id); setType('') }}>View Details</button>
                    <button type="button" className="btn btn-warning my-2" id='detail-button' onClick={() => { handleDownload(user._id, user.first_name) }}>View Resume</button>

                  </div>
                  <div className='col-3 d-flex justify-content-center align-items-center'>
                    {(user.approval_director && !user.rejected) ? (
                      <div className='h4'>Approved!!</div>
                      ) : user.rejected ? (<div className='h4'>Rejected!!</div>) : (<>
                        <span style={{ "color": "green", "fontSize": "50px" }} className='mx-2 allow-denial-buttons' onClick={() => { handleShow(); setTempid(user._id); setMessage('Are you sure?'); setTitle('Accept Intern'); setType('acceptIntern'); }}><AiFillCheckCircle /></span>
                        <span style={{ "color": "red", "fontSize": "50px" }} className='mx-2 allow-denial-buttons ' onClick={() => { handleShow(); setTempid(user._id); setMessage('Are you sure?'); setTitle('Reject Intern'); setType('rejectIntern'); }}><AiFillCloseCircle /></span>
                      </>)}
                  </div>

                </div>
              ))}
              </>}
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  )
}

export default DirectorInternScreen