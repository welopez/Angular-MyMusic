import { Song } from "./song";

export interface Playlist {
  id: DoubleRange,
  name: string,
  userEmail: string,
  songs: Song[]
}
