import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { AlertCircle, Edit, FileText, Loader2, Mail, Plus, Search, Sparkles, Trash2 } from 'lucide-react';
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
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.INVOICE.GET_ALL_INVOICES); 
        setInvoices(response.data.sort((a, b) => new Date(b.invoiceDate) - new Date(a.invoiceDate))); 
      } catch (error) {
        setError('Gagal memuat faktur.'); 
        console.log(error); 
      } finally {
        setLoading(false); 
      }
    }

    fetchInvoices(); 
  }, []); 
  
  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus faktur ini?')) {
      try {
        await axiosInstance.delete(API_PATHS.INVOICE.DELETE_INVOICE(id));
        setInvoices(invoices.filter(invoice => invoice._id !== id)); 
      } catch (error) {
        setError('Gagal menghapus faktur.')
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
      setError('Gagal memperbarui faktur.')
      console.error(error); 
    } finally {
      setStatusChangeLoading(null); 
    }
  }; 

  const handleOpenReminderModal = async (invoiceId) => {
    setSelectedInvoiceId(invoiceId); 
    setIsReminderModalOpen(true); 
  }; 

  const filteredInvoices = useMemo(() => {
    return invoices
      .filter(invoice => statusFilter === "Semua" || invoice.status === statusFilter)
      .filter(invoice => 
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
        invoice.billTo.clientName.toLowerCase().includes(searchTerm.toLowerCase())
      ); 
  }, [invoices, searchTerm, statusFilter]); 

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-[400px]'>
        <Loader2 className='w-8 h-8 animate-spin text-blue-600' />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <CreateWithAIModal isOpen={isAIModalOpen} onClose={() => setIsAIModalOpen(false)} />
      <ReminderModal isOpen={isReminderModalOpen} onClose={() => setIsReminderModalOpen(false)} invoiceId={selectedInvoiceId} />
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Semua Faktur</h1>
          <p className="text-sm text-slate-600 mt-1">Kelola semua faktur Anda di satu tempat</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant='secondary' onClick={() => setIsAIModalOpen(true)} icon={Sparkles}>
            Buat dengan AI
          </Button>
          <Button onClick={() => navigate('/invoices/new')} icon={Plus}>
            Buat Faktur
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200">
          <div className="flex items-start">
            <AlertCircle className='w-5 h-5 text-red-600 mt-0.5 mr-3' />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-700 mb-1">Kesalahan</h3>
              <p className='text-sm text-red-600'>{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Filters Section */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Search className='w-5 h-5' />
            </div>
            <input 
              type='text'
              placeholder='Cari berdasarkan nomor faktur atau nama klien...'
              className='w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Status Filter */}
          <div className="sm:w-48">
            <select 
              className='w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value='Semua'>Semua Status</option>
              <option value='Lunas'>Lunas</option>
              <option value='Belum Lunas'>Belum Lunas</option>
              <option value='Menunggu'>Menunggu</option>
            </select>
          </div>
        </div>
      </div>

      {/* Invoices Table/Empty State */}
      {filteredInvoices.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-lg border border-slate-200">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <FileText className='w-8 h-8 text-slate-400' />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">Faktur tidak ditemukan</h3>
          <p className="text-sm text-slate-600 mb-4">
            {invoices.length === 0 
              ? "Mulai dengan membuat faktur pertama Anda" 
              : "Coba sesuaikan pencarian atau kriteria filter Anda"}
          </p>
          {invoices.length === 0 && (
            <Button onClick={() => navigate('/invoices/new')} icon={Plus}>
              Buat Faktur Pertama
            </Button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                    No. Faktur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                    Klien
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                    Jumlah
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                    Jatuh Tempo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {filteredInvoices.map(invoice => (
                  <tr key={invoice._id} className='hover:bg-slate-50 transition-colors'>
                    <td 
                      onClick={() => navigate(`/invoices/view/${invoice._id}`)} 
                      className='px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 cursor-pointer hover:text-blue-800'
                    >
                      {invoice.invoiceNumber}
                    </td> 
                    <td 
                      onClick={() => navigate(`/invoices/view/${invoice._id}`)} 
                      className='px-6 py-4 whitespace-nowrap text-sm text-slate-900 cursor-pointer'
                    >
                      {invoice.billTo.clientName}
                    </td> 
                    <td 
                      onClick={() => navigate(`/invoices/view/${invoice._id}`)} 
                      className='px-6 py-4 whitespace-nowrap text-sm text-slate-900 cursor-pointer font-medium'
                    >
                      Rp{invoice.total.toLocaleString('id-ID')}
                    </td> 
                    <td 
                      onClick={() => navigate(`/invoices/view/${invoice._id}`)} 
                      className='px-6 py-4 whitespace-nowrap text-sm text-slate-600 cursor-pointer'
                    >
                      {moment(invoice.dueDate).format('D MMM YYYY')}
                    </td> 
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          invoice.status === 'Lunas' 
                            ? 'bg-green-100 text-green-800' 
                            : invoice.status === 'Menunggu' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button 
                          size='small'
                          variant='secondary'
                          onClick={() => handleStatusChange(invoice)}
                          isLoading={statusChangeLoading === invoice._id}
                        >
                          {invoice.status === 'Lunas' ? 'Tandai Belum Lunas' : 'Tandai Lunas'}
                        </Button>
                        <Button 
                          size='small'
                          variant='ghost'
                          onClick={() => navigate(`/invoices/edit/${invoice._id}`)}
                          title='Ubah Faktur'
                        >
                          <Edit className='w-4 h-4' />
                        </Button>
                        <Button
                          size='small'
                          variant='ghost'
                          onClick={() => handleDelete(invoice._id)}
                          title='Hapus Faktur'
                        >
                          <Trash2 className='w-4 h-4' />
                        </Button>
                        {invoice.status !== 'Lunas' && (
                          <Button 
                            size='small' 
                            variant='ghost' 
                            onClick={() => handleOpenReminderModal(invoice._id)} 
                            title='Kirim Pengingat'
                          >
                            <Mail className='w-4 h-4' />
                          </Button>
                        )}
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