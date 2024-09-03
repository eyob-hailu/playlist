/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { Box, Heading, Text, Button } from "rebass";
import { space, layout, typography } from "styled-system";
import { useDispatch } from "react-redux";
import axios from "axios";
import { updateSong } from "./Redux/songSlice";
import { Song } from "./Song";

// Modal overlay styles
const ModalOverlay = styled.div<{ isOpen: boolean }>`
  display: ${(props) => (props.isOpen ? "flex" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 8px;
  transition: opacity 0.3s ease;
`;

// Modal content styles
const ModalContent = styled(Box)`
  ${space}
  ${layout}
  ${typography}

  max-width: 500px;
  width: 100%;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: relative;
  transition: transform 0.3s ease, opacity 0.3s ease;

  @media (max-width: 768px) {
    padding: 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

// Button to close modal
const CloseButton = styled(Button)`
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  color: #dc3545;
  border: none;
  font-size: 24px;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #c82333;
  }

  @media (max-width: 768px) {
    font-size: 20px;
    top: 8px;
    right: 8px;
  }
`;

const FormTitle = styled(Heading)`
  margin-bottom: 16px;
  font-size: 24px;
  font-weight: 600;
  color: #333;

  @media (max-width: 768px) {
    font-size: 20px;
    margin-bottom: 12px;
  }
`;

const FormGroup = styled(Box)`
  ${space}
  ${typography}
  margin-bottom: 12px;
  position: relative;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  font-size: 14px;
  color: #555;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const FormInput = styled.input<{ error?: boolean }>`
  ${space}
  ${typography}
  border-radius: 4px;
  border: 1px solid ${(props) => (props.error ? "#dc3545" : "#ced4da")};
  padding: 10px;
  width: 100%;
  font-size: 14px;
  box-sizing: border-box;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: ${(props) => (props.error ? "#dc3545" : "#007bff")};
    outline: none;
    box-shadow: 0 0 4px rgba(0, 123, 255, 0.5);
  }

  @media (max-width: 768px) {
    font-size: 12px;
    padding: 8px;
  }
`;

const FormButton = styled(Button)`
  ${space}
  ${typography}
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  padding: 10px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 8px;
  }
`;

interface UpdateSongProps {
  isOpen: boolean;
  onClose: () => void;
  song: Song;
}

const UpdateSong: React.FC<UpdateSongProps> = ({ isOpen, onClose, song }) => {
  const [formData, setFormData] = useState<Song>(song);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    setFormData(song);
  }, [song]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !formData.title ||
      !formData.artist ||
      !formData.album ||
      !formData.genre
    ) {
      setError("All fields are required.");
      return;
    }
    setError(null);
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/songs/${song._id}`,
        formData
      );
    
    
      dispatch(updateSong(response)); // Dispatch the updated song to Redux
      onClose();
    } catch (error) {
      setError("Failed to update song. Please try again.");
    }
  };

  return (
    <ModalOverlay isOpen={isOpen}>
      <ModalContent p={4}>
        <CloseButton onClick={onClose}>×</CloseButton>
        <FormTitle>Update Song</FormTitle>
        {error && (
          <Text color="red" mb={2}>
            {error}
          </Text>
        )}
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <FormLabel htmlFor="title">Title</FormLabel>
            <FormInput
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              error={!!error}
            />
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="artist">Artist</FormLabel>
            <FormInput
              id="artist"
              name="artist"
              value={formData.artist}
              onChange={handleInputChange}
              error={!!error}
            />
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="album">Album</FormLabel>
            <FormInput
              id="album"
              name="album"
              value={formData.album}
              onChange={handleInputChange}
              error={!!error}
            />
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="genre">Genre</FormLabel>
            <FormInput
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleInputChange}
              error={!!error}
            />
          </FormGroup>
          <FormButton type="submit">Update</FormButton>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default UpdateSong;
