import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { FaRegTrashCan } from "react-icons/fa6";
import { MdOutlineBlock } from "react-icons/md";
import { IoFlagOutline } from "react-icons/io5";
import './Chat.css';
import Sidebar from "../components/Sidebar";
import { FaGear } from "react-icons/fa6"

const fundos = [
    "/wallpapers/fundo2.jpg",
    "/wallpapers/fundo1.jpg",
    "/wallpapers/fundo3.jpg",
    "/wallpapers/fundo4.jpg",
    "/wallpapers/fundo5.gif",
    "/wallpapers/fundo6.gif",
];

const socket = io("http://localhost:5000", {
    transports: ["websocket"]
});

const Chat = () => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [background, setBackground] = useState(fundos[0]);
    const [userId, setUserId] = useState("");
    const [recipientId, setRecipientId] = useState("");
    const [mostrarConfig, setMostrarConfig] = useState(false)
    const [girando, setGirando] = useState(false);

    const toggleConfig = () => {
        setMostrarConfig(!mostrarConfig);
        setGirando(true);
        setTimeout(() => setGirando(false), 300)
    };

    useEffect(() => {
        socket.on("connect", () => {
            console.log("Conectado:", socket.id);
        });


        socket.on("private_message", (data) => {
            setMessages((prev) => [...prev, {
                text: data.message,
                senderId: data.sender_id
            }]);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const sendMessage = () => {
        if (!message.trim() || !userId || !recipientId) return;

        const msgData = {
            sender_id: userId,
            receiver_id: recipientId,
            message
        };

        socket.emit("register", { user_id: userId });
        socket.emit("private_message", msgData);

        setMessages((prev) => [...prev, { text: message, senderId: userId }]);
        setMessage("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") sendMessage();
    };

    return (
        <div className="chat-container">
            <div>
                <Sidebar />
            </div>
            <div className="tudo-container-chat">
                <div className="container-chat">

                    <nav className="topo-chat">
                        <div className="config-container-chat">
                            <button className="btn-config-chat" onClick={toggleConfig}>
                                <FaGear
                                    color="white"
                                    fontSize={20}
                                    className={girando ? "rotate" : ""}
                                />
                            </button>

                            {mostrarConfig && (
                                <div className="config-box-dropdown">
                                    <button><FaRegTrashCan size={15}/> Apagar Conversa</button>
                                    <button><MdOutlineBlock size={15}/>Bloquear</button>
                                    <button><IoFlagOutline size={15}/>Denunciar</button>
                                </div>
                            )}
                        </div>
                    </nav>

                    <div
                        className="message-area"
                        style={{ backgroundImage: `url(${background})` }}
                    >
                        {messages.map((msg, index) => (
                            <p
                                key={index}
                                className={msg.senderId === userId ? "you" : ""}
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
                        <button onClick={sendMessage}>
                            <IoPaperPlaneOutline color="black" size={30} />
                        </button>
                    </div>
                </div>

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
