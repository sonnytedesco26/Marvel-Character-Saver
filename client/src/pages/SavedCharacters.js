import React from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { REMOVE_CHARACTER } from '../utils/mutations';
import { removeCharacterId } from '../utils/localStorage';
import Auth from '../utils/auth';

const SavedCharacters = () => {
  const { loading, data } = useQuery(GET_ME);
  const [removeCharacter, { error }] = useMutation(REMOVE_CHARACTER);

  const userData = data?.me || {};

  const handleDeleteCharacter = async (characterId) => {
    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await removeCharacter({
        variables: { characterId },
      });

      removeCharacterId(characterId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing {userData.username}'s saved characters!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedCharacters?.length
            ? `Viewing ${userData.savedCharacters.length} saved ${
                userData.savedCharacters.length === 1 ? 'character' : 'characters'
              }:`
            : 'You have no saved characters!'}
        </h2>
        <CardColumns>
          {userData.savedCharacters?.map((character) => {
            return (
              <Card key={character.characterId} border='dark'>
                {character.characterImagePath+character.characterImageExt ? (
                  <Card.Img src={character.characterImagePath+character.characterImageExt} alt={`${character.characterName}`} variant='top' />
                ) : null}
                <Card.Body>
                  <Card.Title>{character.characterName}</Card.Title>
                  <Card.Text>{character.characterDescription}</Card.Text>
                  <Button
                    className='btn-block btn-danger'
                    onClick={() => handleDeleteCharacter(character.characterId)}>
                    SHOOT this Character!
                  </Button>
                  {error && <span className="ml-2">Something went wrong...</span>}
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedCharacters;
