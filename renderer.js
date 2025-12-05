const editor = document.getElementById('editor');
const generateBtn = document.getElementById('generate-btn');
const sidebar = document.getElementById('sidebar');
const toggleSidebarBtn = document.getElementById('toggle-sidebar-btn');

generateBtn.addEventListener('click', async () => {
  const editorContent = editor.value;
  if (!editorContent.trim()) {
    return;
  }

  generateBtn.disabled = true;
  generateBtn.innerText = 'Generating...';

  const lines = editorContent.split('\n');
  let commandIndex = -1;

  // Find the last line with a ## command
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].trim().startsWith('##')) {
      commandIndex = i;
      break;
    }
  }

  let prompt = editorContent;
  const isCommand = commandIndex !== -1;

  if (isCommand) {
    const commandLine = lines[commandIndex].trim();
    const command = commandLine.substring(2).trim();
    const context = lines.slice(0, commandIndex).join('\n');
    prompt = (context ? context + '\n' : '') + command;
  }

  try {
    const result = await window.electronAPI.generateText(prompt);

    if (isCommand) {
      lines.splice(commandIndex, 1, result); // Replace command line with result
      editor.value = lines.join('\n');
    } else {
      editor.value += result; // Append the result to the editor
    }
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
