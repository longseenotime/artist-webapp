const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'artist.db');

class Database {
    constructor() {
        this.db = null;
    }

    connect() {
        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database(dbPath, (err) => {
                if (err) {
                    console.error('Error opening database:', err);
                    reject(err);
                } else {
                    console.log('Connected to SQLite database');
                    this.initializeTables().then(resolve).catch(reject);
                }
            });
        });
    }

    initializeTables() {
        return new Promise((resolve, reject) => {
            const createPaintingsTable = `
                CREATE TABLE IF NOT EXISTS paintings (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    description TEXT,
                    medium TEXT,
                    year INTEGER,
                    category TEXT DEFAULT 'paintings',
                    price DECIMAL(10,2),
                    image_url TEXT,
                    dimensions TEXT,
                    availability TEXT DEFAULT 'available',
                    featured BOOLEAN DEFAULT 0,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `;

            const createUsersTable = `
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT UNIQUE NOT NULL,
                    password TEXT NOT NULL,
                    email TEXT,
                    role TEXT DEFAULT 'admin',
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `;

            this.db.run(createPaintingsTable, (err) => {
                if (err) {
                    console.error('Error creating paintings table:', err);
                    reject(err);
                    return;
                }

                this.db.run(createUsersTable, (err) => {
                    if (err) {
                        console.error('Error creating users table:', err);
                        reject(err);
                        return;
                    }

                    // Insert sample data if tables are empty
                    this.insertSampleData().then(resolve).catch(reject);
                });
            });
        });
    }

    insertSampleData() {
        return new Promise((resolve, reject) => {
            // Check if there are any paintings
            this.db.get('SELECT COUNT(*) as count FROM paintings', (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }

                if (row.count === 0) {
                    // Insert sample paintings
                    const samplePaintings = [
                        {
                            title: 'Ethereal Landscape',
                            description: 'A serene landscape capturing the essence of tranquility through soft brushstrokes and muted colors.',
                            medium: 'Oil on canvas',
                            year: 2024,
                            category: 'paintings',
                            price: 1200.00,
                            image_url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500&h=500&fit=crop',
                            dimensions: '24" x 36"',
                            availability: 'available',
                            featured: 1
                        },
                        {
                            title: 'Urban Reflections',
                            description: 'Modern cityscape with vibrant color contrasts reflecting the energy of metropolitan life.',
                            medium: 'Acrylic on canvas',
                            year: 2024,
                            category: 'paintings',
                            price: 950.00,
                            image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop',
                            dimensions: '20" x 30"',
                            availability: 'available',
                            featured: 1
                        },
                        {
                            title: 'Digital Dreams',
                            description: 'Exploring the boundaries between reality and digital art through innovative techniques.',
                            medium: 'Digital illustration',
                            year: 2024,
                            category: 'digital',
                            price: 600.00,
                            image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&h=500&fit=crop',
                            dimensions: 'Print: 16" x 20"',
                            availability: 'available',
                            featured: 0
                        },
                        {
                            title: 'Sculptural Form',
                            description: 'Three-dimensional exploration of space and texture using mixed media techniques.',
                            medium: 'Mixed media sculpture',
                            year: 2024,
                            category: 'sculptures',
                            price: 2200.00,
                            image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop',
                            dimensions: '12" x 8" x 15"',
                            availability: 'available',
                            featured: 0
                        },
                        {
                            title: 'Abstract Harmony',
                            description: 'Flowing forms in perfect balance, representing the delicate relationship between chaos and order.',
                            medium: 'Watercolor on paper',
                            year: 2024,
                            category: 'paintings',
                            price: 750.00,
                            image_url: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=500&h=500&fit=crop',
                            dimensions: '18" x 24"',
                            availability: 'sold',
                            featured: 0
                        },
                        {
                            title: 'Cyber Bloom',
                            description: 'Nature meets technology in this vibrant piece exploring digital organic forms.',
                            medium: 'Digital art',
                            year: 2024,
                            category: 'digital',
                            price: 450.00,
                            image_url: 'https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=500&h=500&fit=crop',
                            dimensions: 'Print: 12" x 16"',
                            availability: 'available',
                            featured: 1
                        }
                    ];

                    const insertPainting = this.db.prepare(`
                        INSERT INTO paintings (title, description, medium, year, category, price, image_url, dimensions, availability, featured)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `);

                    samplePaintings.forEach(painting => {
                        insertPainting.run(
                            painting.title,
                            painting.description,
                            painting.medium,
                            painting.year,
                            painting.category,
                            painting.price,
                            painting.image_url,
                            painting.dimensions,
                            painting.availability,
                            painting.featured
                        );
                    });

                    insertPainting.finalize();
                    console.log('Sample paintings inserted');
                }

                resolve();
            });
        });
    }

    // Painting CRUD operations
    getAllPaintings() {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT * FROM paintings ORDER BY created_at DESC', (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    getPaintingsByCategory(category) {
        return new Promise((resolve, reject) => {
            if (category === 'all') {
                this.getAllPaintings().then(resolve).catch(reject);
            } else {
                this.db.all('SELECT * FROM paintings WHERE category = ? ORDER BY created_at DESC', [category], (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
            }
        });
    }

    getPaintingById(id) {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT * FROM paintings WHERE id = ?', [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    addPainting(painting) {
        return new Promise((resolve, reject) => {
            const { title, description, medium, year, category, price, image_url, dimensions, availability, featured } = painting;
            
            this.db.run(`
                INSERT INTO paintings (title, description, medium, year, category, price, image_url, dimensions, availability, featured, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            `, [title, description, medium, year, category, price, image_url, dimensions, availability || 'available', featured || 0], function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, ...painting });
            });
        });
    }

    updatePainting(id, painting) {
        return new Promise((resolve, reject) => {
            const { title, description, medium, year, category, price, image_url, dimensions, availability, featured } = painting;
            
            this.db.run(`
                UPDATE paintings 
                SET title = ?, description = ?, medium = ?, year = ?, category = ?, 
                    price = ?, image_url = ?, dimensions = ?, availability = ?, featured = ?, 
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `, [title, description, medium, year, category, price, image_url, dimensions, availability, featured, id], function(err) {
                if (err) reject(err);
                else resolve({ id, ...painting });
            });
        });
    }

    deletePainting(id) {
        return new Promise((resolve, reject) => {
            this.db.run('DELETE FROM paintings WHERE id = ?', [id], function(err) {
                if (err) reject(err);
                else resolve({ deleted: this.changes > 0 });
            });
        });
    }

    getFeaturedPaintings() {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT * FROM paintings WHERE featured = 1 ORDER BY created_at DESC LIMIT 4', (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    close() {
        if (this.db) {
            this.db.close((err) => {
                if (err) {
                    console.error('Error closing database:', err);
                } else {
                    console.log('Database connection closed');
                }
            });
        }
    }
}

module.exports = new Database();