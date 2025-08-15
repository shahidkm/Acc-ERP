import React, { useState, useEffect } from 'react';
import { useCreateCompany } from '../hooks/companyHooks/createCompany';
// import { HashLoader } from 'react-spinners';
// import Navbar from '../../components/ui/common/Navbar';
import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';

function CreateCompany() {
    const { mutate, isLoading, isError, isSuccess } = useCreateCompany();
    const [pageLoading, setPageLoading] = useState(true);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [companyImage, setCompanyImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    // const navigate = useNavigate();

    // Form state - Updated to match DTO
    const [formData, setFormData] = useState({
        Name: '',
        Email: '',
        Phone: '',
        Website: '',
        ContactPerson: '',
        Address: '',
        Country: '',
        Emirate: '',
        City: '',
        ZipCode: '',
        TradeLicenseNumber: '',
        TradeLicenseExpiry: '',
        ChamberOfCommerceNumber: '',
        VATNumber: '',
        IsVATRegistered: false,
        GSTIN: '',
        PAN: '',
        FinancialYearFrom: '',
        BooksBeginFrom: '',
        BaseCurrency: 'AED'
    });

    // Error state
    const [errors, setErrors] = useState({});

    // Generic input handler
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        const validationRules = [
            { field: 'Name', value: formData.Name, message: 'Company name is required' },
            { field: 'Email', value: formData.Email, message: 'Email is required' },
            { field: 'Phone', value: formData.Phone, message: 'Phone number is required' },
            { field: 'Phone', condition: formData.Phone.length > 0 && formData.Phone.length < 10, message: 'Invalid phone number' },
            { field: 'Address', value: formData.Address, message: 'Address is required' },
            { field: 'City', value: formData.City, message: 'City is required' },
            { field: 'Emirate', value: formData.Emirate, message: 'Emirate is required' },
            { field: 'Country', value: formData.Country, message: 'Country is required' },
            { field: 'ZipCode', value: formData.ZipCode, message: 'Zip code is required' },
            { field: 'ZipCode', condition: formData.ZipCode.length > 0 && (formData.ZipCode.length < 3 || formData.ZipCode.length > 10), message: 'Zip code must be 3-10 characters' },
            { field: 'TradeLicenseNumber', value: formData.TradeLicenseNumber, message: 'Trade license number is required' },
            { field: 'TradeLicenseExpiry', value: formData.TradeLicenseExpiry, message: 'Trade license expiry is required' },
            { field: 'GSTIN', condition: formData.GSTIN && !/^[0-9A-Z]{15}$/.test(formData.GSTIN), message: 'Invalid GSTIN format (15 alphanumeric characters)' },
            { field: 'PAN', condition: formData.PAN && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(formData.PAN), message: 'Invalid PAN format (e.g., ABCDE1234F)' },
            { field: 'FinancialYearFrom', value: formData.FinancialYearFrom, message: 'Financial year from is required' },
            { field: 'BooksBeginFrom', value: formData.BooksBeginFrom, message: 'Books begin from is required' },
        ];

        validationRules.forEach(rule => {
            const shouldShowError = rule.condition !== undefined ? rule.condition : !rule.value;
            if (shouldShowError && !newErrors[rule.field]) {
                newErrors[rule.field] = rule.message;
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!validTypes.includes(file.type)) {
                setErrors(prev => ({
                    ...prev,
                    image: 'Please select a valid image file (JPEG, PNG, GIF)'
                }));
                return;
            }

            // Validate file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({
                    ...prev,
                    image: 'Image size should be less than 5MB'
                }));
                return;
            }

            setCompanyImage(file);
            
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);

            // Clear image error if exists
            if (errors.image) {
                setErrors(prev => ({
                    ...prev,
                    image: ''
                }));
            }
        }
    };

    // Remove image handler
    const removeImage = () => {
        setCompanyImage(null);
        setImagePreview(null);
        // Clear the file input
        const fileInput = document.getElementById('companyImage');
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);

        if (validateForm()) {
            const formDataToSubmit = new FormData();
            // Map form fields to DTO properties
            formDataToSubmit.append("UserId","DF64F706-1860-4977-F60D-08DDCCE30B00")
            formDataToSubmit.append('Name', formData.Name);
            formDataToSubmit.append('Email', formData.Email);
            formDataToSubmit.append('Phone', formData.Phone);
            formDataToSubmit.append('Website', formData.Website || '');
            formDataToSubmit.append('ContactPerson', formData.ContactPerson || '');
            formDataToSubmit.append('Address', formData.Address);
            formDataToSubmit.append('Country', formData.Country);
            formDataToSubmit.append('Emirate', formData.Emirate);
            formDataToSubmit.append('City', formData.City);
            formDataToSubmit.append('ZipCode', formData.ZipCode);
            formDataToSubmit.append('TradeLicenseNumber', formData.TradeLicenseNumber);
            formDataToSubmit.append('TradeLicenseExpiry', formData.TradeLicenseExpiry);
            formDataToSubmit.append('ChamberOfCommerceNumber', formData.ChamberOfCommerceNumber || '');
            formDataToSubmit.append('VATNumber', formData.VATNumber || '');
            formDataToSubmit.append('IsVATRegistered', formData.IsVATRegistered);
            formDataToSubmit.append('GSTIN', formData.GSTIN || '');
            formDataToSubmit.append('PAN', formData.PAN || '');
            formDataToSubmit.append('FinancialYearFrom', formData.FinancialYearFrom);
            formDataToSubmit.append('BooksBeginFrom', formData.BooksBeginFrom);
            formDataToSubmit.append('BaseCurrency', formData.BaseCurrency);

            if (companyImage) {
                formDataToSubmit.append('Image', companyImage);
            }

            mutate(formDataToSubmit, {
                onSuccess: (response) => {
                    if (response?.message) {
                        localStorage.setItem("companyId", response.companyId);
                        toast.success(response.message);
                        // navigate("/policy-agreement")
                    } else {
                        toast.success('Submitted successfully!');
                    }
                },
                onError: (error) => {
                    if (error?.response?.data?.message) {
                        toast.error(error.response.data.message);
                    } else {
                        toast.error('Something went wrong. Please try again.');
                    }
                },
            });
        } else {
            toast.error('Please fill in all required fields correctly.');
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => setPageLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    if (isSuccess) {
        // navigate("/policy-agreement")
    }

    return (
        <>
            {/* <Navbar/> */}
            
            <div className="min-h-screen w-full ">
                {/* Full Width Form Section */}
                <div className="w-full p-6 overflow-y-auto mt-12">
                    <div className="max-w-6xl mx-auto py-4">
                        <div className="mb-8 text-center">
                            <h2 className="text-4xl font-bold text-gray-800 mb-3">Create New Company</h2>
                            <div className="w-24 h-1 bg-[#1e1e2c] mx-auto rounded-full mb-4"></div>
                            <p className="text-gray-600 text-lg">Enter your company information to get started</p>
                        </div>

                        <form onSubmit={handleSubmit} className=" rounded-xl  p-8 space-y-8">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Company Details Section */}
                                <div className="lg:col-span-3">
                                    <h3 className="text-xl font-semibold text-gray-700 mb-6 border-b pb-3">Company Details</h3>
                                </div>

                                {/* Company Image Upload */}
                                <div className="lg:col-span-3 flex flex-col w-full">
                                    <label htmlFor="companyImage" className="mb-3 font-medium text-gray-700 text-lg">
                                        Company Logo/Image
                                    </label>
                                    
                                    {/* Image Preview */}
                                    {imagePreview && (
                                        <div className="mb-4 relative inline-block">
                                            <img
                                                src={imagePreview}
                                                alt="Company Logo Preview"
                                                className="w-40 h-40 object-cover rounded-xl border-2 border-gray-300 shadow-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={removeImage}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    )}
                                    
                                    {/* File Input */}
                                    <div className="relative">
                                        <input
                                            type="file"
                                            name="companyImage"
                                            id="companyImage"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                        <label
                                            htmlFor="companyImage"
                                            className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <svg className="w-12 h-12 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                                </svg>
                                                <p className="mb-2 text-base text-gray-500">
                                                    <span className="font-semibold">Click to upload</span> company logo
                                                </p>
                                                <p className="text-sm text-gray-500">PNG, JPG, GIF (MAX. 5MB)</p>
                                            </div>
                                        </label>
                                    </div>
                                    
                                    {errors.image && (
                                        <p className="text-red-600 text-sm mt-2 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                            {errors.image}
                                        </p>
                                    )}
                                </div>

                                {/* Company Name */}
                                <div className="flex flex-col w-full">
                                    <label htmlFor="Name" className="mb-2 font-medium text-gray-700">
                                        Company Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="Name"
                                        id="Name"
                                        placeholder="Enter company name"
                                        value={formData.Name}
                                        onChange={(e) => handleInputChange('Name', e.target.value)}
                                        className="p-4 rounded-lg border border-gray-300 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm text-base"
                                    />
                                    {errors.Name && (
                                        <p className="text-red-600 text-sm mt-1 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                            {errors.Name}
                                        </p>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="flex flex-col w-full">
                                    <label htmlFor="Email" className="mb-2 font-medium text-gray-700">
                                        Email Address <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="Email"
                                        id="Email"
                                        placeholder="company@example.com"
                                        value={formData.Email}
                                        onChange={(e) => handleInputChange('Email', e.target.value)}
                                        className="p-4 rounded-lg border border-gray-300 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm text-base"
                                    />
                                    {errors.Email && (
                                        <p className="text-red-600 text-sm mt-1 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                            {errors.Email}
                                        </p>
                                    )}
                                </div>

                                {/* Phone */}
                                <div className="flex flex-col w-full">
                                    <label htmlFor="Phone" className="mb-2 font-medium text-gray-700">
                                        Phone Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        name="Phone"
                                        id="Phone"
                                        placeholder="Phone number"
                                        value={formData.Phone}
                                        onChange={(e) => handleInputChange('Phone', e.target.value)}
                                        className="p-4 rounded-lg border border-gray-300 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm text-base"
                                    />
                                    {errors.Phone && (
                                        <p className="text-red-600 text-sm mt-1 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                            {errors.Phone}
                                        </p>
                                    )}
                                </div>

                                {/* Website */}
                                <div className="flex flex-col w-full">
                                    <label htmlFor="Website" className="mb-2 font-medium text-gray-700">
                                        Website
                                    </label>
                                    <input
                                        type="url"
                                        name="Website"
                                        id="Website"
                                        placeholder="https://www.company.com"
                                        value={formData.Website}
                                        onChange={(e) => handleInputChange('Website', e.target.value)}
                                        className="p-4 rounded-lg border border-gray-300 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm text-base"
                                    />
                                </div>

                                {/* Contact Person */}
                                <div className="flex flex-col w-full">
                                    <label htmlFor="ContactPerson" className="mb-2 font-medium text-gray-700">
                                        Contact Person
                                    </label>
                                    <input
                                        type="text"
                                        name="ContactPerson"
                                        id="ContactPerson"
                                        placeholder="Contact person name"
                                        value={formData.ContactPerson}
                                        onChange={(e) => handleInputChange('ContactPerson', e.target.value)}
                                        className="p-4 rounded-lg border border-gray-300 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm text-base"
                                    />
                                </div>

                                {/* Address */}
                                <div className="lg:col-span-3 flex flex-col w-full">
                                    <label htmlFor="Address" className="mb-2 font-medium text-gray-700">
                                        Company Address <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        cols="11"
                                        rows="4"
                                        name="Address"
                                        id="Address"
                                        placeholder="Full address"
                                        value={formData.Address}
                                        onChange={(e) => handleInputChange('Address', e.target.value)}
                                        className="p-4 rounded-lg border border-gray-300 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm text-base"
                                    />
                                    {errors.Address && (
                                        <p className="text-red-600 text-sm mt-1 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                            {errors.Address}
                                        </p>
                                    )}
                                </div>

                                {/* Location Details Section */}
                                <div className="lg:col-span-3 mt-4">
                                    <h3 className="text-xl font-semibold text-gray-700 mb-6 border-b pb-3">Location Details</h3>
                                </div>

                                {/* Country */}
                                <div className="flex flex-col w-full">
                                    <label htmlFor="Country" className="mb-2 font-medium text-gray-700">
                                        Country <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="Country"
                                        id="Country"
                                        placeholder="Country"
                                        value={formData.Country}
                                        onChange={(e) => handleInputChange('Country', e.target.value)}
                                        className="p-4 rounded-lg border border-gray-300 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm text-base"
                                    />
                                    {errors.Country && (
                                        <p className="text-red-600 text-sm mt-1 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                            {errors.Country}
                                        </p>
                                    )}
                                </div>

                                {/* Emirate */}
                                <div className="flex flex-col w-full">
                                    <label htmlFor="Emirate" className="mb-2 font-medium text-gray-700">
                                        Emirate <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="Emirate"
                                        id="Emirate"
                                        value={formData.Emirate}
                                        onChange={(e) => handleInputChange('Emirate', e.target.value)}
                                        className="p-4 rounded-lg border border-gray-300 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm text-base"
                                    >
                                        <option value="">Select Emirate</option>
                                        <option value="Abu Dhabi">Abu Dhabi</option>
                                        <option value="Dubai">Dubai</option>
                                        <option value="Sharjah">Sharjah</option>
                                        <option value="Ajman">Ajman</option>
                                        <option value="Umm Al Quwain">Umm Al Quwain</option>
                                        <option value="Ras Al Khaimah">Ras Al Khaimah</option>
                                        <option value="Fujairah">Fujairah</option>
                                    </select>
                                    {errors.Emirate && (
                                        <p className="text-red-600 text-sm mt-1 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                            {errors.Emirate}
                                        </p>
                                    )}
                                </div>

                                {/* City */}
                                <div className="flex flex-col w-full">
                                    <label htmlFor="City" className="mb-2 font-medium text-gray-700">
                                        City <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="City"
                                        id="City"
                                        placeholder="City"
                                        value={formData.City}
                                        onChange={(e) => handleInputChange('City', e.target.value)}
                                        className="p-4 rounded-lg border border-gray-300 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm text-base"
                                    />
                                    {errors.City && (
                                        <p className="text-red-600 text-sm mt-1 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                            {errors.City}
                                        </p>
                                    )}
                                </div>

                                {/* Zip Code */}
                                <div className="flex flex-col w-full">
                                    <label htmlFor="ZipCode" className="mb-2 font-medium text-gray-700">
                                        Zip Code <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="ZipCode"
                                        id="ZipCode"
                                        placeholder="Zip code (3-10 characters)"
                                        value={formData.ZipCode}
                                        onChange={(e) => handleInputChange('ZipCode', e.target.value)}
                                        className="p-4 rounded-lg border border-gray-300 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm text-base"
                                    />
                                    {errors.ZipCode && (
                                        <p className="text-red-600 text-sm mt-1 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                            {errors.ZipCode}
                                        </p>
                                    )}
                                </div>

                                {/* UAE Legal Details Section */}
                                <div className="lg:col-span-3 mt-4">
                                    <h3 className="text-xl font-semibold text-gray-700 mb-6 border-b pb-3">UAE Legal Details</h3>
                                </div>

                                {/* Trade License Number */}
                                <div className="flex flex-col w-full">
                                    <label htmlFor="TradeLicenseNumber" className="mb-2 font-medium text-gray-700">
                                        Trade License Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="TradeLicenseNumber"
                                        id="TradeLicenseNumber"
                                        placeholder="Trade license number"
                                        value={formData.TradeLicenseNumber}
                                        onChange={(e) => handleInputChange('TradeLicenseNumber', e.target.value)}
                                        className="p-4 rounded-lg border border-gray-300 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm text-base"
                                    />
                                    {errors.TradeLicenseNumber && (
                                        <p className="text-red-600 text-sm mt-1 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                            {errors.TradeLicenseNumber}
                                        </p>
                                    )}
                                </div>

                                {/* Trade License Expiry */}
                                <div className="flex flex-col w-full">
                                    <label htmlFor="TradeLicenseExpiry" className="mb-2 font-medium text-gray-700">
                                        Trade License Expiry <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        name="TradeLicenseExpiry"
                                        id="TradeLicenseExpiry"
                                        value={formData.TradeLicenseExpiry}
                                        onChange={(e) => handleInputChange('TradeLicenseExpiry', e.target.value)}
                                        className="p-4 rounded-lg border border-gray-300 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm text-base"
                                    />
                                    {errors.TradeLicenseExpiry && (
                                        <p className="text-red-600 text-sm mt-1 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                            {errors.TradeLicenseExpiry}
                                        </p>
                                    )}
                                </div>

                                {/* Chamber of Commerce Number */}
                                <div className="flex flex-col w-full">
                                    <label htmlFor="ChamberOfCommerceNumber" className="mb-2 font-medium text-gray-700">
                                        Chamber of Commerce Number
                                    </label>
                                    <input
                                        type="text"
                                        name="ChamberOfCommerceNumber"
                                        id="ChamberOfCommerceNumber"
                                        placeholder="Chamber of commerce number"
                                        value={formData.ChamberOfCommerceNumber}
                                        onChange={(e) => handleInputChange('ChamberOfCommerceNumber', e.target.value)}
                                        className="p-4 rounded-lg border border-gray-300 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm text-base"
                                    />
                                </div>

                                {/* VAT Registration */}
                                <div className="flex flex-col w-full">
                                    <label className="mb-2 font-medium text-gray-700">
                                        VAT Registration Status <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex items-center space-x-6">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="IsVATRegistered"
                                                value="true"
                                                checked={formData.IsVATRegistered === true}
                                                onChange={() => handleInputChange('IsVATRegistered', true)}
                                                className="mr-2 w-4 h-4"
                                            />
                                            VAT Registered
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="IsVATRegistered"
                                                value="false"
                                                checked={formData.IsVATRegistered === false}
                                                onChange={() => handleInputChange('IsVATRegistered', false)}
                                                className="mr-2 w-4 h-4"
                                            />
                                            Not VAT Registered
                                        </label>
                                    </div>
                                </div>

                                {/* VAT Number - Only show if VAT registered */}
                                {formData.IsVATRegistered && (
                                    <div className="flex flex-col w-full">
                                        <label htmlFor="VATNumber" className="mb-2 font-medium text-gray-700">
                                            VAT Number
                                        </label>
                                        <input
                                            type="text"
                                            name="VATNumber"
                                            id="VATNumber"
                                            placeholder="VAT number"
                                            value={formData.VATNumber}
                                            onChange={(e) => handleInputChange('VATNumber', e.target.value)}
                                            className="p-4 rounded-lg border border-gray-300 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm text-base"
                                        />
                                    </div>
                                )}

                                {/* International Tax Info Section */}
                                <div className="lg:col-span-3 mt-4">
                                    <h3 className="text-xl font-semibold text-gray-700 mb-6 border-b pb-3">International Tax Info (Optional)</h3>
                                </div>

                                {/* GSTIN */}
                                <div className="flex flex-col w-full">
                                    <label htmlFor="GSTIN" className="mb-2 font-medium text-gray-700">
                                        GSTIN
                                    </label>
                                    <input
                                        type="text"
                                        name="GSTIN"
                                        id="GSTIN"
                                        placeholder="15-character GSTIN (e.g., 22AAAAA0000A1Z5)"
                                        value={formData.GSTIN}
                                        onChange={(e) => handleInputChange('GSTIN', e.target.value.toUpperCase())}
                                        className="p-4 rounded-lg border border-gray-300 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm text-base"
                                    />
                                    {errors.GSTIN && (
                                        <p className="text-red-600 text-sm mt-1 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                            {errors.GSTIN}
                                        </p>
                                    )}
                                </div>

                                {/* PAN */}
                                <div className="flex flex-col w-full">
                                    <label htmlFor="PAN" className="mb-2 font-medium text-gray-700">
                                        PAN
                                    </label>
                                    <input
                                        type="text"
                                        name="PAN"
                                        id="PAN"
                                        placeholder="10-character PAN (e.g., ABCDE1234F)"
                                        value={formData.PAN}
                                        onChange={(e) => handleInputChange('PAN', e.target.value.toUpperCase())}
                                        className="p-4 rounded-lg border border-gray-300 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm text-base"
                                    />
                                    {errors.PAN && (
                                        <p className="text-red-600 text-sm mt-1 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                            {errors.PAN}
                                        </p>
                                    )}
                                </div>

                                {/* Financial Details Section */}
                                <div className="lg:col-span-3 mt-4">
                                    <h3 className="text-xl font-semibold text-gray-700 mb-6 border-b pb-3">Financial Details</h3>
                                </div>

                                {/* Base Currency */}
                                <div className="flex flex-col w-full">
                                    <label htmlFor="BaseCurrency" className="mb-2 font-medium text-gray-700">
                                        Base Currency
                                    </label>
                                    <select
                                        name="BaseCurrency"
                                        id="BaseCurrency"
                                        value={formData.BaseCurrency}
                                        onChange={(e) => handleInputChange('BaseCurrency', e.target.value)}
                                        className="p-4 rounded-lg border border-gray-300 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm text-base"
                                    >
                                        <option value="AED">AED - UAE Dirham</option>
                                        <option value="USD">USD - US Dollar</option>
                                        <option value="EUR">EUR - Euro</option>
                                        <option value="GBP">GBP - British Pound</option>
                                        <option value="INR">INR - Indian Rupee</option>
                                        <option value="SAR">SAR - Saudi Riyal</option>
                                    </select>
                                </div>

                                {/* Financial Year From */}
                                <div className="flex flex-col w-full">
                                    <label htmlFor="FinancialYearFrom" className="mb-2 font-medium text-gray-700">
                                        Financial Year From <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        name="FinancialYearFrom"
                                        id="FinancialYearFrom"
                                        value={formData.FinancialYearFrom}
                                        onChange={(e) => handleInputChange('FinancialYearFrom', e.target.value)}
                                        className="p-4 rounded-lg border border-gray-300 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm text-base"
                                    />
                                    {errors.FinancialYearFrom && (
                                        <p className="text-red-600 text-sm mt-1 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                            {errors.FinancialYearFrom}
                                        </p>
                                    )}
                                </div>

                                {/* Books Begin From */}
                                <div className="flex flex-col w-full">
                                    <label htmlFor="BooksBeginFrom" className="mb-2 font-medium text-gray-700">
                                        Books Begin From <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        name="BooksBeginFrom"
                                        id="BooksBeginFrom"
                                        value={formData.BooksBeginFrom}
                                        onChange={(e) => handleInputChange('BooksBeginFrom', e.target.value)}
                                        className="p-4 rounded-lg border border-gray-300 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm text-base"
                                    />
                                    {errors.BooksBeginFrom && (
                                        <p className="text-red-600 text-sm mt-1 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                            {errors.BooksBeginFrom}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="pt-6">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-[#f29f67] hover:from-blue-600 hover:bg-[#1e1e2c] text-white py-5 px-8 rounded-xl transition-all font-medium text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                                >
                                    {isLoading ? 'Creating Company...' : 'Create Company'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CreateCompany;