import { useState } from 'react';
import { provider, auth } from '../firebase.ts';
import { serverUrl } from '../conf/conf';
import { signInWithPopup } from "firebase/auth";
import { FcGoogle } from 'react-icons/fc';
import { debounce } from 'lodash';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../app/slices/authSlice.js';
import { RiVerifiedBadgeFill } from 'react-icons/ri';
import { MdCancel } from 'react-icons/md';
import toast, { Toaster } from 'react-hot-toast';

const SignUp = () => {
  const [user_name, setUser_name] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string|null>(null);
  const [passwordError, setPasswordError] = useState<string|null>(null);
  const [usernameError, setUsernameError] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    if (emailError || passwordError || usernameError) return;

    setLoading(true);
    toast.loading("Creating Account");
    try {
      const url = `${serverUrl}/api/user/register`;
      const response = await axios.post(url, { user_name, password, email });
      
      toast.dismiss();
      toast.success("User Created");
      if (response.status === 200) {
        dispatch(login({ token: response.data.token, user: response.data.user }));
      }
      navigate("/");
    } catch (error:any) {
      toast.dismiss();
      if (error.response) toast.error(error.response.data.message);
      else toast.error('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    signInWithPopup(auth, provider).then(async (data2) => {
      const { displayName, email, photoURL } = data2.user;
      try {
        setLoading(true);
        toast.loading("Creating Account");
        const url = `${serverUrl}/api/user/register`;
        const response = await axios.post(url, { user_name: displayName?.split(" ")[0].toLowerCase(), profile_picture: photoURL, email });
        toast.dismiss();
        if (response.status === 200) {
          toast.success("User created");
          dispatch(login({ token: response.data.token, user: response.data.user }));
        }
      } catch (error:any) {
        toast.dismiss();
        if (error.response) toast.error(error.response.data.message);
        else toast.error('An unexpected error occurred. Please try again later.');
      } finally {
        setLoading(false);
      }
    });
  };

  const validateEmail = (email:string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Invalid Email");
      return;
    }
    setEmailError(null);
  };

  const validatePassword = (password:string) => {
    if (password.length < 3) {
      setPasswordError("Password must be at least 3 characters");
      return;
    }
    if (password.length > 20) {
      setPasswordError("Password must not exceed 20 characters");
      return;
    }
    if (password.split(" ").length > 1) {
      setPasswordError("Password must not contain spaces");
      return;
    }
    setPasswordError(null);
  };

  const checkAvailability = async (input:string) => {
    try {
      const url = `${serverUrl}/api/user/name/${input}`;
      const data = await axios.get(url);
      if (!data.data.success) setUsernameError("This username is already taken");
    } catch (error:any) {
      toast.error(error.response.data.data);
    }
  };

  const debouncedCheckAvailability = debounce(checkAvailability, 500);

  const validateUsername = (val:string) => {
    if (val.length < 3) setUsernameError("Min 3 characters");
    else if (val.split(" ").length > 1) setUsernameError("Username must be a single word, no spaces allowed");
    else if (val.length > 20) setUsernameError("Username must not exceed 20 characters");
    else if (!/^[a-z0-9]+$/.test(val)) setUsernameError("Username must contain only lowercase characters and numbers");
    else {
      setUsernameError(null);
      debouncedCheckAvailability(val);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Toaster />
      <div className="m-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden max-w-4xl w-full">
        <div className="flex flex-col md:flex-row">
          {/* Left column: Sign-up form */}
          <div className="w-full md:w-1/2 p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Create an account</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); validateEmail(e.target.value); }}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:text-white"
                    placeholder="Enter your email"
                  />
                  {email.length > 0 && (
                    emailError ? <MdCancel className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-500" />
                      : <RiVerifiedBadgeFill className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                  )}
                </div>
                {emailError && <p className="mt-2 text-sm text-red-600">{emailError}</p>}
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); validatePassword(e.target.value); }}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:text-white"
                    placeholder="Enter your password"
                  />
                  {password.length > 0 && (
                    passwordError ? <MdCancel className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-500" />
                      : <RiVerifiedBadgeFill className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                  )}
                </div>
                {passwordError && <p className="mt-2 text-sm text-red-600">{passwordError}</p>}
              </div>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="username"
                    type="text"
                    value={user_name}
                    onChange={(e) => { setUser_name(e.target.value); validateUsername(e.target.value); }}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:text-white"
                    placeholder="Choose a username"
                  />
                  {user_name.length > 0 && (
                    usernameError ? <MdCancel className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-500" />
                      : <RiVerifiedBadgeFill className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                  )}
                </div>
                {usernameError && <p className="mt-2 text-sm text-red-600">{usernameError}</p>}
              </div>
              <div>
                <button
                  type="submit"
                  disabled={loading || emailError!==null || passwordError!==null || usernameError!==null}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating..." : "Sign Up"}
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
                  onClick={handleGoogleSignUp}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <FcGoogle className="h-5 w-5 mr-2" />
                  Sign up with Google
                </button>
              </div>
            </div>
            <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link to="/signin" className="font-medium text-blue-600 hover:text-blue-500">
                Log in
              </Link>
            </p>
          </div>
          {/* Right column: Image */}
          <div className="hidden md:block w-1/2 bg-cover bg-center" style={{backgroundImage: "url('/api/placeholder/600/800')"}}>
            <div className="h-full flex items-center justify-center p-12 bg-blue-600 bg-opacity-75">
              <div className="max-w-md text-white text-center">
                <h2 className="text-3xl font-bold mb-4">Join INKVERSE Today</h2>
                <p className="text-lg">Share your stories, connect with others, and explore a world of creativity.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;