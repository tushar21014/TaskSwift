import React, { useContext, useEffect, useState } from 'react'
import LeftPanel from '../components/LeftPanel';
import { AiOutlineDownload, AiOutlineClose, AiOutlineEye, AiOutlinePlus} from 'react-icons/ai'
import {MdDisabledByDefault} from 'react-icons/md'
import { FiSettings } from 'react-icons/fi'
import { GrPowerReset } from 'react-icons/gr'
import { CgProfile } from 'react-icons/cg'
import { BsFilter } from 'react-icons/bs'
import '../css/MentorScreen.css'
import 'aos/dist/aos.css';
import AOS from 'aos';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { ToastContainer } from 'react-toastify'
import FirstContext from '../context/firstContext'
import moment from 'moment';

const SuperuserManageusers = () => {
  const { calltoast } = useContext(FirstContext);
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({ userr: [] });
  const [show, setShow] = useState(false);
  const [thirdShow, setThirdShow] = useState(false)
  const [id, setId] = useState('')
  const [type, setType] = useState('');
  const [tasks, setTasks] = useState([])
  const [secId, setSecId] = useState()
  const [secshow, setsecShow] = useState(false)
  const handleClose = () => setShow(false);
  const superuserrURL = "http://localhost:5004/api/superuser";
  const handlesecClose = () => setsecShow(false);
  const handlethirdClose = () => setThirdShow(false);
  const [disabledAccid, setDisabledAccid] = useState('')
  const [selectedFilter, setSelectedFilter] = useState(''); // State to track the selected filter
  var count = 1;
  const [fifthShow, setFifthshow] = useState(false);  //  to disablel acc


  useEffect(() => {
    fetchData();
    fetchFields();
    AOS.init({ duration: 1000, });

    handleFilterSelection();
    return () => {
    }
  }, [])

  
  const [fields, setFields] = useState([])
  const fetchFields = async() => {
      const response = await fetch('http://localhost:5004/api/auth/fetchFields',{
          method:"get"
      })
      const res = await response.json();
      console.log(res);
      setFields(res);
  }


  useEffect(() => {
    // Call fetchTasks when secId changes
    if (secId) {
      fetchTasks();
    }
  }, [secId]);

  function formatDate(dateString) {
    const dateObject = new Date(dateString);
    const day = dateObject.getDate();
    const month = dateObject.getMonth() + 1; // Note: Month is zero-based, so add 1
    const year = dateObject.getFullYear() % 100; // Get the last two digits of the year

    // Ensure day and month are zero-padded to two digits
    const formattedDay = String(day).padStart(2, '0');
    const formattedMonth = String(month).padStart(2, '0');
    const formattedYear = String(year).padStart(2, '0');

    return `${formattedDay}/${formattedMonth}/${formattedYear}`;
  }


  const handleFilterSelection = (filter) => {
    setSelectedFilter(filter);
  };

  let filteredInterns = data.userr.filter((intern) => {
    if (!selectedFilter) return true; // Show all interns if no filter is selected
    return intern.working_field === selectedFilter; // Replace 'working_field' with the correct property
  });
  const handlefifthClose = () => setFifthshow(false);

  const resetPass = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5004/api/superuser/superuserResetpassword`, {
        method: "PUT",
        credentials: 'include',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ reqid: id, model: type })
      })
      if (res.ok) {
        console.log("Password Link sent successfully");
        setLoading(false);
        calltoast('Password link sent successfully', 'success');
      }
    } catch (error) {
      console.log(error)

    }
  }

  const fetchTasks = async () => {
    try {
      // console.log("Frontend ", secId)
      let res = await fetch('http://localhost:5004/api/superuser/superuserFetchtask', {
        method: "POST",
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: secId })
      });

      if (res.ok) {
        const data = await res.json();
        console.log(data.taskss);
        setTasks(data.taskss);
      } else {
        // Handle the case where the response is not okay (e.g., show an error message)
        console.error('Failed to fetch tasks');
      }
    } catch (error) {
      console.error(error);
      // Handle the fetch error here (e.g., show an error message)
    }
  }


  const fetchData = async () => {
    try {
      const response = await fetch(`${superuserrURL}/superuserFetchall`, {
        method: "POST",
        credentials: 'include'
      });

      const dat = await response.json();
      console.log(dat);
      setData(dat);

    } catch (error) {
      console.log(error);
    }
  }

  const disableAcc = async (id) => {
    try {

      const response = await fetch(`http://localhost:5004/api/mentor/mentorDisableinternacc`, {
        method: "PUT",
        credentials: 'include',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({ userId: id })
      });
      if (response.ok) {
        const updatedInterns = filteredInterns.filter((e) => e._id !== disabledAccid);
        filteredInterns = updatedInterns
        // setIdleInterns(updatedInterns);
        calltoast("Account disabled Successfully", 'success');
        console.log("Accound disabled");
      }
      else {
        
        calltoast("Account failed", 'success');
        console.error();
      }
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <div>
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />

      <Modal show={show} onHide={handleClose}>
        <Modal.Header style={{ flexDirection: "row-reverse" }} > <span className='btn-close' onClick={handleClose}><AiOutlineClose /></span>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to send reset password link?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => { handleClose(); resetPass(); }}>
            Send
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={secshow} onHide={handlesecClose}>
        <Modal.Header style={{ flexDirection: "row-reverse" }} > <span className='btn-close' onClick={handlesecClose}><AiOutlineClose /></span>
          <Modal.Title>Preview Tasks</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <table className="table table-striped">
            {tasks.length > 0 ? <>
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Task Description</th>
                  <th scope="col">Assigned On</th>
                  <th scope="col">Deadline</th>
                  <th scope="col">Completed On</th>
                  <th scope="col">Submission Desc</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((e) => {
                  const currentDate = new Date(); // Get the current date
                  const submissionByDate = new Date(e.submission_by); // Convert submission_by to a Date object

                  // Check if today's date exceeds the submission_by date and the task is pending
                  const isTaskPending = !e.task_completed && currentDate > submissionByDate;

                  // Create a class string to conditionally apply the red-bg class
                  const rowClassName = isTaskPending ? 'bg-danger' : '';
                  return <tr key={e._id} className={rowClassName}>
                    <th>{count++}</th>
                    <td>{e.task_description}</td>
                    <td>{formatDate(e.assigned_on)}</td>
                    <td>{formatDate(e.submission_by)}</td>
                    {/* {console.log(e.task_completed)} */}
                    {e.task_completed ? <>
                      <td>{formatDate(e.submission_on)}</td>
                    </> : <>
                      <td>Pending</td>
                    </>}
                    <td>{e.intern_submission_desc}</td>
                  </tr>
                })}
              </tbody>
            </> : <>
              <div className='text-center'>No Task Assigned Yet</div>
            </>}
          </table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => { handlesecClose() }}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={thirdShow} onHide={handlethirdClose}>
        <Modal.Header style={{ flexDirection: "row-reverse" }} > <span className='btn-close' onClick={handlethirdClose}><AiOutlineClose /></span>
          <Modal.Title>Add Mentor</Modal.Title>
        </Modal.Header>
        <Modal.Body>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => { handleClose(); resetPass(); }}>
            Send
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={fifthShow} onHide={handleClose} backdrop="static">
        <Modal.Header style={{ flexDirection: "row-reverse" }} > <span className='btn-close' onClick={handlefifthClose}><AiOutlineClose /></span>
          <Modal.Title>Disable Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to disable the account? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handlefifthClose}>
            No
          </Button>
          <Button variant="danger" onClick={() => { disableAcc(disabledAccid); handlefifthClose() }}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'white' }}>
          <img src='https://cdn.dribbble.com/users/148670/screenshots/5252136/dots.gif' />
        </div>
        // <p>Resetting Password.This might take a while... </p>
      ) : (
        <div>

          <div>
            <LeftPanel />
          </div>
          <div className={`mentorHomescreen-grandFather-container`} id='mentorHomeScreen-rightPanel'>
            <div className='mentorHomescreen-fatherContainer'>
              <div className='mentorHomeScreen-topbar-father-container'>

                <div className='mentorHomeScreen-topbar' style={{ minHeight: "20vh" }}>
                  <div className='dashboardTitle' id='dashboardTitle'>
                    <h1>Users</h1>
                  </div>
                  <div>
                    <form className="form-inline my-2 my-lg-0">
                      <input className="form-control mr-sm-2 searchBoxforInterns" type="search" placeholder="Search" aria-label="Search" />
                    </form>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div className='mentorHomescreen-father-container'>
                  <div className='row' style={{ marginRight: "0px", marginLeft: "0px" }}>
                    <div className='col mentorHomescreen-col' data-aos='fade-up' data-aos-delay='50'>
                      <div className='idle-interns-heading'>DIRECTORS</div>
                      {data.mentorr && (
                        <div id='internListBoxContainer'>
                          <div
                            style={{
                              position: "absolute",
                              width: "100%",
                              height: "4%",
                              backdropFilter: "blur(1px)",
                              bottom: "0px",
                              zIndex: "5",
                            }}
                          >
                          </div>
                          {data.directorr.map((e) => {
                            return <div key={e._id} className='idleIntern-box'>
                              <div id='idle-employee-profile-pic'><span><CgProfile /></span></div>
                              <div id='idle-employee-right-part'>
                                <div id='idle-employee-name'>{e.first_name} {e.last_name}</div>
                                {/* <div id='idle-employee-college'><p>{e.college}</p></div> */}
                                {/* <div id='idle-employee-assignTask'><AiOutlinePlus
                              onClick={() => { handleShow(); setTemPid(e._id); }} className='AiOutlinePlus' /></div> */}
                              </div>

                            </div>
                          })}
                        </div>
                      )}
                    </div>
                    <div className='col mentorHomescreen-col' data-aos='fade-up' data-aos-delay='150'>
                      <div className='idle-interns-heading'>MENTORS</div>
                      {data.length === 0 ? <>
                        <div className='pl-3'>No Mentors</div>
                      </> : <>
                        {data.mentorr && (
                          <div className='internListBoxContainer'>
                            {data.mentorr.map((e, index) => {
                              return <div key={e._id} className='idleIntern-box'>
                                <div id='idle-employee-profile-pic'><span><CgProfile /></span></div>
                                <div id='idle-employee-right-part'>
                                  <div id='idle-employee-name'>{e.first_name} {e.last_name} </div>
                                  <div id='idle-employee-college'><p>{e.working_field}</p></div>
                                  <div id='idle-employee-assignTask'><GrPowerReset style={{ marginRight: "1vw",fontSize:'17px' }} className='AiOutlinePlus' data-toggle="tooltip" data-placement="top" title="Reset Password" onClick={() => { setShow(true); setId(e._id); setType('mentor') }} /> 
                                  {/* <FiSettings className='AiOutlinePlus' style={{ fontSize: '17px' }} /> */}
                                   </div>
                                </div>

                              </div>
                            })}
                          </div>
                        )}
                      </>}

                    </div>
                    <div className='col mentorHomescreen-col' data-aos='fade-up' data-aos-delay='150'>
                      <div className='idle-interns-heading'>INTERNS</div><span className='filterr dropdown'><BsFilter className='dropdown-toggle' data-toggle="dropdown" />
                        <div className="dropdown-menu">  
                          {/* {fields.map((e) => {
                            <div className="dropdown-item" value={e} onClick={() => handleFilterSelection('')}>{e}</div>

                          })} */}
                          <div className="dropdown-item" onClick={() => handleFilterSelection('')}>All</div>
                          <div className="dropdown-item" onClick={() => handleFilterSelection('AI')}>AI Interns</div>
                          <div className="dropdown-item" onClick={() => handleFilterSelection('Web')}>Web Dev Interns</div>
                          <div className="dropdown-item" onClick={() => handleFilterSelection('SD')}>SD Interns</div>
                        </div></span>
                      {filteredInterns.length === 0 ? <>
                        <div className="pl-3">No interns</div>
                      </> : <>
                      
                        {filteredInterns && (
                          <div className='internListBoxContainer'>
                            {filteredInterns.map((e, index) => {
                              return <div key={e._id} className='idleIntern-box'>
                                <div id='idle-employee-profile-pic'><span><CgProfile /></span></div>
                                <div id='idle-employee-right-part'>
                                  <div id='idle-employee-name'>{e.first_name} {e.last_name}</div>
                                  <div id='idle-employee-college'><p>{e.working_field}</p></div>
                                  {/* {console.log} */}
                                  {/* {calculateDateDifference("2023-09-01T00:00:00.000Z")} */}
                                  {/* <p>{calculateDays[index]}</p> */}
                                  <div id='idle-employee-assignTask'>
                                    <span className='text-left' style={{width:'64%' ,fontSize:'12px'}}>
                                      {e.period ? moment(e.period, "YYYYMMDD").fromNow() : "NA" }
                                    </span>
                                    <GrPowerReset style={{ marginRight: "1vw", fontSize:'17px' }} data-toggle="tooltip" className='AiOutlinePlus' data-placement="top" title="Reset Password" onClick={() => { setShow(true); setId(e._id); setType('user') }} />
                                    <AiOutlineEye className='AiOutlinePlus' onClick={() => { setsecShow(true); setSecId(e._id); }} data-toggle="tooltip" data-placement="top" title="Preview Tasks" style={{ marginRight: '0.9vw' }} />
                                    <MdDisabledByDefault style={{ fontSize: "20px" }} className='AiOutlinePlus' data-toggle="tooltip" data-placement="top" title="Disable Account" onClick={() => { setDisabledAccid(e._id); setFifthshow(true) }} />
                                    {/* <MdDisabledByDefault style={{ fontSize: "20px" }}/> */}
                                    </div>
                                </div>

                              </div>
                            })}
                          </div>
                        )}
                      </>}

                    </div>
                    {/* <div className='col mentorHomescreen-col' data-aos='fade-up' data-aos-delay='200'>
                  <div className='idle-interns-heading'>UPDATES</div>

                  {mentorNotifications && (
                    <div className='internListBoxContainer'>
                      {mentorNotifications.map((e) => {
                        return <div key={count} className='idleIntern-box d-flex align-items-top justify-content-between pl-2 pt-1' id='notification-box'>
                          <div className='notification-heading'><i><b>{e.heading}</b></i></div>
                          <div className='row' style={{ maxWidth: "100%", justifyContent: "space-between" }}>
                            <div className='col-8 notification-message' style={{ fontSize: "14px" }}>
                              {e.message}
                            </div>
                            <div className='col-2' onClick={() => {deleteNotification(e.taskId)}}>
                              <AiOutlineClose />
                            </div>
                          </div>
                        </div>
                      })}
                    </div>
                  )}
                </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SuperuserManageusers