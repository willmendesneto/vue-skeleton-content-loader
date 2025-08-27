// NOTE: Avoiding `CSSProperties` import to prevent bundle size increase and using a custom type instead.
// By doing that, 6B (final result gziped) are saved in the final bundle size.
type VueSkeletonContentLoaderConfigTheme = {
  [k: string]: string | number;
} | null;

type CSSMeasureUnit = 'px' | 'em' | 'rem' | '%' | 'vh' | 'vw';
export interface VueSkeletonContentLoaderConfig {
  appearance: 'circle' | 'line' | 'square' | 'custom-content' | '';
  size: number | `${number}` | `${number}${CSSMeasureUnit}` | null;
  animation: 'progress' | 'progress-dark' | 'pulse' | 'false' | false | 'pulse-dark';
  theme: VueSkeletonContentLoaderConfigTheme;
  loadingText: string;
  count: number | `${number}`;
  ariaLabel: string;
  measureUnit: CSSMeasureUnit;
}
