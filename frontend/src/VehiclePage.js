import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
    const user = JSON.parse(localStorage.getItem('user')); // Retrieve user data
    const postedBy = user?._id; // Use the user's ID

    if (!postedBy) {
      console.error('User not logged in');
      alert('You must be logged in to post a vehicle.'); // Notify the user
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/vehicles', {
        make,
        model,
        year: Number(year), // Convert to number
        price: Number(price), // Convert to number
        description,
        postedBy, // Use the logged-in user's ID
      });
      console.log('Vehicle posted:', response.data);
      alert('Vehicle posted successfully!'); // Notify the user
    } catch (error) {
      console.error('Post vehicle error:', error.response?.data || error.message);
      alert('Failed to post vehicle. Please try again.'); // Notify the user
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
    <div>
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

      <h1>Vehicle Listings</h1>
      <ul>
        {vehicles.map((vehicle) => (
          <li key={vehicle._id}>
            <h2>{vehicle.make} {vehicle.model} ({vehicle.year})</h2>
            <p>Price: ${vehicle.price}</p>
            <p>{vehicle.description}</p>
            <p>Posted by: {vehicle.postedBy?.email || 'Unknown'}</p> {/* Handle null postedBy */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VehiclePage;