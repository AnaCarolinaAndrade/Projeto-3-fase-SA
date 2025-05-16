import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { IoPaperPlaneOutline } from "react-icons/io5";
import './Chat.css';

const fundos = [
    "/wallpapers/fundo2.jpg",
    "/wallpapers/fundo1.jpg",
    "/wallpapers/fundo3.jpg",
    "/wallpapers/fundo4.jpg"
]

const Chat = () => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const socketRef = useRef(null);
    const [background, setBackground] = useState(fundos[0]);
    const [socketId, setSocketId] = useState(null);



    useEffect(() => {
        socketRef.current = io("http://localhost:5000", {
            transports: ["websocket"],
        });

        socketRef.current.on("connect", () => {
            setSocketId(socketRef.current.id); // pega seu próprio ID
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

            const msgData = {
                text: message,
                senderId: socketRef.current.id
            };

            socketRef.current.emit("message", msgData);
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
            <div className="container-chat">
                <nav className="topo-chat"></nav>

                <div className="message-area"
                    style={{ backgroundImage: `url(${background})` }}>
                    {messages.map((msg, index) => (
                        <p
                            key={index}
                            className={msg.senderId && socketId && msg.senderId === socketId ? "you" : ""}
                        >
                            {msg.text}
                        </p>
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
                    <button onClick={sendMessage}><IoPaperPlaneOutline color="black" size={30} /></button>
                </div>
            </div>

            <div className="container-mudar-fundo">
                <div className="config-mudar-fundo">
                    {fundos.map((wall, index) => (
                        <button
                            key={index}
                            onClick={() => setBackground(wall)}
                        >
                            <img src={wall} alt={`wallpaper ${index}`} className="mudar-fundo" />
                        </button>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default Chat;
