#import os
# from chatgpt import Assistant

# Set your ChatGPT API Key
#API_KEY = os.getenv("sh-Jfb3Wx23UyyNaBTxtMdaT3BlbkFJ600pLLfHjKBOuNLErH2e")

# Create the assistant
#assistant = Assistant(API_KEY)

# Send a message and get the response
#response = assistant.send_message("Hello")
#print(response)
#print("hi")
# app.py

from flask import Flask, render_template
app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/tpt/createraces')
def createraces():
    return render_template('tpt/createraces.html')

if __name__ == '__main__':
   app.run(debug=True)