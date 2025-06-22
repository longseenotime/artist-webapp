const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const database = require('./models/database');
const { requireAuth, login } = require('./middleware/auth');
const upload = require('./middleware/upload');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
    secret: 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Set EJS as template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Initialize database
database.connect().catch(console.error);

// Sample data
const artworks = [
    {
        id: 1,
        title: 'Ethereal Landscape',
        medium: 'Oil on canvas',
        year: '2024',
        category: 'paintings',
        image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500&h=500&fit=crop',
        description: 'A serene landscape capturing the essence of tranquility'
    },
    {
        id: 2,
        title: 'Urban Reflections',
        medium: 'Acrylic on canvas',
        year: '2024',
        category: 'paintings',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop',
        description: 'Modern cityscape with vibrant color contrasts'
    },
    {
        id: 3,
        title: 'Digital Dreams',
        medium: 'Digital illustration',
        year: '2024',
        category: 'digital',
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&h=500&fit=crop',
        description: 'Exploring the boundaries between reality and digital art'
    },
    {
        id: 4,
        title: 'Sculptural Form',
        medium: 'Mixed media',
        year: '2024',
        category: 'sculptures',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop',
        description: 'Three-dimensional exploration of space and texture'
    },
    {
        id: 5,
        title: 'Abstract Harmony',
        medium: 'Watercolor',
        year: '2024',
        category: 'paintings',
        image: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=500&h=500&fit=crop',
        description: 'Flowing forms in perfect balance'
    },
    {
        id: 6,
        title: 'Cyber Bloom',
        medium: 'Digital art',
        year: '2024',
        category: 'digital',
        image: 'https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=500&h=500&fit=crop',
        description: 'Nature meets technology in this vibrant piece'
    }
];

const services = [
    {
        title: 'Custom Portraits',
        description: 'Personalized portrait commissions capturing your unique essence',
        price: 'Starting at $800',
        features: ['Multiple revisions', 'High-quality materials', 'Framing included']
    },
    {
        title: 'Original Paintings',
        description: 'One-of-a-kind artworks created specifically for your space',
        price: 'Starting at $1,200',
        features: ['Custom sizing', 'Color consultation', 'Certificate of authenticity']
    },
    {
        title: 'Digital Art',
        description: 'Modern digital illustrations and graphic design services',
        price: 'Starting at $400',
        features: ['High-resolution files', 'Multiple formats', 'Commercial license']
    },
    {
        title: 'Art Workshops',
        description: 'Private and group instruction for all skill levels',
        price: '$200/hour',
        features: ['All materials included', 'Flexible scheduling', 'Take home your creation']
    }
];

// Routes
app.get('/', async (req, res) => {
    try {
        const featuredArtworks = await database.getFeaturedPaintings();
        res.render('index', { 
            artworks: featuredArtworks, 
            services: services.slice(0, 3) 
        });
    } catch (error) {
        console.error('Error fetching featured artworks:', error);
        res.render('index', { 
            artworks: [], 
            services: services.slice(0, 3) 
        });
    }
});

app.get('/portfolio', async (req, res) => {
    try {
        const category = req.query.category || 'all';
        const artworks = await database.getPaintingsByCategory(category);
        
        res.render('portfolio', { 
            artworks: artworks, 
            currentCategory: category 
        });
    } catch (error) {
        console.error('Error fetching portfolio:', error);
        res.render('portfolio', { 
            artworks: [], 
            currentCategory: 'all' 
        });
    }
});

app.get('/artwork/:id', async (req, res) => {
    try {
        const artwork = await database.getPaintingById(req.params.id);
        if (!artwork) {
            return res.status(404).render('404');
        }
        res.render('artwork', { artwork });
    } catch (error) {
        console.error('Error fetching artwork:', error);
        res.status(404).render('404');
    }
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/services', (req, res) => {
    res.render('services', { services });
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

// API Routes
app.post('/api/contact', (req, res) => {
    const { name, email, service, message } = req.body;
    
    // In a real application, you would save this to a database
    // and send an email notification
    console.log('Contact form submission:', { name, email, service, message });
    
    res.json({ 
        success: true, 
        message: `Thank you, ${name}! Your message has been received. I'll get back to you soon.` 
    });
});

app.get('/api/artworks', async (req, res) => {
    try {
        const category = req.query.category;
        const artworks = await database.getPaintingsByCategory(category || 'all');
        res.json(artworks);
    } catch (error) {
        console.error('Error fetching artworks API:', error);
        res.status(500).json({ error: 'Failed to fetch artworks' });
    }
});

// Admin Routes
app.get('/admin/login', (req, res) => {
    if (req.session && req.session.authenticated) {
        return res.redirect('/admin/dashboard');
    }
    res.render('admin/login', { error: null });
});

app.post('/admin/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const isValid = await login(username, password);
        if (isValid) {
            req.session.authenticated = true;
            req.session.username = username;
            res.redirect('/admin/dashboard');
        } else {
            res.render('admin/login', { error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.render('admin/login', { error: 'Login failed' });
    }
});

app.get('/admin/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
});

app.get('/admin/dashboard', requireAuth, async (req, res) => {
    try {
        const paintings = await database.getAllPaintings();
        res.render('admin/dashboard', { 
            paintings,
            username: req.session.username 
        });
    } catch (error) {
        console.error('Error fetching paintings for dashboard:', error);
        res.render('admin/dashboard', { 
            paintings: [],
            username: req.session.username 
        });
    }
});

app.get('/admin/paintings/new', requireAuth, (req, res) => {
    res.render('admin/painting-form', { 
        painting: null,
        action: 'add',
        username: req.session.username 
    });
});

app.get('/admin/paintings/:id/edit', requireAuth, async (req, res) => {
    try {
        const painting = await database.getPaintingById(req.params.id);
        if (!painting) {
            return res.status(404).send('Painting not found');
        }
        res.render('admin/painting-form', { 
            painting,
            action: 'edit',
            username: req.session.username 
        });
    } catch (error) {
        console.error('Error fetching painting for edit:', error);
        res.status(500).send('Error loading painting');
    }
});

app.post('/admin/paintings', requireAuth, upload.single('image'), async (req, res) => {
    try {
        const paintingData = {
            title: req.body.title,
            description: req.body.description,
            medium: req.body.medium,
            year: parseInt(req.body.year),
            category: req.body.category,
            price: parseFloat(req.body.price),
            dimensions: req.body.dimensions,
            availability: req.body.availability,
            featured: req.body.featured ? 1 : 0,
            image_url: req.file ? `/uploads/${req.file.filename}` : req.body.existing_image_url || ''
        };

        await database.addPainting(paintingData);
        res.redirect('/admin/dashboard?success=added');
    } catch (error) {
        console.error('Error adding painting:', error);
        res.status(500).send('Error adding painting');
    }
});

app.post('/admin/paintings/:id', requireAuth, upload.single('image'), async (req, res) => {
    try {
        const paintingData = {
            title: req.body.title,
            description: req.body.description,
            medium: req.body.medium,
            year: parseInt(req.body.year),
            category: req.body.category,
            price: parseFloat(req.body.price),
            dimensions: req.body.dimensions,
            availability: req.body.availability,
            featured: req.body.featured ? 1 : 0,
            image_url: req.file ? `/uploads/${req.file.filename}` : req.body.existing_image_url || ''
        };

        await database.updatePainting(req.params.id, paintingData);
        res.redirect('/admin/dashboard?success=updated');
    } catch (error) {
        console.error('Error updating painting:', error);
        res.status(500).send('Error updating painting');
    }
});

app.delete('/admin/paintings/:id', requireAuth, async (req, res) => {
    try {
        await database.deletePainting(req.params.id);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting painting:', error);
        res.status(500).json({ error: 'Error deleting painting' });
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('404');
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('500');
});

app.listen(PORT, () => {
    console.log(`Artist webapp running on http://localhost:${PORT}`);
});