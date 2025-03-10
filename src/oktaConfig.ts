import {OAuthResponseType} from "@okta/okta-auth-js";

const oktaConfig = {
    issuer: 'https://lhava.okta.com/oauth2',
    clientId: '0oa1v07fa8xRbg52K1d8',
    redirectUri: window.location.origin,
    scopes: ['openid', 'profile', 'email'],
    responseType: ['token', 'id_token'] as OAuthResponseType[],
    pkce: false
};

export default oktaConfig;
