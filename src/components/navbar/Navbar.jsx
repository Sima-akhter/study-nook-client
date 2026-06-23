import Link from 'next/link'
import React from 'react'


const Navbar = () => {
  return (
      <div>
          <div className='flex justify-between items-center px-4 py-2 border-b'>
                <h2 className='text-xl'>StudyNook</h2>
          <ul className='flex gap-4'>
              <li>
                 <Link href="/">Home</Link> 
              </li>
              <li>
                  <Link href="/room">Room</Link>
              </li>
              <li>
                  <Link href="/rooms"> Rooms</Link>
              </li>
              <li>
                  <Link href="/addRoom">Add Room</Link>
              </li>
            
              </ul>
              <ul className='flex gap-4'>
                    <li>
                  <Link href="/profile">Profile</Link>
              </li>
                    <li>
                  <Link href="/signin">Sign In</Link>
              </li>
              <li>
                  <Link href="/signup">Sign Up</Link>
              </li>
              </ul>
          </div>
    </div>
  )
}

export default Navbar