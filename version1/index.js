const stompit = require('stompit');

// Function to create subscriptions with message processing logic
function createSubscription(client, destination, filterFunction) {
    return new Promise((resolve, reject) => {
        client.subscribe({ destination, ack: 'client' }, (err, msg) => {
            if (err) {
                reject(err);
                return;
            }
            msg.readString('UTF-8', (err, body) => {
                if (err) {
                    reject(err);
                    return;
                }
                // Apply filter function to check if message should be processed
                if (filterFunction(body)) {
                    console.log(`Received message for destination ${destination}: ${body}`);
                    // Process the message here
                }
                msg.ack(); // Acknowledge the message
            });
            resolve();
        });
    });
}

stompit.connect({ host: 'localhost', port: 61613 }, (err, client) => {
    if (err) {
        console.error('Connection error:', err.message);
        return;
    }

    // Define filter functions for each subscriber
    const filters = {
        '/queue/importantMessages': message => message.includes('IMPORTANT'),
        '/queue/normalMessages': message => message.includes('NORMAL'),
        '/queue/lowPriorityMessages': message => message.includes('LOWPRIORITY')
    };

    // Create subscriptions for each subscriber with filter functions
    const subscriptions = Object.entries(filters).map(([destination, filterFunction]) =>
        createSubscription(client, destination, filterFunction)
    );

    // Wait for all subscriptions to be established
    Promise.all(subscriptions)
        .then(() => {
            console.log('All subscribers are connected and listening for messages.');

            // Send messages with different contents to the 'MyNewQueue' destination
            const messages = [
                { destination: '/queue/importantMessages', content: 'This is an IMPORTANT message!' },
                { destination: '/queue/normalMessages', content: 'This is a NORMAL message.' },
                { destination: '/queue/lowPriorityMessages', content: 'This is a LOWPRIORITY message.' }
            ];

            // Send messages to their respective destinations
            messages.forEach(({ destination, content }) => {
                const frame = client.send({ destination });
                frame.write(content);
                frame.end();
                console.log(`Sent message "${content}" to ${destination}`);
            });
        })
        .catch(err => {
            console.error('Subscription error:', err.message);
            client.disconnect();
        });
});
