import json
import os
from pathlib import Path

import google.generativeai as genai

BASE_DIR = Path(__file__).resolve().parent.parent

genai.configure(api_key=os.environ["GEMINI_API_KEY"])

# Create the model
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
)

chat_history = []
with open(BASE_DIR / "history.json") as f:
    chat_history = json.load(f)

# chat_session = model.start_chat(history=chat_history)
chat_session = model.start_chat(history=[])


def send_message(message: str):
    return chat_session.send_message(message)


def send_voice(input_file_path):
    f = genai.upload_file(path=input_file_path, mime_type="audio/mp3")
    print(f.uri)
    print(f.to_dict())
    return model.generate_content(
        [
            "This is an audio file. Can you write it down for me?",
            {"mime_type": "audio/mp3", "file_uri": f.uri},
        ]
    )
