const stompit = require('stompit');

stompit.connect({ host: 'localhost', port: 61613 }, (error, client) => {
  if (error) {
    console.error('Connection error:', error.message);
    return;
  }

  // Subscribe to a queue with specific permission
  const subscribeHeaders = {
    destination: '/queue/newQueue',
  };

  client.subscribe(subscribeHeaders, (error, message) => {
    if (error) {
      console.error('Subscription failed:', error.message);
      return;
    }

    // Read permission from message headers
    const permission = message.headers['permission'];

    // Read message body
    message.readString('utf-8', (readError, body) => {
      if (readError) {
        console.error('Error reading message body:', readError.message);
        return;
      }
      
      // Check if permission matches the expected role
      if (permission && permission === 'role1') {
        console.log('Consumer received message:', body);
        // Process message with role1 permission here
      } else {
        // Send back message to the queue for other consumers
        const sendHeaders = {
          destination: '/queue/newQueue',
          'permission': permission,
        };
  
        const frame = client.send(sendHeaders);
        frame.end(body); 
        // console.log('Message sent back to the queue for other consumers:', body);
      }
    });
  });
});
