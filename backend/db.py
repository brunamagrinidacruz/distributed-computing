import pymongo

from constants import REGIONS, CONN_STR

class MongoAPI:
      def __init__(self):
            client = pymongo.MongoClient(CONN_STR)
            db = client.get_database('Cluster0')
            self.db = db

            collections = db.list_collection_names()      
            if 'users' not in collections:
                  self.create_users()
                  db.users.create_index([("username", pymongo.ASCENDING)], unique=True)
                  db.users.create_index([("email", pymongo.ASCENDING)], unique=True)
                  print("Collection 'users' created")
            if 'user_pokemon' not in collections:
                  self.create_user_pokemon()
                  db.user_pokemon.create_index([("user_id", pymongo.ASCENDING), ("date", pymongo.ASCENDING)], unique=True)
                  print("Collection 'user_pokemon' created")

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
                        'required': ['pokemon', 'user_id', 'date'],
                        'properties': {
                              'pokemon': {
                                    'bsonType': 'int'
                              },
                              'user_id': {
                                    'bsonType': 'objectId'
                              },
                              'date': {
                                    'bsonType': 'date'
                              }
                        }
                  }
            })