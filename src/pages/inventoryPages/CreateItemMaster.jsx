import React, { useState } from 'react';
import { useCreateItemMaster } from '../../hooks/inventoryHooks/useCreateInventoryGroup';
import { Save, Package, Loader2, ArrowLeft, Settings, Info, DollarSign, ToggleLeft, Hash } from 'lucide-react';
import Sidebar from "../../components/sidebar/Sidebar";

function CreateItemMaster() {
    const [formData, setFormData] = useState({
        itemCode: '',
        description: '',
        class: '',
        modelNo: '',
        serialNo: '',
        machineModel: '',
        size: '',
        otherInformation: '',
        groupId: 0,
        subGroupId: 0,
        categoryId: 0,
        subCategoryId: 0,
        dimensionRequired: false,
        batchRequired: false,
        surfaceCost: 0,
        otherCost: 0
    });

    const createItemMasterMutation = useCreateItemMaster();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) || 0 : value
        }));
    };

    const handleSubmit = () => {
        if (!formData.itemCode.trim() || !formData.description.trim()) return;

        // Remove id field as it's auto-generated
        const { id, ...submitData } = formData;
        
        createItemMasterMutation.mutate(submitData, {
            onSuccess: () => {
                setFormData({
                    itemCode: '',
                    description: '',
                    class: '',
                    modelNo: '',
                    serialNo: '',
                    machineModel: '',
                    size: '',
                    otherInformation: '',
                    groupId: 0,
                    subGroupId: 0,
                    categoryId: 0,
                    subCategoryId: 0,
                    dimensionRequired: false,
                    batchRequired: false,
                    surfaceCost: 0,
                    otherCost: 0
                });
            },
            onError: (error) => {
                console.error("Error creating item master:", error);
            }
        });
    };

    const handleGoBack = () => {
        console.log('Go back to item masters');
    };

    const resetForm = () => {
        setFormData({
            itemCode: '',
            description: '',
            class: '',
            modelNo: '',
            serialNo: '',
            machineModel: '',
            size: '',
            otherInformation: '',
            groupId: 0,
            subGroupId: 0,
            categoryId: 0,
            subCategoryId: 0,
            dimensionRequired: false,
            batchRequired: false,
            surfaceCost: 0,
            otherCost: 0
        });
    };

    const isFormValid = formData.itemCode.trim() && formData.description.trim();

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <Sidebar />
            <div className="max-w-6xl mx-auto">
                {/* Header with back button */}
                <div className="mb-8">
                    <button
                        onClick={handleGoBack}
                        className="inline-flex items-center text-gray-600 hover:text-[#f29f67] transition-colors mb-4 group"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Item Masters
                    </button>
                    
                    <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-[#f29f67] to-[#e8935c] p-3 rounded-xl shadow-lg">
                            <Package className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Create Item Master</h1>
                            <p className="text-gray-600 mt-1">Add a new item to your inventory master database</p>
                        </div>
                    </div>
                </div>

                {/* Main Form Container */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Form Header */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <Package className="h-6 w-6 text-[#f29f67]" />
                            <h2 className="text-xl font-semibold text-gray-900">Item Master Information</h2>
                        </div>
                        <p className="text-gray-600 mt-2">Fill in all the required details to create a comprehensive item master record</p>
                    </div>

                    {/* Form Content */}
                    <div className="p-8 space-y-12">
                        {/* Basic Information Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                                <Info className="h-5 w-5 text-blue-600" />
                                <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Item Code */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Item Code <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="text"
                                            name="itemCode"
                                            value={formData.itemCode}
                                            onChange={handleChange}
                                            placeholder="Enter unique item code"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f29f67] focus:border-[#f29f67] transition-all duration-200 placeholder-gray-400"
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Description <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Enter item description"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f29f67] focus:border-[#f29f67] transition-all duration-200 placeholder-gray-400"
                                    />
                                </div>

                                {/* Class */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Class
                                    </label>
                                    <input
                                        type="text"
                                        name="class"
                                        value={formData.class}
                                        onChange={handleChange}
                                        placeholder="Enter item class"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f29f67] focus:border-[#f29f67] transition-all duration-200 placeholder-gray-400"
                                    />
                                </div>

                                {/* Size */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Size
                                    </label>
                                    <input
                                        type="text"
                                        name="size"
                                        value={formData.size}
                                        onChange={handleChange}
                                        placeholder="Enter item size"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f29f67] focus:border-[#f29f67] transition-all duration-200 placeholder-gray-400"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Technical Details Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                                <Settings className="h-5 w-5 text-purple-600" />
                                <h3 className="text-lg font-semibold text-gray-900">Technical Details</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Model No */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Model Number
                                    </label>
                                    <input
                                        type="text"
                                        name="modelNo"
                                        value={formData.modelNo}
                                        onChange={handleChange}
                                        placeholder="Enter model number"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f29f67] focus:border-[#f29f67] transition-all duration-200 placeholder-gray-400"
                                    />
                                </div>

                                {/* Serial No */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Serial Number
                                    </label>
                                    <input
                                        type="text"
                                        name="serialNo"
                                        value={formData.serialNo}
                                        onChange={handleChange}
                                        placeholder="Enter serial number"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f29f67] focus:border-[#f29f67] transition-all duration-200 placeholder-gray-400"
                                    />
                                </div>

                                {/* Machine Model */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Machine Model
                                    </label>
                                    <input
                                        type="text"
                                        name="machineModel"
                                        value={formData.machineModel}
                                        onChange={handleChange}
                                        placeholder="Enter machine model"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f29f67] focus:border-[#f29f67] transition-all duration-200 placeholder-gray-400"
                                    />
                                </div>

                                {/* Other Information */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Other Information
                                    </label>
                                    <textarea
                                        name="otherInformation"
                                        value={formData.otherInformation}
                                        onChange={handleChange}
                                        placeholder="Enter additional information"
                                        rows="3"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f29f67] focus:border-[#f29f67] transition-all duration-200 resize-none placeholder-gray-400"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Classification Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                                <Package className="h-5 w-5 text-green-600" />
                                <h3 className="text-lg font-semibold text-gray-900">Classification</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {/* Group ID */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Group ID
                                    </label>
                                    <input
                                        type="number"
                                        name="groupId"
                                        value={formData.groupId}
                                        onChange={handleChange}
                                        placeholder="0"
                                        min="0"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f29f67] focus:border-[#f29f67] transition-all duration-200 placeholder-gray-400"
                                    />
                                </div>

                                {/* Sub Group ID */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Sub Group ID
                                    </label>
                                    <input
                                        type="number"
                                        name="subGroupId"
                                        value={formData.subGroupId}
                                        onChange={handleChange}
                                        placeholder="0"
                                        min="0"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f29f67] focus:border-[#f29f67] transition-all duration-200 placeholder-gray-400"
                                    />
                                </div>

                                {/* Category ID */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Category ID
                                    </label>
                                    <input
                                        type="number"
                                        name="categoryId"
                                        value={formData.categoryId}
                                        onChange={handleChange}
                                        placeholder="0"
                                        min="0"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f29f67] focus:border-[#f29f67] transition-all duration-200 placeholder-gray-400"
                                    />
                                </div>

                                {/* Sub Category ID */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Sub Category ID
                                    </label>
                                    <input
                                        type="number"
                                        name="subCategoryId"
                                        value={formData.subCategoryId}
                                        onChange={handleChange}
                                        placeholder="0"
                                        min="0"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f29f67] focus:border-[#f29f67] transition-all duration-200 placeholder-gray-400"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Configuration & Costs Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                                <DollarSign className="h-5 w-5 text-emerald-600" />
                                <h3 className="text-lg font-semibold text-gray-900">Configuration & Costs</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {/* Toggle Options */}
                                <div className="space-y-6 col-span-2">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <ToggleLeft className="h-5 w-5 text-blue-600" />
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700">
                                                    Dimension Required
                                                </label>
                                                <p className="text-xs text-gray-500">Track item dimensions</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="dimensionRequired"
                                                checked={formData.dimensionRequired}
                                                onChange={handleChange}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#f29f67]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f29f67]"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <ToggleLeft className="h-5 w-5 text-purple-600" />
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700">
                                                    Batch Required
                                                </label>
                                                <p className="text-xs text-gray-500">Track by batch numbers</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="batchRequired"
                                                checked={formData.batchRequired}
                                                onChange={handleChange}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#f29f67]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f29f67]"></div>
                                        </label>
                                    </div>
                                </div>

                                {/* Surface Cost */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Surface Cost
                                    </label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="number"
                                            name="surfaceCost"
                                            value={formData.surfaceCost}
                                            onChange={handleChange}
                                            placeholder="0.00"
                                            min="0"
                                            step="0.01"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f29f67] focus:border-[#f29f67] transition-all duration-200 placeholder-gray-400"
                                        />
                                    </div>
                                </div>

                                {/* Other Cost */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Other Cost
                                    </label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="number"
                                            name="otherCost"
                                            value={formData.otherCost}
                                            onChange={handleChange}
                                            placeholder="0.00"
                                            min="0"
                                            step="0.01"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f29f67] focus:border-[#f29f67] transition-all duration-200 placeholder-gray-400"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Preview Card */}
                        {(formData.itemCode || formData.description) && (
                            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                <h3 className="text-sm font-semibold text-gray-700 mb-3">Item Preview</h3>
                                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className="bg-gradient-to-br from-[#f29f67] to-[#e8935c] rounded-lg p-3">
                                                <Package className="h-6 w-6 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-semibold text-lg text-gray-900">
                                                    {formData.itemCode || 'ITEM-CODE'}
                                                </div>
                                                <div className="text-gray-600 mb-2">
                                                    {formData.description || 'Item Description'}
                                                </div>
                                                <div className="flex flex-wrap gap-2 text-xs">
                                                    {formData.class && (
                                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                                                            Class: {formData.class}
                                                        </span>
                                                    )}
                                                    {formData.modelNo && (
                                                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
                                                            Model: {formData.modelNo}
                                                        </span>
                                                    )}
                                                    {formData.size && (
                                                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                                                            Size: {formData.size}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-gray-500">Total Cost</div>
                                            <div className="text-lg font-semibold text-gray-900">
                                                ${(formData.surfaceCost + formData.otherCost).toFixed(2)}
                                            </div>
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
                                onClick={resetForm}
                                className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
                            >
                                Reset
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={createItemMasterMutation.isPending || !isFormValid}
                                className={`inline-flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                    createItemMasterMutation.isPending || !isFormValid
                                        ? 'bg-gray-400 text-white cursor-not-allowed'
                                        : 'bg-[#f29f67] text-white hover:bg-[#e8935c] focus:ring-[#f29f67] shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                                }`}
                            >
                                {createItemMasterMutation.isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Create Item Master
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Success/Error Messages */}
                {createItemMasterMutation.isSuccess && (
                    <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                            <p className="text-green-800 font-medium">Item master created successfully!</p>
                        </div>
                    </div>
                )}

                {createItemMasterMutation.isError && (
                    <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
                            <p className="text-red-800 font-medium">
                                Error creating item master. Please try again.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CreateItemMaster;