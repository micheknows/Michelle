import os
from chatgpt import Assistant

# Set your ChatGPT API Key
API_KEY = os.getenv("sh-Jfb3Wx23UyyNaBTxtMdaT3BlbkFJ600pLLfHjKBOuNLErH2e")

# Create the assistant
#assistant = Assistant(API_KEY)

# Send a message and get the response
#response = assistant.send_message("Hello")
#print(response)
#print("hi")

from flask import Flask
app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello World!"

if __name__ == "__main__":
    app.run(debug=True)