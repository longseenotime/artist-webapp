const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

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
app.get('/', (req, res) => {
    res.render('index', { 
        artworks: artworks.slice(0, 4), 
        services: services.slice(0, 3) 
    });
});

app.get('/portfolio', (req, res) => {
    const category = req.query.category || 'all';
    const filteredArtworks = category === 'all' 
        ? artworks 
        : artworks.filter(art => art.category === category);
    
    res.render('portfolio', { 
        artworks: filteredArtworks, 
        currentCategory: category 
    });
});

app.get('/artwork/:id', (req, res) => {
    const artwork = artworks.find(art => art.id == req.params.id);
    if (!artwork) {
        return res.status(404).render('404');
    }
    res.render('artwork', { artwork });
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

app.get('/api/artworks', (req, res) => {
    const category = req.query.category;
    const filteredArtworks = category && category !== 'all'
        ? artworks.filter(art => art.category === category)
        : artworks;
    
    res.json(filteredArtworks);
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