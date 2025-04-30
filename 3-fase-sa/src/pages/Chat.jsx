import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import './Chat.css';
import Sidebar from "../components/Sidebar";

const Chat = () => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = io("http://localhost:5000", {
            transports: ["websocket"],
        });

        socketRef.current.on("message", (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        });


        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    const sendMessage = () => {
        if (message.trim() !== "") {
            socketRef.current.emit("message", message);
            setMessage("");
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    };

    return (
        <div className="chat-container">
            <nav className="topo-chat"></nav>

            <div className="message-area">
                {messages.map((msg, index) => (
                    <p key={index}>{msg}</p>
                ))}
            </div>

            <div className="message-input">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Digite sua mensagem..."
                />
                <button onClick={sendMessage}>Enviar</button>
            </div>
        </div>
    );
};

export default Chat;
