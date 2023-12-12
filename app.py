from dotenv import load_dotenv
load_dotenv()
import json

import os

from openai import OpenAI
os.environ["OPENAI_API_KEY"] = os.environ.get("ChatGPTAPI")
IS_LOCAL = os.getenv('IS_LOCAL')



from flask import Flask, render_template, request, jsonify, Response

app = Flask(__name__, static_url_path='', static_folder='static')




@app.route('/')
def index():
    return render_template('index.html')

@app.route('/tpt/createtpt')
def createtpt():
    return render_template('tpt/createtpt.html')


from flask import make_response, jsonify


@app.route("/tpt/createraces", methods=['POST', 'GET'])
def createraces():
    response = get_special_days()
    days = response.get_json()
    print(days)
    return render_template('tpt/createraces.html', days=days)


@app.route("/api/specialdays", methods=['POST'])
def get_special_days():
    print("We went to special days")
    month = request.form.get('month')
    grade = request.form.get('gradeLevel')

    if IS_LOCAL:
        print("It's Local!!!")
        # Use dummy data
        data = {
            "month": "December",
            "days": {
                "Christmas": "December 25",
                "Christmas Eve": "December 24"
            }
        }
        days = data['days']
    else:
        print("It's NOT LOCAL!!!")
        if month not in ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']:
            month="December"
        prompt = f"Give a list of all special days for the month of {month}. Include major holidays, minor special days and everything in between. The special days should be topics of interest to {grade} grade level students.  Give the days without any lead in text and format it as jsoon or a dictionary with date:day."

        client = OpenAI(api_key=os.environ['OPENAI_API_KEY'])
        completion = client.chat.completions.create(
            messages=[
                {"role": "user", "content": prompt}
            ],
            model="gpt-3.5-turbo",
        )
        reply = completion.choices[0].message.content
        try:
            days = json.loads(reply)

        except JSONDecodeError:

            # Log error
            logger.error("Invalid JSON response")

            # Attempt to fix format
            new_text = text.replace('\"', '"')
            days = json.loads(new_text)

        print("Original reply is:  " + str(reply))
        print("Jsonified reply is:  " + str(days))



    return days






if __name__ == '__main__':
   app.run(debug=True)