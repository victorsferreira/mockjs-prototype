const server = require('./core/server');
const cwd = process.cwd();

module.exports = {
    start: (options) => {
        const { apis, port } = options;

        server.connect(port);
        server.setApis(apis);
    }
};