import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const users = pgTable('users',{
    id: serial('id').primaryKey(),
    name: varchar('name',{length:250}).notNull(),
    email: varchar('email',{length:250}).notNull().unique(),
    password: varchar('password',{length:250}).notNull(),
    role: varchar('role',{length:250}).notNull().default('user'),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
})