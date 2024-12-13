// src/components/common/Card.js
import React from 'react';

const Card = ({ title, description, children, className }) => (
  <div className={`card ${className}`}>
    <h3>{title}</h3>
    <p>{description}</p>
    {children}
  </div>
);

export default Card;
