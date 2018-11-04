import http.client, urllib.request, urllib.parse, urllib.error, base64

subscription_key = 'ae88593e6dfc44e1bbb25017255cd891'
assert subscription_key

headers = {
    # Request headers
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': subscription_key,
}

params = urllib.parse.urlencode({
})

urll = 'https://i.dailymail.co.uk/i/pix/2013/12/12/article-2522479-1A0DAE1900000578-842_634x645.jpg'
data = { 'url': urll }

try:
    conn = http.client.HTTPSConnection('https://westus.api.cognitive.microsoft.com/face/v1.0')
    conn.request("POST", "/emotion/v1.0/recognize?%s" % params, "{body}", headers)
    response = conn.getresponse()
    data = response.read()
    print(data)
    conn.close()
except Exception as e:
    print("[Errno {0}] {1}".format(e.errno, e.strerror))

