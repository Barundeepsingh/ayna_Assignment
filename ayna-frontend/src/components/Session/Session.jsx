import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { fetchSessions, createSession } from "../../helpers";
import './Session.css'

const Session = () => {
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [sessionNameInput, setSessionNameInput] = useState("");
  const { user, isLoading } = useAuthContext();
  const navigate = useNavigate();

  const userId = localStorage.getItem("id");

  useEffect(() => {
    if (!user && !isLoading) {
      navigate("/");
    } else {
      fetchSessions(userId)
        .then((sessions) => {
          console.log("Fetched sessions:", sessions); // Debug log
          setSessions(sessions || []);
        })
        .catch((error) => {
          console.error("Failed to fetch sessions:", error);
        });
    }
  }, [user, isLoading, navigate, userId]);

  const handleCreateSession = () => {
    if (sessionNameInput.trim() === "") return;

    createSession(userId, sessionNameInput)
      .then((newSession) => {
        console.log("New session:", newSession); // Debug log
        setSessions((prevSessions) => {
          if (!Array.isArray(prevSessions)) {
            return [newSession];
          }
          return [...prevSessions, newSession];
        });
        setCurrentSessionId(newSession.id);
        setSessionNameInput(""); // Clear input field
      })
      .catch((error) => {
        console.error("Failed to create session:", error);
      });
  };

  const handleSelectSession = (e) => {
    const selectedSessionId = e.target.value;
    setCurrentSessionId(selectedSessionId);

    console.log("Selected session ID:", selectedSessionId);

    // Navigate to the /chat route with the selected sessionId as a query parameter
    console.log('navigating');
    navigate(`/chat?sessionId=${selectedSessionId}`);
  };

  return (
    <div className="container">
      <h1>Manage Sessions</h1>

      <div className="createSession">
        <h2>Create Session</h2>
        <input
          type="text"
          placeholder="Enter session name"
          value={sessionNameInput}
          onChange={(e) => setSessionNameInput(e.target.value)}
        />
        <button onClick={handleCreateSession}>Create Session</button>
      </div>

      {sessions.length > 0 && (
        <div className="selectSession">
          <h2>Select Session</h2>
          <label>Select Session:</label>
          <select
            value={currentSessionId || ""}
            onChange={handleSelectSession}
          >
            <option value="" disabled>Select a session</option>
            {sessions.map((session) => (
              <option key={session.id} value={session.id}>
                {session.attributes?.sessionName || "Unnamed Session"}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default Session;
