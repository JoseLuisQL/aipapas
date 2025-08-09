import { DB } from './sqlite';

export async function seed(db: DB) {
  // mock users
  await db.runAsync(`INSERT OR IGNORE INTO users (id, name, email, role, synced_at) VALUES
    ('u1', 'Juan Pérez', 'juan.perez@example.com', 'farmer', NULL),
    ('u2', 'María García', 'maria.garcia@example.com', 'admin', NULL)
  `);

  // mock varieties
  await db.runAsync(`INSERT OR IGNORE INTO varieties (id, name, description, characteristics, images) VALUES
    ('v1', 'Papa Amarilla', 'Papa de color amarillo y textura cremosa', '{"color":"amarilla","forma":"redonda","origen":"Andes"}', '[]'),
    ('v2', 'Papa Morada', 'Papa con piel morada, rica en antioxidantes', '{"color":"morada","forma":"ovalada","origen":"Andes"}', '[]'),
    ('v3', 'Papa Blanca', 'Papa blanca versátil para múltiples usos', '{"color":"blanca","forma":"alargada","origen":"Andes"}', '[]')
  `);

  // mock identifications
  await db.runAsync(`INSERT OR IGNORE INTO identifications (id, image_path, result, confidence, location, timestamp, synced) VALUES
    ('i1', 'file:///mock1.jpg', 'Papa Amarilla', 0.92, 'Cusco, PE', '2025-08-09T12:00:00Z', 1),
    ('i2', 'file:///mock2.jpg', 'Papa Morada', 0.87, 'Puno, PE', '2025-08-08T09:30:00Z', 0)
  `);

  // mock content
  await db.runAsync(`INSERT OR IGNORE INTO content (id, title, body, category, media, status) VALUES
    ('c1', 'Manejo de suelos para papas nativas', 'Contenido educativo mock', 'Suelos', '[]', 'published'),
    ('c2', 'Control de plagas', 'Contenido educativo mock', 'Plagas', '[]', 'draft')
  `);

  // mock feedback
  await db.runAsync(`INSERT OR IGNORE INTO feedback (id, user_id, message, created_at, status) VALUES
    ('f1', 'u1', 'La app es muy útil', '2025-08-07T10:00:00Z', 'new'),
    ('f2', 'u1', 'Me gustaría modo oscuro', '2025-08-08T11:00:00Z', 'reviewed')
  `);

}

