import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function executeQuery<T>(query: ReturnType<typeof sql>): Promise<T> {
  try {
    const result = await query;
    return result as T;
  } catch (error) {
    console.error('Database query error:', error);
    throw new Error('Database operation failed. Please try again.');
  }
}

export async function createTables() {
  await executeQuery(sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY,
      clerk_id STRING UNIQUE,
      email STRING,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS links (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID,
      original_url TEXT NOT NULL,
      short_url STRING UNIQUE NOT NULL,
      title STRING,
      description TEXT,
      password STRING,
      expires_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS analytics (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      link_id UUID NOT NULL,
      visitor_ip STRING,
      user_agent STRING,
      referer STRING,
      device_type STRING,
      browser STRING,
      country STRING,
      city STRING,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (link_id) REFERENCES links(id)
    );

    CREATE TABLE IF NOT EXISTS teams (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name STRING NOT NULL,
      created_by UUID NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id)
    );
  `);
}

export { sql }; 