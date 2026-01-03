const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Contact = require('./model/contactSchema');

const app = express();

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // allow server-to-server, Postman, curl
      if (!origin) return callback(null, true);

      // allow localhost
      if (origin === "http://localhost:5173") {
        return callback(null, true);
      }

      // allow ALL vercel deployments
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/contactsdb' )
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB Error:', err));

// GET all contacts
app.get('/api/contacts', async (req, res) => {
  try {
    console.log('GET CONTACTS REQUEST RECEIVED');
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
    console.log('POST CONTACT REQUEST RECEIVED', req.body);
    const contact = new Contact(req.body);
    console.log('CONTACT TO SAVE:', contact);
    await contact.save();
    console.log('CONTACT SAVED:', contact);
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
