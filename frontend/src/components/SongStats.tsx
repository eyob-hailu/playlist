/** @jsxImportSource @emotion/react */
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Text, Heading } from "rebass";
import styled from "@emotion/styled";
import { space, layout, typography } from "styled-system";
import { fetchStats } from './Redux/statsSlice'; // Import fetchStats
import { RootState } from './Redux/store'; // Import RootState

const Card = styled(Box)`
  ${space}
  ${layout}
  ${typography}
  
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 20px;
  margin: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 250px;
  display: inline-block;
  vertical-align: top;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  text-align: center;

  &:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
    transform: scale(1.05);
  }
`;

const CardTitle = styled(Heading)`
  font-size: 18px;
  margin-bottom: 8px;
`;

const CardValue = styled(Text)`
  font-size: 24px;
  font-weight: bold;
  color: #333;
`;

const ListItem = styled(Box)`
  ${space}
  ${typography}
  
  border-bottom: 1px solid #eee;
  padding: 12px;
  display: flex;
  justify-content: space-between;
`;

const SongStats: React.FC = () => {
  const dispatch = useDispatch();
  const { data: stats, loading, error } = useSelector((state: RootState) => state.stats);

  useEffect(() => {
    dispatch(fetchStats());
  }, [dispatch]);

  const cardsData = useMemo(() => [
    { title: "Total Songs", value: stats?.totalSongs },
    { title: "Total Artists", value: stats?.totalArtists },
    { title: "Total Albums", value: stats?.totalAlbums },
    { title: "Total Genres", value: stats?.totalGenres },
  ], [stats]);

  const listData = useMemo(() => [
    { title: "Songs Per Genre", items: stats?.songsPerGenre },
    { title: "Songs Per Artist", items: stats?.songsPerArtist },
    { title: "Albums Per Artist", items: stats?.albumsPerArtist },
    { title: "Songs Per Album", items: stats?.songsPerAlbum },
  ], [stats]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-around" }}>
      {cardsData.map((item, index) => (
        <Card key={index}>
          <CardTitle>{item.title}</CardTitle>
          <CardValue>{item.value ?? 'No data'}</CardValue>
        </Card>
      ))}
      {listData.map((section, index) => (
        <Card key={index + 4}>
          <CardTitle>{section.title}</CardTitle>
          {section.items?.map((item) => (
            <ListItem key={item._id || item.artist}>
              <Text>{item._id || item.artist}</Text>
              <Text>{item.count || item.albumCount}</Text>
            </ListItem>
          ))}
        </Card>
      ))}
    </div>
  );
};

export default SongStats;
