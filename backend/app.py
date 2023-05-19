from flask import Flask
from flask import request
import os
from dotenv import load_dotenv
import argparse
import re
import pypokedex
import random
import pymongo
from pymongo.errors import DuplicateKeyError
import bcrypt
import jwt
from bson.objectid import ObjectId

regions = {"AM", "EU"}

load_dotenv()
        
app = Flask(__name__)

def server_name_regex():
    re_str = "^("
    for region in regions:
        re_str += region + "|"
    re_str = re_str[:-1]
        
    re_str += ")[0-9]*$"
    
    return re_str

def server_name_type(arg_value, pat=re.compile(server_name_regex())):
    if not pat.match(arg_value):
        raise argparse.ArgumentTypeError("Invalid value")
    return arg_value

parser = argparse.ArgumentParser(
                                prog='PokemonServer',
                                description="Server for 'SSC0904 - Sistemas Computacional Distribuídos' project",
                                formatter_class=argparse.ArgumentDefaultsHelpFormatter)

parser.add_argument('-n', '--name', help='name of the server', type=server_name_type)
parser.add_argument('-p', '--port', help='server port', default=80, type=int)
parser.add_argument('-r', '--region', choices=list(regions), required=True, help='region to which this server belongs to')

def create_users():
    db.create_collection('users', validator={
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
                    'enum': list(regions)
                }
            }
        }
    })
    
def create_user_pokemon():
    db.create_collection('user_pokemon', validator={
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
    
def validation(user_id):
    try:
        token = request.headers["Authorization"].split("Bearer ")[1]
        token = jwt.decode(token, os.getenv('JWT_SECRET'), algorithms=["HS256"])
    except:
        return "Error on Bearer Token"
    
    if token["id"] != user_id:
        return "Access forbidden"
    
    user = db.users.find_one({"_id": ObjectId(token["id"])})
    if user["region"] != args.region and user["region"] in regions:
        return "You do not have access to this server region"
    if user["region"] != args.region and user["region"] not in regions:
        return "This server region is not supported"
    
    return "OK"

@app.route('/signup', methods=["POST"])
def createAccount():
    body = request.json
    if 'password' in body:
        bytes = body['password'].encode('utf-8')
        salt = bcrypt.gensalt()
        body['password'] = bcrypt.hashpw(bytes, salt)
        body['region'] = args.region
    try:
        db.users.insert_one(body)
    except DuplicateKeyError as e:
        print(e)
        return "Duplicate Key Error"
    except Exception as e:
        print(e)
        return "Required Field Missing"
    
    return "Account created"

@app.route('/signin', methods=["POST"])
def signin():
    body = request.json
    if 'username' in body:
        username = body['username']
        user = db.users.find_one({"username": username})
        
        if (user['region'] != args.region):
            return "You do not have access to this server region"
        
        if 'password' in request.json:
            if bcrypt.hashpw(body['password'].encode('utf-8'), user["password"]) == user["password"]:
                token = jwt.encode({"id": str(user["_id"])}, os.getenv('JWT_SECRET'), algorithm='HS256')
                return token
            
            return "Wrong password/username"
        
        return "Field 'password' missing"
    
    else:
        return "Field 'username' missing"
    
@app.route('/ping')
def ping():
    return f"Server {args.name} in region {args.region}"

@app.route('/user/<user_id>/pokemon', methods=['POST', 'GET'])
def random_pokemon(user_id):
    message = validation(user_id)
    if message != "OK":
        return message

    if request.method == 'POST':
        dex = random.randint(0, 1010)
        p = pypokedex.get(dex=dex)
        
        if db.user_pokemon.find_one({"pokemon": dex, "user_id": user_id}):
            db.user_pokemon.update_one({"pokemon": dex, "user_id": user_id}, {"$inc": {'quantity': 1}})
            return f"You got another {p.name}!"
        else:
            db.user_pokemon.insert_one({
                "pokemon": dex,
                "user": user_id,
                "quantity": 1
            })
            return f"You got a brand new {p.name} (dex = {dex})!"
    elif request.method == 'GET':
        print(list(db.user_pokemon.find({"user_id": user_id})))
        return list(db.user_pokemon.find({"user_id": user_id}))
    
    
@app.route('/pokemon/<dex>')
def pokemon_info(dex):
    p = pypokedex.get(dex=int(dex))
    poke_dict =  {
        "name": p.name,
        "dex": p.dex,
        "types": p.types,
        "image": f"https://assets.pokemon.com/assets/cms2/img/pokedex/full/{p.dex}.png"
    }
    
    return poke_dict

if __name__ == '__main__':
    args = parser.parse_args()

    try:
        with app.app_context():
            client = pymongo.MongoClient(os.getenv('CONN_STR'))
            db = client.get_database('Cluster0')
            
            collections = db.list_collection_names()
            
            if 'users' not in collections:
                create_users()
                db.users.create_index([("username", pymongo.ASCENDING)], unique=True)
                db.users.create_index([("email", pymongo.ASCENDING)], unique=True)
                print("Collection 'users' created")
                
            if 'user_pokemon' not in collections:
                create_user_pokemon()
                db.user_pokemon.create_index([("pokemon", pymongo.ASCENDING), ("user_email", pymongo.ASCENDING)], unique=True)
                print("Collection 'user_pokemon' created")
                     
            app.run(host='0.0.0.0', port=args.port)
                
    except Exception as e:
        print(e)