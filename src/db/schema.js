
import { integer, pgTable, geometry, varchar } from "drizzle-orm/pg-core"

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  orderid: varchar().notNull(),
  location: geometry({type: 'point', mode:'xy', srid:4326}),
  status: varchar().default('unclaimed')
});
