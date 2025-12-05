# AI Writing App

An AI-powered writing assistant built with Electron that connects to an Ollama server.

## Features

- Real-time AI text generation.
- Customizable Ollama server and model settings.
- Light and Dark themes.
- Simple, distraction-free writing environment.

## Prerequisites

Before you begin, ensure you have the following installed on your system (Linux, macOS, or Windows):

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Ollama](https://ollama.com/)

## Ollama Setup

This application requires a running Ollama server to function.

1.  **Install Ollama:** Follow the installation instructions for your operating system on the [Ollama website](https://ollama.com/).

2.  **Download a Model:** You need to have a model available for the application to use. You can configure which model to use in the app's preferences. To download a model (e.g., `gemma3:latest`), run:
    ```bash
    ollama pull gemma3:latest
    ```

3.  **Ensure Ollama is running:** The Ollama server must be running in the background before you start the AI Writing App. By default, the app will try to connect to `http://127.0.0.1:11434`.

## Installation & Running

The installation and startup process is the same for Linux, macOS, and Windows.

### 1. Install Dependencies

Navigate to the project's root directory in your terminal and install the required npm packages:

```bash
npm install
```

### 2. Run the Application

Once the dependencies are installed, you can start the application with:

```bash
npm start
```

The application window will open, and you can start writing!
