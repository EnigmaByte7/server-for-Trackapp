const kafka = require('./kafka.js')

const admin = kafka.admin()

async function init() {
    await admin.connect()
    await admin.createTopics({
        topics: [{
            topic: "location_updates",
            numPartitions: 2
        }]
    })

    await admin.disconnect()
}

init()