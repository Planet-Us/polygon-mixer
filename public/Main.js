const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const url = require('url');
const { atRule } = require('postcss');
const {dialog, shell} = require('electron');

const Store = require('electron-store');
const store = new Store();

// var remote = window.require('electron').remote;
// var electronFs = remote.require('fs');
// var electronDialog = remote.dialog;

function createWindow() {
    /*
    * 넓이 1920에 높이 1080의 FHD 풀스크린 앱을 실행시킵니다.
    * */
   console.log(path.join(app.getAppPath(), 'preload.js'));
   console.log(path.join(__dirname, '/../build/Logo.png'));
    const win = new BrowserWindow({
        width:720,
        height:480,
        icon: path.join(__dirname, '/assets/png/256x256.png'),
        webPreferences: {
            // preload: path.join(app.getAppPath(), 'preload.js'),
            contextIsolation: false,
            nodeIntegration: true, // <--- flag
            nodeIntegrationInWorker: true // <---  for web workers
        }
    });
    // console.log(process.env.NODE_ENV + " mode");
    // if(process.env.NODE_ENV.toString() != "dev"){
    //     win.setMenu(null);
    // }
    const isWindows = process.platform === 'win32';
  let needsFocusFix = false;
  let triggeringProgrammaticBlur = false;

  win.on('blur', (event) => {
    if(!triggeringProgrammaticBlur) {
      needsFocusFix = true;
    }
  })

  win.on('focus', (event) => {
    if(isWindows && needsFocusFix) {
      needsFocusFix = false;
      triggeringProgrammaticBlur = true;
      setTimeout(function () {
        win.blur();
        win.focus();
        setTimeout(function () {
          triggeringProgrammaticBlur = false;
        }, 100);
      }, 100);
    }
  })

    /*
    * ELECTRON_START_URL을 직접 제공할경우 해당 URL을 로드합니다.
    * 만일 URL을 따로 지정하지 않을경우 (프로덕션빌드) React 앱이
    * 빌드되는 build 폴더의 index.html 파일을 로드합니다.
    * */
    const startUrl = process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, '/../build/index.html'),
        protocol: 'file:',
        slashes: true
    });
    win.loadURL(startUrl);

}

app.on('ready', createWindow);
  