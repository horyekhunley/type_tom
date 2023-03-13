import App from './app'
import { config } from 'dotenv'
import validateEnv from './src/utils/validateEnv'

config()
validateEnv()

const app = new App([], Number(process.env.PORT) || 3000)

app.listen()
