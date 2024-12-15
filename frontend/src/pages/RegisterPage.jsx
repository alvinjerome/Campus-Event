import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiHash } from 'react-icons/fi';
import { toast } from 'sonner';
import api from '../services/api';

const schema = yup.object().shape({
  fullName: yup.string().required('Full name is required'),
  studentId: yup.string().required('Student ID is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  preferences: yup.object().shape({
    academic: yup.boolean(),
    sports: yup.boolean(),
    cultural: yup.boolean(),
    technology: yup.boolean(),
    workshops: yup.boolean(),
    social: yup.boolean()
  })
});

const RegisterPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const response = await api.post('auth/signup', data);
        
        const result = await response.json();
        if (response.ok) {
          localStorage.setItem('token', result.token);
          resolve(result);
        } else {
          reject(new Error(result.message));
        }
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(promise, {
      loading: 'Creating your account...',
      success: (data) => {
        window.location.href = '/events';
        return 'Account created successfully!';
      },
      error: (err) => `Registration failed: ${err.message}`
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('fullName')}
                type="text"
                className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Full Name"
              />
            </div>
            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiHash className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('studentId')}
                type="text"
                className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Student ID"
              />
            </div>
            {errors.studentId && <p className="text-red-500 text-xs mt-1">{errors.studentId.message}</p>}

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('email')}
                type="email"
                className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('password')}
                type="password"
                className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Event Preferences</h3>
            <div className="grid grid-cols-2 gap-4">
              {['academic', 'sports', 'cultural', 'technology', 'workshops', 'social'].map((pref) => (
                <label key={pref} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    {...register(`preferences.${pref}`)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700 capitalize">{pref}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;