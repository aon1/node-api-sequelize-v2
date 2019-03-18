# node-api-sequelize

boilerplate api with sequelize (mysql), jsonwebtoken and joi validation

### Installation
    npm install

### Steps to create an endpoint

#### Create a file with the name of your new endpoint on the following folders

 - create model file on app/models/foo
 - create router file on app/router/foo
 - create controller file on app/controllers/foo
 - create validation file on app/validators/foo

#### Generate migration file(s)
 
``` 
node_modules/.bin/sequelize migration:create --name=create-<model name>
```

#### Edit migration file on database/migrations

#### Run migrate command to create table(s)

```
node_modules/.bin/sequelize db:migrate
```

#### On app/router/index.js, add the following lines to include the new route

```
const foo = require('./foo');

router.use('/foo', foo);
```

This route will be available on http://localhost:3000/api/foo

#### Run project
```
npm start
```