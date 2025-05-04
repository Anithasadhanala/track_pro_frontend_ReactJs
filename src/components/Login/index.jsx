import React from "react";
import { signInWithGoogle, signInWithGitHub } from "../../integrations/firebase/auth";

  // Function to save user to backend
  const saveUserToBackend = async (user,token) => {
    const obj = JSON.stringify({
      email: user.email,
      full_name: user.displayName,
      oauth_provider: user.providerData[0]?.providerId,
      oauth_id: user.uid,
      fcm_token: '',
      })
    try {
        await fetch('http://127.0.0.1:8000/users', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
              },
            body: obj,
        });
        console.log('User saved to backend');
    } catch (error) {
        console.error('Error saving user to backend:', error);
    }
};

const Login = () => {
  const loginWithGoogle = async () => {
    const result = await signInWithGoogle();
    if (result) {
      const { user, token } = result;
      localStorage.setItem('authToken', token)
      saveUserToBackend(user,token)
    }
  };

  const loginWithGitHub = async () => {
    const result = await signInWithGitHub();
    if (result) {
      const { user, token } = result;
      localStorage.setItem('authToken', token);
      saveUserToBackend(user,token)
      }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign in to your account</h2>
      <button
        onClick={loginWithGoogle}
        className="flex items-center justify-center w-full py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 transition mb-4"
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          className="w-5 h-5 mr-3"
        />
        <span className="text-gray-700 font-medium">Sign in with Google</span>
      </button>
      
      <button
          onClick={loginWithGitHub}
          className="flex items-center justify-center w-full py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 transition"
        >
          <img
            src="https://www.svgrepo.com/show/512317/github-142.svg"
            alt="GitHub"
            className="w-5 h-5 mr-3"
          />
          <span className="text-gray-700 font-medium">Sign in with GitHub</span>
        </button>
    </div>
  </div>
  );
};

export default Login;
