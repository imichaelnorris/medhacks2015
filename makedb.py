import json
from skimage import io
import base64
f = open('patient_data.json')

data = json.loads(f.read())

for key in data:
    if data[key]['type'] == 'img':
        link = data[key]['value']
        img = io.imread(link)


        data[key]['value'] = base64.b64encode(img)

print(data)
