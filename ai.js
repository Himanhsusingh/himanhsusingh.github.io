// ================================
// HIMANSHU AI LAB
// ================================

// PUT YOUR GOOGLE APPS SCRIPT URL HERE
const AI_BACKEND_URL = "https://script.google.com/macros/s/AKfycbzMGnfsllrFvgwILWylB63tBbY4Cr2516Itt58ct-u0kJhUb1XgRC_5puOSNx2wajfB/exec";


// Get elements from ai-lab.html
const form = document.getElementById("form");
const promptBox = document.getElementById("prompt");
const chatBox = document.getElementById("box");


// --------------------------------
// Add message to chat
// --------------------------------
function addMessage(type, message) {

    const msg = document.createElement("div");

    msg.className = "msg";

    if (type === "user") {
        msg.classList.add("user");
    }

    const name = document.createElement("b");

    name.textContent = type === "user" ? "YOU" : "AI";

    const text = document.createElement("p");

    text.textContent = message;

    msg.appendChild(name);
    msg.appendChild(text);

    chatBox.appendChild(msg);

    chatBox.scrollTop = chatBox.scrollHeight;

    return msg;
}


// --------------------------------
// Ask AI
// --------------------------------
async function askAI(question) {

    question = question.trim();

    if (!question) {
        return;
    }


    // Show user's question
    addMessage("user", question);


    // Show loading message
    const loading = addMessage("ai", "Thinking...");


    // Disable input
    promptBox.disabled = true;


    const submitButton = form.querySelector("button");

    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Thinking...";
    }


    try {

        const response = await fetch(AI_BACKEND_URL, {

            method: "POST",

            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },

            body: JSON.stringify({
                prompt: question
            })

        });


        // Check server response
        if (!response.ok) {

            throw new Error(
                "Server error: " + response.status
            );

        }


        const data = await response.json();


        // Check AI response
        if (!data.success) {

            throw new Error(
                data.error || "AI request failed"
            );

        }


        // Replace "Thinking..." with AI answer
        loading.querySelector("p").textContent =
            data.answer;


    } catch (error) {

        console.error(error);

        loading.querySelector("p").textContent =
            "Sorry, I could not connect to the AI. Please try again.";

    }


    // Enable input again
    promptBox.disabled = false;


    if (submitButton) {

        submitButton.disabled = false;

        submitButton.textContent = "Ask Gemini ✦";

    }


    promptBox.focus();

}


// --------------------------------
// Form submit
// --------------------------------
form.addEventListener("submit", function(event) {

    event.preventDefault();

    const question = promptBox.value;

    promptBox.value = "";

    askAI(question);

});


// --------------------------------
// Quick buttons
// --------------------------------
const quickButtons =
    document.querySelectorAll(".quick button");


quickButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const question =
            button.getAttribute("data-q");

        promptBox.value = question;

        askAI(question);

    });

});


// --------------------------------
// Enter key
// --------------------------------
promptBox.addEventListener("keydown", function(event) {

    // Enter = send
    // Shift + Enter = new line

    if (
        event.key === "Enter" &&
        !event.shiftKey
    ) {

        event.preventDefault();

        form.requestSubmit();

    }

});
