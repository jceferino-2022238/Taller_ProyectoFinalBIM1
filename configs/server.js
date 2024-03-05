'use strict'

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';
import userRoutes from '../src/users/user.routes.js'
import authRoutes from '../src/auth/auth.routes.js'
import categoryRoutes from '../src/category/category.routes.js'
class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.userPath = '/taller_proyectof_bim1/v1/users';
        this.authPath = '/taller_proyectof_bim1/v1/auth';
        this.categoryPath = '/taller_proyectof_bim1/v1/categories';
        this.middlewares();
        this.connectDB();
        this.routes();
    }

    async connectDB(){
        await dbConnection();
    }

    middlewares(){
        this.app.use(express.urlencoded({extended: false}));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(helmet());
        this.app.use(morgan('dev'));
    }

    routes(){
        this.app.use(this.userPath, userRoutes)
        this.app.use(this.authPath, authRoutes)
        this.app.use(this.categoryPath, categoryRoutes)
    }

    listen(){
        this.app.listen(this.port, ()=>{
            console.log('Server running on port', this.port)
        })
    }
}

export default Server;