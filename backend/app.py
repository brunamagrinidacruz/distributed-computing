from flask import Flask
from flask import request, abort
import bcrypt
import jwt
from bson.objectid import ObjectId
from waitress import serve
import random
import pypokedex
from pymongo.errors import DuplicateKeyError

from db import MongoAPI
from constants import REGIONS, JWT_SECRET
from parameters import parser

app = Flask(__name__)
db = MongoAPI()


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
    if ip not in {"157.245.82.190", "127.0.0.1"}:
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
            serve(app, host='0.0.0.0', port=args.port)
                
    except Exception as e:
        print(e)