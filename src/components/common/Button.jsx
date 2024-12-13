// src/components/common/Button.js
import React from 'react';
import './Button.css'
const Button = ({ label, onClick, className, type = "button" }) => (
  <button className={`button ${className}`} onClick={onClick} type={type}>
    {label}
  </button>
);

export default Button;
