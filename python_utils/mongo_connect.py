# the python code used to interact with the MongoDB database
import pymongo
from pprint import pprint

def mongo_connect(uri):
    # returns the mongodb client
    try:
        client = pymongo.MongoClient(uri)
    except pymongo.errors.ConfigurationError:
        print("Invalid MongoDB URI")
        exit(1)
    # wrong password. this is written by copilot, not sure if it's correct
    except pymongo.errors.OperationFailure:
        print("Invalid MongoDB credentials")
        exit(1)
    client = pymongo.MongoClient(uri)
    return client

def show_collections(db):
    # returns the list of collections in the database
    return db.list_collection_names()

def mongodb_get_one(collection, query):
    # returns a single document from the collection
    return collection.find_one(query)

def mongodb_get_all(collection, query):
    # returns all documents from the collection
    return collection.find(query)

if __name__ == "__main__":
    client = mongo_connect("mongodb://localhost:27017") # the mongodb hosted on VM
    db = client['lsf'] # get the "lsf" database
    
    collection = db['finished_jobs']
    
    example = mongodb_get_one(collection, {}) # use the empty query to get the first document
    pprint(example)


    example_exit_job = mongodb_get_one(collection, {"jStatus": 'exit'}) # get the first document with exit_code 0
    pprint(example_exit_job)

    
    

    

