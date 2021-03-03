const filter = require('../../src/middlewares/basicAuthByClientIdFilter').default;

test('should accept request if correct client credentials are provided', async () => {
    const req = {
        params: {
            clientId: "8915c640-d9f7-4236-adea-764393b2dcfd"
        }
    }
    const res = {};
    const next = _ => _;
    const clientRepositoryMock = {
        findClientById: () => {
            return {
                basicAuthUser: 'clientUser',
                basicAuthPassword: 'clientPassword'
            }
        }
    }
    let givenOptions;
    const basicAuthMock = (options) => {
        givenOptions = options;
        return _ => _;
    };

    await filter(req, res, next, clientRepositoryMock, basicAuthMock);

    expect(givenOptions).toEqual({
        challenge: true,
        users: {
            clientUser: "clientPassword"
        }
    });
});

test('should accept request if only admin credential are provided', async () => {
    const req = {
        params: {
            clientId: "8915c640-d9f7-4236-adea-764393b2dcfd"
        }
    }
    const res = {
        sendStatus: () => {
            throw new Error("should never call me!")
        }
    };
    const next = _ => _;
    const clientRepositoryMock = {
        findClientById: () => {
            return {}
        }
    }
    let givenOptions;
    const basicAuthMock = (options) => {
        givenOptions = options;
        return _ => _;
    };
    const env = {
        BASIC_AUTH_USER: 'adminUser',
        BASIC_AUTH_PASSWORD: 'adminPassword'
    }

    await filter(req, res, next, clientRepositoryMock, basicAuthMock, env);

    expect(givenOptions).toEqual({
        challenge: true,
        users: {
            adminUser: "adminPassword"
        }
    });
});

test('should include client and admin credentials', async () => {

    const req = {
        params: {
            clientId: "8915c640-d9f7-4236-adea-764393b2dcfd"
        }
    }
    const res = {
        sendStatus: () => {
            throw new Error("should never call me!")
        }
    };
    const next = _ => _;
    const clientRepositoryMock = {
        findClientById: () => {
            return {
                basicAuthUser: 'clientUser',
                basicAuthPassword: 'clientPassword'
            }
        }
    }
    let givenOptions;
    const basicAuthMock = (options) => {
        givenOptions = options;
        return _ => _;
    };
    const env = {
        BASIC_AUTH_USER: 'adminUser',
        BASIC_AUTH_PASSWORD: 'adminPassword'
    }

    await filter(req, res, next, clientRepositoryMock, basicAuthMock, env);

    expect(givenOptions).toEqual({
        challenge: true,
        users: {
            adminUser: "adminPassword",
            clientUser: "clientPassword"
        }
    });
});

test("test", () => {
    console.log(JSON.stringify("value", null, 2));
})
