import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, 
  Calendar, 
  Download, 
  Edit, 
  Loader2, 
  Mail, 
  MapPin, 
  Phone, 
  Printer, 
  Trash2,
  User
} from 'lucide-react';
import Button from '../../components/ui/Button';
import ReminderModal from '../../components/invoices/ReminderModal';
import moment from 'moment';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const invoiceRef = useRef(null);

  useEffect(() => {
    const fetchInvoiceDetail = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.INVOICE.GET_INVOICES_BY_ID(id));
        setInvoice(response.data);
      } catch (error) {
        toast.error('Gagal memuat detail invoice');
        console.error(error);
        navigate('/invoices');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoiceDetail();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus invoice ini?')) {
      setDeleteLoading(true);
      try {
        await axiosInstance.delete(API_PATHS.INVOICE.DELETE_INVOICE(id));
        toast.success('Invoice berhasil dihapus');
        navigate('/invoices');
      } catch (error) {
        toast.error('Gagal menghapus invoice');
        console.error(error);
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  const handlePrint = () => {
    const printContent = invoiceRef.current;
    const originalContents = document.body.innerHTML;
    const printContents = printContent.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  const handleDownload = async () => {
    setDownloadLoading(true);
    try {
      const element = invoiceRef.current;
      
      // Clone element to avoid modifying original
      const clonedElement = element.cloneNode(true);
      clonedElement.style.position = 'absolute';
      clonedElement.style.left = '-9999px';
      document.body.appendChild(clonedElement);
      
      // Capture element as canvas
      const canvas = await html2canvas(clonedElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        allowTaint: true,
        foreignObjectRendering: false,
        imageTimeout: 0
      });
      
      // Remove cloned element
      document.body.removeChild(clonedElement);

      // Calculate PDF dimensions
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Save PDF
      pdf.save(`Invoice-${invoice.invoiceNumber}.pdf`);
      toast.success('Invoice berhasil diunduh');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Gagal mengunduh invoice');
    } finally {
      setDownloadLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-[400px]'>
        <Loader2 className='w-8 h-8 animate-spin text-blue-600' />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[400px] gap-4'>
        <p className='text-slate-600'>Invoice tidak ditemukan</p>
        <Button onClick={() => navigate('/invoices')} icon={ArrowLeft}>
          Kembali ke Daftar Invoice
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <ReminderModal 
        isOpen={isReminderModalOpen} 
        onClose={() => setIsReminderModalOpen(false)} 
        invoiceId={id} 
      />

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print">
        <Button 
          variant='ghost' 
          onClick={() => navigate('/invoices')} 
          icon={ArrowLeft}
        >
          Kembali ke Daftar Invoice
        </Button>

        <div className="flex items-center gap-2 flex-wrap">
          {invoice.status !== 'Paid' && (
            <Button 
              variant='secondary' 
              onClick={() => setIsReminderModalOpen(true)} 
              icon={Mail}
            >
              Kirim Pengingat
            </Button>
          )}
          <Button 
            variant='ghost' 
            onClick={handlePrint} 
            icon={Printer}
          >
            Cetak
          </Button>
          <Button 
            variant='ghost' 
            onClick={handleDownload}
            isLoading={downloadLoading}
            icon={Download}
          >
            Unduh PDF
          </Button>
          <Button 
            variant='ghost' 
            onClick={() => navigate(`/invoices/edit/${id}`)} 
            icon={Edit}
          >
            Edit
          </Button>
          <Button 
            variant='ghost' 
            onClick={handleDelete} 
            isLoading={deleteLoading}
            icon={Trash2}
          >
            Hapus
          </Button>
        </div>
      </div>

      {/* Invoice Container - This will be printed/downloaded */}
      <div ref={invoiceRef} className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden" style={{backgroundColor: '#ffffff'}}>
        {/* Invoice Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">INVOICE</h1>
              <p className="text-blue-100">#{invoice.invoiceNumber}</p>
            </div>
            <div className="text-right">
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                invoice.status === 'Paid' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-red-500 text-white'
              }`}>
                {invoice.status === 'Paid' ? 'Lunas' : 'Belum Lunas'}
              </span>
            </div>
          </div>
        </div>

        {/* Invoice Body */}
        <div className="p-8 space-y-8">
          {/* From & To Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* From */}
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase mb-3">Dari</h3>
              <div className="space-y-2">
                <p className="text-lg font-semibold text-slate-900">
                  {invoice.billFrom?.businessName || 'Tidak Ada'}
                </p>
                {invoice.billFrom?.email && (
                  <p className="flex items-center gap-2 text-sm text-slate-600">
                    <Mail className='w-4 h-4' />
                    {invoice.billFrom.email}
                  </p>
                )}
                {invoice.billFrom?.phone && (
                  <p className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone className='w-4 h-4' />
                    {invoice.billFrom.phone}
                  </p>
                )}
                {invoice.billFrom?.address && (
                  <p className="flex items-start gap-2 text-sm text-slate-600">
                    <MapPin className='w-4 h-4 mt-0.5' />
                    <span>{invoice.billFrom.address}</span>
                  </p>
                )}
              </div>
            </div>

            {/* To */}
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase mb-3">Tagihan Kepada</h3>
              <div className="space-y-2">
                <p className="text-lg font-semibold text-slate-900">
                  {invoice.billTo?.clientName || 'Tidak Ada'}
                </p>
                {invoice.billTo?.email && (
                  <p className="flex items-center gap-2 text-sm text-slate-600">
                    <Mail className='w-4 h-4' />
                    {invoice.billTo.email}
                  </p>
                )}
                {invoice.billTo?.phone && (
                  <p className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone className='w-4 h-4' />
                    {invoice.billTo.phone}
                  </p>
                )}
                {invoice.billTo?.address && (
                  <p className="flex items-start gap-2 text-sm text-slate-600">
                    <MapPin className='w-4 h-4 mt-0.5' />
                    <span>{invoice.billTo.address}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Date Information */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg">
            <div>
              <p className="text-xs text-slate-500 mb-1">Tanggal Invoice</p>
              <p className="text-sm font-medium text-slate-900 flex items-center gap-2">
                <Calendar className='w-4 h-4' />
                {moment(invoice.invoiceDate).format('D MMM YYYY')}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Tanggal Jatuh Tempo</p>
              <p className="text-sm font-medium text-slate-900 flex items-center gap-2">
                <Calendar className='w-4 h-4' />
                {moment(invoice.dueDate).format('D MMM YYYY')}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Syarat Pembayaran</p>
              <p className="text-sm font-medium text-slate-900">
                {invoice.paymentTerms || 'Net 15'}
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <h3 className="text-sm font-semibold text-slate-500 uppercase mb-4">Daftar Item</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-slate-200">
                    <th className="text-left py-3 px-2 text-xs font-semibold text-slate-600 uppercase">
                      Deskripsi
                    </th>
                    <th className="text-center py-3 px-2 text-xs font-semibold text-slate-600 uppercase">
                      Jumlah
                    </th>
                    <th className="text-right py-3 px-2 text-xs font-semibold text-slate-600 uppercase">
                      Harga Satuan
                    </th>
                    <th className="text-center py-3 px-2 text-xs font-semibold text-slate-600 uppercase">
                      Pajak (%)
                    </th>
                    <th className="text-right py-3 px-2 text-xs font-semibold text-slate-600 uppercase">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items?.map((item, index) => (
                    <tr key={index} className="border-b border-slate-100">
                      <td className="py-4 px-2">
                        <p className="font-medium text-slate-900">{item.name}</p>
                      </td>
                      <td className="py-4 px-2 text-center text-slate-700">
                        {item.quantity}
                      </td>
                      <td className="py-4 px-2 text-right text-slate-700">
                        Rp {item.unitPrice.toLocaleString('id-ID')}
                      </td>
                      <td className="py-4 px-2 text-center text-slate-700">
                        {item.taxPercent || 0}%
                      </td>
                      <td className="py-4 px-2 text-right font-medium text-slate-900">
                        Rp {item.total.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-full sm:w-80 space-y-3">
              <div className="flex justify-between py-2 border-b border-slate-200">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-medium text-slate-900">
                  Rp {invoice.subtotal?.toLocaleString('id-ID') || '0'}
                </span>
              </div>
              
              {invoice.taxTotal > 0 && (
                <div className="flex justify-between py-2 border-b border-slate-200">
                  <span className="text-slate-600">Total Pajak</span>
                  <span className="font-medium text-slate-900">
                    Rp {invoice.taxTotal?.toLocaleString('id-ID')}
                  </span>
                </div>
              )}
              
              <div className="flex justify-between py-3 border-t-2 border-slate-300">
                <span className="text-lg font-semibold text-slate-900">Total Akhir</span>
                <span className="text-lg font-bold text-blue-600">
                  Rp {invoice.total?.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="pt-6 border-t border-slate-200">
              <h3 className="text-sm font-semibold text-slate-500 uppercase mb-2">Catatan</h3>
              <p className="text-sm text-slate-600 whitespace-pre-wrap">{invoice.notes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-8 py-4 border-t border-slate-200">
          <p className="text-xs text-slate-500 text-center">
            Terima kasih atas kepercayaan Anda!
          </p>
        </div>
      </div>

      {/* CSS for Print */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .no-print {
            display: none !important;
          }
          #root {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
};

export default InvoiceDetail;