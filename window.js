
global.WIN_POSITION = 'right-top';

global.createWindow = async function() {
    const { BrowserWindow } = require('electron');
    // Cree la fenetre du navigateur.
    let win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        },
        frame: false,
        show: false,
        maximizable:false,
        fullscreenable:false,
        titleBarStyle: 'customButtonsOnHover'
    });
    win.setAlwaysOnTop(true, "screen");
    win.setVisibleOnAllWorkspaces(true);

    // win.webContents.session.webRequest.onHeadersReceived(
    //     {urls: ['*://*/*']},
    //     (details, callback) => {
    //         callback({responseHeaders: Object.fromEntries(Object.entries(details.responseHeaders).filter(header => !/x-frame-options/i.test(header[0])))});
    //     },
    // )
    return win;
}
global.getScreensWidthHeight = function() {
    const { screen } = require('electron');
    var displays = screen.getAllDisplays();
    var width = 0;
    var height = 0;

    displays.forEach(function(display) {
        width += display.bounds.width;
        height += display.bounds.height;
    });

    return {
        width: displays[1].bounds.width,
        height: displays[1].bounds.height
    }
}

global.setWindowPosition  = async function(win, position) {
    if (!position) return;
    var windowResolution = getScreensWidthHeight();
    var windowSize = win.getSize();
    switch(position) {
        case 'right-top':
            win.setBounds({
                x: windowResolution.width - windowSize[0],
                y: 0,
                width: windowSize[0],
                height: windowSize[1]
            }, true);
        break;
        case 'right-bottom':
            win.setBounds({
                x: windowResolution.width - windowSize[0],
                y: windowResolution.height - windowSize[1],
                width: windowSize[0],
                height: windowSize[1]
            }, true);
        break;
        case 'left-top':
            win.setBounds({
                x: 0,
                y: 0,
                width: windowSize[0],
                height: windowSize[1]
            }, true);
        break;
        case 'left-bottom':
            win.setBounds({
                x: 0,
                y: windowResolution.height - windowSize[1],
                width: windowSize[0],
                height: windowSize[1]
            }, true);
        break;
    }
    return position;
}
