import React, { useContext, useEffect, useState } from 'react'
import LeftPanel from '../components/LeftPanel'
import { AiOutlineInfoCircle } from 'react-icons/ai'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import FirstContext from '../context/firstContext'
import 'aos/dist/aos.css';
import AOS from 'aos';
const SuperuserDepartment = () => {
    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
        console.log(credentials)
    }
    useEffect(() => {
        AOS.init({ duration: 1000 });
    }, [])
    
    const context = useContext(FirstContext);
    const { calltoast } = context;
    const [credentials, setCredentials] = useState({ salutation: "", first_name: "", middle_name: "", last_name: "", email: "", phone: "", address1: "", address2: "", city: "", zipCode: "", state: "", working_field: "", specialization: '', pass: '' });
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5004/api/auth/creatementor", {
                method: 'POST',
                headers:{
                    'content-type':'application/json'
                },
                body: JSON.stringify({credentials})
            });

            const json = await response.json();
            console.log(json);

            if (!json.success) {
                // setAlert({color:"danger", message:"Form Not Submitted"})
                console.log("Form not submitted")
                calltoast("Signup error", "error")
            }
            else {
                // setAlert({color:"success", message:"Form Submitted Successfully"})
                // alert("Form Submitted Successfully")
                console.log("Form Submitted Successfully")
                calltoast("Signed up successfully", "success")
            }


        } catch (error) {
            console.log(error);
        }

    }
    return (
        <div>
            <LeftPanel />

            <div className={`mentorHomescreen-grandFather-container`} id='mentorHomeScreen-rightPanel'>
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
                <div className='formDepartmentContainer' style={{ padding: '5vh' }} data-aos="zoom-in">
                <div className='heading text-center'><h2>Create New Department</h2></div>
                    <form method="post" style={{ width: '75vw', margin: 'auto' }} onSubmit={handleSubmit} >
                        <hr className="hr-text " data-content='Mentor Details' />

                        <div className="row pl-4 mt-4 pr-4">
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
                                <div className="col">
                                    <label htmlFor="exampleInputPassword1">Password</label>
                                    <input type="password" className="form-control" id="pass" name='pass' placeholder="Create a password" onChange={handleChange} value={credentials.pass} required minLength={8} />
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
                                    <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" name='address2' onChange={handleChange} value={credentials.address2} placeholder="College Address" />
                                </div>
                            </div>
                        </div>
                        <div className="form-group college-first-group">
                            <div className='row pl-4 mt-4 pr-4'>
                                <div className="col">
                                    <label htmlFor="exampleInputPassword1">State</label>
                                    <input type="text" className="form-control" id="city" name='state' placeholder="Enter State" onChange={handleChange} value={credentials.state} required />
                                </div>
                                <div className='col'>
                                    <label htmlFor="exampleInputEmail1">City</label>
                                    <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" required name='city' onChange={handleChange} value={credentials.city} placeholder="City" />
                                </div>
                                <div className="col">
                                    <label htmlFor="exampleInputPassword1">Postal Code</label>
                                    <input type="number" className="form-control" id="zipCode" name='zipCode' placeholder="Zip Code" onChange={handleChange} value={credentials.zipCode} required maxLength={10} />
                                </div>
                            </div>
                        </div>
                        <hr className="hr-text " data-content='Department Details' />

                        <div className='row pl-4 mt-4 pr-4'>
                            <div className="col">
                                <label htmlFor="exampleInputPassword1">Department Name<span className='info' style={{ marginLeft: "8px" }}><AiOutlineInfoCircle data-toggle="tooltip" data-placement="bottom" title="Type the department name you want to create" /></span></label>
                                <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" required name='working_field' onChange={handleChange} value={credentials.working_field} placeholder="Department Name" />
                                {/* <select className="form-control" id="working_field" aria-describedby="working_field" name="working_field" onChange={handleChange} value={credentials.working_field} placeholder="Select Tech Field">
                                <option value="">Fields</option>
                                <option value="AI">AI</option>
                                <option value="SD">SD</option>
                                <option value="Web">Web Dev</option>
                            </select> */}
                            </div>
                            <div className="col">
                                <label htmlFor="exampleInputPassword1">Specialization<span className='info' style={{ marginLeft: "8px" }}><AiOutlineInfoCircle data-toggle="tooltip" data-placement="bottom" title="The techonology used in the dept For eg. in Web Dev you can write MERN" /></span></label>
                                <input type="text" className="form-control" id="specialization" aria-describedby="specialization" name="specialization" onChange={handleChange} value={credentials.specialization} placeholder="Select Specialization" required/>
                            </div>

                        </div>
                        <div className='row pl-4 mt-4 pr-4'>
                            <div className="col h-10  d-flex justify-center align-items-center justify-content-center">
                                <button type="primary" className="btn btn-primary" style={{ width: '25%' }}>Create</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default SuperuserDepartment