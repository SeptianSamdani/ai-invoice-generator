import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';
import { Check, Copy, Loader2, Mail, X } from 'lucide-react';
import Button from '../ui/Button';
import TextareaField from '../ui/TextareaField'; 

const ReminderModal = ({ isOpen, onClose, invoiceId }) => {
    const [reminderText, setReminderText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [hasCopied, setHasCopied] = useState(false);

    useEffect(() => {
        if (isOpen && invoiceId) {
            const generateReminder = async () => {
                setIsLoading(true);
                setReminderText('');
                try {
                    const response = await axiosInstance.post(API_PATHS.AI.GENERATE_REMINDER, { invoiceId });
                    setReminderText(response.data.reminderText);
                } catch (error) {
                    toast.error('Failed to generate reminder');
                    console.error(error);
                    onClose(); // Tutup modal jika gagal
                } finally {
                    setIsLoading(false);
                }
            };
            generateReminder();
        }
    }, [isOpen, invoiceId]); // Hapus onClose dari dependency array

    const handleCopyToClipboard = () => {
        if (!reminderText) return;
        navigator.clipboard.writeText(reminderText);
        setHasCopied(true);
        toast.success("Reminder text copied to clipboard!");
        setTimeout(() => setHasCopied(false), 2000);
    }
    
    // Jangan render apa-apa jika tidak terbuka
    if (!isOpen) return null;

    return (
        // Container utama untuk modal dan overlay
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out bg-black/60">
            {/* Panel Modal */}
            <div className="relative w-full max-w-lg p-6 bg-white rounded-lg shadow-xl transform transition-all duration-300 ease-in-out scale-100">
                {/* Header Modal */}
                <div className="flex items-start justify-between pb-4 border-b">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                            <Mail className='w-5 h-5 text-blue-600' />
                        </div>
                        <div>
                           <h3 className="text-lg font-semibold text-slate-800">AI-Generated Reminder</h3>
                           <p className="text-sm text-slate-500">Review and copy the payment reminder email.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className='p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600'>
                        <X size={20} />
                    </button>
                </div>

                {/* Body Modal */}
                <div className="py-6">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-48 gap-3 text-slate-500">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                            <p>Generating reminder...</p>
                        </div>
                    ) : (
                        <TextareaField
                            name="reminderText"
                            value={reminderText}
                            readOnly
                            rows={12}
                        />
                    )}
                </div>

                {/* Footer Modal */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t">
                    <Button variant="outline" onClick={onClose}>Close</Button>
                    <Button onClick={handleCopyToClipboard} icon={hasCopied ? Check : Copy} disabled={isLoading || !reminderText}>
                        {hasCopied ? 'Copied!' : 'Copy Text'}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ReminderModal;