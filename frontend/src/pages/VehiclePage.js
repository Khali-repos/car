import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/global.css';

const VehiclePage = () => {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [vehicles, setVehicles] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get the logged-in user's ID from local storage
    const user = JSON.parse(localStorage.getItem('user'));
    const postedBy = user?._id;

    if (!postedBy) {
      console.error('User not logged in');
      alert('You must be logged in to post a vehicle.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/vehicles', {
        make,
        model,
        year: Number(year),
        price: Number(price),
        description,
        postedBy,
      });
      console.log('Vehicle posted:', response.data);
      alert('Vehicle posted successfully!');
    } catch (error) {
      console.error('Post vehicle error:', error.response?.data || error.message);
      alert('Failed to post vehicle. Please try again.');
    }
  };

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/vehicles');
        setVehicles(response.data.vehicles);
      } catch (error) {
        console.error('Fetch vehicles error:', error);
      }
    };

    fetchVehicles();
  }, []);

  return (
    <div className="container">
      <div className="form-container">
        <h1>Post a Vehicle</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Make"
            value={make}
            onChange={(e) => setMake(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <button type="submit">Post Vehicle</button>
        </form>
      </div>

      <h1>Vehicle Listings</h1>
      <div className="vehicle-grid">
        {vehicles.map((vehicle) => (
          <div key={vehicle._id} className="vehicle-card">
            <h2>{vehicle.make} {vehicle.model} ({vehicle.year})</h2>
            <p>Price: ${vehicle.price}</p>
            <p>{vehicle.description}</p>
            <p>Posted by: {vehicle.postedBy?.email || 'Unknown'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehiclePage;