import { OAuthResponseType } from "@okta/okta-auth-js";

const isLocal = window.location.hostname === "localhost";

const oktaConfig = {
    issuer: 'https://lhava.okta.com/oauth2',
    clientId: isLocal ? '0oa1v07fa8xRbg52K1d8' : '0oa1ukln76jvFnS3e1d8',
    redirectUri: window.location.origin,
    scopes: ['openid', 'profile', 'email'],
    responseType: ['token', 'id_token'] as OAuthResponseType[],
    pkce: false
};

export default oktaConfig;
