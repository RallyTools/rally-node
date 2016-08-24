import RestApi from './restapi';
import { where } from './util/query';
import ref from './util/ref';

const createClient = options => new RestApi(options);

const restapi = createClient;
restapi.createClient = createClient;
restapi.debug = process.env.NODE_DEBUG && /rally/.test(process.env.NODE_DEBUG),
restapi.util = {
  query: { where },
  ref
};

export default restapi;
