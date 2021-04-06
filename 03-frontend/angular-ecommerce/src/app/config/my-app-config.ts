export default {
//re defining the interface myconfig
    oidc: {
        clientId : '0oa7s7kf8QbEih3Me5d6',//client id from okta
        //issuer : 'dev-29419820.okta.com',//client domain from okta
        issuer : 'https://dev-29419820.okta.com/oauth2/default',
        redirectUri : 'http://localhost:4200/login/callback',
        scopes : ['openid', 'profile', 'email']
    }
}
