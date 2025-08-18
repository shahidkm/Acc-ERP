import React, { useState } from 'react';
import { useCreateCustomer } from '../hooks/customerHooks/createCustomer';
import { toast } from 'react-toastify';
import Sidebar from '../components/sidebar/Sidebar';
import {  Users } from 'lucide-react';
const CreateCustomer = () => {
  const { mutate, isLoading, isError, isSuccess } = useCreateCustomer();
  
  const [formData, setFormData] = useState({
    customerGroupId: 0,
    name: '',
    phone: '',
    email: '',
    address: '',
    trn: '',
    crNumber: '',
    civilId: '',
    passportNumber: '',
    nationality: '',
    companyName: '',
    industry: '',
    contactPerson: '',
    contactDesignation: '',
    iban: '',
    bankName: '',
    paymentTerms: '',
    currency: '',
    country: '',
    city: '',
    pobox: '',
    region: '',
    isVatRegistered: false,
    vatRegistrationDate: '',
 
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly.');
      return;
    }

    const dataToSubmit = {
      ...formData,
      customerGroupId: parseInt(formData.customerGroupId) || 0,
      vatRegistrationDate: formData.vatRegistrationDate || new Date().toISOString(),
      modifiedDate: new Date().toISOString()
    };
    
    mutate(dataToSubmit, {
      onSuccess: (response) => {
        if (response?.data) {
          toast.success(response.data);
        } else {
          toast.success('Customer created successfully!');
        }
        // Reset form on success
        setFormData({
          customerGroupId: 0,
          name: '',
          phone: '',
          email: '',
          address: '',
          trn: '',
          crNumber: '',
          civilId: '',
          passportNumber: '',
          nationality: '',
          companyName: '',
          industry: '',
          contactPerson: '',
          contactDesignation: '',
          iban: '',
          bankName: '',
          paymentTerms: '',
          currency: '',
          country: '',
          city: '',
          pobox: '',
          region: '',
          isVatRegistered: false,
          vatRegistrationDate: '',

        });
        setErrors({});
      },
      onError: (error) => {
        if (error?.response?.data) {
          toast.error(error?.response.data);
        } else {
          toast.error('Failed to create customer. Please try again.');
        }
      }
    });
  };

  const inputClasses = "w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f29f67] focus:border-transparent transition-all duration-200";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-2";
  const sectionClasses = "bg-gray-50 p-6 rounded-lg border border-gray-200";

  return (
    <div className="min-h-screen bg-white p-6">
        <Sidebar/>
      <div className="max-w-4xl mx-auto">
          

     <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-8">
          <div className="p-8">
            <div className="flex items-center gap-6">
              <div className="p-4 rounded-xl bg-orange-500 shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Create Customer</h1>
                <p className="text-gray-600 mt-2">Create and configure a new customer</p>
              </div>
            </div>
          </div>
        </div>



        <div className="space-y-8">
          {/* Basic Information */}
          <div className={sectionClasses}>
            <h2 className="text-xl font-semibold text-[#f29f67] mb-6">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClasses}>Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={inputClasses}
                  placeholder="Enter customer name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
              </div>

              <div>
                <label className={labelClasses}>Customer Group ID</label>
                <input
                  type="number"
                  name="customerGroupId"
                  value={formData.customerGroupId}
                  onChange={handleInputChange}
                  className={inputClasses}
                  placeholder="Enter group ID"
                />
              </div>

              <div>
                <label className={labelClasses}>Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={inputClasses}
                  placeholder="Enter phone number"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-400">{errors.phone}</p>}
              </div>

              <div>
                <label className={labelClasses}>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={inputClasses}
                  placeholder="Enter email address"
                />
                {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
              </div>

              <div className="md:col-span-2">
                <label className={labelClasses}>Address *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`${inputClasses} h-24 resize-none`}
                  placeholder="Enter full address"
                />
                {errors.address && <p className="mt-1 text-sm text-red-400">{errors.address}</p>}
              </div>
            </div>
          </div>

          {/* Identification Documents */}
          <div className={sectionClasses}>
            <h2 className="text-xl font-semibold text-[#f29f67] mb-6">Identification & Documents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClasses}>TRN</label>
                <input
                  type="text"
                  name="trn"
                  value={formData.trn}
                  onChange={handleInputChange}
                  className={inputClasses}
                  placeholder="Tax Registration Number"
                />
              </div>

              <div>
                <label className={labelClasses}>CR Number</label>
                <input
                  type="text"
                  name="crNumber"
                  value={formData.crNumber}
                  onChange={handleInputChange}
                  className={inputClasses}
                  placeholder="Commercial Registration Number"
                />
              </div>

              <div>
                <label className={labelClasses}>Civil ID</label>
                <input
                  type="text"
                  name="civilId"
                  value={formData.civilId}
                  onChange={handleInputChange}
                  className={inputClasses}
                  placeholder="Civil ID Number"
                />
              </div>

              <div>
                <label className={labelClasses}>Passport Number</label>
                <input
                  type="text"
                  name="passportNumber"
                  value={formData.passportNumber}
                  onChange={handleInputChange}
                  className={inputClasses}
                  placeholder="Passport Number"
                />
              </div>

              <div>
                <label className={labelClasses}>Nationality</label>
                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleInputChange}
                  className={inputClasses}
                  placeholder="Enter nationality"
                />
              </div>
            </div>
          </div>

          {/* Company Information */}
          <div className={sectionClasses}>
            <h2 className="text-xl font-semibold text-[#f29f67] mb-6">Company Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClasses}>Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className={inputClasses}
                  placeholder="Enter company name"
                />
              </div>

              <div>
                <label className={labelClasses}>Industry</label>
                <input
                  type="text"
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  className={inputClasses}
                  placeholder="Enter industry type"
                />
              </div>

              <div>
                <label className={labelClasses}>Contact Person</label>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                  className={inputClasses}
                  placeholder="Contact person name"
                />
              </div>

              <div>
                <label className={labelClasses}>Contact Designation</label>
                <input
                  type="text"
                  name="contactDesignation"
                  value={formData.contactDesignation}
                  onChange={handleInputChange}
                  className={inputClasses}
                  placeholder="Contact person designation"
                />
              </div>
            </div>
          </div>

          {/* Banking & Payment Information */}
          <div className={sectionClasses}>
            <h2 className="text-xl font-semibold text-[#f29f67] mb-6">Banking & Payment</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClasses}>IBAN</label>
                <input
                  type="text"
                  name="iban"
                  value={formData.iban}
                  onChange={handleInputChange}
                  className={inputClasses}
                  placeholder="International Bank Account Number"
                />
              </div>

              <div>
                <label className={labelClasses}>Bank Name</label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleInputChange}
                  className={inputClasses}
                  placeholder="Enter bank name"
                />
              </div>

              <div>
                <label className={labelClasses}>Payment Terms</label>
                <input
                  type="text"
                  name="paymentTerms"
                  value={formData.paymentTerms}
                  onChange={handleInputChange}
                  className={inputClasses}
                  placeholder="e.g., Net 30 days"
                />
              </div>

              <div>
                <label className={labelClasses}>Currency</label>
                <input
                  type="text"
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className={inputClasses}
                  placeholder="e.g., USD, EUR, AED"
                />
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className={sectionClasses}>
            <h2 className="text-xl font-semibold text-[#f29f67] mb-6">Location Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClasses}>Country *</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className={inputClasses}
                  placeholder="Enter country"
                />
                {errors.country && <p className="mt-1 text-sm text-red-400">{errors.country}</p>}
              </div>

              <div>
                <label className={labelClasses}>City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={inputClasses}
                  placeholder="Enter city"
                />
                {errors.city && <p className="mt-1 text-sm text-red-400">{errors.city}</p>}
              </div>

              <div>
                <label className={labelClasses}>PO Box</label>
                <input
                  type="text"
                  name="pobox"
                  value={formData.pobox}
                  onChange={handleInputChange}
                  className={inputClasses}
                  placeholder="Post Office Box"
                />
              </div>

              <div>
                <label className={labelClasses}>Region</label>
                <input
                  type="text"
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
                  className={inputClasses}
                  placeholder="Enter region/state"
                />
              </div>
            </div>
          </div>

          {/* VAT Information */}
          <div className={sectionClasses}>
            <h2 className="text-xl font-semibold text-[#f29f67] mb-6">VAT Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isVatRegistered"
                  checked={formData.isVatRegistered}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded border-gray-300 bg-white text-[#f29f67] focus:ring-[#f29f67] focus:ring-2"
                />
                <label className="ml-3 text-gray-700">VAT Registered</label>
              </div>

              <div>
                <label className={labelClasses}>VAT Registration Date</label>
                <input
                  type="datetime-local"
                  name="vatRegistrationDate"
                  value={formData.vatRegistrationDate.slice(0, 16)}
                  onChange={handleInputChange}
                  className={inputClasses}
                />
              </div>
            </div>
          </div>

        
          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
              onClick={() => {
                if (window.confirm('Are you sure you want to cancel? All data will be lost.')) {
                  // Reset form or navigate away
                  setFormData({
                    customerGroupId: 0,
                    name: '',
                    phone: '',
                    email: '',
                    address: '',
                    trn: '',
                    crNumber: '',
                    civilId: '',
                    passportNumber: '',
                    nationality: '',
                    companyName: '',
                    industry: '',
                    contactPerson: '',
                    contactDesignation: '',
                    iban: '',
                    bankName: '',
                    paymentTerms: '',
                    currency: '',
                    country: '',
                    city: '',
                    pobox: '',
                    region: '',
                    isVatRegistered: false,
                    vatRegistrationDate: '',
                    modifiedBy: '',
                    modifiedDate: new Date().toISOString()
                  });
                  setErrors({});
                }
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={handleSubmit}
              className="px-8 py-3 bg-[#f29f67] text-white rounded-lg font-semibold hover:bg-[#e8935c] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
            >
              {isLoading ? 'Creating...' : 'Create Customer'}
            </button>
          </div>

          {isError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">
                Error creating customer. Please check the form and try again.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateCustomer;