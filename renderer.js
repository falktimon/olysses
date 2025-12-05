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
  let commandIndex = -1;
  let commandType = null;

  // Find the last command line
  for (let i = lines.length - 1; i >= 0; i--) {
    const trimmedLine = lines[i].trim();
    if (trimmedLine.startsWith(';;;')) {
      commandIndex = i;
      commandType = ';;;';
      break;
    } else if (trimmedLine.startsWith(';;')) {
      commandIndex = i;
      commandType = ';;';
      break;
    }
  }

  if (commandIndex === -1) {
    return; // No command found, do nothing.
  }

  generateBtn.disabled = true;
  generateBtn.innerText = 'Generating...';

  let prompt;
  const commandLine = lines[commandIndex].trim();

  if (commandType === ';;;') {
    const command = commandLine.substring(3).trim();
    const context = lines.slice(0, commandIndex).join('\n');
    prompt = (context ? context + '\n\n' : '') + command;
  } else { // commandType is ';;'
    prompt = commandLine.substring(2).trim();
  }

  try {
    const result = await window.electronAPI.generateText(prompt);

    // Replace the command line with the result
    lines[commandIndex] = result;
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
