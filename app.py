from flask import Flask, redirect
from flask import render_template as rt
from flask import request

from modules.gemini import send_message

app = Flask(__name__)


def render_template(template_name_or_list, **context):
    return rt(
        template_name_or_list=template_name_or_list,
        **context,
    )


@app.after_request
def add_header(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    response.headers["Cache-Control"] = "public, max-age=0"
    return response


@app.route("/", methods=["GET"])
def homepage():
    return render_template("index.html")


@app.route("/send-message", methods=["POST"])
def login():
    message = dict(request.json).get("message")
    response = send_message(message)

    return {"message": response.text}
