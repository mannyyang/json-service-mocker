import { JSONServiceMocker } from '../JSONServiceMocker';
import * as qwest from 'qwest';

const serviceMocks = function () {
    let state = [];

    return [
        {
            "method": "GET",
            "path": "/get/state",
            "status": 200,
            "body": function() {
                state.push(1);
                return state;
            },
            "timeout": "",
            "header": ""
        },
        {
            "method": "GET",
            "path": "/test",
            "status": 200,
            "body": {
                "test": "test"
            },
            "timeout": "",
            "header": ""
        },
        {
            "method": "POST",
            "path": "/test",
            "status": 200,
            "body": function(req) {
                let body = req._body;

                debugger;
            },
            "timeout": "",
            "header": ""
        }
    ];
}

const headers = { 'Accept': 'application/json' };
const options = {
    dataType: 'json',
    // responseType: 'json'
    // headers: headers
}

describe('Test Mocking Service', () => {
    it('should work', () => {
        let mockJS = new JSONServiceMocker(serviceMocks());
        // let mockJS2 = new JSONServiceMocker(serviceMocks2());

        qwest.get('/locales', null, options).then(data => {
            console.log('/locales', data);
        });

        // qwest.get('/new', null, options).then(data => {
        //     console.log('/new', data);
        // });

        // qwest.post('/test',
        //     JSON.stringify({ 'isTHis': 'beingPassed', 'one': 1, "obj": { "nested": "nestedvalue" } }),
        //     options
        // )
        //     .then(data => {
        //         console.log(data);
        //     });

        expect(true).toBe(true);
    });
});