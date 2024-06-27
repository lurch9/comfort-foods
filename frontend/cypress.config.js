import { defineConfig } from 'cypress';
import axios from 'axios';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    setupNodeEvents(on, config) {
      on('task', {
        addMockOrder(mockOrder) {
          const url = 'http://localhost:5000/api/test/addMockOrder'; // Replace with your backend URL
          return axios.post(url, mockOrder)
            .then(response => {
              return response.data.orderId; // Return the order ID
            })
            .catch(error => {
              throw new Error(error.response ? error.response.data.message : error.message);
            });
        },
        genMongoObjectId() {
          var timestamp = (new Date().getTime() / 1000 | 0).toString(16);
          var objectId = timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function() {
            return (Math.random() * 16 | 0).toString(16);
          }).toLowerCase();
          return objectId;
        },
      });

      return config;
    },
  },
});
