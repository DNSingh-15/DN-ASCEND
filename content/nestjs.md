---
name: Nest.js
icon: 🐈
category: Backend
track: fullstack
color: #e0234e
order: 8
description: Nest.js is a progressive Node.js framework that uses TypeScript, modules and dependency injection to build structured, scalable server-side apps.
---

# Step 1: Nest.js Fundamentals

## What is NestJS
video: nestjs introduction what is nestjs
summary: NestJS is a TypeScript-first Node.js framework with modules, decorators and dependency injection built in.

NestJS is a **progressive Node.js framework** for building efficient, scalable server-side applications. It is written in **TypeScript** and gives you an opinionated structure: modules, controllers and providers. Under the hood it runs on top of **Express** by default, or **Fastify** if you want more speed.

### Why developers use it
- Clear architecture, so large teams write code the same way
- Built-in **dependency injection** makes code easy to test
- Decorators keep routing, validation and guards short and readable
- First-class support for REST, GraphQL, WebSockets and microservices

### Inspiration
The design is heavily inspired by **Angular**. If you know Angular modules, decorators and services, Nest will feel familiar on the backend.

### The three building blocks
- **Module**: groups related code (a feature box)
- **Controller**: handles incoming requests and returns responses
- **Provider** (service): holds business logic and can be injected

```ts
// main.ts - the entry point
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```

### Key Points
- NestJS is a framework on top of Node.js (Express or Fastify), not a replacement for it
- TypeScript, decorators and DI are the core ideas
- Interview tip: "Nest adds architecture. Express gives you freedom, Nest gives you structure."

## NestJS vs Express
video: nestjs vs express difference
summary: Express is a minimal library with no rules, while NestJS adds structure, DI and tooling on top of it.

**Express** is a small, unopinionated library. You decide the folder layout, how to validate data and how to share dependencies. **NestJS** makes those decisions for you with modules, decorators and a built-in dependency injection container, and it can use Express as its HTTP engine.

### Quick comparison
| | Express | NestJS |
|---|---|---|
| Type | Minimal library | Full framework |
| Language | JavaScript (TS optional) | TypeScript first |
| Structure | You design it | Modules, controllers, providers |
| Dependency injection | Manual | Built in |
| Validation | Add your own | Pipes + class-validator |
| Testing | Manual setup | `@nestjs/testing` utilities |
| Learning curve | Low | Medium |

### Same route in both
```js
// Express
const express = require('express');
const app = express();
app.get('/cats', (req, res) => res.json([{ id: 1 }]));
app.listen(3000);
```

```ts
// NestJS
@Controller('cats')
export class CatsController {
  @Get()
  findAll() {
    return [{ id: 1 }];
  }
}
```

### When to choose which
- Small script, prototype or tiny API: Express is fine
- Large app, many developers, long-lived code: NestJS pays off

### Key Points
- Nest does not replace Express. It wraps it (or Fastify) behind an adapter
- You can still use any Express middleware inside Nest
- Interview tip: mention testability and consistency as the real reasons to pick Nest

## Project Setup and CLI
video: nestjs cli getting started nest new
summary: Install the Nest CLI, scaffold a project with nest new, and generate code with nest generate.

The **Nest CLI** (`@nestjs/cli`) creates projects and generates boilerplate for you. `nest new` scaffolds a ready-to-run TypeScript app with linting, testing and build config. `nest generate` (alias `nest g`) creates modules, controllers and services in the right place and wires them up automatically.

### Create and run a project
```bash
npm i -g @nestjs/cli
nest new my-app
cd my-app
npm run start:dev   # watch mode
```

### Default structure
```text
src/
  app.controller.ts
  app.controller.spec.ts
  app.module.ts
  app.service.ts
  main.ts
test/
  app.e2e-spec.ts
nest-cli.json
```

### Useful generators
```bash
nest g module cats
nest g controller cats
nest g service cats
nest g resource users   # module + controller + service + DTOs + entity (CRUD)
```

`nest g resource` asks for a transport layer (REST API, GraphQL, microservice, WebSocket) and can generate full CRUD files.

### Common scripts
```bash
npm run start        # run once
npm run start:dev    # restart on file change
npm run build        # compile to dist/
npm run start:prod   # run compiled code
npm run test         # unit tests (Jest)
```

### Key Points
- `nest new` for a project, `nest g` for pieces
- `nest g resource` is the fastest way to scaffold a CRUD feature
- Nest projects use **Jest** for testing out of the box
- Interview tip: generators register the new class in the right module for you

## Modules
video: nestjs modules explained
summary: A module groups controllers and providers into one feature unit, and controls what it imports and exports.

A **module** is a class decorated with `@Module()`. It organizes the app into feature blocks. Every app has at least one **root module** (`AppModule`). Providers in a module are **private by default**: other modules can only use them if the module lists them in `exports`.

### The @Module options
- `providers`: services that Nest creates and injects
- `controllers`: controllers that belong to this module
- `imports`: other modules whose exported providers you need
- `exports`: providers that other modules may use

```ts
// cats.module.ts
import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService], // other modules can inject CatsService
})
export class CatsModule {}
```

```ts
// app.module.ts
@Module({
  imports: [CatsModule],
})
export class AppModule {}
```

### Global and dynamic modules
- `@Global()` makes a module's exports available everywhere without importing it
- **Dynamic modules** accept configuration, like `ConfigModule.forRoot(...)` or `TypeOrmModule.forRoot(...)`

```ts
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
```

### Key Points
- Module = feature boundary. One feature, one module
- Providers are encapsulated: use `exports` to share, `imports` to consume
- Use `@Global()` sparingly, since it hides dependencies
- Interview tip: "Cannot resolve dependency" errors usually mean a missing `exports` or `imports`

## Controllers
video: nestjs controllers routing
summary: Controllers receive HTTP requests, call services, and return responses using route decorators.

A **controller** handles incoming requests and sends back responses. You mark a class with `@Controller('path')` and its methods with `@Get()`, `@Post()`, `@Put()`, `@Patch()` or `@Delete()`. Controllers should stay thin: read input, call a service, return the result.

```ts
import {
  Body, Controller, Delete, Get, HttpCode, Param,
  ParseIntPipe, Post, Put, Query,
} from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';

@Controller('cats') // base path: /cats
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get() // GET /cats?limit=10
  findAll(@Query('limit') limit?: string) {
    return this.catsService.findAll(Number(limit) || 10);
  }

  @Get(':id') // GET /cats/5
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.catsService.findOne(id);
  }

  @Post() // POST /cats
  @HttpCode(201)
  create(@Body() dto: CreateCatDto) {
    return this.catsService.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateCatDto) {
    return this.catsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.catsService.remove(id);
  }
}
```

### Useful decorators
- `@Param()`, `@Query()`, `@Body()`, `@Headers()` read request data
- `@HttpCode(204)` sets the status code
- `@Header('Cache-Control', 'none')` sets a response header
- `@Redirect('https://nestjs.com', 301)` redirects

### Return values
Return an object or array and Nest sends it as JSON. Return a Promise and Nest awaits it. Avoid `@Res()` unless you truly need the raw response, because it disables Nest's automatic response handling.

### Key Points
- Controllers map routes to handlers. Logic belongs in services
- Route order matters: define static routes (`/cats/featured`) before dynamic ones (`/cats/:id`)
- Default status is 200, but `POST` returns 201
- Interview tip: using `@Res()` bypasses interceptors that change the response

## Providers and Dependency Injection
video: nestjs dependency injection providers
summary: Providers are injectable classes; Nest's DI container creates them and passes them into constructors.

A **provider** is any class that Nest can inject, most often a **service**. You mark it with `@Injectable()` and list it in a module's `providers`. Nest's **IoC container** builds the object graph, so you ask for a dependency in the constructor and Nest supplies a shared instance.

```ts
import { Injectable, NotFoundException } from '@nestjs/common';

export interface Cat { id: number; name: string }

@Injectable()
export class CatsService {
  private cats: Cat[] = [];

  findAll() {
    return this.cats;
  }

  findOne(id: number) {
    const cat = this.cats.find((c) => c.id === id);
    if (!cat) throw new NotFoundException(`Cat ${id} not found`);
    return cat;
  }

  create(data: Omit<Cat, 'id'>) {
    const cat = { id: this.cats.length + 1, ...data };
    this.cats.push(cat);
    return cat;
  }
}
```

### Constructor injection
```ts
constructor(private readonly catsService: CatsService) {}
```
Nest reads the type `CatsService` (via TypeScript metadata) and injects the instance. No `new` needed.

### Custom providers
```ts
@Module({
  providers: [
    { provide: 'API_URL', useValue: 'https://api.example.com' },       // value
    { provide: CatsService, useClass: MockCatsService },                // swap class
    {
      provide: 'CONNECTION',
      useFactory: (config: ConfigService) => createConn(config.get('DB_URL')),
      inject: [ConfigService],                                           // factory
    },
  ],
})
export class AppModule {}
```

Inject a token-based provider with `@Inject('API_URL') private url: string`.

### Scopes
- **DEFAULT**: one singleton instance for the whole app (best performance)
- **REQUEST**: new instance per request
- **TRANSIENT**: new instance for each consumer

```ts
@Injectable({ scope: Scope.REQUEST })
export class RequestService {}
```

### Key Points
- Providers are **singletons** by default
- `useValue`, `useClass`, `useFactory` and `useExisting` are the four custom provider forms
- Request scope bubbles up and can slow the app, so use it only when needed
- Interview tip: DI makes testing easy because you can swap a real service for a mock

# Step 2: Request Handling

## DTOs: Params, Query and Body
video: nestjs dto param query body
summary: A DTO is a class that describes the shape of incoming data, used with @Body, @Query and @Param.

A **DTO** (Data Transfer Object) defines what data an endpoint expects. In Nest a DTO is a **class**, not an interface, because classes exist at runtime. That lets validation decorators and pipes read the shape and check real requests.

### Where data comes from
```ts
@Controller('users')
export class UsersController {
  // GET /users/42
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {}

  // GET /users?page=2&limit=20
  @Get()
  findAll(@Query() query: QueryUsersDto) {}

  // POST /users  with JSON body
  @Post()
  create(@Body() dto: CreateUserDto) {}
}
```

### A body DTO
```ts
// dto/create-user.dto.ts
export class CreateUserDto {
  name: string;
  email: string;
  age?: number;
}
```

### A query DTO
```ts
export class QueryUsersDto {
  page?: number;
  limit?: number;
  search?: string;
}
```

### Mapped types for update DTOs
`@nestjs/mapped-types` (included in `nest g resource`) builds new DTOs from old ones.

```ts
import { PartialType } from '@nestjs/mapped-types';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
// every field of CreateUserDto becomes optional
```

Other helpers: `PickType`, `OmitType`, `IntersectionType`.

### Key Points
- Use **classes** for DTOs, not interfaces (interfaces vanish at runtime)
- Query and path values arrive as **strings** unless you transform them
- `PartialType` is the standard way to write an update DTO
- Interview tip: a DTO with no validation decorators is only a type hint, nothing is enforced

## Validation with Pipes
video: nestjs validationpipe class-validator
summary: Pipes transform and validate input; ValidationPipe uses class-validator decorators on DTOs.

A **pipe** runs just before the route handler and either **transforms** the input or **validates** it (throwing an error if it is bad). Nest ships with `ValidationPipe`, `ParseIntPipe`, `ParseUUIDPipe`, `ParseBoolPipe`, `DefaultValuePipe` and more. Together with `class-validator`, they give you declarative request validation.

### Install
```bash
npm i class-validator class-transformer
```

### Decorate the DTO
```ts
import { IsEmail, IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  age?: number;
}
```

### Enable globally
```ts
// main.ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,            // strip properties without decorators
    forbidNonWhitelisted: true, // throw if extra properties are sent
    transform: true,            // convert plain objects to DTO instances and types
  }),
);
```

### What the options do
- `whitelist`: removes unknown properties from the object
- `forbidNonWhitelisted`: returns 400 instead of silently stripping them
- `transform`: turns the payload into a real DTO instance and converts types (for example `"5"` to `5` for `@Param('id') id: number`)

### Built-in parse pipes
```ts
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {}

@Get()
list(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number) {}
```
A bad value such as `/cats/abc` returns **400 Bad Request** automatically.

### Custom pipe
```ts
import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';

export class TrimPipe implements PipeTransform<string, string> {
  transform(value: string, metadata: ArgumentMetadata) {
    if (typeof value !== 'string') throw new BadRequestException('Expected a string');
    return value.trim();
  }
}
```

### Key Points
- Always enable `ValidationPipe` globally with `whitelist: true` and `transform: true`
- Pipes can be applied per parameter, per handler, per controller or globally
- Validation failures return **400** with a list of messages
- Interview tip: pipes do two jobs, **transformation** and **validation**

## Middleware
video: nestjs middleware tutorial
summary: Middleware runs before route handlers and has access to the request, response and next(), like Express.

**Middleware** is a function or class that runs **before** the route handler. It can read or change `req` and `res`, end the request, or call `next()` to continue. It is the first step in the lifecycle, and it runs before guards, so it knows nothing about which handler will run.

### Class middleware
```ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
  }
}
```

### Apply it in a module
```ts
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';

@Module({ controllers: [CatsController] })
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .exclude({ path: 'health', method: RequestMethod.GET })
      .forRoutes('cats'); // or forRoutes(CatsController)
  }
}
```

### Functional middleware
```ts
export function logger(req: Request, res: Response, next: NextFunction) {
  console.log(`Request: ${req.method} ${req.url}`);
  next();
}
// consumer.apply(logger).forRoutes('*');
```

### Global middleware
```ts
app.use(logger); // in main.ts, no dependency injection
```

### Key Points
- Class middleware supports DI. Global `app.use()` middleware does not
- Use it for logging, CORS, helmet, cookies and request IDs
- Always call `next()` or end the response, or the request will hang
- Interview tip: middleware is the same idea as Express middleware, and it runs before guards

## Guards
video: nestjs guards canactivate
summary: Guards decide whether a request may reach the handler, mostly used for authentication and roles.

A **guard** is a class that implements `CanActivate`. It returns `true` to let the request continue, or `false` (or throws) to block it. Guards run **after middleware** and **before interceptors and pipes**. Unlike middleware, a guard has the `ExecutionContext`, so it knows exactly which handler and class will run.

### A role-based guard
```ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) return true; // no roles required

    const request = context.switchToHttp().getRequest();
    return roles.includes(request.user?.role);
  }
}
```

### Custom decorator for metadata
```ts
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
```

### Using the guard
```ts
@Controller('admin')
@UseGuards(RolesGuard) // controller level
export class AdminController {
  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {}
}
```

### Global guard (with DI)
```ts
// app.module.ts
import { APP_GUARD } from '@nestjs/core';

@Module({
  providers: [{ provide: APP_GUARD, useClass: RolesGuard }],
})
export class AppModule {}
```

### Key Points
- Guards answer one question: "is this request allowed?"
- Returning `false` gives **403 Forbidden**. Throw `UnauthorizedException` for **401**
- Use `APP_GUARD` to register a global guard that still gets dependency injection
- Interview tip: authentication and authorization belong in guards, not middleware

## Interceptors
video: nestjs interceptors rxjs
summary: Interceptors wrap the handler to run logic before and after it, using RxJS to map, log or cache responses.

An **interceptor** implements `NestInterceptor` and wraps the route handler. It runs code **before** the handler, then again **after** it by working with the response stream (an RxJS **Observable**). Use it for logging, response shaping, caching, timeouts and mapping errors.

### Logging with tap
```ts
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();
    console.log('Before handler...');

    return next.handle().pipe(
      tap(() => console.log(`After handler: ${Date.now() - start}ms`)),
    );
  }
}
```

### Wrapping every response with map
```ts
import { map } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(map((data) => ({ success: true, data })));
  }
}
// { "success": true, "data": ... }
```

### Applying interceptors
```ts
@UseInterceptors(LoggingInterceptor)      // controller or handler
app.useGlobalInterceptors(new LoggingInterceptor()); // global, no DI

// global with DI:
providers: [{ provide: APP_INTERCEPTOR, useClass: ResponseInterceptor }]
```

### Timeout example
```ts
import { catchError, throwError, timeout, TimeoutError } from 'rxjs';
import { RequestTimeoutException } from '@nestjs/common';

return next.handle().pipe(
  timeout(5000),
  catchError((err) =>
    throwError(() => (err instanceof TimeoutError ? new RequestTimeoutException() : err)),
  ),
);
```

### Key Points
- `next.handle()` calls the route handler. Not calling it skips the handler (useful for caching)
- Code before `next.handle()` runs before the handler. Code in `pipe()` runs after
- Common operators: `map` (change data), `tap` (side effects), `catchError`, `timeout`
- Interview tip: interceptors run before pipes on the way in and after the handler on the way out

## Exception Filters
video: nestjs exception filters httpexception
summary: Exception filters catch thrown errors and turn them into consistent HTTP responses.

Nest has a built-in layer that catches unhandled exceptions and sends a JSON error response. When you throw an **HttpException** (or a subclass), Nest uses its status and message. Anything else becomes a **500 Internal Server Error**. An **exception filter** lets you customize that response.

### Built-in exceptions
```ts
throw new NotFoundException('Cat not found');         // 404
throw new BadRequestException('Invalid data');        // 400
throw new UnauthorizedException();                    // 401
throw new ForbiddenException();                       // 403
throw new HttpException('Custom', HttpStatus.CONFLICT); // 409
```

Default response shape:
```json
{ "statusCode": 404, "message": "Cat not found", "error": "Not Found" }
```

### A custom filter
```ts
import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
```

### Catch everything
```ts
@Catch() // no argument = catch all exceptions
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;
    response.status(status).json({ statusCode: status, message: 'Something went wrong' });
  }
}
```

### Binding a filter
```ts
@UseFilters(HttpExceptionFilter)               // handler or controller
app.useGlobalFilters(new AllExceptionsFilter()); // global
providers: [{ provide: APP_FILTER, useClass: AllExceptionsFilter }]
```

### Key Points
- Throw exceptions from services. Let filters format the response
- `@Catch(SomeError)` limits a filter to one exception type
- Unknown errors become 500 and hide details from the client by default
- Interview tip: filters are the **last** stage, they only run when something throws

## Request Lifecycle
video: nestjs request lifecycle order
summary: A request passes through middleware, guards, interceptors, pipes, the handler, then back out, with filters on errors.

Every request in Nest travels through the same ordered layers. Knowing the order is one of the most common interview questions. Think of it as an onion: the request goes in through each layer to the handler, and the response comes back out through the interceptors.

```flow
title: Nest request lifecycle
direction: right
Incoming request | HTTP
Middleware | global, then module
Guards | global, controller, route
Interceptors (before) | pre-controller logic
Pipes | transform and validate
Route handler | controller method
Interceptors (after) | map, tap response
Response | sent to client
```

If anything throws at any step, the request jumps to **exception filters**, which build the error response.

### Order summary
1. **Middleware** (global first, then module-bound)
2. **Guards** (global, controller, route)
3. **Interceptors**, before part (global, controller, route)
4. **Pipes** (global, controller, route, then route parameter)
5. **Controller** route handler (calls services)
6. **Interceptors**, after part (reverse order: route, controller, global)
7. **Exception filters** (only on error: route, controller, global)

### Who does what
| Layer | Main job |
|---|---|
| Middleware | Logging, CORS, parse cookies |
| Guard | Auth and permissions |
| Interceptor | Wrap handler, transform response, cache |
| Pipe | Validate and transform input |
| Filter | Format errors |

### Example trace
```ts
@UseGuards(AuthGuard)
@UseInterceptors(LoggingInterceptor)
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {}
```
Order: `Middleware -> AuthGuard -> LoggingInterceptor (before) -> ParseIntPipe -> findOne -> LoggingInterceptor (after)`.

### Key Points
- Memorize: **Middleware, Guards, Interceptors, Pipes, Handler, Interceptors, Filters**
- Guards run before pipes, so an unauthorized request never reaches validation
- Interceptors are the only layer that runs both before and after the handler
- Interview tip: say "filters only run when an exception is thrown"

# Step 3: Data and Configuration

## Configuration and Environment Variables
video: nestjs configmodule env variables
summary: Use @nestjs/config to load .env files and inject typed settings through ConfigService.

The `@nestjs/config` package loads environment variables from a `.env` file and exposes them through an injectable **ConfigService**. This keeps secrets and per-environment settings (database URL, JWT secret, ports) out of your source code.

### Install and register
```bash
npm i @nestjs/config
```

```ts
// app.module.ts
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,                       // no need to import it everywhere
      envFilePath: ['.env.local', '.env'],  // optional
    }),
  ],
})
export class AppModule {}
```

```bash
# .env
PORT=3000
DATABASE_URL=postgres://user:pass@localhost:5432/mydb
JWT_SECRET=change-me
```

### Read values with ConfigService
```ts
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private config: ConfigService) {}

  getPort() {
    return this.config.get<number>('PORT', 3000); // second arg = default
  }
}
```

### Custom configuration file
```ts
// config/configuration.ts
export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  database: { url: process.env.DATABASE_URL },
});

// ConfigModule.forRoot({ load: [configuration] })
// this.config.get<string>('database.url')
```

### Validate env at startup
```ts
ConfigModule.forRoot({
  validate: (config) => {
    if (!config.DATABASE_URL) throw new Error('DATABASE_URL is required');
    return config;
  },
});
```
You can also pass a `validationSchema` built with **Joi**.

### Async setup in other modules
```ts
JwtModule.registerAsync({
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    secret: config.get<string>('JWT_SECRET'),
    signOptions: { expiresIn: '1h' },
  }),
});
```

### Key Points
- Use `isGlobal: true` to avoid re-importing `ConfigModule`
- Env values are strings, so convert numbers and booleans
- Never commit `.env`. Add it to `.gitignore`
- Interview tip: use `registerAsync` / `forRootAsync` so modules read config after it loads

## Database Integration (TypeORM and Prisma)
video: nestjs typeorm prisma database tutorial
summary: Connect Nest to a database with TypeORM (entities and repositories) or Prisma (a generated client service).

Nest is database-agnostic, but the two most common choices are **TypeORM** (decorator-based ORM with the official `@nestjs/typeorm` package) and **Prisma** (schema-first with a generated, type-safe client). Both fit well because you wrap them in providers and inject them into services.

### Option 1: TypeORM
```bash
npm i @nestjs/typeorm typeorm pg
```

```ts
// app.module.ts
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'user',
      password: 'pass',
      database: 'mydb',
      autoLoadEntities: true,
      synchronize: false, // never true in production
    }),
    UsersModule,
  ],
})
export class AppModule {}
```

```ts
// user.entity.ts
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;
}
```

```ts
// users.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([User])], // registers the repository
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
```

```ts
// users.service.ts
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  async findOne(id: number) {
    const user = await this.repo.findOneBy({ id });
    if (!user) throw new NotFoundException();
    return user;
  }

  create(dto: CreateUserDto) {
    return this.repo.save(this.repo.create(dto));
  }
}
```

### Option 2: Prisma
```bash
npm i @prisma/client
npm i -D prisma
npx prisma init
npx prisma migrate dev --name init
```

```prisma
// prisma/schema.prisma
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  name  String
}
```

Wrap the client in a Nest provider:

```ts
// prisma.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
```

```ts
// prisma.module.ts
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

```ts
// users.service.ts
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany();
  }

  create(dto: CreateUserDto) {
    return this.prisma.user.create({ data: dto });
  }
}
```

### TypeORM vs Prisma
| | TypeORM | Prisma |
|---|---|---|
| Style | Decorators on classes | Separate schema file |
| Type safety | Good | Excellent (generated client) |
| Nest integration | Official module | Custom service pattern |
| Migrations | TypeORM CLI | `prisma migrate` |

### Key Points
- TypeORM: `forRoot` once, `forFeature([Entity])` per module, `@InjectRepository` in services
- Prisma: one shared `PrismaService`, exported from a module
- `synchronize: true` can drop data. Use migrations in production
- Interview tip: keep database code in services, never in controllers

# Step 4: Security and Production

## Authentication with JWT
video: nestjs jwt authentication guard
summary: Sign tokens with JwtService on login and verify them in an AuthGuard that protects routes.

**JWT** (JSON Web Token) authentication is stateless: the server signs a token at login, the client sends it back in the `Authorization` header, and a **guard** verifies it on every protected request. In Nest this uses `@nestjs/jwt` for signing and verifying, plus a guard for enforcement.

### Install and configure
```bash
npm i @nestjs/jwt bcrypt
npm i -D @types/bcrypt
```

```ts
// auth.module.ts
@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
```

### Login: verify password and sign token
```ts
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user.id, email: user.email };
    return { access_token: await this.jwtService.signAsync(payload) };
  }
}
```

```ts
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto.email, dto.password);
  }
}
```

### AuthGuard: verify token
```ts
import {
  CanActivate, ExecutionContext, Injectable, UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);
    if (!token) throw new UnauthorizedException();

    try {
      request['user'] = await this.jwtService.verifyAsync(token, {
        secret: this.config.get<string>('JWT_SECRET'),
      });
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractToken(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
```

### Protect routes
```ts
@UseGuards(AuthGuard)
@Get('profile')
getProfile(@Request() req) {
  return req.user; // { sub, email, iat, exp }
}
```

### Public routes with a decorator
For an app-wide guard, add `@Public()` using `SetMetadata('isPublic', true)` and check it in the guard with `Reflector.getAllAndOverride`.

### Passport option
`@nestjs/passport` with `passport-jwt` is the other popular approach. It uses `AuthGuard('jwt')` and a `JwtStrategy` class. The manual guard above shows the idea without extra packages.

### Key Points
- Hash passwords with **bcrypt**. Never store plain text
- Sign with `signAsync`, verify with `verifyAsync`, and keep the secret in config
- Put only small, non-sensitive data in the payload (JWT is encoded, not encrypted)
- Interview tip: return **401** for missing or bad tokens and **403** for valid users without permission

## Testing
video: nestjs testing jest unit e2e supertest
summary: Use @nestjs/testing to build isolated modules with mocked providers for unit tests, and supertest for e2e.

Nest projects come with **Jest** configured. The `@nestjs/testing` package builds a small test module with `Test.createTestingModule()`, so you can **override providers with mocks**. Dependency injection is what makes this easy: swap the real database service for a fake one in two lines.

### Unit test a service with a mock repository
```ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  const mockRepo = {
    find: jest.fn(),
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('returns a user', async () => {
    mockRepo.findOneBy.mockResolvedValue({ id: 1, name: 'Asha' });
    await expect(service.findOne(1)).resolves.toEqual({ id: 1, name: 'Asha' });
  });

  it('throws when not found', async () => {
    mockRepo.findOneBy.mockResolvedValue(null);
    await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
  });
});
```

### Unit test a controller
```ts
const module = await Test.createTestingModule({
  controllers: [CatsController],
  providers: [
    { provide: CatsService, useValue: { findAll: jest.fn().mockReturnValue([]) } },
  ],
}).compile();

const controller = module.get(CatsController);
expect(controller.findAll()).toEqual([]);
```

### Override a provider in a bigger module
```ts
const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
  .overrideProvider(CatsService)
  .useValue(mockCatsService)
  .compile();
```

### End-to-end test with supertest
```ts
import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';

describe('Cats (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  it('GET /cats', () => {
    return request(app.getHttpServer()).get('/cats').expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
```

### Commands
```bash
npm run test         # unit tests (*.spec.ts)
npm run test:watch
npm run test:cov     # coverage
npm run test:e2e     # e2e tests in /test
```

### Key Points
- Unit tests: mock dependencies with `useValue`. E2E tests: boot the real app with supertest
- E2E tests do not get your `main.ts` setup, so re-apply global pipes and prefixes
- Use `getRepositoryToken(Entity)` to mock TypeORM repositories
- Interview tip: "DI is why Nest code is testable" is a strong answer

## Microservices
video: nestjs microservices tcp redis nats rabbitmq
summary: Nest supports microservices over transports like TCP, Redis, NATS and RabbitMQ using message and event patterns.

In Nest, a **microservice** is an app that uses a transport other than HTTP. Nest provides `@nestjs/microservices` with built-in transports: **TCP**, **Redis**, **NATS**, **MQTT**, **RabbitMQ (RMQ)**, **Kafka** and **gRPC**. You write handlers with the same decorators and structure as a normal Nest app.

### Two communication styles
- **Request-response**: `@MessagePattern()` on the server, `client.send()` on the client (waits for a reply)
- **Event-based**: `@EventPattern()` on the server, `client.emit()` on the client (fire and forget)

### Create a microservice (TCP)
```bash
npm i @nestjs/microservices
```

```ts
// main.ts of the microservice
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: { host: '127.0.0.1', port: 4000 },
  });
  await app.listen();
}
bootstrap();
```

### Handlers
```ts
import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class MathController {
  @MessagePattern({ cmd: 'sum' })
  sum(@Payload() data: number[]): number {
    return data.reduce((a, b) => a + b, 0);
  }

  @EventPattern('user_created')
  handleUserCreated(@Payload() data: { id: number }) {
    console.log('New user', data.id);
  }
}
```

### Client (inside an API gateway or another service)
```ts
// app.module.ts
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MATH_SERVICE',
        transport: Transport.TCP,
        options: { host: '127.0.0.1', port: 4000 },
      },
    ]),
  ],
})
export class AppModule {}
```

```ts
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(@Inject('MATH_SERVICE') private client: ClientProxy) {}

  async sum(nums: number[]) {
    return firstValueFrom(this.client.send({ cmd: 'sum' }, nums));
  }

  notify(id: number) {
    this.client.emit('user_created', { id });
  }
}
```

### Hybrid app
One app can serve HTTP and listen to a transport at the same time:
```ts
const app = await NestFactory.create(AppModule);
app.connectMicroservice<MicroserviceOptions>({
  transport: Transport.TCP,
  options: { port: 4000 },
});
await app.startAllMicroservices();
await app.listen(3000);
```

### Choosing a transport
| Transport | Good for |
|---|---|
| TCP | Simple internal calls |
| Redis / NATS | Lightweight pub/sub |
| RabbitMQ | Reliable queues and routing |
| Kafka | High-volume event streaming |
| gRPC | Fast typed service-to-service calls |

### Key Points
- `send()` returns an Observable (reply expected). `emit()` is fire and forget
- Guards, pipes, interceptors and filters also work in microservices
- Handlers use `@MessagePattern` / `@EventPattern` instead of `@Get` / `@Post`
- Interview tip: use a message broker (RabbitMQ, Kafka) when you need delivery guarantees

## Interview Quick Review
video: nestjs interview questions and answers
summary: A fast revision sheet of the most asked NestJS interview questions and short answers.

This is a quick revision sheet for the questions interviewers ask most about NestJS. Read each answer aloud in one or two sentences, then go back to the earlier topics for the details and code. Focus on structure, dependency injection and the request lifecycle.

### Core concepts
| Question | Short answer |
|---|---|
| What is NestJS? | A TypeScript-first Node.js framework with modules, DI and decorators, running on Express or Fastify |
| Why use it over Express? | Structure, built-in DI, easier testing and consistency in big teams |
| What is a module? | A `@Module()` class that groups controllers and providers into a feature |
| What is a controller? | A class that maps routes to handlers and returns responses |
| What is a provider? | An `@Injectable()` class (often a service) managed by the DI container |
| What is DI? | Nest creates dependencies and passes them through constructors |
| Default provider scope? | Singleton (one instance per app) |

### Request handling
| Question | Short answer |
|---|---|
| Lifecycle order? | Middleware, guards, interceptors (before), pipes, handler, interceptors (after), filters on error |
| Guard vs middleware? | Guards know the execution context and decide access. Middleware does not know the handler |
| Pipe vs interceptor? | Pipes transform and validate input. Interceptors wrap the handler and can change output |
| What does `whitelist: true` do? | Strips properties that have no validation decorator |
| What does `transform: true` do? | Creates DTO instances and converts types |
| Why DTO classes, not interfaces? | Classes exist at runtime, so validators can read them |
| How to handle errors? | Throw `HttpException` subclasses and use exception filters |

### Data, security and testing
| Question | Short answer |
|---|---|
| How to read env variables? | `ConfigModule.forRoot({ isGlobal: true })` and `ConfigService.get()` |
| TypeORM wiring? | `forRoot` in root module, `forFeature([Entity])` per module, `@InjectRepository` |
| Prisma wiring? | A `PrismaService` extending `PrismaClient`, exported from a module |
| How does JWT auth work? | Sign with `signAsync` on login, verify with `verifyAsync` in a guard |
| How to test a service? | `Test.createTestingModule` and mock providers with `useValue` |
| Microservice styles? | `@MessagePattern` with `send()` and `@EventPattern` with `emit()` |

### Common mistakes
- Forgetting `exports` or `imports`, causing "Nest can't resolve dependencies"
- Using interfaces as DTOs, so validation never runs
- Not enabling `ValidationPipe` globally
- Using `synchronize: true` in production
- Putting business logic in controllers
- Using `@Res()` and losing interceptor and automatic response handling

### Mini cheat sheet
```text
nest new app          create project
nest g resource x     scaffold CRUD
@Module               groups code
@Controller / @Get    routes
@Injectable           providers
ValidationPipe        validation
@UseGuards            access control
@UseInterceptors      wrap handler
@UseFilters           error format
```

### Key Points
- Be able to draw the lifecycle and explain each layer in one sentence
- Explain DI with a real example: a service injected into a controller
- Show you know testing, config and auth, not only controllers
- Interview tip: tie every answer back to structure, testability and maintainability
