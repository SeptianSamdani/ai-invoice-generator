import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { Edit, FileText, Loader2, Mail, MoreVertical, Plus, Search, Sparkles, Trash2, Eye } from 'lucide-react';
import Button from '../../components/ui/Button';
import CreateWithAIModal from '../../components/invoices/CreateWithAIModal';
import ReminderModal from '../../components/invoices/ReminderModal';
import moment from 'moment';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [statusChangeLoading, setStatusChangeLoading] = useState(null); 
  const [searchTerm, setSearchTerm] = useState(''); 
  const [statusFilter, setStatusFilter] = useState('Semua'); 
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);  
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false); 
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.INVOICE.GET_ALL_INVOICES); 
        setInvoices(response.data.sort((a, b) => new Date(b.invoiceDate) - new Date(a.invoiceDate))); 
      } catch (error) {
        setError('Failed to load invoices.'); 
        console.log(error); 
      } finally {
        setLoading(false); 
      }
    }

    fetchInvoices(); 
  }, []); 
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await axiosInstance.delete(API_PATHS.INVOICE.DELETE_INVOICE(id));
        setInvoices(invoices.filter(invoice => invoice._id !== id)); 
      } catch (error) {
        setError('Failed to delete invoice.')
        console.error(error); 
      }
    }
  }; 

  const handleStatusChange = async (invoice) => {
    setStatusChangeLoading(invoice._id); 
    try {
      const newStatus = invoice.status === 'Lunas' ? 'Belum Lunas' : 'Lunas'; 
      const updatedInvoice = { ...invoice, status: newStatus }; 

      const response = await axiosInstance.put(API_PATHS.INVOICE.UPDATE_INVOICE(invoice._id), updatedInvoice); 

      setInvoices(invoices.map(inv => inv._id === invoice._id ? response.data : inv));
    } catch (error) {
      setError('Failed to update invoice.')
      console.error(error); 
    } finally {
      setStatusChangeLoading(null); 
    }
  }; 

  const handleOpenReminderModal = async (invoiceId) => {
    setSelectedInvoiceId(invoiceId); 
    setIsReminderModalOpen(true);
    setOpenMenuId(null);
  }; 

  const filteredInvoices = useMemo(() => {
    return invoices
      .filter(invoice => statusFilter === "Semua" || invoice.status === statusFilter)
      .filter(invoice => 
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
        invoice.billTo.clientName.toLowerCase().includes(searchTerm.toLowerCase())
      ); 
  }, [invoices, searchTerm, statusFilter]); 

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Lunas':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Menunggu':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-red-100 text-red-700 border-red-200';
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-[400px]'>
        <Loader2 className='w-8 h-8 animate-spin text-slate-900' />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <CreateWithAIModal isOpen={isAIModalOpen} onClose={() => setIsAIModalOpen(false)} />
      <ReminderModal isOpen={isReminderModalOpen} onClose={() => setIsReminderModalOpen(false)} invoiceId={selectedInvoiceId} />
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Invoices</h1>
          <p className="text-sm text-slate-600 mt-1">Manage all your invoices in one place</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant='secondary' 
            onClick={() => setIsAIModalOpen(true)} 
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-900 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            AI Create
          </Button>
          <Button 
            onClick={() => navigate('/invoices/new')} 
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Invoice
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-900 mb-1">Error</h3>
              <p className='text-sm text-red-700'>{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Invoices</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{filteredInvoices.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Paid</p>
              <p className="text-2xl font-bold text-green-700 mt-1">
                {filteredInvoices.filter(inv => inv.status === 'Lunas').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Unpaid</p>
              <p className="text-2xl font-bold text-red-700 mt-1">
                {filteredInvoices.filter(inv => inv.status !== 'Lunas').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white border border-slate-200 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Search className='w-5 h-5' />
            </div>
            <input 
              type='text'
              placeholder='Search by invoice number or client name...'
              className='w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent bg-white text-slate-900 placeholder-slate-400'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Status Filter */}
          <div className="sm:w-48">
            <select 
              className='w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent bg-white text-slate-900'
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value='Semua'>All Status</option>
              <option value='Lunas'>Paid</option>
              <option value='Belum Lunas'>Unpaid</option>
              <option value='Menunggu'>Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Invoices Table/Empty State */}
      {filteredInvoices.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg">
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <FileText className='w-8 h-8 text-slate-400' />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No invoices found</h3>
            <p className="text-sm text-slate-600 mb-6 max-w-md">
              {invoices.length === 0 
                ? "Get started by creating your first invoice" 
                : "Try adjusting your search or filter criteria"}
            </p>
            {invoices.length === 0 && (
              <Button 
                onClick={() => navigate('/invoices/new')} 
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create First Invoice
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Invoice
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.map(invoice => (
                  <tr key={invoice._id} className='hover:bg-slate-50 transition-colors'>
                    <td 
                      onClick={() => navigate(`/invoices/view/${invoice._id}`)} 
                      className='px-6 py-4 cursor-pointer'
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-900">
                            {invoice.invoiceNumber}
                          </div>
                          <div className="text-xs text-slate-500">
                            {moment(invoice.invoiceDate).format('D MMM YYYY')}
                          </div>
                        </div>
                      </div>
                    </td> 
                    <td 
                      onClick={() => navigate(`/invoices/view/${invoice._id}`)} 
                      className='px-6 py-4 cursor-pointer'
                    >
                      <div className="text-sm font-medium text-slate-900">
                        {invoice.billTo.clientName}
                      </div>
                      <div className="text-xs text-slate-500">
                        {invoice.billTo.email}
                      </div>
                    </td> 
                    <td 
                      onClick={() => navigate(`/invoices/view/${invoice._id}`)} 
                      className='px-6 py-4 cursor-pointer'
                    >
                      <div className="text-sm font-bold text-slate-900">
                        {formatCurrency(invoice.total)}
                      </div>
                    </td> 
                    <td 
                      onClick={() => navigate(`/invoices/view/${invoice._id}`)} 
                      className='px-6 py-4 cursor-pointer'
                    >
                      <div className="text-sm text-slate-900">
                        {moment(invoice.dueDate).format('D MMM YYYY')}
                      </div>
                      {moment(invoice.dueDate).isBefore(moment()) && invoice.status !== 'Lunas' && (
                        <div className="text-xs text-red-600 font-medium mt-0.5">Overdue</div>
                      )}
                    </td> 
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(invoice.status)}`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/invoices/view/${invoice._id}`)}
                          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/invoices/edit/${invoice._id}`)}
                          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {invoice.status !== 'Lunas' && (
                          <button
                            onClick={() => handleOpenReminderModal(invoice._id)}
                            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Send Reminder"
                          >
                            <Mail className="w-4 h-4" />
                          </button>
                        )}
                        <div className="relative">
                          <button
                            onClick={() => setOpenMenuId(openMenuId === invoice._id ? null : invoice._id)}
                            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          
                          {openMenuId === invoice._id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-10">
                              <div className="py-1">
                                <button
                                  onClick={() => {
                                    handleStatusChange(invoice);
                                    setOpenMenuId(null);
                                  }}
                                  disabled={statusChangeLoading === invoice._id}
                                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                >
                                  {statusChangeLoading === invoice._id ? 'Updating...' : 
                                    invoice.status === 'Lunas' ? 'Mark as Unpaid' : 'Mark as Paid'}
                                </button>
                                <button
                                  onClick={() => {
                                    handleDelete(invoice._id);
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                  Delete Invoice
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default Invoices