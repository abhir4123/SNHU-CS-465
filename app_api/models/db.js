const mongoose = require('mongoose');
const host = process.env.DB_HOST || '127.0.0.1';
const dbURI = `mongodb://${host}/travlr`;
const readLine = require('readline');

mongoose.set('strictQuery', true);

const connect = async () => {
    try {
        await mongoose.connect(dbURI);
    } catch (err) {
        console.log('Initial Mongo connect failed:', err.message, '— retrying in 1s');
        setTimeout(connect, 1000);
    }
};

// connection events
mongoose.connection.on('connected', () => {
    console.log(`Mongoose connected to ${dbURI}`);
});
mongoose.connection.on('error', err => {
    console.log('Mongoose connection error:', err);
});
mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

// Windows SIGINT fix
if (process.platform === 'win32') {
    const rl = readLine.createInterface({ input: process.stdin, output: process.stdout });
    rl.on('SIGINT', () => process.emit('SIGINT'));
}

const gracefulShutdown = (msg) => {
    mongoose.connection.close(() => {
        console.log(`Mongoose disconnected through ${msg}`);
    });
};

process.once('SIGUSR2', () => {
    gracefulShutdown('nodemon restart');
    process.kill(process.pid, 'SIGUSR2');
});
process.on('SIGINT', () => {
    gracefulShutdown('app termination');
    process.exit(0);
});
process.on('SIGTERM', () => {
    gracefulShutdown('app shutdown');
    process.exit(0);
});

connect();

// register schemas/models
require('./travlr');
module.exports = mongoose;
