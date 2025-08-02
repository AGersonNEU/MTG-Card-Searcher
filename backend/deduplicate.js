const mongoose = require('mongoose');
const Card = require('./models/Card');
require('dotenv').config();

// Function to normalize card names for fuzzy matching
const normalizeCardName = (name) => {
    return name.toLowerCase().trim().replace(/\s+/g, ' ');
};

const deduplicateCards = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log('Connected to MongoDB');
        
        // Get all cards grouped by normalized name
        const cards = await Card.find({});
        const cardsByNormalizedName = {};
        
        // Group cards by normalized name
        cards.forEach(card => {
            const normalizedName = normalizeCardName(card.name);
            if (!cardsByNormalizedName[normalizedName]) {
                cardsByNormalizedName[normalizedName] = [];
            }
            cardsByNormalizedName[normalizedName].push(card);
        });
        
        let totalDeleted = 0;
        let totalUpdated = 0;
        
        // Process each group of cards with the same normalized name
        for (const [normalizedName, cardGroup] of Object.entries(cardsByNormalizedName)) {
            if (cardGroup.length > 1) {
                console.log(`Processing duplicates for: "${normalizedName}" (${cardGroup.length} copies)`);
                console.log(`Original names: ${cardGroup.map(card => `"${card.name}"`).join(', ')}`);
                
                // Keep the first card and delete the rest
                const cardToKeep = cardGroup[0];
                const cardsToDelete = cardGroup.slice(1);
                
                // Calculate total quantity
                const totalQuantity = cardGroup.reduce((sum, card) => sum + (card.quantity || 1), 0);
                
                // Update the card to keep with the total quantity
                await Card.findByIdAndUpdate(cardToKeep._id, { quantity: totalQuantity });
                console.log(`Updated "${cardToKeep.name}" quantity to ${totalQuantity}`);
                totalUpdated++;
                
                // Delete the duplicate cards
                for (const cardToDelete of cardsToDelete) {
                    await Card.findByIdAndDelete(cardToDelete._id);
                    totalDeleted++;
                }
                
                console.log(`Deleted ${cardsToDelete.length} duplicate(s)`);
                console.log('---');
            }
        }
        
        console.log('\nDeduplication completed!');
        console.log(`Total cards updated: ${totalUpdated}`);
        console.log(`Total duplicates deleted: ${totalDeleted}`);
        
        // Get final count
        const finalCount = await Card.countDocuments();
        console.log(`Final card count: ${finalCount}`);
        
        process.exit(0);
    } catch (error) {
        console.error('Error during deduplication:', error);
        process.exit(1);
    }
};

deduplicateCards(); 