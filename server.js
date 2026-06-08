const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/aureliva')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Connection error:', err));

// Dealer Model (add others similarly)
const dealerSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  email: String,
  shop: String,
  address: String,
  city: String,
  state: String,
  pincode: String,
  gst: String
});
const Dealer = mongoose.model('Dealer', dealerSchema);

// API Endpoints
app.get('/api/dealers', async (req, res) => {
  try {
    const dealers = await Dealer.find();
    res.json(dealers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/dealers', async (req, res) => {
  const dealer = new Dealer(req.body);
  try {
    await dealer.save();
    res.status(201).json(dealer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));