import apiServer from './RestServer';
import startNewWss from './wsServer';

const API_PORT = 8000;
const WS_PORT = 8001;

// --------- REST API SERVER ----------
apiServer?.listen(API_PORT, (): void => {
  console.log('HTTP Server is running on PORT:', API_PORT);
});

// --------- WEBSOCKET SERVER ----------
startNewWss(WS_PORT);
