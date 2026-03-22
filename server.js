/*
all returns a boolean success and message

//Auth
Frontend {
    signup(id, password, role = null, contact = null) return null
    login(id, password) return null
    logout() return null
    accessToken() return token
    refreshToken() return null
} Backend {
    /auth/signup
    /auth/login
    /auth/refreshToken
}

//User Management
Frontend {
    X = id, password, role, contact
    (get|set|push|pop)(Self|Other)(X|All) [if get return X else null]
} Backend {
    X = id, password, role, contact
    /user/(get|set|push|pop)(Self|Other)(X|All)
}

//Data Management
Frontend {
    (get|set|remove)Item(app, collectionName, collectionKey, key, (null|value|value)) [if get return json else null]
    (get|set|remove|push|pop)JSONItem(app, collectionName, collectionKey, key, (null|value|value|path|path))
} Backend {
    /getItem
    /setItem
    /removeItem    
}

//Process
//generative
Frontend {
    generateTXT(message, context) return message
    generateJSON(howMany, expectedJSON) return JSON
} Backend {
    /process/generator/generateTXT
    /process/generator/generateJSON
}
//agent
Frontend {
    generateDECISION(what, data) return JSON
} Backend {
    /process/agent/generateDECISION
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
Frontend {
    automate(what, data) return JSON
} Backend {
    /process/automate
}
//event
Frontend {
    emit
    listen
    handle
} Backend {
    //None
}
//communication
Frontend {
    send(what, data)
} Backend {
    /process/send
}
//file process
Frontend {
    (get|set|remove)File(app, collectionName, collectionKey, key, (null|value|value)) [if get return file else null]
} Backend {
    /process/getFile
    /process/setFile
    /process/removeFile
}
//security
Frontend {
    security(what, data) return JSON
} Backend {
    /process/security
}
//analytical
Frontend {
    analytics(what, data) return JSON
} Backend {
    /process/analytics
}
//integration
Frontend {
    integrateWebhook(what, data) return JSON
    integrateExternalApi(what, data) return JSON
    integrateWebSocket(what, data) return JSON
} Backend {
    /process/integration/integrateWebhook
    /process/integration/integrateApi
    /process/integration/integrateWebSocket
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

app.get('/role', (req, res) => {
    res.send(`<pre>Updated 2026 March 11
        \n
        \n#soon
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
app.use('/role', apiLimiter, require('./routes/role'));

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
