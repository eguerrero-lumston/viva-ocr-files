"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const request = require("request");
const crypto = require("crypto");
const rxjs_1 = require("rxjs");
const URLSearchParams = require('url-search-params-polyfill');
const express_1 = require("./express");
const config = require("./config.json");
const authStateIdentifier = Math.random().toString(36).substring(7);
function base64URLEncode(str) {
    return str.toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}
const authPKCEVerifier = base64URLEncode(crypto.randomBytes(32));
function sha256(buffer) {
    return crypto.createHash('sha256').update(buffer).digest();
}
const authPKCEChallenge = base64URLEncode(sha256(authPKCEVerifier));
class Authenticator {
    constructor() {
        this.checkAuth();
    }
    checkAuth() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initializeAuthWindow();
            const refreshToken = null;
            if (refreshToken) {
                this.authWindow.close();
                this.expressApp.stop();
                this.refreshAccessToken(refreshToken);
            }
            else {
                this.authWindow.show();
                this.authenticate();
            }
        });
    }
    initIPCWatchers(mainWindow) {
        console.log('initIPCWatchers')
        electron_1.ipcMain.on('login', () => {
            this.authenticate();
        });
        electron_1.ipcMain.on('refreshAccessToken', (event, refreshToken) => {
            console.log('refreshAccessToken')
            const tokenRequestUrl = `https://login.microsoftonline.com/${config.auth.tenantId}/oauth2/v2.0/token`;
            const tokenRequestBody = {
                grant_type: 'refresh_token',
                client_id: config.auth.clientId,
                refresh_token: refreshToken,
                scope: config.auth.scope
            };
            request.post({ url: tokenRequestUrl, form: tokenRequestBody }, (err, httpResponse, body) => {
                mainWindow.webContents.send('tokenReceived', body);
            });
        });
        electron_1.ipcMain.on('routeToHome', () => {
            console.log('routeToHome')
            mainWindow.loadURL(`file://${__dirname}/index.html`);
        });
        electron_1.ipcMain.on('logout', () => {
            console.log('refreshAccessToken')
            mainWindow.close();
        });
    }
    initializeAuthWindow() {
        return __awaiter(this, void 0, void 0, function* () {
            this.expressApp = new express_1.ExpressApp();
            yield this.expressApp.start();
            this.authWindow = new electron_1.BrowserWindow({
                show: false,
                alwaysOnTop: true,
                webPreferences: {
                    nodeIntegration: false,
                    contextIsolation: true
                }
            });
            console.log(`http://${config.express.protocol}`)
            this.authWindow.loadURL(`http://${config.express.protocol}`);
            this.authWindow.on('closed', () => {
                this.authWindow = null;
            });
        });
    }
    authenticate() {
        console.log('authenticate')
        return __awaiter(this, void 0, void 0, function* () {
            this.authWindow.loadURL(`
			https://login.microsoftonline.com/${config.auth.tenantId}/oauth2/authorize?
				client_id=${config.auth.clientId}
				&response_type=code
				&redirect_uri=http://${config.express.protocol}
				&response_mode=query
				&scope=${config.auth.scope}
				&state=${authStateIdentifier}
				&code_challenge_method=S256
				&code_challenge=${authPKCEChallenge}
		`);
            this.authWindow.webContents.on('did-finish-load', () => {
                console.log('did-finish-load')
                electron_1.session.defaultSession.webRequest.onCompleted({ urls: [`http://${config.express.protocol}` + '*'] }, details => {
                    console.log('session.defaultSession', details)
                    console.log('authStateIdentifier', authStateIdentifier)
                    
                    const _url = details.url.split('?')[1];
                    console.log('_url', _url)
                    const _params = new URLSearchParams(_url);
                    const _accessCode = _params.get('code');
                    console.log('_accessCode', _accessCode)

                    const _state = _params.get('state');
                    if (_accessCode && _state === authStateIdentifier) {
                        const tokenRequestUrl = `https://login.microsoftonline.com/${config.auth.tenantId}/oauth2/token`;
                        const tokenRequestBody = {
                            grant_type: 'authorization_code',
                            client_id: config.auth.clientId,
                            redirect_uri: `http://${config.express.protocol}`,
                            scope: config.auth.scope,
                            code_verifier: authPKCEVerifier
                        };
                        request.post({ url: tokenRequestUrl, form: tokenRequestBody }, (err, httpResponse, body) => {
                            console.log(body);
                            if (this.authWindow)
                                this.authWindow.loadURL(`http://${config.express.protocol}`);
                            this.handleAccessTokenResponse(err, httpResponse, body);
                            if (this.authWindow)
                                this.authWindow.close();
                            this.expressApp.stop();
                        });
                    }
                });
            });
        });
    }
    handleAccessTokenResponse(err, httpResponse, body) {
        if (!err) {
            try {
                const response = JSON.parse(body);
                if (response.error) {
                    rxjs_1.throwError('Error: ' + response.error + '\nFailure during the request of the access_token\n' + response.error_description);
                }
                else {
                    console.log('to store token')
                    this.storeRefreshToken(response.refresh_token);
                    return response;
                }
            }
            catch (_a) {
                rxjs_1.throwError('Could not parse and store Refresh Token.');
            }
        }
        else {
            rxjs_1.throwError('Error: ' + httpResponse + '\nFailure during the request of the access_token\n' + body);
        }
    }
    storeRefreshToken(token) {
        const cookie = {
            url: 'http://${config.express.protocol}',
            name: 'refresh_token',
            value: JSON.stringify(token),
            httpOnly: true,
            expirationDate: Math.floor(new Date().getTime() / 1000) + (60 * 60 * 24 * 90)
        };
        electron_1.session.defaultSession.cookies.set(cookie, error => error ? console.error(error) : null);
    }
    getRefreshTokenFromStorage() {
        const cookie = {
            url: 'http://${config.express.protocol}',
            name: 'refresh_token'
        };
        return new Promise(resolve => {
            electron_1.session.defaultSession.cookies.get(cookie, (error, refreshTokenCookie) => {
                if (error) {
                    return resolve();
                }
                else if (!refreshTokenCookie.length) {
                    return resolve();
                }
                else {
                    return resolve(JSON.parse(refreshTokenCookie[0].value));
                }
            });
        });
    }
    refreshAccessToken(refreshToken) {
        const tokenRequestUrl = `https://login.microsoftonline.com/${config.auth.tenantId}/oauth2/v2.0/token`;
        const tokenRequestBody = {
            grant_type: 'refresh_token',
            client_id: config.auth.clientId,
            refresh_token: refreshToken,
            scope: config.auth.scope
        };
        request.post({ url: tokenRequestUrl, formData: tokenRequestBody }, (err, httpResponse, body) => this.handleAccessTokenResponse(err, httpResponse, body));
    }
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            const cookie = {
                url: 'http://${config.express.protocol}',
                name: 'refresh_token'
            };
            yield this.initializeAuthWindow();
            electron_1.session.defaultSession.cookies.remove(cookie.url, cookie.name, () => {
                this.authWindow.show();
                this.authWindow.loadURL('https://login.microsoftonline.com/common/oauth2/v2.0/logout');
                this.authWindow.webContents.on('did-finish-load', () => {
                    this.authWindow.close();
                    this.expressApp.stop();
                });
            });
        });
    }
}
exports.Authenticator = Authenticator;