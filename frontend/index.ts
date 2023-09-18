import axios, { AxiosError } from "axios"
import { z } from "zod"

const messageSchema = z.object({
    user: z.string(),
    message: z.string(),
    createdAt: z.string(),
})

type Message = z.infer<typeof messageSchema>;

let messages: Message[] = [];

const messageList = document.querySelector("messageslist") as HTMLDivElement
const messageInput = document.getElementById("messageinput") as HTMLInputElement
const sendMessageButton = document.getElementById("sendbutton") as HTMLButtonElement




function displayMessages() {
    messageList.innerHTML = '';
    for (const message of messages) {
        const messageDiv = document.createElement('div')
        messageDiv.classList.add('message')
        messageDiv.innerHTML = `<strong>${message.user}</strong> (${message.createdAt}):
        <p>${message.message}</p>`
        messageList.appendChild(messageDiv)
    }
}


sendMessageButton.addEventListener('click', () => {
    const messageText = messageInput.value.trim();

    if (messageText) {
        axios
            .post('/api/messages', { message: messageText })
            .then((response) => {
                const newMessage: Message = {
                    user: "",
                    message: messageText,
                    createdAt: new Date().toISOString(),
                };
                messages.push(newMessage)
                displayMessages()
                messageInput.value = ''
            })
            .catch((error) => {
                console.error(error)
                if (axios.isAxiosError(error)) {
                    const axiosError = error as AxiosError
                    alert("Hiba történt az üzenet küldése során")
                }
            })
    }
})

setInterval(() => {
    axios.get('/api/messages')
        .then((response) => {
            const newMessages: Message[] = response.data
            if (newMessages.length > 0) {
                messages = messages.concat(newMessages)
                displayMessages()
            }
        })
        .catch((error) => {
            console.error(error)
        })
}, 200000)