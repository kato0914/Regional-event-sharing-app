import { sql } from '@vercel/postgres';

export async function POST(request) {
  const { title, date, location, description } = await request.json();

  try {
    await sql`
      INSERT INTO events (title, date, location, description)
      VALUES (${title}, ${date}, ${location}, ${description})
    `;
    return new Response(JSON.stringify({ message: 'イベントが追加されました' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function GET() {
  try {
    const { rows } = await sql`SELECT * FROM events`;
    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}