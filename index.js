"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const url = require("url");
const path = require("path");
const authenticator_1 = require("./authenticator");
class Electron {
    constructor() {
        this.authenticator = new authenticator_1.Authenticator();
        this.initialize();
    }
    initialize() {
        const menu = new electron_1.Menu();
        menu.append(new electron_1.MenuItem({
            label: 'Log Out',
            click: () => this.authenticator.logout()
        }));
        let mainWindow = new electron_1.BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: false
            }
        });
        mainWindow.maximize();
        // mainWindow.loadFile(`${__dirname}/../../app/electron-angular-auth/dist/electron-angular-auth/index.html`);
        mainWindow.loadURL(
            url.format({
                pathname: path.join(__dirname, `/dist/index.html`),
                protocol: "file:",
                slashes: true
            })
        );
        this.authenticator.initIPCWatchers(mainWindow);
    }
}
electron_1.app.on('ready', () => new Electron());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx1Q0FBOEQ7QUFFOUQsbURBQWdEO0FBR2hELE1BQU0sUUFBUTtJQUdiO1FBQ0MsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLDZCQUFhLEVBQUUsQ0FBQztRQUN6QyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDbkIsQ0FBQztJQU1PLFVBQVU7UUFDakIsTUFBTSxJQUFJLEdBQUcsSUFBSSxlQUFJLEVBQUUsQ0FBQztRQUN4QixJQUFJLENBQUMsTUFBTSxDQUNWLElBQUksbUJBQVEsQ0FBQztZQUNaLEtBQUssRUFBRSxTQUFTO1lBQ2hCLEtBQUssRUFBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRTtTQUN2QyxDQUFDLENBQ0YsQ0FBQztRQUlGLElBQUksVUFBVSxHQUFHLElBQUksd0JBQWEsQ0FDakM7WUFDQyxLQUFLLEVBQUUsR0FBRztZQUNWLE1BQU0sRUFBRSxHQUFHO1lBQ1gsY0FBYyxFQUFFO2dCQUNmLGVBQWUsRUFBRSxLQUFLO2dCQUN0QixnQkFBZ0IsRUFBRSxLQUFLO2FBQ3ZCO1NBQ0QsQ0FDRCxDQUFDO1FBR0YsVUFBVSxDQUFDLFFBQVEsQ0FBQyxHQUFHLFNBQVMsd0VBQXdFLENBQUMsQ0FBQztRQUcxRyxJQUFJLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNoRCxDQUFDO0NBQ0Q7QUFFRCxjQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLFFBQVEsRUFBRSxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhcHAsIEJyb3dzZXJXaW5kb3csIE1lbnUsIE1lbnVJdGVtIH0gZnJvbSAnZWxlY3Ryb24nO1xyXG5cclxuaW1wb3J0IHsgQXV0aGVudGljYXRvciB9IGZyb20gJy4vYXV0aGVudGljYXRvcic7XHJcblxyXG5cclxuY2xhc3MgRWxlY3Ryb24ge1xyXG5cdHByaXZhdGUgYXV0aGVudGljYXRvciA6IEF1dGhlbnRpY2F0b3I7XHJcblxyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0dGhpcy5hdXRoZW50aWNhdG9yID0gbmV3IEF1dGhlbnRpY2F0b3IoKTtcclxuXHRcdHRoaXMuaW5pdGlhbGl6ZSgpO1xyXG5cdH1cclxuXHJcblxyXG5cdC8qKlxyXG5cdCAqIExvYWQgdXAgb3VyIG1haW4gd2luZG93IGZvciB0aGUgd2ViIGFwcGxpY2F0aW9uLlxyXG5cdCAqL1xyXG5cdHByaXZhdGUgaW5pdGlhbGl6ZSgpIHtcclxuXHRcdGNvbnN0IG1lbnUgPSBuZXcgTWVudSgpO1xyXG5cdFx0bWVudS5hcHBlbmQoXHJcblx0XHRcdG5ldyBNZW51SXRlbSh7XHJcblx0XHRcdFx0bGFiZWw6ICdMb2cgT3V0JyxcclxuXHRcdFx0XHRjbGljazooKSA9PiB0aGlzLmF1dGhlbnRpY2F0b3IubG9nb3V0KClcclxuXHRcdFx0fSlcclxuXHRcdCk7XHJcblx0XHQvLyBNZW51LnNldEFwcGxpY2F0aW9uTWVudShtZW51KTtcclxuXHJcblx0XHQvLyBDcmVhdGUgdGhlIGJyb3dzZXIgd2luZG93LlxyXG5cdFx0bGV0IG1haW5XaW5kb3cgPSBuZXcgQnJvd3NlcldpbmRvdyhcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHdpZHRoOiA4MDAsXHJcblx0XHRcdFx0aGVpZ2h0OiA2MDAsXHJcblx0XHRcdFx0d2ViUHJlZmVyZW5jZXM6IHtcclxuXHRcdFx0XHRcdG5vZGVJbnRlZ3JhdGlvbjogZmFsc2UsIC8vIHlvdSBkb24ndCBuZWVkIHRvIGFkZCB0aGlzIGluIEVsZWN0cm9uIHY0KyBhcyBpdCBpcyBkZWZhdWx0XHJcblx0XHRcdFx0XHRjb250ZXh0SXNvbGF0aW9uOiBmYWxzZVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0KTtcclxuXHJcblx0XHQvLyBhbmQgbG9hZCB0aGUgaW5kZXguaHRtbCBvZiB0aGUgYXBwLlxyXG5cdFx0bWFpbldpbmRvdy5sb2FkRmlsZShgJHtfX2Rpcm5hbWV9Ly4uLy4uL2FwcC9lbGVjdHJvbi1hbmd1bGFyLWF1dGgvZGlzdC9lbGVjdHJvbi1hbmd1bGFyLWF1dGgvaW5kZXguaHRtbGApO1xyXG5cclxuXHRcdC8vIFdhdGNoIGZvciBJUEMgY2hhbmdlcy5cclxuXHRcdHRoaXMuYXV0aGVudGljYXRvci5pbml0SVBDV2F0Y2hlcnMobWFpbldpbmRvdyk7XHJcblx0fVxyXG59XHJcblxyXG5hcHAub24oJ3JlYWR5JywgKCkgPT4gbmV3IEVsZWN0cm9uKCkpO1xyXG4iXX0=