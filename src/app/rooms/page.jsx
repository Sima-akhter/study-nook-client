'use client'

import { useEffect, useState } from "react";



const Rooms = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      const res = await fetch('http://localhost:5000/rooms');
      const data = await res.json();
      setRooms(data);
    };

    fetchRooms();
  }, []);

  return (
    <div className='max-w-4xl mx-auto px-4 py-10'>
      <h1 className='text-2xl font-bold text-center mt-10'>Rooms</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
        {rooms.map((room) => (
          <div key={room._id} className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold">{room.roomName}</h2>
            <p className="text-gray-600">Floor: {room.floor}</p>
            <p className="text-gray-600">Capacity: {room.capacity}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rooms;