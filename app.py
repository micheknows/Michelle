import os

from openai import OpenAI
os.environ["OPENAI_API_KEY"] = "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"
# Set your ChatGPT API Key

# Create the assistant
#assistant = Assistant(API_KEY)

# Send a message and get the response
#response = assistant.send_message("Hello")
#print(response)
#print("hi")
# app.py

from flask import Flask, render_template, request

app = Flask(__name__, static_url_path='', static_folder='static')




def get_special_days(month, grade):

    prompt = f"Give a list of all special days for the month of {month}.  Include major holidays, minor special days and everything in between.  The special days should be topics of interest to {grade} grade level students."
    print(prompt)

    client = OpenAI(
        api_key=os.environ['OPENAI_API_KEY'],  # this is also the default, it can be omitted
    )

    completion = client.completions.create(model="gpt-4", prompt=prompt)
    reply = completion.choices[0].text
    print(reply)
    print(dict(completion).get('usage'))
    print(completion.model_dump_json(indent=2))

    return reply

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/tpt/createtpt')
def createtpt():
    return render_template('tpt/createtpt.html')




@app.route("/tpt/createraces", methods=['POST', 'GET'])
def createraces():
    print('going here')
    if request.method == 'POST':
        print('step1')
        month = request.form.get('month', '')
        grade = request.form.get('gradeLevel', '')
        print(month)
        print(grade)
        response = get_special_days(month, grade)
        print(response)

        return jsonify({'response': response})
    else:
        return render_template('/tpt/createraces.html')


if __name__ == '__main__':
   app.run(debug=True)