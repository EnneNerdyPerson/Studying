#imports
import hashlib
import sys
import os

#save arguments
salt_arg = sys.argv[1]
pass_arg = sys.argv[2]

#check if creating account or logging in
if salt_arg == "":      #create account
    #get length of salt
    length = (len(pass_arg) % 16) + 16

    #generate salt
    salt = os.urandom(length)

    #concatenate password and salt
    code = pass_arg + str(salt)

    #hash generated code
    hash_result = hashlib.sha256(code.encode("utf-8")).hexdigest()

    #return salt and password
    print(str(salt) +",,,,,"+ hash_result)

elif salt_arg != "":    #log-in
    #concatenate password and salt
    code_check = pass_arg + salt_arg

    #hash input code
    hash_check = hashlib.sha256(code_check.encode("utf-8")).hexdigest()

    #return hashed pass + salt
    print(hash_check)

else:
    print("failure")