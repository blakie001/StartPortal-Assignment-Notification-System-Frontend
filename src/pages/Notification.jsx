import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../context/Context';

function Notification() {

    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const { token } = useContext(Context)

    const handleSubmit = async(e) =>{
        try {
            e.preventDefault();
            const headers = {
                authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            }
            const newNotification = {
                email,
                message,
            }
            const response = await axios.post("http://localhost:3000/notifications", newNotification, {headers})
            window.location.replace("/")
        } catch (error) {
            if(error.response.status == 404)  {
                window.alert("User not found, ask them to register first.")
            }
            console.error("Error Sending notifications:", error);
        }
    }

    return (
        <div
            className="vh-100 bg-image"
            style={{
                backgroundImage: "url('https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img4.webp')",
            }}
        >
            <div className="mask d-flex align-items-center h-100 gradient-custom-3">
                <div className="container h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-12 col-md-9 col-lg-7 col-xl-6">
                            <div className="card" style={{ borderRadius: "15px" }}>
                                <div className="card-body p-5 text-center">
                                    <h2 className="text-uppercase mb-4">Send Notification</h2>

                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label htmlFor="emailInput" className="form-label">Email address</label>
                                            <input type="email" className="form-control" id="emailInput" aria-describedby="emailHelp" onChange={e=>{setEmail(e.target.value)}}/>
                                            <div id="emailHelp" className="form-text">Please enter the Receiver's Email.</div>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="messageInput" className="form-label">Message</label>
                                            <textarea className="form-control" id="messageInput" aria-describedby="messageHelp" onChange={e=>{setMessage(e.target.value)}}></textarea>
                                            <div id="messageHelp" className="form-text">Please enter the Message.</div>
                                        </div>
                                        <button type="submit" className="btn btn-primary" >Submit</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Notification;
