/** @jsxImportSource @emotion/react */
import React, { useEffect } from "react";
import SongList from "./SongList";
import AddSongForm from "./AddSongForm";
import SongStats from "./SongStats";
import styled from "@emotion/styled";
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from './Redux/store';
import { fetchSongsStart } from './Redux/songSlice';

const Container = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr; /* Two columns layout */
  gap: 20px; /* Adjust gap between columns */
  align-items: start; /* Align items to the top */
`;

const FormContainer = styled.div`
  position: relative;
  top: 150px; /* Adjust this value to move the form up */
`;

const ErrorText = styled.p`
  color: var(--error);
  margin-top: 16px;
`;

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Access state from Redux store
  const songs = useSelector((state: RootState) => state.songs.songs);
  const error = useSelector((state: RootState) => state.songs.error);

  useEffect(() => {
    dispatch(fetchSongsStart());
  }, [dispatch]);

  return (
    <div>
      <SongStats />
      <Container>
        <SongList songs={songs} />
        <FormContainer>
          <AddSongForm />
        </FormContainer>
      </Container>
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
};

export default Home;
