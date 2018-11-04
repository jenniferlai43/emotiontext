# python version of using the Microsoft Azure Face API 

import json, requests

filename = "happy.jpeg"
with open(filename, "rb") as imageFile:
    img_data = imageFile.read()

subscription_key = '6809d2c368654653a643c30af830f24a'

headers = {
    #'Content-Type': 'application/json',
    'Content-Type': 'application/octet-stream',
    'Ocp-Apim-Subscription-Key': subscription_key
}

#img_url = "https://image.shutterstock.com/image-photo/young-funny-woman-making-fish-260nw-544767610.jpg"
#img_data = json.dumps({'url': img_url})

r = requests.post("https://westus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=false&returnFaceAttributes=emotion", data=img_data, headers=headers)

emotions = r.json()
if not emotions:
    print("Face is not recognized in image. Try again.")
else:
    d = emotions[0]["faceAttributes"]["emotion"]
    topKey = "anger"
    for key in d:
        if d[key] > d[topKey]:
            topKey = key
    print(topKey, d[topKey])
    #print(r.content)