export interface Networks {
  facebook?: string;
  twitter?: string;
  youtube?: string;
}

export namespace TwitchApi {
  export interface Stream {
    community_ids: string[];
    game_id: string;
    id: string;
    language: string;
    pagination: string;
    started_at: string;
    thumbnail_url: string;
    title: string;
    type: string;
    user_id: string;
    viewer_count: number;
  }

  export interface Game {
    id: string;
    name: string;
    box_art_url: string;
  }
}
