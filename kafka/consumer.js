const kafka = require('./kafka.js')
const {remdistance} = require('../src/index.js')
const consumer = kafka.consumer({ groupId: 'new-group3' })
const client = require('../redis/redis.js')
const pubclient = client.duplicate()

async function consumer1() {
    await consumer.connect()
    await consumer.subscribe({ topic: 'location_updates', fromBeginning: false })
    await pubclient.connect()
    await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
            const {orderid, latitude, longitude, speed} = await JSON.parse(message.value)
            console.log(orderid, latitude, longitude, speed);
            const distance = await remdistance(orderid, latitude, longitude)
            let ETA = 0;
            if(distance < 5){
                ETA = 0;
            }
            else{
                if(speed === 0) ETA = 999
                else {
                    ETA = distance / speed
                    ETA = Math.ceil(distance / speed) / 60
                }
            }
            console.log(ETA);
            
            const data = JSON.stringify({
                latitude: latitude,
                longitude: longitude,
                speed: speed,
                ETA: ETA
            })
            await pubclient.publish(`order-${orderid}`, data)
        },
    })
}

consumer1()