import React from 'react';

export default function About() {
  return (
    <div className='px-4 py-12 max-w-2xl mx-auto'>
      <h1 className='text-4xl font-bold  mb-4 text-white'>About</h1>
      <p className='mb-4 text-white'>
        This is a MERN (MongoDB, Express, React, Node.js) stack application with
        authentication. It allows users to sign up, log in, and log out, and
        provides access to protected routes only for authenticated users.
      </p>
      <p className='mb-4 text-white'>
        The front-end of the application is built with React and uses React
        Router for client-side routing. The back-end is built with Node.js and
        Express, and uses MongoDB as the database. Authentication is implemented
        using JSON Web Tokens (JWT).
      </p>
      
    </div>
  );
}