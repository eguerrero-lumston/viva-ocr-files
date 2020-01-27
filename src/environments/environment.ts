// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // 10.159.64.157
  URL_HOST: 'http://10.1.39.151:3000/api/',
  // URL_HOST: 'http://10.159.64.157:3000/api/',
  adalConfiguration: {
    tenant: 'AlexCorp727.onmicrosoft.com',
    clientId: '33ddc4f4-6c10-43cc-85dc-7de834f2ceb7',
    redirectUri: 'http://localhost:4200/login',
    postLogoutRedirectUri: 'http://localhost:4200/login',
    cacheLocation: 'localStorage'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
