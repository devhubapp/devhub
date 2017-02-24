import Bugsnag from 'bugsnag-js';

export default apiKey => {
  Bugsnag.apiKey = apiKey;
  return Bugsnag;
};
