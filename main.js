const { app, BrowserWindow } = require('electron')
const axios = require('axios');
const { exec } = require('child_process');
const getmac = require('getmac');
//Vars-------------
let objConsulta; //contiene el objeto resultante de la consulta, mac, num_totem, id_local
let macPC;
var numTotem;
const url = 'http://localhost:8000/api/totem/';

//npm Start-------------------------------------
app.on('ready', () => { //sincrono carga lo necesario para levantar la app
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
app.whenReady().then(async() => { //asincrono
    const plataforma = await obtenerPlataforma();
    if(plataforma.includes('win32')){ //Si la plataforma es windows
        const macWindows = await obtenerDireccionMAC('win32');
        const respuesta = await axios.get(url + macLinux).then(response =>{
            objConsulta = response.data;
            numTotem = response.data.num_totem; //almacenar en una tabla de sqlite el numtotem con la mac, si la que entrega de respuesta, coincide con la local, go
        })
        .catch(function(error) {
            console.log('error, se procederá a registro del totem.');
            console.log('mac windows: ',macWindows);
            registrarTotem(macPC);

        });

    }else if(plataforma.includes('linux')){ //Si la plataforma es linux
        try{//este try catch cachea error de conexion
            const macLinux = await obtenerDireccionMAC('linux');
            const respuesta = await axios.get(url + macLinux).then(response =>{
                objConsulta = response.data;
                console.log('Totem existente, su número de Totem asignado es: ' + response.data.num_totem + ' y su local asignado es: ' + response.data.local_asignado);
                console.log('Totem activo.')
                numTotem = response.data.num_totem; //almacenar en una tabla de sqlite el numtotem con la mac, si la que entrega de respuesta, coincide con la local, go
                createWindow('ok');
            })
            .catch(function(error) {
                try{ //cachea si la consulta a la api no tiene conexion una vez hecha la consulta axios devuelve como error http la falta de conexion.
                    if(error.response.status == 404){
                        console.log('Dirección MAC no registrada, se procederá a registro del totem.');
                        registrarTotem(macPC);
                    }
                }
                catch{
                    console.log('error de conexion al consultar el totem con el servidor.')
                    createWindow('connectionError')
                }
                //Una vez registrado, esperará la respuesta y si le devuelve el objeto nuevo creado, se asignará automáticamente su número de totem.
                //Si no devuelve el obj nuevo creado, entonces, con su mac, volverá a hacer la consulta para asignarse automáticamente un número de totem.
                /** @experimental
                 * Una de las posibilidades es que por x motivo, no tengamos acceso a la api pero si a la web que contiene angular, so es posible
                    levantar una instancia de sqlite3 y autoregistrarse localmente?
                    https://fmacedoo.medium.com/standalone-application-with-electron-react-and-sqlite-stack-9536a8b5a7b9
                 */
            });
        }
        catch{
            console.log('Error de conexion, no se puede hacer la consulta con la mac.')
        }
    }
})

const createWindow = (code) => {
    return new Promise((resolve, reject) => {
        if (code.includes('ok')) {
            const win = new BrowserWindow({
                width: 800,
                height: 600
            });
            win.loadFile('pages/index.html');
            resolve('Ventana creada correctamente');

        } else if (code.includes('connectionError')) {
            const win = new BrowserWindow({
                width: 800,
                height: 600
            });
            win.loadFile('pages/connectionError.html');
            resolve('Ventana de error creada correctamente');

        } else if (code.includes('httpError')) {
            const win = new BrowserWindow({
                width: 800,
                height: 600
            });
            win.loadFile('pages/httpError.html');
            resolve('Ventana de error creada correctamente');
        } else {
            reject('Código no válido');
        }
    });
};

function obtenerPlataforma() {
    return new Promise((resolve) => {
        resolve(process.platform);
    });
}

/**
 * Obtiene la dirección MAC del PC.
 * @param {string} cod - Código de la plataforma ('linux' o 'win32').
 * @returns {Promise<string>} - Promesa que se resuelve con la dirección MAC del PC.
 */
function obtenerDireccionMAC(cod) {
    return new Promise((resolve, reject) => {
        switch(cod){
            case 'linux': {
                exec('ifconfig | grep -oE "([0-9a-fA-F]{2}:){5}[0-9a-fA-F]{2}"', (error, stdout) => {
                    if (error) {reject(error);
                    }else {
                        macPC = stdout.match(/([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}/)[0];
                        console.log('obtenerDireccionMAC: Ok!')
                        resolve(macPC);
                    }
                });
            }
            case('win32'): {
                // getmac.getMac((err, macPC) => {
                //     if (err) {reject(err);
                //     }resolve(macPC);
                // });
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
    try{
        axios.post(url, { "mac_totem": mac, "local_asignado": 1, "estado": true})
        .then(function (response) {
            console.log('registrarTotem: Ok!', response.data);
            createWindow('ok')
        })
        .catch(function (error) { //Cachea error de post con el backend
            console.log('error de servidor al registrar el totem con el sistema: ',error);
            createWindow('httpError')
        });
    }
    catch{//Cachea error de post a nivel de conexion con el backend
        console.log('error de conexion al registrar el totem con el sistema: ',error);
        createWindow('connectionError')
    }

}