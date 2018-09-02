const mock = require('./index');

mock.start({
    routes: [
        {
            method: 'get', path: '/teste/:id',
            request: {
                query: { ok: 'olar' }, params: { id: 'teste' },
            },
            response: {
                status: 200, headers: { 'content-type': 'application/json', xteste: 'okko' }, body: { teste: 'victor' }
            }
        },
        {
            method: 'get', path: '/teste2/:id',
            response: {
                status: 200, headers: { 'content-type': 'application/json', xteste: 'okko' }, body: { teste: 'victor' }
            }
        }
    ]
});