import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import moment from 'moment';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import Button from '../../components/ui/Button';
import InputField from '../../components/ui/InputField';
import TextareaField from '../../components/ui/TextareaField';
import SelectField from '../../components/ui/SelectField';
import { Plus, Trash2, FileText, Save, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount || 0);
};

const CreateInvoice = ({ existingInvoice, onSave }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    const getInitialFormData = () => ({
        invoiceNumber: "",
        invoiceDate: new Date().toISOString().split("T")[0],
        dueDate: "",
        billFrom: {
            businessName: user?.businessName ?? "",
            email: user?.email ?? "",
            address: user?.address ?? "",
            phone: user?.phone ?? "",
        },
        billTo: { 
            clientName: "", 
            email: "", 
            address: "", 
            phone: "" 
        },
        items: [{ 
            name: "", 
            quantity: 1, 
            unitPrice: 0, 
            taxPercent: 0 
        }],
        notes: "",
        paymentTerms: "Net 15",
        status: "Menunggu"
    });

    const [formData, setFormData] = useState(getInitialFormData());
    const [isLoading, setIsLoading] = useState(false);
    const [isGeneratingNumber, setIsGeneratingNumber] = useState(!existingInvoice);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        let isMounted = true;
        const aiData = location.state?.aiData;

        if (aiData) {
            setFormData(prev => ({
                ...prev,
                billTo: {
                    clientName: aiData.clientName ?? '',
                    email: aiData.email ?? '',
                    address: aiData.address ?? '',
                    phone: aiData.phone ?? ''
                },
                items: aiData.items && aiData.items.length > 0 
                    ? aiData.items.map(item => ({
                        name: item.name ?? '',
                        quantity: item.quantity ?? 1,
                        unitPrice: item.unitPrice ?? 0,
                        taxPercent: item.taxPercent ?? 0
                    }))
                    : [{ name: "", quantity: 1, unitPrice: 0, taxPercent: 0 }],
            }));
        }

        if (existingInvoice) {
            setFormData({
                ...existingInvoice,
                invoiceDate: moment(existingInvoice.invoiceDate).format("YYYY-MM-DD"),
                dueDate: moment(existingInvoice.dueDate).format("YYYY-MM-DD"),
            });
        } else {
            const generateNewInvoiceNumber = async () => {
                setIsGeneratingNumber(true);
                try {
                    const response = await axiosInstance.get(API_PATHS.INVOICE.GET_ALL_INVOICES);
                    const invoices = response.data;
                    let maxNum = 0;
                    invoices.forEach((inv) => {
                        const num = parseInt(inv.invoiceNumber.split("-")[1]);
                        if (!isNaN(num) && num > maxNum) maxNum = num;
                    });
                    const newInvoiceNumber = `INV-${String(maxNum + 1).padStart(3, "0")}`;
                    if (isMounted) {
                        setFormData((prev) => ({ ...prev, invoiceNumber: newInvoiceNumber }));
                    }
                } catch (error) {
                    console.error("Failed to generate invoice number", error);
                    if (isMounted) {
                        setFormData((prev) => ({ ...prev, invoiceNumber: `INV-${Date.now().toString().slice(-5)}` }));
                    }
                }
                if (isMounted) {
                    setIsGeneratingNumber(false);
                }
            };
            generateNewInvoiceNumber();
        }

        return () => {
            isMounted = false;
        };
    }, [existingInvoice, location.state, user]);

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
        setFormData({ ...formData, items: [...formData.items, { name: "", quantity: 1, unitPrice: 0, taxPercent: 0 }] });
    };

    const handleRemoveItem = (index) => {
        if (formData.items.length === 1) {
            toast.error("At least one item is required");
            return;
        }
        const newItems = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: newItems });
    };

    const { subTotal, taxTotal, total } = (() => {
        let subTotal = 0, taxTotal = 0;
        if (formData.items) {
            formData.items.forEach((item) => {
                const itemTotal = (item.quantity || 0) * (item.unitPrice || 0);
                subTotal += itemTotal;
                taxTotal += itemTotal * ((item.taxPercent || 0) / 100);
            });
        }
        return { subTotal, taxTotal, total: subTotal + taxTotal };
    })();

    const validateForm = () => {
        const newErrors = {};
        if (!formData.invoiceNumber) newErrors.invoiceNumber = "Invoice number is required";
        if (!formData.dueDate) newErrors.dueDate = "Due date is required";
        else if (moment(formData.dueDate).isBefore(moment(formData.invoiceDate))) {
            newErrors.dueDate = "Due date must be after invoice date";
        }
        if (!formData.billTo.clientName) newErrors.clientName = "Client name is required";
        if (!formData.billTo.email) newErrors.clientEmail = "Client email is required";

        const hasValidItem = formData.items.some(item => 
            item.name.trim() !== "" && item.quantity > 0 && item.unitPrice > 0
        );
        if (!hasValidItem) newErrors.items = "At least one valid item is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error("Please fix errors before submitting");
            return;
        }

        setIsLoading(true);
       
        const itemsWithTotal = formData.items.map((item) => ({
            ...item, 
            total: (item.quantity || 0) * (item.unitPrice || 0) * (1 + (item.taxPercent || 0) / 100)
        })); 

        const finalFormData = { ...formData, items: itemsWithTotal, subTotal, taxTotal, total };

        if (onSave) {
            await onSave(finalFormData); 
        } else {
            try {
                await axiosInstance.post(API_PATHS.INVOICE.CREATE, finalFormData); 
                toast.success("Invoice created successfully"); 
                navigate("/invoices"); 
            } catch (error) {
                toast.error("Failed to create invoice");
                console.error(error); 
            }
        }

        setIsLoading(false); 
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <form onSubmit={handleSubmit} className='space-y-6'>
                {/* Header */}
                <div className="bg-white border border-slate-200 rounded-lg p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => navigate('/invoices')}
                                className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">
                                    {existingInvoice ? "Edit Invoice" : "Create Invoice"}
                                </h1>
                                <p className="text-sm text-slate-600 mt-1">Fill in the details below</p>
                            </div>
                        </div>
                        <Button 
                            type="submit" 
                            isLoading={isLoading || isGeneratingNumber}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
                        >
                            <Save className="w-4 h-4" />
                            {existingInvoice ? "Update" : "Save"} Invoice
                        </Button>
                    </div>
                </div>

                {/* Invoice Details */}
                <div className="bg-white border border-slate-200 rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Invoice Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <InputField
                                label="Invoice Number"
                                name="invoiceNumber"
                                readOnly
                                value={formData.invoiceNumber}
                                placeholder={isGeneratingNumber ? "Generating..." : ""}
                                disabled
                            />
                            {errors.invoiceNumber && <p className="text-red-600 text-xs mt-1">{errors.invoiceNumber}</p>}
                        </div>
                        <InputField 
                            label='Invoice Date' 
                            type="date" 
                            name="invoiceDate" 
                            value={formData.invoiceDate} 
                            onChange={handleInputChange} 
                        />
                        <div>
                            <InputField 
                                label='Due Date' 
                                type="date" 
                                name="dueDate" 
                                value={formData.dueDate} 
                                onChange={handleInputChange} 
                            />
                            {errors.dueDate && <p className="text-red-600 text-xs mt-1">{errors.dueDate}</p>}
                        </div>
                    </div>
                </div>

                {/* Bill From / Bill To */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white border border-slate-200 rounded-lg p-6">
                        <h3 className="text-base font-semibold text-slate-900 mb-4 pb-3 border-b border-slate-200">From</h3>
                        <div className="space-y-4">
                            <InputField label='Business Name' name='businessName' value={formData.billFrom.businessName} onChange={(e) => handleInputChange(e, "billFrom")} />
                            <InputField label='Email' name='email' type="email" value={formData.billFrom.email} onChange={(e) => handleInputChange(e, "billFrom")} />
                            <TextareaField label='Address' name='address' value={formData.billFrom.address} onChange={(e) => handleInputChange(e, "billFrom")} rows={3} />
                            <InputField label='Phone' name='phone' value={formData.billFrom.phone} onChange={(e) => handleInputChange(e, "billFrom")} />
                        </div>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-lg p-6">
                        <h3 className="text-base font-semibold text-slate-900 mb-4 pb-3 border-b border-slate-200">Bill To</h3>
                        <div className="space-y-4">
                            <div>
                                <InputField label='Client Name' name='clientName' value={formData.billTo.clientName} onChange={(e) => handleInputChange(e, "billTo")} />
                                {errors.clientName && <p className="text-red-600 text-xs mt-1">{errors.clientName}</p>}
                            </div>
                            <div>
                                <InputField label='Email' name='email' type="email" value={formData.billTo.email} onChange={(e) => handleInputChange(e, "billTo")} />
                                {errors.clientEmail && <p className="text-red-600 text-xs mt-1">{errors.clientEmail}</p>}
                            </div>
                            <TextareaField label='Address' name='address' value={formData.billTo.address} onChange={(e) => handleInputChange(e, "billTo")} rows={3} />
                            <InputField label='Phone' name='phone' value={formData.billTo.phone} onChange={(e) => handleInputChange(e, "billTo")} />
                        </div>
                    </div>
                </div>

                {/* Items */}
                <div className="bg-white border border-slate-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-slate-900">Items</h2>
                        <Button 
                            variant="outline" 
                            type="button" 
                            onClick={handleAddItem}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-900 rounded-lg hover:bg-slate-50 transition-colors text-sm"
                        >
                            <Plus className="w-4 h-4" />
                            Add Item
                        </Button>
                    </div>
                    
                    {errors.items && <p className="text-red-600 text-sm mb-4 bg-red-50 border border-red-200 p-3 rounded-lg">{errors.items}</p>}
                    
                    <div className="space-y-3">
                        {/* Headers for desktop */}
                        <div className="hidden md:grid md:grid-cols-[2.5fr_0.8fr_1fr_0.8fr_1fr_auto] gap-3 text-xs font-semibold text-slate-600 uppercase px-3">
                            <span>Description</span>
                            <span className="text-center">Qty</span>
                            <span className="text-right">Unit Price</span>
                            <span className="text-center">Tax %</span>
                            <span className="text-right">Total</span>
                            <span className="w-10"></span>
                        </div>
                        {formData.items.map((item, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-[2.5fr_0.8fr_1fr_0.8fr_1fr_auto] gap-3 items-end p-4 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200">
                               <InputField 
                                   placeholder="Item description" 
                                   name="name" 
                                   value={item.name} 
                                   onChange={(e) => handleInputChange(e, 'items', index)} 
                               />
                               <InputField 
                                   placeholder="1" 
                                   name="quantity" 
                                   type="number" 
                                   value={item.quantity} 
                                   onChange={(e) => handleInputChange(e, 'items', index)} 
                               />
                               <InputField 
                                   placeholder="0" 
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
                               <div className="flex items-center justify-end h-10">
                                   <p className="text-sm font-semibold text-slate-900">
                                       {formatCurrency(item.quantity * item.unitPrice * (1 + item.taxPercent/100))}
                                   </p>
                               </div>
                               <button
                                   type="button"
                                   onClick={() => handleRemoveItem(index)}
                                   className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                   title="Remove item"
                               >
                                 <Trash2 className="w-4 h-4" />
                               </button>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Notes, Payment Terms & Summary */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <div className="bg-white border border-slate-200 rounded-lg p-6">
                            <TextareaField 
                                label="Notes" 
                                name="notes" 
                                value={formData.notes} 
                                onChange={handleInputChange} 
                                placeholder="Additional notes or payment instructions..."
                                rows={4}
                            />
                        </div>
                        <div className="bg-white border border-slate-200 rounded-lg p-6">
                            <SelectField 
                                label="Payment Terms"
                                name="paymentTerms"
                                value={formData.paymentTerms}
                                onChange={handleInputChange}
                                options={["Net 15", "Net 30", "Net 60", "Due on receipt"]}
                            />
                        </div>
                    </div>
                    
                    <div className="bg-white text-black border-2 border-black  rounded-xl p-6">
                        <h3 className="text-lg font-semibold mb-6">Summary</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-3 border-b border-slate-700">
                                <span className="text-slate-900">Subtotal</span>
                                <span className="font-semibold text-lg">{formatCurrency(subTotal)}</span>
                            </div>
                            <div className="flex justify-between items-center pb-3 border-b border-slate-700">
                                <span className="text-slate-900">Tax</span>
                                <span className="font-semibold text-lg">{formatCurrency(taxTotal)}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-xl font-bold">Total</span>
                                <span className="text-2xl font-bold">{formatCurrency(total)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Submit Button */}
                <div className="sm:hidden bg-white border border-slate-200 rounded-lg p-4">
                    <Button 
                        type="submit" 
                        isLoading={isLoading || isGeneratingNumber}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
                    >
                        <Save className="w-4 h-4" />
                        {existingInvoice ? "Update" : "Save"} Invoice
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CreateInvoice;