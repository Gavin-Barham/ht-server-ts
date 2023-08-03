import express, { Express } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import home from './API/Routers/homeRouter.js';
import { DBConnection } from './Database/config.js';
import { authn } from './API/Routers/authn.js';

const App: Express = express();
const PORT: number | string = process.env.PORT || 3030;

App.use(cors());
App.use(bodyParser.json());
App.use(bodyParser.urlencoded({ extended: true }));
App.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	res.header(
		'Access-Control-Allow-Headers',
		'Content-Type, Authorization, Cookie',
	);
	res.header('Access-Control-Allow-Credentials', 'true');
	next();
});
App.use(cookieParser());

(async () => {
	try {
		await DBConnection.sync({ force: true });
		console.log('Connection has been established successfully.');
	} catch (error) {
		console.error('Unable to connect to the database:', error);
	}
})();

App.use('/', home);
App.use('/authn', authn);

App.listen(PORT, () => {
	console.log(
		`listening on port: ${PORT}\n    live at: (http://localhost:${PORT})`,
	);
});
