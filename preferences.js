const ollamaHostInput = document.getElementById('ollama-host');
const modelNameInput = document.getElementById('model-name');
const filesDirectoryInput = document.getElementById('files-directory');
const selectDirBtn = document.getElementById('select-dir-btn');
const saveBtn = document.getElementById('save-btn');

async function loadSettings() {
    const settings = await window.electronAPI.getSettings();
    ollamaHostInput.value = settings.ollamaHost || '';
    modelNameInput.value = settings.model || '';
    filesDirectoryInput.value = settings.filesDirectory || '';
}

selectDirBtn.addEventListener('click', async () => {
    const directory = await window.electronAPI.selectDirectory();
    if (directory) {
        filesDirectoryInput.value = directory;
    }
});

saveBtn.addEventListener('click', async () => {
    const settings = {
        ollamaHost: ollamaHostInput.value,
        model: modelNameInput.value,
        filesDirectory: filesDirectoryInput.value,
    };
    await window.electronAPI.setSettings(settings);
    window.close();
});

loadSettings();
