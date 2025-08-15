import React, { useState } from 'react';
import { useCreateUnit } from '../hooks/productHooks/unitHooks/useCreateUnit';
import { AlertCircle, CheckCircle } from 'lucide-react';

export default function CreateUnit() {
  const { mutate, isLoading } = useCreateUnit();

  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    description: '',
    entryBy: '',
    isActive: true
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Unit name is required';
    }
    if (!formData.symbol.trim()) {
      newErrors.symbol = 'Symbol is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.entryBy.trim()) {
      newErrors.entryBy = 'Entry by is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus('');

    const createUnitDto = {
      Name: formData.name.trim(),
      Symbol: formData.symbol.trim(),
      Description: formData.description.trim(),
      EntryBy: formData.entryBy.trim(),
      IsActive: formData.isActive
    };

    mutate(createUnitDto, {
      onSuccess: () => {
        setSubmitStatus('success');
        setFormData({
          name: '',
          symbol: '',
          description: '',
          entryBy: '',
          isActive: true
        });
      },
      onError: () => {
        setSubmitStatus('error');
      },
      onSettled: () => {
        setIsSubmitting(false);
      }
    });
  };

  const handleReset = () => {
    setFormData({
      name: '',
      symbol: '',
      description: '',
      entryBy: '',
      isActive: true
    });
    setErrors({});
    setSubmitStatus('');
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Product Unit</h1>
          <p className="text-gray-600">Add a new measurement unit for products in AxisERP</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Unit Information</h2>
          </div>

          <div className="p-6 space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Unit Name <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 ${
                  errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="e.g. Kilogram"
              />
              {errors.name && (
                <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                  <AlertCircle size={16} />
                  {errors.name}
                </div>
              )}
            </div>

            {/* Symbol Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Symbol <span className="text-red-500">*</span>
              </label>
              <input
                name="symbol"
                value={formData.symbol}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 ${
                  errors.symbol ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="e.g. kg"
              />
              {errors.symbol && (
                <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                  <AlertCircle size={16} />
                  {errors.symbol}
                </div>
              )}
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 resize-none ${
                  errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Describe what this unit represents"
              />
              {errors.description && (
                <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                  <AlertCircle size={16} />
                  {errors.description}
                </div>
              )}
            </div>

            {/* EntryBy Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Entry By <span className="text-red-500">*</span>
              </label>
              <input
                name="entryBy"
                value={formData.entryBy}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 ${
                  errors.entryBy ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Your username or ID"
              />
              {errors.entryBy && (
                <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                  <AlertCircle size={16} />
                  {errors.entryBy}
                </div>
              )}
            </div>

            {/* Is Active Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <label className="inline-flex items-center mt-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-600 relative after:absolute after:content-[''] after:h-5 after:w-5 after:bg-white after:border after:border-gray-300 after:rounded-full after:top-[2px] after:left-[2px] peer-checked:after:translate-x-full after:transition-all"></div>
                <span className="ml-3 text-sm text-gray-700">
                  {formData.isActive ? 'Active' : 'Inactive'}
                </span>
              </label>
            </div>

            {/* Submit Status */}
            {submitStatus === 'success' && (
              <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                <CheckCircle size={20} />
                <span>Unit created successfully!</span>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <AlertCircle size={20} />
                <span>Failed to create unit. Please try again.</span>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-3 px-6 rounded-lg transition"
              >
                {isSubmitting ? 'Creating...' : 'Create Unit'}
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={isSubmitting}
                className="flex-1 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg transition"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
