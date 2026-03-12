require('dotenv').config();
const mongoose = require('mongoose');
const userRepository = require('./repositories/userRepository');
const connectDB = require('./config/db');

async function verify() {
    await connectDB();
    console.log('--- Dancer Verification Started ---');

    console.log('1. Creating a test pending dancer...');
    let pendingDancer = await userRepository.create({
        name: 'Test Pending Dancer',
        email: 'pending_dancer@movexa.com',
        password: 'password123',
        role: 'dancer'
    });
    console.log('Created:', pendingDancer.email, 'Approved:', pendingDancer.isApproved);

    console.log('\n2. Fetching all dancers...');
    const allDancers = await userRepository.findAllDancers();
    console.log(`Found ${allDancers.length} total dancers.`);
    const foundPending = allDancers.find(d => d.email === 'pending_dancer@movexa.com');
    if (!foundPending) throw new Error('Pending dancer not found in all dancers list');

    console.log('\n3. Testing soft delete (rejectDancer)...');
    await userRepository.softDelete(pendingDancer._id);
    const verifyDeleted = await userRepository.findByEmail('pending_dancer@movexa.com');
    if (verifyDeleted) throw new Error('Soft deleted user still returned by findByEmail');
    
    console.log('Soft delete works. Cleaning up test user completely from DB...');
    // Real delete to clean up DB
    await mongoose.model('User').findByIdAndDelete(pendingDancer._id);

    console.log('--- Verification Complete ---');
    process.exit(0);
}

verify().catch(err => {
    console.error('--- Verification Failed ---');
    console.error(err);
    process.exit(1);
});
