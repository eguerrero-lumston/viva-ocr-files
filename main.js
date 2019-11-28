const { app, BrowserWindow, Menu, electron } = require('electron');
const url = require("url");
const path = require("path");
const { session } = require('electron');
var ipcMain = require('electron').ipcMain;
const globalShortcut = electron.globalShortcut;
// this should be placed at top of main.js to handle setup events quickly
if (handleSquirrelEvent(app)) {
    // squirrel event handled and app will exit in 1000ms, so don't do anything else
    return;
}

// This is just an example url - follow the guide for whatever service you are using
var authUrl = 'http://localhost:4200/login';


let mainWindow
function createWindow() {
    
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        'web-security': false,
        webPreferences: {
            nodeIntegration: true
        }
    })

    // mainWindow.loadURL(authUrl);
    
//   webRequest.onBeforeRequest(filter, async ({url}) => {
//     await authService.loadTokens(url);
//     createAppWindow();
//     return destroyAuthWin();
//   });

    // mainWindow.on('authenticated', () => {
    //     console.log('<-------------------authenticated----------------------->');
    // });
    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, `/dist/index.html`),
            protocol: "file:",
            slashes: true
        })
    );
    // mainWindow.loadURL('https://www.google.com.mx/');

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // mainWindow.webContents.on('will-navigate', function (event, newUrl) {
    //     console.log('reedirect ---->', newUrl);
    //     const filter = {
    //         urls: [authUrl + '*']
    //       };
          
    //       // intercept all the requests for that includes my redirect uri
    //       session.defaultSession.webRequest.onBeforeRequest(filter, function (details, callback) {
    //         const url = details.url;
    //         console.log(' details.url ---->',  details.url);
    //         // process the callback url and get any param you need
          
    //         // don't forget to let the request proceed
    //         callback({
    //           cancel: false
    //         });
    //       });
    //     // More complex code to handle tokens goes here
    // });
    app.on('login', (event, webContents, details, authInfo, callback) => {
        console.log('login mainjs');
        event.preventDefault()
        callback('username', 'secret')
      });
    mainWindow.on('closed', function () {
        mainWindow = null
    })

    mainWindow.setMenu(null);
   
    // mainWindow.setMenu(null);
    mainWindow.maximize();
    Menu.setApplicationMenu(null);

    globalShortcut.register('f5', function () {
        console.log('f5 is pressed')
        mainWindow.reload();
        mainWindow.loadURL(url.format({ pathname: path.join(__dirname, `/dist/index.html`), protocol: 'file:', slashes: true, }));
    });

    globalShortcut.register('CommandOrControl+R', function () {
        console.log('CommandOrControl+R is pressed')
        mainWindow.reload();
        mainWindow.loadURL(url.format({ pathname: path.join(__dirname, `/dist/index.html`), protocol: 'file:', slashes: true, }));
    });
}

function destroyAuthWin() {
    if (!mainWindow) return;
    mainWindow.close();
    mainWindow = null;
  }
  
function createLogoutWindow() {
    return new Promise(resolve => {
      const logoutWindow = new BrowserWindow({
        show: false,
      });
  
    //   logoutWindow.loadURL(authService.getLogOutUrl());
  
    //   logoutWindow.on('ready-to-show', async () => {
    //     logoutWindow.close();
    //     await authService.logout();
    //     resolve();
    //   });
    });
  }

function handleSquirrelEvent(application) {
    if (process.argv.length === 1) {
        return false;
    }

    const ChildProcess = require('child_process');
    const path = require('path');

    const appFolder = path.resolve(process.execPath, '..');
    const rootAtomFolder = path.resolve(appFolder, '..');
    const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
    const exeName = path.basename(process.execPath);

    const spawn = function(command, args) {
        let spawnedProcess, error;

        try {
            spawnedProcess = ChildProcess.spawn(command, args, {
                detached: true
            });
        } catch (error) {}

        return spawnedProcess;
    };

    const spawnUpdate = function(args) {
        return spawn(updateDotExe, args);
    };

    const squirrelEvent = process.argv[1];
    switch (squirrelEvent) {
        case '--squirrel-install':
        case '--squirrel-updated':
            // Optionally do things such as:
            // - Add your .exe to the PATH
            // - Write to the registry for things like file associations and
            //   explorer context menus

            // Install desktop and start menu shortcuts
            spawnUpdate(['--createShortcut', exeName]);

            setTimeout(application.quit, 1000);
            return true;

        case '--squirrel-uninstall':
            // Undo anything you did in the --squirrel-install and
            // --squirrel-updated handlers

            // Remove desktop and start menu shortcuts
            spawnUpdate(['--removeShortcut', exeName]);

            setTimeout(application.quit, 1000);
            return true;

        case '--squirrel-obsolete':
            // This is called on the outgoing version of your app before
            // we update to the new version - it's the opposite of
            // --squirrel-updated

            application.quit();
            return true;
    }
};
app.on('ready', createWindow)

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
    if (mainWindow === null) createWindow()
})

function createAuthorizationUrl(state) {
    return templateAuthzUrl.replace('<state>', state);
  }
  
// Clients get redirected here in order to create an OAuth authorize url and redirect them to AAD.
// There they will authenticate and give their consent to allow this app access to
// some resource they own.
app.get('/auth', function(req, res) {
  crypto.randomBytes(48, function(ex, buf) {
    var token = buf.toString('base64').replace(/\//g,'_').replace(/\+/g,'-');

    res.cookie('authstate', token);
    var authorizationUrl = createAuthorizationUrl(token);

    res.redirect(authorizationUrl);
  });
});

// After consent is granted AAD redirects here.  The ADAL library is invoked via the
// AuthenticationContext and retrieves an access token that can be used to access the
// user owned resource.
app.get('/getAToken', function(req, res) {
  if (req.cookies.authstate !== req.query.state) {
    res.send('error: state does not match');
  }

  var authenticationContext = new AuthenticationContext(authorityUrl);

  authenticationContext.acquireTokenWithAuthorizationCode(
    req.query.code,
    redirectUri,
    resource,
    clientId, 
    clientSecret,
    function(err, response) {
      var errorMessage = '';
      if (err) {
        errorMessage = 'error: ' + err.message + '\n';
      }
      errorMessage += 'response: ' + JSON.stringify(response);
      res.send(errorMessage);
    }
  );
});