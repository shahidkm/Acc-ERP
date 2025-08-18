import React from 'react';
import { 
  Phone, Mail, User, Building2, MapPin, CreditCard, 
  Edit3, History, Download, CheckCircle, XCircle, 
  FileText, Globe, Calendar, Hash, Banknote, ArrowRight,
  Briefcase, Home
} from 'lucide-react';
import { useGetCustomerById } from '../hooks/customerHooks/useGetCustomerById';
import Sidebar from '../components/sidebar/Sidebar';

const CustomerDetails = () => {
  const { data: customer, isLoading, error } = useGetCustomerById();

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const DetailCard = ({ title, icon: Icon, children, className = "" }) => (
    <div className={`bg-white rounded-xl border border-gray-200/60 p-6 shadow-sm hover:shadow-md transition-all duration-300 ${className}`}>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
          <Icon className="w-5 h-5 text-orange-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      {children}
    </div>
  );

  const InfoField = ({ label, value, span = false }) => (
    <div className={span ? "md:col-span-2" : ""}>
      <dt className="text-sm font-medium text-gray-600 mb-1">{label}</dt>
      <dd className="text-gray-900 bg-gray-50/50 px-3 py-2 rounded-lg text-sm border border-gray-100">
        {value || 'Not specified'}
      </dd>
    </div>
  );

  const StatusTag = ({ active, label, icon: Icon }) => (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
      active 
        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
        : 'bg-gray-50 text-gray-600 border border-gray-200'
    }`}>
      <Icon className="w-3.5 h-3.5" />
      {label}
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50/50 to-white flex items-center justify-center">
        <Sidebar />
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading customer details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50/50 to-white flex items-center justify-center">
        <Sidebar />
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to load customer</h2>
          <p className="text-gray-600 mb-6">{error.message}</p>
          <button 
            className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50/50 to-white">
      <Sidebar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white rounded-xl border border-gray-200/60 shadow-sm p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                  {customer?.name?.charAt(0) || 'C'}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    {customer?.name || customer?.companyName}
                  </h1>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {customer?.industry}
                    </span>
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    <span className="flex items-center gap-1">
                      <Home className="w-4 h-4" />
                      {customer?.country}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <StatusTag 
                  active={customer?.isActive} 
                  label={customer?.isActive ? 'Active Account' : 'Inactive'} 
                  icon={customer?.isActive ? CheckCircle : XCircle}
                />
                <StatusTag 
                  active={customer?.isVatRegistered} 
                  label={customer?.isVatRegistered ? 'VAT Registered' : 'No VAT'} 
                  icon={FileText}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          
          {/* Contact Info */}
          <DetailCard title="Contact Details" icon={Phone}>
            <dl className="grid md:grid-cols-2 gap-4 text-sm">
              <InfoField label="Phone" value={customer?.phone} />
              <InfoField label="Email" value={customer?.email} />
              <InfoField label="Contact Person" value={customer?.contactPerson} />
              <InfoField label="Position" value={customer?.contactDesignation} />
              <InfoField label="Address" value={customer?.address} span />
            </dl>
          </DetailCard>

          {/* Business Info */}
          <DetailCard title="Business Information" icon={Building2}>
            <dl className="grid md:grid-cols-2 gap-4 text-sm">
              <InfoField label="Company" value={customer?.companyName} />
              <InfoField label="Industry" value={customer?.industry} />
              <InfoField label="TRN" value={customer?.trn} />
              <InfoField label="CR Number" value={customer?.crNumber} />
              <InfoField label="VAT Date" value={formatDate(customer?.vatRegistrationDate)} span />
            </dl>
          </DetailCard>

          {/* Personal Details */}
          <DetailCard title="Personal Information" icon={User}>
            <dl className="grid md:grid-cols-2 gap-4 text-sm">
              <InfoField label="Civil ID" value={customer?.civilId} />
              <InfoField label="Passport" value={customer?.passportNumber} />
              <InfoField label="Nationality" value={customer?.nationality} />
            </dl>
          </DetailCard>

          {/* Location */}
          <DetailCard title="Location" icon={MapPin}>
            <dl className="grid md:grid-cols-2 gap-4 text-sm">
              <InfoField label="Country" value={customer?.country} />
              <InfoField label="City" value={customer?.city} />
              <InfoField label="Region" value={customer?.region} />
              <InfoField label="P.O. Box" value={customer?.pobox} />
            </dl>
          </DetailCard>

        </div>

        {/* Banking - Full Width */}
        <DetailCard title="Banking & Payment" icon={CreditCard} className="mb-8">
          <dl className="grid md:grid-cols-4 gap-4 text-sm">
            <InfoField label="Bank" value={customer?.bankName} />
            <InfoField label="Currency" value={customer?.currency} />
            <InfoField label="Payment Terms" value={customer?.paymentTerms} />
            <InfoField label="IBAN" value={customer?.iban} />
          </dl>
        </DetailCard>

        {/* Actions */}
        <div className="bg-white rounded-xl border border-gray-200/60 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Actions</h3>
          <div className="flex flex-wrap gap-3">
            <button className="group flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200">
              <Edit3 className="w-4 h-4" />
              Edit Details
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            
            <button className="group flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-lg font-medium border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-all duration-200">
              <History className="w-4 h-4" />
              View History
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            
            <button className="group flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-lg font-medium border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-all duration-200">
              <Download className="w-4 h-4" />
              Export
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CustomerDetails;