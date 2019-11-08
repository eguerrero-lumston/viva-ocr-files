const installer = require('electron-installer-windows');
var electronInstaller = require('electron-winstaller');

const options = {
  src: 'manifiesto-win32-x64/',
  dest: 'dist/installers/',
  authors: ['Lumston', 'Erick'],
  loadingGif: 'build/loader.gif',
  setupExe: 'intaller-manifest',
  noMsi: true
}

// In this case, we can use relative paths
var settings = {
  // Specify the folder where the built app is located
  appDirectory: './manifiesto-win32-x64',
  // Specify the existing folder where 
  outputDirectory: './dist/installers/',
  // The name of the Author of the app (the name of your company)
  authors: ['Lumston', 'Erick'],
  // The name of the executable of your built
  exe: './manifiesto.exe',
  loadingGif: 'build/loader.gif',
  setupExe: 'intaller-manifest.exe',
};

resultPromise = electronInstaller.createWindowsInstaller(settings);

resultPromise.then(() => {
  console.log("The installers of your application were succesfully created !");
}, (e) => {
  console.log(`Well, sometimes you are not so lucky: ${e.message}`)
});
// async function main (options) {
//   console.log('Creating package (this may take a while)')
//   try {
//     await installer(options)
//     console.log(`Successfully created package at ${options.dest}`)
//   } catch (err) {
//     console.error(err, err.stack)
//     process.exit(1)
//   }
// }
// main(options)