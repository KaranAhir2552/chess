import React, { useState } from 'react';
import { postAPI } from '../Services/BasicApi';
import { AuthApi } from '../Services/ApiEndPoint';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await postAPI<any>(AuthApi.LOGIN, formData);

      // STORE TOKEN
      if (response?.data?.token) {
        localStorage.setItem('token', response.data.token);
        toast.success('Login Successful');
        return navigate('/');
      }
    } catch (error) {
      console.log('Login Error:', error);
      toast.error('Login Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-6">Login</h1>

        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Login'}
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              New here?{' '}
              <Link to="/register" className="text-black font-semibold hover:underline">
                Register yourself
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
