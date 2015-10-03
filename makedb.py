import json
from skimage import io
import base64
import db
from PIL import Image
import StringIO

f = open('patient_data.json')

data = json.loads(f.read())
db.patients.remove()
for patient in data['patients']:
    for record in patient['records']:
        if record['type'] == 'img':
            link = record['value']
            img = io.imread(link)
            img = Image.fromarray(img)
            f = StringIO.StringIO()
            img.save(f, format='png')

            record['value'] = base64.b64encode(f.getvalue())
    db.patients.insert(patient)
