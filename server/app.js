// Importovanie modulov
const express = require('express');
const app = express();
const crypto = require("crypto");
const port = 8000;
const Ajv = require("ajv")
const ajv = new Ajv()
const db = require('./db');

// Validacna schema pre vytvorenie novej offer
const offerSchema = {
  type: "object",
  properties: {
    name: { 
      type: "string",
      pattern: "^[A-Za-zÀ-ž\\s]{2,}$",
      minLength: 2,
      maxLength: 50
    },
    surname: { 
      type: "string",
      pattern: "^[A-Za-zÀ-ž\\s]{2,}$",
      minLength: 2,
      maxLength: 50
    },
    email: {
      type: "string",
      pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
      maxLength: 100
    },
    phone: {
      type: "string",
      pattern: "^\\+?[0-9]{9,15}$",
      maxLength: 20
    },
    offers: { 
      type: "string",
      minLength: 5,
      maxLength: 200
    },
    wants: { 
      type: "string",
      minLength: 5,
      maxLength: 200
    },
    location: { 
      type: "string",
      pattern: "^[A-Za-zÀ-ž\\s\\-,0-9]{2,}$",
      minLength: 2,
      maxLength: 100
    }
  },
  required: ["name", "surname", "email", "phone", "offers", "wants", "location"],
  additionalProperties: false
}

// Urobim si validacnu schemu pre update udaje, aby som nemusel poslat vsetky data danej offer
const partialOfferSchema = {
  type: "object",
  properties: {
    name: { 
      type: "string",
      pattern: "^[A-Za-zÀ-ž\\s]{2,}$",
      minLength: 2,
      maxLength: 50
    },
    surname: { 
      type: "string",
      pattern: "^[A-Za-zÀ-ž\\s]{2,}$",
      minLength: 2,
      maxLength: 50
    },
    email: {
      type: "string",
      pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
      maxLength: 100
    },
    phone: {
      type: "string",
      pattern: "^\\+?[0-9]{9,15}$",
      maxLength: 20
    },
    offers: { 
      type: "string",
      minLength: 5,
      maxLength: 200
    },
    wants: { 
      type: "string",
      minLength: 5,
      maxLength: 200
    },
    location: { 
      type: "string",
      pattern: "^[A-Za-zÀ-ž\\s\\-,0-9]{2,}$",
      minLength: 2,
      maxLength: 100
    }
  },
  additionalProperties: false,
  minProperties: 1
}

// Implemntacia ajv pre validaciu
const validateOffer = ajv.compile(offerSchema)
const validatePartialOffer = ajv.compile(partialOfferSchema)

app.use(express.json());

// Endpoint - GET /offers/list
app.get('/offers/list', async (req, res) => {
  try {
    // Z tabulky offers vyberiem vsetky udaje a vypisem ich
    const result = await db.query('SELECT * FROM offers ORDER BY created_at DESC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({
      code: "database_error",
      message: "Internal server error occurred while fetching offers"
    });
  }
});

// Endpoint - POST /offers/create
app.post('/offers/create', async (req, res) => {
  const body = req.body;
  const valid = validateOffer(body)
  if (!valid) {
    return res.status(400).json({
      code: "validation_error",
      message: "Provided data is not valid",
      details: validateOffer.errors
    });
  }

  const id = crypto.randomBytes(16).toString("hex");
  try {
    // Do tabulky offers vlozim novu offer
    const result = await db.query(
      'INSERT INTO offers (id, name, surname, email, phone, offers, wants, location) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [id, body.name, body.surname, body.email, body.phone, body.offers, body.wants, body.location]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({
      code: "database_error",
      message: "Internal server error occurred while creating offer"
    });
  }
});

// Endpoint - GET /offers/read
app.get('/offers/read', async (req, res) => {
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({
      code: "invalid_input",
      message: "Offer ID is required"
    });
  }

  try {
    // Hladam offer podla ID
    const result = await db.query('SELECT * FROM offers WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        code: "not_found",
        message: `Offer with ID ${id} was not found`
      });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({
      code: "database_error",
      message: "Internal server error occurred while fetching offer"
    });
  }
});

// Endpoint - DELETE /offers/delete
app.delete('/offers/delete', async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({
      code: "invalid_input",
      message: "Offer ID is required"
    });
  }

  try {
    // Zmazem offer podla ID
    const result = await db.query('DELETE FROM offers WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        code: "not_found",
        message: `Offer with ID ${id} was not found`
      });
    }
    res.status(200).json({
      code: "success",
      message: "Offer was successfully deleted"
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({
      code: "database_error",
      message: "Internal server error occurred while deleting offer"
    });
  }
});

// Endpoint - PUT /offers/update
app.put('/offers/update', async (req, res) => {
  const { id } = req.query;
  const body = req.body;

  if (!id) {
    return res.status(400).json({
      code: "invalid_input",
      message: "Offer ID is required"
    });
  }
 
  const validPartial = validatePartialOffer(body);
  if (!validPartial) {
    return res.status(400).json({
      code: "validation_error",
      message: "Provided data is not valid",
      details: validatePartialOffer.errors
    });
  }

  try {
    // Hladam offer podla ID
    const existingOffer = await db.query('SELECT * FROM offers WHERE id = $1', [id]);
    
    if (existingOffer.rows.length === 0) {
      return res.status(404).json({
        code: "not_found",
        message: `Offer with ID ${id} was not found`
      });
    }

    // Vztvorim si objekt s novymi hodnotami, tam kde som neposlal novu hodnotu sa zoberie stara
    const updates = {
      name: body.name !== undefined ? body.name : existingOffer.rows[0].name,
      surname: body.surname !== undefined ? body.surname : existingOffer.rows[0].surname,
      email: body.email !== undefined ? body.email : existingOffer.rows[0].email,
      phone: body.phone !== undefined ? body.phone : existingOffer.rows[0].phone,
      offers: body.offers !== undefined ? body.offers : existingOffer.rows[0].offers,
      wants: body.wants !== undefined ? body.wants : existingOffer.rows[0].wants,
      location: body.location !== undefined ? body.location : existingOffer.rows[0].location
    };

    // Aktualizujem stlpce so vstupnymi hodnotami
    const result = await db.query(
      'UPDATE offers SET name = $1, surname = $2, email = $3, phone = $4, offers = $5, wants = $6, location = $7 WHERE id = $8 RETURNING *',
      [updates.name, updates.surname, updates.email, updates.phone, updates.offers, updates.wants, updates.location, id]
    );

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({
      code: "database_error",
      message: "Internal server error occurred while updating offer"
    });
  }
});

// Endpoint - GET /offers/search - pre filtrovanie, filtrovanie na backende mi vyhovuje viac ako na frontende
app.get('/offers/search', async (req, res) => {
  const { offers: offerType, wants, location } = req.query;
  let query = 'SELECT * FROM offers WHERE 1=1';
  const params = [];
  let paramCount = 1;
  
  // Filter na offers pre 3 kriteria, podla "paramCount"u
  if (offerType) {
    query += ` AND offers = $${paramCount}`;
    params.push(offerType);
    paramCount++;
  }
  if (wants) {
    query += ` AND wants = $${paramCount}`; // Podla "paramCount"u (akoby pozicia parametra v query)
    params.push(wants);
    paramCount++;
  }
  if (location) {
    query += ` AND location = $${paramCount}`;
    params.push(location);
  }

  try {
    // Vyberiem si offers z db podla params
    const result = await db.query(query, params);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({
      code: "database_error",
      message: "Internal server error occurred while searching offers"
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
