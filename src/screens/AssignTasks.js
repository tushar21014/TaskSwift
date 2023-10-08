import React, { useContext, useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { AiOutlineClose } from 'react-icons/ai'
import LeftPanel from '../components/LeftPanel';
import '../css/MentorScreen.css'
import { ToastContainer } from 'react-toastify'
import FirstContext from '../context/firstContext'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { MdOutlineUpdateDisabled } from 'react-icons/md'

const AssignTasks = () => {
  const [show, setShow] = useState(false);
  const [secshow, setsecShow] = useState(false);
  const [thirdShow, setThirdShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [temPid, setTemPid] = useState('')
  const [thirdId, setThirdId] = useState('')
  const [secId, setSecId] = useState()
  const currentDate = new Date();
  const [internsList, setInternsList] = useState([])
  const [descc, setDescc] = useState('')
  const [tasks, setTasks] = useState([])
  var count = 1;
  const context = useContext(FirstContext)
  const { calltoast } = context


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



  useEffect(() => {
    // Call fetchTasks when secId changes
    if (secId) {
      fetchTasks();
    }
  }, [secId]);

  useEffect(() => {
    fetchInterns();
    document.getElementById('sideMenu-button').click();
    return () => {
    }
  }, [])

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

  const handleClose = () => setShow(false);
  const handlesecClose = () => setsecShow(false);
  const handlethirdClose = () => setThirdShow(false);
  const handleShow = () => setShow(true);
  const fetchInterns = async () => {
    try {
      let res = await fetch('http://localhost:5004/api/mentor/finalInterns', {
        method: "POST",
        credentials: 'include'
      })
      const data = await res.json();
      console.log(data.user)
      setInternsList(data.user)

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

  const disableAcc = async () => {
    try {
      const res = await fetch('http://localhost:5004/api/superuser/superuserDisableacc', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userid: thirdId }) // Assuming thirdId is a valid userId
      });
      if (res.ok) {
        console.log("Account Disabled Successfully");
        calltoast("Account disabled!", 'success');
        const updatedList = internsList.filter((e) => e._id != thirdId);
        setInternsList(updatedList);
      } else {
        console.error("Error disabling account");
        calltoast('Error', 'error');
      }
    } catch (error) {
      console.error(error);
      calltoast('Error', 'error');
    }
  }

  const assigningTask = async () => {
    try {
      const response = await fetch('http://localhost:5004/api/mentor/mentorassignTask', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deadline: selectedDate, // Assuming selectedDate is a valid date string or Date object
          task_desc: descc,
          tempid: temPid,
        }),
      });

      if (response.ok) {
        // Handle success here (e.g., show a success message)
        calltoast("Task assigned Successfully", "success");
        setDescc('');
        setSelectedDate('');
        fetchInterns();
      } else {

        // alert('Failed to assign the task');
        calltoast("Failed to assign the task", "error");
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='assignTask-grandfather-container'>
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
      <LeftPanel />

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
          <Modal.Title>Disable Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to disable user account?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handlethirdClose}>
            Close
          </Button>
          <Button variant="danger" onClick={() => { handlethirdClose(); disableAcc(); }}>
            Disable
          </Button>
        </Modal.Footer>
      </Modal>

      <div className='mentorAssignTask-grandfather-container' id='mentorHomeScreen-rightPanel'>

        <div className="container assignTaskRow">
          <div className="row" style={{ width: '100%', overflowY: "scroll", height: '97vh' }}>
            {internsList.map((e) => (
              <div key={e._id} className="col-lg-4 col-4 col-md-6 mb-4">
                <div className="card" style={{ width: "18rem" }}>
                  <span className='threeDots' style={{ position: 'absolute', right: '1vw', top: '1vh' }}>
                    <BsThreeDotsVertical className='dropdown-toggle' data-toggle='dropdown' />
                    <div className="dropdown-menu">
                      <div className="dropdown-item" style={{ color: "red", cursor:'pointer' }} onClick={() => { setThirdShow(true); setThirdId(e._id) }}><MdOutlineUpdateDisabled  /> Disable Account</div>
                    </div>
                  </span>
                  <div
                    className="imageContainer"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src="https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="
                      className="card-img-top"
                      style={{
                        borderRadius: "25px",
                        width: "30%",
                        height: "11vh",
                      }}
                      alt="..."
                    />
                  </div>
                  <div className="card-body">
                    <h5 className="card-title text-center">{e.first_name}</h5>
                    <h6 className="card-title text-center">Intern</h6>
                    <p className="card-text text-center">{e.specialization}</p>
                    <div
                      className="btnContainer"
                      style={{ display: "flex", justifyContent: "space-around" }}
                    >
                      {!e.isFree ? (
                        <button disabled className="btn btn-warning">
                          Assign Task
                        </button>
                      ) : (
                        <div
                          onClick={() => {
                            handleShow();
                            setTemPid(e._id);
                          }}
                          className="btn btn-warning"
                        >
                          Assign Task
                        </div>
                      )}
                      <div
                        className="btn btn-primary"
                        onClick={() => {
                          setsecShow(true);
                          setSecId(e._id);
                          console.log(e._id);
                        }}
                      >
                        Preview Tasks
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AssignTasks