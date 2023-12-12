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



def get_titles():
    month = request.form.get('month')
    grade = request.form.get('gradeLevel')
    special_days = request.form.get('SpecialDaysInput')  # Assuming special days are passed as a list
    print("month is " + month + " grade is "  + grade )
    jdays = json.loads(special_days)

    if IS_LOCAL:
        # Use dummy data
        data = {
                "Story 1",
                "Story 2"

        }
        titles = data
    else:
        if month not in ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']:
            month="December"
        topics =  ', '.join(special_days)
        prompt = f"Give a list of 30 titles for the month of {month} suitable for very short stories for grade {grade}. Write one title for each of these topics:  {topics}.  Give the titles without any lead in text and format it as json."

        client = OpenAI(api_key=os.environ['OPENAI_API_KEY'])
        completion = client.chat.completions.create(
            messages=[
                {"role": "user", "content": prompt}
            ],
            model="gpt-3.5-turbo",
        )
        reply = completion.choices[0].message.content
        print(reply)
        try:
            titles = json.loads(reply)

        except JSONDecodeError:

            # Log error
            logger.error("Invalid JSON response")

            # Attempt to fix format
            new_text = text.replace('\"', '"')
            titles = json.loads(new_text)

        print("Original reply is:  " + str(reply))
        print("Jsonified reply is:  " + str(titles))



    return titles, jdays


# This method grabs special days from ChatGPT API
@app.route("/api/specialdays", methods=['POST'])
def get_special_days():

    data = request.get_json()
    month = data['month']
    grade = data['grade']
    print("month is " + month + " and grade is " + grade)


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
    print("text is " + str(text))
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