// src/components/common/Input.js
import React from 'react';

const Input = ({ placeholder, type = "text", className, onChange, value }) => (
  <input
    className={`input ${className}`}
    type={type}
    placeholder={placeholder}
    onChange={onChange}
    value={value}
  />
);

export default Input;
