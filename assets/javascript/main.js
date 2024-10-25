import axios from "axios";
import { Converter } from "showdown";

const messageForm = document.querySelector("#message-form");
const chatSection = document.querySelector("#chat-section");
const chatContainer = document.querySelector("#chat-container");
const messageInput = document.querySelector("#message-input");
const messageSend = document.querySelector("#message-send");

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
      .post("/send-message", { message: message }, { timeout: 5000 })
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
