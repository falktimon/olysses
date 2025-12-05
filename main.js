const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const Store = require('electron-store');

const store = new Store();

let mainWindow;
const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile('index.html');
};

let preferencesWindow;

const createPreferencesWindow = () => {
  if (preferencesWindow) {
    preferencesWindow.focus();
    return;
  }
  preferencesWindow = new BrowserWindow({
    width: 500,
    height: 400,
    title: 'Preferences',
    parent: mainWindow,
    modal: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Re-using the same preload
    },
  });

  preferencesWindow.loadFile('preferences.html');

  preferencesWindow.on('closed', () => {
    preferencesWindow = null;
  });
};

ipcMain.on('open-preferences-window', createPreferencesWindow);

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('get-settings', () => {
  return {
    ollamaHost: store.get('ollamaHost', 'http://127.0.0.1:11434'),
    model: store.get('model', 'gemma3:latest'),
  };
});

ipcMain.handle('set-settings', (event, settings) => {
  store.set('ollamaHost', settings.ollamaHost);
  store.set('model', settings.model);
  if (mainWindow) {
    mainWindow.webContents.send('settings-updated');
  }
});


ipcMain.handle('save-file', async (event, { content, defaultPath }) => {
  const saveOptions = {
    title: 'Save File',
    filters: [
      { name: 'Text Documents', extensions: ['txt'] },
      { name: 'Markdown', extensions: ['md'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  };

  if (defaultPath) {
    saveOptions.defaultPath = defaultPath;
  }

  const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, saveOptions);

  if (canceled || !filePath) {
    return { success: false, canceled: true };
  }

  try {
    fs.writeFileSync(filePath, content, 'utf8');
    return { success: true, path: filePath };
  } catch (error) {
    console.error('Error saving file:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('ollama-generate', async (event, prompt) => {
  try {
    const { Ollama } = await import('ollama');

    const ollamaHost = store.get('ollamaHost', 'http://127.0.0.1:11434');
    const model = store.get('model', 'gemma3:latest');

    const ollama = new Ollama({ host: ollamaHost });
    
    const response = await ollama.generate({
      model: model,
      prompt: prompt,
      system: "You are a writing assistant. Your role is to complete or continue the user's text. Do not add any conversational fluff, commentary, or markdown formatting. Only output the requested text."
    });
    return response.response;
  } catch (error) {
    console.error(error);
    return `Error generating text: ${error.message}`;
  }
});
