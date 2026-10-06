// ========================================
// HIMANSHU AI LAB
// ========================================

const AI_BACKEND_URL =
    "https://script.google.com/macros/s/AKfycbzMGnfsllrFvgwILWylB63tBbY4Cr2516Itt58ct-u0kJhUb1XgRC_5puOSNx2wajfB/exec";


// Get elements from the AI Lab page
const form = document.getElementById("form");
const promptBox = document.getElementById("prompt");
const chatBox = document.getElementById("box");


// ========================================
// Add message to chat
// ========================================

function addMessage(type, message) {

    const msg = document.createElement("div");

    msg.className = "msg";

    if (type === "user") {
        msg.classList.add("user");
    }


    const name = document.createElement("b");

    name.textContent =
        type === "user" ? "YOU" : "AI";


    const text = document.createElement("p");

    text.textContent = message;


    msg.appendChild(name);
    msg.appendChild(text);


    chatBox.appendChild(msg);


    chatBox.scrollTop =
        chatBox.scrollHeight;


    return msg;
}


// ========================================
// Ask AI
// ========================================

async function askAI(question) {

    question = question.trim();


    if (!question) {
        return;
    }


    // Show user's question
    addMessage("user", question);


    // Show loading message
    const loadingMessage =
        addMessage("ai", "Thinking...");


    // Disable input
    promptBox.disabled = true;


    const sendButton =
        form.querySelector("button");


    if (sendButton) {

        sendButton.disabled = true;

        sendButton.textContent =
            "Thinking...";

    }


    try {

        // Send question to Apps Script
        const response = await fetch(
            AI_BACKEND_URL,
            {
                method: "POST",

                body: JSON.stringify({
                    prompt: question
                })
            }
        );


        // Read server response
        const data =
            await response.json();


        console.log(
            "AI backend response:",
            data
        );


        // Check response
        if (!data.success) {

            throw new Error(
                data.error ||
                "AI request failed."
            );

        }


        // Show AI answer
        loadingMessage
            .querySelector("p")
            .textContent =
            data.answer;


    } catch (error) {

        console.error(
            "AI ERROR:",
            error
        );


        loadingMessage
            .querySelector("p")
            .textContent =
            "Sorry, I could not connect to the AI. Please try again.";

    }


    // Enable input
    promptBox.disabled = false;


    if (sendButton) {

        sendButton.disabled = false;

        sendButton.textContent =
            "Ask Gemini ✦";

    }


    promptBox.focus();

}


// ========================================
// Form submit
// ========================================

form.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const question =
            promptBox.value;


        promptBox.value = "";


        askAI(question);

    }
);


// ========================================
// Quick question buttons
// ========================================

const quickButtons =
    document.querySelectorAll(
        ".quick button"
    );


quickButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                const question =
                    button.getAttribute(
                        "data-q"
                    );


                promptBox.value =
                    question;


                askAI(question);

            }
        );

    }
);


// ========================================
// Enter key
// ========================================

promptBox.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            form.requestSubmit();

        }

    }
);
