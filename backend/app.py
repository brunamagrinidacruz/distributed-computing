from flask import Flask
from flask import request, abort
import bcrypt
import jwt
from bson.objectid import ObjectId
from waitress import serve
import random
import pypokedex
from pymongo.errors import DuplicateKeyError
from datetime import datetime
import time
from db import MongoAPI
from constants import REGIONS, JWT_SECRET, REVERSE_PROXY_IP
from arguments import parser
from flask_cors import CORS

app = Flask(__name__)
db = MongoAPI().db
cors = CORS(app, resources={r"/*": {"origins": "*"}})

def validation(user_id):
    try:
        token = request.headers["Authorization"].split("Bearer ")[1]
        token = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
    except:
        return "Error on Bearer Token"
    
    if token["id"] != user_id:
        return "Access forbidden"
    
    user = db.users.find_one({"_id": ObjectId(token["id"])})
    if user["region"] != args.region and user["region"] in REGIONS:
        return "You do not have access to this server region"
    if user["region"] != args.region and user["region"] not in REGIONS:
        return "This server region is not supported"
    
    return "OK"

@app.before_request
def block_method():
    ip = request.environ.get('REMOTE_ADDR')
    if ip != REVERSE_PROXY_IP:
        abort(403)

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
                token = jwt.encode({"id": str(user["_id"])}, JWT_SECRET, algorithm='HS256')
                return token
            
            return "Wrong password/username"
        
        return "Field 'password' missing"
    
    else:
        return "Field 'username' missing"
    
@app.route('/ping')
def ping():
    server_number = int(args.name[2:])
    if server_number % 2 == 0:
        time.sleep(15)
    return f"Server {args.name} in region {args.region}"

@app.route('/user/<user_id>/pokemon', methods=['POST', 'GET'])
def random_pokemon(user_id):
    message = validation(user_id)
    if message != "OK":
        return message
    
    user_id = ObjectId(user_id)
    
    if request.method == 'POST':
        today = datetime.today()
        today = datetime(today.year, today.month, today.day)

        if db.user_pokemon.find_one({"user_id": user_id, 'date': today}):
            return f"You already collect a pokemon today. Come back tomorrow for more!"
        else:
            dex = random.randint(0, 1010)
            p = pypokedex.get(dex=dex)

            db.user_pokemon.insert_one({
                "pokemon": dex,
                "user_id": ObjectId(user_id),
                "date": today
            })
            return f"You got a brand new {p.name} (dex = {dex})!"
    
    elif request.method == 'GET':
        user_pokemons = db.user_pokemon.find({"user_id": user_id})

        pokemons = {}
        for user_pokemon in user_pokemons:
            pokemon = user_pokemon['pokemon']
            
            quantity = 0
            if pokemon in pokemons:
                quantity = pokemons[pokemon]

            pokemons[pokemon] = quantity+1

        return pokemons
    
    
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
            serve(app, host='0.0.0.0', port=args.port)
                
    except Exception as e:
        print(e)