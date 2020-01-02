var packager = require('electron-packager');
var options = {
    'platform': 'win32',
    'dir': './',
    'app-copyright': 'Lumston',
    'app-version': '2.0.5',
    'icon': './app.ico',
    'name': 'file',
    'ignore': ['./releases', './.git', './node_modules', './e2e', './src', './build', './expediente-win32-x64'],
    'out': './',
    'overwrite': true,
    'version': '1.3.2',
    'version-string':{
      'CompanyName': 'Lumston',
      'FileDescription': 'Aplicacion de expedientes', /*This is what display windows on task manager, shortcut and process*/
      'OriginalFilename': 'File',
      'ProductName': 'Expedientes',
      'InternalName': 'file'
    }
};

packager(options, function done_callback(err, appPaths) {
    console.log(err);
    console.log(appPaths);
});