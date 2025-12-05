const editor = document.getElementById('editor');
const generateBtn = document.getElementById('generate-btn');
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const preferencesBtn = document.getElementById('preferences-btn');
const saveFileBtn = document.getElementById('save-file-btn');
const newFileBtn = document.getElementById('new-file-btn');

let currentFilePath = null;

generateBtn.addEventListener('click', async () => {
  const editorContent = editor.value;
  if (!editorContent.trim()) {
    return;
  }

  const lines = editorContent.split('\n');
  const commandLinesContent = [];
  let lastCommandIndex = -1;

  lines.forEach((line, index) => {
    if (line.trim().startsWith(';;')) {
      commandLinesContent.push(line.trim().substring(2).trim());
      lastCommandIndex = index;
    }
  });

  if (lastCommandIndex === -1) {
    return; // No command found, do nothing.
  }

  generateBtn.disabled = true;
  generateBtn.innerText = 'Generating...';

  const prompt = commandLinesContent.join('\n');

  try {
    const result = await window.electronAPI.generateText(prompt);

    // Replace the last command line with the result
    lines[lastCommandIndex] = result;
    editor.value = lines.join('\n');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    generateBtn.disabled = false;
    generateBtn.innerText = 'Continue Writing';
  }
});


themeToggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

preferencesBtn.addEventListener('click', () => {
  window.electronAPI.openPreferences();
});

newFileBtn.addEventListener('click', () => {
  editor.value = '';
  currentFilePath = null;
});

saveFileBtn.addEventListener('click', async () => {
  const result = await window.electronAPI.saveFile({ 
    content: editor.value, 
    defaultPath: currentFilePath 
  });
  if (result.success) {
    currentFilePath = result.path;
  } else if (result.error) {
    alert(`Failed to save file: ${result.error}`);
  }
});

window.electronAPI.onSettingsUpdated(() => {
  // Settings updated, could add logic here if needed in the future
});
