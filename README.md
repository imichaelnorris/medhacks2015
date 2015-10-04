# medhacks2015
[http://wecrypthealth.com/](http://wecrypthealth.com/)

[alternative link](http://disagree.io/)


Elevator Pitch:
We believe patients should have control of their own medical data.  This means,
among other empowering tools, giving them tools to share their records with 
medical researchers.

We have created a web service which does two things well: it allows a patient to
allow parts of their records to only be visible by certain groups, and it also
encrypts your records in your browser using your own key before the records
reach our servers.

If you have heart disease, you may want to not share it with your employer.  No
worries.  With We Crypt Health, your data is encrypted in the browser before it
reaches our server.

You share your data with physicians, pharmacists, medical researchers, and
public health officlas by encrypting your data with their public keys.  This
enables them to read your data, but if it's stolen before it reaches the
intended target, then your attacker is left with an encrypted blob.

We never touch unencrypted data which means your data is safe in our hands.


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
