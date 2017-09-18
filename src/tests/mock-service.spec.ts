import * as qwest from 'qwest';
import { JSONServiceMocker } from '../JSONServiceMocker';

const serviceMocks: any = function (): any[] {
    let state: any[] = [];

    return [
        {
            'method': 'GET',
            'path': '/get/json',
            'status': 200,
            'body': {
                'item': {
                    'name': 'me',
                    'age': 2
                },
                'secondItem': {
                    'name': 'me'
                }
            },
            'timeout': '',
            'headers': ''
        },
        {
            'method': 'GET',
            'path': '/get/function',
            'status': 200,
            'body': function (): any {
                return state;
            },
            'timeout': '',
            'headers': ''
        },
        {
            'method': 'GET',
            'path': '/get/function/add',
            'status': 200,
            'body': function (): any {
                state.push(1);

                return state;
            },
            'timeout': '',
            'headers': ''
        },
        {
            'method': 'GET',
            'path': '/test',
            'status': 200,
            'body': {
                'test': 'test'
            },
            'timeout': '',
            'headers': ''
        },
        {
            'method': 'POST',
            'path': '/post/reqbody',
            'status': 200,
            'body': function (req: any): any {
                return req.requestBody;
            },
            'timeout': '',
            'headers': ''
        }
    ];
};

const serviceMocks2: any = function (): any[] {
    let state: any[] = [];

    return [
        {
            'method': 'GET',
            'path': '/get2/json',
            'status': 200,
            'body': {
                'item': {
                    'name': 'me',
                    'age': 2
                },
                'secondItem': {
                    'name': 'me'
                }
            },
            'timeout': '',
            'headers': ''
        },
        {
            'method': 'GET',
            'path': '/get2/function',
            'status': 200,
            'body': function (): any {
                return state;
            },
            'timeout': '',
            'headers': ''
        },
        {
            'method': 'GET',
            'path': '/get2/function/add',
            'status': 200,
            'body': function (): any {
                state.push(1);

                return state;
            },
            'timeout': '',
            'headers': ''
        },
        {
            'method': 'POST',
            'path': '/post2/reqbody',
            'status': 200,
            'body': function (req: any): any {
                return JSON.parse(req.body());
            },
            'timeout': '',
            'headers': ''
        }
    ];
};

const headers: any = { 'Accept': 'application/json' };
const options: any = {
    dataType: 'json',
    responseType: 'json'
};

// private functions
function responseParser(response: any): JSON {
    if (typeof response.response === 'object') {
        return response.response;
    } else {
        return JSON.parse(response.response);
    }
}

describe('Test Mocking Service', () => {

    beforeAll(() => {
        const mockJS: any = new JSONServiceMocker();
        mockJS.init(serviceMocks().concat(serviceMocks2()));
    });

    it('should fetch a mocked url with a json object set in the body', (done: any) => {
        qwest.get('/get/json', null, options).then((res: any) => {
            const expected: any = {
                'item': {
                    'name': 'me',
                    'age': 2
                },
                'secondItem': {
                    'name': 'me'
                }
            };

            expect(responseParser(res)).toEqual(expected);
            done();
        });
    });

    it('should fetch a mocked url with an object generated from a function', (done: any) => {
        qwest.get('/get/function', null, options).then((res: any) => {
            const emptyArray: any = [];
            expect(responseParser(res)).toEqual(emptyArray);
            done();
        });
    });

    it('should execute function each time service is called', (done: any) => {
        qwest.get('/get/function/add', null, options)
            .then((res: any) => {
                const emptyArray: any = [1];
                expect(responseParser(res)).toEqual(emptyArray);

                return qwest.get('/get/function/add', null, options);
            })
            .then((res: any) => {
                const secondFilled: any = [1, 1];
                expect(responseParser(res)).toEqual(secondFilled);
                done();
            });
    });

    it('should contain the right request body', (done: any) => {
        const reqBody: any = {
            'isTHis': 'beingPassed',
            'one': 1,
            'obj': {
                'nested': 'nestedvalue'
            }
        };

        qwest.post('/post/reqbody', reqBody, options)
            .then((res: any) => {
                const body: any = responseParser(res);
                expect(body).toEqual(reqBody);
                done();
            });
    });

    it('should keep the correct references', (done: any) => {
        qwest.get('/get2/json', null, options).then((res: any) => {
            const expected: any = {
                'item': {
                    'name': 'me',
                    'age': 2
                },
                'secondItem': {
                    'name': 'me'
                }
            };

            expect(responseParser(res)).toEqual(expected);

            return qwest.get('/get2/function', null, options);
        }).
            then((res: any) => {
                const emptyArray: any = [];
                expect(responseParser(res)).toEqual(emptyArray);

                return qwest.get('/get2/function/add', null, options);
            })
            .then((res: any) => {
                const emptyArray: any = [1];
                expect(responseParser(res)).toEqual(emptyArray);

                return qwest.get('/get2/function/add', null, options);
            })
            .then((res: any) => {
                const secondFilled: any = [1, 1];
                expect(responseParser(res)).toEqual(secondFilled);
                done();
            });
    });

});
