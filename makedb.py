import json
from skimage import io
import base64
import db
f = open('patient_data.json')

data = json.loads(f.read())
db.patients.remove()
for patient in data['patients']:
    for record in patient['records']:
        if record['type'] == 'img':
            link = record['value']
            img = io.imread(link)

            record['value'] = base64.b64encode(img)
    db.patients.insert(patient)

