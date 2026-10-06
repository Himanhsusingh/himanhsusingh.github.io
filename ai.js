// ========================================
// HIMANSHU AI LAB
// ========================================


const AI_BACKEND_URL =
    "https://script.google.com/macros/s/AKfycbzMGnfsllrFvgwILWylB63tBbY4Cr2516Itt58ct-u0kJhUb1XgRC_5puOSNx2wajfB/exec";


// ========================================
// Get HTML elements
// ========================================

const form =
    document.getElementById("form");

const promptBox =
    document.getElementById("prompt");

const chatBox =
    document.getElementById("box");


// ========================================
// Add message
// ========================================

function addMessage(
    type,
    message
) {

    const msg =
        document.createElement("div");


    msg.className =
        "msg";


    if (type === "user") {

        msg.classList.add("user");

    }


    const name =
        document.createElement("b");


    name.textContent =
        type === "user"
            ? "YOU"
            : "AI";


    const text =
        document.createElement("p");


    text.textContent =
        message;


    msg.appendChild(name);

    msg.appendChild(text);


    chatBox.appendChild(msg);


    chatBox.scrollTop =
        chatBox.scrollHeight;


    return msg;

}


// ========================================
// Ask AI using JSONP
// ========================================

function askAI(question) {

    question =
        question.trim();


    if (!question) {

        return;

    }


    // Show user's question
    addMessage(
        "user",
        question
    );


    // Show loading
    const loading =
        addMessage(
            "ai",
            "Thinking..."
        );


    // Disable input
    promptBox.disabled =
        true;


    const button =
        form.querySelector(
            "button"
        );


    if (button) {

        button.disabled =
            true;

        button.textContent =
            "Thinking...";

    }


    // Create unique callback name
    const callbackName =
        "geminiCallback_" +
        Date.now();


    // Create script element
    const script =
        document.createElement(
            "script"
        );


    // Create callback
    window[callbackName] =
        function(data) {


            console.log(
                "AI response:",
                data
            );


            if (
                data &&
                data.success
            ) {

                loading
                    .querySelector("p")
                    .textContent =
                    data.answer;

            } else {

                loading
                    .querySelector("p")
                    .textContent =
                    data.error ||
                    "AI could not answer.";

            }


            // Clean up
            delete window[
                callbackName
            ];


            if (
                script.parentNode
            ) {

                script.parentNode
                    .removeChild(
                        script
                    );

            }


            promptBox.disabled =
                false;


            if (button) {

                button.disabled =
                    false;

                button.textContent =
                    "Ask Gemini ✦";

            }


            promptBox.focus();

        };


    // Build request URL
    const url =
        AI_BACKEND_URL +
        "?callback=" +
        encodeURIComponent(
            callbackName
        ) +
        "&prompt=" +
        encodeURIComponent(
            question
        );


    script.src =
        url;


    // Error handling
    script.onerror =
        function() {

            loading
                .querySelector("p")
                .textContent =
                "Sorry, I could not connect to the AI. Please try again.";


            delete window[
                callbackName
            ];


            if (
                script.parentNode
            ) {

                script.parentNode
                    .removeChild(
                        script
                    );

            }


            promptBox.disabled =
                false;


            if (button) {

                button.disabled =
                    false;

                button.textContent =
                    "Ask Gemini ✦";

            }

        };


    // Send request
    document.body.appendChild(
        script
    );

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


        promptBox.value =
            "";


        askAI(question);

    }
);


// ========================================
// Quick buttons
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
