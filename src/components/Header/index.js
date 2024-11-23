import React from 'react'
import "./styles.css"

function Header () {
    function logoutFunction () {
        alert("You clicked on logout");
    }
  return (
    <div className='navbar'>
      <p className='logo'>Financely</p>
      <p className='logo link ' onClick={logoutFunction}>Logout</p>
    </div>
  )
}

export default Header 
