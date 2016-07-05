// Generated by typings
// Source: https://raw.githubusercontent.com/aurelia/bootstrapper-webpack/cf122f8d2a61161bcc6b785c9dfe47dbc6b3a3ff/dist/aurelia-bootstrapper-webpack.d.ts
declare module 'aurelia-bootstrapper-webpack' {
  import 'aurelia-polyfills';
  import {
    initialize
  } from 'aurelia-pal-browser';
  import {
    WebpackLoader
  } from 'aurelia-loader-webpack';
  
  /**
   * Manually bootstraps an application.
   * @param configure A callback which passes an Aurelia instance to the developer to manually configure and start up the app.
   * @return A Promise that completes when configuration is done.
   */
  export function bootstrap(configure: Function): Promise<void>;
}