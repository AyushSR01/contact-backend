const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Contact = require('./model/contactSchema');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/contacts_db', )
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB Error:', err));

// GET all contacts
app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ data: contacts });
  } catch (error) {
    console.error('GET CONTACTS ERROR:', error);
    res.status(500).json({ message: error.message });
  }
});


// CREATE contact
app.post('/api/contacts', async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).json({ data: contact });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE contact
app.delete('/api/contacts/:id', async (req, res) => {
  try {
    const deleted = await Contact.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
