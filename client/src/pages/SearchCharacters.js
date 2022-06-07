//NEEDS FIXING AUTHORIZATION API
import React, { useState, useEffect } from 'react';
import { Jumbotron, Container, Col, Form, Button, Card, CardColumns } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { SAVE_CHARACTER } from '../utils/mutations';
import Auth from '../utils/auth';
import { saveCharacterIds, getSavedCharacterIds } from '../utils/localStorage';
// require('dotenv').config();
const PUBLIC_KEY = '4c60555fb25082e8557fd1240701259b';
const PRIVATE_KEY = 'f776fea30bec9385fe20297322454dd551aea210';

const md5 = require('md5');

const SearchCharacters = () => {
  // create state for holding returned api data
  const [searchedCharacters, setSearchedCharacters] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState('');

  const [savedCharacterIds, setSavedCharacterIds] = useState(getSavedCharacterIds());
  const [saveCharacter, { error }] = useMutation(SAVE_CHARACTER);

  useEffect(() => {
    return () => saveCharacterIds(savedCharacterIds);
  });

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {//MARVEL APII!!!!
      let ts = Date.now();
      let hash = md5(ts+PRIVATE_KEY+PUBLIC_KEY);
      const response = await fetch(`https://gateway.marvel.com:443/v1/public/characters?name=${searchInput}&apikey=${PUBLIC_KEY}&ts=${ts}&hash=${hash}`);

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const {data}  = await response.json();
      console.log(data);
      const characterData = data.results.map((character) => ({
        characterId: character.id,
        characterName: character.name,
        characterDescription: character.description,
        characterImagePath: character.thumbnail.path,
        characterImageExt: character.thumbnail.extension
    }));

      setSearchedCharacters(characterData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

  // create function to handle saving a char to our database
  const handleSaveCharacter = async (characterId) => {

    const characterToSave = searchedCharacters.find((character) => character.characterId === characterId);

    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await saveCharacter({
        variables: { characterData: { ...characterToSave } },
      });
      console.log(savedCharacterIds);
      setSavedCharacterIds([...savedCharacterIds, characterToSave.characterId]);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Search for Marvel Characters!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Form.Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Search for a character'
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='success' size='lg'>
                  Submit Search
                </Button>
              </Col>
            </Form.Row>
          </Form>
        </Container>
      </Jumbotron>

      <Container>
        <h2>
          {searchedCharacters.length
            ? `Viewing ${searchedCharacters.length} results:`
            : 'Search for a Marvel character to begin'}
        </h2>
        <CardColumns>
          {searchedCharacters.map((character) => {
            return (
              <Card key={character.characterId} border='dark'>
                {character.characterImagePath+'.'+character.characterImageExt ? (
                  <Card.Img src={character.characterImagePath+'.'+character.characterImageExt} alt={`${character.characterName}`} variant='top' />
                ) : null}
                <Card.Body>
                  <Card.Title>{character.characterName}</Card.Title>
                  <Card.Text>{character.characterDescription}</Card.Text>
                  {Auth.loggedIn() && (
                    <Button
                      disabled={savedCharacterIds?.some((savedId) => savedId === character.characterId)}
                      className='btn-block btn-info'
                      onClick={() => handleSaveCharacter(character.characterId)}>
                      {savedCharacterIds?.some((savedId) => savedId === character.characterId)
                        ? 'Character Already Saved!'
                        : 'Save This Character!'}
                    </Button>
                  )}
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

export default SearchCharacters;
