'use client'
import { FieldError, TextField, Label, Input, TextArea, Button } from '@heroui/react'
import React from 'react'

const AddRoom = () => {


  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const roomData = Object.fromEntries(formData.entries());
    
    console.log(roomData);

    const res = await fetch('http://localhost:5000/rooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(roomData),
    });

    const result = await res.json();
    console.log(result);

    // Handle form submission logic here
  }

  return (
    <div className='max-w-4xl mx-auto px-4 py-10'>
      <h1 className='text-2xl font-bold text-center mt-10'>Add Room</h1>
      <form
        onSubmit={handleSubmit}
        className="p-10 space-y-8">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

    {/* Room Name */}
    <div className="md:col-span-2">
      <TextField name="roomName" isRequired>
        <Label>Room Name</Label>
        <Input
          placeholder="Conference Room A"
          className="rounded-2xl"
        />
        <FieldError />
      </TextField>
    </div>

    {/* Floor */}
    <TextField name="floor" type="number" isRequired>
      <Label>Floor</Label>
      <Input
        type="number"
        placeholder="3"
        className="rounded-2xl"
      />
      <FieldError />
    </TextField>

    {/* Capacity */}
    <TextField name="capacity" type="number" isRequired>
      <Label>Capacity</Label>
      <Input
        type="number"
        placeholder="20"
        className="rounded-2xl"
      />
      <FieldError />
    </TextField>

    {/* Hourly Rate */}
    <TextField name="hourlyRate" type="number" isRequired>
      <Label>Hourly Rate (৳)</Label>
      <Input
        type="number"
        placeholder="500"
        className="rounded-2xl"
      />
      <FieldError />
    </TextField>

    {/* Image URL */}
    <div className="md:col-span-2">
      <TextField name="imageUrl" isRequired>
        <Label>Image URL</Label>
        <Input
          type="url"
          placeholder="https://example.com/room.jpg"
          className="rounded-2xl"
        />
        <FieldError />
      </TextField>
    </div>

    {/* Amenities */}
    <div className="md:col-span-2">
      <Label className="block mb-3 text-sm font-medium">
        Amenities
      </Label>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="amenities" value="Whiteboard" />
          Whiteboard
        </label>

        <label className="flex items-center gap-2">
          <input type="checkbox" name="amenities" value="Projector" />
          Projector
        </label>

        <label className="flex items-center gap-2">
          <input type="checkbox" name="amenities" value="Wi-Fi" />
          Wi-Fi
        </label>

        <label className="flex items-center gap-2">
          <input type="checkbox" name="amenities" value="Power Outlets" />
          Power Outlets
        </label>

        <label className="flex items-center gap-2">
          <input type="checkbox" name="amenities" value="Quiet Zone" />
          Quiet Zone
        </label>

        <label className="flex items-center gap-2">
          <input type="checkbox" name="amenities" value="Air Conditioning" />
          Air Conditioning
        </label>
      </div>
    </div>

    {/* Description */}
    <div className="md:col-span-2">
      <TextField name="description" isRequired>
        <Label>Description</Label>
        <TextArea
          placeholder="Describe the room facilities..."
          className="rounded-3xl"
        />
        <FieldError />
      </TextField>
    </div>

  </div>

  <Button
    type="submit"
    variant="outline"
    className="w-full bg-cyan-500 text-white rounded-none"
  >
    Add Room
  </Button>
</form>
    </div>
  )
}

export default AddRoom