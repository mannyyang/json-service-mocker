import mock = require('xhr-mock');

export interface IMockService {
    method: string;
    path: string;
    status: number;
    body: any;
    timeout: string | number;
    header: object | string;
}

export class JSONServiceMocker {
    public defaultResHeaders: {};

    constructor() {
        this.defaultResHeaders = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        mock.setup();

        // override original function so that it doesn't throw an error
        mock.XMLHttpRequest.prototype.overrideMimeType = function (mime: any) : any {
            // not implemented yet.
        };
    }

    public init(services: IMockService[]): void {
        services.forEach((serviceMock: IMockService) => {
            mock.mock(serviceMock.method, serviceMock.path, (req: any, res: any) => {
                // init response object
                let response: any = res.status(serviceMock.status);

                response = serviceMock.hasOwnProperty('header')
                    ? response.headers((<any>Object).assign({}, this.defaultResHeaders, serviceMock.header || {}))
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
    }

    public enable(): void {
        mock.setup();
    }

    public disable(): void {
        mock.teardown();
    }
}
