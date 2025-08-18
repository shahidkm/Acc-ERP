import React, { useState, useEffect } from 'react';
import { useCreateCustomerGroup } from '../hooks/customerHooks/createCustomerGroup';
import { toast } from 'react-toastify';
import Sidebar from '../components/sidebar/Sidebar';
import {  Users } from 'lucide-react';
function CreateCustomerGroup() {
    const { mutate, isLoading, isError, isSuccess } = useCreateCustomerGroup();
    const [pageLoading, setPageLoading] = useState(true);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        groupName: '',
        description: '',
        groupType: '',
        industry: '',
     
        isActive: true,
       
        preferredCommunicationChannel: '',
        notes: ''
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
            { field: 'groupName', value: formData.groupName, message: 'Group name is required' },
            { field: 'description', value: formData.description, message: 'Description is required' },
            { field: 'groupType', value: formData.groupType, message: 'Group type is required' },
            { field: 'industry', value: formData.industry, message: 'Industry is required' },
            
            { field: 'preferredCommunicationChannel', value: formData.preferredCommunicationChannel, message: 'Preferred communication channel is required' }
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

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);

        if (validateForm()) {
            const dataToSubmit = {
                ...formData,
                memberCount: parseInt(formData.memberCount) || 0,
                totalRevenue: parseFloat(formData.totalRevenue) || 0,
                averageOrderValue: parseFloat(formData.averageOrderValue) || 0,
                priorityLevel: parseInt(formData.priorityLevel) || 0
            };

            mutate(dataToSubmit, {
                onSuccess: (response) => {
                    if (response?.data) {
                        toast.success(response.data);
                    } else {
                        toast.success('Customer group created successfully!');
                    }
                    // Reset form on success
                    setFormData({
                        groupName: '',
                        description: '',
                        groupType: '',
                        industry: '',
                     
                        preferredCommunicationChannel: '',
                        notes: ''
                    });
                    setErrors({});
                },
                onError: (error) => {
                    if (error?.response?.data) {
                        toast.error(error.response.data);
                    } else {
                        toast.error('Failed to create customer group. Please try again.');
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

    return (
        <div className="min-h-screen w-full bg-white">
            <Sidebar/>
            <div className="w-full p-6 overflow-y-auto mt-12">
                <div className="max-w-6xl mx-auto py-4">
                   

   <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-8">
          <div className="p-8">
            <div className="flex items-center gap-6">
              <div className="p-4 rounded-xl bg-orange-500 shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Create Customer Group</h1>
                <p className="text-gray-600 mt-2">Create and configure a new customer group</p>
              </div>
            </div>
          </div>
        </div>


                    <div className="rounded-xl p-8 space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Basic Information Section */}
                            <div className="lg:col-span-3">
                                <h3 className="text-xl font-semibold text-gray-700 mb-6 border-b pb-3">Basic Information</h3>
                            </div>

                            {/* Group Name */}
                            <div className="flex flex-col w-full">
                                <label htmlFor="groupName" className="mb-2 font-medium text-gray-700">
                                    Group Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="groupName"
                                    id="groupName"
                                    placeholder="Enter group name"
                                    value={formData.groupName}
                                    onChange={(e) => handleInputChange('groupName', e.target.value)}
                                    className="p-4 rounded-lg border border-gray-300 w-full focus:ring-2 focus:ring-[#f29f67] focus:border-[#f29f67] transition-all shadow-sm text-base"
                                />
                                {errors.groupName && (
                                    <p className="text-red-600 text-sm mt-1 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        {errors.groupName}
                                    </p>
                                )}
                            </div>

                            {/* Group Type */}
                            <div className="flex flex-col w-full">
                                <label htmlFor="groupType" className="mb-2 font-medium text-gray-700">
                                    Group Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="groupType"
                                    id="groupType"
                                    value={formData.groupType}
                                    onChange={(e) => handleInputChange('groupType', e.target.value)}
                                    className="p-4 rounded-lg border border-gray-300 w-full focus:ring-2 focus:ring-[#f29f67] focus:border-[#f29f67] transition-all shadow-sm text-base"
                                >
                                    <option value="">Select Group Type</option>
                                    <option value="Corporate">Corporate</option>
                                    <option value="Individual">Individual</option>
                                    <option value="Small Business">Small Business</option>
                                    <option value="Enterprise">Enterprise</option>
                                    <option value="Startup">Startup</option>
                                    <option value="Government">Government</option>
                                    <option value="Non-Profit">Non-Profit</option>
                                </select>
                                {errors.groupType && (
                                    <p className="text-red-600 text-sm mt-1 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        {errors.groupType}
                                    </p>
                                )}
                            </div>

                            {/* Industry */}
                            <div className="flex flex-col w-full">
                                <label htmlFor="industry" className="mb-2 font-medium text-gray-700">
                                    Industry <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="industry"
                                    id="industry"
                                    value={formData.industry}
                                    onChange={(e) => handleInputChange('industry', e.target.value)}
                                    className="p-4 rounded-lg border border-gray-300 w-full focus:ring-2 focus:ring-[#f29f67] focus:border-[#f29f67] transition-all shadow-sm text-base"
                                >
                                    <option value="">Select Industry</option>
                                    <option value="Technology">Technology</option>
                                    <option value="Healthcare">Healthcare</option>
                                    <option value="Finance">Finance</option>
                                    <option value="Education">Education</option>
                                    <option value="Retail">Retail</option>
                                    <option value="Manufacturing">Manufacturing</option>
                                    <option value="Construction">Construction</option>
                                    <option value="Real Estate">Real Estate</option>
                                    <option value="Hospitality">Hospitality</option>
                                    <option value="Transportation">Transportation</option>
                                    <option value="Energy">Energy</option>
                                    <option value="Agriculture">Agriculture</option>
                                    <option value="Media">Media</option>
                                    <option value="Telecommunications">Telecommunications</option>
                                    <option value="Other">Other</option>
                                </select>
                                {errors.industry && (
                                    <p className="text-red-600 text-sm mt-1 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        {errors.industry}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="lg:col-span-3 flex flex-col w-full">
                                <label htmlFor="description" className="mb-2 font-medium text-gray-700">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    cols="11"
                                    rows="4"
                                    name="description"
                                    id="description"
                                    placeholder="Enter group description"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    className="p-4 rounded-lg border border-gray-300 w-full focus:ring-2 focus:ring-[#f29f67] focus:border-[#f29f67] transition-all shadow-sm text-base"
                                />
                                {errors.description && (
                                    <p className="text-red-600 text-sm mt-1 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                        
                            

                

                        

                            {/* Group Settings Section */}
                            <div className="lg:col-span-3 mt-4">
                                <h3 className="text-xl font-semibold text-gray-700 mb-6 border-b pb-3">Group Settings</h3>
                            </div>

                      

                            {/* Preferred Communication Channel */}
                            <div className="flex flex-col w-full">
                                <label htmlFor="preferredCommunicationChannel" className="mb-2 font-medium text-gray-700">
                                    Preferred Communication Channel <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="preferredCommunicationChannel"
                                    id="preferredCommunicationChannel"
                                    value={formData.preferredCommunicationChannel}
                                    onChange={(e) => handleInputChange('preferredCommunicationChannel', e.target.value)}
                                    className="p-4 rounded-lg border border-gray-300 w-full focus:ring-2 focus:ring-[#f29f67] focus:border-[#f29f67] transition-all shadow-sm text-base"
                                >
                                    <option value="">Select Communication Channel</option>
                                    <option value="Email">Email</option>
                                    <option value="Phone">Phone</option>
                                    <option value="SMS">SMS</option>
                                    <option value="WhatsApp">WhatsApp</option>
                                    <option value="Telegram">Telegram</option>
                                    <option value="In-App">In-App Notification</option>
                                    <option value="Postal Mail">Postal Mail</option>
                                </select>
                                {errors.preferredCommunicationChannel && (
                                    <p className="text-red-600 text-sm mt-1 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        {errors.preferredCommunicationChannel}
                                    </p>
                                )}
                            </div>

                            {/* Is Active */}
                            <div className="flex flex-col w-full">
                                <label className="mb-2 font-medium text-gray-700">
                                    Group Status
                                </label>
                                <div className="flex items-center space-x-6">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="isActive"
                                            value="true"
                                            checked={formData.isActive === true}
                                            onChange={() => handleInputChange('isActive', true)}
                                            className="mr-2 w-4 h-4 text-[#f29f67] focus:ring-[#f29f67]"
                                        />
                                        Active
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="isActive"
                                            value="false"
                                            checked={formData.isActive === false}
                                            onChange={() => handleInputChange('isActive', false)}
                                            className="mr-2 w-4 h-4 text-[#f29f67] focus:ring-[#f29f67]"
                                        />
                                        Inactive
                                    </label>
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="lg:col-span-3 flex flex-col w-full">
                                <label htmlFor="notes" className="mb-2 font-medium text-gray-700">
                                    Notes
                                </label>
                                <textarea
                                    cols="11"
                                    rows="4"
                                    name="notes"
                                    id="notes"
                                    placeholder="Additional notes about this customer group"
                                    value={formData.notes}
                                    onChange={(e) => handleInputChange('notes', e.target.value)}
                                    className="p-4 rounded-lg border border-gray-300 w-full focus:ring-2 focus:ring-[#f29f67] focus:border-[#f29f67] transition-all shadow-sm text-base"
                                />
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="w-full bg-[#f29f67] hover:bg-[#e8935c] text-white py-5 px-8 rounded-xl transition-all font-medium text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                            >
                                {isLoading ? 'Creating Customer Group...' : 'Create Customer Group'}
                            </button>
                        </div>

                        {isError && (
                            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-600">
                                    Error creating customer group. Please check the form and try again.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateCustomerGroup;