import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { usersTable } from './db/schema.js';
const db = drizzle(process.env.DATABASE_URL);
import { sql ,getTableColumns} from 'drizzle-orm' 
// async function main() {
//   const user: typeof usersTable.$inferInsert = {
//     name: 'John',
//     age: 30,
//     email: 'john@example.com',
//   };

//   await db.insert(usersTable).values(user);
//   console.log('New user created!')

//   const users = await db.select().from(usersTable);
//   console.log('Getting all users from the database: ', users)
//   /*
//   const users: {
//     id: number;
//     name: string;
//     age: number;
//     email: string;
//   }[]
//   */
// }

export async function init(orderid, latitude, longitude) {
    await db.insert(usersTable).values({
    orderid: orderid,
    location: {x: longitude,y:latitude}
})}

export async function findorder(latitude, longitude) {
    const point = {
        x:longitude,
        y:latitude
    }

    const sqlPoint = sql`ST_SetSRID(ST_MakePoint(${point.x}, ${point.y}), 4326)`;
    const order = await db
    .select({
        ...getTableColumns(usersTable),
        distance: sql`ST_Distance(${usersTable.location}, ${sqlPoint})`,
    })
    .from(usersTable)
    .where(eq(usersTable.status, 'unclaimed'))
    .orderBy(sql`${usersTable.location} <-> ${sqlPoint}`)
    .limit(1);

    return order
}

export async function claim(orderid) {
    await db.update(usersTable)
    .set({status: 'claimed'}).where(eq(usersTable.orderid, orderid))
}

export async function remdistance(orderid, latitude, longitude) {
    const point = {
        x: longitude,
        y: latitude
    };

    const sqlPoint = sql`ST_SetSRID(ST_MakePoint(${point.x}, ${point.y}), 4326)::geography`;
    
    const res = await db.execute(sql`
      SELECT ST_Distance(location::geography, ${sqlPoint}) AS st_distance
      FROM users
      WHERE orderid = ${orderid}
      LIMIT 1;
    `);

    console.log(res);
    return res.rows[0].st_distance;
}

// main();
