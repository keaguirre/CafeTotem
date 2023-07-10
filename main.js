const { app, BrowserWindow, webContents } = require('electron')
//Vars-------------


//npm Start-------------------------------------

function createWindow () {
    // Crea una ventana del navegador.
    const win = new BrowserWindow({
        title: 'cafeScriptTotem',
        width: 800,
        height: 600,
        // frame: false,
        // fullscreen: true,
        minimizable: false,
        // closable: false,
        // alwaysOnTop: true,
        icon: 'Documentos/cafescriptico.png',
        // autoHideMenuBar: true,
        // skipTaskbar: true,
        // kiosk: true
    })
    // Carga la página web.
    // win.webContents.print({silent:true})
    //  win.loadURL('https://stackblitz.com/edit/angular-print-invoice-e23ppt?file=src%2Fapp%2Fapp.component.ts')
    win.loadURL('http://192.168.1.83:4200/catalogo')
    // win.loadURL('http://localhost:4200')
    // win.loadURL('http://localhost:4200/api-watcher')
    win.webContents.on('did-finish-load', () => {
      win.webContents.executeJavaScript(`
        const originalConsoleLog = console.log;
        console.log = function(message) {
          originalConsoleLog.apply(console, arguments);
          window.postMessage({
            type: 'console',
            level: 'log',
            message: message
          }, '*');
        };
      `);
    
      win.webContents.on('console-message', (event, level, message, line, sourceId) => {
        // console.log(`Mensaje de consola (${level}): ${message}`);
        if(message == 'print'){
          console.log('Soy electron y ahora bypaseare el print')

          // console.log('printers: ',win.webContents.getPrintersAsync().then(resp=> {
          //   console.log('resp: ',resp)
          // }))
          // win.webContents.print()
          // win.webContents.print({silent:true})
          const options = {deviceName: 'POS58', silent:true}
          win.webContents.print(options, (success, errorType)=>{
            if(!success) console.log(errorType)
            console.log('su: ', success)                  
            console.log(': ', errorType)
          })
          // win.webContents.print({deviceName: 'POS58', silent:true, }, (err)=> {console.log('err: ', err)})
        }
      });
    });
    
}

  app.whenReady().then(() => {
    createWindow()
  

  })
  
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })