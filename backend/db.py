import pymongo
import os

from constants import REGIONS

class MongoAPI:
      def __init__(self):
            client = pymongo.MongoClient(os.getenv('CONN_STR'))
            db = client.get_database('Cluster0')
            collections = db.list_collection_names()
                  
            if 'users' not in collections:
                  self.create_users()
                  db.users.create_index([("username", pymongo.ASCENDING)], unique=True)
                  db.users.create_index([("email", pymongo.ASCENDING)], unique=True)
                  print("Collection 'users' created")
                  
            if 'user_pokemon' not in collections:
                  self.create_user_pokemon()
                  db.user_pokemon.create_index([("pokemon", pymongo.ASCENDING), ("user_email", pymongo.ASCENDING)], unique=True)
                  print("Collection 'user_pokemon' created")

            self.db = db

      def create_users(self):
            self.db.create_collection('users', validator={
                  '$jsonSchema': {
                        'bsonType': 'object',
                        'additionalProperties': True,
                        'required': ['username', 'email', 'password', 'region'],
                        'properties': {
                        'username': {
                              'bsonType': 'string'
                        },
                        'email': {
                              'bsonType': 'string'
                        },
                        'password': {
                              'bsonType': 'binData'
                        },
                        'region': {
                              'enum': list(REGIONS)
                        }
                        }
                  }
            })
      
      def create_user_pokemon(self):
            self.db.create_collection('user_pokemon', validator={
                  '$jsonSchema': {
                        'bsonType': 'object',
                        'additionalProperties': True,
                        'required': ['pokemon', 'user_email', 'quantity'],
                        'properties': {
                        'pokemon': {
                              'bsonType': 'int'
                        },
                        'user_id': {
                              'bsonType': 'objectId'
                        },
                        'quantity': {
                              'bsonType': 'int'
                        }
                        }
                  }
            })