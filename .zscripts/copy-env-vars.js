const fs = require('fs');

const srcPath = '/home/ocutbre/Documentos/webs/MaldonadoJorgeElectricidad/.env.local';
const destPath = '/home/ocutbre/Documentos/webs/MaldonadoJorgeNext/.env';

if (!fs.existsSync(srcPath)) {
  console.error("Source .env.local does not exist at:", srcPath);
  process.exit(1);
}

// Helper to parse env format
function parseEnv(content) {
  const result = {};
  const lines = content.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.substring(0, idx).trim();
    let val = trimmed.substring(idx + 1).trim();
    if (val.startsWith('"') && val.endsWith('"')) {
      val = val.substring(1, val.length - 1);
    } else if (val.startsWith("'") && val.endsWith("'")) {
      val = val.substring(1, val.length - 1);
    }
    result[key] = val;
  }
  return result;
}

const srcVars = parseEnv(fs.readFileSync(srcPath, 'utf8'));
const destVars = fs.existsSync(destPath) ? parseEnv(fs.readFileSync(destPath, 'utf8')) : {};

// Merge keys
const merged = {
  DATABASE_URL: destVars.DATABASE_URL || 'file:/home/ocutbre/Documentos/webs/MaldonadoJorgeNext/db/custom.db',
  FIREBASE_SERVICE_ACCOUNT_KEY: srcVars.FIREBASE_SERVICE_ACCOUNT_KEY || '',
  RESEND_API_KEY: srcVars.RESEND_API_KEY || '',
  TO_EMAIL: srcVars.TO_EMAIL || 'jorgitobaliero@gmail.com',
  GOOGLE_CLIENT_ID: destVars.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: destVars.GOOGLE_CLIENT_SECRET || '',
  NEXTAUTH_SECRET: destVars.NEXTAUTH_SECRET || 'a7df93b823dc10b9f84824d5b62b70f074d284a1e948c26922998a44d825b741',
  NEXTAUTH_URL: destVars.NEXTAUTH_URL || 'http://localhost:3000'
};

// Format back to .env
const output = `DATABASE_URL="${merged.DATABASE_URL}"

# Firebase Service Account (copiado directamente por script)
FIREBASE_SERVICE_ACCOUNT_KEY="${merged.FIREBASE_SERVICE_ACCOUNT_KEY}"

# Resend Mailer (copiado directamente por script)
RESEND_API_KEY="${merged.RESEND_API_KEY}"
TO_EMAIL="${merged.TO_EMAIL}"

# Configuración de Google Login (OAuth para /admin)
GOOGLE_CLIENT_ID="${merged.GOOGLE_CLIENT_ID}"
GOOGLE_CLIENT_SECRET="${merged.GOOGLE_CLIENT_SECRET}"

# Configuración de Sesiones NextAuth
NEXTAUTH_SECRET="${merged.NEXTAUTH_SECRET}"
NEXTAUTH_URL="${merged.NEXTAUTH_URL}"
`;

fs.writeFileSync(destPath, output, 'utf8');
console.log("Successfully merged env variables with byte-accuracy!");
