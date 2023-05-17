const { app, BrowserWindow } = require('electron')
const os = require('os');
const si = require('systeminformation');
const axios = require('axios');
const { exec } = require('child_process');

//npm Start-------------------------------------
const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600
    })
    win.loadFile('index.html')
    // win.loadURL('http://localhost:4200/admin/home')
}

app.on('ready', () => { //sincrono carga lo necesario para levantar la app
});
app.whenReady().then(async() => { //asincrono
    const url = 'http://localhost:8000/api/totem/';

    const plataforma = await obtenerPlataforma();
    if(plataforma.includes('win32')){
        console.log('SO: windo')
    }else if(plataforma.includes('linux')){
        
        const direccionesMAC = await obtenerDireccionMAC();
        // const respuesta = await axios.get(url + direccionesMAC)
        const respuesta = await axios.get(url + direccionesMAC).then(response=>{
            console.log('dat: ', response.data) //Con esta data se debera asignarse a si mismo el numero de totem a la memoria o un archivo(?)
        })
        .catch(function(error) {
            console.log('error, se procederá a registro del totem.');
            //Una vez registrado, esperará la respuesta y si le devuelve el objeto nuevo creado, se asignará automáticamente su número de totem.
            //Si no devuelve el obj nuevo creado, entonces, con su mac, volverá a hacer la consulta para asignarse automáticamente un número de totem.
        });
        console.log('mac: ', direccionesMAC)
    }

    createWindow()
})
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

//------------------------------------------------
function obtenerPlataforma() {
    return new Promise((resolve) => {
        resolve(process.platform);
    });
}

function obtenerDireccionMAC() {
    return new Promise((resolve, reject) => {
        exec('ifconfig | grep -oE "([0-9a-fA-F]{2}:){5}[0-9a-fA-F]{2}"', (error, stdout) => {
            if (error) {
                reject(error);
            } else {
                const direccionesMAC = stdout.trim().split('\n');
                resolve(direccionesMAC);
            }
        });
    });
}