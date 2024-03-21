const stompit = require('stompit');

stompit.connect({ host: 'localhost', port: 61613 }, (err, client) => {
    if (err) {
        console.error('Connection error:', err.message);
        return;
    }

    // Send messages with priorities to each queue
    const messages = {
        '/queue/importantMessages': 'This is an important message!',
        '/queue/normalMessages': 'This is a normal message.',
        '/queue/lowPriorityMessages': 'This is a low priority message.'
    };

    Object.entries(messages).forEach(([destination, message]) => {
        const frame = client.send({ destination });
        frame.write(message);
        frame.end();
        console.log(`Sent message "${message}" to ${destination}`);
    });

    // Disconnect after sending messages
    client.disconnect();
});
