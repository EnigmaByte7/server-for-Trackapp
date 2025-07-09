const {createClient} = require('redis')

const client = createClient({url: 'redis://localhost:6379'});

client.connect().then(() => console.log('client connected'))

module.exports = client