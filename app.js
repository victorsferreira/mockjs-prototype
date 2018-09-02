const mock = require('./index');

mock.start({
    apis: [
        {
            method: 'get', path: '/teste/:param1',
            case: [
                {
                    query: { 
                        param1: { equal: 'value1' } 
                    }, 
                    params: { 
                        param1: { equal: 'value1' }
                    },
                    then: {
                        status: 200, headers: { 'content-type': 'application/json' }, body: { message: 'found' }
                    }
                }
            ]            
        }
    ]
});