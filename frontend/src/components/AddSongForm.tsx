/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from '@emotion/styled';
import { Box, Heading, Text, Button } from 'rebass';
import { space, layout, typography } from 'styled-system';
import { addSong, Song } from './Redux/songSlice';
import { RootState } from './Redux/store'; // Adjust import based on your store setup

// Define the slide-in animation
const slideIn = `
  @keyframes slideIn {
    from {
      transform: translate(-50%, -150%); /* Start off-screen from the top */
      opacity: 0;
    }
    to {
      transform: translate(-50%, -50%); /* Center of the screen */
      opacity: 1;
    }
  }
`;

// Apply animation to the modal
const SuccessModal = styled(Box)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  text-align: center;
  width: 300px;
  animation: slideIn 0.5s ease-out; /* Apply slide-in animation */
  
  ${slideIn}

  button {
    margin-top: 16px;
  }
`;

const FormContainer = styled(Box)`
  ${space}
  ${layout}
  ${typography}

  justify-content: center;
  max-width: 500px;
  margin: auto;
  padding: 24px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 600px) {
    padding: 16px;
    max-width: 100%;
  }
`;

const FormTitle = styled(Heading)`
  margin-bottom: 24px;
`;

const FormGroup = styled(Box)`
  ${space}
  ${typography}
  position: relative;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
`;

const FormInput = styled.input<{ error?: boolean }>`
  ${space}
  ${typography}
  border-radius: 4px;
  border: 1px solid ${props => props.error ? '#dc3545' : '#ced4da'};
  padding: 12px;
  width: 100%;
  font-size: 16px;

  &:focus {
    border-color: ${props => props.error ? '#dc3545' : '#007bff'};
    outline: none;
  }
`;

const FormButton = styled(Button)`
  ${space}
  ${typography}
  background: linear-gradient(45deg, #007bff, #0056b3);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px 16px;
  cursor: pointer;
  font-size: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: background 0.3s, box-shadow 0.3s;

  &:hover {
    background: linear-gradient(45deg, #0056b3, #003d7a);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  }
`;

const ErrorText = styled(Text)`
  color: #dc3545;
  font-size: 14px;
  margin-top: 8px;
`;

interface SongFormData {
  title: string;
  artist: string;
  album: string;
  genre: string;
}

const AddSongForm: React.FC = () => {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state: RootState) => state.songs);

  const [formData, setFormData] = useState<SongFormData>({
    title: '',
    artist: '',
    album: '',
    genre: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.artist.trim()) newErrors.artist = 'Artist is required';
    if (!formData.album.trim()) newErrors.album = 'Album is required';
    if (!formData.genre.trim()) newErrors.genre = 'Genre is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await dispatch(addSong(formData));
      setFormData({ title: '', artist: '', album: '', genre: '' }); // Reset form data
      setShowSuccessModal(true); // Show success modal
    } catch (error) {
      if (error instanceof Error) {
        setErrors({ general: error.message });
      } else {
        setErrors({ general: 'An unknown error occurred' });
      }
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
  };

  const Overlay = styled(Box)`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5); /* Semi-transparent black background */
    z-index: 999; /* Place behind the modal */
  `;

  return (
    <>
      {showSuccessModal && <Overlay />}
      <FormContainer>
        <FormTitle as="h1">Add New Song</FormTitle>
        <form onSubmit={handleSubmit}>
          <FormGroup mb={3}>
            <FormLabel htmlFor="title">Title:</FormLabel>
            <FormInput
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter title of the song"
              error={!!errors.title}
            />
            {errors.title && <ErrorText>{errors.title}</ErrorText>}
          </FormGroup>
          <FormGroup mb={3}>
            <FormLabel htmlFor="artist">Artist:</FormLabel>
            <FormInput
              type="text"
              id="artist"
              name="artist"
              value={formData.artist}
              onChange={handleChange}
              placeholder="Enter artist of the song"
              error={!!errors.artist}
            />
            {errors.artist && <ErrorText>{errors.artist}</ErrorText>}
          </FormGroup>
          <FormGroup mb={3}>
            <FormLabel htmlFor="album">Album:</FormLabel>
            <FormInput
              type="text"
              id="album"
              name="album"
              value={formData.album}
              onChange={handleChange}
              placeholder="Enter album of the song"
              error={!!errors.album}
            />
            {errors.album && <ErrorText>{errors.album}</ErrorText>}
          </FormGroup>
          <FormGroup mb={3}>
            <FormLabel htmlFor="genre">Genre:</FormLabel>
            <FormInput
              type="text"
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              placeholder="Enter genre of the song"
              error={!!errors.genre}
            />
            {errors.genre && <ErrorText>{errors.genre}</ErrorText>}
          </FormGroup>
          <FormButton type="submit">Add Song</FormButton>
          {errors.general && <ErrorText>{errors.general}</ErrorText>}
        </form>
      </FormContainer>
      {showSuccessModal && (
        <SuccessModal>
          <Heading as="h2">Success!</Heading>
          <Text>The song has been added successfully.</Text>
          <Button style={{ color: 'red' }} onClick={handleCloseModal}>Close</Button>
        </SuccessModal>
      )}
    </>
  );
};

export default AddSongForm;
