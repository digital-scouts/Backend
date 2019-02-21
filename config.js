module.exports = {
    'database': 'mongodb://192.168.99.100:27017/social-scout',
    'salt': 'digital-scouts-santa-lucia',
    'DEBUG': true,//debugmode can overwrite permissions, be careful
    'permission': [
        {
            'roleName': 'woe',
        },
        {
            'roleName': 'jufi',
        },
        {
            'roleName': 'pfadi',
        },
        {
            'roleName': 'rover',
        },
        {
            'roleName': 'leader',
        },
        {
            'roleName': 'parent',
        },
        {
            'roleName': 'admin',
        }
    ]
};
