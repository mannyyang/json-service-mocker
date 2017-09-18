"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nise_1 = require("nise");
/**
 * JSON Service Mocker
 */
var JSONServiceMocker = (function () {
    function JSONServiceMocker(services, options) {
        // Keep track of desired services.
        this.mockServices = services;
        // Default mocked response headers (what the API service should contain in its headers).
        this.defaultResHeaders = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        // Default options - same options that are used in nise's fakeServer.
        // https://github.com/sinonjs/nise#options
        this.defaultOpts = {
            autoRespond: true,
            autoRespondAfter: 10
        };
        // Merge options provided by argument to default options.
        var mergedOpts = (options && Object.keys(options).length)
            ? Object.assign({}, this.defaultOpts, options)
            : this.defaultOpts;
        // Create new fake server.
        this.server = nise_1.fakeServer.create(mergedOpts);
        this.setUp();
        this.setFilters();
    }
    JSONServiceMocker.prototype.enable = function () {
        this.setUp();
    };
    JSONServiceMocker.prototype.disable = function () {
        this.server.reset();
    };
    JSONServiceMocker.prototype.setUp = function () {
        var _this = this;
        // Iterate through each service provided, and create the mock data
        // for each method/path combo.
        this.mockServices.forEach(function (service) {
            var status = service.status || 200;
            var headers = Object.assign({}, _this.defaultResHeaders, service.headers);
            _this.server.respondWith(service.method, service.path, function (req) {
                var body = service.body;
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
                req.respond(status, headers, body);
            });
        });
    };
    JSONServiceMocker.prototype.setFilters = function () {
        var _this = this;
        // Add a filter so that it doesn't fake any service calls that aren't
        // in the given mocked services list.
        nise_1.fakeXhr.FakeXMLHttpRequest.useFilters = true;
        nise_1.fakeXhr.FakeXMLHttpRequest.addFilter(function (method, path, async, username, password) {
            return !_this.mockServices.some(function (service) {
                // // if window doesn't exist, create a window location object. (why?)
                // const windowLoc: any = typeof window !== 'undefined'
                //     ? window.location
                //     : { protocol: null, host: null };
                // // create regex string that has the current host in location bar
                // const rCurrLoc: any = new RegExp(`^${windowLoc.protocol}//${windowLoc.host}`);
                // // if service url doesn't have 'http://' or 'https://' or
                // // it doesn't have the current url
                // if (!/^https?:\/\//.test(path) || rCurrLoc.test(path)) {
                //     path = path.replace(rCurrLoc, '');
                // }
                // Check if methods match. Ex. GET, POST, PUT, etc.
                var matchMethod = service.method
                    && service.method.toLowerCase() === method.toLowerCase();
                // Check if paths match.
                var matchPath = service.path
                    && (service.path === path
                        || (service.path instanceof RegExp && service.path.test(path)));
                return matchMethod && matchPath;
            });
        });
    };
    return JSONServiceMocker;
}());
exports.JSONServiceMocker = JSONServiceMocker;
