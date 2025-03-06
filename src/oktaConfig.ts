const oktaConfig = {
    issuer: 'https://lhava.okta.com/oauth2',
    clientId: '0oa1ukln76jvFnS3e1d8',
    redirectUri: 'http://13.114.185.3/login/callback',  // Changed to "/"
    scopes: ['openid', 'profile', 'email'],
    pkce: false
};

export default oktaConfig;
