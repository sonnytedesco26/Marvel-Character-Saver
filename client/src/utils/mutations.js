import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const SAVE_CHARACTER = gql`
    mutation saveCharacter($characterData: SavedCharacters!) {
        saveCharacter(characterData: $characterData) {
        _id
        username
        email
        savedCharacters {
                characterId
                characterName
                characterDescription
                characterImagePath
                characterImageExt
            }
        }
    }
`;

export const REMOVE_CHARACTER = gql`
    mutation removeCharacter($characterId: ID!) {
        removeCharacter(characterId: $characterId) {
            _id
            username
            email
            savedCharacters {
                characterId
                characterName
                characterDescription
                characterImagePath
                characterImageExt
            }
        }
    }
`;