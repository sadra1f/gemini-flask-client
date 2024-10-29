import axios from "axios";
import { Converter } from "showdown";

const audioRecorder = new audio_recorder.AudioRecorder();

const messageForm = document.querySelector("#message-form");
const chatSection = document.querySelector("#chat-section");
const chatContainer = document.querySelector("#chat-container");
const audioMessageRecord = document.querySelector("#audio-message-record");
const messageInput = document.querySelector("#message-input");
const messageSend = document.querySelector("#message-send");

let isRecording = false;

function chatBubbleUser(message) {
  return `
    <div class="chat chat-end">
      <div class="chat-bubble chat-bubble-primary">${message}</div>
    </div>
  `;
}

function chatBubbleBot(message) {
  return `
    <div class="chat chat-start">
      <div class="chat-bubble">${message}</div>
    </div>
  `;
}

function scrollChatToBottom() {
  chatSection.scrollTop = chatSection.scrollHeight;
}

audioMessageRecord.addEventListener("click", (event) => {
  if (isRecording) {
    messageInput.setAttribute("disabled", true);
    messageSend.setAttribute("disabled", true);

    audioMessageRecord.classList.remove("!btn-error", "!bg-error");
    audioRecorder.save().then((value) => {
      const fileName = "voice.webm";
      const formData = new FormData();
      const file = new File([value], fileName);

      formData.append("file", file, fileName);

      axios
        .post("/send-voice", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            timeout: 60000,
          },
        })
        .then((response) => {
          const converter = new Converter();

          chatContainer.insertAdjacentHTML(
            "beforeend",
            chatBubbleBot(converter.makeHtml(response.data.message))
          );
          scrollChatToBottom();
        })
        .catch((reason) => {
          let message = reason.response?.data?.detail;
          if (!message) message = reason.message;
          if (!message) message = JSON.stringify(reason);
          alert(message);
        })
        .finally(() => {
          messageInput.removeAttribute("disabled");
          messageSend.removeAttribute("disabled");
        });

      chatContainer.insertAdjacentHTML(
        "beforeend",
        chatBubbleUser("[Audio File]")
      );
      scrollChatToBottom();
    });
  } else {
    audioMessageRecord.classList.add("!btn-error", "!bg-error");
    audioRecorder.init().then(() => {
      audioRecorder.start();
    });
  }

  isRecording = !isRecording;
});

messageForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(messageForm);
  let message = formData.get("message");

  if (message && message.trim()) {
    message = message.trim();

    chatContainer.insertAdjacentHTML("beforeend", chatBubbleUser(message));
    scrollChatToBottom();

    messageInput.value = "";
    messageInput.setAttribute("disabled", "true");
    messageSend.setAttribute("disabled", "true");

    axios
      .post("/send-message", { message: message }, { timeout: 60000 })
      .then((response) => {
        const converter = new Converter();

        chatContainer.insertAdjacentHTML(
          "beforeend",
          chatBubbleBot(converter.makeHtml(response.data.message))
        );
        scrollChatToBottom();
      })
      .catch((reason) => {
        let message = reason.response?.data?.detail;
        if (!message) message = reason.message;
        if (!message) message = JSON.stringify(reason);
        alert(message);
      })
      .finally(() => {
        messageInput.removeAttribute("disabled");
        messageSend.removeAttribute("disabled");
      });
  }
});

if (!navigator.mediaDevices.getUserMedia) {
  audioMessageRecord.parentElement.classList.add("hidden");
}
