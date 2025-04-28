document.getElementById('openAIKeyForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const userInput = document.getElementById('openAIKey').value;
    console.log('User entered:', userInput, " as openAIKey");
  });