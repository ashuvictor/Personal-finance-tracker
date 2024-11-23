import React from 'react'
import "./styles.css";
function Button({text,onClick,blue}) {
  return (
    <div onClick={onClick } className={blue ? "btn btn-blue": "btn"}>
      {text}
    </div>
  )
}

export default Button
