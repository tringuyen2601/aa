import { environment } from '../environments/environment';

class Endpoints {

    // Toggle this setting to determine which 
    // API endpoints are used
    private devMode = true; // enable to work in development mode
    private Dspace = false; // enable to deploy in BICS D
    private Qspace = false;
    
    private devEndpoints = 
    {   
        companies: 'https://account-management-q.apps.de1.bosch-iot-cloud.com/companies',
        authentication: 'https://authentication-q.apps.de1.bosch-iot-cloud.com/auth',
        redirectUri: 'http://localhost:4200/auth',
        loginUrl: 'https://auth.bosch-iot-suite.com/auth/realms/thingbook/protocol/openid-connect/auth?client_id=thingbook&scope=openid%20offline_access&response_type=code&redirect_uri=http://localhost:4200/auth',
        logoutUrl: 'https://auth.bosch-iot-suite.com/auth/realms/thingbook/protocol/openid-connect/logout?redirect_uri=http://localhost:4200/auth',
        rating:'https://rating-q.apps.de1.bosch-iot-cloud.com/ratings',
        producttaxonomy:'https://product-taxonomy-q.apps.de1.bosch-iot-cloud.com/taxonomy'
    };

    private DliveEndpoints =
    {
        companies: 'https://account-management-d.apps.de1.bosch-iot-cloud.com/companies',
        authentication: 'https://authentication-d.apps.de1.bosch-iot-cloud.com/auth',
        redirectUri: 'https://admin-web-d.apps.de1.bosch-iot-cloud.com/auth',
        loginUrl: 'https://auth.bosch-iot-suite.com/auth/realms/thingbook/protocol/openid-connect/auth?client_id=thingbook&scope=openid%20offline_access&response_type=code&redirect_uri=https://admin-web-d.apps.de1.bosch-iot-cloud.com/auth',
        logoutUrl: 'https://auth.bosch-iot-suite.com/auth/realms/thingbook/protocol/openid-connect/logout?redirect_uri=https://admin-web-d.apps.de1.bosch-iot-cloud.com/auth',
        rating:'https://rating-d.apps.de1.bosch-iot-cloud.com/ratings',
        producttaxonomy:'https://product-taxonomy-d.apps.de1.bosch-iot-cloud.com/taxonomy'
    };
    
    private QliveEndpoints =
    {
        companies: 'https://account-management-q.apps.de1.bosch-iot-cloud.com/companies',
        authentication: 'https://authentication-q.apps.de1.bosch-iot-cloud.com/auth',
        redirectUri: 'https://admin-web-q.apps.de1.bosch-iot-cloud.com/auth',
        loginUrl: 'https://auth.bosch-iot-suite.com/auth/realms/thingbook/protocol/openid-connect/auth?client_id=thingbook&scope=openid%20offline_access&response_type=code&redirect_uri=https://admin-web-q.apps.de1.bosch-iot-cloud.com/auth',
        logoutUrl: 'https://auth.bosch-iot-suite.com/auth/realms/thingbook/protocol/openid-connect/logout?redirect_uri=https://admin-web-q.apps.de1.bosch-iot-cloud.com/auth',
        rating:'https://rating-q.apps.de1.bosch-iot-cloud.com/ratings',
        producttaxonomy:'https://product-taxonomy-q.apps.de1.bosch-iot-cloud.com/taxonomy'
    };

    // Determine which endpoints are returned devMode setting
    private getEndpoints() {
        if (this.devMode === true) {
            return this.devEndpoints;
        }
        if (this.Qspace === true) {
            return this.QliveEndpoints;
        }
        if(this.Dspace===true)
        {
            return this.DliveEndpoints;
        }
    }

    public companyEndpoint() {
        return this.getEndpoints().companies;
    }

    public authenticationEndpoint() {
        return this.getEndpoints().authentication;
    }

    public redirectUriEndpoint() {
        return this.getEndpoints().redirectUri;
    }

    public loginUrlEndpoint() {
        return this.getEndpoints().loginUrl;
    }

    public logoutUrlEndpoint() {
        return this.getEndpoints().logoutUrl;
    }
    public workflowApproverRatingEndpoint() {
        return this.getEndpoints().rating;
    }
    public workflowApproverProductTaxonomyEndpoint() {
        return this.getEndpoints().producttaxonomy;
    }
}

export default new Endpoints();