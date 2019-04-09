let permissionLevel = {
    'ONLY_SELF': 1,
    'ONLY_OWN_GROUP': 2,
    'OWN_GROUP_AND_LEADER': 3,
    'ALL_GROUPS': 4,
    'ALL': 5
};

const Config = {
    'database': 'mongodb://192.168.99.100:27017/social-scout',
    'test_database': 'mongodb://127.0.0.1:27017/test-social-scout',
    'local_database': 'mongodb://127.0.0.1:27017/social-scout',
    'salt': 'digital-scouts-santa-lucia', // change the salt to disable all tokens (force login)
    'DEBUG': true,// debugmode can overwrite permissions, be careful
    'PERMISSION': true, // permission can be disabled (active = true, disabled = false)
    'calender': {
        'public_event_daysPast': 10,
        'public_event_daysFuture': 183,
    },
    'user': [// dont remove non child groups
        {
            'roleName': 'woe', 'childGroup': true
        }, {
            'roleName': 'jufi', 'childGroup': true
        }, {
            'roleName': 'pfadi', 'childGroup': true
        }, {
            'roleName': 'rover', 'childGroup': true
        }, {
            'roleName': 'leader', 'childGroup': false
        }, {
            'roleName': 'parent', 'childGroup': false
        }, {// dont remove 'admin'
            'roleName': 'admin', 'childGroup': false
        }, {//weder Gruppenkind noch Leiter. Sonstige Mitarbeiter
            'roleName': 'user', 'childGroup': false
        }
    ],
    'permission': {
        'users': {
            'GET': {
                'users': ['woe', 'jufi', 'pfadi', 'rover', 'leader', 'parent', 'admin'],
                'permissionLevel': permissionLevel.OWN_GROUP_AND_LEADER,
                'permissionForDisabled': true,
                'permissionForNotActivated': false
            }, //getAllUsers
            'PUT': {
                'users': ['woe', 'jufi', 'pfadi', 'rover', 'leader', 'parent', 'admin'],
                'permissionLevel': permissionLevel.ONLY_SELF,
                'permissionForDisabled': true,
                'permissionForNotActivated': true
            },
            '/:id': {
                'GET': {
                    'users': ['woe', 'jufi', 'pfadi', 'rover', 'leader', 'parent', 'admin'],
                    'permissionLevel': permissionLevel.OWN_GROUP_AND_LEADER,
                    'permissionForDisabled': true,
                    'permissionForNotActivated': true
                }
            },
            'image': {
                'PUT': {
                    'users': ['woe', 'jufi', 'pfadi', 'rover', 'leader', 'parent', 'admin'],
                    'permissionLevel': permissionLevel.ONLY_SELF,
                    'permissionForDisabled': true,
                    'permissionForNotActivated': false
                }
            },
            'password': {
                'PUT': {
                    'users': ['woe', 'jufi', 'pfadi', 'rover', 'leader', 'parent', 'admin'],
                    'permissionLevel': permissionLevel.ONLY_SELF,
                    'permissionForDisabled': true,
                    'permissionForNotActivated': true
                }
            },
            'email': {
                'PUT': {
                    'users': ['woe', 'jufi', 'pfadi', 'rover', 'leader', 'parent', 'admin'],
                    'permissionLevel': permissionLevel.ONLY_SELF,
                    'permissionForDisabled': true,
                    'permissionForNotActivated': true
                }
            }
        },
        'admin': {
            'accounts': {
                'user': {
                    'GET': {'users': ['admin']},
                    'DELETE': {'users': ['admin']}
                },
                'user/:id': {
                    'GET': {'users': ['admin', 'leader']},
                    'DELETE': {'users': ['admin']}
                },
                'notActivated': {
                    'GET': {'users': ['admin', 'leader']},
                    'PUT': {'users': ['admin', 'leader']}
                },
                'disabled': {
                    'GET': {'users': ['admin', 'leader']},
                    'PUT': {'users': ['admin', 'leader']}
                },
                'inactive': {
                    'GET': {'users': ['admin']}
                }

            }
        },
        'chat': {
            '/:id': {
                'GET': {
                    'users': ['woe', 'jufi', 'pfadi', 'rover', 'leader', 'parent', 'admin'],
                    'permissionLevel': permissionLevel.OWN_GROUP_AND_LEADER,
                    'permissionForDisabled': false,
                    'permissionForNotActivated': false
                }
            },
            '/message': {
                '/:id': {
                    'GET': {
                        'users': ['woe', 'jufi', 'pfadi', 'rover', 'leader', 'parent', 'admin'],
                        'permissionLevel': permissionLevel.OWN_GROUP_AND_LEADER,
                        'permissionForDisabled': false,
                        'permissionForNotActivated': false
                    }
                },
                'POST': {
                    'users': ['woe', 'jufi', 'pfadi', 'rover', 'leader', 'parent', 'admin'],
                    'permissionLevel': permissionLevel.OWN_GROUP_AND_LEADER,
                    'permissionForDisabled': false,
                    'permissionForNotActivated': false
                }
            },
            'GET': {
                'users': ['woe', 'jufi', 'pfadi', 'rover', 'leader', 'parent', 'admin'],
                'permissionLevel': permissionLevel.OWN_GROUP_AND_LEADER,
                'permissionForDisabled': false,
                'permissionForNotActivated': false
            }, 'POST': {
                'users': ['woe', 'jufi', 'pfadi', 'rover', 'leader', 'parent', 'admin'],
                'permissionLevel': permissionLevel.OWN_GROUP_AND_LEADER,
                'permissionForDisabled': false,
                'permissionForNotActivated': false
            }, 'DELETE': {
                'users': ['woe', 'jufi', 'pfadi', 'rover', 'leader', 'parent', 'admin'],
                'permissionLevel': permissionLevel.OWN_GROUP_AND_LEADER,
                'permissionForDisabled': false,
                'permissionForNotActivated': false
            }
        },
        'calendar': {
            'DELETE': { // todo modify users
                'users': ['woe', 'jufi', 'pfadi', 'rover', 'leader', 'parent', 'admin'],
                'permissionLevel': permissionLevel.ONLY_OWN_GROUP,
                'permissionForDisabled': true,
                'permissionForNotActivated': false
            },
            'GET': {
                'users': ['woe', 'jufi', 'pfadi', 'rover', 'leader', 'parent', 'admin'],
                'permissionLevel': permissionLevel.ONLY_OWN_GROUP,
                'permissionForDisabled': true,
                'permissionForNotActivated': false
            },
            'POST': {
                'users': ['woe', 'jufi', 'pfadi', 'rover', 'leader', 'parent', 'admin'],
                'permissionLevel': permissionLevel.ONLY_OWN_GROUP,
                'permissionForDisabled': true,
                'permissionForNotActivated': false
            },
            'PUT': {
                'users': ['woe', 'jufi', 'pfadi', 'rover', 'leader', 'parent', 'admin'],
                'permissionLevel': permissionLevel.ONLY_OWN_GROUP,
                'permissionForDisabled': true,
                'permissionForNotActivated': false
            },
        },
        'group': {
            'GET': {
                'users': ['admin'],
                'permissionLevel': permissionLevel.ONLY_OWN_GROUP,
                'permissionForDisabled': false,
                'permissionForNotActivated': false
            },
            'POST': {
                'users': ['admin'],
                'permissionLevel': permissionLevel.ONLY_OWN_GROUP,
                'permissionForDisabled': false,
                'permissionForNotActivated': false
            },
            'PUT': {
                'users': ['admin'],
                'permissionLevel': permissionLevel.ONLY_OWN_GROUP,
                'permissionForDisabled': false,
                'permissionForNotActivated': false
            },
            'DELETE': {
                'users': ['admin'],
                'permissionLevel': permissionLevel.ONLY_OWN_GROUP,
                'permissionForDisabled': false,
                'permissionForNotActivated': false
            },
            'lesson': {
                'GET': {
                    'users': ['admin'],
                    'permissionLevel': permissionLevel.ONLY_OWN_GROUP,
                    'permissionForDisabled': false,
                    'permissionForNotActivated': false
                },
                'POST': {
                    'users': ['admin'],
                    'permissionLevel': permissionLevel.ONLY_OWN_GROUP,
                    'permissionForDisabled': false,
                    'permissionForNotActivated': false
                },
                'PUT': {
                    'users': ['admin'],
                    'permissionLevel': permissionLevel.ONLY_OWN_GROUP,
                    'permissionForDisabled': false,
                    'permissionForNotActivated': false
                }
            }
        },
    }
};

module.exports = {
    Config: Config
};
