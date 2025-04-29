document.getElementById('openAIKeyForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const userInput = document.getElementById('openAIKey').value;
    console.log('User entered:', userInput, " as openAIKey");

    chrome.runtime.sendMessage({
        action: "saveAPIKey",
        data: userInput
      }, function(response) {
        console.log('Background script responded:', response);

        // show message that it has been submitted
        const successMessage1 = document.createElement('p');
        successMessage1.textContent = "API Key submitted successfully!";
        successMessage1.style.color = "green";
        successMessage1.style.marginBottom = "10px";

        const successMessage2 = document.createElement('p');
        successMessage2.textContent = "You can now close this page and start using Yelper.";
        successMessage2.style.color = "green";

        document.body.appendChild(successMessage1);
        document.body.appendChild(successMessage2);

      });

  });