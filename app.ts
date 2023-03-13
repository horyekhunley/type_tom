import express, { Request, Response, Application } from 'express'
import mongoose from 'mongoose'
import compression from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { config } from 'dotenv'
import Controller from './src/utils/interfaces/controller.interface'
import ErrorMiddleware from './src/middleware/error.middleware'

config()

class App {
    public express: Application
    public port: number

    constructor(controllers: Controller[], port: number) {
        this.express = express()
        this.port = port

        this.connectToDatabase()
        this.initializeMiddleware()
        this.initializeControllers(controllers)
        this.initializeErrorHandling()
    }
    private initializeMiddleware(): void {
        this.express.use(express.json())
        this.express.use(express.urlencoded({ extended: false }))
        this.express.use(compression())
        this.express.use(cors())
        this.express.use(helmet())
        this.express.use(morgan('dev'))
    }
    private initializeControllers(controllers: Controller[]): void {
        controllers.forEach((controller: Controller) => {
            this.express.use('/api', controller.router)
        })
    }
    private initializeErrorHandling(): void {
        this.express.use(ErrorMiddleware)
    }
    private connectToDatabase(): void {
        if (process.env.MONGO_URI !== undefined) {
          mongoose.connect(process.env.MONGO_URI);
        }
      }      
    public listen(): void {
        this.express.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`)
        })
    }
}

export default App