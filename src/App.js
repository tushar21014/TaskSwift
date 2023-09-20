import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom"
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';
import Director from './components/Director';
import Intern from './components/Intern';
import FirstState from './context/FirstState';
import Mentor from './components/Mentor';
import AssignTasks from './screens/AssignTasks';
import MentorInterns from './screens/MentorInterns';
import MentorHomescreen from './screens/MentorHomescreen';
import Superuser from './components/Superuser';
import SuperuserManageusers from './screens/SuperuserManageusers';
import Superuserdashboard from './screens/Superuserdashboard';



function App() {
  return (
    <FirstState>
    <Router>
    <Routes>
    <Route exact path='/' element={<Login />}></Route>
    <Route exact path='/Signup' element={<Signup />}></Route>
    <Route exact path='/Login' element={<Login />}></Route>
    <Route exact path='/Mentor' element={<Mentor />}></Route>
    <Route exact path='/Director' element={<Director />}></Route>
    <Route exact path='/Intern' element={<Intern />}></Route>
    <Route exact path='/AssignTasks' element={<AssignTasks />}></Route>
    <Route exact path='/MentorInterns' element={<MentorInterns />}></Route>
    <Route exact path='/MentorHomescreen' element={<MentorHomescreen/>}></Route>
    <Route exact path='/Superuser' element={<Superuserdashboard/>}></Route>
    <Route exact path='/Managerusers' element={<SuperuserManageusers/>}></Route>

    {/* <Route exact path='/UserPanel' element={<UserPanel />}></Route>
    <Route exact path='/Viewpastuploads' element={<Viewpastuploads />}></Route>
    <Route exact path='/MyProfile' element={<MyProfile />}></Route>
    <Route exact path='/Forgotpassword' element={<Forgotpassword />}></Route>
  <Route exact path='/Resetpassword/:id/:token' element={<Resetpassword />}></Route> */}
    
    </Routes>
  </Router>
  </FirstState>
        );
}

export default App;
