import React, { useState } from 'react';
import { postAPI } from '../Services/BasicApi';
import { AuthApi } from '../Services/ApiEndPoint';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // name: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await postAPI<any>(AuthApi.REGISTER, formData);

      console.log('Register Response:', response.data);

      // STORE TOKEN IF RECEIVED
      if (response?.data?.token) {
        localStorage.setItem('token', response.data.token);
        toast.success('Registration Successful');
        navigate('/');
      }
    } catch (error) {
      console.log('Register Error:', error);
      toast.error('Registration Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-6">Register</h1>

        <form className="space-y-5" onSubmit={handleRegister}>
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
            />
          </div> */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
