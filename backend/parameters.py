import argparse
import re

from constants import REGIONS

def server_name_regex():
    re_str = "^("
    for region in REGIONS:
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
parser.add_argument('-p', '--port', help='server port', default=8080, type=int)
parser.add_argument('-r', '--region', choices=list(REGIONS), required=True, help='region to which this server belongs to')
    