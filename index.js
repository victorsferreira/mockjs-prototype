const server = require('./server');

module.exports = {
    start: (options) => {
        const { apis, port } = options;

        server.connect(port);
        server.setApis(apis);
    }
};