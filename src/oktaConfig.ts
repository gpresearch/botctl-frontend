import {OAuthResponseType} from "@okta/okta-auth-js";

const oktaConfig = {
    issuer: 'https://lhava.okta.com/oauth2',
    clientId: '0oa1ukln76jvFnS3e1d8',
    redirectUri: window.location.origin,
    scopes: ['openid', 'profile', 'email'],
    responseType: ['code'] as OAuthResponseType[],
    pkce: false
};

export default oktaConfig;
