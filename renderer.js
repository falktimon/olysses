const promptInput = document.getElementById('prompt-input');
const generateBtn = document.getElementById('generate-btn');
const resultOutput = document.getElementById('result-output');

generateBtn.addEventListener('click', async () => {
  const prompt = promptInput.value;
  if (!prompt) {
    resultOutput.innerText = 'Please enter a prompt.';
    return;
  }

  generateBtn.disabled = true;
  resultOutput.innerText = 'Generating...';

  try {
    const result = await window.electronAPI.generateText(prompt);
    resultOutput.innerText = result;
  } catch (error) {
    console.error('Error:', error);
    resultOutput.innerText = 'An error occurred while generating text.';
  } finally {
    generateBtn.disabled = false;
  }
});
