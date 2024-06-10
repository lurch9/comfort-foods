// src/components/ProtectedComponent.jsx
import React from 'react';

const ProtectedComponent = () => {
  return (
    <div>
      <h1>Protected Page</h1>
      <p>This page is only accessible to logged-in users.</p>
    </div>
  );
};

export default ProtectedComponent;

