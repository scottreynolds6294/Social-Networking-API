const mongoose = require('mongoose');
const connection = require('../config/connection');
const { User, Thought } = require('../models'); 

connection.on('error', (err) => console.error(err));

connection.once('open', async () => {
    console.log('Connected to the database!');

    const userCheck = await connection.db.listCollections({ name: 'users' }).toArray();
    if (userCheck.length) {
        await connection.db.dropCollection('users');
    }

    const thoughtCheck = await connection.db.listCollections({ name: 'thoughts' }).toArray();
    if (thoughtCheck.length) {
        await connection.db.dropCollection('thoughts');
    }

    const seedData = async () => {
        const users = await User.insertMany([
            { username: 'johnDoe', email: 'john.doe@example.com' },
            { username: 'janeDoe', email: 'jane.doe@example.com' },
            { username: 'marySmith', email: 'mary.smith@example.com' },
            { username: 'aliceJones', email: 'alice.jones@example.com' },
            { username: 'bobBrown', email: 'bob.brown@example.com' },
        ]);
        console.log('Users seeded');

        const thoughts = await Thought.insertMany([
            {
                thoughtText: 'This is my first thought!',
                username: users[0].username,
                reactions: [
                    {
                        reactionBody: 'Great thought!',
                        username: users[1].username,
                    },
                    {
                        reactionBody: 'I totally agree!',
                        username: users[2].username,
                    },
                ],
            },
            {
                thoughtText: 'Just another day of learning...',
                username: users[1].username,
                reactions: [
                    {
                        reactionBody: 'Keep up the good work!',
                        username: users[0].username, 
                    },
                ],
            },
            {
                thoughtText: 'I love programming!',
                username: users[0].username,
                reactions: [
                    { 
                        reactionId: new mongoose.Types.ObjectId(),
                        reactionBody: 'Same here!',
                        username: users[1].username,
                    },
                    {
                        reactionId: new mongoose.Types.ObjectId(),
                        reactionBody: 'Programming is fun!',
                        username: users[2].username,
                    },
                ],
            },
            {
                thoughtText: 'MongoDB is great for NoSQL databases.',
                username: users[1].username,
                reactions: [
                    { 
                        reactionId: new mongoose.Types.ObjectId(),
                        reactionBody: 'Absolutely!',
                        username: users[0].username,
                    },
                ],
            },
            {
                thoughtText: 'Express.js makes backend development so much easier!',
                username: users[2].username,
                reactions: [
                    { 
                        reactionId: new mongoose.Types.ObjectId(),
                        reactionBody: 'Couldn’t agree more!',
                        username: users[3].username,
                    },
                    {
                        reactionId: new mongoose.Types.ObjectId(),
                        reactionBody: 'It really simplifies things.',
                        username: users[4].username,
                    },
                ],
            },
            {
                thoughtText: 'I enjoy learning about GraphQL.',
                username: users[3].username,
                reactions: [],
            },
            {
                thoughtText: 'Node.js is a powerful JavaScript runtime.',
                username: users[4].username,
                reactions: [
                    { 
                        reactionId: new mongoose.Types.ObjectId(),
                        reactionBody: 'JavaScript everywhere!',
                        username: users[0].username,
                    },
                    {
                        reactionId: new mongoose.Types.ObjectId(),
                        reactionBody: 'Love it!',
                        username: users[1].username,
                    },
                ],
            },
        ]);
        console.log('Thoughts seeded');

        const friendships = [
            { user: users[0]._id, friends: [users[1]._id, users[2]._id] },
            { user: users[1]._id, friends: [users[0]._id, users[3]._id] },
            { user: users[2]._id, friends: [users[0]._id, users[3]._id, users[4]._id] }, 
            { user: users[3]._id, friends: [users[1]._id, users[4]._id] },
            { user: users[4]._id, friends: [users[2]._id, users[3]._id] },
        ];

        await Promise.all(friendships.map(({ user, friends }) => {
            return User.findByIdAndUpdate(user, { $addToSet: { friends } });
        }));

        process.exit(0);
    };

    seedData().catch((err) => {
        console.error(err);
        mongoose.connection.close();
    });
});
