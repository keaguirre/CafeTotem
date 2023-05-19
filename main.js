const { app, BrowserWindow } = require('electron')
const os = require('os');
const si = require('systeminformation');
const axios = require('axios');
const { exec } = require('child_process');
const { app } = require('electron');
const getmac = require('getmac');
//Vars-------------
let objConsulta; //contiene el objeto resultante de la consulta, mac, num_totem, id_local
let macPC;
var numTotem;
const url = 'http://localhost:8000/api/totem/';

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

    const plataforma = await obtenerPlataforma();
    if(plataforma.includes('win32')){
        const macWindows = await obtenerDireccionMAC('win32');
        const respuesta = await axios.get(url + macLinux).then(response =>{
            objConsulta = response.data;
            numTotem = response.data.num_totem; //almacenar en una tabla de sqlite el numtotem con la mac, si la que entrega de respuesta, coincide con la local, go
        })
        .catch(function(error) {
            console.log('error, se procederá a registro del totem.');
            console.log('mac: ',macWindows);
            registrarTotem(macPC);

        });
    }else if(plataforma.includes('linux')){

        const macLinux = await obtenerDireccionMAC('linux');
        const respuesta = await axios.get(url + macLinux).then(response =>{
            objConsulta = response.data;
            numTotem = response.data.num_totem; //almacenar en una tabla de sqlite el numtotem con la mac, si la que entrega de respuesta, coincide con la local, go
        })
        .catch(function(error) {
            console.log('error, se procederá a registro del totem.');
            //Una vez registrado, esperará la respuesta y si le devuelve el objeto nuevo creado, se asignará automáticamente su número de totem.
            //Si no devuelve el obj nuevo creado, entonces, con su mac, volverá a hacer la consulta para asignarse automáticamente un número de totem.
            console.log('mac: ',macLinux);
            registrarTotem(macPC);

            /** @experimental
             * Una de las posibilidades es que por x motivo, no tengamos acceso a la api pero si a la web que contiene angular, so es posible
                levantar una instancia de sqlite3 y autoregistrarse localmente?
                https://fmacedoo.medium.com/standalone-application-with-electron-react-and-sqlite-stack-9536a8b5a7b9
             */
        });
        console.log('objResp: ', objConsulta)
        // console.log('macPC: ', macPC)
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

function obtenerDireccionMAC(cod) { //usar un codigo de entrada con un parametro para un switch y dividir el metodo segun plataforma y asi reutilizo el mismo metodo?
    return new Promise((resolve, reject) => {
        switch(cod){
            case 'linux': {
                exec('ifconfig | grep -oE "([0-9a-fA-F]{2}:){5}[0-9a-fA-F]{2}"', (error, stdout) => {
                    if (error) {reject(error);
                    }else {
                        macPC = stdout.match(/([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}/)[0];
                        console.log('macPC: ',macPC)
                        resolve(macPC);
                    }
                });
            }
            case('win32'): {
                getmac.getMac((err, macPC) => {
                    if (err) {reject(err);
                    }resolve(macPC);
                });
            }
        }
    });
}

/**
 * Registra un totem en el servidor.
 * @param {string} mac - Dirección MAC del totem.
 * @returns {Promise} - Promesa que se resuelve con la respuesta del servidor o se rechaza con el error.
 */
function registrarTotem(mac){
    axios.post(url, { "mac_totem": mac, "local_asignado": 1, "estado": true})
    .then(function (response) {

        console.log('resp: ', response.data);
    })
    .catch(function (error) {
        console.log('err: ',error);
    });
}