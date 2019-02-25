let permissionLevel = {
    'ONLY_SELF': 1,
    'ONLY_OWN_GROUP': 2,
    'OWN_GROUP_AND_LEADER': 3,
    'ALL_GROUPS': 4,
    'ALL': 5
};

const Config = {
    'database': 'mongodb://192.168.99.100:27017/social-scout',
    'salt': 'digital-scouts-santa-lucia',
    'DEBUG': true,//debugmode can overwrite permissions, be careful
    'user': [
        {
            'roleName': 'woe',
            'childGroup': true,
        }, {
            'roleName': 'jufi', 'childGroup': true,
        }, {
            'roleName': 'pfadi', 'childGroup': true,
        }, {
            'roleName': 'rover', 'childGroup': true,
        }, {
            'roleName': 'leader', 'childGroup': false,
        }, {
            'roleName': 'parent', 'childGroup': false,
        }, {
            'roleName': 'admin', 'childGroup': false,
        }, {
            'roleName': 'user',//weder Gruppenkind noch Leiter. Sonstige Mitarbeiter
            'childGroup': false,
        }
    ],
    'permission': {
        'users': {
            'GET': {
                'users': ['woe', 'jufi', 'pfadi', 'rover', 'leader', 'parent', 'admin'],
                'permissionLevel': permissionLevel.OWN_GROUP_AND_LEADER
            }, //getAllUsers
            'PUT': {
                'users': ['woe', 'jufi', 'pfadi', 'rover', 'leader', 'parent', 'admin'],
                'permissionLevel': permissionLevel.ONLY_SELF
            },
            '/:id': {
                'GET': {
                    'users': ['woe', 'jufi', 'pfadi', 'rover', 'leader', 'parent', 'admin'],
                    'permissionLevel': permissionLevel.OWN_GROUP_AND_LEADER
                }
            },
            'image': {
                'PUT': {
                    'users': ['woe', 'jufi', 'pfadi', 'rover', 'leader', 'parent', 'admin'],
                    'permissionLevel': permissionLevel.ONLY_SELF
                }
            },
            '/password': {
                'PUT': {
                    'users': ['woe', 'jufi', 'pfadi', 'rover', 'leader', 'parent', 'admin'],
                    'permissionLevel': permissionLevel.ONLY_SELF
                }
            },
            '/email': {
                'PUT': {
                    'users': ['woe', 'jufi', 'pfadi', 'rover', 'leader', 'parent', 'admin'],
                    'permissionLevel': permissionLevel.ONLY_SELF
                }
            }
        },
        'admin': {
            '/accounts': {
                '/user': {
                    'GET': ['admin'],
                    'DELETE': ['admin']
                },
                '/user/:id': {
                    'GET': ['admin'],
                    'DELETE': ['admin']
                },
                '/notActivated': {
                    'GET': ['admin'],
                    'PUT': ['admin']
                },
                '/disabled': {
                    'GET': ['admin'],
                    'PUT': ['admin']
                },
                '/inactive': {
                    'GET': ['admin'],
                },

            }
        }
    }
};

module.exports = {
    Config: Config
};
