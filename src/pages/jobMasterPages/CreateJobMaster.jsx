import React, { useState } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import { useNavigate } from 'react-router-dom';
import { useCreateJobMaster } from '../../hooks/jobMasterHooks/jobMasterHooks';
import { useGetCustomers } from '../../hooks/customerHooks/useGetCustomers';
import { useGetSalesmans } from '../../hooks/salesmanHooks/salesmanHooks';
import {
  Save,
  Loader,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Briefcase,
  Calendar,
  User,
  FileText,
  Hash,
  DollarSign,
  MapPin,
  Package,
  Truck,
  Ship,
  Plane,
  Container,
  Users,
  Building,
  Globe,
  Weight,
  FileCheck,
  Target,
  TrendingUp,
  Archive
} from 'lucide-react';

const CreateJobMaster = () => {
  const [formData, setFormData] = useState({
    jobCode: '',
    jobName: '',
    customerId: 0,
    address: '',
    mbL_MAWB: '',
    hbL_HAWB: '',
    loadPort: '',
    dischargePort: '',
    por: '',
    pod: '',
    noOfPieces: 0,
    grossWeight: 0,
    flight_Vessel_Voyage: '',
    chargeableWeight: 0,
    beNumber: '',
    containerNumber: '',
    shipper: '',
    consignee: '',
    openCost: 0,
    openIncome: 0,
    contractAmount: 0,
    salesmanId: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    jobClosed: false
  });

  const navigate = useNavigate();
  const { mutate, isPending, isSuccess, isError, error } = useCreateJobMaster();
  const { data: customers, isLoading: customersLoading } = useGetCustomers();
  const { data: salesmen, isLoading: salesmenLoading } = useGetSalesmans();

  // Common ports for dropdowns
  const commonPorts = [
    'Dubai (DXB)', 'Jebel Ali (JA)', 'Abu Dhabi (AUH)', 'Sharjah (SHJ)',
    'Mumbai (BOM)', 'Chennai (MAA)', 'Delhi (DEL)', 'Kolkata (CCU)',
    'Singapore (SIN)', 'Hong Kong (HKG)', 'Shanghai (PVG)', 'Guangzhou (CAN)',
    'London (LHR)', 'Frankfurt (FRA)', 'Amsterdam (AMS)', 'Paris (CDG)',
    'New York (JFK)', 'Los Angeles (LAX)', 'Chicago (ORD)', 'Miami (MIA)'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
        customerId: parseInt(formData.customerId),
          salesmanId: parseInt(formData.salesmanId),
      noOfPieces: parseInt(formData.noOfPieces) || 0,
      grossWeight: parseFloat(formData.grossWeight) || 0,
      chargeableWeight: parseFloat(formData.chargeableWeight) || 0,
      openCost: parseFloat(formData.openCost) || 0,
      openIncome: parseFloat(formData.openIncome) || 0,
      contractAmount: parseFloat(formData.contractAmount) || 0,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null
    };

    mutate(submitData, {
      onSuccess: () => {
        // navigate('/job-masters');
      },
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <Sidebar />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/job-masters')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Job Masters
          </button>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-br from-[#f29f67] to-[#e8935c] rounded-xl shadow-lg">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Create Job Master
              </h1>
            </div>
            <p className="text-gray-600 text-lg">Create a comprehensive job master for logistics and freight management</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Basic Job Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden">
            <div className="p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#f29f67]" />
                Basic Job Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Job Code */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Hash className="h-4 w-4 text-[#f29f67]" />
                    Job Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.jobCode}
                    onChange={(e) => handleInputChange('jobCode', e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300"
                    placeholder="JOB-2025-001"
                  />
                </div>

                {/* Job Name */}
                <div className="group md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[#f29f67]" />
                    Job Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.jobName}
                    onChange={(e) => handleInputChange('jobName', e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300"
                    placeholder="Enter descriptive job name"
                  />
                </div>

                {/* Customer */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <User className="h-4 w-4 text-[#f29f67]" />
                    Customer <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.customerId}
                    onChange={(e) => handleInputChange('customer', e.target.value)}
                    required
                    disabled={customersLoading}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300 disabled:opacity-50"
                  >
                    <option value="">Select customer...</option>
                    {customers?.map((customer) => (
                      <option key={customer.customerId} value={customer.customerId}>
                        {customer.name} ({customer.code})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Salesman */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4 text-[#f29f67]" />
                    Salesman
                  </label>
                  <select
                    value={formData.salesmanId}
                    onChange={(e) => handleInputChange('salesman', e.target.value)}
                    disabled={salesmenLoading}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300 disabled:opacity-50"
                  >
                    <option value="">Select salesman...</option>
                    {salesmen?.map((salesman) => (
                      <option key={salesman.salesmanId} value={salesman.salesmanId}>
                        {salesman.salesmanName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Address */}
                <div className="group md:col-span-2 lg:col-span-1">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#f29f67]" />
                    Address
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    rows="3"
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300"
                    placeholder="Customer address"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Transportation Details */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden">
            <div className="p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Ship className="h-5 w-5 text-[#f29f67]" />
                Transportation & Documentation
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* MBL/MAWB */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FileCheck className="h-4 w-4 text-[#f29f67]" />
                    MBL/MAWB Number
                  </label>
                  <input
                    type="text"
                    value={formData.mbL_MAWB}
                    onChange={(e) => handleInputChange('mbL_MAWB', e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300"
                    placeholder="Master Bill/Airway Bill"
                  />
                </div>

                {/* HBL/HAWB */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FileCheck className="h-4 w-4 text-[#f29f67]" />
                    HBL/HAWB Number
                  </label>
                  <input
                    type="text"
                    value={formData.hbL_HAWB}
                    onChange={(e) => handleInputChange('hbL_HAWB', e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300"
                    placeholder="House Bill/Airway Bill"
                  />
                </div>

                {/* Flight/Vessel/Voyage */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Plane className="h-4 w-4 text-[#f29f67]" />
                    Flight/Vessel/Voyage
                  </label>
                  <input
                    type="text"
                    value={formData.flight_Vessel_Voyage}
                    onChange={(e) => handleInputChange('flight_Vessel_Voyage', e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300"
                    placeholder="Flight/Vessel number"
                  />
                </div>

                {/* BE Number */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Hash className="h-4 w-4 text-[#f29f67]" />
                    BE Number
                  </label>
                  <input
                    type="text"
                    value={formData.beNumber}
                    onChange={(e) => handleInputChange('beNumber', e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300"
                    placeholder="Bill of Entry number"
                  />
                </div>

                {/* Container Number */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Container className="h-4 w-4 text-[#f29f67]" />
                    Container Number
                  </label>
                  <input
                    type="text"
                    value={formData.containerNumber}
                    onChange={(e) => handleInputChange('containerNumber', e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300"
                    placeholder="Container number"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Port Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden">
            <div className="p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Globe className="h-5 w-5 text-[#f29f67]" />
                Port & Route Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Load Port */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Ship className="h-4 w-4 text-[#f29f67]" />
                    Load Port
                  </label>
                  <select
                    value={formData.loadPort}
                    onChange={(e) => handleInputChange('loadPort', e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300"
                  >
                    <option value="">Select load port...</option>
                    {commonPorts.map((port) => (
                      <option key={port} value={port}>{port}</option>
                    ))}
                  </select>
                </div>

                {/* Discharge Port */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Ship className="h-4 w-4 text-[#f29f67]" />
                    Discharge Port
                  </label>
                  <select
                    value={formData.dischargePort}
                    onChange={(e) => handleInputChange('dischargePort', e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300"
                  >
                    <option value="">Select discharge port...</option>
                    {commonPorts.map((port) => (
                      <option key={port} value={port}>{port}</option>
                    ))}
                  </select>
                </div>

                {/* Port of Receipt */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#f29f67]" />
                    Port of Receipt (POR)
                  </label>
                  <select
                    value={formData.por}
                    onChange={(e) => handleInputChange('por', e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300"
                  >
                    <option value="">Select POR...</option>
                    {commonPorts.map((port) => (
                      <option key={port} value={port}>{port}</option>
                    ))}
                  </select>
                </div>

                {/* Port of Delivery */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#f29f67]" />
                    Port of Delivery (POD)
                  </label>
                  <select
                    value={formData.pod}
                    onChange={(e) => handleInputChange('pod', e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300"
                  >
                    <option value="">Select POD...</option>
                    {commonPorts.map((port) => (
                      <option key={port} value={port}>{port}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Shipment Details */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden">
            <div className="p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Package className="h-5 w-5 text-[#f29f67]" />
                Shipment Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Number of Pieces */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Package className="h-4 w-4 text-[#f29f67]" />
                    Number of Pieces
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.noOfPieces}
                    onChange={(e) => handleInputChange('noOfPieces', e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300"
                    placeholder="0"
                  />
                </div>

                {/* Gross Weight */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Weight className="h-4 w-4 text-[#f29f67]" />
                    Gross Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.grossWeight}
                    onChange={(e) => handleInputChange('grossWeight', e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300"
                    placeholder="0.00"
                  />
                </div>

                {/* Chargeable Weight */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Weight className="h-4 w-4 text-[#f29f67]" />
                    Chargeable Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.chargeableWeight}
                    onChange={(e) => handleInputChange('chargeableWeight', e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Parties Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden">
            <div className="p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Building className="h-5 w-5 text-[#f29f67]" />
                Shipper & Consignee Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Shipper */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Truck className="h-4 w-4 text-[#f29f67]" />
                    Shipper
                  </label>
                  <textarea
                    value={formData.shipper}
                    onChange={(e) => handleInputChange('shipper', e.target.value)}
                    rows="4"
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300"
                    placeholder="Shipper name and address"
                  />
                </div>

                {/* Consignee */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Building className="h-4 w-4 text-[#f29f67]" />
                    Consignee
                  </label>
                  <textarea
                    value={formData.consignee}
                    onChange={(e) => handleInputChange('consignee', e.target.value)}
                    rows="4"
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300"
                    placeholder="Consignee name and address"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden">
            <div className="p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-[#f29f67]" />
                Financial Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Open Cost */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Target className="h-4 w-4 text-[#f29f67]" />
                    Open Cost
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.openCost}
                    onChange={(e) => handleInputChange('openCost', e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300"
                    placeholder="0.00"
                  />
                  <p className="mt-1 text-xs text-gray-500">Expected cost for the job</p>
                </div>

                {/* Open Income */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-[#f29f67]" />
                    Open Income
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.openIncome}
                    onChange={(e) => handleInputChange('openIncome', e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300"
                    placeholder="0.00"
                  />
                  <p className="mt-1 text-xs text-gray-500">Expected revenue from the job</p>
                </div>

                {/* Contract Amount */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-[#f29f67]" />
                    Contract Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.contractAmount}
                    onChange={(e) => handleInputChange('contractAmount', e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300"
                    placeholder="0.00"
                  />
                  <p className="mt-1 text-xs text-gray-500">Total contract value</p>
                </div>
              </div>

              {/* Financial Summary */}
              {(formData.openCost > 0 || formData.openIncome > 0 || formData.contractAmount > 0) && (
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <h4 className="text-sm font-semibold text-blue-900 mb-3">Financial Summary</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/50 rounded-lg p-3">
                      <p className="text-xs text-blue-600">Expected Profit</p>
                      <p className="text-sm font-bold text-blue-900">
                        {formatCurrency((formData.openIncome || 0) - (formData.openCost || 0))}
                      </p>
                    </div>
                    <div className="bg-white/50 rounded-lg p-3">
                      <p className="text-xs text-blue-600">Profit Margin</p>
                      <p className="text-sm font-bold text-blue-900">
                        {formData.openIncome > 0 ? 
                          `${(((formData.openIncome - formData.openCost) / formData.openIncome) * 100).toFixed(1)}%` : 
                          '0%'
                        }
                      </p>
                    </div>
                    <div className="bg-white/50 rounded-lg p-3">
                      <p className="text-xs text-blue-600">Contract vs Income</p>
                      <p className="text-sm font-bold text-blue-900">
                        {formData.contractAmount > 0 && formData.openIncome > 0 ? 
                          `${((formData.openIncome / formData.contractAmount) * 100).toFixed(1)}%` : 
                          'N/A'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Job Timeline */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden">
            <div className="p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#f29f67]" />
                Job Timeline & Status
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Start Date */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#f29f67]" />
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300"
                  />
                </div>

                {/* End Date */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#f29f67]" />
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    min={formData.startDate}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300"
                  />
                  <p className="mt-1 text-xs text-gray-500">Leave blank if job is ongoing</p>
                </div>

                {/* Job Status */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Archive className="h-4 w-4 text-[#f29f67]" />
                    Job Status
                  </label>
                  <div className="flex items-center h-12 px-4 py-3 bg-white border-2 border-gray-200 rounded-xl">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.jobClosed}
                        onChange={(e) => handleInputChange('jobClosed', e.target.checked)}
                        className="w-5 h-5 text-[#f29f67] bg-gray-100 border-gray-300 rounded focus:ring-[#f29f67] focus:ring-2"
                      />
                      <span className="text-sm font-medium text-gray-800">Job Closed</span>
                    </label>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {formData.jobClosed ? 'Job is completed and closed' : 'Job is active and ongoing'}
                  </p>
                </div>
              </div>

              {/* Timeline Summary */}
              {formData.startDate && formData.endDate && (
                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <h4 className="text-sm font-semibold text-green-900 mb-2">Timeline Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/50 rounded-lg p-3">
                      <p className="text-xs text-green-600">Job Duration</p>
                      <p className="text-sm font-bold text-green-900">
                        {Math.ceil((new Date(formData.endDate) - new Date(formData.startDate)) / (1000 * 60 * 60 * 24))} days
                      </p>
                    </div>
                    <div className="bg-white/50 rounded-lg p-3">
                      <p className="text-xs text-green-600">Status</p>
                      <p className="text-sm font-bold text-green-900">
                        {formData.jobClosed ? 'Completed' : 
                         new Date(formData.endDate) < new Date() ? 'Overdue' : 'Scheduled'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Job Master Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/50 rounded-lg p-4">
                <p className="text-sm font-medium text-blue-800">Job Details</p>
                <p className="text-blue-900 font-semibold">
                  {formData.jobCode || 'Not set'} - {formData.jobName || 'Unnamed Job'}
                </p>
                <p className="text-xs text-blue-600">
                  Customer: {formData.customer || 'Not selected'}
                </p>
              </div>
              <div className="bg-white/50 rounded-lg p-4">
                <p className="text-sm font-medium text-blue-800">Route</p>
                <p className="text-blue-900">
                  {formData.loadPort || 'Origin'} → {formData.dischargePort || 'Destination'}
                </p>
                <p className="text-xs text-blue-600">
                  POR: {formData.por || 'N/A'} | POD: {formData.pod || 'N/A'}
                </p>
              </div>
              <div className="bg-white/50 rounded-lg p-4">
                <p className="text-sm font-medium text-blue-800">Financial</p>
                <p className="text-blue-900 font-semibold">
                  Contract: {formatCurrency(formData.contractAmount)}
                </p>
                <p className="text-xs text-blue-600">
                  Expected Profit: {formatCurrency((formData.openIncome || 0) - (formData.openCost || 0))}
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden">
            <div className="p-8">
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => navigate('/job-masters')}
                  className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending || !formData.jobCode || !formData.jobName || !formData.customer}
                  className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-[#f29f67] to-[#e8935c] text-white font-semibold rounded-xl hover:from-[#e8935c] to-[#d17d4a] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {isPending ? (
                    <>
                      <Loader className="animate-spin h-5 w-5 mr-3" />
                      Creating Job Master...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-3" />
                      Create Job Master
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Status Messages */}
        {(isSuccess || isError) && (
          <div className="fixed bottom-6 right-6 z-50 max-w-md">
            {isSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-3 text-green-700">
                  <CheckCircle className="h-6 w-6" />
                  <div>
                    <p className="font-semibold">Success!</p>
                    <p className="text-sm">Job master has been created successfully.</p>
                  </div>
                </div>
              </div>
            )}

            {/* {isError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-3 text-red-700">
                  <AlertCircle className="h-6 w-6" />
                  <div>
                    <p className="font-semibold">Error occurred</p>
                    <p className="text-sm">{error?.message || 'Something went wrong. Please try again.'}</p>
                  </div>
                </div>
              </div>
            )} */}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateJobMaster;