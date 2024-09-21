"use client"
import React, { useState, useEffect } from 'react';
import NavBar from '../components/navBar';

export default function ManagePromotions() {
  const [promotions, setPromotions] = useState([]);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const role = localStorage.getItem('userRole'); // Fetch role from localStorage
        setUserRole(role);
    }, []);

  const handleAddPromotion = (e) => {
    e.preventDefault();
    if (name && code && expiryDate) {
      const newPromotion = { id: Date.now(), name, code, expiryDate };
      setPromotions([...promotions, newPromotion]);
      setName('');
      setCode('');
      setExpiryDate('');
    }
  };

  const handleDeletePromotion = (id) => {
    setPromotions(promotions.filter((promo) => promo.id !== id));
  };

  return (
    <div>
        <NavBar userRole={userRole}/>
        <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Promotions</h1>
      
      <form onSubmit={handleAddPromotion} className="mb-4">
        <input
          type="text"
          placeholder="Promotion Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded p-2 mr-2 text-black"
          required
        />
        <input
          type="text"
          placeholder="Promotion Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="border rounded p-2 mr-2 text-black"
          required
        />
        <input
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          className="border rounded p-2 mr-2 text-black"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Add Promotion
        </button>
      </form>

      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Code</th>
            <th className="border p-2">Expiry Date</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {promotions.map((promotion) => (
            <tr key={promotion.id}>
              <td className="border p-2">{promotion.name}</td>
              <td className="border p-2">{promotion.code}</td>
              <td className="border p-2">{promotion.expiryDate}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleDeletePromotion(promotion.id)}
                  className="bg-red-500 text-white p-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};