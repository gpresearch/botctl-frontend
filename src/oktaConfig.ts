const oktaConfig = {
    issuer: 'https://lhava.okta.com/oauth2',
    clientId: '0oa1ukln76jvFnS3e1d8',
    redirectUri: window.location.origin,  // Changed to "/"
    scopes: ['openid', 'profile', 'email'],
    pkce: false
};

export default oktaConfig;
