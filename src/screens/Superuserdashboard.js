import React, { useEffect, useState } from 'react'
import LeftPanel from '../components/LeftPanel'
import { Pie, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title, ArcElement, Tooltip, Legend
} from 'chart.js';
import '../css/Superuser.css'
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);
const Superuserdashboard = () => {
  const [selectedChart, setSelectedChart] = useState('Doughnut')
  const [overview, setOverview] = useState({});
  useEffect(() => {
    fetchOverview();
    return () => {
    }
  }, [])

  const fetchOverview = async () => {
    try {
      const response = await fetch('http://localhost:5004/api/superuser/superuserFetchoverview', {
        method: "GET",
        credentials: 'include'
      });
      const res = await response.json();
      // console.log(res.userss);
      setOverview(res);
    } catch (error) {
      console.log(error);
    }
  }

  const data = {
    labels: ['Interns', 'Mentors', 'Director'],
    datasets: [
      {
        label: 'Number',
        data: [overview.userss, overview.mentorr, overview.directorr], // Sample data values
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], // Colors for each segment
      },
    ],
    hoverOffset: 4
  };


  return (
    <div style={{ overflowX: 'hidden' }}>
      <div>
        <LeftPanel />
      </div>
      <div className={`mentorHomescreen-grandFather-container`} id='mentorHomeScreen-rightPanel'>
        <div className='row firstscreenRow'>
          <div className='col-6'>
            <h1>This is a pie chart</h1>
            <p>The line chart allows a number of properties to be specified for each dataset. These are used to set display properties for a specific dataset. For example, the colour of a line is generally set this way.</p>
            <div className="dropdown">
              <button className="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false">
                {selectedChart}
              </button>
              <div className="dropdown-menu">
                <div className="dropdown-item" onClick={() => setSelectedChart('Bar')}>Bar Chart</div>
                <div className="dropdown-item" onClick={() => setSelectedChart('Pie')}>Pie Chart</div>
                <div className="dropdown-item" onClick={() => setSelectedChart('Doughnut')}>Doughnut Chart</div>
                {/* <div className="dropdown-item" href="#">Something else herediv/a> */}
              </div>
            </div>
          </div>
          <div className='col-4 d-flex justify-content-center align-items-center'>
            <div className='piechart'>
          {selectedChart === 'Pie' && <Pie data={data} />}
          {selectedChart === 'Bar' && <Bar data={data} />}
          {selectedChart === 'Doughnut' && <Doughnut data={data} />}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Superuserdashboard