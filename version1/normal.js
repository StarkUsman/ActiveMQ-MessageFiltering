const stompit = require('stompit');

stompit.connect({ host: 'localhost', port: 61613 }, (err, client) => {
    if (err) {
        console.error('Connection error:', err.message);
        return;
    }

    client.subscribe({ destination: '/queue/normalMessages', ack: 'client' }, (err, msg) => {
        if (err) {
            console.error('Subscription error:', err.message);
            return;
        }
        msg.readString('UTF-8', (err, body) => {
            if (err) {
                console.error('Message reading error:', err.message);
                return;
            }
            console.log('Normal Message Received:', body);
            client.ack(msg); // Acknowledge the message
        });
    });
});
