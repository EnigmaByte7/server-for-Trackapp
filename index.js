const express = require('express')
const app = express()
const cors = require('cors')
const {init, findorder, claim} = require('./src/index')
const {produce} = require('./kafka/producer')

app.use(cors())
app.use(express.json())
app.get('/', (req, res) => {
	res.send('Hello, world')
})

app.post('/createorder', async (req, res) => {
	console.log(req.body);
	
	const {orderid, latitude, longitude} = req.body
	console.log(orderid, latitude, longitude);
	await init(orderid, latitude, longitude)
	res.send('ok')

})

app.post('/findorder', async (req, res) => {
	const {latitude, longitude} = req.body
	console.log(latitude, longitude);
	

	const order = await findorder(latitude, longitude)
	console.log(order);
	
	res.send({order : order})
})

app.post('/claimorder', async (req, res) => {
	const {orderid} = req.body
	await claim(orderid)
	res.send('ok')
})

app.post('/publish', async(req, res) => {
	const {orderid, latitude, longitude, speed} = req.body
	console.log('here.....', orderid, latitude, longitude, speed);
	
	const mesg = JSON.stringify({orderid, latitude, longitude, speed})
	await produce(mesg)
	res.send('ok')
})

app.listen(3001, ()=>{
	console.log('Serving at 3001')
})
