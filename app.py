from datetime import datetime
from pathlib import Path

from flask import Flask
from flask import render_template as rt
from flask import request

from modules.convert import convert_webm_to_mp3
from modules.gemini import (
    send_message as send_message_to_gemini,
    send_voice as send_voice_to_gemini,
)

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
def send_message():
    message = dict(request.json).get("message")
    response = send_message_to_gemini(message)

    return {"message": response.text}


@app.route("/send-voice", methods=["POST"])
def send_voice():
    timestamp = int(datetime.now().timestamp() * 1000)

    input_file = request.files["file"]
    input_file_path = f"temp/temp_{timestamp}.webm"
    output_file_path = f"temp/temp_{timestamp}.mp3"

    Path("temp").mkdir(parents=True, exist_ok=True)

    input_file.save(input_file_path)

    convert_webm_to_mp3(input_file_path, output_file_path)
    response = send_message_to_gemini(output_file_path)

    Path(input_file_path).unlink(missing_ok=True)
    Path(output_file_path).unlink(missing_ok=True)

    return {"message": response.text}
