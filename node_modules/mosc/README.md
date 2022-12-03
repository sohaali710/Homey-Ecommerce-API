[![Build Status](https://travis-ci.org/4y0/mosc.svg?branch=master)](https://travis-ci.org/4y0/mosc)
# Mosc.js (A simple inline object model builder)


Mosc.js is a simple inline object model builder for NodeJS (A small port exists for client-side javascript). It can be used to build ORM schemas, app configurations and a host of other valid object usecases. 

Don't like those pesky curly braces? Just:

`npm install Mosc --save`

```
var Mosc = require('mosc');
var mosc = new Mosc({});
var SimpleORMUserModel = mosc.build('title:string')
							 .build('name:string')
                             .build('age:integer')
                             .end();
```

`SimpleORMUserModel` above becomes:
```
{
	title:"string",
    name:"string",
    age:"integer"
}
```

## Pass in a context dictionary
You can pass a context dictionary argument for Mosc to use when evaluating certain placeholders in your build arguments
```
var context_dictionary = {'SEQ':{string:'SEQUELIZE_STRING'}};
var result = new mosc(context_dictionary)
                 .build('id', 'type:*SEQ*.string')
                 .end();
/*
*SEQ*.string is evaluated using the context dictionary passed
Mosc looks for the property SEQ in the context dictionary, 
it then checks if there is a corresponding string property
if there is, Mosq evaluates SEQ.string and returns the result hence:
result = {
   id: {
     type:'SEQUELIZE_STRING'
   }
}
if there isn't MOSC throws a context not found in eval dict error
*/
```

With Mosc, it is also possible to do depth builds i.e object in object in object:
```
var obj = mosc.buildIn('attributes.id'); 
/*
obj = {
		attributes:
        {
        	id:
            {
            
            }
        }
      }
*/
```
```
var obj = mosc.buildIn('attributes.id', 'type:String, primaryKey:true').end();
/*
obj = {
		attributes:
        {
        	id:
            {
              type:'String',
              primaryKey:true
            }
        }
      }
*/
```
(_For depth builds, the final path in the depth must be a valid object i.e 'attributes.id', id, if it exists, must be an object otherwise Mosc throws a 'Path must be an object error'_)