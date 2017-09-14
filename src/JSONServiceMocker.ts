import mock from 'xhr-mock';

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

    constructor(services: IMockService[]) {
        this.defaultResHeaders = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        // if (XMLHttpRequest.name !== 'MockXMLHttpRequest') {
        //     debugger
        //     mock.setup();
        // }

        mock.setup();

        services.forEach((serviceMock: IMockService) => {
            mock.mock(serviceMock.method, serviceMock.path, (req: any, res: any) => {
                let response: any = res.status(serviceMock.status);

                response = serviceMock.hasOwnProperty('timeout')
                    ? response.timeout(serviceMock.timeout || false)
                    : response;
                response = serviceMock.hasOwnProperty('header')
                    ? response.headers((<any>Object).assign({}, this.defaultResHeaders, serviceMock.header || {}))
                    : response;

                switch (typeof serviceMock.body) {
                    case 'function':
                        response = response.body(JSON.stringify(serviceMock.body(req)));
                        break;
                    case 'object':
                        response = response.body(JSON.stringify(serviceMock.body));
                        break;
                    default:
                        break;
                }

                return response;
            });
        });
    }

    public enable(): void {
        let b: number = 2;
        b++;
    }

    public disable(): void {
        let a: number = 1;
        a++;
    }
}
