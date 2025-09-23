const Invoice = require('../models/Invoice');

// @desc   Create a new invoice
// @route  POST /api/invoices
// @access Private
exports.createInvoice = async (req, res) => {
    try {
        const user = req.user; 
        const {
            invoiceNumber, 
            invoiceDate, 
            dueDate,
            billFrom,
            billTo, 
            items, 
            notes, 
            paymentTerms
        } = req.body; 

        // subtotal calculation
        let subTotal = 0; 
        let taxTotal = 0; 

        items.forEach((item) => {
            subTotal += item.unitPrice * item.quantity; 
            taxTotal += ((item.unitPrice * item.quantity) * (item.taxPercent || 0)) / 100;  
        })

        const total = subTotal + taxTotal; 

        const invoice = new Invoice({
            user,
            invoiceNumber, 
            invoiceDate, 
            dueDate,
            billFrom,
            billTo, 
            items, 
            notes, 
            paymentTerms, 
            subTotal, 
            taxTotal, 
            total
        }); 

        await invoice.save(); 
        res.status(201).json(invoice); 

    } catch (error) {
        res
            .status(500)
            .json({ message: 'Error creating invoice', error: error.message }); 
    }
};

// @desc   Get all invoices for the logged-in user
// @route  GET /api/invoices
// @access Private
exports.getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find().populate('user', 'name email'); 
        res.status(200).json(invoices); 
    } catch (error) {
        res
            .status(500)
            .json({ message: 'Error fetching invoices', error: error.message });
    }
}; 

// @desc   Get  single invoice for the logged-in user
// @route  GET /api/invoices/:id
// @access Private
exports.getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id).populate('user', 'name email'); 
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' }); 
        }
        res.status(200).json(invoice);
    } catch (error) {
         res
            .status(500)
            .json({ message: 'Error fetching invoice', error: error.message }); 
    }
};

// @desc   Update  single invoice for the logged-in user
// @route  PUT /api/invoices/:id
// @access Private
exports.updateInvoice = async (req, res) => {
    try {
        const {
            invoiceNumber, 
            invoiceDate, 
            dueDate, 
            billFrom, 
            billTo, 
            items, 
            notes, 
            paymentTerms, 
            status
        } = req.body; 

        // recalcuate totals if items changed 
        let subTotal = 0; 
        let taxTotal = 0; 

        if (items && items.length > 0) {
            items.forEach((item) => {
                subTotal += item.unitPrice * item.quantity; 
                taxTotal += ((item.unitPrice * item.quantity) * (item.taxPercent || 0)) / 100; 
            }); 
        }

        const total = subTotal + taxTotal; 

        const updatedInvoice = await Invoice.findByIdAndUpdate(
            req.params.id, 
            {
                invoiceNumber, 
                invoiceDate, 
                dueDate, 
                billFrom, 
                billTo, 
                items, 
                notes, 
                paymentTerms, 
                status, 
                subTotal, 
                taxTotal, 
                total
            }, 
            {
                new: true, 
            } 
        ); 

        if (!updatedInvoice) return res.status(404).json({ message: 'Invoice not found' });

        res.status(200).json(updatedInvoice);
    } catch (error) {
        res
            .status(500)
            .json({ message: 'Error updating invoice', error: error.message });
    }
};

// @desc  Delete single invoice for the logged-in user
// @route  DELETE /api/invoices/:id
// @access Private
exports.deleteInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findByIdAndDelete(req.params.id);
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' }); 
        }
        res.status(200).json({ message: 'Invoice removed' });
    } catch (error) {
        res
            .status(500)
            .json({ message: 'Error deleting invoice', error: error.message });
    }
};