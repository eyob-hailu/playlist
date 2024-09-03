/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from "react";
import { Song } from "./Song";
import styled from "@emotion/styled";
import { Box, Heading, Text, Button } from "rebass";
import { keyframes } from "@emotion/react";
import UpdateSong from "./UpdateSong";
import { useDispatch } from "react-redux";
import { fetchSongsStart, deleteSong } from "./Redux/songSlice";
import { formatDistanceToNow } from "date-fns"; // Import date-fns function

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const StyledCard = styled.div`
  width: 100%;
  justify-content: center;
  justify-self: center;
  max-width: 800px;
  padding: 16px;
  margin: 16px 0;
  background-color: #f6f6ff;
  border-radius: 8px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.25);
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
  animation: ${fadeIn} 0.5s ease-out;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.35);
  }
`;

const PaginationControls = styled.div`
  margin: 20px 0;
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const StyledButton = styled(Button)`
  background-color: ${(props) => (props.active ? "#2cd15d" : "#e0e0e0")};
  color: ${(props) => (props.active ? "#fff" : "#000000")};
  border: 1px solid ${(props) => (props.active ? "#007bff" : "#ccc")};
  padding: 8px 16px;
  font-size: 16px;
  transition: background-color 0.2s, color 0.2s;

  &:hover {
    background-color: ${(props) => (props.active ? "#0056b3" : "#d6d6d6")};
    color: ${(props) => (props.active ? "#fff" : "#000")};
  }
`;

const EditButton = styled(Button)`
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 8px 16px;
  margin-top: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }
`;

const DeleteButton = styled(Button)`
  background-color: #dc3545;
  color: #fff;
  border: none;
  padding: 8px 16px;
  margin-top: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #c82333;
  }
`;

const NoSongsMessage = styled(Text)`
  font-size: 18px;
  color: #6c757d;
  text-align: center;
  margin-top: 20px;
`;

const GenreFilter = styled.div`
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const GenreSelect = styled.select`
  font-size: 16px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  color: #333;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.2);
  }
`;

const GenreLabel = styled.label`
  display: block;
  font-size: 18px;
  margin-bottom: 10px;
  color: #333;
`;

interface SongListProps {
  songs: Song[];
}

const SongList: React.FC<SongListProps> = ({ songs }) => {
  const [isUpdateModalOpen, setUpdateModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 3;
  const [paginatedSongs, setPaginatedSongs] = useState<Song[]>([]);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (songs.length === 0) {
      setPaginatedSongs([]);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        await dispatch(fetchSongsStart()); // Ensure this action fetches and updates the songs state in Redux
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const filteredSongs = selectedGenre
      ? songs.filter((song) => song.genre === selectedGenre)
      : songs;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedSongs(filteredSongs.slice(startIndex, endIndex));
  }, [dispatch, currentPage, songs, itemsPerPage, selectedGenre]);

  const totalPages = Math.ceil(
    (selectedGenre
      ? songs.filter((song) => song.genre === selectedGenre).length
      : songs.length) / itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleEditClick = (song: Song) => {
    setSelectedSong(song);
    setUpdateModalOpen(true);
  };

  const handleCloseModal = () => {
    setUpdateModalOpen(false);
    setSelectedSong(null);
  };

  const handleDelete = async (songId: string) => {
    try {
      dispatch(deleteSong(songId));

      if (paginatedSongs.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      console.error("Failed to delete song:", error);
    }
  };

  const handleGenreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGenre(event.target.value || null);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  return (
    <div>
      <Heading as="h1" mb={4}>
        Songs List
      </Heading>

      <GenreFilter>
        <GenreLabel htmlFor="genreFilter">Filter by Genre:</GenreLabel>
        <GenreSelect id="genreFilter" onChange={handleGenreChange}>
          <option value="">All Genres</option>
          {Array.from(new Set(songs.map((song) => song.genre))).map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </GenreSelect>
      </GenreFilter>

      <Box display="flex" flexDirection="column" alignItems="center">
        {paginatedSongs.length === 0 ? (
          <NoSongsMessage>No songs available at the moment</NoSongsMessage>
        ) : (
          <>
            {paginatedSongs.map((song) => (
              <StyledCard key={song._id}>
                {" "}
                {/* Ensure each card has a unique key */}
                <Heading as="h3" fontSize={3} mb={2}>
                  {song.title}
                </Heading>
                <Text fontSize={2} mb={1}>
                  by {song.artist}
                </Text>
                {song.album && (
                  <Text fontSize={1} mb={1}>
                    Album: {song.album}
                  </Text>
                )}
                {song.genre && <Text fontSize={1}>Genre: {song.genre}</Text>}
                <Text fontSize={1} color="#6c757d" mb={1}>
                  Created At:{" "}
                  {song.createdAt
                    ? formatDistanceToNow(new Date(song.createdAt), {
                        addSuffix: true,
                      })
                    : "Unknown"}
                </Text>
                <Text fontSize={1} color="#6c757d">
                  Updated At:{" "}
                  {song.updatedAt
                    ? formatDistanceToNow(new Date(song.updatedAt), {
                        addSuffix: true,
                      })
                    : "Unknown"}
                </Text>
                <EditButton onClick={() => handleEditClick(song)}>
                  Edit
                </EditButton>
                <DeleteButton onClick={() => handleDelete(song._id)}>
                  Delete
                </DeleteButton>
              </StyledCard>
            ))}
            <PaginationControls>
              {currentPage > 1 && (
                <StyledButton
                  key="prev"
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </StyledButton>
              )}
              {Array.from({ length: totalPages }, (_, index) => (
                <StyledButton
                  key={index + 1} // Ensure each button has a unique key
                  onClick={() => handlePageChange(index + 1)}
                  active={currentPage === index + 1}
                >
                  {index + 1}
                </StyledButton>
              ))}
              {currentPage < totalPages && (
                <StyledButton
                  key="next"
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </StyledButton>
              )}
            </PaginationControls>
          </>
        )}
      </Box>

      {selectedSong && (
        <UpdateSong
          isOpen={isUpdateModalOpen}
          onClose={handleCloseModal}
          song={selectedSong}
        />
      )}
    </div>
  );
};

export default SongList;
