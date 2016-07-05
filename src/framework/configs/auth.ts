export var config = {
    baseUrl : 'https://sybilla-identityserver.azurewebsites.net/',
    tokenName : 'token',
    idTokenName : 'id_token',
    profileUrl: '/connect/userinfo',
    unlinkUrl : '/connect/endsession',
    logoutRedirect: '/',
    loginRedirect : window.location.origin || window.location.protocol + '//' + window.location.host,
    providers : {
        identSrv : {
            name: 'identSrv',
            url: '/connect/token',
            authorizationEndpoint: 'https://sybilla-identityserver.azurewebsites.net/connect/authorize',
            redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
            scope: ["openid", "profile", "email", "abotTutorApi",  "astrodriveApi"],
            responseType :'id_token token',
            scopePrefix: '',
            scopeDelimiter: ' ',
            requiredUrlParams: ['scope', 'nonce'],
            optionalUrlParams: ['display'],
            state: 'session_state',
            display: 'popup',
            type: '2.0',
            clientId: 'abotTutorWebClient',
            flow: 'implicit',
            nonce : function(){
                var val = ((Date.now() + Math.random()) * Math.random()).toString().replace(".", "");
                return encodeURIComponent(val);
            },
            popupOptions: { width: 452, height: 633 }
        }
    }
};
