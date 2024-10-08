import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './Invoice.css';  // Import the CSS file

interface Invoice {
  id: string;
  name: string;
  qty: number;
  price: number;
  discountPercent: number;
  discount: number;
  taxPercent: number;
  tax: number;
  totalPrice: number;
}

const InvoiceApp = () => {
  const [formData, setFormData] = useState<Invoice>({
    id: uuidv4(),
    name: '',
    qty: 1,
    price: 0,
    discountPercent: 0,
    discount: 0,
    taxPercent: 0,
    tax: 0,
    totalPrice: 0,
  });

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [editingInvoice, setEditingInvoice] = useState<string | null>(null);

  // Helper to calculate fields
  const calculateFields = (newData: Partial<Invoice>) => {
    const qty = newData.qty ?? formData.qty;
    const price = newData.price ?? formData.price;
    const discountPercent = newData.discountPercent ?? formData.discountPercent;
    const discount = (qty * price * discountPercent) / 100;
    const taxPercent = newData.taxPercent ?? formData.taxPercent;
    const tax = ((qty * price - discount) * taxPercent) / 100;
    const totalPrice = qty * price - discount + tax;

    return { discount, tax, totalPrice };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: name === 'name' ? value : parseFloat(value) || 0,  // Handle string input for 'name'
      ...calculateFields({ [name]: parseFloat(value) || 0 }),
    };
    setFormData(newFormData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingInvoice) {
      // Update existing invoice
      setInvoices(invoices.map(inv => inv.id === editingInvoice ? formData : inv));
      setEditingInvoice(null);  // Reset edit mode after saving
    } else {
      // Add new invoice
      setInvoices([...invoices, { ...formData, id: uuidv4() }]);
    }

    // Reset form after submission
    setFormData({
      id: uuidv4(),
      name: '',
      qty: 1,
      price: 0,
      discountPercent: 0,
      discount: 0,
      taxPercent: 0,
      tax: 0,
      totalPrice: 0,
    });
  };

  const handleEdit = (id: string) => {
    const invoiceToEdit = invoices.find(inv => inv.id === id);
    if (invoiceToEdit) {
      setFormData(invoiceToEdit);  // Populate form with selected invoice data
      setEditingInvoice(id);       // Mark the invoice as being edited
    }
  };

  return (
    <div className="p-4">
      <h1>Invoice Form</h1>
      <form className="invoice-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Invoice Name</label>
          <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} placeholder="Invoice Name" />
        </div>
        <div>
          <label htmlFor="qty">Quantity</label>
          <input id="qty" name="qty" type="number" value={formData.qty} onChange={handleChange} placeholder="Quantity" />
        </div>
        <div>
          <label htmlFor="price">Price</label>
          <input id="price" name="price" type="number" value={formData.price} onChange={handleChange} placeholder="Price" />
        </div>
        <div>
          <label htmlFor="discountPercent">Discount %</label>
          <input id="discountPercent" name="discountPercent" type="number" value={formData.discountPercent} onChange={handleChange} placeholder="Discount %" />
        </div>
        <div>
          <label htmlFor="taxPercent">Tax %</label>
          <input id="taxPercent" name="taxPercent" type="number" value={formData.taxPercent} onChange={handleChange} placeholder="Tax %" />
        </div>
        <div>Total: {formData.totalPrice}</div>
        <button type="submit">{editingInvoice ? "Update Invoice" : "Save Invoice"}</button>
      </form>

      <h2>Invoices</h2>
      <table className="invoice-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Invoice Name</th>
            <th>Total Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv.id}>
              <td>{inv.id}</td>
              <td>{inv.name}</td>
              <td>{inv.totalPrice}</td>
              <td>
                <button onClick={() => handleEdit(inv.id)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceApp;
