import React, { useEffect, useRef, useState } from 'react'
import LeftPanel from '../components/LeftPanel'
import { Pie, Bar, Doughnut,getElementsAtEvent } from 'react-chartjs-2';
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
  const [selectedChart, setSelectedChart] = useState('Pie')
  const [overview, setOverview] = useState();
  const [subinterns, setSubinterns] = useState();
  const [internSubChart, setInternSubChart] = useState(false);
  const [mentorSubChart, setMentorSubChart] = useState(false);
  const [diffDeptDataset, setDiffDeptDataset] = useState();
  const [showDiffDeptinterns, setShowDiffDeptinterns] = useState(false);
  const [showDiffDeptmentors, setShowDiffDeptmentors] = useState(false)
  const chartRef = useRef();
  const chartRef2 = useRef();
  useEffect(() => {
    fetchOverview();
    fetchActiveInterns();
    fecthdiffDeptinterns();
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

  const fetchActiveInterns = async () => {
    try {
      const response = await fetch('http://localhost:5004/api/superuser/superuserFetchActiveinterns', {
        method: "GET",
        credentials: 'include'
      });
      const res = await response.json();
      // console.log(res.activeuserss);
      setSubinterns(res);
    } catch (error) {
      console.log(error);
    }
  }

  const fetchDiffDeptMentors = async () => {
    try {
      const response = await fetch('http://localhost:5004/api/superuser/superuserFetchDifferentMentorFields', {
        method: "GET",
        credentials: 'include'
      });
      const res = await response.json();
      // console.log(res.activeuserss);
      setMentorSubChart(res);
    } catch (error) {
      console.log(error);
    }
  }

  const fecthdiffDeptinterns = async () => {
    try {
      const response = await fetch('http://localhost:5004/api/superuser/superuserFetchUserWorkingFields', {
        method: "GET",
        credentials: 'include'
      });
      const res = await response.json();
      console.log(res);
      setDiffDeptDataset(res);
    } catch (error) {
      console.log(error);
    }
  }

  const onClick = (event) => {
    if(getElementsAtEvent(chartRef.current,event).length > 0){
      // console.log(getElementsAtEvent(chartRef.current,event))
      const datasetIndexNum = getElementsAtEvent(chartRef.current,event)[0].datasetIndex;
      const dataPoint = getElementsAtEvent(chartRef.current,event)[0].index;

      // console.log(data.datasets[datasetIndexNum], data.labels[dataPoint])
      console.log(data.datasets[datasetIndexNum].links[dataPoint])
      if(data.datasets[datasetIndexNum].links[dataPoint] === 'intern Chart'){
        setInternSubChart(true);
        setMentorSubChart(false);
        setShowDiffDeptinterns(false);
        setShowDiffDeptmentors(false);
      }
      else{
        setShowDiffDeptinterns(false);
        setShowDiffDeptmentors(false);
        setMentorSubChart(true);
        setInternSubChart(false);
      }
    }

  };
  
  const seconClick = (event) => {
    if(getElementsAtEvent(chartRef2.current,event).length > 0){
      // console.log(getElementsAtEvent(chartRef.current,event))
      const datasetIndexNum = getElementsAtEvent(chartRef2.current,event)[0].datasetIndex;
      const dataPoint = getElementsAtEvent(chartRef2.current,event)[0].index;
      
      // console.log(data.datasets[datasetIndexNum], data.labels[dataPoint])
      console.log(data.datasets[datasetIndexNum].links[dataPoint])
      if(data.datasets[datasetIndexNum].links[dataPoint] === 'intern Chart'){
        setShowDiffDeptinterns(true);
        setShowDiffDeptmentors(false);
        // setSelectedChart('');
        setInternSubChart(false);
      }
      else{
        setShowDiffDeptmentors(true);
        setShowDiffDeptinterns(false);
        // setSelectedChart('');
      }
    }

  };



  const data = {
    labels: ['Interns', 'Mentors'],
    datasets: [
      {
        label: 'Number',
        data: [
          overview && overview.userss ? overview.userss : 0,
          overview && overview.mentorr ? overview.mentorr : 0,
        ],
        
        backgroundColor: ['#FF6384', '#36A2EB'], // Colors for each segment
        links:[`intern Chart`,'mentor Chart']
      },
    ],
    hoverOffset: 4
  };



  const internsubChartData = {
    labels: ['Active Interns', 'Inactive Interns'],
    datasets: [
      {
        data: [
          subinterns && subinterns.activeuserss ? subinterns.activeuserss : 0,
          subinterns && subinterns.inactiveuserss ? subinterns.inactiveuserss : 0,
        ],
        
        // data:[!filtering().length ? 0 : filtering().length,overview.userss.length-filtering().length],
        backgroundColor: ['#FF6384', '#FFCE56'],
        links:['activeinterns','inactiveinterns']

      },
    ],
  };

  const mentorsubChartData = {
    labels: ['Active Mentors', 'Inactive Mentors'],
    datasets: [
      {
        data: [7,2
          // subinterns && subinterns.activeuserss ? subinterns.activeuserss : 0,
          // subinterns && subinterns.inactiveuserss ? subinterns.inactiveuserss : 0,
        ],
        // data:[!filtering().length ? 0 : filtering().length,overview.userss.length-filtering().length],
        backgroundColor: ['#FF6384', '#FFCE56'],
      },
    ],
  };

  


  return (
    <div style={{ overflowX: 'hidden' }}>
      <div>
        <LeftPanel />
      </div>
      <div className={`mentorHomescreen-grandFather-container`} id='mentorHomeScreen-rightPanel'>
        <div className='row firstscreenRow'>
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
          <div className='col-5 d-flex justify-content-center align-items-center'>
            <div className='piechart'>
              {selectedChart === 'Pie' && (<div><Pie data={data} ref={chartRef} onClick={onClick}/></div>)}
              {selectedChart === 'Bar' && <Bar data={data} />}
              {selectedChart === 'Doughnut' && <Doughnut data={data} />}
            </div>
          </div>
          {internSubChart && (
            <div className='col-5 d-flex justify-content-center align-items-center'>
              <div className='piechart'>
                {/* Display the sub-chart when showSubChart is true */}
                <Pie data={internsubChartData} ref={chartRef2} onClick={seconClick} />
              </div>
            </div>
          )}
          {mentorSubChart && (
            <div className='col-5 d-flex justify-content-center align-items-center'>
              <div className='piechart'>
                {/* Display the sub-chart when showSubChart is true */}
                <Pie data={mentorsubChartData} ref={chartRef2} onClick={seconClick} />
              </div>
            </div>
          )}
          {showDiffDeptinterns && (
            <div className='col-5 d-flex justify-content-center align-items-center'>
              <div className='piechart'>
                {/* Display the sub-chart when showSubChart is true */}
                <Pie data={diffDeptDataset}  />
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default Superuserdashboard