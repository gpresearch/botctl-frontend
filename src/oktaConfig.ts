const oktaConfig = {
    issuer: 'https://lhava.okta.com/oauth2', // Replace with your Okta domain
    clientId: '0oa1ukln76jvFnS3e1d8', // Replace with your client ID
    redirectUri: 'http://localhost:5173/login/callback',
    scopes: ['openid', 'profile', 'email'],
    pkce: true
}

export default oktaConfig;