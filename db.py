import pymongo
client = pymongo.MongoClient()

db = client.test_database

patients = db.patients
