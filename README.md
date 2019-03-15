# node-api-sequelize

skeleton api with sequelize

### Installation
    npm install

#### Creating new models

 - create model file on app/models/<model name>.js
 - create router file on app/router/<model name>.js
 - create controller file on app/controllers/<model name>.js
 
#### Run
``` 
node_modules/.bin/sequelize migration:create --name=create-<model name>
```

#### Edit created migration file on database/migrations

#### Run
```
node_modules/.bin/sequelize db:migrate
```

#### Run project
```
npm start
```