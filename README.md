1. Task:  [Task](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/graphql-service/assignment.md)
2. Solution: [Repository with solution](https://github.com/Alex99like/rsschool-nodejs-task-graphql/tree/develop)


### ***Types***
```
Post {
  id: ID
  content: String
  title: String
  userId: ID
}
```
```
MemberType {
  id: ID
  discount: Number
  monthPostsLimit: Number
}
```
```
Profile {
  id: ID
  userId: ID
  avatar: String
  sex: String
  birthday: Number
  country: String
  street: String
  city: String
  memberType: MemberType
  memberTypeId: ID
}
```
```
User {
  id: ID
  firstName: String
  lastName: String
  email: String
  posts: [Post]
  profile: Profile
  subscribedToUserIds: [ID]
  usersSubscribedTo: [User]
  subscribedToUser: [User]
}
```
:white_check_mark: (+72) Task 1: restful endpoints.
:white_check_mark: (+72) Subtasks 2.1-2.7: get gql queries.
- [x] 2.1. Получение пользователей, профилей, записей, типов участников - 4 операции в одном запросе.
```
{
  users { ...User }
  posts { ...Post }
  profiles { ...Profile }
  memberTypeId { ...MemberType } 
}
```
#### Example
```
{
  users {id firstName lastName email subscribedToUserIds}
  posts {id content title userId}
  profiles {id avatar sex birthday country street city userId memberTypeId {id}}
  memberTypes {id discount monthPostsLimit}
}

```
- [x] 2.2 Получение пользователя, профиля, записи, memberType по id - 4 операции в одном запросе.
```
{
  user(id: ID) { ...User }
  posts(id: ID) { ...Post }
  profile(id: ID) { ...Profile }
  memberType(id: ID) { ...MemberType } 
}
```
#### Example
```
{
  user(id: 'sada-213-wda') {id firstName lastName email subscribedToUserIds}
  post(id: 'id: 'sada-213-wda') {id content title userId}
  profile(id: 'id: 'sada-213-wda'') {id avatar sex birthday country street city userId memberTypeId {id}}
  memberType(id: 'sada-213-wda') {id discount monthPostsLimit}
}
```

- [x] 2.3. Получайте пользователей с их постами, профилями, типами участников.
```
{
 users {
    posts { ...Post }
    profile {
      ...Profile
      memberType: { ...MemberType } 
    }
  }
}
```
#### Example
```
{
   users {
     posts {id content userId title}
     profile {id avatar sex birthday country street city userId memberTypeId memberType {id discount monthPostsLimit}}
  }
}
```
- [x] 2.4 Получить пользователя по id с его постами, профилем, типом участника.
```
{
 user(id: ID) {
    posts { ...Post }
    profile {
      ...Profile
      memberType: { ...MemberType } 
    }
  }
}
```
#### Example
```
{
   user(id: 'sdasd-dsa2-12') {
     posts {id content userId title}
     profile {id avatar sex birthday country street city userId memberType {id discount monthPostsLimit}}
  }
}
```
- [x] 2.5. Получайте пользователей с их профилем
```
{
  users {
    profile { ...Profile }
  }
}
```
#### Example
```
{
  users {id firstName lastName email 
  profile {id avatar sex birthday country street city userId memberTypeId {id discount monthPostsLimit}}}
}
```

- [x] 2.6. Получить пользователя по id с его , постами.
```
{
  user(id: ID) {
    posts { ...Posts }
  }
}
```
#### Example
```
{
   users {
     id firstName lastName email
     posts {id content title userId}
   }
}
```
- [x] 2.7. Получите пользователей со своим userSubscribedTo, subscribedToUser
```
{
  users {
    usersSubscribedTo: [User]
    subscribedToUser: [User]
  }
}
```
#### Example
```
{
   users {
     usersSubscribedTo {id firstName lastName email}
     subscribedToUser {id firstName lastName email}
  }
}
```
:white_check_mark: (+54) Subtasks 2.8-2.11: create gql queries.
### ***Input Types***
- [x] 2.11. InputObjectType для объектов DTO.
```
createUserInput {
  firstName: String!
  lastName: String!
  email: String!
}
```
```
createProfileInput {
  userId: ID!
  avatar: String!
  sex: String!
  birthday: Number!
  country: String!
  street: String!
  city: String!
  memberTypeId: ID!
}
```
```
createInputPost {
  content: String!
  title: String!
  userId: ID!
}
```
:white_check_mark: (+54 Subtasks 2.12-2.17: update gql queries.
- [x] 2.8. Создать пользователя.
```
mutation {
  createUser (input: createUserInput) { ...User }
}
```
#### Example
```
mutation {
  createUser(input: {
    firstName: "name one"
    lastName: "last one"
    email: "test@test"
  }) {
    id
    email
    firstName
    lastName
  }
}
```
- [x] 2.9. Создание профиля.
```
mutation {
  createProfile (input: createProfileInput) { ...Profile}
}
```
#### Example
```
mutation {
  createProfile(input: {
    avatar: "avatar"
    sex: "men"
    birthday: 1902
    country: "RB"
    street: "bayker"
    city: "Minsk"
    memberTypeId: "basic"
    userId: "de202322-09bf-4bfe-8cff-482f0edb23e6"
  }) {
    id
    avatar
    sex
    birthday
    country
    street
    city
    userId
    memberTypeId {
      id
      discount
      monthPostsLimit
    }
  }
}
```
- [x] 2.10. Создать пост..
```
mutation {
  createPost (input: createPostInput) { ...Post }
}
```
#### Example
```
mutation {
  createPost(input: {
    content: "content"
    title: "title"
    userId: "e86faae8-665b-43f6-9ab7-1bc4d6272a62"
  }) {
    id
    content
    title
    userId
  }
}
```
:white_check_mark: (+54) Subtasks 2.12-2.17: update gql queries.

### ***Input Types***
InputObjectType для объектов DTO.
```
updateUserInput {
  id: ID
  firstName: String?
  lastName: String?
  email: String?
}
```
```
updateProfileInput {
  id: ID!
  avatar: String?
  sex: String?
  birthday: Number?
  country: String?
  street: String?
  city: String?
  memberTypeId: ID?
}
```
```
updateInputPost {
  id: ID!
  content: String?
  title: String?
}
```
```
updateMemberInput {
  id: ID!
  discount: Number?
  monthPostsLimit: Number?
}
```
```
subscribeUserInput {
  id: ID!
  userId: ID!
}
```
```
unSubscribeUserInput {
  id: ID!
  userId: ID!
}
```
- [x] 2.12. Обновление пользователя.
```
mutation {
  updateUser(input: updateUserInput) { ...User }
}
```
#### Example
```
mutation {
  updateUser(input: {
    id: "user-id"
    firstName: "name one 1"
    lastName: "last one 1"
    email: "test@test 1"
  }) {
    id
    email
    firstName
    lastName
  }
}
```
- [x] 2.13. Обновление профиля.
```
mutation {
  updateProfile(input: updateProfileInput) { ...Profile }
}
```
#### Example
```
mutation {
  createProfile(input: {
    id: "profile-id"
    avatar: "avatar"
    sex: "men"
    birthday: 1932
    country: "RB"
    street: "bayker1"
    city: "Minsk1"
    memberTypeId: "basic1"
  }) {
    id
    avatar
    sex
    birthday
    country
    street
    city
    userId
    memberTypeId {
      id
      discount
      monthPostsLimit
    }
  }
}
```
- [x] 2.14. Обновление поста.
```
mutation {
  updatePost(input: updatePostInput) { ...Post}
}
```
#### Example
```
mutation {
  updatePost(input: {
    content: "content"
    id: "e86faae8-665b-43f6-9ab7-1bc4d6272a62"
  }) {
    id
    content
    title
    userId
  }
}
```
- [x] 2.15. Обновление Memer Type.
```
mutation {
  updateMemberType(input: updateMemberInput) { ...MemberType }
}
```
#### Example
```
mutation {
  updateMemberType(input: {
    id: "basic"
    discount: 1000
    monthPostsLimit: 1000
  }) {
    id
    discount
    monthPostsLimit
  }
}
```
- [x] 2.16. Подписаться на; отписаться от.
```
mutation {
  subscribeUser(input: subscribeUserInput) { ...User }
}
```
#### Example
```
mutation {
  subscribeUser(input: {
    id: "e587577e-f928-4541-b682-ebe9f8d66416"
    userId: "1234124-f928-4541-3daw-21312dadfwda"
  }) {
    id
    firstName
    lastName
    email
  }
}
```
```
mutation {
  unSubscribeUser(input: unSubscribeUserInput) { ...User }
}
```
#### Example
```
mutation {
  unSubscribeUser(input: {
    id: "e587577e-f928-4541-b682-ebe9f8d66416"
    userId: "1234124-f928-4541-3daw-21312dadfwda"
  }) {
    id
    firstName
    lastName
    email
  }
}
```

:white_check_mark:  (+88) Task 3: solve n+1 graphql problem.
:white_check_mark:  (+20) Task 4: limit the complexity of the graphql queries.
## Assignment: Graphql
### Tasks:
1. Add logic to the restful endpoints (users, posts, profiles, member-types folders in ./src/routes).  
   1.1. npm run test - 100%  
2. Add logic to the graphql endpoint (graphql folder in ./src/routes).  
Constraints and logic for gql queries should be done based on restful implementation.  
For each subtask provide an example of POST body in the PR.  
All dynamic values should be sent via "variables" field.  
If the properties of the entity are not specified, then return the id of it.  
`userSubscribedTo` - these are users that the current user is following.  
`subscribedToUser` - these are users who are following the current user.  
   
   * Get gql requests:  
   2.1. Get users, profiles, posts, memberTypes - 4 operations in one query.  
   2.2. Get user, profile, post, memberType by id - 4 operations in one query.  
   2.3. Get users with their posts, profiles, memberTypes.  
   2.4. Get user by id with his posts, profile, memberType.  
   2.5. Get users with their `userSubscribedTo`, profile.  
   2.6. Get user by id with his `subscribedToUser`, posts.  
   2.7. Get users with their `userSubscribedTo`, `subscribedToUser` (additionally for each user in `userSubscribedTo`, `subscribedToUser` add their `userSubscribedTo`, `subscribedToUser`).  
   * Create gql requests:   
   2.8. Create user.  
   2.9. Create profile.  
   2.10. Create post.  
   2.11. [InputObjectType](https://graphql.org/graphql-js/type/#graphqlinputobjecttype) for DTOs.  
   * Update gql requests:  
   2.12. Update user.  
   2.13. Update profile.  
   2.14. Update post.  
   2.15. Update memberType.  
   2.16. Subscribe to; unsubscribe from.  
   2.17. [InputObjectType](https://graphql.org/graphql-js/type/#graphqlinputobjecttype) for DTOs.  

3. Solve `n+1` graphql problem with [dataloader](https://www.npmjs.com/package/dataloader) package in all places where it should be used.  
   You can use only one "findMany" call per loader to consider this task completed.  
   It's ok to leave the use of the dataloader even if only one entity was requested. But additionally (no extra score) you can optimize the behavior for such cases => +1 db call is allowed per loader.  
   3.1. List where the dataloader was used with links to the lines of code (creation in gql context and call in resolver).  
4. Limit the complexity of the graphql queries by their depth with [graphql-depth-limit](https://www.npmjs.com/package/graphql-depth-limit) package.   
   4.1. Provide a link to the line of code where it was used.  
   4.2. Specify a POST body of gql query that ends with an error due to the operation of the rule. Request result should be with `errors` field (and with or without `data:null`) describing the error.  

### Description:  
All dependencies to complete this task are already installed.  
You are free to install new dependencies as long as you use them.  
App template was made with fastify, but you don't need to know much about fastify to get the tasks done.  
All templates for restful endpoints are placed, just fill in the logic for each of them.  
Use the "db" property of the "fastify" object as a database access methods ("db" is an instance of the DB class => ./src/utils/DB/DB.ts).  
Body, params have fixed structure for each restful endpoint due to jsonSchema (schema.ts files near index.ts).  

### Description for the 1 task:
If the requested entity is missing - send 404 http code.  
If operation cannot be performed because of the client input - send 400 http code.  
You can use methods of "reply" to set http code or throw an [http error](https://github.com/fastify/fastify-sensible#fastifyhttperrors).  
If operation is successfully completed, then return an entity or array of entities from http handler (fastify will stringify object/array and will send it).  

Relation fields are only stored in dependent/child entities. E.g. profile stores "userId" field.  
You are also responsible for verifying that the relations are real. E.g. "userId" belongs to the real user.  
So when you delete dependent entity, you automatically delete relations with its parents.  
But when you delete parent entity, you need to delete relations from child entities yourself to keep the data relevant.   
(In the next rss-school task, you will use a full-fledged database that also can automatically remove child entities when the parent is deleted, verify keys ownership and instead of arrays for storing keys, you will use additional "join" tables)  

To determine that all your restful logic works correctly => run the script "npm run test".  
But be careful because these tests are integration (E.g. to test "delete" logic => it creates the entity via a "create" endpoint).  

### Description for the 2 task:  
You are free to create your own gql environment as long as you use predefined graphql endpoint (./src/routes/graphql/index.ts).  
(or stick to the [default code-first](https://github.dev/graphql/graphql-js/blob/ffa18e9de0ae630d7e5f264f72c94d497c70016b/src/__tests__/starWarsSchema.ts))  

### Description for the 3 task:
If you have chosen a non-default gql environment, then the connection of some functionality may differ, be sure to report this in the PR.  

### Description for the 4 task:  
If you have chosen a non-default gql environment, then the connection of some functionality may differ, be sure to report this in the PR.  
Limit the complexity of the graphql queries by their depth with "graphql-depth-limit" package.  
E.g. User can refer to other users via properties `userSubscribedTo`, `subscribedToUser` and users within them can also have `userSubscribedTo`, `subscribedToUser` and so on.  
Your task is to add a new rule (created by "graphql-depth-limit") in [validation](https://graphql.org/graphql-js/validation/) to limit such nesting to (for example) 6 levels max.
