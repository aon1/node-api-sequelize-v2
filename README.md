# node-api-sequelize

boilerplate api with sequelize

### Installation
    npm install

#### Creating new models

 - create model file on app/models
 - create router file on app/router
 - create controller file on app/controllers
 
``` 
node_modules/.bin/sequelize migration:create --name=create-<model name>
```

Edit created migration file on database/migrations

```
node_modules/.bin/sequelize db:migrate
```

On app/router/index.js, add the following lines to include the new route

```
const newRoute = require('./<file you created on 1st step>');

router.use('/<new endpoint>', newRoute);
```

This route will be available on http://localhost:3000/api/newRoute

#### Run project
```
npm start
```