import { Sparkles, X } from 'lucide-react';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import TextareaField from '../ui/TextareaField'; 
import Button from '../ui/Button';
import toast from 'react-hot-toast'; 

const CreateWithAIModal = ({ isOpen, onClose }) => {
  const [text, setText] = useState(''); 
  const [isLoading, setIsLoading] = useState(false); 
  const navigate = useNavigate(); 

  const handleGenerate = async () => {
    if (!text.trim()) {
      toast.error('Please paste some text to generate an invoice.'); 
      return; 
    } 

    setIsLoading(true); 
    try {
      const response = await axiosInstance.post(API_PATHS.AI.PARSE_INVOICE_TEXT, { text }); 
      const invoiceData = response.data; 

      toast.success("Invoice data extracted successfully!"); 
      setText(''); // Reset text after successful generation
      onClose(); 

      // Navigate to create invoice page with the parsed data 
      navigate('/invoices/new', { state: { aiData: invoiceData }}); 

    } catch (error) {
      toast.error("Failed to generate invoice from text.")
      console.error(error)
    } finally {
      setIsLoading(false); 
    }
  }; 

  // Close modal and reset state
  const handleClose = () => {
    setText('');
    onClose();
  };

  if (!isOpen) return null; 

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm" 
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal Panel */}
      <div className="relative bg-white rounded-xl shadow-lg max-w-2xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h3 className="flex items-center gap-2 text-lg font-medium text-slate-900">
            <Sparkles className='w-5 h-5 text-blue-500' />
            Create Invoice with AI
          </h3>
          <button 
            onClick={handleClose} 
            className='text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-100 rounded-lg'
            disabled={isLoading}
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600">
            Paste any text that contains invoice details and AI will extract the information.
          </p>
          <TextareaField 
            name='invoiceText'
            label='Invoice Text'
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder='e.g., "Invoice for ClientCorp: 2 hours of design work at $150/hr and 1 logo for $800. Due date: Dec 31, 2024"'
            rows={8}
            disabled={isLoading}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-100">
          <Button 
            variant='ghost' 
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            variant='primary' 
            onClick={handleGenerate} 
            isLoading={isLoading}
            disabled={!text.trim() || isLoading}
          >
            {isLoading ? 'Generating...' : 'Generate Invoice'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CreateWithAIModal