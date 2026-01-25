import React from "react";

export default function AdminLogin() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-6">
        <h1 className="text-xl font-semibold">Admin Login</h1>
        <p className="mt-1 text-sm text-gray-400">We’ll connect auth later.</p>

        <button
          className="mt-6 w-full rounded-xl bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
          onClick={() => alert("Later: login API + save token")}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
