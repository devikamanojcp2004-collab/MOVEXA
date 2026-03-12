const Redis = require('ioredis');
const client = new Redis({ host: '127.0.0.1', port: 6379, maxRetriesPerRequest: 1 });

client.ping().then(res => {
    console.log("Redis is running: ", res);
    process.exit(0);
}).catch(err => {
    console.error("Redis connection failed: ", err.message);
    process.exit(1);
});
