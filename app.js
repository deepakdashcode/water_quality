const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');
const app = express();
const port = 3000;

var data = 3
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const API_KEY = "qrY78v4fWGNjC6O2f9Gc_astixNpnD5bN0V8T63AKKsH";
function getToken(errorCallback, loadCallback) {
	const req = new XMLHttpRequest();
	req.addEventListener("load", loadCallback);
	req.addEventListener("error", errorCallback);
	req.open("POST", "https://iam.cloud.ibm.com/identity/token");
	req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	req.setRequestHeader("Accept", "application/json");
	req.send("grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=" + API_KEY);
}

function apiPost(scoring_url, token, payload, loadCallback, errorCallback){
	const oReq = new XMLHttpRequest();
	oReq.addEventListener("load", loadCallback);
	oReq.addEventListener("error", errorCallback);
	oReq.open("POST", scoring_url);
	oReq.setRequestHeader("Accept", "application/json");
	oReq.setRequestHeader("Authorization", "Bearer " + token);
	oReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	oReq.send(payload);
}


async function makeCall(array) {
    try {
        // Step 1: Get Token
        const tokenResponse = await new Promise((resolve, reject) => {
            getToken((err) => reject(err), function () {
                try {
                    resolve(JSON.parse(this.responseText));
                } catch (ex) {
                    reject(ex);
                }
            });
        });

        // Step 2: Prepare Payload
        const payload = JSON.stringify({
            "input_data": [
                {
                    "fields": [
                        "ph",
                        "Hardness",
                        "Solids",
                        "Chloramines",
                        "Sulfate",
                        "Conductivity",
                        "Organic_carbon",
                        "Trihalomethanes",
                        "Turbidity"
                    ],
                    "values": [array]
                }
            ]
        });

        console.log("Payload:", payload);

        // Step 3: Make API Post Request
        const scoring_url = "https://us-south.ml.cloud.ibm.com/ml/v4/deployments/13ecb52f-1e47-46a9-aad7-9e9a89f200e5/predictions?version=2021-05-01";
        const response = await new Promise((resolve, reject) => {
            apiPost(scoring_url, tokenResponse.access_token, payload, function (resp) {
                try {
                    resolve(JSON.parse(this.responseText));
                } catch (ex) {
                    reject(ex);
                }
            }, function (error) {
                reject(error);
            });
        });

        // Step 4: Process API Response
        const values = response.predictions[0].values;
        const data = values[0][0]; // Assuming this is what you want to return

        console.log("Returned Data:", data);
        return data;

    } catch (error) {
        console.error("Error:", error);
        throw error; // Rethrow the error to propagate it up
    }
}

app.use(bodyParser.json());


app.use(express.static(path.join(__dirname, 'public')));

app.post('/submit', async (req, res) => {
    try {
        console.log(req.body);
        let valuesArray = Object.values(req.body);
        let intValuesArray = valuesArray.map(value => parseInt(value));

        console.log(intValuesArray);

        // Call makeCall function and wait for its completion
        let dataValue = await makeCall(intValuesArray);
        
        // Handle data or do further processing
        const resultText = `Received parameters: ${JSON.stringify(req.body)}, POTABILITY: ${dataValue}`;
        console.log(`Data from makeCall: ${dataValue}`);

        res.json({ result: resultText });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
