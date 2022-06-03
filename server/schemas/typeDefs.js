const { gql } = require('apollo-server-express');
//ARRAY inicated with bracket, ! is required
const typeDefs = gql`

  type User {
    userId: ID!
    username: String
    email: String
    characterCount: Int
    savedCharacters: [Character]
  }

  type Character {
    characterId: ID
    apiId: String!
  }

  input SavedCharacters {
    characterId: ID!
    userId: ID!
}

  type Auth {
      token: ID!
      user: User
  }
  
  type Query {
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveCharacter(characterData: SavedCharacters): User
    removeCharacter(characterId: ID!): User
  }
`;

module.exports = typeDefs;
