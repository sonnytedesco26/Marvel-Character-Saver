import gql from 'graphql-tag';

export const GET_ME = gql`
    {
        me {
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