import requests
import json

rec = json.loads(requests.get("http://localhost:5000/get_patient").text)
#print(rec)
#print(rec.keys())
#print(rec['records'][0].keys())
print(rec['records'][0]['access'])
print(rec['records'][1]['access'])
#print(rec['records'][0]['keys'])
