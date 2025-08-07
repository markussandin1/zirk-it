
"use client";

import React from 'react';

export const FacebookLoginButton = () => {
  return (
    <a 
      href="/api/auth/login/facebook"
      style={{
        display: 'inline-block',
        padding: '12px 24px',
        borderRadius: '8px',
        backgroundColor: '#1877F2',
        color: 'white',
        textDecoration: 'none',
        fontWeight: 'bold',
        fontFamily: 'sans-serif',
        textAlign: 'center',
        cursor: 'pointer',
        border: 'none',
      }}
    >
      Koppla Facebook-sida
    </a>
  );
};
