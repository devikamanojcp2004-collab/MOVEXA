require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Workshop = require('./models/Workshop');

const seed = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    // Create admin user
    const existing = await User.findOne({ email: 'admin@movexa.com' });
    if (!existing) {
        const admin = await User.create({
            name: 'MOVEXA Admin',
            email: 'admin@movexa.com',
            password: 'admin123',
            role: 'admin',
            bio: 'Platform administrator',
        });
        console.log(`✅ Admin created: ${admin.email} / admin123`);
    } else {
        console.log('ℹ️  Admin already exists.');
    }

    // Create a sample dancer
    let dancer = await User.findOne({ email: 'dancer@movexa.com' });
    if (!dancer) {
        dancer = await User.create({
            name: 'Priya Sharma',
            email: 'dancer@movexa.com',
            password: 'dancer123',
            role: 'dancer',
            bio: 'Professional Bollywood and Contemporary dancer with 10+ years experience.',
            avatar: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=100&q=80',
        });
        console.log(`✅ Sample dancer created: ${dancer.email} / dancer123`);
    }

    // Create sample approved workshops
    const workshopCount = await Workshop.countDocuments();
    if (workshopCount === 0) {
        await Workshop.insertMany([
            {
                title: 'Bollywood Beats Masterclass',
                description: 'Dive into the vibrant world of Bollywood dancing. Learn the iconic moves, expressions, and energy that define this style.',
                style: 'Bollywood',
                date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                time: '5:00 PM',
                duration: '2 hours',
                location: 'Mumbai, Maharashtra',
                price: 1200,
                capacity: 20,
                instructor: dancer._id,
                status: 'approved',
                level: 'Beginner',
                image: 'https://images.unsplash.com/photo-1546548729-47090eda4a0b?q=80&w=2070&auto=format&fit=crop',
            },
            {
                title: 'Contemporary Flow Workshop',
                description: 'Explore the boundaries of expression through contemporary dance. This workshop focuses on fluidity and emotional connection.',
                style: 'Contemporary',
                date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                time: '10:00 AM',
                duration: '3 hours',
                location: 'Delhi, NCR',
                price: 1500,
                capacity: 15,
                instructor: dancer._id,
                status: 'approved',
                level: 'Intermediate',
                image: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&w=800&q=80',
            },
            {
                title: 'Hip Hop Fundamentals',
                description: 'Learn the fundamentals of hip hop: breaking, locking, popping, and freestyle. Express yourself through movement.',
                style: 'Hip Hop',
                date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
                time: '6:30 PM',
                duration: '2 hours',
                location: 'Bangalore, Karnataka',
                price: 999,
                capacity: 25,
                instructor: dancer._id,
                status: 'approved',
                level: 'All Levels',
                image: 'https://images.unsplash.com/photo-1546456073-ea246a7bd25f?auto=format&fit=crop&w=800&q=80',
            },
        ]);
        console.log('✅ Sample workshops created.');
    }

    console.log('🎉 Seed complete!');
    process.exit(0);
};

seed().catch((err) => { console.error(err); process.exit(1); });
