import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'sonner';
import { FiBriefcase, FiMail, FiPhone, FiFileText, FiUser } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const schema = yup.object().shape({
  fullName: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string()
    .matches(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
    .required('Phone number is required'),
  department: yup.string().required('Department is required'),
  position: yup.string().required('Position is required'),
  reason: yup.string()
    .required('Reason is required')
    .min(100, 'Reason must be at least 100 characters')
    .max(500, 'Reason must not exceed 500 characters'),
});

const BecomeAdmin = () => {
    const { user, refreshUser } = useAuth();
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {   
        email: user?.email,
    }
  });

  const onSubmit = async (data) => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const response = await api.post('auth/request-admin', data);


        if (response.statusText === 'OK') {
          resolve(response?.data?.message);
        } else {
          reject(new Error(response?.data?.message));
        }

        refreshUser();
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(promise, {
      loading: 'Submitting request...',
      success: () => {
        reset();
        return 'Admin request submitted successfully!';
      },
      error: (err) => `Failed to submit request: ${err.message}`
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Request Admin Access
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Please fill out the form below to request administrative privileges
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  {...register('fullName')}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.fullName ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.fullName && (
                <p className="mt-2 text-sm text-red-600">{errors.fullName.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  {...register('email')}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiPhone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  {...register('phone')}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.phone ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="mt-2 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Department
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiBriefcase className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  {...register('department')}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.department ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.department && (
                <p className="mt-2 text-sm text-red-600">{errors.department.message}</p>
              )}
            </div>

            {/* Position */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Position
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiBriefcase className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  {...register('position')}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.position ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.position && (
                <p className="mt-2 text-sm text-red-600">{errors.position.message}</p>
              )}
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Reason for Request
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <FiFileText className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  {...register('reason')}
                  rows={4}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.reason ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Please explain why you need admin access..."
                />
              </div>
              {errors.reason && (
                <p className="mt-2 text-sm text-red-600">{errors.reason.message}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Submit Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BecomeAdmin;
