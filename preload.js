const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  generateText: (prompt) => ipcRenderer.invoke('ollama-generate', prompt),
});
