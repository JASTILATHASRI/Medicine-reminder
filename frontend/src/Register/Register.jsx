import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [medicineName, setMedicineName] = useState("");  // New state for medicine name
  const [dosage, setDosage] = useState("");              // New state for dosage
  const [days, setDays] = useState([]);                  // New state for days
  const navigate = useNavigate();

  // Handle day selection
  const handleDayChange = (day) => {
    setDays(prevDays => 
      prevDays.includes(day)
        ? prevDays.filter(d => d !== day)
        : [...prevDays, day]
    );
  };

  const addUser = (e) => {
    e.preventDefault();

    // Validate inputs
    if (username === "" || email === "" || password === "" ) {
      alert("Please fill all the details.");
    } else {
      const newPatient = { username, email, password, medicineName, dosage, days };

      // Post the new user with medicine details to the backend
      axios.post("https://medicine-reminder-58z9.onrender.com/api/auth/register", newPatient)
        .then((res) => {
          if (res.status === 201) {
            alert("User created successfully! Please log in.");
            navigate("/login");
          }
        })
        .catch((err) => {
          if (err.response && err.response.status === 400) {
            console.log("Error:", err);
            alert("Error: Username or email might already be taken.");
          } else {
            alert("An error occurred. Please try again.");
          }
        });
    }
  };

  return (
    <div className="container mt-3 p-3">
      <div className="row d-flex justify-content-center">
        <form className="col-12 col-md-6 bg-secondary-subtle">
          <div className="mb-3">
            <h3>Register</h3>
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputName" className="form-label">Name</label>
            <input 
              type="text" 
              className="form-control" 
              id="exampleInputName" 
              onChange={(e) => setUsername(e.target.value)} 
            />
          </div>

          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-control" 
              id="exampleInputEmail1" 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>

          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
            <input 
              type="password" 
              className="form-control" 
              id="exampleInputPassword1" 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>

          <button type="submit" className="btn btn-primary" onClick={addUser}>Submit</button>
        </form>
      </div>
    </div>
  );
}
