import { useState } from 'react';
import { provider, auth } from '../firebase.ts';
import { serverUrl } from '../conf/conf';
import { signInWithPopup } from "firebase/auth";
import { FcGoogle } from 'react-icons/fc';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../app/slices/authSlice.js';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  function validateEmail(email:string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Fill All the fields");
      return;
    }
    if (!validateEmail(email)) {
      toast.error("Invalid Email");
      return;
    }
    setLoading(true);
    toast.loading("Signing In");
    try {
      const url = `${serverUrl}/api/user/login`;
      const response = await axios.post(url, { password, email });
      if (response.status === 200) {
        toast.dismiss();
        toast.success("Login Success");
        const { token, user } = response.data;
        dispatch(login({ token, user }));
      }
    } catch (error:any) {
      if (error.response) toast.error(error.response.data.message);
      else toast.error('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  function googleAuth() {
    signInWithPopup(auth, provider).then(async (data2) => {
      toast.loading("Signing in");
      const { email } = data2.user;
      try {
        setLoading(true);
        const response = await axios.post(`${serverUrl}/api/user/signin`, { email, google: true });
        toast.dismiss();
        if (response.status === 200) {
          toast.success("Login Success!");
          const { token, user } = response.data;
          dispatch(login({ token, user }));
        }
      } catch (error:any) {
        toast.dismiss();
        if (error.response) toast.error(error.response.data.message);
        else toast.error('An unexpected error occurred. Please try again later.');
      } finally {
        setLoading(false);
      }
    });
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Toaster />
      <div className="m-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden max-w-4xl w-full">
        <div className="flex flex-col md:flex-row">
          {/* Left column: Sign-in form */}
          <div className="w-full md:w-1/2 p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Log in to your account</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:text-white"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:text-white"
                  placeholder="Enter your password"
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {loading ? "Logging in..." : "Log in"}
                </button>
              </div>
            </form>
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or continue with</span>
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={googleAuth}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <FcGoogle className="h-5 w-5 mr-2" />
                  Sign in with Google
                </button>
              </div>
            </div>
            <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
              Need an account?{" "}
              <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                Create an account
              </Link>
            </p>
          </div>
          {/* Right column: Image */}
          <div className="hidden md:block w-1/2 bg-cover bg-center" style={{backgroundImage: "url('/api/placeholder/600/800')"}}>
            <div className="h-full flex items-center justify-center p-12 bg-blue-600 bg-opacity-75">
              <div className="max-w-md text-white text-center">
                <h2 className="text-3xl font-bold mb-4">Welcome to INKVERSE</h2>
                <p className="text-lg">Discover a world of stories, ideas, and creativity.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;