import { Client as Bugsnag } from 'bugsnag-react-native';

export default apiKey => new Bugsnag(apiKey);
