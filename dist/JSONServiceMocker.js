"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mock = require("xhr-mock");
var JSONServiceMocker = (function () {
    function JSONServiceMocker() {
        this.defaultResHeaders = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        mock.setup();
        // override original function so that it doesn't throw an error
        mock.XMLHttpRequest.prototype.overrideMimeType = function (mime) {
            // not implemented yet.
        };
    }
    JSONServiceMocker.prototype.init = function (services) {
        var _this = this;
        services.forEach(function (serviceMock) {
            mock.mock(serviceMock.method, serviceMock.path, function (req, res) {
                // init response object
                var response = res.status(serviceMock.status);
                response = serviceMock.hasOwnProperty('header')
                    ? response.headers(Object.assign({}, _this.defaultResHeaders, serviceMock.header || {}))
                    : response;
                switch (typeof serviceMock.body) {
                    case 'function':
                        response = response.body(serviceMock.body(req));
                        break;
                    case 'object':
                        response = response.body(serviceMock.body);
                        break;
                    default:
                        break;
                }
                return response;
            });
        });
    };
    JSONServiceMocker.prototype.enable = function () {
        mock.setup();
    };
    JSONServiceMocker.prototype.disable = function () {
        mock.teardown();
    };
    return JSONServiceMocker;
}());
exports.JSONServiceMocker = JSONServiceMocker;
