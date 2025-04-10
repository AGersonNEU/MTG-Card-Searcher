const mongoose = require('mongoose');
const Card = require('./models/Card');
require('dotenv').config();

const sampleCards = [
    {
        id: "1",
        name: "Lightning Bolt",
        image: "https://cards.scryfall.io/large/front/0/d/0d77f9f0-4a3d-4c5c-8b3c-3b5c5c8b3c3b.jpg",
        cost: "{R}",
        set: "Alpha",
        commander: "Legal",
        standard: "Not Legal",
        modern: "Legal",
        duel: "Legal",
        colors: ["Red"],
        releaseDate: "1993-08-05"
    },
    {
        id: "2",
        name: "Counterspell",
        image: "https://cards.scryfall.io/large/front/1/e/1e77f9f0-4a3d-4c5c-8b3c-3b5c5c8b3c3b.jpg",
        cost: "{U}{U}",
        set: "Alpha",
        commander: "Legal",
        standard: "Not Legal",
        modern: "Legal",
        duel: "Legal",
        colors: ["Blue"],
        releaseDate: "1993-08-05"
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        // Clear existing cards
        await Card.deleteMany({});
        
        // Insert sample cards
        await Card.insertMany(sampleCards);
        
        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();