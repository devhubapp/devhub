import OAuthManager from 'react-native-oauth';

const config = {
  github: {
    client_id: 'ad3a22fdaf40e63a130d',
    client_secret: '0b46f5587706bac4bbf9a996aab7e9cb5125e009',
    redirect_uri: 'http://localhost/github',
  },
};

const manager = new OAuthManager('devhub');
manager.configure(config);

export default manager;
