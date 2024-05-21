# dassie-tools

Tool registration workflow

1. check for API key, notify Dassie of
   - our webhook domain
   - the toolkit name
   - the tools we've registered:
     - for each, share `name, description, input schema, route`. (Output is just a string)
2. on webhook called
  - verify the HMAC signature to ensure it comes from Dassie.
  - If matches, call the user-supplied handler.
3. if using Ollama, also notify Dassie of the Ollama ngrok url






Testing:
* [jest](https://www.npmjs.com/package/jest)
  * Jest is a delightful JavaScript Testing Framework with a focus on simplicity.
* [supertest](https://www.npmjs.com/package/supertest)
  * HTTP assertions made easy via superagent.

## Setup

```
npm install
```



## Using local models via Ollama:

1. Install and run [Ollama](https://ollama.com/download)
2. Sign up for [ngrok](https://dashboard.ngrok.com/)
3. Get an [ngrok auth token](https://dashboard.ngrok.com/get-started/your-authtoken). Add it to your `.env` file, by setting `NGROK_AUTHTOKEN=...`



## Lint

```
npm run lint
```

## Test

```
npm run test
```

## Development

```
npm run dev
```



#### Calling tools locally

Using `curl`
```sh
curl -w "\nstatus code: %{http_code}\n" -X POST -H "Content-Type: application/json" -d '{"query":"howdy"}' http://localhost:8888/api/tools?tool=Run+SQL
```

Using browser `fetch`

```javascript
fetch('http://localhost:8888/api/tools?tool=Run+SQL', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({query: "howdy"})
}).then(response => {
    console.log('Status code:', response.status);
    return response.json();
}).then(data => {
    console.log('Response data:', data);
}).catch(error => {
    console.error('Error:', error);
});
```

