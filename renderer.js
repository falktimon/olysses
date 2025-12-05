const editor = document.getElementById('editor');
const generateBtn = document.getElementById('generate-btn');
const sidebar = document.getElementById('sidebar');
const toggleSidebarBtn = document.getElementById('toggle-sidebar-btn');

generateBtn.addEventListener('click', async () => {
  const prompt = editor.value;
  if (!prompt) {
    return;
  }

  generateBtn.disabled = true;
  generateBtn.innerText = 'Generating...';

  try {
    const result = await window.electronAPI.generateText(prompt);
    editor.value += result; // Append the result to the editor
  } catch (error) {
    console.error('Error:', error);
  } finally {
    generateBtn.disabled = false;
    generateBtn.innerText = 'Continue Writing';
  }
});

toggleSidebarBtn.addEventListener('click', () => {
  sidebar.classList.toggle('collapsed');
});
