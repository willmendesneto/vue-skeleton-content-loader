// NOTE: Avoiding `CSSProperties` import to prevent bundle size increase and using a custom type instead.
// By doing that, 6B (final result gziped) are saved in the final bundle size.
// Same entries accepted by `:style` binding: CSS properties (dash-case or camelCase) and CSS custom
// properties (e.g. `--vue-skeleton-content-loader-base-color`). `undefined` removes the style.
type VueSkeletonContentLoaderConfigTheme = {
  [k: string]: string | number | undefined;
} | null;

type CSSMeasureUnit = 'px' | 'em' | 'rem' | '%' | 'vh' | 'vw';

/**
 * Registry of custom animations, extended by consumers via TypeScript declaration merging.
 * Every key registered here becomes a valid `animation` value, rendered as `animation-<key>`
 * CSS class in the skeleton items. E.g.:
 *
 * ```ts
 * import 'vue-skeleton-content-loader';
 *
 * declare module 'vue-skeleton-content-loader' {
 *   interface VueSkeletonContentLoaderCustomAnimations {
 *     'my-wave': true;
 *   }
 * }
 * ```
 *
 * The animation styles must be added in a global stylesheet (or via `:deep()`), targeting
 * `.skeleton-loader.animation-my-wave`, since component styles are scoped.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface VueSkeletonContentLoaderCustomAnimations {}

export interface VueSkeletonContentLoaderConfig {
  appearance: 'circle' | 'line' | 'square' | 'custom-content' | '';
  size: number | `${number}` | `${number}${CSSMeasureUnit}` | null;
  animation:
    | 'progress'
    | 'progress-dark'
    | 'pulse'
    | 'pulse-dark'
    | 'wave'
    | 'false'
    | false
    | Extract<keyof VueSkeletonContentLoaderCustomAnimations, string>;
  theme: VueSkeletonContentLoaderConfigTheme;
  loadingText: string;
  count: number | `${number}`;
  ariaLabel: string;
  measureUnit: CSSMeasureUnit;
  /**
   * `light` (default) keeps light colors. `auto` enables dark mode following the user's color
   * scheme preference (OS and/or browser), and `dark` forces it.
   */
  colorScheme: 'auto' | 'light' | 'dark';
}
