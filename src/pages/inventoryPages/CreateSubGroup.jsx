import React, { useState } from 'react';
import { useCreateInventorySubGroup } from '../../hooks/inventoryHooks/useCreateInventoryGroup';
import { Save, FolderPlus, Loader2, ArrowLeft, Package } from 'lucide-react';
import Sidebar from "../../components/sidebar/Sidebar"

function CreateSubGroup() {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });

    const createGroupMutation = useCreateInventorySubGroup();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        if (!formData.name.trim()) return;

        createGroupMutation.mutate(formData, {
            onSuccess: () => {
                setFormData({ name: '', description: '' });
            },
            onError: (error) => {
                console.error("Error creating group:", error);
            }
        });
    };

    const handleGoBack = () => {
        // Add navigation logic here - could be history.goBack() or navigate('/inventory-groups')
        console.log('Go back to inventory groups');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <Sidebar />
            <div className="max-w-4xl mx-auto">
                {/* Header with back button */}
                <div className="mb-8">
                    <button
                        onClick={handleGoBack}
                        className="inline-flex items-center text-gray-600 hover:text-[#f29f67] transition-colors mb-4 group"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Inventory SubGroups
                    </button>
                    
                    <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-[#f29f67] to-[#e8935c] p-3 rounded-xl shadow-lg">
                            <Package className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Create Inventory SubGroup</h1>
                            <p className="text-gray-600 mt-1">Add a new category to organize your inventory items</p>
                        </div>
                    </div>
                </div>

                {/* Main Form Container */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Form Header */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <FolderPlus className="h-6 w-6 text-[#f29f67]" />
                            <h2 className="text-xl font-semibold text-gray-900">Sub Group Information</h2>
                        </div>
                        <p className="text-gray-600 mt-2">Fill in the details below to create a new inventory sub group</p>
                    </div>

                    {/* Form Content */}
                    <div className="p-8 space-y-8">
                        {/* Name Field */}
                        <div className="space-y-3">
                            <label className="block text-sm font-semibold text-gray-700">
                                Group Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter a descriptive name for your inventory group"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f29f67] focus:border-[#f29f67] transition-all duration-200 placeholder-gray-400"
                                />
                                {formData.name && (
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    </div>
                                )}
                            </div>
                            {!formData.name.trim() && (
                                <p className="text-sm text-gray-500">This field is required</p>
                            )}
                        </div>

                        {/* Description Field */}
                        <div className="space-y-3">
                            <label className="block text-sm font-semibold text-gray-700">
                                Description
                                <span className="text-gray-400 font-normal ml-1">(Optional)</span>
                            </label>
                            <div className="relative">
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Provide additional details about this inventory group, its purpose, or what items it will contain..."
                                    rows="4"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f29f67] focus:border-[#f29f67] transition-all duration-200 resize-none placeholder-gray-400"
                                />
                                <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                                    {formData.description.length}/500
                                </div>
                            </div>
                        </div>

                        {/* Preview Card */}
                        {(formData.name || formData.description) && (
                            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                <h3 className="text-sm font-semibold text-gray-700 mb-3">Preview</h3>
                                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                                    <div className="flex items-center">
                                        <div className="bg-blue-100 rounded-full p-2 mr-3">
                                            <Package className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900">
                                                {formData.name || 'Group Name'}
                                            </div>
                                            {formData.description && (
                                                <div className="text-sm text-gray-600 mt-1">
                                                    {formData.description}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Form Footer */}
                    <div className="bg-gray-50 px-8 py-6 border-t border-gray-200 flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-600">
                            <div className="flex items-center">
                                <span className="text-red-500 mr-1">*</span>
                                Required fields
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setFormData({ name: '', description: '' })}
                                className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
                            >
                                Reset
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={createGroupMutation.isPending || !formData.name.trim()}
                                className={`inline-flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                    createGroupMutation.isPending || !formData.name.trim()
                                        ? 'bg-gray-400 text-white cursor-not-allowed'
                                        : 'bg-[#f29f67] text-white hover:bg-[#e8935c] focus:ring-[#f29f67] shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                                }`}
                            >
                                {createGroupMutation.isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Create Group
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Success/Error Messages */}
                {createGroupMutation.isSuccess && (
                    <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                            <p className="text-green-800 font-medium">Group created successfully!</p>
                        </div>
                    </div>
                )}

                {createGroupMutation.isError && (
                    <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
                            <p className="text-red-800 font-medium">
                                Error creating group. Please try again.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CreateSubGroup;