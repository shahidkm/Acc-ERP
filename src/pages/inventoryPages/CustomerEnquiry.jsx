import React, { useState, useMemo } from 'react';
import {
  Plus,
  Trash2,
  Edit,
  Eye,
  Loader2,
  Search,
  Filter,
  Download,
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import Sidebar from "../../components/sidebar/Sidebar";
import { useNavigate } from 'react-router-dom';
function CustomerEnquiry() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
const navigate=useNavigate();
  // Mock data - replace with actual hook calls
  const [enquiries, setEnquiries] = useState([
    {
      id: 1,
      referenceNo: 'CE-2025-001',
      date: '2025-10-19T09:16:31.045',
      customerId: 5,
      customerName: 'Ahmed Trading Co.',
      salesManId: 2,
      salesmanName: 'John Doe',
      description: 'Request for quotation on bulk orders',
      terms: 'Net 30',
      foreignCurrency: true,
      currency: 'USD',
      currencyRate: '3.67',
      grandTotal: 5000,
      discount: 500,
      subtotal: 4500,
      totalVATAmount: 450,
      netAmount: 4950,
      status: 'pending',
      customerEnquiryItems: [
        {
          id: 1,
          itemId: 10,
          itemName: 'Product A',
          unitId: 1,
          quantity: 100,
          cost: 25,
          taxCode: 'VAT5',
          taxIncluded: true,
          vatAmount: 125,
          total: 2625
        },
        {
          id: 2,
          itemId: 15,
          itemName: 'Product B',
          unitId: 2,
          quantity: 50,
          cost: 50,
          taxCode: 'VAT10',
          taxIncluded: true,
          vatAmount: 325,
          total: 2625
        }
      ]
    },
    {
      id: 2,
      referenceNo: 'CE-2025-002',
      date: '2025-10-18T14:30:00.000',
      customerId: 8,
      customerName: 'Global Enterprises',
      salesManId: 3,
      salesmanName: 'Sarah Smith',
      description: 'Service inquiry for project consultation',
      terms: 'Net 45',
      foreignCurrency: false,
      currency: 'AED',
      currencyRate: '1',
      grandTotal: 15000,
      discount: 0,
      subtotal: 15000,
      totalVATAmount: 1500,
      netAmount: 16500,
      status: 'converted',
      customerEnquiryItems: [
        {
          id: 3,
          itemId: 22,
          itemName: 'Consulting Services',
          unitId: 3,
          quantity: 10,
          cost: 1500,
          taxCode: 'VAT10',
          taxIncluded: false,
          vatAmount: 1500,
          total: 16500
        }
      ]
    }
  ]);

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter(enquiry => {
      const matchesSearch = 
        enquiry.referenceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enquiry.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enquiry.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterStatus === 'all' || enquiry.status === filterStatus;
      
      return matchesSearch && matchesFilter;
    });
  }, [enquiries, searchTerm, filterStatus]);

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      converted: { color: 'bg-green-100 text-green-800', label: 'Converted' },
      rejected: { color: 'bg-red-100 text-red-800', label: 'Rejected' },
      expired: { color: 'bg-gray-100 text-gray-800', label: 'Expired' }
    };
    const config = statusMap[status] || statusMap.pending;
    return config;
  };

  const formatCurrency = (amount, currency = 'AED') => {
    return `${amount.toFixed(2)} ${currency}`;
  };

  const handleViewDetails = (enquiry) => {
    setSelectedEnquiry(enquiry);
  };

  const handleCloseDetails = () => {
    setSelectedEnquiry(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar/>
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Customer Enquiries</h1>
              <p className="text-gray-600 mt-1">Manage and track customer enquiries</p>
            </div>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" onClick={()=>navigate("/customer-enquiry")}>
              <Plus className="h-4 w-4" />
              New Enquiry
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by reference, customer, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="converted">Converted</option>
                <option value="rejected">Rejected</option>
                <option value="expired">Expired</option>
              </select>
            </div>

            <button className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        {/* Enquiries Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Reference No.</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Customer</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Date</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Salesman</th>
                <th className="text-right py-3 px-6 text-sm font-medium text-gray-700">Net Amount</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Status</th>
                <th className="text-center py-3 px-6 text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEnquiries.length > 0 ? (
                filteredEnquiries.map((enquiry) => {
                  const statusConfig = getStatusBadge(enquiry.status);
                  return (
                    <tr key={enquiry.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-6">
                        <div className="font-medium text-gray-900">{enquiry.referenceNo}</div>
                      </td>
                      <td className="py-3 px-6">
                        <div className="text-sm text-gray-900">{enquiry.customerName}</div>
                      </td>
                      <td className="py-3 px-6">
                        <div className="text-sm text-gray-600">
                          {new Date(enquiry.date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        <div className="text-sm text-gray-600">{enquiry.salesmanName}</div>
                      </td>
                      <td className="py-3 px-6 text-right">
                        <div className="font-medium text-gray-900">
                          {formatCurrency(enquiry.netAmount, enquiry.currency)}
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="py-3 px-6">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleViewDetails(enquiry)}
                            className="p-1 text-gray-600 hover:text-blue-600 transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            className="p-1 text-gray-600 hover:text-orange-600 transition-colors"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            className="p-1 text-gray-600 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="py-8 px-6 text-center">
                    <p className="text-gray-500">No enquiries found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-lg font-semibold text-gray-900">Enquiry Details</h2>
              <button
                onClick={handleCloseDetails}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Header Info */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Reference No.</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedEnquiry.referenceNo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(selectedEnquiry.date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Customer</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedEnquiry.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Salesman</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedEnquiry.salesmanName}</p>
                </div>
              </div>

              {/* Description & Terms */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Description</p>
                <p className="text-gray-900">{selectedEnquiry.description}</p>
                <p className="text-sm text-gray-600 mt-3 mb-1">Terms</p>
                <p className="text-gray-900">{selectedEnquiry.terms}</p>
              </div>

              {/* Items Table */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Items</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left py-2 px-3">Item</th>
                        <th className="text-right py-2 px-3">Qty</th>
                        <th className="text-right py-2 px-3">Cost</th>
                        <th className="text-right py-2 px-3">VAT</th>
                        <th className="text-right py-2 px-3">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedEnquiry.customerEnquiryItems.map((item) => (
                        <tr key={item.id} className="border-b border-gray-100">
                          <td className="py-2 px-3 text-gray-900">{item.itemName}</td>
                          <td className="py-2 px-3 text-right text-gray-600">{item.quantity}</td>
                          <td className="py-2 px-3 text-right text-gray-600">{item.cost.toFixed(2)}</td>
                          <td className="py-2 px-3 text-right text-gray-600">{item.vatAmount.toFixed(2)}</td>
                          <td className="py-2 px-3 text-right font-medium text-gray-900">{item.total.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Subtotal</p>
                    <p className="text-lg font-semibold text-gray-900">{formatCurrency(selectedEnquiry.subtotal, selectedEnquiry.currency)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Discount</p>
                    <p className="text-lg font-semibold text-gray-900">{formatCurrency(selectedEnquiry.discount, selectedEnquiry.currency)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total VAT</p>
                    <p className="text-lg font-semibold text-gray-900">{formatCurrency(selectedEnquiry.totalVATAmount, selectedEnquiry.currency)}</p>
                  </div>
                  <div className="pt-2 border-t-2 border-gray-300">
                    <p className="text-sm text-gray-600">Net Amount</p>
                    <p className="text-xl font-bold text-blue-600">{formatCurrency(selectedEnquiry.netAmount, selectedEnquiry.currency)}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Convert to Quotation
                </button>
                <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Edit
                </button>
                <button
                  onClick={handleCloseDetails}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerEnquiry;