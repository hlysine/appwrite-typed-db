# appwrite-typed-db

A strongly typed API wrapper for Appwrite Tables DB.

## Usage

**1. Install the package**

```bash
npm install appwrite-typed-db
# or
yarn add appwrite-typed-db
# or
pnpm add appwrite-typed-db
# or
bun add appwrite-typed-db
```

**2. Define your database schema**

```typescript
type User = {
  name: string;
  age: number | null;
  isActive: boolean;
  posts: Post[];
}

type Post = {
  title: string;
  author: User;
  content: string | null;
}

// schema keys should correspond to your table IDs
export type Schema = {
  users: User;
  posts: Post;
}
```

**3. Initialize `TypedTables` with your schema**

```typescript
import { Client, TablesDB } from 'node-appwrite';
import { TypedTables } from 'appwrite-typed-db';
import { Schema } from './path-to-your-schema-file.ts';

const client = new Client()
  .setEndpoint('https://YOUR_APPWRITE_ENDPOINT')
  .setProject('YOUR_PROJECT_ID');

const db = new TablesDB(client);

// Provide your schema as a generic parameter
const typed = new TypedTables<Schema>(db);
```

**4. Use the strongly typed methods**

Note that certain methods from `TablesDB` are unavailable via the typed wrapper because the wrapper does not allow mutations that deviate from the schema.

```typescript
// Create a new user
const newUser = await typed.getRow({
  databaseId: 'your-database-id',
  tableId: 'users',
  rowId: 'user-id',
  select: ['name', 'age', 'isActive', 'posts.title'] // this provides editor hints and replaces Query.select()
});

console.log(newUser.name); // string
console.log(newUser.posts[0].title); // string

// @ts-expect-error - content was not selected
console.log(newUser.posts[0].content);
```