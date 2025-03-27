export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: number;
  artwork?: string;
}

export const playlist: Track[] = [
  {
    id: "1",
    title: "Test Track",
    artist: "Test Artist",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: 180,
    artwork: "https://picsum.photos/200/200?random=1",
  },
  {
    id: "2",
    title: "Test Track 2",
    artist: "Test Artist 2",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    duration: 180,
    artwork: "https://picsum.photos/200/200?random=2",
  },
];
