import { fakeServer, fakeXhr } from 'nise';

export interface IMockService {
    method: string;
    path: string;
    status: number;
    body: any;
    timeout: string | number;
    headers: object;
}

export class JSONServiceMocker {
    public defaultResHeaders: {};
    public defaultOpts: {};
    private server: fakeServer;

    constructor(options?: any) {
        this.defaultResHeaders = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        this.defaultOpts = {
            autoRespond: true
        };

        const mergedOpts: {} = (options && Object.keys(options).length)
            ? Object.assign({}, this.defaultOpts, options)
            : this.defaultOpts;

        this.server = fakeServer.create(mergedOpts);
    }

    public init(services: IMockService[]): void {
        services.forEach((service: IMockService) => {
            const status: number = service.status || 200;
            const headers: {} = service.headers || this.defaultResHeaders;

            this.server.respondWith(service.method, service.path, (req: any) => {
                let body: any = service.body;

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

        fakeXhr.FakeXMLHttpRequest.useFilters = true;
        fakeXhr.FakeXMLHttpRequest.addFilter(
            (method: string, url: string, async: boolean, username: string, password: string): boolean => {
                const windowLoc : any = typeof window !== 'undefined' ? window.location : { protocol: null, host: null };
                const rCurrLoc : any = new RegExp(`^${windowLoc.protocol}//${windowLoc.host}`);

                if (!/^https?:\/\//.test(url) || rCurrLoc.test(url)) {
                    url = url.replace(rCurrLoc, '');
                }

                const currLength : number = this.server.responses.length;
                for (let i : number = currLength - 1; i >= 0; i--) {
                    const response : any = this.server.responses[i];
                    const matchMethod: boolean = !response.method
                        || response.method.toLowerCase() === method.toLowerCase();
                    const matchUrl: string = !response.url
                        || response.url === url
                        || (typeof response.url.test === 'function' && response.url.test(url));

                    if (matchMethod && matchUrl) {
                        return false;
                    }
                }

                return true;
            }
        );
    }
    public enable(): void {
        //mock.setup();
    }

    public disable(): void {
        //mock.teardown();
    }
}
