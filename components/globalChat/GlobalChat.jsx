'use client'

import React, { useEffect } from 'react';
import socket from '@/lib/socket';



const GlobalChat = () => {
    useEffect(() => {
        const onConnect = () => console.log('Socket connected:', socket.id);
        const onDisconnect = () => console.log('Socket disconnected');

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);

        // Clean up on unmount
        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
        };
    }, []);
    return (
        <div>
            Global Chat will be here
        </div>
    )
}

export default GlobalChat
