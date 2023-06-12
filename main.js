const { app, BrowserWindow } = require('electron')
//Vars-------------


//npm Start-------------------------------------

function createWindow () {
    // Crea una ventana del navegador.
    const win = new BrowserWindow({
        title: 'cafeScriptTotem',
        width: 800,
        height: 600,
        frame: false,
        fullscreen: true,
        minimizable: false,
        closable: false,
        alwaysOnTop: true,
        icon: 'Documentos/cafescriptico.png',
        frame: false,
        autoHideMenuBar: true,
        // skipTaskbar: true,
        kiosk: true
    })

    // Carga la página web.
    win.loadURL('https://www.google.cl')
    // win.loadURL('http://localhost:4200')
    // win.loadURL('http://localhost:4200/api-watcher')
}

  app.whenReady().then(() => {
    createWindow()
  
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
        globalShortcut.register('alt+tab', () => {
            return false
         })
      }
    })
  })
  
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })