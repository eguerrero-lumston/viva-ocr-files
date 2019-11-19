"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const config = require("./config.json");
class ExpressApp {
    constructor() {
        this.app = express();
    }
    start() {
        return new Promise(resolve => {
            this.app.get('*', (req, res) => res.send('Logging In!'));
            this.appServer = this.app.listen(config.express.port, () => {
                console.log(`\nExpress app listening on port ${config.express.port}!\n`);
                return resolve();
            });
        });
    }
    stop() {
        this.appServer.close();
    }
}
exports.ExpressApp = ExpressApp;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwcmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9leHByZXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQW1DO0FBQ25DLHdDQUF3QztBQUV4QyxNQUFhLFVBQVU7SUFJdEI7UUFDQyxJQUFJLENBQUMsR0FBRyxHQUFHLE9BQU8sRUFBRSxDQUFDO0lBQ3RCLENBQUM7SUFPTSxLQUFLO1FBQ1gsT0FBTyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUM1QixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7WUFFekQsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUU7Z0JBQzFELE9BQU8sQ0FBQyxHQUFHLENBQUMsbUNBQW1DLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQztnQkFDekUsT0FBTyxPQUFPLEVBQUUsQ0FBQztZQUNsQixDQUFDLENBQUMsQ0FBQztRQUNKLENBQUMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQU1NLElBQUk7UUFDVixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3hCLENBQUM7Q0FDRDtBQS9CRCxnQ0ErQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xyXG5pbXBvcnQgKiBhcyBjb25maWcgZnJvbSAnLi9jb25maWcuanNvbic7XHJcblxyXG5leHBvcnQgY2xhc3MgRXhwcmVzc0FwcCB7XHJcblx0cHJpdmF0ZSBhcHA7XHJcblx0cHJpdmF0ZSBhcHBTZXJ2ZXI7XHJcblxyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0dGhpcy5hcHAgPSBleHByZXNzKCk7XHJcblx0fVxyXG5cclxuXHJcblx0LyoqXHJcblx0ICogU3RhcnRzIGEgbmV3IGV4cHJlc3Mgc2VydmVyIGFuZCBkaXNwbGF5cyBcIkxvZ2dpbmcgSW5cIiAoc2hvdWxkIG5vdCBiZSBzZWVuIG1vcmUgdGhhbiBhIGZldyBtaWxsaXNlY29uZHMpLlxyXG5cdCAqIEFzeW5jLCBzaW5jZSB3ZSBuZWVkIHRvIHdhaXQgb24gdGhlIHNlcnZlciB0byBiZSByZWFkeSwgc28gd2Ugd3JhcCBpbiBhIHByb21pc2UgYW5kIHJlc29sdmUgaXQgb25jZSBpdCBsb2Fkcy5cclxuXHQgKi9cclxuXHRwdWJsaWMgc3RhcnQoKSA6IFByb21pc2U8bnVsbD4ge1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xyXG5cdFx0XHR0aGlzLmFwcC5nZXQoJyonLCAocmVxLCByZXMpID0+IHJlcy5zZW5kKCdMb2dnaW5nIEluIScpKTtcclxuXHJcblx0XHRcdHRoaXMuYXBwU2VydmVyID0gdGhpcy5hcHAubGlzdGVuKGNvbmZpZy5leHByZXNzLnBvcnQsICgpID0+IHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhgXFxuRXhwcmVzcyBhcHAgbGlzdGVuaW5nIG9uIHBvcnQgJHtjb25maWcuZXhwcmVzcy5wb3J0fSFcXG5gKTtcclxuXHRcdFx0XHRyZXR1cm4gcmVzb2x2ZSgpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblxyXG5cdC8qKlxyXG5cdCAqIFN0b3BzIHRoZSBleHByZXNzIHNlcnZlclxyXG5cdCAqL1xyXG5cdHB1YmxpYyBzdG9wKCkge1xyXG5cdFx0dGhpcy5hcHBTZXJ2ZXIuY2xvc2UoKTtcclxuXHR9XHJcbn1cclxuIl19