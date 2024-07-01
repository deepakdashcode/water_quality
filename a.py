import random as r
def test(ls):
    import requests

    API_KEY = "fh3c-iGWuo91Ibmbz_oYy4orKtfKS45UXfFqY9zWI2D2"
    token_response = requests.post('https://iam.cloud.ibm.com/identity/token', data={"apikey":
                                                                                        API_KEY, "grant_type": 'urn:ibm:params:oauth:grant-type:apikey'})
    mltoken = token_response.json()["access_token"]

    header = {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + mltoken}

    payload_scoring = {
        "input_data": [
            {
                "fields": ["ph", "Hardness", "Solids", "Chloramines", "Sulfate", "Conductivity", "Organic_carbon", "Trihalomethanes", "Turbidity"],
                "values": [
                    ls
                ] * 10000
            }
        ]
    }
    response_scoring = requests.post('https://us-south.ml.cloud.ibm.com/ml/v4/deployments/c9279248-db7c-41d9-945f-536771b01f5e/predictions?version=2021-05-01', json=payload_scoring,
                                    headers={'Authorization': 'Bearer ' + mltoken})
    print("Scoring response")
    print(response_scoring.json())


while True:
    ls = []
    for i in range(9):
        ls.append(r.randint(3, 10))
    test(ls)
    print(ls)
    ls= []
