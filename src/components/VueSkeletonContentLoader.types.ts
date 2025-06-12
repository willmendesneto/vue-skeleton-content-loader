type VueSkeletonContentLoaderConfigTheme = {
  [k: string]: string | number;
} | null;

export interface VueSkeletonContentLoaderConfig {
  appearance: 'circle' | 'line' | 'square' | 'custom-content' | '';
  size: number | `${number}` | `${number}px` | null;
  animation: 'progress' | 'progress-dark' | 'pulse' | 'false' | false | 'pulse-dark';
  theme: VueSkeletonContentLoaderConfigTheme;
  loadingText: string;
  count: number | `${number}`;
  ariaLabel: string;
}
