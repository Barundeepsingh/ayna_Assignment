import React, { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { WebSocketService } from "../../services/WebSocketService";
import { useAuthContext } from "../../context/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getToken, createMessage, fetchMessages } from "../../helpers";
import './Chat.css';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const navigate = useNavigate();
  const { user, isLoading } = useAuthContext();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const userId = localStorage.getItem("id")
  const socketServiceRef = useRef(null);
  const messageEndRef = useRef(null);
  const messagesRef = useRef(messages);

//  console.log(userId);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (!user && !isLoading) {
      navigate("/");
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (!sessionId) {
      navigate("/session");
    }
  }, [sessionId, navigate]);

//  console.log(sessionId);

  useEffect(() => {
    const fetchMessageHistory = async () => {
      try {
        // Clear previous messages before fetching new ones
        setMessages([]);
        
        const data = await fetchMessages(sessionId,userId); 
        console.log(data);
        const pastMessages = data.map((msg) => ({
          id: msg.id,
          content: msg.attributes.content,
          receiver: msg.attributes.receiver,
          timestamp: msg.attributes.timestamp,
        }));

        setMessages(pastMessages);
      } catch (error) {
        console.error("Failed to Fetch Messages", error);
      }
    };

    fetchMessageHistory();

    return () => {
      // Cleanup WebSocket and event listeners when the sessionId changes or component unmounts
      if (socketServiceRef.current) {
        socketServiceRef.current.disconnect();
        socketServiceRef.current = null;
      }
    };
  }, [sessionId, userId]);

  useEffect(() => {
    const connectWebSocket = async () => {
      const token = await getToken();
      if (token) {
        const socket = WebSocketService(token);
        socketServiceRef.current = socket;

        socket.off("message:create");

        socket.on("message:create", (message) => {
          console.log('Message received from server:', message);

          if (
            message && 
            message.id && 
            !messagesRef.current.some((msg) => msg.id === message.id)
          ) {
            const receivedMessage = {
              id: message.id,
              content: message.content,
              receiver: "server",
              timestamp: format(new Date(message.createdAt), "hh:mm:ss.SSS"),
              senderId:user.id
            };

            setMessages((prevMessages) => [...prevMessages, receivedMessage]);

            createMessage(sessionId, {
              content: receivedMessage.content,
              receiver: receivedMessage.receiver,
              timestamp: receivedMessage.timestamp,
              session: sessionId,
              senderId: receivedMessage.senderId
            }).catch((error) => {
              console.error("Failed to save received message:", error);
            });
          }
        });
      }
    };

    connectWebSocket();

    return () => {
      if (socketServiceRef.current) {
        socketServiceRef.current.disconnect();
        socketServiceRef.current = null;
      }
    };
  }, [sessionId, user, isLoading]);

  const sendMessage = async () => {
    if (messageInput.trim() === "") return;

    const newMessage = {
      content: messageInput,
      receiver: null,
      timestamp: format(new Date(), "hh:mm:ss.SSS"),
      sender:user.id,
      senderId:user.id
    };

    setMessages((prevMessages) => [
      ...prevMessages,
      { ...newMessage, id: Date.now() },
    ]);

    if (socketServiceRef.current) {
      socketServiceRef.current.emit("message:create", newMessage.content);
    }

    try {
      await createMessage(sessionId, newMessage);
    } catch (error) {
      console.error("Failed to create message:", error);
    }

    setMessageInput("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="container">
      <h1>Chat with Ayna</h1>
      <div className="messageContainer">
        {messages.map((item) => (
          <div
            key={item.id ? item.id.toString() : `message-${item.timestamp}`}
            className={`message ${
              item.receiver === "server" ? "receivedMessage" : "sentMessage"
            }`}
          >
            <p className="messageText">{item.content}</p>
            <span className="timestamp">{item.timestamp}</span>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      <div className="inputContainer">
        <input
          className="input"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
        />
        <button className="sendButton" onClick={sendMessage}>
          <span className="sendButtonText">Send</span>
        </button>
      </div>
      
    </div>

  );
};

export default Chat;
