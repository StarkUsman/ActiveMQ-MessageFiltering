const stompit = require('stompit');

stompit.connect({ host: 'localhost', port: 61613 }, (error, client) => {
  if(error){
    console.error('Connection error:', error.message);
    return;
  }
  const messages = [
    { body: 'Message 1', 'permission': 'role1' },
    { body: 'Message 2', 'permission': 'role2' },
    { body: 'Message 3', 'permission': 'role3' },
    { body: 'Message 4', 'permission': 'role1' },
    { body: 'Message 5', 'permission': 'role2' },
    { body: 'Message 6', 'permission': 'role3' },
  ];

  messages.forEach(message => {
    const sendHeaders = {
      destination: '/queue/newQueue',
      'permission': message.permission,
    };

    const frame = client.send(sendHeaders);
    // frame.write(message.body);
    frame.end(message.body); 
    // console.log('Sent messages:', messages.map(m => m.body));
    console.log(`Sent message ${message.body} to ${sendHeaders.destination} with permission ${sendHeaders.permission}`);
  });

  client.disconnect();
  
});
//   messages.forEach(message => {
//     const sendHeaders = {
//       destination: '/queue/queue_name',
//       'permission': message.permission,
//     };

//     const frame = client.send(sendHeaders);
//     frame.end(message.body);
//   });

//   console.log('Sent messages:', messages.map(m => m.body));


// // Simulate sending multiple messages to the queue
// sendMessagesToQueue();
