import React, { useContext, useEffect, useState } from 'react'
import '../css/MentorScreen.css'
import { CgProfile } from 'react-icons/cg'
import { AiOutlinePlus, AiOutlineClose, AiOutlineEye, AiFillDelete } from 'react-icons/ai'
import { BiSolidTrashAlt } from 'react-icons/bi'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import FirstContext from '../context/firstContext'
import 'aos/dist/aos.css';
import AOS from 'aos';
import LeftPanel from '../components/LeftPanel'

const MentorHomescreen = () => {
  const context = useContext(FirstContext);
  const { calltoast } = context;
  const [idleInterns, setIdleInterns] = useState([]);
  const [busyInterns, setBusyInterns] = useState([])
  const [tasks, setTasks] = useState([])
  const [calculateDays, setCalculateDays] = useState([])
  const [todoList, setTodoList] = useState([]);
  const [mentorNotifications, setMentorNotifications] = useState([])
  const [show, setShow] = useState(false);  // Assign new task modal
  const [secshow, setsecShow] = useState(false);  // Preview task modal
  const [thirdShow, setThirdShow] = useState(false);  //create to do list modal
  const [forthShow, setForthshow] = useState(false);  // preview to do list modal
  const [fifthShow, setFifthshow] = useState(false);  //  to disablel acc
  const [totalIdlePendingTasks, setTotalIdlePendingTasks] = useState([])
  const [totalBusyPendingTasks, setTotalBusyPendingTasks] = useState([])
  const [tempName, setTempName] = useState('')

  const [secId, setSecId] = useState()
  const [temPid, setTemPid] = useState('')
  const [disabledAccid, setDisabledAccid] = useState('')
  const [selectedDate, setSelectedDate] = useState('');
  const [descc, setDescc] = useState('');
  const [reviewNote, setReviewNote] = useState('');
  const [filteredArray, setFilteredArray] = useState(null);

  const mentorURL = "http://localhost:5004/api/mentor"
  const currentDate = new Date();
  var count = 1;


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

  function calculateDateDifference(submissionByDate) {
    const currentDate = new Date(); // Get the current date and time
    const submissionBy = new Date(submissionByDate); // Convert the submission_by date to a Date object

    // Calculate the difference in milliseconds
    const differenceInMilliseconds = submissionBy - currentDate;

    // Calculate the difference in days by dividing the milliseconds difference by (1000 milliseconds * 60 seconds * 60 minutes * 24 hours)
    const differenceInDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));

    return differenceInDays;
  }

  useEffect(() => {
    // fetchPendingTasks(idleInterns.userr)
    AOS.init({ duration: 1000, });
    fetchIdleinterns();
    fetchTodolist();
    fetchPendingidleTasks();
    fetchPendingbusyTasks();
    fetchInternUpdates();
    document.getElementById('sideMenu-button').click();

  }, [])

  useEffect(() => {
    
    // Call fetchTasks when secId changes
    if (secId) {
      fetchTasks();
    }
  }, [secId]);


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handlesecClose = () => setsecShow(false);
  const handlethirdClose = () => setThirdShow(false);
  const handleforthClose = () => setForthshow(false);
  const handlefifthClose = () => setFifthshow(false);

  const handleDateChange = (e) => {
    const selectedDateString = e.target.value;
    const selectedDate = new Date(selectedDateString);

    if (selectedDate < currentDate) {
      // Display an error message or prevent further action
      alert('Please select a date that is not in the past.');
    } else {
      setSelectedDate(selectedDateString);
      console.log(selectedDate)
    }
  };

  const handleAssigningTask = async (descr) => {
    const pdesc = descr;
    setDescc(pdesc);
    handleforthClose();
    await assigningTask();
    updateTodoList();

  }

  const updateInternstatus = async () => {
    try {

    } catch (error) {
      console.log(error);
    }
  }

  const assigningTask = async () => {
    console.log("ASIGNING: ", descc ? descc : "Empty")
    try {
      console.log(descc)
      if (!descc) {
        calltoast("Task description is required", "error");
        return;
      }

      const response = await fetch('http://localhost:5004/api/mentor/mentorassignTask', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deadline: selectedDate, task_desc: descc, tempid: temPid }),
      });

      if (response.ok) {
        calltoast("Task assigned successfully", "success");
        // setDescc('');
        setSelectedDate('');
        setTemPid('');
        fetchIdleinterns();
        // setTemPid('');
      } else {
        calltoast("Failed to assign the task", "error");
      }
    } catch (error) {
      console.error(error);
    }
  };


  const fetchInternUpdates = async() => {
    const response = await fetch(`${mentorURL}/mentorFreeuser`,{
      method:"GET",
      credentials:'include'
    })
    if(response.ok)
    {
      console.log('successfully');
    }
    else{
      console.log('error');
    }
  }
  const fetchIdleinterns = async () => {
    try {
      const response = await fetch(`${mentorURL}/mentorGetidleinterns`, {
        method: "POST",
        credentials: 'include'
      });

      const data = await response.json();
      setIdleInterns(data.idleresponse);
      setBusyInterns(data.engagedresponse);
      setMentorNotifications(data.mentorNotification['notifications'])
      console.log(data.mentorNotification['notifications']);

      // fetchLasttask(data.engagedresponse);
    } catch (error) {
      console.log(error);
    }
  }

  const disableAcc = async (id) => {
    try {

      const response = await fetch(`${mentorURL}/mentorDisableinternacc`, {
        method: "PUT",
        credentials: 'include',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({ userId: id })
      });
      if (response.ok) {
        const updatedInterns = idleInterns.filter((e) => e._id !== disabledAccid);
        setIdleInterns(updatedInterns);
        calltoast("Account disabled Successfully", 'success');
        console.log("Accound disabled");
      }
      else {
        console.error();
      }
    } catch (error) {
      console.log(error);
    }
  }

  const createTodotask = async () => {
    try {
      let response = await fetch(`${mentorURL}/mentorCreatetodolist`, {
        method: "POST",
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task_descc: descc,
          mentor_remarks: reviewNote
        })
      })
      if (response.ok) {
        calltoast("Task created successfully", "success")
        // setDescc('');
        setReviewNote('')
        // setTodoList([...todoList, { task_description: descc, remarks: reviewNote }]);
        fetchTodolist();
      }
    } catch (error) {
      console.log(error);
    }
  }


  const fetchTasks = async () => {
    try {
      // console.log("Frontend ", secId)
      let res = await fetch('http://localhost:5004/api/mentor/mentorFetchtask', {
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

  const deleteNotification = async (id) => {
    try {
      const response = await fetch(`${mentorURL}/mentorDeleteNotification`, {
        method: "PUT",
        headers: {
          "content-type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ task_id: id })
      })
      if (response.ok) {
        console.log("Ho gya delete");
        const updatedNoti = mentorNotifications.filter((e) => e.taskId !== id);
        setMentorNotifications(updatedNoti)
      }

    } catch (error) {
      console.log(error)
    }
  }

  const updateTodoList = async () => {
    try {
      let response = await fetch(`${mentorURL}/mentorUpdateTodolist`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task_id: filteredArray[0]._id })
      })
      if (response.ok) {
        console.log("Task updated");
        const updatedTodoList = todoList.filter((task) => task._id !== filteredArray[0]._id);
        setTodoList(updatedTodoList);
        setReviewNote('')
      }
    } catch (error) {
      console.log(error);
    }
  }

  const DeleteTodoList = async () => {
    if (!filteredArray) {
      console.log("filteredArray is null or undefined");
    }
    console.log("I am filtered array", filteredArray)

    try {
      let response = await fetch(`${mentorURL}/mentorDeletetodolisttask`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task_id: filteredArray[0]._id })
      })

      if (response.ok) {

        console.log("Task Deleted");
        const updatedTodoList = todoList.filter((task) => task._id !== filteredArray[0]._id);
        setTodoList(updatedTodoList);
        calltoast("Task Deleted", "success")
      }
    } catch (error) {
      console.log(error);
    }
  }


  const fetchTodolist = async () => {
    try {
      // console.log("Frontend ", secId)
      let res = await fetch(`${mentorURL}/mentorGettodolist`, {
        method: "POST",
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const data = await res.json();
        console.log("I am to do list ", data);
        setTodoList(data);
      } else {
        // Handle the case where the response is not okay (e.g., show an error message)
        console.error('Failed to fetch to do tasks');
      }
    } catch (error) {
      console.error(error);
      // Handle the fetch error here (e.g., show an error message)
    }
  }

  const fetchPendingidleTasks = async () => {
    try {
      let res = await fetch(`${mentorURL}/fetchTotalIdlePending`, {
        method: "GET",
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (res.ok) {
        const data = await res.json();
        console.log("idle Pending tasks ", data);
        setTotalIdlePendingTasks(data.totalPending)
      } else {
        console.error('Failed to fetch to do tasks');
      }
    } catch (error) {
      console.error(error);
    }
  }
  const fetchPendingbusyTasks = async () => {
    try {
      let res = await fetch(`${mentorURL}/fetchTotalBusyPending`, {
        method: "GET",
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Busy Pending tasks ", data);
        setTotalBusyPendingTasks(data.totalPending)
      } else {
        console.error('Failed to fetch to do tasks');
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
      <div>
        {/* <Naviagtion /> */}
      </div>

      <Modal show={show} onHide={handleClose} backdrop="static">
        <Modal.Header style={{ flexDirection: "row-reverse" }} > <span className='btn-close' onClick={handleClose}><AiOutlineClose /></span>
          <Modal.Title>Assign New Task #</Modal.Title>
        </Modal.Header>
        <Modal.Body><form>
          {/* <span className='m-1'>Description</span> */}
          <textarea placeholder='Write a brief description of task...' value={descc} required onChange={(e) => setDescc(e.target.value)} className='p-2' style={{ width: "100%", height: "20vh" }}></textarea>
          Submission by: <input type='date' value={selectedDate} onChange={handleDateChange} required min={currentDate.toISOString().split('T')[0]} />
        </form>
          {/* {console.log(temPid)} */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => { handleClose(); assigningTask() }}>
            Assign
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
          <Modal.Title>Create To Do Task</Modal.Title>
        </Modal.Header>
        <form onSubmit={createTodotask}>
          <Modal.Body>
            <textarea placeholder='Write a brief description of task...' value={descc} required onChange={(e) => setDescc(e.target.value)} className='p-2' style={{ width: "100%", minHeight: "20vh" }}></textarea>
            <textarea placeholder='Create a review note ... ' value={reviewNote} required onChange={(e) => setReviewNote(e.target.value)} className='p-2' style={{ width: "100%", minHeight: "10vh" }}></textarea>
          </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => { handlethirdClose() }}>
            Close
          </Button>
          <Button variant="warning" onClick={() => { createTodotask(); handlethirdClose(); }}>
            Create
          </Button>
        </Modal.Footer>
        </form>
      </Modal>

      <Modal show={forthShow} onHide={handleforthClose}>
        <Modal.Header style={{ flexDirection: "row-reverse" }} > <span className='btn-close' onClick={handleforthClose}><AiOutlineClose /></span>
          <Modal.Title>To Do Task</Modal.Title>
        </Modal.Header>
        <Modal.Body className='container'>
          <div className='text-center h3 m-2'>Task Details</div>
          {filteredArray && (
            <div className='container'>

              <textarea disabled value={filteredArray[0].task_description} className='p-2' style={{ width: "100%", minHeight: "20vh" }}></textarea>
              <textarea disabled value={filteredArray[0].remarks} className='p-2' style={{ width: "100%", minHeight: "10vh" }}></textarea>

              <div>
                {/* <div className='text-center h3 mt-4'>Assign To</div> */}

                <div >
                  <div className="dropdown assignTo-part my-4">
                    <button className="btn btn-secondary dropdown-toggle" value={temPid} type="button" data-toggle="dropdown" aria-expanded="false">
                      {tempName ? tempName : "Select Interns"}
                    </button>
                    <div className="dropdown-menu">
                      {idleInterns.map((e) => {
                        return <div key={e._id}>
                          <div className='dropdown-item' onClick={() => { setTemPid(e._id); setTempName(e.first_name) }} >{e.first_name}</div>
                        </div>
                      })}
                    </div>
                    <div>
                      <form>
                        Submission by: <input type='date' value={selectedDate} onChange={handleDateChange} required min={currentDate.toISOString().split('T')[0]} />
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => { handleforthClose() }}>
            Close
          </Button>
          <Button variant="warning" onClick={() => handleAssigningTask(filteredArray[0].task_description)}>
            Assign Task
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

      <div>

        <LeftPanel />

        <div className={`mentorHomescreen-grandFather-container `} id='mentorHomeScreen-rightPanel'>
          <div className='mentorHomescreen-fatherContainer'>
            <div className='mentorHomeScreen-topbar-father-container'>

              <div className='mentorHomeScreen-topbar' style={{ minHeight: "20vh" }}>
                <div className='dashboardTitle' id='dashboardTitle'>
                  <h1>Dashboard</h1>
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
                  <div className='col mentorHomescreen-col' data-aos='fade-up'>
                    <div className='idle-interns-heading'>TO DO LIST ({todoList.length})</div>
                    <div className='idleIntern-box d-flex justify-content-center align-items-center' onClick={() => { setThirdShow(true); }}>
                      
                      <AiOutlinePlus />
                    </div>

                    {todoList && (
                      <div className='internListBoxContainer'>
                        {todoList.map((e) => {
                          return <div key={e._id} className='idleIntern-box d-flex align-items-center' style={{ justifyContent: "space-between" }}>
                            <div id='idle-employee-name' onClick={() => { setFilteredArray(todoList.filter((item) => item._id === e._id)); setForthshow(true); }} style={{ width: '100%' }}>{e.remarks}</div>
                            <span className='removeTodoTask' onClick={async () => { setFilteredArray(todoList.filter((item) => item._id === e._id)); await DeleteTodoList(); }} style={{ marginRight: "15px" }}><BiSolidTrashAlt /></span>
                          </div>
                        })}
                      </div>
                    )}
                  </div>
                  <div className='col mentorHomescreen-col' data-aos='fade-up' data-aos-delay='50'>
                    <div className='idle-interns-heading'>IDLE INTERNS ({idleInterns.length})</div>
                    {busyInterns.length === 0 ? <>
                      <div className='pl-3'>No Idle interns</div>
                    </> : <>
                    {/* </>} */}
                    {idleInterns && (
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

                        {idleInterns.map((e,index) => {
                          return <div key={e._id} className='idleIntern-box'>
                            <div id='idle-employee-profile-pic'><span><CgProfile /></span></div>
                            <div id='idle-employee-right-part' style={{position:'relative'}}>
                            <span className="badge badge-danger" data-toggle="tooltip" data-placement="top" title="Pending Tasks" style={{position:'absolute',right:'-10%', top: "-2%"}}>
                                {totalIdlePendingTasks? totalIdlePendingTasks[index] : "NA"}
                              </span>
                              <div id='idle-employee-name'>{e.first_name} {e.last_name}</div>
                              <div id='idle-employee-college'><p>{e.college}</p></div>
                              <div id='idle-employee-assignTask'><AiOutlinePlus data-toggle="tooltip" data-placement="top" title="Assign Task"
                                onClick={() => { handleShow(); setTemPid(e._id); }} className='AiOutlinePlus' />
                                <AiFillDelete style={{ marginLeft: '1vw',fontSize:'18px' }} className='AiOutlinePlus'  onClick={() => { setDisabledAccid(e._id); setFifthshow(true) }} data-toggle="tooltip" data-placement="top" title="Disable Account" /></div>
                            </div>

                          </div>
                        })}
                      </div>
                    )}
                    </>}
                  </div>
                  <div className='col mentorHomescreen-col' data-aos='fade-up' data-aos-delay='150'>
                    <div className='idle-interns-heading'>BUSY INTERNS ({busyInterns.length})</div>
                    {busyInterns.length === 0 ? <>
                      <div className='pl-3'>No Busy interns</div>
                    </> : <>
                      {busyInterns && calculateDays && (
                        <div className='internListBoxContainer'>
                          {busyInterns.map((e, index) => {
                            return <div key={e._id} className='idleIntern-box'>
                              
                              <div id='idle-employee-profile-pic'><span><CgProfile /></span></div>
                              <div id='idle-employee-right-part'
                              style={{
                                position: "relative"
                              }}
                              >
                              <span className="badge badge-danger" data-toggle="tooltip" data-placement="top" title="Pending Tasks" style={{position:'absolute',right:'-14%', top: "-2%"}}>
                                {totalBusyPendingTasks? totalBusyPendingTasks[index] : "NA"}
                              </span>
                                <div id='idle-employee-name'>{e.first_name} {e.last_name}</div>
                                <div id='idle-employee-college'><p>{e.college}</p></div>
                                {/* {console.log} */}
                                {/* {calculateDateDifference("2023-09-01T00:00:00.000Z")} */}
                                {/* <p>{calculateDays[index]}</p> */}
                                <div id='idle-employee-assignTask'><AiOutlineEye onClick={() => { setsecShow(true); setSecId(e._id); }} className='AiOutlinePlus' data-toggle="tooltip" data-placement="top" title="Preview Taska" /></div>
                              </div>

                            </div>
                          })}
                        </div>
                      )}
                    </>}

                  </div>
                  <div className='col mentorHomescreen-col' data-aos='fade-up' data-aos-delay='200'>
                    <div className='idle-interns-heading'>UPDATES ({mentorNotifications.length})</div>

                    {mentorNotifications && (
                      <div className='internListBoxContainer'>
                        {mentorNotifications.map((e) => {
                          return <div key={count} className='idleIntern-box d-flex align-items-top justify-content-between pl-2 pt-1' id='notification-box'>
                            <div className='notification-heading'><i><b>{e.heading}</b></i></div>
                            <div className='row' style={{ maxWidth: "100%", justifyContent: "space-between" }}>
                              <div className='col-8 notification-message' style={{ fontSize: "14px" }}>
                                {e.message}
                              </div>
                              <div className='col-2' onClick={() => { deleteNotification(e.taskId) }}>
                                <AiOutlineClose />
                              </div>
                            </div>
                          </div>
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default MentorHomescreen