import React, { useContext, useEffect, useState } from 'react'
import '../css/Signup.css'
import "react-toastify/dist/ReactToastify.css" 
import FirstContext from '../context/firstContext'
import { ToastContainer } from 'react-toastify'

const Signup = () => {
    const [credentials, setCredentials] = useState({ salutation: "", first_name: "", middle_name: "", last_name: "", college: "", email: "", phone: "", e_rollno: "", address1: "", address2: "", city: "", zipCode: "", state: "", year: "", sem: "", course: "", working_field: "", specialization: "",internshipPeriod:"", starting_date:"" });
    const [files, setFiles] = useState({
        file: null
    });
    useEffect(() => {
        fetchFields()
        
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
    const context = useContext(FirstContext);
    const { calltoast } = context;
    const handleFileUpload = (e) => {
        setFiles(e.target.files[0]);
    };

    
  const handleDateChange = (e) => {
    const selectedDateString = e.target.value;
    const selectedDate = new Date(selectedDateString);

    if (selectedDate < credentials.starting_date) {
      // Display an error message or prevent further action
      alert('Please select a date that is not in the past.');
    } else {
      setCredentials({ ...credentials, [e.target.name]: e.target.value })

      console.log(selectedDate)
    }
  };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('salutation', credentials.salutation)
        formData.append('first_name', credentials.first_name)
        formData.append('middle_name', credentials.middle_name)
        formData.append('last_name', credentials.last_name)
        formData.append('email', credentials.email)
        formData.append('phone', credentials.phone)
        formData.append('e_rollno', credentials.e_rollno)
        formData.append('college', credentials.college)
        formData.append('address1', credentials.address1)
        formData.append('address2', credentials.address2)
        formData.append('city', credentials.city)
        formData.append('zipCode', credentials.zipCode)
        formData.append('state', credentials.state)
        formData.append('year', credentials.year)
        formData.append('sem', credentials.sem)
        formData.append('course', credentials.course)
        formData.append('working_field', credentials.working_field)
        formData.append('specialization', credentials.specialization)
        formData.append('internshipPeriod', credentials.internshipPeriod)
        formData.append('starting_period',credentials.starting_date)
        formData.append('uploadedResume', files)
        try {
            const response = await fetch("http://localhost:5004/api/auth/createuser", {
                method: 'POST',
                body: formData
            });

            const json = await response.json();
            console.log(json);

            if (!json.submit) {
                // setAlert({color:"danger", message:"Title cannot be same"})
                // alert('Title cannot be same ')
            }
            
            if (!json.success) {
                // setAlert({color:"danger", message:"Form Not Submitted"})
                console.log("Form not submitted")
                calltoast("Signup error", "error")
            }
            else {
                // setAlert({color:"success", message:"Form Submitted Successfully"})
                // alert("Form Submitted Successfully")
                console.log("Form Submitted Successfully")
                calltoast("Request Submitted!! Form under review", "success")
            }


        } catch (error) {
            console.log(error);
        }
    }


    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }
    return (
        <div id='signup-grandfather-cont'>
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
            <div className='father-cont' id='father-cont'>
                <div className='heading text-center'><h1>Registration</h1></div>
                <form method="post" onSubmit={handleSubmit}>
                    <div className="row mt-3 pl-4 pr-4">
                        <div className="col-3">
                            <label htmlFor="Salutation">Salutation</label>
                            <select className="form-control width-[10px]" id="Salutation" aria-describedby="Salutation" name="salutation" onChange={handleChange} value={credentials.salutation} placeholder="Select Salutation">
                                <option value="">Select Salutation</option>
                                <option value="Mr.">Mr.</option>
                                <option value="Mrs.">Mrs.</option>
                                <option value="Ms">Ms</option>
                                <option value="Prof.">Prof.</option>
                                <option value="Dr.">Dr.</option>
                            </select>
                        </div>
                        <div className="col">
                            <label htmlFor="first_name">First Name</label>
                            <input type="text" className="form-control" id="first_name" aria-describedby="first_name" name="first_name" onChange={handleChange} value={credentials.first_name} placeholder="Enter Name"
                            />
                        </div>
                        <div className="col">
                            <label htmlFor="middle_name">Middle Name</label>
                            <input type="text" className="form-control" id="middle_name" aria-describedby="middle_name" name="middle_name" onChange={handleChange} value={credentials.middle_name} placeholder="Optional"
                            />
                        </div>
                        <div className="col">
                            <label htmlFor="last_name">Last Name</label>
                            <input type="text" className="form-control" id="last_name" aria-describedby="last_name" name="last_name" onChange={handleChange} value={credentials.last_name} placeholder="Optional" />
                        </div>
                    </div>
                    <div className="form-group email-group">
                        <div className='row pl-4 mt-4 pr-4'>
                            <div className='col'>
                                <label htmlFor="exampleInputEmail1">Email address</label>
                                <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" required name='email' onChange={handleChange} value={credentials.email} placeholder="Enter email" />
                            </div>
                            <div className="col">
                                <label htmlFor="exampleInputPassword1">Phone</label>
                                <input type="number" className="form-control" id="phone" name='phone' placeholder="Mobile Number" onChange={handleChange} value={credentials.phone} required maxLength={10} />
                            </div>
                        </div>
                    </div>
                    <hr className="hr-text " data-content="COLLEGE DETAILS" />
                    <div className="form-group college-first-group">
                        <div className='row pl-4 mt-4 pr-4'>
                            <div className='col-2'>
                                <label htmlFor="exampleInputEmail1">Enrollment No.</label>
                                <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" required name='e_rollno' onChange={handleChange} value={credentials.e_rollno} placeholder="Enrollment Number" />
                            </div>
                            <div className='col-4'>
                                <label htmlFor="exampleInputEmail1">College</label>
                                <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" required name='college' onChange={handleChange} value={credentials.college} placeholder="Enter College Name" />
                            </div>
                            <div className="col">
                                <label htmlFor="exampleInputPassword1">Postal Code</label>
                                <input type="number" className="form-control" id="zipCode" name='zipCode' placeholder="Zip Code" onChange={handleChange} value={credentials.zipCode} required maxLength={10} />
                            </div>
                            <div className="col">
                                <label htmlFor="exampleInputPassword1">State</label>
                                <input type="text" className="form-control" id="city" name='state' placeholder="Enter State" onChange={handleChange} value={credentials.state} required />
                            </div>
                        </div>
                    </div>

                    <div className="form-group college-second-group">
                        <div className='row pl-4 mt-4 pr-4'>
                            <div className='col-6'>
                                <label htmlFor="exampleInputEmail1">Address 1</label>
                                <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" required name='address1' onChange={handleChange} value={credentials.address1} placeholder="College Address" />
                            </div>
                            <div className='col-6'>
                                <label htmlFor="exampleInputEmail1">Address 2</label>
                                <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" required name='address2' onChange={handleChange} value={credentials.address2} placeholder="College Address" />
                            </div>
                        </div>
                    </div>
                    <div className='row pl-4 mt-4 pr-4'>
                        <div className="col">
                            <label htmlFor="exampleInputPassword1">Year</label>
                            <select className="form-control" id="Salutation" aria-describedby="Salutation" name="year" onChange={handleChange} value={credentials.year} placeholder="Select Year">
                                <option value="">Select Year</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                {/* <option value="Dr.">Dr.</option> */}
                            </select>
                        </div>
                        <div className="col">
                            <label htmlFor="exampleInputPassword1">Semester</label>
                            <select className="form-control" id="sem" aria-describedby="sem" name="sem" onChange={handleChange} value={credentials.sem} placeholder="Select Semester">
                                <option value="">Select Semester</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                {/* <option value="Dr.">Dr.</option> */}
                            </select>
                        </div>

                        <div className="col">
                            <label htmlFor="exampleInputPassword1">Course</label>
                            <select className="form-control" id="course" aria-describedby="Salutation" name="course" onChange={handleChange} value={credentials.course} placeholder="Select course">
                                <option value="">Course</option>
                                <option value="BTECH">BTECH</option>
                                <option value="BCA">BCA</option>
                                <option value="BBA">BBA</option>
                                {/* <option value="BCOM">BCOM</option> */}
                                <option value="MBA">MBA</option>
                                <option value="MCA">MCA</option>
                            </select>
                        </div>
                        <div className="col">
                            <label htmlFor="exampleInputPassword1">Fields</label>
                            <select className="form-control" id="working_field" aria-describedby="working_field" name="working_field" onChange={handleChange} value={credentials.working_field} placeholder="Select Tech Field">
                                {fields.map((e,index) => {
                                    return <option value={e} key={index}>
                                        {e}
                                    </option>
                                })}
                            </select>
                        </div>
                        <div className="col">
                            <label htmlFor="exampleInputPassword1">Techonology</label>
                            <select className="form-control" id="specialization" aria-describedby="specialization" name="specialization" onChange={handleChange} value={credentials.specialization} placeholder="Select Specialization">
                                <option value="">Techonology</option>
                                <option value="BTECH">MERN</option>
                                <option value="BCA">NEXT</option>
                                <option value="BBA">ANGULAR</option>
                            </select>
                        </div>  
                        <div className="col">
                            <label htmlFor="exampleInputPassword1">Internship Period</label>
                            <select className="form-control" id="Salutation" aria-describedby="Salutation" name="internshipPeriod" onChange={handleChange} value={credentials.internshipPeriod} placeholder="Select Duration">
                                <option value="">Select Duration</option>
                                <option value="1">1 month</option>
                                <option value="2">2 months</option>
                                <option value="3">3 months</option>
                                <option value="4">4 months</option>
                                {/* <option value="Dr.">Dr.</option> */}
                            </select>
                        </div>
                        <div className="col">
                            <label htmlFor="exampleInputPassword1">Preferred Date</label>
                            <input type='date' value={credentials.starting_date} onChange={handleDateChange} required name='starting_date' />

                        </div>

                    </div>
                    <div className='row pl-4 mt-4 pr-4   '>
                        <div className="col ">
                            <label htmlFor="exampleFormControlFile1">Upload Resume </label>
                            <input type="file" accept='.pdf' encType="multipart/form-data" required className="form-control-file" id="exampleFormControlFile1" name='uploadedResume' onChange={handleFileUpload}
                            />
                        </div>
                        <div className="col h-10 d-flex justify-content-center align-items-center">
                            <button type="primary" className="btn btn-primary">Submit</button>
                        </div>
                    </div>
                    <div className='row pl-4 mt-4 pr-4'>
                    </div>


                </form>
            </div>
        </div>
    )
}

export default Signup