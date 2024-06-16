const express = require('express');
const path = require('path');
const performanceTestRoutes = require('./routes/performanceTest');

const app = express();
const PORT = 4000;

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.use(express.static(path.join(__dirname, '..')));

app.use('/performance-test', performanceTestRoutes); 

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..','index.html')); 
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`); 
});
