import React, { useState } from "react";
import { Link, useNavigate} from "react-router-dom";
import { signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../components/OAuth";

export default function Signin() {

  const [formData , setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id] : e.target.value});
  } 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/server/auth/signin', {
        method: 'POST',
        headers:{
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if(data.success === false) {
        dispatch(signInFailure(data));
        return;
      }
      dispatch(signInSuccess(data.user));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error));
    }
  };
  
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7 text-white">
        Signin
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          id="email"
          className="bg-white p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="bg-white p-3 rounded-lg"
          onChange={handleChange}
        />
        <button disabled={loading} className="bg-slate-400 text-black p-3 rounded-lg uppercase hover:opacity-85 disabled:opacity-80">
          {loading ? 'Loading....' : 'Sign In'}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p className="text-white">Do not have an account?</p>
        <Link to="/signup">
          <span className="text-blue-500 hover:underline">Sign up</span>
        </Link>
      </div>
      <p className="text-red-700 mt-5">{error ? error.message || 'Something went wrong !' : '' }</p>
    </div>
  );
}
