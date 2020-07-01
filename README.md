# Node JS Training : RESTful API
Training with YouTube [video series](https://www.youtube.com/playlist?list=PL55RiY5tL51q4D-B63KBnygU6opNPFk_q) on building a RESTful API with Node.js.

I also modified certain pieces of code to my liking and added other functionalities which seemed important to me.

## Packages used
Look at [package.json](https://github.com/Alphamplyer/NodeJS-Train/blob/master/package.json)

```json
"dependencies": {
    "bcrypt": "^5.0.0",
    "express": "^4.17.1",
    "jsonwebtoken": "^8.5.1",
    "mongoose": "^5.9.20",
    "morgan": "^1.10.0",
    "multer": "^1.4.2",
    "save": "^2.4.0"
},
"devDependencies": {
    "nodemon": "^2.0.4"
}
```

## Usage
```git clone``` it and thereafter run ```npm install```.

Make sure to also add your Mongo Atlas Admin Password and an encryption key for JsonWebToken to a nodemon.json file (which you have to create).

```json
{
    "env": {
        "MONGO_ATLAS_PW": "YOUR_MONGO_USER_PW",
        "JWT_KEY": "YOUR_ENCRYPTION_KEY"
    }
}
```
