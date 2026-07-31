export interface Job {
  id: string;
  user_id: string;
  title: string | null;
  description: string | null;
  video_url: string;
  img_url: string | null;
  subtitle_file: string;
  output_video: string | null;
  status: 'pending' | 'processing' | 'ready' | 'done' | 'failed';
  error_message: string | null;
  subtitle_settings: SubtitleSettings;
  created_at: string;
  updated_at: string;
}

export interface SubtitleSettings {
  fontSize?: number;
  fontColor?: string;
  position?: 'top' | 'bottom';
  alignment?: 'left' | 'center' | 'right';
  background?: boolean;
  outlineColor?: string;
  outlineWidth?: number;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  color: string;
  created_at: string;
}

export interface Actor {
  id: string;
  user_id: string;
  name: string;
  image_url: string | null;
  biography: string | null;
  birth_date: string | null;
  nationality: string | null;
  created_at: string;
  updated_at: string;
}

export interface CategoryWithCount extends Category {
  video_count: number;
}

export interface ActorWithCount extends Actor {
  video_count: number;
}

export interface JobWithMetadata extends Job {
  categories: Category[];
  actors: Actor[];
}

export interface Subtitle {
  id: string;
  user_id: string;
  title: string;
  format: 'srt' | 'vtt';
  line_count: number;
  size: number;
  subtitle_content: string;
  path: string;
  created_at: string;
  updated_at: string;
  job_status?: string;
}

export interface EditableCue {
  id: string;
  index: number;
  start: number;
  end: number;
  text: string;
}
