let axios = require('axios')
let express = require('express')
let cors = require('cors')
let query = require('query-string')

let app = express()
app.use(express.json())
app.use(cors())

if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

let AUTHORIZATION_STRING = Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64');

app.listen(3000, () => {
	console.log("Server running on port 3000");
});

app.post('/getTokens', (req, res) => {
	const { code } = req.body.body;
	const response = getTokens(code);
	// console.log('REQUEST SENT TO BACKEND: \n\n', req.body.body, "\n")
	response.then(response => res.send(response))
})

app.get('/getCredentials', (req, res) => {
	const clientId = process.env.CLIENT_ID
	const clientSecret = process.env.CLIENT_SECRET
	const redirectUri = process.env.REDIRECT_URI
	const credsB64 = AUTHORIZATION_STRING;
	const credentials = { clientId, clientSecret, redirectUri, credsB64 }
	console.log('Sending credentials: ', credentials)
	res.send(credentials)
})

async function getTokens(code) {
	const redirectUri = process.env.REDIRECT_URI
	console.log("MAKING REQUEST:\n Code: ", code)
	let body = {
		code: code,
		redirect_uri: redirectUri,
		grant_type: 'authorization_code'
	}
	const headers = {
		'Authorization': 'Basic ' + AUTHORIZATION_STRING,
		'Content-Type': 'application/x-www-form-urlencoded'
	}

	axios.post('https://accounts.spotify.com/api/token', query.stringify(body), { headers })
		.then(res => console.log(res))
		.catch(e => console.log('Error!: ', e))
}

