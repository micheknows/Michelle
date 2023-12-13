from json import JSONDecodeError
from venv import logger

from dotenv import load_dotenv
load_dotenv()
import json
import requests
import os

from openai import OpenAI
os.environ["OPENAI_API_KEY"] = os.environ.get("ChatGPTAPI")
IS_LOCAL = os.getenv('IS_LOCAL')



from flask import Flask, render_template, request, jsonify, Response

app = Flask(__name__, static_url_path='', static_folder='static')



@app.route('/')
def index():
    return render_template('index.html')

## ALL TPT CODE FOLLOWS

# This is the page where we choose what we want to create for TpT
@app.route('/tpt/createtpt')
def createtpt():
    return render_template('tpt/createtpt.html')


#This is the main page where we are creating races worksheets
# We wouldn't even need to load special days here if we never reload this page, right?
@app.route("/tpt/createraces", methods=['POST', 'GET'])
def createraces():
    #days = get_special_days()
    #print(days)
    #return render_template('tpt/createraces.html', days=days)
    return render_template('tpt/createraces.html')



# This method grabs titles from ChatGPT API
@app.route("/api/titles", methods=['POST'])
def get_titles():

    data = request.get_json()
    month = data['month']
    grade = data['grade']
    days = data['days']


    # when we can't use chatGPT locally
    if IS_LOCAL:
        # Use dummy data

        data = {
            "month": "December",
            "titles": [
            "My First Title",
            "My Second Title",
            "My Third Title"
            ]
        }

        data_str = json.dumps(data['titles'])
        titles = do_json(data_str)
    else:
        prompt = f"Give a list of 60 titles that would be suitable for very short stories for students in grade {grade}.  Create one title for each of the topics in {days}.  But, if you do not have 60 titles, then just create more titles, related to the month of {month}.  The titles should be topics of interest to {grade} grade level students.  Give the titles without any lead in text and format it as jsoon.  Do not duplicate any titles.  Use proper title capitalization."
        reply = chatComplete('user', prompt)
        print("reply is " + reply)
        titles = do_json(reply)

    return titles


# This method grabs special days from ChatGPT API
@app.route("/api/specialdays", methods=['POST'])
def get_special_days():

    data = request.get_json()
    month = data['month']
    grade = data['grade']


    # when we can't use chatGPT locally
    if IS_LOCAL:
        # Use dummy data
        data = {
            "month": "December",
            "days": {
                "Christmas": "December 25",
                "Christmas Eve": "December 24"
            }
        }
        data_str = json.dumps(data['days'])
        days = do_json(data_str)
    else:
        if month not in ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']:
            month="December"
        prompt = f"Give a list of all special days for the month of {month}. Include major holidays, minor special days and everything in between. The special days should be topics of interest to {grade} grade level students.  Give the days without any lead in text and format it as jsoon or a dictionary with date:day (example December 25:Christmas Day)."
        reply = chatComplete('user', prompt)
        days = do_json(reply)

    return days




# This method does all the chat completion
def chatComplete(role, prompt):
    client = OpenAI(api_key=os.environ['OPENAI_API_KEY'])
    completion = client.chat.completions.create(
        messages=[
            {"role": role, "content": prompt}
        ],
        model="gpt-3.5-turbo",
    )
    reply = completion.choices[0].message.content
    return reply


# This method does the error catching for jsonifying
def do_json(text):
    try:
        result = json.loads(text)

    except JSONDecodeError:

        # Log error
        logger.error("Invalid JSON response")

        # Attempt to fix format
        new_text = text.replace('\"', '"')
        result = json.loads(new_text)
    return result


if __name__ == '__main__':
   app.run(debug=True)