
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
// Try .env if .env.local fails
if (!process.env.MONGODB_URI) {
    dotenv.config({ path: '.env' });
}

const uri = process.env.MONGODB_URI;

if (!uri) {
    console.error("ERROR: MONGODB_URI is not set.");
    process.exit(1);
}

try {
    // Basic validation
    if (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://")) {
        console.error("ERROR: Invalid protocol. Must start with mongodb:// or mongodb+srv://");
    }

    // Mask password for safe output
    const masked = uri.replace(/:([^:@]+)@/, ":****@");
    console.log("Loaded URI:", masked);

    // Extract hostname
    const match = uri.match(/@([^/?]+)/);
    if (match && match[1]) {
        console.log("Hostname:", match[1]);
    } else {
        console.error("ERROR: Could not extract hostname.");
    }
} catch (e) {
    console.error("ERROR parsing URI:", e);
}
