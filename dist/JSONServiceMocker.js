"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import mock = require('xhr-mock');
var nise_1 = require("nise");
var JSONServiceMocker = (function () {
    function JSONServiceMocker() {
        this.defaultResHeaders = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        this.server = nise_1.fakeServer.create({
            autoRespond: true
        });
    }
    JSONServiceMocker.prototype.init = function (services) {
        var server = nise_1.fakeServer.create({
            autoRespond: true
        });
        var _loop_1 = function (i) {
            var r = services[i];
            var status_1 = r.status || 200;
            var headers = r.headers || {
                "Content-Type": "application/json"
            };
            server.respondWith(r.method, r.path, function (req) {
                var body = r.body;
                switch (typeof body) {
                    case 'object':
                        body = JSON.stringify(body);
                        break;
                    case 'function':
                        body = JSON.stringify(body(req));
                        break;
                    default:
                        break;
                }
                req.respond(status_1, headers, body);
            });
        };
        for (var i = 0; i < services.length; i++) {
            _loop_1(i);
        }
        nise_1.fakeXhr.FakeXMLHttpRequest.useFilters = true;
        nise_1.fakeXhr.FakeXMLHttpRequest.addFilter(function (method, url, async, username, password) {
            var windowLoc = typeof window !== "undefined" ? window.location : { protocol: null, host: null };
            var rCurrLoc = new RegExp("^" + windowLoc.protocol + "//" + windowLoc.host);
            if (!/^https?:\/\//.test(url) || rCurrLoc.test(url)) {
                url = url.replace(rCurrLoc, "");
            }
            for (var l = server.responses.length, i = l - 1; i >= 0; i--) {
                var response = server.responses[i];
                var matchMethod = !response.method || response.method.toLowerCase() === method.toLowerCase();
                var matchUrl = !response.url || response.url === url || (typeof response.url.test === "function" && response.url.test(url));
                if (matchMethod && matchUrl) {
                    return false;
                }
            }
            return true;
        });
    };
    JSONServiceMocker.prototype.enable = function () {
        //mock.setup();
    };
    JSONServiceMocker.prototype.disable = function () {
        //mock.teardown();
    };
    return JSONServiceMocker;
}());
exports.JSONServiceMocker = JSONServiceMocker;
