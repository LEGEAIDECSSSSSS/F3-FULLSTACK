// src/components/BuyPage.js
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import books from "../data";
import "./BuyPage.css";

export default function BuyPage() {
  const { id } = useParams();
  const book = books.find((b) => b.id === parseInt(id));

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    paymentMethod: "card",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `Thank you, ${formData.name}! Your order for "${book.title}" will be shipped to ${formData.address}.`
    );
  };

  if (!book) return <h2 style={{ textAlign: "center" }}>Book not found.</h2>;

  return (
    <div className="buy-page">
      <h2>Buy Physical Copy</h2>
      <div className="buy-container">
        <img src={book.cover} alt={book.title} className="buy-cover" />
        <div className="buy-details">
          <h3>{book.title}</h3>
          <p>by {book.author}</p>
          <p className="price">${book.price}</p>

          <form onSubmit={handleSubmit} className="buy-form">
            <label>
              Full Name:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Delivery Address:
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Payment Method:
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
              >
                <option value="card">Credit/Debit Card</option>
                <option value="transfer">Bank Transfer</option>
                <option value="delivery">Pay on Delivery</option>
              </select>
            </label>

            <button type="submit" className="confirm-btn">
              Confirm Order
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
