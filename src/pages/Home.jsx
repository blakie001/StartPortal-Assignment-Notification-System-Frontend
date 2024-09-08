import React, { useContext, useEffect, useState } from "react";
import { Context } from "../context/Context";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SingleNotification from "./SingleNotification";
import io from "socket.io-client";


function Home() {
  const { dispatch, token } = useContext(Context); 
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedOut) {
      navigate("/login");
    }
  }, [isLoggedOut, navigate]);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("token");
    setIsLoggedOut(true);
  };

  const handleNotification = () => {
    navigate("/newNotification");
  };

  const socket = io("http://localhost:3000");
  useEffect(() => {

    socket.on("connect", () => {
      console.log("Socket connected!");
    });

    socket.on("newNotifications", (data) => {
      setNotifications((prevNotifications) => [...prevNotifications, data]);
    });

    socket.on("InitialNotifications", (data) => {
      setNotifications(data);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socket.off("connect");
      socket.off("newNotifications");
      socket.off("InitialNotifications");
      socket.off("disconnect");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const headers = {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };
        const response = await axios.get("http://localhost:3000/notifications/", { headers });
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    
    fetchNotifications();
  }, [token]);

  useEffect(() => {
    socket.on("connect", () => {
        console.log("Socket connected!");

        // Listen for new notifications
        socket.on("newNotifications", (data) => {
            setNotifications((prevNotifications) => [...prevNotifications, data]);
        });
    });

    return () => {
        socket.off("newNotifications");
    };
  }, []);


  const handleToggleRead = async (index) => {
    const notification = notifications[index];
    
    // Simulate a backend call to update the read status
    try {
      const headers = {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      };
      // console.log(notification._id)
      await axios.put(`http://localhost:3000/notifications/${notification._id}`, 
        { read: true },
        { headers }
      );

      setNotifications(prevNotifications => 
        prevNotifications.map((notif, i) =>
          i === index ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error("Error updating notification status:", error);
    }
  };

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
                  <h2 className="text-uppercase mb-4">Welcome Home</h2>
                  <div className="d-flex justify-content-center gap-3 mt-4">
                    <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
                  </div>
                  <div className="d-flex justify-content-center gap-3 mt-4">
                    <button className="btn btn-outline-danger" onClick={handleNotification}>Send New Notification.</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="list-group mt-4">
              <h3 className="list-group-item list-group-item-action active" aria-current="true">
                Your Notifications:
              </h3>
              {notifications.length > 0 ? (
                notifications.map((notData, index) => (
                  <SingleNotification 
                    key={index} 
                    message={notData.message} 
                    read={notData.read} 
                    onToggleRead={() => handleToggleRead(index)}
                  />
                ))
              ) : (
                <p className="list-group-item">No notifications available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
