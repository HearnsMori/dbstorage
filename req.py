#To do
#Role Functionality for User Push and Pop
#xStorage
#jsonStorage
#process -aiTXTgenerator

#NurSYNC
#STI

import subprocess
import requests
import json

url = ""
apiEndPoint = ""
accessToken = None
refreshToken = None
user = None

#result = subprocess.run(["nodemon", "server.js"])

host = input("Choose \n1 production \n2 local \n")
if int(host) == 1:
    url = "https://dbstorage.onrender.com"
elif int(host) == 2:
    port = input("Port Number: ")
    url = "http://localhost:"+port

while True:
    if accessToken is None:
        if refreshToken is not None:
            payload = {
                'token': refreshToken,
            }
            data = requests.post(url+apiEndPoint, json=payload).json()
            accessToken = data['accessToken']
            refreshToken = data['refreshToken'] 
            user = data['id'] 
        auth = input("1 login \n2 signup \n")
        apiEndPoint += "/auth"
        if int(auth) == 1:
            apiEndPoint += "/signin"
            user = input("username: ")
            password = input("password: ")
            payload = {
                'id': user,
                'password': password,
            }
            data = requests.post(url+apiEndPoint, json=payload).json()
            accessToken = data['accessToken']
            refreshToken = data['refreshToken']
            user = data['id'] 
        if int(auth) == 2:
            apiEndPoint += "/signup"
            user = input("username: ")
            password = input("password: ")
            payload = {
                'id': user,
                'password': password,
            }
            data = requests.post(url+apiEndPoint, json=payload).json()
            accessToken = data['accessToken']
            refreshToken = data['refreshToken']
            user = data['id'] 
    else:
        headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+accessToken, # Example for authentication
        }

        where = int(input("1 get \n2 set \n3 remove \n4 user \n5 opinion \n6 process \n"))
        app = None
        collectionName = None
        collectionKey = None
        key = None
        value = None
        getAccess = None
        setAccess = None
        removeAccess = None
        if where == 1 or where == 2 or where == 3:
            app = input("app: ")
            collectionName = input("collectionName: ")
            collectionKey = input("collectionKey: ")
            key = input("key: ")
            value = input("value: ")
            if where != 1:
                getAccess = input("get access: ")
                setAcess = input("set access: ")
                removeAccess = input("remove access: ")
            if getAccess == "":
                getAccess = "#all"
            if setAccess == "":
                setAccess = user
            if removeAccess == "":
                removeAccess = user
            payload = {
                'app': app,
                'collectionName': collectionName,
                'collectionKey': collectionKey,
                'key': key,
                'value':value,
                'getAccess': getAccess,
                'setAcccess': setAccess,
                'removeAccess': removeAccess,
            }

            if where == 1:
                apiEndPoint = "/getItem"
                data = requests.post(url+apiEndPoint, headers=headers, json=payload).json()
                print(data);
            if where == 2:
                apiEndPoint = "/setItem"
                data = requests.post(url+apiEndPoint, headers=headers, json=payload).json()
                print(data);
            if where == 3:
                apiEndPoint = "/removeItem"
                data = requests.post(url+apiEndPoint, headers=headers, json=payload).json()
                print(data);
        if where == 4:
            #user
            apiEndPoint = "/user"
            operation = int(input("1 get \n2 set \n3 remove \n"))
            if operation == 1:
                operation = "get"
            elif operation == 2:
                operation = "set"
            elif operation == 3:
                operation = "remove"
            who = ""
            if int(input("0 self \n1 others \n")):
                who = "Self"
            else:
                who = "Other"
            key = int(input("1 all \n2 id \n3 password \n4 role \n5 contact \n"))
            if key == 1:
                key = "All"
            elif key == 2:
                key = "Id"
            elif key == 3:
                key = "Password"
            elif key == 4:
                key = "Role"
                if operation == "set":
                    operation = "push"
                elif operation == "remove":
                    operation = "pop"
            elif key == 5:
                key = "Contact"
                if operation == "set":
                    operation = "push"
                elif operation == "remove":
                    operation = "pop"
            apiEndPoint += "/" + operation + who + key
            print(apiEndPoint)
            payload = { 
            }
            while 1:
                inInput = int(input("1 add \n2 done \n"))
                if 1:
                    userKey = input("Key: ")
                    userValue = input("Value: ")
                    payload[userKey] = userValue
            data = requests.post(url+apiEndPoint, headers=headers, json=payload).json()
            print(data);
        if where == 5:
            #opinion
            apiEndPoint = "/user"
            opinionWht = int(input("1 controllersX \n2 controllersJSON \n"))
            if opinionWht == 1:
                #
                #
                #To Do
                #
                #
                break;
            elif wht == 2:
                #
                #
                #To Do
                #
                #
                break;
        if where == 6:
            #process
            apiEndPoint = "/process"
            processWht = int(input("1 jsonAI \n2 textAI \n3 webSocket \n"))
            if processWht == 1:
                apiEndPoint += "/generator/aiJSONGenerator"
                msg = input("msg: ")
                outX = input("expectedJSONOutput: ")
                payload = {
                    'msg': msg,
                    'expectedJSONOutput': outX,
                }
                data = requests.post(url+apiEndPoint, headers=headers, json=payload).json()
                print(data)
                #
                #
                #To Do
                #
                #
                break;
            elif processWht == 2:
                apiEndPoint += "/generator/aiTXTGenerator"
                msg = input("msg: ")
                payload = {
                    'msg': msg
                }
                data = requests.post(url+apiEndPoint, headers=headers, json=payload).json()
                print(data)
                #
                #
                #To Do
                #
                #
                break;
