import { fakeServer, fakeXhr } from 'nise';

/**
 * Single Mock Service Interface
 */
export interface IMockService {
    method: string;
    path: string | RegExp;
    status: number;
    body: any;
    timeout?: string | number;
    headers: object;
}
/**
 * JSON Service Mocker
 */
export class JSONServiceMocker {
    public defaultResHeaders: {};
    public defaultOpts: {
        autoRespond?: boolean;
        autoRespondAfter?: number;
    };
    public mockServices: IMockService[];
    private server: fakeServer;

    constructor(services: IMockService[], options?: any) {
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
        const mergedOpts: {} = (options && Object.keys(options).length)
            ? Object.assign({}, this.defaultOpts, options)
            : this.defaultOpts;

        // Create new fake server.
        this.server = fakeServer.create(mergedOpts);

        this.setUp();
        this.setFilters();
    }

    public enable(): void {
        this.setUp();
    }

    public disable(): void {
        this.server.reset();
    }

    private setUp(): void {
        // Iterate through each service provided, and create the mock data
        // for each method/path combo.
        this.mockServices.forEach((service: IMockService) => {
            const status: number = service.status || 200;
            const headers: {} = Object.assign({}, this.defaultResHeaders, service.headers);

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
    }

    private setFilters(): void {
        // Add a filter so that it doesn't fake any service calls that aren't
        // in the given mocked services list.
        fakeXhr.FakeXMLHttpRequest.useFilters = true;
        fakeXhr.FakeXMLHttpRequest.addFilter(
            (method: string, path: string, async: boolean, username: string, password: string): boolean => {
                return !this.mockServices.some((service: IMockService) => {
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
                    const matchMethod: boolean = service.method
                        && service.method.toLowerCase() === method.toLowerCase();

                    // Check if paths match.
                    const matchPath: boolean = service.path
                        && (
                            service.path === path
                            || (service.path instanceof RegExp && service.path.test(path))
                        );

                    return matchMethod && matchPath;
                });
            }
        );
    }
}
