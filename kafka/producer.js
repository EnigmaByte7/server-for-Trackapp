import kafka from "./kafka.js"
const producer = kafka.producer()

export async function produce(message) {
    await producer.connect()

    await producer.send({
    topic: 'location_updates',
    messages: [
            { value: message },
        ],
    })

    await producer.disconnect()
}
