// check if we're now in debug environment or production
export var isDebugEnvironment = false;

export var endpoints = {
    id : "mam",
    abot: {
        relay: "http://abotrelay.cloudapp.net/",
        //relay: "http://localhost:8083/",
        historicalDataAccess: "https://tenerifaabottutorwebapi.azurewebsites.net" 
    },
    // signalR: "http://abotrelay.cloudapp.net/",
    identityServer: "https://sybilla-identityserver.azurewebsites.net/",
    astroDrive: "https://astrodrive-resources.azurewebsites.net/",
    // webApi: "https://abottutorwebapi.azurewebsites.net/"
    cameras: []
};
