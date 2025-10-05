import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import moment from 'moment';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import Button from '../../components/ui/Button';
import InputField from '../../components/ui/InputField';
import TextareaField from '../../components/ui/TextareaField';
import SelectField from '../../components/ui/SelectField';
import { Plus, Trash2, FileText, Calendar, DollarSign, Loader2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast'; 

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount || 0);
};

const EditInvoice = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [formData, setFormData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const response = await axiosInstance.get(API_PATHS.INVOICE.GET_INVOICES_BY_ID(id));
                const invoice = response.data;
                
                setFormData({
                    invoiceNumber: invoice.invoiceNumber,
                    invoiceDate: moment(invoice.invoiceDate).format("YYYY-MM-DD"),
                    dueDate: moment(invoice.dueDate).format("YYYY-MM-DD"),
                    billFrom: {
                        businessName: invoice.billFrom?.businessName || "",
                        email: invoice.billFrom?.email || "",
                        address: invoice.billFrom?.address || "",
                        phone: invoice.billFrom?.phone || "",
                    },
                    billTo: { 
                        clientName: invoice.billTo?.clientName || "", 
                        email: invoice.billTo?.email || "", 
                        address: invoice.billTo?.address || "", 
                        phone: invoice.billTo?.phone || "" 
                    },
                    items: invoice.items.map(item => ({
                        name: item.name || "",
                        quantity: item.quantity || 1,
                        unitPrice: item.unitPrice || 0,
                        taxPercent: item.taxPercent || 0
                    })),
                    notes: invoice.notes || "",
                    paymentTerms: invoice.paymentTerms || "Net 15",
                    status: invoice.status || "Menunggu"
                });
            } catch (error) {
                toast.error('Gagal memuat detail faktur');
                console.error(error);
                navigate('/invoices');
            } finally {
                setIsFetching(false);
            }
        };

        fetchInvoice();
    }, [id, navigate]);

    const handleInputChange = (e, section, index) => {
        const { name, value, type } = e.target;
        const parsedValue = type === 'number' ? parseFloat(value) || 0 : value;

        setErrors(prev => ({ ...prev, [name]: '' }));

        if (section === 'items') {
            const newItems = [...formData.items];
            newItems[index] = { ...newItems[index], [name]: parsedValue };
            setFormData({ ...formData, items: newItems });
        } else if (section) {
            setFormData({
                ...formData,
                [section]: { ...formData[section], [name]: value },
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleAddItem = () => {
        setFormData({ 
            ...formData, 
            items: [...formData.items, { name: "", quantity: 1, unitPrice: 0, taxPercent: 0 }] 
        });
    };

    const handleRemoveItem = (index) => {
        if (formData.items.length === 1) {
            toast.error("Minimal harus ada 1 item");
            return;
        }
        const newItems = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: newItems });
    };

    const { subTotal, taxTotal, total } = (() => {
        if (!formData) return { subTotal: 0, taxTotal: 0, total: 0 };
        
        let subTotal = 0, taxTotal = 0;
        formData.items.forEach((item) => {
            const itemTotal = (item.quantity || 0) * (item.unitPrice || 0);
            subTotal += itemTotal;
            taxTotal += itemTotal * ((item.taxPercent || 0) / 100);
        });
        return { subTotal, taxTotal, total: subTotal + taxTotal };
    })();

    const validateForm = () => {
        const newErrors = {};

        if (!formData.invoiceNumber) {
            newErrors.invoiceNumber = "Nomor faktur wajib diisi";
        }

        if (!formData.dueDate) {
            newErrors.dueDate = "Tanggal jatuh tempo wajib diisi";
        } else if (moment(formData.dueDate).isBefore(moment(formData.invoiceDate))) {
            newErrors.dueDate = "Tanggal jatuh tempo harus setelah tanggal faktur";
        }

        if (!formData.billTo.clientName) {
            newErrors.clientName = "Nama klien wajib diisi";
        }

        if (!formData.billTo.email) {
            newErrors.clientEmail = "Email klien wajib diisi";
        }

        const hasValidItem = formData.items.some(item => 
            item.name.trim() !== "" && item.quantity > 0 && item.unitPrice > 0
        );

        if (!hasValidItem) {
            newErrors.items = "Minimal satu item valid diperlukan (dengan nama, jumlah > 0, dan harga > 0)";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error("Harap perbaiki kesalahan sebelum mengirim");
            return;
        }

        setIsLoading(true);
       
        const itemsWithTotal = formData.items.map((item) => ({
            ...item, 
            total: (item.quantity || 0) * (item.unitPrice || 0) * (1 + (item.taxPercent || 0) / 100)
        })); 

        const finalFormData = { 
            ...formData, 
            items: itemsWithTotal, 
            subTotal, 
            taxTotal, 
            total 
        };

        try {
            await axiosInstance.put(API_PATHS.INVOICE.UPDATE_INVOICE(id), finalFormData); 
            toast.success("Faktur berhasil diperbarui."); 
            navigate(`/invoices/view/${id}`); 
        } catch (error) {
            toast.error("Gagal memperbarui faktur.");
            console.error(error); 
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className='flex justify-center items-center min-h-[400px]'>
                <Loader2 className='w-8 h-8 animate-spin text-blue-600' />
            </div>
        );
    }

    if (!formData) {
        return (
            <div className='flex flex-col items-center justify-center min-h-[400px] gap-4'>
                <p className='text-slate-600'>Faktur tidak ditemukan</p>
                <Button onClick={() => navigate('/invoices')} icon={ArrowLeft}>
                    Kembali ke Faktur
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <form onSubmit={handleSubmit} className='space-y-6'>
                    {/* Header */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <Button 
                                        type="button"
                                        variant="ghost" 
                                        onClick={() => navigate(`/invoices/view/${id}`)}
                                        icon={ArrowLeft}
                                        className="p-2"
                                    />
                                    <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                        <FileText className="text-blue-600" size={32} />
                                        Ubah Faktur
                                    </h2>
                                </div>
                                <p className="text-gray-500 ml-14">Perbarui detail faktur di bawah ini</p>
                            </div>
                            <Button type="submit" isLoading={isLoading} className="w-full sm:w-auto">
                                Simpan Perubahan
                            </Button>
                        </div>
                    </div>

                    {/* Invoice Details */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                        <div className="flex items-center gap-2 mb-6">
                            <Calendar className="text-blue-600" size={24} />
                            <h3 className="text-xl font-semibold text-gray-800">Detail Faktur</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <InputField
                                    label="Nomor Faktur"
                                    name="invoiceNumber"
                                    value={formData.invoiceNumber}
                                    onChange={handleInputChange}
                                />
                                {errors.invoiceNumber && <p className="text-red-500 text-xs mt-1">{errors.invoiceNumber}</p>}
                            </div>
                            <InputField 
                                label='Tanggal Faktur' 
                                type="date" 
                                name="invoiceDate" 
                                value={formData.invoiceDate} 
                                onChange={handleInputChange} 
                            />
                            <div>
                                <InputField 
                                    label='Tanggal Jatuh Tempo' 
                                    type="date" 
                                    name="dueDate" 
                                    value={formData.dueDate} 
                                    onChange={handleInputChange} 
                                />
                                {errors.dueDate && <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Bill From / Bill To */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                            <h3 className="text-lg font-semibold text-blue-700 border-b-2 border-blue-100 pb-3 mb-4">Dari</h3>
                            <div className="space-y-4">
                                <InputField label='Nama Bisnis' name='businessName' value={formData.billFrom.businessName} onChange={(e) => handleInputChange(e, "billFrom")} />
                                <InputField label='Email' name='email' type="email" value={formData.billFrom.email} onChange={(e) => handleInputChange(e, "billFrom")} />
                                <TextareaField label='Alamat' name='address' value={formData.billFrom.address} onChange={(e) => handleInputChange(e, "billFrom")} />
                                <InputField label='Telepon' name='phone' value={formData.billFrom.phone} onChange={(e) => handleInputChange(e, "billFrom")} />
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                            <h3 className="text-lg font-semibold text-blue-700 border-b-2 border-blue-100 pb-3 mb-4">Kepada</h3>
                            <div className="space-y-4">
                                <div>
                                    <InputField label='Nama Klien' name='clientName' value={formData.billTo.clientName} onChange={(e) => handleInputChange(e, "billTo")} />
                                    {errors.clientName && <p className="text-red-500 text-xs mt-1">{errors.clientName}</p>}
                                </div>
                                <div>
                                    <InputField label='Email Klien' name='email' type="email" value={formData.billTo.email} onChange={(e) => handleInputChange(e, "billTo")} />
                                    {errors.clientEmail && <p className="text-red-500 text-xs mt-1">{errors.clientEmail}</p>}
                                </div>
                                <TextareaField label='Alamat Klien' name='address' value={formData.billTo.address} onChange={(e) => handleInputChange(e, "billTo")} />
                                <InputField label='Telepon' name='phone' value={formData.billTo.phone} onChange={(e) => handleInputChange(e, "billTo")} />
                            </div>
                        </div>
                    </div>

                    {/* Items */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <DollarSign className="text-blue-600" size={24} />
                                <h3 className="text-xl font-semibold text-gray-800">Item</h3>
                            </div>
                            <Button variant="outline" type="button" onClick={handleAddItem} icon={Plus} className="text-sm">
                                Tambah Item
                            </Button>
                        </div>
                        
                        {errors.items && <p className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-lg">{errors.items}</p>}
                        
                        <div className="space-y-4">
                            <div className="hidden md:grid md:grid-cols-[3fr_1fr_1.5fr_1fr_1.5fr_auto] gap-4 text-xs uppercase text-gray-600 font-semibold px-3">
                                <span>Nama Item</span>
                                <span className="text-center">Jumlah</span>
                                <span className="text-right">Harga Satuan</span>
                                <span className="text-center">Pajak (%)</span>
                                <span className="text-right">Total</span>
                                <span className="w-10"></span>
                            </div>
                            {formData.items.map((item, index) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-[3fr_1fr_1.5fr_1fr_1.5fr_auto] gap-4 items-center p-4 rounded-lg bg-gradient-to-r from-gray-50 to-blue-50 hover:from-blue-50 hover:to-blue-100 transition-all duration-200 border border-gray-200">
                                   <InputField 
                                       placeholder="Nama Item" 
                                       name="name" 
                                       value={item.name} 
                                       onChange={(e) => handleInputChange(e, 'items', index)} 
                                       className="md:col-span-1" 
                                   />
                                   <InputField 
                                       placeholder="1" 
                                       name="quantity" 
                                       type="number" 
                                       value={item.quantity} 
                                       onChange={(e) => handleInputChange(e, 'items', index)} 
                                   />
                                   <InputField 
                                       placeholder="0.00" 
                                       name="unitPrice" 
                                       type="number" 
                                       value={item.unitPrice} 
                                       onChange={(e) => handleInputChange(e, 'items', index)} 
                                   />
                                   <InputField 
                                       placeholder="0" 
                                       name="taxPercent" 
                                       type="number" 
                                       value={item.taxPercent} 
                                       onChange={(e) => handleInputChange(e, 'items', index)} 
                                   />
                                   <div className="bg-white rounded-lg p-2 border border-gray-300">
                                       <p className="text-right text-gray-900 font-semibold">
                                           {formatCurrency(item.quantity * item.unitPrice * (1 + item.taxPercent/100))}
                                       </p>
                                   </div>
                                   <Button 
                                       variant="ghost" 
                                       type="button" 
                                       onClick={() => handleRemoveItem(index)} 
                                       className="text-red-500 hover:bg-red-100 hover:text-red-700 transition-colors"
                                   >
                                     <Trash2 size={18} />
                                   </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Notes, Payment Terms, Status & Total */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 space-y-4">
                            <TextareaField 
                                label="Catatan" 
                                name="notes" 
                                value={formData.notes} 
                                onChange={handleInputChange} 
                                placeholder="Tambahkan catatan tambahan di sini..."
                            />
                            <SelectField 
                                label="Syarat Pembayaran"
                                name="paymentTerms"
                                value={formData.paymentTerms}
                                onChange={handleInputChange}
                                options={["Net 15", "Net 30", "Net 60", "Jatuh tempo saat diterima"]}
                            />
                            <SelectField 
                                label="Status"
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                options={["Menunggu", "Lunas", "Belum Lunas"]}
                            />
                        </div>
                        
                        <div className="bg-gradient-to-br from-blue-50 to-slate-100 rounded-xl shadow-lg p-6 border-2 border-blue-200">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Ringkasan</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-gray-700 py-2 border-b border-gray-300">
                                    <span className="font-medium">Subtotal</span>
                                    <span className="font-semibold text-lg">{formatCurrency(subTotal)}</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-700 py-2 border-b border-gray-300">
                                    <span className="font-medium">Pajak</span>
                                    <span className="font-semibold text-lg">{formatCurrency(taxTotal)}</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-900 font-bold text-xl pt-3 bg-white rounded-lg p-4 shadow-sm">
                                    <span>Total</span>
                                    <span className="text-blue-600">{formatCurrency(total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button (Mobile) */}
                    <div className="sm:hidden bg-white rounded-xl shadow-lg p-4 border border-gray-200">
                        <Button type="submit" isLoading={isLoading} className="w-full">
                            Simpan Perubahan
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditInvoice;