import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { IoPaperPlaneOutline } from "react-icons/io5";
import './Chat.css';
import Sidebar from "../components/Sidebar";

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
    const [userId, setUserId] = useState("");       // ID do usuário logado
    const [recipientId, setRecipientId] = useState(""); // ID do destinatário

    useEffect(() => {
        socket.on("connect", () => {
            console.log("Conectado:", socket.id);
        });

        // Receber mensagens privadas
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

        // Emitir mensagem privada
        socket.emit("register", { user_id: userId }); // Garante que esteja registrado
        socket.emit("private_message", msgData);

        // Exibir a própria mensagem
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
                        <div className="user-inputs">
                            <input
                                type="text"
                                placeholder="Seu ID (userId)"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                className="id-input"
                            />
                            <input
                                type="text"
                                placeholder="ID do Destinatário"
                                value={recipientId}
                                onChange={(e) => setRecipientId(e.target.value)}
                                className="id-input"
                            />
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
        </div>
    );
};

export default Chat;
