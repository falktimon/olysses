const editor = document.getElementById('editor');
const generateBtn = document.getElementById('generate-btn');
const sidebar = document.getElementById('sidebar');
const toggleSidebarBtn = document.getElementById('toggle-sidebar-btn');
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const preferencesBtn = document.getElementById('preferences-btn');
const fileList = document.getElementById('file-list');

generateBtn.addEventListener('click', async () => {
  const editorContent = editor.value;
  if (!editorContent.trim()) {
    return;
  }

  const lines = editorContent.split('\n');
  const commandLinesContent = [];
  let lastCommandIndex = -1;

  lines.forEach((line, index) => {
    if (line.trim().startsWith('##')) {
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

async function loadFiles() {
  fileList.innerHTML = ''; // Clear existing files
  const settings = await window.electronAPI.getSettings();
  if (settings.filesDirectory) {
    const files = await window.electronAPI.listFiles(settings.filesDirectory);
    files.forEach(file => {
      const li = document.createElement('li');
      li.textContent = file;
      fileList.appendChild(li);
    });
  }
}

toggleSidebarBtn.addEventListener('click', () => {
  sidebar.classList.toggle('collapsed');
});

themeToggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

preferencesBtn.addEventListener('click', () => {
  window.electronAPI.openPreferences();
});

// Load files on startup and when settings change
loadFiles();

window.electronAPI.onSettingsUpdated(() => {
  loadFiles();
});
