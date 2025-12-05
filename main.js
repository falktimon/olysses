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
    filesDirectory: store.get('filesDirectory'),
  };
});

ipcMain.handle('set-settings', (event, settings) => {
  store.set('ollamaHost', settings.ollamaHost);
  store.set('model', settings.model);
  store.set('filesDirectory', settings.filesDirectory);
  if (mainWindow) {
    mainWindow.webContents.send('settings-updated');
  }
});

ipcMain.handle('select-directory', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
  });
  if (!canceled) {
    return filePaths[0];
  }
});

ipcMain.handle('list-files', (event, dir) => {
  if (!dir || !fs.existsSync(dir)) {
    return [];
  }
  try {
    const files = fs.readdirSync(dir);
    return files.filter(file => !fs.statSync(path.join(dir, file)).isDirectory());
  } catch (error) {
    console.error('Error listing files:', error);
    return [];
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
