import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';

const DB_NAME = 'contact_book_db';
const sqlite = new SQLiteConnection(CapacitorSQLite);

let dbConnection = null;
let mockContacts = [];
let mockIdCounter = 1;

export const initDB = async () => {
    try {
        if (!Capacitor.isNativePlatform()) {
            console.warn("Running on Web: Using in-memory mock database.");
            if (mockContacts.length === 0) {
                mockContacts = [
                    { id: mockIdCounter++, name: '王小明', phone: '0912-345-678', company: '測試科技', email: 'wang@test.com', avatar: '' },
                    { id: mockIdCounter++, name: '李大華', phone: '0987-654-321', company: '範例實業', email: 'lee@example.com', avatar: '' }
                ];
            }
            return;
        }

        const ret = await sqlite.createConnection(DB_NAME, false, "no-encryption", 1, false);
        dbConnection = ret;

        await dbConnection.open();

        const query = `
            CREATE TABLE IF NOT EXISTS contacts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                phone TEXT,
                company TEXT,
                email TEXT,
                avatar TEXT
            );
        `;

        await dbConnection.execute(query);
        console.log("Database initialized and table created.");

    } catch (err) {
        console.error("Error initializing DB:", err);
        throw err;
    }
};

export const getDB = async () => {
    if (!Capacitor.isNativePlatform()) return null;
    if (!dbConnection) {
        await initDB();
    }
    return dbConnection;
};

export const createContact = async (contact) => {
    if (!Capacitor.isNativePlatform()) {
        const newContact = { ...contact, id: mockIdCounter++ };
        mockContacts = [newContact, ...mockContacts];
        return 1;
    }
    const db = await getDB();
    const query = `INSERT INTO contacts (name, phone, company, email, avatar) VALUES (?, ?, ?, ?, ?)`;
    const values = [contact.name, contact.phone, contact.company, contact.email, contact.avatar];
    const ret = await db.run(query, values);
    return ret.changes;
};

export const getContacts = async () => {
    if (!Capacitor.isNativePlatform()) {
        return [...mockContacts];
    }
    const db = await getDB();
    const query = `SELECT * FROM contacts ORDER BY id DESC`;
    const ret = await db.query(query);
    return ret.values;
};

export const updateContact = async (contact) => {
    if (!Capacitor.isNativePlatform()) {
        const index = mockContacts.findIndex(c => c.id === contact.id);
        if (index !== -1) {
            mockContacts[index] = contact;
            return 1;
        }
        return 0;
    }
    const db = await getDB();
    const query = `UPDATE contacts SET name=?, phone=?, company=?, email=?, avatar=? WHERE id=?`;
    const values = [contact.name, contact.phone, contact.company, contact.email, contact.avatar, contact.id];
    const ret = await db.run(query, values);
    return ret.changes;
};

export const deleteContact = async (id) => {
    if (!Capacitor.isNativePlatform()) {
        mockContacts = mockContacts.filter(c => c.id !== id);
        return 1;
    }
    const db = await getDB();
    const query = `DELETE FROM contacts WHERE id=?`;
    const ret = await db.run(query, [id]);
    return ret.changes;
};
