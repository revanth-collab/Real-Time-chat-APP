import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from './socket'; // Ensure you have this socket setup

import "./Home.css"

const Home = () => {
    const [username, setUsername] = useState('');
    const [roomId, setRoomId] = useState('');
    const navigate = useNavigate();

    const joinRoom = () => {
        if (username && roomId) {
            navigate(`/room/${roomId}`, { state: { username } });
            socket.emit('joinRoom', { roomId, username });
        } else {
            alert("Please enter both a username and room ID.");
        }
    };

    return (
        <div className='home-container'>
            <div className='home-main-container'>
                <h1 className='home-heading'>Chat App</h1>
                <input
                    type="text"
                    placeholder="Enter your name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className='input'
                />
                <input
                    type="text"
                    placeholder="Enter room ID"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    className='input'
                />
                <button type="button" className='button' onClick={joinRoom}>Join Room</button>
            </div>
        </div>
    );
};

export default Home;
