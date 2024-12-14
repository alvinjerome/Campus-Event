import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FiCalendar, FiClock, FiMapPin, FiUsers, FiImage, FiAlertCircle, FiX } from 'react-icons/fi';
import { toast } from 'sonner';
import api from '../services/api';

const schema = yup.object().shape({
  title: yup.string().required('Event title is required'),
  description: yup.string()
    .required('Description is required')
    .min(20, 'Description must be at least 20 characters'),
  date: yup.string().required('Event date is required'),
  time: yup.string().required('Event time is required'),
  location: yup.string().required('Location is required'),
  capacity: yup.number()
    .required('Capacity is required')
    .min(1, 'Capacity must be at least 1'),
  category: yup.string()
    .required('Category is required')
    .oneOf(['academic', 'social', 'sports', 'cultural', 'technology', 'other']),
  isPrivate: yup.boolean()
});

const CreateEvent = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      isPrivate: false,
    }
  });

  // Convert image to base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  // Handle image change
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5242880) { // 5MB limit
        toast.error('File size should be less than 5MB');
        return;
      }

      try {
        const base64 = await convertToBase64(file);
        setImageBase64(base64);
        setImagePreview(URL.createObjectURL(file));
        toast.success('Image uploaded successfully');
      } catch (error) {
        toast.error('Error processing image');
      }
    }
  };

  // Remove image
  const removeImage = () => {
    setImagePreview(null);
    setImageBase64('');
  };

  const onSubmit = async (data) => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const eventData = {
          title: data.title,
          description: data.description,
          date: data.date,
          time: data.time,
          location: data.location,
          capacity: parseInt(data.capacity),
          category: data.category,
          imageBase64: imageBase64,
          isPrivate: data.isPrivate
        };

        const response = await api.post('events', eventData);

        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.message || 'Failed to create event');
        }

        resolve(result);
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(promise, {
      loading: 'Creating event...',
      success: (data) => {
        reset();
        setImagePreview(null);
        setImageBase64('');
        return 'Event created successfully!';
      },
      error: (err) => `Failed to create event: ${err.message}`
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center">Create New Event</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Fill in the details below to create a new campus event
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Title Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Event Title
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="text"
                  {...register('title')}
                  className={`block w-full px-3 py-2 border ${
                    errors.title ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="Enter event title"
                />
                {errors.title && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <FiAlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                )}
              </div>
              {errors.title && (
                <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Date and Time Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Event Date
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiCalendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    {...register('date')}
                    className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                {errors.date && (
                  <p className="mt-2 text-sm text-red-600">{errors.date.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Event Time
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiClock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="time"
                    {...register('time')}
                    className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                {errors.time && (
                  <p className="mt-2 text-sm text-red-600">{errors.time.message}</p>
                )}
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Event Image (Max 5MB)
              </label>
              {!imagePreview ? (
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <FiImage className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="image" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <span>Upload a file</span>
                        <input
                          id="image"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-1 relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Location and Category Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    {...register('location')}
                    className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter location"
                  />
                </div>
                {errors.location && (
                  <p className="mt-2 text-sm text-red-600">{errors.location.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  {...register('category')}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">Select a category</option>
                  <option value="academic">Academic</option>
                  <option value="sports">Sports</option>
                  <option value="cultural">Cultural</option>
                  <option value="technology">Technology</option>
                  <option value="workshops">Workshops</option>
                  <option value="social">Social</option>
                </select>
                {errors.category && (
                  <p className="mt-2 text-sm text-red-600">{errors.category.message}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <div className="mt-1">
                <textarea
                  {...register('description')}
                  rows={4}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Describe your event..."
                />
              </div>
              {errors.description && (
                <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Capacity and Registration Deadline Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Capacity
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUsers className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    {...register('capacity')}
                    className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Maximum attendees"
                  />
                </div>
                {errors.capacity && (
                  <p className="mt-2 text-sm text-red-600">{errors.capacity.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Registration Deadline
                </label>
                <input
                  type="datetime-local"
                  {...register('registrationDeadline')}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {errors.registrationDeadline && (
                  <p className="mt-2 text-sm text-red-600">{errors.registrationDeadline.message}</p>
                )}
              </div>
            </div>

            {/* Private Event Toggle */}
            <div className="flex items-center">
              <input
                type="checkbox"
                {...register('isPrivate')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Make this a private event
              </label>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {isLoading ? 'Creating Event...' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;