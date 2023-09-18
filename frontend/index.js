"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const zod_1 = require("zod");
const messageSchema = zod_1.z.object({
    user: zod_1.z.string(),
    message: zod_1.z.string(),
    createdAt: zod_1.z.string(),
});
let messages = [];
const messageList = document.querySelector(".messageslist");
const messageInput = document.getElementById(".messageinput");
const sendMessageButton = document.getElementById("sendbutton");
function displayMessages() {
    messageList.innerHTML = '';
    for (const message of messages) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.innerHTML = `<strong>${message.user}</strong> (${message.createdAt}):
        <p>${message.message}</p>`;
        messageList.appendChild(messageDiv);
    }
}
sendMessageButton.addEventListener('click', () => {
    const messageText = messageInput.value.trim();
    if (messageText) {
        axios_1.default
            .post('/api/messages', { message: messageText })
            .then((response) => {
            const newMessage = {
                user: "",
                message: messageText,
                createdAt: new Date().toISOString(),
            };
            messages.push(newMessage);
            displayMessages();
            messageInput.value = '';
        })
            .catch((error) => {
            console.error(error);
            if (axios_1.default.isAxiosError(error)) {
                const axiosError = error;
                alert("Hiba történt az üzenet küldése során");
            }
        });
    }
});
setInterval(() => {
    axios_1.default.get('/api/messages')
        .then((response) => {
        const newMessages = response.data;
        if (newMessages.length > 0) {
            messages = messages.concat(newMessages);
            displayMessages();
        }
    })
        .catch((error) => {
        console.error(error);
    });
}, 200000);
