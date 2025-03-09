import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navigation.css';

export default function Navigation() {
    const navigate = useNavigate(); 
    const user = localStorage.getItem("token"); 
    function handleLogout() {
        localStorage.removeItem("token"); 
        navigate("/");
    }
    return (
        <div className='navbar'>
            <Link to="/">Home</Link>  
            {
                user ? (
                    <Link to="/" onClick={handleLogout}>Logout</Link> 
                ) :
                    (
                        <>
                            <Link to="/register">Register</Link> 
                            <Link to="/login">Login</Link> 
                        </>
                    )
            }
        </div>
    );
}
