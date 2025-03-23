import React from 'react'
import Search from '../Search'
import { IoMdNotificationsOutline } from "react-icons/io";
import { RiAccountCircleLine } from "react-icons/ri";
import { Drawer, DrawerBody, DrawerContent, DrawerHeader, useDisclosure } from '@chakra-ui/react';
import { RiMenu3Fill } from "react-icons/ri";
import { Link } from 'react-router';
const Header = () => {
  const navItems = [
    {
      name: 'Tutorial',
      slug: '/tutorail',
      active: true,
    },
    {
      name: 'Practice',
      slug: '/practice', 
    },
    {
      name: 'Contest',
      slug: '/contest',
    },
    
  ];
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <nav className='flex justify-between items-center bg-gray-900 px-2 py-2 drop-shadow-xl shadow-white'>
        <div className='max-md:hidden'>
          <ul className='flex justify-center items-center gap-6 pl-10'>
            <li className='text-white text-lg'>
              <Link to={'/'}>Home</Link>
            </li>
            <li className='text-white text-lg'>
              <Link to={'/tutorial'}>Tutorial</Link>
            </li>
            <li className='text-white text-lg'>
              <Link to={'/practice'} >Practice</Link>
            </li>
            <li className='text-white text-lg'>
              <Link to={'/contest'}>Contest</Link>
            </li>
          </ul>
        </div>
        <center className='text-4xl text-white max-md:flex max-md:justify-center'><Link to={'/'}>CoderHaveli</Link></center>
        <div className='max-md:hidden'>
          <ul className='flex items-center justify-evenly gap-6 pr-4'>
            <li><Search /></li>
            <li className='cursor-pointer'><button className='cursor-pointer'><IoMdNotificationsOutline size={30} color='white' /></button></li>
            <li><button className='cursor-pointer'><RiAccountCircleLine size={35} color='white' /></button></li>
          </ul>
        </div>
        <div onClick={onOpen} className='min-md:hidden'><RiMenu3Fill size={35} color='white'/></div>
      </nav>

      {/* Drawer Component */}
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
      {/* <DrawerOverlay /> */}
      <DrawerContent className="bg-gray-900 shadow-lg transition-all transform duration-100 ease-linear w-screen">
        <DrawerHeader  className="text-white text-4xl bg-gray-900 py-4 text-center">
          CoderHaveli
        </DrawerHeader>
        <DrawerBody className="bg-gray-950 h-full p-4 relative flex flex-col items-center ">
          <ul className="space-y-4">
            {navItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => {
                    onClose();
                  }}
                  className="w-full text-left px-4 py-3 rounded-md text-white flex items-center transition duration-200 ease-in-out text-xl"
                >
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={onClose}
            className="absolute mt-4 w-1/2 py-2 text-white bg-red-500 hover:bg-red-600 rounded-md transition duration-500 ease-in-out bottom-1"
          >
            Close
          </button>
        </DrawerBody>
      </DrawerContent>
    </Drawer>

    </>
  )
}

export default Header