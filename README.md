# LendSQR Backend Test

Demo Credit is a mobile lending app that requires wallet functionality. This is needed as borrowers need a wallet to receive the loans they have been granted and also send the money for repayments.

- authentication via [JWT](https://jwt.io/)
- database is [MySQL](https://www.mysql.com/)
- application environments are `development`, `testing`, and `production`
- linting via [eslint](https://github.com/eslint/eslint) and [prettier](https://prettier.io/)
- integration tests running with [Jest](https://github.com/facebook/jest)
- built with [node scripts](#npm-scripts)

## Table of Contents

- [Install & Start](#install-and-start)
- [Folder Structure](#folder-structure)
- [Controllers](#controllers)
  - [Create a controller](#create-a-controller)
- [Models](#models)
  - [Create a model](#create-a-model)
- [Policies](#policies)
  - [auth.policy](#authpolicy)
- [Services](#services)
- [Config](#config)
  - [connection and database](#connection-and-database)
- [Routes](#routes)
  - [Create routes](#create-routes)
- [pnpm scripts](#npm-scripts)

## Install and Start

#### clone

```sh
# Start by cloning this repository

# Clone with HTTPS
$ git clone https://github.com/Iniyealakeret2/emmanuel-orunimighen-lendsqr-be-test.git

# Clone with SSH
$ git clone git@github.com:Iniyealakeret2/emmanuel-orunimighen-lendsqr-be-test.git
```

#### install

```sh
# Start the app by installing all dependencies

# cd into project root run the this command to install all dependencies
$ pnpm install

# start the development build
$ pnpm run dev

# start the staging build
$ pnpm run staging

# start the production build
$ pnpm run start
```

## Folder Structure

This project has 11 main directories:

- config - for database, errors and environment variables.
- controllers - for api controllers.
- helpers - this is the directory for all helper methods you can as well call it your `utils` folder
- models - this is the directory for all database [models](https://knexjs.org/guide/schema-builder.html#createtable)
- policies - this directory handles all api based policies example of this is the authentication and authorization policy.
- routes - this directory handles all api [routes](https://expressjs.com/en/guide/routing.html)
- services - this is the directory for all api based services example of this is an email, auth services etc.
- validations - this is the directory for all api request [validations](https://github.com/arb/celebrate)
- scripts - this is the directory for all app based scripting example is scripts for populating development database with enough fake data for testing
- email-templates - this is the directory for all app email templates

## Controllers

### Create a Controller

Controllers in this project have a naming convention: `model_name.controller.ts` and uses class based pattern.
To use a model inside of your controller you have to import it.

Example Controller for user `signin` and `signup` operation:

```ts
import _ from "lodash";
// import axios from "axios";
import httpStatus from "http-status";
import { Request, Response, NextFunction } from "express";

import { UserType } from "@typings/user";
import APIError from "../helpers/api.errors";
import { UserModel } from "@app/model/user.model";
import { sendResponse } from "../helpers/send_response";
import { AuthControllerInterface } from "../../typings/auth";
import { ExpressResponseInterface } from "../../typings/helpers";
import { SessionModel } from "@app/model/session.model";
import { WalletModel } from "@app/model/wallet.model";
import { generateWalletNumber } from "@app/helpers/generate_wallet_number";
import { checkKarmaList } from "@app/helpers/check_karma_list";
// import AdjudicatorService from "@app/services/Adjudicator.service";

/**
 *
 * @class
 * @extends AuthControllerInterface
 * @classdesc Class representing the authentication controller
 * @description App authentication controller
 * @name AuthController
 *
 */
export default class AuthController extends AuthControllerInterface {
  /**
   * Route: POST: /auth/signup
   * @async
   * @method signup
   * @description signup user account
   * @param {Request} req - HTTP Request object
   * @param {Response} res - HTTP Response object
   * @param {NextFunction} next - HTTP NextFunction object
   * @returns {ExpressResponseInterface} {ExpressResponseInterface}
   * @memberof AuthController
   */

  public static async signup(
    req: Request,
    res: Response,
    next: NextFunction
  ): ExpressResponseInterface {
    try {
      const payload: UserType = req.body;

      const result = await checkKarmaList(payload.email);

      if (result?.message !== "Identity not found in karma") {
        return res.status(httpStatus.BAD_REQUEST).json(
          sendResponse({
            status: httpStatus.BAD_REQUEST,
            message: "You are defaulting in one of your loans",
          })
        );
      }

      const user = await UserModel.create(payload);

      return res
        .status(httpStatus.CREATED)
        .json(sendResponse({ message: "success", payload: user, status: httpStatus.CREATED }));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Route: POST: /auth/signin
   * @async
   * @method signin
   * @description signin to user account
   * @param {Request} req - HTTP Request object
   * @param {Response} res - HTTP Response object
   * @param {NextFunction} next - HTTP NextFunction object
   * @returns {ExpressResponseInterface} {ExpressResponseInterface}
   * @memberof AuthController
   */

  public static async signin(
    req: Request,
    res: Response,
    next: NextFunction
  ): ExpressResponseInterface {
    try {
      const { email, password }: UserType = req.body;

      const user = await UserModel.findOne({ email, is_verified: true });

      if (!user) {
        throw new APIError({
          status: httpStatus.BAD_REQUEST,
          message: "Invalid email or password",
        });
      }

      const isCorrect = await UserModel.validatePassword(password, user.password);

      if (!isCorrect) {
        throw new APIError({
          status: httpStatus.BAD_REQUEST,
          message: "Invalid, email or password",
        });
      }

      const session = await UserModel.getSession({ id: user.id, email: user.email });

      await SessionModel.findOneAndUpdate(
        { user_id: user.id },
        { ..._.pick(session, ["refresh_token", "access_token"]) }
      );

      return res
        .status(httpStatus.OK)
        .json(sendResponse({ status: httpStatus.OK, payload: session, message: "successful" }));
    } catch (error) {
      next(error);
    }
  }

```

## Models

Models in this project have a naming convention: `model_name.model.ts` and uses [Knex Query Builders](https://knexjs.org/guide/schema-builder.html#createtable) to define our Models.

Example user model:

### Create typings for the user Model

```ts
import { JwtPayload } from "jsonwebtoken";

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}

export type UserType = {
  id: string;
  role: Role;
  email: string;
  password: string;
  last_name: string;
  first_name: string;
  account_pin?: number;
  is_verified?: boolean;
};

export type UserSessionType = {
  access_token: string;
  /**
   * A timestamp of when the token was issued. Returned when a login is confirmed.
   */
  issued_at: number;
  /**
   * The number of seconds until the token expires (since it was issued). Returned when a login is confirmed.
   */
  expires_in: number;
  /**
   * A timestamp of when the token will expire. Returned when a login is confirmed.
   */
  expires_at: string;
  refresh_token: string;
  user: Partial<UserType> | null;
};

export interface UserTokenType extends Omit<JwtPayload, "aud">, UserType {
  aud: string;
}
```

### Create user Model

```ts
  public static async create(payload: UserType): Promise<Omit<UserType, "password"> | null> {
    const user_id = uuidv4();
    const userPayload = { ...payload, id: user_id };
    const updatedPayload = await this.preSaveHook(userPayload);
    const otp = config.IS_PRODUCTION_OR_STAGING ? generateOTP() : config.DEFAULT_OTP_CODE;

    await database("users").insert(updatedPayload);
    await database("sessions").insert({ user_id, otp });

    EmailService.sendMail({
      to: payload.email,
      subject: "Verify your account",
      html: EmailTemplate.signupMessageTemplate({ otp: otp }),
    });
    const data = _.omit(updatedPayload, "password");

    return { ...data, id: user_id.toString() };
  }

  public static async findOne(payload: params): Promise<UserType | null> {
    const user = await database("users")
      .where({ id: payload.id || "" })
      .orWhere({ email: payload.email || "" })
      .first()
      .select<UserType>();

    return user;
  }

  public static async findOneAndUpdate(
    param: params,
    payload: Partial<UserType>
  ): Promise<UserType | null> {
    const updatedPayload = await this.preFindOneAndUpdateHook(payload as UserType);

    const user = await database("users")
      .where({ id: param.id })
      .orWhere({ email: param.email || "" })
      .update(updatedPayload)
      .select<UserType>("*");

    return user || null;
  }
```

## Policies

Policies are middleware functions that can run before hitting a specific or more specified route(s).

Example policy:

> Note: This Middleware only allows the user to the next route if the user is authorized.

## auth.policy

The `auth.policy` checks wether a `JSON Web Token` ([further information](https://jwt.io/)) is send in the header of an request as `Authorization: Bearer [JSON Web Token]` or inside of the body of an request as `token: [JSON Web Token]`.
The policy runs default on all api routes that are are `private`.

```ts
import httpStatus from "http-status";
import { TokenExpiredError } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

import { SessionType } from "../../typings/session";
import authService from "../services/auth.service";
import { useSession } from "../helpers/use_session";
import { sendResponse } from "../helpers/send_response";
import { AuthPolicyInterface } from "../../typings/policies";
import { ExpressResponseInterface } from "../../typings/helpers";
import { UserModel } from "@app/model/user.model";
import { SessionModel } from "@app/model/session.model";

/**
 *
 * @class
 * @extends AuthPolicyInterface
 * @classdesc Authenticate users, admins and super admins middleware
 * @description App authentication policy controller
 * @name AuthController
 *
 */

export default class AuthPolicy extends AuthPolicyInterface {
  /**
   * Function representing the Authorization check for authenticated users
   * @method hasAccessToken
   * @description Authenticate users, admins and super admins middleware who has valid access_token
   * @param {Request} req - HTTP Request object
   * @param {Response} res - HTTP Response object
   * @param {NextFunction} next - HTTP NextFunction function
   * @returns {ExpressResponseInterface} {ExpressResponseInterface} Returns the Response object containing token field with the verified token assigned to the user
   * @memberof AuthPolicyInterface
   */

  static async hasAccessToken(
    req: Request,
    res: Response,
    next?: NextFunction
  ): ExpressResponseInterface {
    const access_token = req?.header("Authorization");

    const [bearer, signature] = access_token?.split(" ") || [];

    if (signature && bearer === "Bearer") {
      try {
        const token = await authService.verifyAccessToken(signature);

        // Update the model once done

        // @ts-ignore
        const user = await UserModel.findOne({ id: token?.aud, email: token?.email });
        if (!user) {
          Error("Invalid Token");
        }

        const session = await SessionModel.findOneById({ user_id: user?.id });

        if (!session) {
          Error("Invalid Token");
        }

        console.log("session from session", session);

        const { setSession } = useSession();
        setSession({ ...token, ...user, ...session });

        return next?.();
      } catch (error) {
        const message = `${error instanceof TokenExpiredError ? "Expired" : "Invalid"} token`;
        return res
          .status(httpStatus.UNAUTHORIZED)
          .json(sendResponse({ message, status: httpStatus.UNAUTHORIZED }));
      }
    }

    return res
      .status(httpStatus.UNAUTHORIZED)
      .json(sendResponse({ message: "No Token found", status: httpStatus.UNAUTHORIZED }));
  }

  /**
   * Function representing the Authorization token refresher for unauthorized users
   * @method hasRefreshToken
   * @description Refresh users access_token middleware
   * @param {Request} req - HTTP Request object
   * @param {Response} res - HTTP Response object
   * @param {NextFunction} next - HTTP NextFunction function
   * @returns {ExpressResponseInterface} {ExpressResponseInterface} Returns the Response object containing token field with the refreshed token assigned to the user
   * @memberof AuthPolicyInterface
   */
  static async hasRefreshToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): ExpressResponseInterface {
    const { refresh_token }: Pick<SessionType, "refresh_token"> = req.body;

    try {
      const token = await authService.verifyRefreshToken(refresh_token!!);

      // @ts-ignore
      const user = await UserModel.findOne({ id: token?.aud, email: token?.email });

      if (!user) {
        Error("Invalid Token");
      }

      const session = await SessionModel.findOneById({ user_id: user?.id });

      if (!session) {
        Error("Invalid Token");
      }

      if (refresh_token !== session?.refresh_token) {
        throw new Error("Invalid Token");
      }

      const { setSession } = useSession();
      setSession({ ...token, ...session, ...user });

      return next();
    } catch (error) {
      const message = `${error instanceof TokenExpiredError ? "Expired" : "Invalid"} token`;
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json(sendResponse({ message, status: httpStatus.UNAUTHORIZED }));
    }
  }
}
```

To use this policy on all routes that only authorized users are allowed:

index.ts file inside the route folder

```ts
import { Router } from "express";
import accountRoute from "./account.routes";
import AuthPolicy from "../policies/auth.policy";

const router = Router();

/**
 * Check user access_token and authenticate user to perform HTTP requests
 * @description Validate the request, check if user is signed in and is authorized to perform this request
 */

router.use(AuthPolicy.hasAccessToken);

// mount user accounts routes
router.use("/accounts", accountRoute);

export default router;
```

## Services

Services are little useful snippets, or calls to another API that are not the main focus of your API.

Example service:

encrypting and decrypting user password on signup and signin:

```ts
import bcrypt from "bcryptjs";
import config from "../config";
import { BcryptServiceInterface } from "../../typings/services";

/**
 *
 * @class BcryptService
 * @extends BcryptServiceInterface
 * @classdesc Class representing user password encryption and decryption service
 * @description User password encryption and decryption service class
 * @name ErrorService
 * @exports BcryptServiceInterface
 */

export default class BcryptService extends BcryptServiceInterface {
  /**
   * @method hashPassword
   * @param {string} password - user registration password
   * @returns {Promise<string>} Returns the signed encrypted user password
   */
  public static hashPassword = async (password: string): Promise<string> => {
    const salt = bcrypt.genSaltSync(Number(config.BCRYPT_ROUND));
    return bcrypt.hash(password, salt);
  };

  /**
   * @method comparePassword
   * @param {string} password - user registered password
   * @param {string} hash - user encrypted registration password
   * @returns {boolean} Returns boolean if the both the registration password and encrypted password matches after decrypting it
   */
  public static comparePassword = (password: string, hash: string): boolean => {
    return bcrypt.compareSync(password, hash);
  };
}
```

## Config

Holds all the server configurations.

### Connection and Database

> Note: make sure your MySQL connection details are added to the .env file.

To start the DB, add the credentials for your work environment `production | development | testing`. on a `.env` file.

```ts
import path from "path";
import type { Knex } from "knex";

import config from "./src/config";

const knexConfig: { [key: string]: Knex.Config } = {
  development: {
    client: "mysql2",
    connection: {
      host: config.DB_HOST,
      user: config.DB_USER,
      password: config.DB_PASSWORD,
      database: config.DATABASE_NAME,
    },
    migrations: {
      directory: path.resolve(__dirname, "./database/migrations"),
    },
    seeds: {
      directory: path.resolve(__dirname, "./database/seeds"),
    },
  },

  production: {
    client: "mysql",
    connection: {
      host: config.DB_HOST,
      user: config.DB_USER,
      password: config.DB_PASSWORD,
      database: config.DB_NAME,
    },
    migrations: {
      directory: path.resolve(__dirname, "./database/migrations"),
    },
    seeds: {
      directory: path.resolve(__dirname, "./database/seeds"),
    },
  },
};

export default knexConfig;

import knex from "knex";

import config from "@app/config";
import knexConfig from "../../knexfile";

const environment = config.NODE_ENV;
const database = knex(knexConfig[environment]);

database
  .raw("select 1")
  .then(() => {
    console.info(`successfully connected to  ${config.DATABASE_NAME}`);
  })
  .catch((error: any) => {
    console.error("Error connecting to database:", error);
  });

export default database;
```

## Routes

Here you define all your routes for your api. It doesn't matter how you structure them. By default they are mapped on `authenticated routes` and `non-authenticated routes`. You can define as much routes files as you want e.g. for every model or for specific use cases, e.g. normal user and admins.

### Create Routes

For further information read the [docs](https://expressjs.com/en/guide/routing.html) of express routing.

Example for authentication routes when users signin or signup:

> Note: The only supported Methods are **POST**, **GET**, **PUT**, and **DELETE**.

```ts
// auth.route.ts

/* ************************************************************************************** *
 * ******************************                    ************************************ *
 * ******************************   APP AUTH ROUTES  ************************************ *
 * ******************************                    ************************************ *
 * ************************************************************************************** */

import { Router } from "express";
import { celebrate as validate } from "celebrate";
import AuthController from "../controllers/auth.controller";
import AuthValidation from "../validations/auth.validation";

const router = Router();

router
  .route("/signin")
  .post([validate(AuthValidation.signinUser, { abortEarly: false })], AuthController.signin);

export default router;
```

To use these routes in the application, require them in the router index.ts and export the base router.

```ts
/**************************************************************************************** *
 * ******************************                    ************************************ *
 * ******************************   ALL APP ROUTES   ************************************ *
 * ******************************                    ************************************ *
 * ************************************************************************************** */

import { Request, Response, Router } from "express";

import authRoute from "./auth.routes";

const router = Router();

/** GET /health-check - Check service health */
router.get("/health-check", (_req: Request, res: Response) =>
  res.send({ check: "lendsqr server started ok*-*" })
);

// mount auth routes
router.use("/auth", authRoute);

export default router;
```

```ts
// index.ts

import cors from "cors";
import logger from "morgan";
import helmet from "helmet";
import express from "express";
import compress from "compression";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import expressFormData from "express-form-data";

import routes from "./routes";
import * as database from "./config/database";
import ErrorService from "./services/error.service";
import EmailService from "./services/email.service";
import SocketService from "./services/socket.service";
import config, { unCompressedImageDir } from "./config";

//express application
const app = express();

const server = createServer(app);

// secure apps by setting various HTTP headers
app.use(helmet({ dnsPrefetchControl: false, frameguard: false, ieNoOpen: false }));

// compress request data for easy transport
app.use(compress());
app.use(methodOverride());

// allow cross origin requests
// configure to only allow requests from certain origins
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());

// parse body params and attach them to res.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// parse form-data params and attach them to res.files && [req.fields]
app.use(expressFormData.parse({ uploadDir: unCompressedImageDir, autoClean: true }));

// all API versions are mounted here within the app
app.use("/api/v1", routes);

// enable detailed API logging in dev env
if (config.NODE_ENV === "development") {
  app.use(logger("dev"));
}

// if error is not an instanceOf APIError, convert it.
app.use(ErrorService.converter);

// catch 404 and forward to error handler
app.use(ErrorService.notFound);

// error handler, send stacktrace only during development
app.use(ErrorService.handler);

// opens a port if the NODE_ENV environment is not test
if (config.NODE_ENV !== "test") {
  server.listen(config.PORT, () =>
    console.info(
      `local server started on port http://localhost:${config.PORT} (${config.NODE_ENV})`
    )
  );
}

export default app;
```

## Test

All test for this project uses [Jest](https://github.com/facebook/jest) and [supertest](https://github.com/visionmedia/superagent) for integration testing. So read their docs on further information.

### setup

```ts
// jest.config.js

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  modulePaths: ["<rootDir>"],
  testPathIgnorePatterns: ["/node_modules/"],
  moduleDirectories: ["node_modules", "src"],
  moduleFileExtensions: ["js", "json", "ts", "node"],
  transformIgnorePatterns: ["/node_modules/(?!(DEPENDENCY_NAME)/)"],
  globals: {
    "ts-jest": {
      isolatedModules: true,
      tsconfig: "tsconfig.json",
      allowSyntheticDefaultImports: true,
    },
  },
};
```

## LICENSE

MIT © Lendsqr
