var
    config = {};

config.endpoint = {
    port: 80
};

config.mongo = {
    host: "<%= mongoip %>",
    db: 'tdaf-notif',
    user: '',
    password: ''
};

module.exports = config;
