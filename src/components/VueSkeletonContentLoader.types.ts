type VueSkeletonContentLoaderConfigTheme = {
  [k: string]: string | number;
} | null;

export interface VueSkeletonContentLoaderConfig {
  appearance: 'circle' | 'line' | 'custom-content' | '';
  animation: 'progress' | 'progress-dark' | 'pulse' | 'false' | false | 'pulse-dark';
  theme: VueSkeletonContentLoaderConfigTheme;
  loadingText: string;
  count: number | `${number}`;
  ariaLabel: string;
}
