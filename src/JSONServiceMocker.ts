// import mock = require('xhr-mock');
import { fakeServer, fakeXhr } from 'nise';


export interface IMockService {
    method: string;
    path: string;
    status: number;
    body: any;
    timeout: string | number;
    headers: object | string;
}

export class JSONServiceMocker {
    public defaultResHeaders: {};
    
    // private server: fakeServer;

    constructor() {
        this.defaultResHeaders = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
    }

    public init(services: IMockService[]) {
        const server = fakeServer.create({
            autoRespond: true
        });

        for (let i = 0; i < services.length; i++) {
            let r = services[i];
            let status = r.status || 200;
            let headers = r.headers || {
                "Content-Type": "application/json"
            };

            server.respondWith(r.method, r.path, (req) => {
                let body = r.body;

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
        }
        
        fakeXhr.FakeXMLHttpRequest.useFilters = true;
        fakeXhr.FakeXMLHttpRequest.addFilter(function (method, url, async, username, password) {
            const windowLoc = typeof window !== "undefined" ? window.location : { protocol: null, host: null };
            const rCurrLoc = new RegExp("^" + windowLoc.protocol + "//" + windowLoc.host);

            if (!/^https?:\/\//.test(url) || rCurrLoc.test(url)) {
                url = url.replace(rCurrLoc, "");
            }

            for (let l = server.responses.length, i = l - 1; i >= 0; i--) {
                const response = server.responses[i];
                const matchMethod = !response.method || response.method.toLowerCase() === method.toLowerCase();
                const matchUrl = !response.url || response.url === url || (typeof response.url.test === "function" && response.url.test(url));

                if (matchMethod && matchUrl) {
                    return false;
                }
            }

            return true;
        });
    }
    public enable(): void {
        //mock.setup();
    }

    public disable(): void {
        //mock.teardown();
    }
}
