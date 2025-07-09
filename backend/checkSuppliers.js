const axios = require('axios');

axios.get('http://localhost:8888/Zync-Franc/api/v1/suppliers')
  .then(response => {
    console.log("Suppliers data:", response.data);
  })
  .catch(error => {
    console.error("Error fetching suppliers:", error.message);
  });
