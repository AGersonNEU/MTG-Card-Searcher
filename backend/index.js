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
        const card = await Card.findOne({ id: req.body.id });
        if (!card) {
            return res.status(404).json({ 
                success: false,
                error: 'Card not found'
            });
        }

        if (card.quantity > 1) {
            // Reduce quantity by 1
            card.quantity -= 1;
            await card.save();
            console.log(`Reduced quantity for ${card.name} to ${card.quantity}`);
            res.json({ 
                success: true, 
                message: 'Card quantity reduced',
                card: card 
            });
        } else {
            // Delete the card entirely
            await Card.findByIdAndDelete(card._id);
            console.log(`Deleted card: ${card.name}`);
            res.json({ 
                success: true, 
                message: 'Card deleted',
                card: card 
            });
        }
    } catch (error) {
        console.error('Error deleting card:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error deleting card'
        });
    }
});

app.post('/api/addCard', async (req, res) => {
    try {
        console.log('Adding card:', req.body.name);
        
        // Check if the card already exists by finding the card with the same name
        const existingCard = await Card.findOne({ name: req.body.name });
        console.log('Existing card found:', existingCard ? existingCard.name : 'None');
        
        // Also check for case-insensitive match
        const existingCardCaseInsensitive = await Card.findOne({ 
            name: { $regex: new RegExp(`^${req.body.name}$`, 'i') }
        });
        console.log('Case-insensitive match found:', existingCardCaseInsensitive ? existingCardCaseInsensitive.name : 'None');
        
        if (existingCard) {
            // Update the quantity of the existing card
            const quantityToAdd = req.body.quantity || 1;
            existingCard.quantity = (existingCard.quantity || 0) + quantityToAdd;
            await existingCard.save();
            console.log(`Updated quantity for ${req.body.name} to ${existingCard.quantity}`);
            return res.status(200).json({ 
                success: true,
                message: 'Card quantity updated',
                card: existingCard
            });
        }

        // Only create new card if it doesn't exist
        const cardData = {
            ...req.body,
            quantity: req.body.quantity || 1
        };
        
        const card = new Card(cardData);
        await card.save();
        console.log(`Created new card: ${req.body.name} with quantity ${cardData.quantity}`);
        res.json({ success: true, card: card });
    } catch (error) {
        console.error('Error adding card:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error adding card'
        });
    }
});

// Get all cards endpoint
app.get('/api/getAllCards', async (req, res) => {
    try {
        const cards = await Card.find({}).limit(200); // Limit to 100 cards to prevent overwhelming response
        
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
