# node-api-sequelize

boilerplate api with sequelize (mysql), jsonwebtoken and joi validation

### Installation
    npm install

### Steps to create an endpoint

#### Configure database connect on config/database.js

#### Create a file with the name of your new endpoint on the following folders

 - create model file on app/models/foo
 - create router file on app/router/foo
 - create controller file on app/controllers/foo
 - create validation file on app/validators/foo

#### Generate migration file(s)
 
``` 
npx sequelize-cli model:generate --name Viewer --attributes count:int,createdAt:date
```

#### Edit migration file on database/migrations

#### Run migrate command to create table(s)

```
npx sequelize-cli db:migrate
```

#### On app/router/index.js, add the following lines to include the new route

```
const foo = require('./foo');

router.use('/foo', foo);
```

#### Env file

On config folder, create an env file according to your dev environment 
and fill in with proper values. 
You can find an example on env-file-example.env 

#### Run project
```
docker-compose up
```

Route will be available on http://localhost:3000/api/foo
