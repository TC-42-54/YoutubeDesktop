const electronInstaller = require('electron-winstaller');

async function createInstaller() {
  try {
    await electronInstaller.createWindowsInstaller({
      appDirectory: __dirname + '/YoutubeDesktop-win32-x64',
      outputDirectory: __dirname + '/build',
      authors: 'Thomas Chezieres',
      exe: 'YoutubeDesktop.exe',
      setupExe: 'YoutubeDesktop Installer',
      setupMsi: 'YoutubeDesktop Installer'
    });
    console.log('It worked!');
  } catch (e) {
    console.log(`No dice: ${e.message}`);
  }
}

createInstaller();