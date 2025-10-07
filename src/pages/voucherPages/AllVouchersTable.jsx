import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Eye,
  Calendar,
  FileText,
  DollarSign,
  ChevronDown,
  ChevronUp,
  ArrowUpDown
} from 'lucide-react';

import { useGetAllVouchers } from '../../hooks/voucherHooks/useGetAllVouchers';
import Sidebar from '../../components/sidebar/Sidebar';
const VoucherDetails = ({ voucher, onClose }) => {
  if (!voucher) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getVoucherTypeLabel = (type) => {
    const types = {
      1: 'Payment',
      2: 'Receipt', 
      3: 'Journal',
      4: 'Contra'
    };
    return types[type] || 'Unknown';
  };

  const calculateTotal = (entries) => {
    return entries.reduce((sum, entry) => {
      return entry.entryType === 0 ? sum + entry.amount : sum;
    }, 0);
  };

  const debitEntries = voucher.entries.filter(entry => entry.entryType === 0);
  const creditEntries = voucher.entries.filter(entry => entry.entryType === 1);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-white to-orange-50 px-8 py-6 border-b border-orange-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <FileText className="h-8 w-8 text-[#f29f67]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Voucher Details</h2>
                <p className="text-gray-600 mt-1">#{voucher.voucherNumber}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-orange-100 rounded-lg transition-colors"
            >
              <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Voucher Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-orange-50 to-white p-6 rounded-xl border border-orange-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <FileText className="h-5 w-5 text-[#f29f67]" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Voucher Type</p>
                  <p className="text-lg font-semibold text-gray-900">{getVoucherTypeLabel(voucher.type)}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-white p-6 rounded-xl border border-orange-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-[#f29f67]" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date & Time</p>
                  <p className="text-lg font-semibold text-gray-900">{formatDate(voucher.date)}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-white p-6 rounded-xl border border-orange-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-[#f29f67]" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-lg font-semibold text-gray-900">${calculateTotal(voucher.entries).toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Narration */}
          <div className="bg-white border border-orange-100 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <div className="p-1 bg-orange-100 rounded mr-2">
                <FileText className="h-4 w-4 text-[#f29f67]" />
              </div>
              Narration
            </h3>
            <p className="text-gray-700 bg-orange-50 p-4 rounded-lg">{voucher.narration}</p>
          </div>

          {/* Entries */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Debit Entries */}
            <div className="bg-white border border-orange-100 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <div className="p-1 bg-green-100 rounded mr-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                </div>
                Debit Entries ({debitEntries.length})
              </h3>
              <div className="space-y-3">
                {debitEntries.map((entry, index) => (
                  <div key={entry.id} className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-medium text-green-600">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Ledger ID: {entry.ledgerId}</p>
                        <p className="text-sm text-gray-600">Entry ID: {entry.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">${entry.amount.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">Dr</p>
                    </div>
                  </div>
                ))}
                {debitEntries.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No debit entries</p>
                )}
              </div>
            </div>

            {/* Credit Entries */}
            <div className="bg-white border border-orange-100 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <div className="p-1 bg-red-100 rounded mr-2">
                  <DollarSign className="h-4 w-4 text-red-600" />
                </div>
                Credit Entries ({creditEntries.length})
              </h3>
              <div className="space-y-3">
                {creditEntries.map((entry, index) => (
                  <div key={entry.id} className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-sm font-medium text-red-600">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Ledger ID: {entry.ledgerId}</p>
                        <p className="text-sm text-gray-600">Entry ID: {entry.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-red-600">${entry.amount.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">Cr</p>
                    </div>
                  </div>
                ))}
                {creditEntries.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No credit entries</p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-orange-100">
            <div className="flex items-center space-x-3">
              <button className="inline-flex items-center px-4 py-2 bg-white border border-orange-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-orange-50 transition-colors">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </button>
              <button className="inline-flex items-center px-4 py-2 bg-white border border-orange-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-orange-50 transition-colors">
                <FileText className="h-4 w-4 mr-2" />
                Print
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <button className="inline-flex items-center px-4 py-2 bg-white border border-orange-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-orange-50 transition-colors">
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </button>
              <button className="inline-flex items-center px-4 py-2 bg-[#f29f67] text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const VouchersTable = () => {
  const { data: vouchers, isLoading, error } = useGetAllVouchers();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  // Get voucher type label
  const getVoucherTypeLabel = (type) => {
    const types = {
      1: 'Payment',
      2: 'Receipt',
      3: 'Journal',
      4: 'Contra'
    };
    return types[type] || 'Unknown';
  };

  // Calculate total amount from entries
  const calculateTotal = (entries) => {
    return entries.reduce((sum, entry) => {
      return entry.entryType === 0 ? sum + entry.amount : sum;
    }, 0);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
  };

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    if (!vouchers) return [];
    
    let filtered = vouchers.filter(voucher =>
      voucher.voucherNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voucher.narration.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getVoucherTypeLabel(voucher.type).toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig.key) {
      filtered = [...filtered].sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === 'date') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        } else if (sortConfig.key === 'total') {
          aValue = calculateTotal(a.entries);
          bValue = calculateTotal(b.entries);
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [vouchers, searchTerm, sortConfig]);

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Handle row selection
  const handleRowSelect = (id) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === filteredAndSortedData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredAndSortedData.map(v => v.id)));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f29f67]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        Error loading vouchers: {error.message}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <Sidebar/>
      {/* Voucher Details Modal */}
      {selectedVoucher && (
        <VoucherDetails 
          voucher={selectedVoucher} 
          onClose={() => setSelectedVoucher(null)} 
        />
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-white to-orange-50 px-6 py-4 border-b border-orange-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <FileText className="h-6 w-6 text-[#f29f67]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">All Vouchers</h2>
              <p className="text-sm text-gray-600">{filteredAndSortedData.length} total vouchers</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="inline-flex items-center px-4 py-2 bg-white border border-orange-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-orange-50 hover:border-orange-300 transition-colors">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
            <button className="inline-flex items-center px-4 py-2 bg-[#f29f67] text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              New Voucher
            </button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="px-6 py-4 bg-white border-b border-orange-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search vouchers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-80 border border-orange-200 rounded-lg focus:ring-2 focus:ring-[#f29f67] focus:border-transparent"
              />
            </div>
            <button className="inline-flex items-center px-3 py-2 border border-orange-200 rounded-lg text-sm text-gray-700 hover:bg-orange-50">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
          </div>

          {selectedRows.size > 0 && (
            <div className="flex items-center space-x-2 bg-orange-50 px-3 py-2 rounded-lg">
              <span className="text-sm text-[#f29f67]">{selectedRows.size} selected</span>
              <button className="text-[#f29f67] hover:text-orange-700">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white border-b border-orange-200">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedRows.size === filteredAndSortedData.length && filteredAndSortedData.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-orange-300 text-[#f29f67] focus:ring-[#f29f67]"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('voucherNumber')}
                  className="flex items-center space-x-1 hover:text-[#f29f67]"
                >
                  <span>Voucher #</span>
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('type')}
                  className="flex items-center space-x-1 hover:text-[#f29f67]"
                >
                  <span>Type</span>
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('date')}
                  className="flex items-center space-x-1 hover:text-[#f29f67]"
                >
                  <span>Date</span>
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Narration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('total')}
                  className="flex items-center space-x-1 hover:text-[#f29f67]"
                >
                  <span>Amount</span>
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Entries
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedData.map((voucher, index) => (
              <tr 
                key={voucher.id} 
                className={`hover:bg-orange-50 transition-colors ${
                  selectedRows.has(voucher.id) ? 'bg-orange-50' : index % 2 === 0 ? 'bg-white' : 'bg-orange-25'
                }`}
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedRows.has(voucher.id)}
                    onChange={() => handleRowSelect(voucher.id)}
                    className="rounded border-orange-300 text-[#f29f67] focus:ring-[#f29f67]"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-100 rounded-lg mr-3">
                      <FileText className="h-4 w-4 text-[#f29f67]" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{voucher.voucherNumber}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    voucher.type === 1 ? 'bg-red-100 text-red-800' :
                    voucher.type === 2 ? 'bg-orange-100 text-[#f29f67]' :
                    voucher.type === 3 ? 'bg-orange-100 text-[#f29f67]' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {getVoucherTypeLabel(voucher.type)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    {formatDate(voucher.date)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-900 max-w-xs truncate block">{voucher.narration}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm font-medium text-gray-900">
                    <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                    ${calculateTotal(voucher.entries).toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {voucher.entries.length} entries
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button 
                      className="text-[#f29f67] hover:text-orange-700 p-1 rounded"
                      onClick={() => setSelectedVoucher(voucher)}
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-gray-600 hover:text-[#f29f67] p-1 rounded">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600 p-1 rounded">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="bg-white px-6 py-3 border-t border-orange-100">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {filteredAndSortedData.length} of {vouchers?.length || 0} vouchers
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 text-sm border border-orange-200 rounded hover:bg-orange-50">
              Previous
            </button>
            <button className="px-3 py-1 text-sm border border-orange-200 rounded hover:bg-orange-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VouchersTable;