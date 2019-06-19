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
    'mail':{
        'pass':'9F6$5@x4Sub%JS',
        'user':'dpsg.santa.lucia@gmail.com',
        'user_name':'⚜️DPSG Santa Lucia',
        'service':'gmail',
    },
    'salt': 'digital-scouts-santa-lucia', // hint change the salt to disable all tokens (force login)
    'DEBUG': true,// WARNING debugmode can overwrite permissions, be careful
    'PERMISSION': false, // WARNING permission can be disabled (active = true, disabled = false)
    'calender': {
        'public_event_daysPast': 10,
        'public_event_daysFuture': 183,
    },
    'user': [// warning: Removing groups can cause errors in the system
        {
            'roleName': 'woe'
        }, {
            'roleName': 'jufi'
        }, {
            'roleName': 'pfadi'
        }, {
            'roleName': 'rover'
        }, {
            'roleName': 'leader'
        }, {
            'roleName': 'parent'
        }, {// warning dont remove 'admin'
            'roleName': 'admin'
        }, {//hint weder Gruppenkind noch Leiter. Sonstige Mitarbeiter
            'roleName': 'user'
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
            'DELETE': {
                'users': ['admin'],
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
            '/:id': {
                'DELETE': {
                    'users': ['admin'],
                    'permissionLevel': permissionLevel.OWN_GROUP_AND_LEADER,
                    'permissionForDisabled': false,
                    'permissionForNotActivated': false
                }
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
                },
                '/:id': {
                    'DELETE': {
                        'users': ['admin'],
                        'permissionLevel': permissionLevel.OWN_GROUP_AND_LEADER,
                        'permissionForDisabled': false,
                        'permissionForNotActivated': false
                    }
                },
            }
        },
        'address': {
            '/:id': {
                'DELETE': {
                    'users': ['admin'],
                    'permissionLevel': permissionLevel.OWN_GROUP_AND_LEADER,
                    'permissionForDisabled': false,
                    'permissionForNotActivated': false
                }
            },
            'POST': {
                'users': ['admin'],
                'permissionLevel': permissionLevel.ONLY_OWN_GROUP,
                'permissionForDisabled': false,
                'permissionForNotActivated': false
            },
            'GET': {
                'users': ['admin'],
                'permissionLevel': permissionLevel.ONLY_OWN_GROUP,
                'permissionForDisabled': false,
                'permissionForNotActivated': false
            },

        }
    }
};

module.exports = {
    Config: Config
};
