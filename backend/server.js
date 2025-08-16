require('dotenv').config();
const app = require('./app');  // Your express app
const PORT = process.env.PORT || 5000;

// Important: listen on 0.0.0.0 to make app accessible in Docker network
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
