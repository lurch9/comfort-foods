// backend/controllers/restaurantController.js
const getRestaurants = (req, res) => {
    const { zip } = req.query;
  
    // Dummy data for demonstration purposes
    const restaurants = [
      { id: 1, name: 'Restaurant A', description: `Great food in ${zip}` },
      { id: 2, name: 'Restaurant B', description: `Delicious meals in ${zip}` },
    ];
  
    res.json(restaurants);
  };
  
  module.exports = { getRestaurants };
  