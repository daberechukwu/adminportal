const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


const app = express();
const port = 3000;

const handlebars = require('express-handlebars');

const hbs = handlebars.create({
    extname: 'hbs',
    defaultLayout: false, // Disable the default layout
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public'))); // Serve static assets from the 'public' directory

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Define the ensureAuthenticated middleware


app.use(cookieParser());


function ensureAuthenicated(req, res, next) {
    const accessToken = req.cookies.token;

    if (accessToken ){
        req.headers.authorization = `Bearer ${accessToken}`;
         return next();
    } else{

        res.redirect('/');

    }

}



app.get('/', (req, res) => {
    res.render('login'); 
});
app.get('/dashboard',ensureAuthenicated, (req, res) => {
    res.render('dashboard'); 
});

app.get('/create-admin',ensureAuthenicated,(req,res)=>{
    res.render('createAdmin');
});

app.get('/create-users',ensureAuthenicated,(req,res)=>{
    res.render('createUsers')
});

app.get('/edit-profile', ensureAuthenicated,(req,res)=>{
    res.render('edit')
});
app.get('/create-events', ensureAuthenicated,(req,res)=>{
    res.render('createEvents')
});

app.get('/attach-user', ensureAuthenicated,(req,res)=>{
    res.render('attach')
});
app.get('/delete',ensureAuthenicated,(req,res)=>{
    res.render('delete')
});
app.get('/add-profile',ensureAuthenicated,(req,res)=>{
    res.render('addprofile')
});

app.get('/unattach-user', ensureAuthenicated,(req,res)=>{
    res.render('unattach')
});

app.get('/logout', (req, res) => {
    res.clearCookie('token'); // Clear the token cookie to log the user out
    res.redirect('/'); // Redirect to the login page or any other page as needed
});




app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    console.log('Email:', email); // Log email for debugging
    console.log('Password:', password); // Log password for debugging

    try {
        const apiResponse = await fetch('https://demoapi.ppleapp.com/api/v1/admin/admin-login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (apiResponse.ok) {
            const data = await apiResponse.json();
            console.log('reponse:',data);
            const accessToken= data.token;

            res.cookie('token', accessToken, { httpOnly: true });
            // Handle successful login here (e.g., render a success page)
            return res.render('dashboard'); // Replace with your success page
        } else {
            res.render('login', { error: 'Wrong email or password!' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.render('login', { error: 'An error occurred while processing your request' });
    }
});


app.post('/create-admin', async(req,res)=>{
     const {email,name,password,role}= req.body;
          
    try{
        const apiresponse = await fetch('https://demoapi.ppleapp.com/api/v1/admin/create-admin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email,name,password,role}),
        });
        if(apiresponse.ok) {
            const data = await apiresponse.json();
            console.log('API Response:', data);
            res.render('createAdmin',{message:'admin successfully created!'});
        } else {
            res.render('createAdmin',{error:'admin already exist or cannot create admin'});
        }
    }catch(error){
        console.error('Error:', error);
        res.render('createAdmin', { error: 'An error occurred while processing your request' });
    }
});

app.post('/create-users', ensureAuthenicated, async (req, res) => {
    const { firstname, lastname, username, bio, displayName } = req.body;

    console.log('First Name:', firstname);
    console.log('Last Name:', lastname);
    console.log('Username:', username);
    console.log('Bio:', bio);
    console.log('Display Name:', displayName);

    try {
        const response = await fetch('https://demoapi.ppleapp.com/api/v1/admin/create-user-account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                 'Authorization': req.headers.authorization,// Add authentication headers if required
            },
            body: JSON.stringify({ firstname, lastname, username, bio, displayName }),
        });

        const data = await response.json();

        if (response.ok) {
            console.log('API Response:', data);
            res.render('createUsers', { message: 'User successfully created!' });
        } else {
            console.error('API Error Response:', data);
            res.render('createUsers', { error: 'User creation failed. Please check the data and try again.' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.render('createUsers', { error: 'An error occurred while processing your request' });
    }
});

app.post('/edit-profile', ensureAuthenicated, async (req, res) => {
    const { firstname, lastname, username, bio, displayName } = req.body;
    console.log('First Name:', firstname);
    console.log('Last Name:', lastname);
    console.log('Username:', username);
    console.log('Bio:', bio);
    console.log('Display Name:', displayName);

    try {
        const response = await fetch('https://demoapi.ppleapp.com/api/v1/admin/edit-user-account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ firstname, lastname, username, bio, displayName }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('API Response:', data);
            res.render('edit', { message: 'User successfully created!' });
        } else {
            res.render('edit', { error: 'User already exists or cannot create user!' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.render('edit', { error: 'An error occurred while processing your request' });
    }
});

app.post('/attach-user', async (req, res) => {
    const { eventId, userId } = req.body;
    console.log('eventid:', eventId);
    console.log('userid:', userId);
    

    try {
        const response = await fetch('https://demoapi.ppleapp.com/api/v1/admin/admin-attach-user-to-event', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': req.headers.authorization,
            },
            body: JSON.stringify({ eventId,userId }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('API Response:', data);
            res.render('attach', { message: 'User successfully attached!' });
        } else {
            res.render('attach', { error: 'error occured attaching the user to an event!' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.render('attach', { error: 'An error occurred while processing your request' });
    }
});


app.post('/unattach-user', ensureAuthenicated, async (req, res) => {
    const { eventId, userId } = req.body;
    console.log('eventid:', eventId);
    console.log('userid:', userId);
    

    try {
        const response = await fetch('https://demoapi.ppleapp.com/api/v1/admin/admin-unattach-user-to-event', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': req.headers.authorization,
            },
            body: JSON.stringify({ eventId,userId }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('API Response:', data);
            res.render('attach', { message: 'User successfully unattached!' });
        } else {
            res.render('attach', { error: 'error occured unattaching the user from an event!' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.render('attach', { error: 'An error occurred while processing your request' });
    }
});


app.post('/create-events', ensureAuthenicated, async (req, res) => {
    const { organizerName, organizerPhone, organizerEmail, title,detail,startDate,guestLimit,price,country,state,address,media } = req.body;
    
    console.log({
        organizerName,
        organizerPhone,
        organizerEmail,
        title,
        detail,
        startDate,
        guestLimit,
        price,
        country,
        state,
        address,
        media,
    });
    
    try {
        const response = await fetch('https://demoapi.ppleapp.com/api/v1/admin/admin-create-new-event', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': req.headers.authorization,
            },
            body: JSON.stringify( { organizerName, organizerPhone, organizerEmail, title,detail,startDate,guestLimit,price,country,state,address,media }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('API Response:', data);
            res.render('createEvents', { message: 'event successfully created!' });
        } else {
            res.render('createEvents', { error: 'error occured creating event!' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.render('createEvents', { error: 'An error occurred while processing your request' });
    }
});


app.listen(port, () => console.log(`App listening to port ${port}`));