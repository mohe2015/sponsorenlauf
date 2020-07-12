import { Environment, RecordSource, Store } from "relay-runtime";
import {
  RelayNetworkLayer,
  urlMiddleware,
  batchMiddleware,
  // legacyBatchMiddleware,
  loggerMiddleware,
  errorMiddleware,
  perfMiddleware,
  retryMiddleware,
  authMiddleware,
  cacheMiddleware,
  progressMiddleware,
  uploadMiddleware,
} from "react-relay-network-modern";

const __DEV__ = true; // TODO FIXME

const network = new RelayNetworkLayer(
  [
    cacheMiddleware({
      size: 100, // max 100 requests
      ttl: 900000, // 15 minutes
    }),
    urlMiddleware({
      url: (req) => Promise.resolve("http://localhost:4000/graphql"),
    }),
    //batchMiddleware({
    //  batchUrl: (requestList) => Promise.resolve('/graphql/batch'),
    //  batchTimeout: 10,
    //}),
    __DEV__ ? loggerMiddleware() : null,
    __DEV__ ? errorMiddleware() : null,
    __DEV__ ? perfMiddleware() : null,
    retryMiddleware({
      fetchTimeout: 15000,
      retryDelays: (attempt) => Math.pow(2, attempt + 4) * 100, // or simple array [3200, 6400, 12800, 25600, 51200, 102400, 204800, 409600],
      beforeRetry: ({ forceRetry, abort, delay, attempt, lastError, req }) => {
        if (attempt > 10) abort();
        // @ts-expect-error
        window.forceRelayRetry = forceRetry;
        console.log(
          "call `forceRelayRetry()` for immediately retry! Or wait " +
            delay +
            " ms."
        );
      },
      statusCodes: [500, 503, 504],
    }),
    progressMiddleware({
      onProgress: (current, total) => {
        console.log("Downloaded: " + current + " B, total: " + total + " B");
      },
    }),
    uploadMiddleware(),

    // example of the custom inline middleware
    /*(next) => async (req) => {
      req.fetchOpts.method = 'GET'; // change default POST request method to GET
      //req.fetchOpts.headers['X-Request-ID'] = uuid.v4(); // add `X-Request-ID` to request headers
      req.fetchOpts.credentials = 'same-origin'; // allow to send cookies (sending credentials to same domains)
      // req.fetchOpts.credentials = 'include'; // allow to send cookies for CORS (sending credentials to other domains)

      console.log('RelayRequest', req);

      const res = await next(req);
      console.log('RelayResponse', res);

      return res;
    },*/
  ],
  {
    noThrow: true,
  } // TODO FIXME maybe we need subscribeFn or noThrow options
);

const source = new RecordSource();
const store = new Store(source);
const environment = new Environment({ network, store });

export default environment;
