module.exports = () => ({
    io: {
      enabled: true,
      config: {
        contentTypes: ['api::message.message'],
        events: [
          {
            name: 'connection',
            handler: ({ strapi }, socket) => {
              console.log('A user connected');
  
              // Handle incoming messages
              socket.on('message:create', async (data) => {
                console.log('Message received:', data);
  
                // Here you might want to save the message to your database
                const createdMessage = await strapi.entityService.create('api::message.message', {
                  data: {
                    content: data,
                  },
                });
  
                // Emit the message to the client
                socket.emit('message:create', createdMessage);
              });
  
              socket.on('disconnect', () => {
                console.log('User disconnected');
              });
            },
          },
        ],
      },
    },
  });
  