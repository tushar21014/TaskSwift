import React, { useEffect, useState } from 'react'
import InternFirstLogin from '../screens/InternFirstLogin'
import InternScreen from '../screens/InternScreen'
import Naviagtion from '../components/Navigation'

const Intern = () => {
  const [flag, setFlag] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getDetails = async () => {
    try {
      const res = await fetch('http://localhost:5004/api/intern/internGetdetails', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      let data = await res.json();
      setFlag(data.users.passChanged);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDetails();
  }, []);

  return (
    <div>
      <div>
        {/* <Naviagtion/> */}
      </div>
      <div>
        {isLoading ? (
          <p>Loading...</p>
        ) : flag === true ? (
          <InternScreen />
        ) : (
          <InternFirstLogin />
        )}
      </div>
    </div>
  );
};

export default Intern;