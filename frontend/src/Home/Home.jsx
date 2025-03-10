import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [users, setUsers] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [selectedUser, setSelectedUser] = useState(null);
  const [medicineName, setMedicineName] = useState('');
  const [dosage, setDosage] = useState('');
  const [days, setDays] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [search, setSearch] = useState('');  // State for search input

  const navigate = useNavigate();

  const daysOfWeek = [
    { name: "Sunday", checked: false },
    { name: "Monday", checked: false },
    { name: "Tuesday", checked: false },
    { name: "Wednesday", checked: false },
    { name: "Thursday", checked: false },
    { name: "Friday", checked: false },
    { name: "Saturday", checked: false }
  ];

  useEffect(() => {
    // API call with search query if it exists
    const fetchUsers = () => {
      const url = search
        ? `https://medicine-reminder-58z9.onrender.com/api/medicine?username=${search}`  // API with search query
        : "https://medicine-reminder-58z9.onrender.com/api/medicine";  // Default API without search query

      axios.get(url)
        .then((res) => {
          setUsers(res.data);
        })
        .catch((error) => {
          console.error("Error fetching users!", error);
        });

      setDays(daysOfWeek);
    };

    fetchUsers();
  }, [search]);  // Re-run the effect whenever `search` changes

  const handleAddMedicine = (user) => {
    if (!isLoggedIn) {
      alert("Login first");
      return;
    }

    if (user._id !== localStorage.getItem("userId")) {
      alert("You can modify your details only");
      return;
    }

    setSelectedUser(user);
    setMedicineName('');
    setDosage('');
    setDays(daysOfWeek.map(day => ({ ...day, checked: false })));
    setShowModal(true);
  };

  const handleUpdateMedicine = (user) => {
    if (!isLoggedIn) {
      alert("Login first");
      return;
    }

    if (user._id !== localStorage.getItem("userId")) {
      alert("You can modify your details only");
      return;
    }

    setSelectedUser(user);
    setUpdateModal(true);
  };

  const handleSubmitMedicine = async () => {
    if (!selectedUser) {
      alert("No user selected");
      return;
    }

    const selectedDays = days.filter(day => day.checked).map(day => day.name);
    const medicineDetails = { medicineName, dosage, days: selectedDays };
    const token = localStorage.getItem("token");

    try {
      setShowModal(false);
      setUpdateModal(false);

      await axios.post(
        `https://medicine-reminder-58z9.onrender.com/api/add/${selectedUser._id}`,
        medicineDetails,
        { headers: { Authorization: `Bearer ${token}` } }
      )
        .then((res) => {
          alert("Medicine details added successfully");
        })
        .catch((e) => {
          alert("Medicine already exists");
        });

      setShowModal(false);
    } catch (error) {
      console.error("Error updating medicine details", error);
      alert("Failed to update medicine details. Try again!");
    }
  };

  const handleSubmitUpdate = async () => {
    if (!selectedUser) {
      alert("No user selected");
      return;
    }

    const selectedDays = days.filter(day => day.checked).map(day => day.name);
    const medicineDetails = { medicineName, dosage, days: selectedDays };
    const token = localStorage.getItem("token");

    try {
      setShowModal(false);
      setUpdateModal(false);

      await axios.put(
        `https://medicine-reminder-58z9.onrender.com/api/add/update/${selectedUser._id}`,
        medicineDetails,
        { headers: { Authorization: `Bearer ${token}` } }
      )
        .then((res) => {
          alert("Medicine details updated successfully");
        })
        .catch((e) => {
          alert("Medicine not found");
        });

      setShowModal(false);
    } catch (error) {
      console.error("Error updating medicine details", error);
      alert("Failed to update medicine details. Try again!");
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);  // Update the search state with input
  };

  return (
    <div className="container mt-5">

      {/* Search bar */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by username"
          value={search}
          onChange={handleSearchChange} 
        />
      </div>

      <div className="row mt-5">
        {users.map((user) => (
          <div
            key={user._id}
            className="mt-2 col-12 col-sm-6 col-md-4 card h-100 m-2"
            style={{ width: "23rem", minHeight: "10rem", display: "flex", flexDirection: "column" }}
          >
            <div className="card-body">
              <h5 className="card-title">Name: {user.username}</h5>
              <p className="card-text">Email: {user.email}</p>
            </div>
            <div className="card-footer d-flex justify-content-center gap-2">
              <button className="btn btn-primary btn-sm" onClick={() => handleAddMedicine(user)}>
                Add Medicine
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => handleUpdateMedicine(user)}>
                Update Medicine
              </button>
            </div>
          </div>
        ))}
      </div>

      {(showModal || updateModal) && (
        <div className="modal show d-block" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5">Fill Medicine Details</h1>
                <button type="button" className="btn-close" onClick={() => { setShowModal(false); setUpdateModal(false); }}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="medicine-name" className="col-form-label">Medicine Name:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="medicine-name"
                      value={medicineName}
                      onChange={(e) => setMedicineName(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="dosage" className="col-form-label">Dosage:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="dosage"
                      value={dosage}
                      onChange={(e) => setDosage(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="col-form-label">Days:</label>
                    <div className="row">
                      {days.map((day, index) => (
                        <div className="col-6" key={index}>
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id={day.name}
                              checked={day.checked}
                              onChange={() => setDays(prevDays => prevDays.map(d => d.name === day.name ? { ...d, checked: !d.checked } : d))}
                            />
                            <label className="form-check-label" htmlFor={day.name}>
                              {day.name}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); setUpdateModal(false); }}>Close</button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={showModal ? handleSubmitMedicine : handleSubmitUpdate}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
