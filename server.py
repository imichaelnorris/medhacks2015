from flask import Flask, request, session, g, redirect, url_for, \
     abort, render_template, flash, Response

import db
import json

app = Flask(__name__, static_path='', static_url_path='', static_folder='')

@app.route('/')
def index():
    return render_template("index.html")

#@app.route('/<path:path>')
#def serve_lib(path):
#    return app.send_static_file(path)

@app.route('/get_patient', methods=['GET'])
def get_patient():
    #if not session.get('logged_in'):
    #    abort(401)
    patient = db.patients.find_one()
    del patient['_id']
    patient['data'] = patient['records']
    #print json.dumps(patient)
    #return "3"
    resp = Response(json.dumps(patient),status=200, mimetype='application/json')
    return resp

@app.route('/access', methods=['POST'])
def update_access():
    #print(
    rec = request.get_json()
    from_mongo = db.patients.find_one()
    for index, row in enumerate(rec['records']):
        people = row['access']
        keys = row['keys']
        people = sorted(list(set( list(people) + ['patient', 'physician'])))
        row['access'] = people
        #print(from_mongo)
        from_mongo['records'][index] = row
    x = from_mongo
    print(x['records'][0]['value'])
    db.patients.update({'_id': x['_id']}, {"$set": x}, upsert=False)
    #$.ajax({method: "POST", url: "http://localhost:5000/rekey",
    #data:JSON.stringify({"access": [1,2,3], "record": 0})})
    return ""

if __name__ == '__main__':
    app.run(debug=True)
