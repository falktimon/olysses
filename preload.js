const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  generateText: (prompt) => ipcRenderer.invoke('ollama-generate', prompt),
  openPreferences: () => ipcRenderer.send('open-preferences-window'),
  onSettingsUpdated: (callback) => ipcRenderer.on('settings-updated', callback),
  getSettings: () => ipcRenderer.invoke('get-settings'),
  setSettings: (settings) => ipcRenderer.invoke('set-settings', settings),
  saveFile: (data) => ipcRenderer.invoke('save-file', data),
});
