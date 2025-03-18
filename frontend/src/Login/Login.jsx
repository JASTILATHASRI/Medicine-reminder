import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
    function handleLogin(e) {
        e.preventDefault()
        axios.post("https://medicine-reminder-58z9.onrender.com/api/auth/login",{email,password})
        .then((res)=>{
            if(res.status === 200){
                localStorage.setItem("token",res.data.token)
                localStorage.setItem("userId", res.data.userId) 
                alert("Login Successful")
                navigate("/")
            }
            console.log(res)
        })
        .catch((err)=>{
            alert("invalid email or password")
        })
    }
    return (
        <div className='container mt-5'>
            <div className='row d-flex justify-content-center'>
                <form className='col-12 col-md-6 bg-secondary-subtle'>
                    <div className="mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                        <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="mb-3 ">
                        <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                        <input type="password" className="form-control" id="exampleInputPassword1" onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-primary" onClick={handleLogin}>Submit</button>
                </form>
            </div>
        </div>
    )
}
