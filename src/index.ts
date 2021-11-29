import apiServer from './RestServer';
import startNewWss from './wsServer';
import db from './prismaClient';
import queryErrorHanlder from './queryErrorHandler';
import logger from './logger';

const API_PORT = 8000;
const WS_PORT = 8001;

// --------- REST API SERVER ----------
apiServer?.listen(API_PORT, (): void => {
  console.log('HTTP Server is running on PORT:', API_PORT);
});

// --------- WEBSOCKET SERVER ----------
startNewWss(WS_PORT);

// DB connection test
(async () => {
  try {
    await db.$connect();
    logger.info('Connected to database successfully');
  } catch (e) {
    queryErrorHanlder(e, 'Connection test');
  }
})();
