from dotenv import load_dotenv
load_dotenv()


import os

from openai import OpenAI
os.environ["OPENAI_API_KEY"] = os.environ.get("ChatGPTAPI")


from flask import Flask, render_template, request, jsonify

app = Flask(__name__, static_url_path='', static_folder='static')




def get_special_days(month, grade):
    prompt = f"Give a list of all special days for the month of {month}. Include major holidays, minor special days and everything in between. The special days should be topics of interest to {grade} grade level students.  Give the days without any lead in text and format it as jsoon or a dictionary with day:date."

    client = OpenAI(api_key=os.environ['OPENAI_API_KEY'])
    completion = client.chat.completions.create(
        messages=[
            {"role": "user", "content": prompt}
        ],
        model="gpt-3.5-turbo",
    )
    #reply = completion['choices'][0]['message']['content']
    reply = completion.choices[0].message.content
    print("Original reply is:  " + str(reply))

    return reply

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/tpt/createtpt')
def createtpt():
    return render_template('tpt/createtpt.html')


@app.route("/tpt/createraces", methods=['POST', 'GET'])
def createraces():
    if request.method == 'POST':
        month = request.form.get('month')
        grade = request.form.get('gradeLevel')

        days = get_special_days(month, grade)

        return render_template('tpt/createraces.html', month=month, grade=grade, days=days)

    else:
        return render_template('tpt/createraces.html')


if __name__ == '__main__':
   app.run(debug=True)