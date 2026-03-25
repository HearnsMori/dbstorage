/*
Target:
Control

Principle:
name file in camel case,
make it descriptive,
avoid same name file

Model {
    //Data Management
    Storage {
        storageId:
        universe:
        platform:
        organization:
        company:
        app:
        collection:
        document:
    }
    //Audit Essential
    AuditLog {
        auditId:
        platform:
        organization:
        app:
        collection:
        documentId:
        action:
        changedFields:
        before:
        after:
        performedBy:
        timestamp:
        reason:
        metadata:
    }
    //Auth and User Management
    User {
        userId:
        userPasswordHash:
        mfa:
        links:
        userData:
        userRole:
        status:
        createdAt:
        updatedAt:
        lastLogin:
        publicKey:
    }
    Role {
        roleId:
        rolePasswordHash:
        user:
        allowedToPushUser:
        allowedToPopUser:
    }

    //Generative
    //Agent   
    //Query
    No Additional Models Needed

    //Automation
    //Event
    Process {
        processId:
        data:
    }

    //Communication
    Communication {
        communicationId:
        who: [user]
        data: [{
            who:
            data:
        }]
    }

    //File Process
    No Data Needed

    //Security
    AuditLog

    //Analytical
    AuditLog

    //Integration
    Webhook for:
        external etc
    WebSocket for:
        Communication
        Process
        Storage
}

API ENDPOINT =
RESOURCES BASED, 
SNAKE CASE,
PLURAL NOUN;
MODEL = CAMEL CASE;
METHOD =
GET: retrieve,
POST: create new,
PATCH: update,
PUT: overwrite create/update,
DELETE: delete;
HEADER =
Authorization: Bearer <token>,
Content-Type: application/json,
Accept: application/json
return = ({
	success: Boolean,
	message: String,
	error: { code, details } | Null,
	meta: {Any} | Null,
	data: {Any} | Null,
});

//Data Management and Audit Essentials
Frontend {
	String | ArrayOfString = app, collectionName, collectionKey, key, getAccess, setAccess, removeAccess, path;
	ArrayOfAny = value;
	JSONOfAny = data;
    getItem(app, collectionName, collectionKey, key);
	= JSON of app.collectionName.key | app.collectionName.collectionKey;
    setItem(app, collectionName, collectionKey, key, value, getAccess, setAccess, removeAccess);
    removeItem(app, collectionName, collectionKey, key, value);
    loadJSONItem(app, collectionName, collectionKey, key, value);
    saveJSONItem();
    setJSONItem(path, value);
    removeJSONItem(path, value);
    pushJSONItem(path, value);
    popJSONItem(path, value);
    auditEssential(data);
} Backend {
    GET /api/v1/data/:app/:collection-name/:collection-key/:key
    POST /api/v1/data/:app/:collection-name/:collection-key/
    PATCH /api/v1/data/:app/:collection-name/:collection-key/
    PUT /api/v1/data/:app/:collection-name/:collection-key/
    DELETE /api/v1/data/:app/:collection-name/:collection-key/
}

//Auth
Frontend {
    signup(id, password, role = null, contact = null) return null
    login(id, password) return null
    logout() return null
    accessToken() return token
    refreshToken() return null
    recover()
    mfa()
    sessions()
} Backend {
    /auth/signup
    /auth/login
    /auth/refresh-token
    /auth/recover
    /auth/mfa
    /auth/sessions

    for signup create public key
    then when login return public key and salted password
    in frotend regenerate the private key using the salted password
    now u have private and public key
    
}

//User Management
Frontend {
    X = id, password, role, contact
    (get|set|push|pop)(Self|Other)(X|All) [if get return X else null]
    accountReactivate()
    accountDeactivate()
    accountDelete()
    createRole()
} Backend {
    X = id, password, role, contact
    GET /user/(self|other)-(X|all)
    POST /user/(self|other)-(X|all)
    /user/account-reactivate
    /user/account-deactivate
    /user/account-delete
    /user/create-role
}


//Process
//generative
Frontend {
    generateTXT(message, context) return message
    generateJSON(howMany, expectedJSON) return JSON
} Backend {
    POST /process/generator/generate-txt
    POST /process/generator/generate-json
}
//agent
Frontend {
    generateDECISION(what, data) return JSON
} Backend {
    POST /process/agent/generate-decision
}
//query
Frontend {
    filter(arrorjson, logic) return arrorjson
    search(arrorjson, logic) return arrorjson
    sort(arrorjson, logic) return arrorjson
    paginate(arrorjson, logic) return arrorjson
} Backend {
    //None
}
//automation
//event
Frontend {
    automate(what, data) return JSON
} Backend {
    GET /process/exe/:processId
    POST /process/exe/:processId
    PATCH /process/exe/:processId
    DELETE /process/exe/:processId
}

//communication
Frontend {
    send(what, data)
} Backend {
    GET /process/communication/:communicationId
    POST /process/communication/:communicationId
    PATCH /process/communication/:communicationId
    DELETE /process/communication/:communicationId
}
//file process
Frontend {
    (get|set|remove)File(app, collectionName, collectionKey, key, (null|value|value)) [if get return file else null]
} Backend {
    GET /process/file/:fileId
    POST /process/file/:fileId
    PATCH /process/file/:fileId
    PUT /process/file/:fileId
    DELETE /process/file/:fileId
}
//security
Frontend {
    security(what, data) return JSON
} Backend {
    GET /process/security/e2ee/storage/:storageId
    POST /process/security/e2ee/storage/:storageId
    PATCH /process/security/e2ee/storage/:storageId
    PUT /process/security/e2ee/storage/:storageId
    DELETE /process/security/e2ee/storage/:storageId
    /process/security/security
}
//analytical
Frontend {
    analytics(what, data) return JSON
} Backend {
    /process/analytics/analytics
}
//integration
Frontend {
    integrateWebhook(what, data) return JSON
    integrateExternalApi(what, data) return JSON
    integrateWebSocket(what, data) return JSON
} Backend {
    POST /process/integration/integrate-webhook
        /:external
    POST /process/integration/integrate-websocket
        /storage
        /process/communication
        /process/file
}
*/

require('dotenv').config(); //environment variables
const mongoose = require('mongoose'); //connect to mongodb
const session = require('express-session');
const cors = require('cors'); //what origin to allow
const express = require('express'); //to create server
const helmet = require('helmet'); //protection
const rateLimit = require('express-rate-limit');
const path = require('path');
const apiLimiter = rateLimit({
    windowMs: 1000*60*15,
    max: 100,
    message: "Too many request, please try again later."
});

const PORT = process.env.PORT;

const app = express();

app.use(session({
    secret: process.env.SECRETKEY,
    resave: false,
    saveUninitialized: true
}));

//allow any origin to request
app.use(cors());
app.use(helmet());
app.use(express.json({limit: '1mb'}));
app.use(express.urlencoded({ limit: '1mb', extended: true }));

app.get('/', (req, res) => {
    res.send(`<pre>Updated 2026 March 22
        \n
        \n#getItem
        \nin: app, collectionName, collectionKey, key, value
        \nout: [app[collectionName[collectionKey, key: value]]]
        \n
        \n#(setItem | removeItem)
        \nin: app, collectionName, collectionKey, key, value
        \nout: message, (affected | denied)
        \n
        \n/auth
        \n/user
        \n/role
        \n/process
    </pre>`);
});

app.get('/auth', (req, res) => {
    res.send(`<pre>Updated 2026 March 22
        \n
        \n#signup
        \nin: id, password, contact
        \nout: message, id
        \n
        \n#signin
        \nin: id, password
        \nout: message, accessToken, refreshToken
        \n
        \n#refreshToken
        \nin: token
        \nout: message, accessToken, refreshToken
        \n
        \n#recover
        \nin: id, contact
        \nout: message
    </pre>`);
});

app.get('/user', (req, res) => {
    res.send(`<pre>Updated 2026 March 22
        \n
        \n#get(Self | Other)X
        \nin: X
        \nout: (self | other)X
        \n
        \n#(set | push | pop)(Self | Other)X
        \nin: (success | error)
    </pre>`);
});

app.get('/process', (req, res) => {
    res.send(`<pre>Updated 2026 March 11
        \n
        \n/generator/aiTXTGenerator
        \nin: message
        \nout: (message | error)
    </pre>`);
});

app.use('/', apiLimiter, require('./routes/storage'));
app.use('/auth', apiLimiter, require('./routes/auth'));
app.use('/user', apiLimiter, require('./routes/user'));
app.use('/process', apiLimiter, require('./routes/process'));

//utils download file
app.get('/utils/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', filename); // Assuming files are in an 'uploads' directory

    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(500).send('Availble File: \n- dbstorage.ts');
        } else {
            console.log('File sent successfully:', filename);
        }
    });
});

//Connecting to Database
const mongoDBUri = process.env.MONGO_URI;
mongoose.connect(mongoDBUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Mongodb database configured successfully.');
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB', err)
    });
const db = mongoose.connection;
db.on('connected', () => { console.log('Connected to database MongoDB.'); });
db.on('error', err => console.error('Mongoose connection error:', err));
db.on('disconnected', () => { });

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening at port ${PORT}`)
});

//When the user press ctrl C
process.on('SIGINT', () => {
    async function closeConnection() {
        try {
            await mongoose.connection.close();
            console.log('Connection closed successfully.');
            process.exit(0);
        } catch (err) {
            console.error('Failed to close the connection:', err);
        }
    }
    // Call the function when you need to close the connection
    closeConnection();
});
