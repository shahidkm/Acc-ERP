import React, { useState, useMemo, useEffect } from 'react';
import { useGetVendors } from '../hooks/vendorHooks/useGetVendors';
import { 
  Users, 
  Search, 
  Building2, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  XCircle,
  Hash,
  Activity,
  CreditCard,
  Mail,
  Phone,
  MapPin,
  Building,
  Landmark,
  DollarSign,
  Tag,
  FileText,
  User,
  Globe
} from 'lucide-react';
import Sidebar from '../components/sidebar/Sidebar';

const VendorsTable = () => {
  const { data: response, isLoading, error } = useGetVendors();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // ✅ FIX: API already returns an array
  const vendors = response || [];

  // Filter and search functionality
  const filteredVendors = useMemo(() => {
    if (!vendors.length) return [];

    let filtered = vendors.filter(vendor => {
      const matchesSearch = searchTerm === '' || 
        (vendor.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (vendor.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (vendor.vendorId?.toString() || '').includes(searchTerm) ||
        (vendor.phone || '').includes(searchTerm) ||
        (vendor.trn || '').includes(searchTerm) ||
        (vendor.crNumber || '').includes(searchTerm) ||
        (vendor.contactPerson?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (vendor.bankName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (vendor.iban || '').includes(searchTerm);
      
      const matchesCountry = selectedCountry === '' || vendor.country?.toLowerCase() === selectedCountry.toLowerCase();
      const matchesCurrency = selectedCurrency === '' || vendor.currency?.toLowerCase() === selectedCurrency.toLowerCase();
      const matchesStatus = selectedStatus === '' || 
        (selectedStatus === 'active' && vendor.isActive) ||
        (selectedStatus === 'inactive' && !vendor.isActive);
      
      return matchesSearch && matchesCountry && matchesCurrency && matchesStatus;
    });

    // Sort functionality
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (aValue === null || aValue === undefined) aValue = '';
      if (bValue === null || bValue === undefined) bValue = '';
      
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();
      
      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [vendors, searchTerm, selectedCountry, selectedCurrency, selectedStatus, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedVendors = filteredVendors.slice(startIndex, endIndex);

  // Reset page on filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCountry, selectedCurrency, selectedStatus]);

  // Get unique countries and currencies
  const countries = useMemo(() => {
    if (!vendors.length) return [];
    return [...new Set(vendors.map(vendor => vendor.country).filter(Boolean))];
  }, [vendors]);

  const currencies = useMemo(() => {
    if (!vendors.length) return [];
    return [...new Set(vendors.map(vendor => vendor.currency).filter(Boolean))];
  }, [vendors]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3" />;
    return sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-full mx-auto animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="h-12 bg-gray-300 rounded mb-6"></div>
          <div className="h-96 bg-gray-300 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-full mx-auto text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Vendors</h3>
          <p className="text-gray-600">Failed to fetch vendors</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[#f29f67] text-white rounded-lg hover:bg-[#e8935c] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Sidebar/>
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Vendors</h1>
          <p className="text-gray-600 mt-1">Manage and view all vendor information</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, phone, TRN, CR number, contact person..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f29f67] focus:border-[#f29f67]"
              />
            </div>

            {/* Country Filter */}
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg"
            >
              <option value="">All Countries</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>

            {/* Currency Filter */}
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg"
            >
              <option value="">All Currencies</option>
              {currencies.map(currency => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Table */}
        {filteredVendors.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Vendors Found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try adjusting your search terms or filters.' : 'No vendors are available at the moment.'}
            </p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th onClick={() => handleSort('vendorId')} className="px-6 py-4 cursor-pointer">ID {getSortIcon('vendorId')}</th>
                      <th onClick={() => handleSort('name')} className="px-6 py-4 cursor-pointer">Name {getSortIcon('name')}</th>
                      <th className="px-6 py-4">Contact Info</th>
                      <th className="px-6 py-4">Contact Person</th>
                      <th onClick={() => handleSort('country')} className="px-6 py-4 cursor-pointer">Location {getSortIcon('country')}</th>
                      <th className="px-6 py-4">Tax Info</th>
                      <th className="px-6 py-4">Banking</th>
                      <th onClick={() => handleSort('currency')} className="px-6 py-4 cursor-pointer">Currency {getSortIcon('currency')}</th>
                      <th onClick={() => handleSort('isActive')} className="px-6 py-4 cursor-pointer">Status {getSortIcon('isActive')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedVendors.map(vendor => (
                      <tr key={vendor.vendorId}>
                        <td className="px-6 py-4">#{vendor.vendorId}</td>
                        <td className="px-6 py-4">{vendor.name || 'Not specified'}</td>
                        <td className="px-6 py-4">{vendor.email} {vendor.phone}</td>
                        <td className="px-6 py-4">{vendor.contactPerson}</td>
                        <td className="px-6 py-4">{vendor.country}, {vendor.city}</td>
                        <td className="px-6 py-4">TRN: {vendor.trn}, CR: {vendor.crNumber}</td>
                        <td className="px-6 py-4">{vendor.bankName} {vendor.iban}</td>
                        <td className="px-6 py-4">{vendor.currency}</td>
                        <td className="px-6 py-4">{vendor.isActive ? 'Active' : 'Inactive'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 border-t border-gray-200 rounded-b-xl flex justify-between">
                <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default VendorsTable;
