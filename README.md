# medhacks2015
README

Patients choose who their data is shared with, by selecting which researchers
get access to their data.  When a patient changes their data, the data is
re-encrypted using a standard group keying scheme, then the encrypted data is
uploaded to the server.

Researchers only get access to the data that they are able to unencrypt, which
adds an extra layer of security and gives patients more control.

for mongo stuff:
all collections are accessed through the db object
import db

patient collection
db.patients
{'patients': [
    patient: id, records: [record]
    where record: {"name", "type", "value"}
}

db.access
{"id": 

#Dependencies
##Python
(pip install $PACKAGE$)
scikit
scikit-image
flask
