import React from "react";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center font-sans bg-gray-100 px-4">
      <h1 className="text-5xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">
        Oops! The page you're looking for can't be found.
      </p>
      <p className="text-lg text-gray-500 mb-10">
        Perhaps you'd like to return to the{" "}
        <a href="/" className="text-blue-500 hover:underline">
          homepage
        </a>
        ?
      </p>
      <img
        src="https://media.giphy.com/media/l9TlloipE7lT6/giphy.gif" // Replace with your 404 image/gif
        alt="404 - Page Not Found"
        className="max-w-md" // Adjust max-width as needed
      />
    </div>
  );
}

export default NotFound;
