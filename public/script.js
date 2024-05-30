document.addEventListener("DOMContentLoaded", function() {
    const messageInput = document.getElementById("messageInput");
    const sendButton = document.getElementById("sendButton");
    const chatContainer = document.getElementById("chatContainer");

    sendButton.addEventListener("click", sendMessage);

    messageInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });

    async function sendMessage() {
        const userMessage = messageInput.value.trim();
        if (userMessage === "") return;

        appendMessage("user", userMessage);
        messageInput.value = "";

        // Show typing indicator
        appendTypingIndicator();

        try {
            const response = await fetch("/sendMessage", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message: userMessage })
            });

            const data = await response.json();
            if (response.ok) {
                removeTypingIndicator();
                appendMessage("bot", data.response);
            } else {
                console.error("Error from server:", data.error);
                removeTypingIndicator();
                appendMessage("bot", "Error: " + data.error);
            }
        } catch (error) {
            console.error("Network error:", error);
            removeTypingIndicator();
            appendMessage("bot", "Network error: " + error.message);
        }
    }

    function appendMessage(sender, text) {
        const messageElement = document.createElement("div");
        messageElement.className = `message ${sender}`;
        messageElement.textContent = text;
        chatContainer.appendChild(messageElement);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    function appendTypingIndicator() {
        const typingIndicator = document.createElement("div");
        typingIndicator.className = "message bot typing";
        typingIndicator.textContent = "Typing...";
        chatContainer.appendChild(typingIndicator);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    function removeTypingIndicator() {
        const typingIndicator = document.querySelector(".message.bot.typing");
        if (typingIndicator) {
            chatContainer.removeChild(typingIndicator);
        }
    }
});