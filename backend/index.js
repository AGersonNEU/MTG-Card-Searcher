const express = require('express');
const cors = require('cors');
const connectDB = require('./connection');
const Card = require('./models/Card');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the MTG Website API' });
});

// Search cards endpoint
app.get('/api/searchCards', async (req, res) => {
    try {
        const searchQuery = req.query.searchQuery?.toLowerCase() || '';

        // Search for cards that match the query in name (case-insensitive partial match)
        const cards = await Card.find({
            name: { $regex: searchQuery, $options: 'i' }
        }).limit(50); // Limit results to 50 cards
        
        res.json({ 
            success: true,
            cards: cards
        });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error searching for cards'
        });
    }
});

app.delete('/api/deleteCard', async (req, res) => {
    try {
        const card = await Card.findOneAndDelete({ id: req.body.id });
        if (!card) {
            return res.status(404).json({ 
                success: false,
                error: 'Card not found'
            });
        }
        res.json({ success: true, card: card });
    } catch (error) {
        console.error('Error deleting card:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error deleting card'
        });
    }
});

app.post('/api/addCard', async (req, res) => {
    const card = new Card(req.body);
    await card.save();
    res.json({ success: true, card: card });
});

// Get all cards endpoint
app.get('/api/getAllCards', async (req, res) => {
    try {
        const cards = await Card.find({}).limit(100); // Limit to 100 cards to prevent overwhelming response
        
        res.json({ 
            success: true,
            cards: cards
        });
    } catch (error) {
        console.error('Error getting all cards:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error retrieving cards'
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
