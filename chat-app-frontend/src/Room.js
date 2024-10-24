import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import socket from './socket'; // Adjust path if necessary
import './Room.css';

const Room = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const displayedMessages = useRef(new Set()); // Track displayed messages

    const username = location.state?.username || "Anonymous"; // Default to "Anonymous"

    useEffect(() => {
        if (!username) {
            navigate('/'); // Navigate back to home if no username
        }

        socket.emit('joinRoom', { roomId, username });

        socket.on('message', (msg) => {
            const uniqueMessageKey = `${msg.username}: ${msg.text}`;
            if (!displayedMessages.current.has(uniqueMessageKey)) {
                displayedMessages.current.add(uniqueMessageKey);
                setMessages((prevMessages) => [...prevMessages, msg]);
            }
        });

        socket.on('onlineUsers', (users) => {
            setOnlineUsers(users);
        });

        return () => {
            socket.off('message');
            socket.off('onlineUsers');
            socket.emit('leaveRoom', roomId);
        };
    }, [roomId, username, navigate]);

    const sendMessage = () => {
        if (message) {
            socket.emit('chatMessage', { text: message, username });
            setMessage('');
        }
    };

    const handleExitRoom = () => {
        socket.emit('leaveRoom', roomId);
        navigate('/');
    };

    return (
        <div className="room-container">
            <h2>Room: {roomId}</h2>
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index} className="message">
                        <strong>{msg.username}: </strong>{msg.text}
                    </div>
                ))}
            </div>
            <div className="input-area">
                <input
                    type="text"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <div className='button-container'>
                    <button type="button" className="button" onClick={sendMessage}>Send</button>
                    <button type="button" className="button" onClick={handleExitRoom}>Exit Room</button>
                </div>
            </div>
            <div className="online-users">
                <h3>Online Users</h3>
                <ul>
                    {onlineUsers.map((user, index) => (
                        <li key={index}>{user}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Room;
