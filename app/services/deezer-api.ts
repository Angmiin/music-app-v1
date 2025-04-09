import { Track } from "../types/track";
// Description: This file contains the deezerApi object that provides methods to interact with the Deezer API.
// It includes methods to get artist information, top tracks, and search for tracks.
// It uses the fetch API to make GET requests to the Deezer API endpoints.


const API_KEY = "0000dd1769msh15b942d9ddf5b05p145ea4jsne90a4e389189";
const API_HOST = "deezerdevs-deezer.p.rapidapi.com";

const options = {
  method: "GET",
  headers: {
    "x-rapidapi-key": API_KEY,
    "x-rapidapi-host": API_HOST,
  },
};

export const deezerApi = {
  async getArtist(id: string) {
    try {
      const response = await fetch(
        `https://deezerdevs-deezer.p.rapidapi.com/artist/${id}`,
        options
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching artist:", error);
      throw error;
    }
  },

  async getArtistTopTracks(id: string) {
    try {
      const response = await fetch(
        `https://deezerdevs-deezer.p.rapidapi.com/artist/${id}/top`,
        options
      );
      const data = await response.json();
      return data.data.map((track: any) => ({
        id: track.id.toString(),
        title: track.title,
        artist: track.artist.name,
        artwork: track.album.cover_medium,
        url: track.preview,
        duration: track.duration,
      }));
    } catch (error) {
      console.error("Error fetching artist top tracks:", error);
      throw error;
    }
  },

  async searchTracks(query: string) {
    try {
      const response = await fetch(
        `https://deezerdevs-deezer.p.rapidapi.com/search?q=${encodeURIComponent(
          query
        )}`,
        options
      );
      const data = await response.json();
      return data.data.map((track: any) => ({
        id: track.id.toString(),
        title: track.title,
        artist: track.artist.name,
        artwork: track.album.cover_medium,
        url: track.preview,
        duration: track.duration,
      }));
    } catch (error) {
      console.error("Error searching tracks:", error);
      throw error;
    }
  },
};
