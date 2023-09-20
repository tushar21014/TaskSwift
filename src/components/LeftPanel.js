import React, { useContext } from 'react'
import { BiSolidDashboard, BiSolidUserBadge } from 'react-icons/bi'
import '../css/MentorScreen.css'
import { MdGroupAdd } from 'react-icons/md'
import { BsList } from 'react-icons/bs'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AiOutlinePoweroff } from 'react-icons/ai'
import FirstContext from '../context/firstContext'
import Cookies from 'js-cookie'


const LeftPanel = () => {
    let location = useLocation();

    const context = useContext(FirstContext);
    const { calltoast } = context;
    const navigate = useNavigate();
    let open = false;

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:5004/api/auth/clearCookies', {
                method: "GET",
                credentials: 'include'
            })
            if (response.ok) {
                calltoast("Logged Out Successfully", "success");
                navigate('/Login');
            }
        } catch (error) {
            console.error();
        }

    }

    function hideLeftPanel() {
        let leftPanel = document.getElementById('mentorHomeScreen-leftPanel');
        let rightPanel = document.getElementById('mentorHomeScreen-rightPanel');
        let sideMenuBtn = document.getElementById('sideMenu-button');
        let sideTitles = document.querySelectorAll('.leftPanel-title'); // Select all titles with the class
        let sideButtonsCol = document.getElementById('leftPanelButton-Col');
        // let dashboardTitle = document.getElementById("dashboardTitle");
        if (location.pathname === '/MentorHomescreen') {
            let dashboardTitle = document.getElementById("dashboardTitle");
            if (!open) {
                dashboardTitle.style.transition = '0.2s linear'
                dashboardTitle.style.marginLeft = '-8%';
            }
            else {
                dashboardTitle.style.marginLeft = '2%';
                dashboardTitle.style.transition = '0.2s linear'
            }
        }
        if (!open) {
            // Open the left panel
            leftPanel.style.width = "4%";
            rightPanel.style.maxWidth = "100vw";
            rightPanel.style.marginLeft = "4%";
            open = true;
            sideMenuBtn.style.left = '1%';
            leftPanel.style.transition = '0.2s linear'
            rightPanel.style.transition = '0.2s linear'
            sideMenuBtn.style.transition = '0.2s linear'
            sideButtonsCol.style.marginLeft = '17%'

            // Hide all titles with the class
            sideTitles.forEach((title) => {
                title.style.display = "none";
            });
            // dashboardTitle.style.marginTop = '7vh';  
        } else {
            // Close the left panel
            leftPanel.style.width = "15%";
            rightPanel.style.maxWidth = "calc(100vw - 15%)";
            rightPanel.style.marginLeft = "15%";
            open = false;
            sideMenuBtn.style.left = '12%';
            leftPanel.style.transition = '0.2s linear'
            rightPanel.style.transition = '0.2s linear'
            sideMenuBtn.style.transition = '0.2s linear'
            sideButtonsCol.style.marginLeft = '10%'



            // Show all titles with the class
            sideTitles.forEach((title) => {
                title.style.display = "block";
            });
        }
    }


    return (
        <div id='mentorHomeScreen-leftPanel'><div>
        </div>
            <div className='d-flex align-items-center container' style={{ height: "7vh", fontSize: "20px" }}>

                <div className='sideMenu-button' id='sideMenu-button' onClick={hideLeftPanel}>
                    <BsList /></div>
            </div>
            {(Cookies.get('role') === 'superuser')? <>
            <div className='anotherContainer row'>

                <div className='col-2 ' id='leftPanelButton-Col' style={{ marginLeft: "10%" }}>
                    <Link to='/Superuser'  style={{ textDecoration: "none", color: "white" }}>
                        <div className='leftPanel-logo'><BiSolidDashboard /></div>
                    </Link>
                    <Link to='/Managerusers' style={{ textDecoration: "none", color: "white" }}>
                        <div className='leftPanel-logo'><BiSolidUserBadge /></div>
                    </Link>
                    <div className='leftPanel-logo' style={{ position: "absolute", top: "84vh" }} ><AiOutlinePoweroff /></div>
                </div>
                <div className='col-8'>
                    <Link to='/Superuser' style={{ textDecoration: "none", color: "white" }}>
                        <div className='leftPanel-title' id='leftPanel-title'>Dashboard</div>
                    </Link>
                    <Link to='/Managerusers' style={{ textDecoration: "none", color: "white" }}>
                        <div className='leftPanel-title' id='leftPanel-title' >Manage Users</div>
                    </Link>
                    <div className='leftPanel-title' onClick={handleLogout} style={{ position: "absolute", top: "84vh" }} id='leftPanel-title'>LogOut</div>
                </div>
            </div>
            </>:<>
            <div className='anotherContainer row'>

                <div className='col-2 ' id='leftPanelButton-Col' style={{ marginLeft: "10%" }}>
                    <Link to='/MentorHomescreen'  style={{ textDecoration: "none", color: "white" }}>
                        <div className='leftPanel-logo'><BiSolidDashboard /></div>
                    </Link>
                    <Link to='/AssignTasks' style={{ textDecoration: "none", color: "white" }}>
                        <div className='leftPanel-logo'><BiSolidUserBadge /></div>
                    </Link>
                    <Link to='/MentorInterns' style={{ textDecoration: "none", color: "white" }}>
                        <div className='leftPanel-logo'><MdGroupAdd /></div>
                    </Link>

                    <div className='leftPanel-logo' style={{ position: "absolute", top: "84vh" }} ><AiOutlinePoweroff /></div>
                </div>
                <div className='col-8'>
                    <Link to='/MentorHomescreen' style={{ textDecoration: "none", color: "white" }}>
                        <div className='leftPanel-title' id='leftPanel-title'>Dashboard</div>
                    </Link>
                    <Link to='/AssignTasks' style={{ textDecoration: "none", color: "white" }}>
                        <div className='leftPanel-title' id='leftPanel-title' >Interns</div>
                    </Link>
                    <Link to='/MentorInterns' style={{ textDecoration: "none", color: "white" }}>
                        <div className='leftPanel-title' id='leftPanel-title' >Applications</div>
                    </Link>
                    <div className='leftPanel-title' onClick={handleLogout} style={{ position: "absolute", top: "84vh" }} id='leftPanel-title'>LogOut</div>
                </div>
            </div>
            </>}

            <div className='leftPanel-items-container'>

            </div>
        </div>
    )
}

export default LeftPanel



