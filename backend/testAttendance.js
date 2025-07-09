const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const form = new FormData();
form.append('employeeId', '12345');
form.append('location', 'Guwahati');
form.append('selfie', fs.createReadStream('./test-selfie.jpg')); // Make sure this image exists

axios.post('http://localhost:8888/api/v1/attendance', form, {
  headers: form.getHeaders()
})
.then(res => console.log('✅ Success:', res.data))
.catch(err => console.error('❌ Error:', err.response?.data || err.message));
