var packager = require('electron-packager');
var options = {
    'platform': 'win32',
    'dir': './',
    'app-copyright': 'Lumston',
    'app-version': '2.0.5',
    'icon': './app.ico',
    'name': 'manifest',
    'ignore': ['./releases', './.git', './node_modules', './e2e', './src', './build', './manifiesto-win32-x64'],
    'out': './',
    'overwrite': true,
    'version': '1.3.2',
    'version-string':{
      'CompanyName': 'Lumston',
      'FileDescription': 'Aplicacion de manifiestos', /*This is what display windows on task manager, shortcut and process*/
      'OriginalFilename': 'Manifest',
      'ProductName': 'Manifiestos',
      'InternalName': 'manifest'
    }
};

packager(options, function done_callback(err, appPaths) {
    console.log(err);
    console.log(appPaths);
});