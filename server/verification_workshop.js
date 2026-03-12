require('dotenv').config();
const mongoose = require('mongoose');
const workshopRepository = require('./repositories/workshopRepository');
const userRepository = require('./repositories/userRepository');
const connectDB = require('./config/db');

async function verify() {
    await connectDB();
    console.log('--- Workshop Flow Verification Started ---');

    console.log('1. Finding a test dancer...');
    const dancers = await userRepository.findAllDancers();
    if (dancers.length === 0) {
        throw new Error('No dancers found to test with.');
    }
    const testDancer = dancers[0];
    console.log('Using dancer:', testDancer.email);

    console.log('\n2. Testing Workshop Creation (Simulating Controller Input)...');
    
    // Simulating the payload from the new React form: "02:30 PM"
    const mockRequest = {
        title: 'Test AM/PM Workshop',
        description: 'Testing the new time format',
        style: 'Hip Hop',
        date: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days from now
        time: '02:30 PM', // New format from frontend dropdowns
        duration: '2 hours',
        location: 'Test Location',
        price: 500,
        capacity: 20,
        instructor: testDancer._id, // Set by controller auth middleware
        status: 'approved' // Set explicitly by controller now
    };

    console.log('Payload:', mockRequest);

    const workshop = await workshopRepository.create(mockRequest);
    console.log('Created Workshop ID:', workshop._id);
    console.log('Status is:', workshop.status);
    console.log('Time is:', workshop.time);

    if (workshop.status !== 'approved') {
        throw new Error('Workshop was not auto-approved!');
    }

    console.log('\n3. Cleaning up...');
    await mongoose.model('Workshop').findByIdAndDelete(workshop._id);

    console.log('--- Verification Complete ---');
    process.exit(0);
}

verify().catch(err => {
    console.error('--- Verification Failed ---');
    console.error(err);
    process.exit(1);
});
