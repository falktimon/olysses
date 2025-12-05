const ollamaHostInput = document.getElementById('ollama-host');
const modelNameInput = document.getElementById('model-name');
const saveBtn = document.getElementById('save-btn');

async function loadSettings() {
    const settings = await window.electronAPI.getSettings();
    ollamaHostInput.value = settings.ollamaHost || '';
    modelNameInput.value = settings.model || '';
}

saveBtn.addEventListener('click', async () => {
    const settings = {
        ollamaHost: ollamaHostInput.value,
        model: modelNameInput.value,
    };
    await window.electronAPI.setSettings(settings);
    window.close();
});

loadSettings();
