import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getEnv } from '../utils/env';
const API_BASE_URL = getEnv('VITE_API_BASE_URL');

const EditMenu = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [menu, setMenu] = useState({ name: '', items: [{ name: '', description: '', price: 0 }] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/menus/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        console.log('Fetched menu', response.data);
        setMenu(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.response ? error.response.data.message : error.message);
        setLoading(false);
      }
    };

    fetchMenu();
  }, [id, user.token]);

  const handleChange = (e) => {
    setMenu({ ...menu, [e.target.name]: e.target.value });
  };

  const handleItemChange = (e, index) => {
    const updatedItems = [...menu.items];
    updatedItems[index] = { ...updatedItems[index], [e.target.name]: e.target.value };
    setMenu({ ...menu, items: updatedItems });
  };

  const handleAddItem = () => {
    console.log('handleAddItem called');
    setMenu({ ...menu, items: [...menu.items, { name: '', description: '', price: 0 }] });
  };
  
  const handleRemoveItem = (index) => {
    console.log('handleRemoveItem called with index:', index);
    const updatedItems = menu.items.filter((item, i) => i !== index);
    setMenu({ ...menu, items: updatedItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/api/menus/${id}`, menu, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      navigate('/manager-menus');
    } catch (error) {
      setError(error.response ? error.response.data.message : error.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="form-container">
      <h2>Edit Menu</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Menu Name:
          <input type="text" name="name" value={menu.name || ''} onChange={handleChange} required />
        </label>
        <h3>Menu Items</h3>
        {menu.items.map((item, index) => (
          <div key={index}>
            <label>
              Name:
              <input 
                type="text" 
                name="name" 
                value={item.name || ''} 
                onChange={(e) => handleItemChange(e, index)} 
                required 
                data-cy={`item-name-${index}`} 
              />
            </label>
            <label>
              Description:
              <input 
                type="text" 
                name="description" 
                value={item.description || ''} 
                onChange={(e) => handleItemChange(e, index)} 
                required 
                data-cy={`item-description-${index}`}
              />
            </label>
            <label>
              Price:
              <input 
                type="number" 
                name="price" 
                value={item.price || 0} 
                onChange={(e) => handleItemChange(e, index)} 
                required 
                data-cy={`item-price-${index}`}
              />
            </label>
            <button type="button" onClick={() => handleRemoveItem(index)} data-cy={`remove-item-${index}`}>Remove Item</button>
          </div>
        ))}
        <button type="button" onClick={handleAddItem} data-cy="add-item">Add Item</button>
        <button type="submit">Update Menu</button>
      </form>
    </div>
  );
};

export default EditMenu;



