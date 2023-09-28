const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');



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


app.get('/', (req, res) => {
    res.render('login'); 
});
app.get('/dashboard', (req, res) => {
    res.render('dashboard'); 
});

app.get('/create-admin',(req,res)=>{
    res.render('createAdmin');
});

app.get('/create-users',(req,res)=>{
    res.render('createUsers')
});

app.get('/edit-profile',(req,res)=>{
    res.render('edit')
});
app.get('/create-events',(req,res)=>{
    res.render('createEvents')
});

app.get('/attach-user',(req,res)=>{
    res.render('attach')
});
app.get('/delete',(req,res)=>{
    res.render('delete')
});
app.get('/add-profile',(req,res)=>{
    res.render('addprofile')
});

app.get('/unattach-user',(req,res)=>{
    res.render('unattach')
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

app.post('/create-users', async (req, res) => {
    const { firstname, lastname, username, bio, displayName } = req.body;

    const token = req.admin.token;
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
                
            },
            body: JSON.stringify({ firstname, lastname, username, bio, displayName }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('API Response:', data);
            res.render('createUsers', { message: 'User successfully created!' });
        } else {
            res.render('createUsers', { error: 'User already exists or cannot create user!' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.render('createUsers', { error: 'An error occurred while processing your request' });
    }
});

app.post('/edit-profile', async (req, res) => {
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


app.post('/unattach-user', async (req, res) => {
    const { eventId, userId } = req.body;
    console.log('eventid:', eventId);
    console.log('userid:', userId);
    

    try {
        const response = await fetch('https://demoapi.ppleapp.com/api/v1/admin/admin-unattach-user-to-event', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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


app.post('/create-events', async (req, res) => {
    const { organizerName, organizerPhone, organizerEmail, title,detail,startDate,guestLimit,price,country,state,address,media } = req.body;
    

    try {
        const response = await fetch('https://demoapi.ppleapp.com/api/v1/admin/admin-create-new-event', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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