// models/Invoice.js
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    taxPercent: { type: Number, default: 0}, 
    total: { type: Number, required: true }
});

const invoiceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true
    }, 
    invoiceNumber: {
        type: String, 
        required: true, 
    }, 
    invoiceDate: {
        type: Date, 
        default: Date.now, 
    }, 
    dueDate: {
        type: Date, 
    }, 
    billFrom: {
        businessName: { type: String },
        email: { type: String }, 
        address: { type: String },
        phone: { type: String }
    }, 
    billTo: {
        clientName: String, 
        email: String, 
        address: String, 
        phone: String
    }, 
    items: [itemSchema],
    notes: {
        type: String, 
    }, 
    paymentTerms: {
        type: String, 
        default: 'Net 15', 
    }, 
    status: {
        type: String, 
        enum: ['Paid', 'Unpaid'], 
        default: 'Unpaid'
    }, 
    subTotal: { type: Number, required: true },
    taxTotal: { type: Number, required: true },
    total: { type: Number, required: true }
}, 
    { timestamps: true }
);

module.exports = mongoose.model('Invoice', invoiceSchema);