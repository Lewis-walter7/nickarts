
import dbConnect from '../lib/db';

async function testConnection() {
    console.log("Testing MongoDB Connection...");
    try {
        const conn = await dbConnect();
        console.log("SUCCESS: Connected to MongoDB!");
        console.log("Database Name:", conn.connection.name);
        process.exit(0);
    } catch (error) {
        console.error("FAILURE: Could not connect to MongoDB.");
        console.error(error);
        process.exit(1);
    }
}

testConnection();
