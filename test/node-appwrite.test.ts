import { expect, test } from 'bun:test';
import { Client, TablesDB } from 'node-appwrite';
import { TypedDB } from '../lib/node-appwrite';

const client = new Client()
  .setEndpoint(Bun.env.APPWRITE_ENDPOINT!)
  .setProject(Bun.env.APPWRITE_PROJECT!)
  .setKey(Bun.env.APPWRITE_API_KEY!);

const db = new TablesDB(client);
const databaseId = Bun.env.APPWRITE_DATABASE!;

enum Status {
  ACTIVE = 'active',
  RESTRICTED = 'restricted',
  DELETED = 'deleted',
}

type User = {
  name: string;
  description: string | null;
  labels: string[] | null;
  age: number;
  experience: number;
  isAdmin: boolean;
  subscribedUntil: string | null;
  email: string | null;
  ip: string | null;
  homepage: string | null;
  status: Status;
  posts: Post[];
};

type Post = {
  title: string;
  content: string;
  author: User;
};

type Schema = {
  users: User;
  posts: Post;
};

// Provide your schema as a generic parameter
const typed = new TypedDB<Schema>(db);

test('sample test', async () => {
  const newUser = await typed.createRow({
    databaseId,
    tableId: 'users',
    rowId: 'unique()',
    data: {
      name: 'John Doe',
      description: null,
      labels: ['admin', 'user'],
      age: 30,
      experience: 5.5,
      isAdmin: true,
      subscribedUntil: null,
      email: null,
      ip: null,
      homepage: null,
      status: Status.ACTIVE,
      posts: [],
    },
  });
  expect(newUser).toEqual({
    $id: expect.any(String),
    $databaseId: databaseId,
    $tableId: 'users',
    $createdAt: expect.any(String),
    $updatedAt: expect.any(String),
    $permissions: [],
    $sequence: expect.any(Number),
    name: 'John Doe',
    description: null,
    labels: ['admin', 'user'],
    age: 30,
    experience: 5.5,
    isAdmin: true,
    subscribedUntil: null,
    email: null,
    ip: null,
    homepage: null,
    status: Status.ACTIVE,
    posts: [],
  });
  const newPost = await typed.createRow({
    databaseId,
    tableId: 'posts',
    rowId: 'unique()',
    data: {
      title: 'My first post',
      content: 'This is the content of my first post.',
      author: newUser.$id,
    },
  });
  expect(newPost).toEqual({
    $id: expect.any(String),
    $databaseId: databaseId,
    $tableId: 'posts',
    $createdAt: expect.any(String),
    $updatedAt: expect.any(String),
    $permissions: [],
    $sequence: expect.any(Number),
    title: 'My first post',
    content: 'This is the content of my first post.',
    author: {
      $id: newUser.$id,
      $databaseId: databaseId,
      $tableId: 'users',
      $createdAt: newUser.$createdAt,
      $updatedAt: expect.any(String),
      $permissions: [],
      $sequence: newUser.$sequence,
      name: 'John Doe',
      description: null,
      labels: ['admin', 'user'],
      age: 30,
      experience: 5.5,
      isAdmin: true,
      subscribedUntil: null,
      email: null,
      ip: null,
      homepage: null,
      status: Status.ACTIVE,
    },
  });
  const fetchedUser = await typed.getRow({
    databaseId,
    tableId: 'users',
    rowId: newUser.$id,
    select: ['name', 'age', 'status', 'posts.title'],
  });
  expect(fetchedUser).toEqual({
    $id: newUser.$id,
    $databaseId: databaseId,
    $tableId: 'users',
    $createdAt: newUser.$createdAt,
    $updatedAt: expect.any(String),
    $permissions: [],
    $sequence: newUser.$sequence,
    name: 'John Doe',
    age: 30,
    status: Status.ACTIVE,
    posts: [
      {
        $id: newPost.$id,
        $databaseId: databaseId,
        $tableId: 'posts',
        $createdAt: newPost.$createdAt,
        $updatedAt: newPost.$updatedAt,
        $permissions: [],
        $sequence: newPost.$sequence,
        title: 'My first post',
      },
    ],
  });
  const updatedUser = await typed.updateRow({
    databaseId,
    tableId: 'users',
    rowId: newUser.$id,
    data: {
      description: 'Updated description',
      labels: ['user'],
    },
  });
  expect(updatedUser).toEqual({
    $id: newUser.$id,
    $databaseId: databaseId,
    $tableId: 'users',
    $createdAt: newUser.$createdAt,
    $updatedAt: expect.any(String),
    $permissions: [],
    $sequence: newUser.$sequence,
    name: 'John Doe',
    description: 'Updated description',
    labels: ['user'],
    age: 30,
    experience: 5.5,
    isAdmin: true,
    subscribedUntil: null,
    email: null,
    ip: null,
    homepage: null,
    status: Status.ACTIVE,
    posts: [
      {
        $id: newPost.$id,
        $databaseId: databaseId,
        $tableId: 'posts',
        $createdAt: newPost.$createdAt,
        $updatedAt: newPost.$updatedAt,
        $permissions: [],
        $sequence: newPost.$sequence,
        title: 'My first post',
        content: 'This is the content of my first post.',
      },
    ],
  });
  const userResult = await typed.deleteRow({
    databaseId,
    tableId: 'users',
    rowId: newUser.$id,
  });
  expect(userResult).toEqual({ message: '' });
  const postResult = await typed.deleteRow({
    databaseId,
    tableId: 'posts',
    rowId: newPost.$id,
  });
  expect(postResult).toEqual({ message: '' });
});
