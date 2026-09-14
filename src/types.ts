export type CinematicSceneId =
  | 'intro'
  | 'scene1_darkness'
  | 'scene2_reveal'
  | 'scene3_divine'
  | 'scene4_aarti'
  | 'scene5_signature';

export interface SceneMeta {
  id: CinematicSceneId;
  durationMs: number;
}
