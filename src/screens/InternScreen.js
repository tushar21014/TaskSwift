import React, { useContext, useEffect, useState } from 'react'
import "../css/Internscreen.css"
import { BsList } from "react-icons/bs"
import {IoMdDoneAll} from 'react-icons/io'
import {FiClock} from 'react-icons/fi'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import FirstContext from '../context/firstContext'
import { ToastContainer } from 'react-toastify'

const InternScreen = () => {

  useEffect(() => {
    fetchTasks()
    return () => {
    }
  }, [])

  const [pendingTasks, setPendingTasks] = useState([])
  const [submittedTasks, setSubmittedTasks] = useState([])
  const [overdueTasks, setOverdueTasks] = useState([])
  const [selectedSection, setSelectedSection] = useState("Pending");
  const [singleTask, setSingleTask] = useState([])
  const [show, setShow] = useState(false);
  const [descc, setDescc] = useState('')
  const [id, setId] = useState()
  const [flag, setFlag] = useState('')
  const context = useContext(FirstContext);
  const {calltoast} = context;
  
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
  

  const handlePendingClick = () => {
    setSelectedSection("Pending");
  };

  const handleSubmittedClick = () => {
    setSelectedSection("Submitted");
  };

  const handleOverdueClick = () => {
    setSelectedSection("Overdue");
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);



  const fetchSingleTask = async (id) => {
    try {
      console.log("I am clicked");
      let res = await fetch('http://localhost:5004/api/intern/internGettask', {
        method: "POST",
        body: JSON.stringify({ taskId: id }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      let data = await res.json();
      console.log(data[0]);
      setSingleTask(data[0]);
      setId(id)
    } catch (error) {
      console.error("Error fetching single task:", error);
    }
  }

  const fetchTasks = async () => {
    let res = await fetch('http://localhost:5004/api/intern/internAlltasks', {
      method: "POST",
      credentials: 'include'
    })
    let data = await res.json();
    // setTasks(data.taskss);
    setPendingTasks(data.pendingTasks);
    setSubmittedTasks(data.submittedTasks);
    setOverdueTasks(data.overdueTasks);
    console.log(data);

  }

  const submitTask = async () => {
    console.log(id)
    try {
      const response = await fetch('http://localhost:5004/api/intern/internSubmittask', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskId: id,
          intern_desc: descc
        }),
      });


      if (response.ok) {
        // Handle success here (e.g., show a success message)
        // alert('Task Submitted Successfully');
        calltoast("Task Submitted Successfully","success");
        setDescc('')
        fetchTasks();        
        // window.location.reload();
      } else {
        // Handle failure (e.g., show an error message)
        alert('Failed to assign the task');
      }
    } catch (error) {
      console.error(error);
      // Handle the fetch error here (e.g., show an error message)
    }
  }
  return (
    <div className='internScreen'>
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
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Submit Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <textarea placeholder='Write a brief description of task...' value={descc} required onChange={(e) => setDescc(e.target.value)} className='p-2' style={{ width: "100%", height: "20vh" }}></textarea>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => { submitTask(); handleClose() }}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
      <div className='leftPanel'>
        <div className='row leftPanelRow' style={{borderBottom: "1px solid white", justifyContent:"space-evenly"}}>
          <div className={`col-3 panelHeading ${selectedSection === "Pending" ? "selected" : ""} justify-content-right`} onClick={handlePendingClick}>
            Pending
          </div>
          <div className={`col-3 panelHeading ${selectedSection === "Submitted" ? "selected" : ""}`} onClick={handleSubmittedClick}>
            Submitted
          </div>
          <div className={`col-3 panelHeading ${selectedSection === "Overdue" ? "selected" : ""} justify-content-left`} onClick={handleOverdueClick}>
            Overdue
          </div>
        </div>
        <div className='datess'>

          {selectedSection === "Pending" && (
            pendingTasks.length === 0 ? (
              <div>Wait for your mentor to assign you task</div>
            ) : (
              pendingTasks.map((task) => (
                <div className='leftPanel-Links' onClick={() => { fetchSingleTask(task._id);setFlag('pending') }} style={{ cursor: "pointer", justifyContent: "start", display: "flex", alignItems: "center", width: '100%', borderBottom: "0.5px solid #6b6767", paddingBottom: "10px", paddingTop:"22px" }} key={task._id}><BsList className='mr-4' />{formatDate(task.assigned_on)}</div>
              ))
            )
          )}

          {selectedSection === "Submitted" && (
            submittedTasks.length === 0 ? (
              <div>There are no submissions yet.</div>
            ) : (
              submittedTasks.slice().reverse().map((task) => (
                <div className='leftPanel-Links' onClick={() => { fetchSingleTask(task._id);setFlag('submitted') }} style={{ cursor: "pointer", justifyContent: "start", display: "flex", alignItems: "center", width: '100%', borderBottom: "0.5px solid #6b6767", paddingBottom: "10px", paddingTop:"22px" }} key={task._id}><IoMdDoneAll className='mr-4' />{formatDate(task.submission_on)}</div>
              ))
            )
          )}

          {selectedSection === "Overdue" && (
            overdueTasks.length === 0 ? (
              <div>There are no overdue tasks.</div>
            ) : (
              overdueTasks.map((task) => (
                <div className='leftPanel-Links' onClick={() => { fetchSingleTask(task._id);setFlag('pending') }} style={{ cursor: "pointer", justifyContent: "start", display: "flex", alignItems: "center", width: '100%', borderBottom: "0.5px solid #6b6767", paddingBottom: "10px", paddingTop:"22px" }} key={task._id}><FiClock className='mr-4' />{formatDate(task.assigned_on)}</div>
              ))
            )
          )}
        </div>
      </div>
      <div className='rightPanel'>
        <div className={`rightPanelContainer container ${flag==='pending'?"":"d-none"}`}>
          <div className={`taskDetails h1 text-center `} >Task Details</div>

          <div className='taskContainer'>
            <span id='taskDesccc'>
              {singleTask.task_description}
            </span>


          </div>
          <div className='row d-flex align-items-center'>
            <div className={`col dedline my-4 ${(flag === 'pending') ? "" :'d-none'}`}>
              Deadline:
              {formatDate(singleTask.submission_by)}
              {/* {singleTask.submission_by} */}
            </div>
            <div className='col my-4 d-flex justify-content-end align-items-center'>
              <button type="button" className="btn btn-warning" onClick={handleShow}>Submit Task</button>
            </div>
          </div>
        </div>
        <div className={`rightPanelContainer container ${flag==='submitted'?"":"d-none"}`}>
          <div className={`taskDetails h1 text-center `} >Task Details</div>

          <div className='taskContainer'>
            <span id='taskDesccc'>
              {singleTask.task_description}
            </span>
          </div>

          <div className='row d-flex align-items-center'>
            <div className={`col dedline my-4 ${flag === 'submitted' ? "" :'d-none'}`}>
              Deadline:
              {formatDate(singleTask.submission_by)}
              {/* {singleTask.submission_by} */}
            </div>
            <div className='col my-4 d-flex justify-content-end align-items-center'>
              Your Submission: {formatDate(singleTask.submission_on)}
            </div>
          </div>
          <div className='taskContainer'>
            <span id='taskDesccc'>
              {singleTask.intern_submission_desc}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InternScreen