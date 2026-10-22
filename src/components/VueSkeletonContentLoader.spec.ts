import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import VueSkeletonContentLoader from '@/components/VueSkeletonContentLoader.vue';

describe('VueSkeletonContentLoader', () => {
  beforeEach(() => {
    // Mock console.error to prevent it from polluting test output
    vi.spyOn(console, 'error').mockImplementation(() => null);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('When the component uses default configuration', () => {
    let wrapper: ReturnType<typeof mount>;

    beforeEach(() => {
      wrapper = mount(VueSkeletonContentLoader);
    });

    it('should add all relevant WAI-ARIA `aria-` attributes in the root element', () => {
      const root = wrapper.element;
      expect(root.getAttribute('aria-busy')).toBe('true');
      expect(root.getAttribute('aria-valuemin')).toBe('0');
      expect(root.getAttribute('aria-valuemax')).toBe('100');
      expect(root.getAttribute('aria-valuetext')).toBe('Loading...'); // Default loadingText
      expect(root.getAttribute('role')).toBe('progressbar');
      expect(root.getAttribute('aria-label')).toBe('loading'); // Default ariaLabel
    });

    it('should hide skeleton items from assistive technologies', () => {
      const skeletons = wrapper.findAll('.skeleton-loader');
      expect(skeletons.length).toBe(1); // Default count is 1

      skeletons.forEach((skeleton) => {
        expect(skeleton.attributes('aria-hidden')).toBe('true');
        expect(skeleton.attributes('role')).toBeUndefined();
        expect(skeleton.attributes('tabindex')).toBeUndefined();
      });
    });

    it('should use progress as default animation if `animation` is not passed as component attribute', () => {
      expect(wrapper.find('.skeleton-loader.progress').exists()).toBe(true);
    });

    it('should render a single skeleton by default', () => {
      expect(wrapper.findAll('.skeleton-loader').length).toBe(1);
    });
  });

  describe('When skeleton is created passing loading text to be used as WAI-ARIA `aria-valuetext`', () => {
    it('should render a single skeleton with custom loading text', () => {
      const customLoadingText = 'Fetching data...';
      const wrapper = mount(VueSkeletonContentLoader, {
        props: { loadingText: customLoadingText },
      });
      expect(wrapper.attributes('aria-valuetext')).toBe(customLoadingText);
    });
  });

  describe('When skeleton is created with count', () => {
    it('should render skeletons based on given count attribute', () => {
      const count = 3;
      const wrapper = mount(VueSkeletonContentLoader, {
        props: { count },
      });
      expect(wrapper.findAll('.skeleton-loader').length).toBe(count);
    });

    it('should ignore decimal values in `count`', () => {
      const wrapper = mount(VueSkeletonContentLoader, {
        props: { count: '2.5' },
      });
      expect(wrapper.findAll('.skeleton-loader').length).toBe(2);
    });

    it.each([0, 'abc'])('should render a single skeleton if `count` is %j', (count) => {
      const wrapper = mount(VueSkeletonContentLoader, {
        // @ts-expect-error testing invalid values
        props: { count },
      });
      expect(wrapper.findAll('.skeleton-loader').length).toBe(1);
    });
  });

  describe('When skeleton is created with circle appearance', () => {
    it('should add styles based on circle class on the skeleton components', () => {
      const wrapper = mount(VueSkeletonContentLoader, {
        props: { appearance: 'circle' },
      });
      expect(wrapper.find('.skeleton-loader.circle').exists()).toBe(true);
    });
  });

  describe('When skeleton is created with custom-content appearance', () => {
    it('should use the content inside the slot', () => {
      const customContent = `<svg viewBox="0 0 312 103" fill="none" id="svg-content" xmlns="http://www.w3.org/2000/svg">
            <rect width="312" height="102" fill="white" />
            <path
              d="M14 49.5338C5.2 43.5338 1 47.3671 0 50.0338V102.034H312V44.5338C312 35.7338 303.667 37.8671 299.5 40.0338C292.167 44.5338 276.3 54.4338 271.5 58.0338C266.7 61.6338 261.833 62.2005 260 62.0338H248C243.2 62.0338 240 60.7005 239 60.0338C237.833 59.2005 233.5 56.0338 225.5 50.0338C217.5 44.0338 210.167 47.2004 207.5 49.5338C204.833 51.8671 197.6 58.0338 190 64.0338C182.4 70.0338 176.833 65.2005 175 62.0338C168.167 48.3671 153.5 19.3338 149.5 12.5338C144.7 6.13377 138.5 9.8671 136 12.5338C130.667 18.3671 118.8 31.3338 114 36.5338C109.2 41.7338 102.667 42.3671 100 42.0338H76C66.5 42.0338 48 56.5338 42 59.0338C37.2 61.0338 32.3333 59.8671 30.5 59.0338C28.6667 58.3671 22.8 55.5338 14 49.5338Z"
              fill="#EFEFEF"
            />
            <path
              d="M14 49.5338C5.2 43.5338 1 47.3671 0 50.0338V102.034H312V44.5338C312 35.7338 303.667 37.8671 299.5 40.0338C292.167 44.5338 276.3 54.4338 271.5 58.0338C266.7 61.6338 261.833 62.2005 260 62.0338H248C243.2 62.0338 240 60.7005 239 60.0338C237.833 59.2005 233.5 56.0338 225.5 50.0338C217.5 44.0338 210.167 47.2004 207.5 49.5338C204.833 51.8671 197.6 58.0338 190 64.0338C182.4 70.0338 176.833 65.2005 175 62.0338C168.167 48.3671 153.5 19.3338 149.5 12.5338C144.7 6.13377 138.5 9.8671 136 12.5338C130.667 18.3671 118.8 31.3338 114 36.5338C109.2 41.7338 102.667 42.3671 100 42.0338H76C66.5 42.0338 48 56.5338 42 59.0338C37.2 61.0338 32.3333 59.8671 30.5 59.0338C28.6667 58.3671 22.8 55.5338 14 49.5338Z"
              fill="black"
              fill-opacity="0.1"
            />
          </svg>`;
      const wrapper = mount(VueSkeletonContentLoader, {
        props: { appearance: 'custom-content' },
        slots: {
          default: customContent,
        },
      });
      expect(wrapper.find('.skeleton-loader.custom-content').exists()).toBe(true);
      expect(wrapper.find('.skeleton-loader.custom-content #svg-content').exists()).toBe(true);
    });

    it('should render a single skeleton even if `count` is bigger than 1', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => null);
      const wrapper = mount(VueSkeletonContentLoader, {
        props: { appearance: 'custom-content', count: 3 },
        slots: { default: '<p class="slot-content">content</p>' },
      });
      expect(wrapper.findAll('.skeleton-loader').length).toBe(1);
      expect(wrapper.findAll('.slot-content').length).toBe(1);
      expect(warn).toHaveBeenCalledOnce();
      expect(warn.mock.calls[0][0]).toContain(
        '"custom-content" appearance renders a single skeleton',
      );
    });
  });

  describe('When skeleton is created without animation', () => {
    it('should NOT add any animation class if animation is set to "false"', () => {
      const wrapper = mount(VueSkeletonContentLoader, {
        props: { animation: 'false' },
      });
      expect(wrapper.findAll('.skeleton-loader.pulse').length).toBe(0);
      expect(wrapper.findAll('.skeleton-loader.pulse-dark').length).toBe(0);
      expect(wrapper.findAll('.skeleton-loader.progress').length).toBe(0);
      expect(wrapper.findAll('.skeleton-loader.progress-dark').length).toBe(0);
    });
  });

  describe('When skeleton is created using `pulse` as animation', () => {
    it('should add pulse animation styles based on animation class on the skeleton components', () => {
      const wrapper = mount(VueSkeletonContentLoader, {
        props: { animation: 'pulse' },
      });
      expect(wrapper.find('.skeleton-loader.pulse').exists()).toBe(true);
    });
  });

  describe('When skeleton is created using `progress-dark` as animation', () => {
    it('should add progress-dark animation styles based on animation class on the skeleton components', () => {
      const wrapper = mount(VueSkeletonContentLoader, {
        props: { animation: 'progress-dark' },
      });
      expect(wrapper.find('.skeleton-loader.progress-dark').exists()).toBe(true);
    });
  });

  describe('When skeleton is created using `progress` as animation', () => {
    it('should add progress animation styles based on animation class on the skeleton components', () => {
      const wrapper = mount(VueSkeletonContentLoader, {
        props: { animation: 'progress' },
      });
      expect(wrapper.find('.skeleton-loader.progress').exists()).toBe(true);
    });
  });

  describe('When skeleton is created with square appearance', () => {
    it('should render skeleton with width and height based on `size` attribute', () => {
      const wrapper = mount(VueSkeletonContentLoader, {
        props: { appearance: 'square', size: 50 },
      });
      const skeleton = wrapper.find('.skeleton-loader');
      expect(skeleton.attributes('style')).toContain('width: 50px;');
      expect(skeleton.attributes('style')).toContain('height: 50px;');
    });
    it('should render skeleton with width and height based on `size` using `measureUnit` attribute if available', () => {
      const wrapper = mount(VueSkeletonContentLoader, {
        props: { appearance: 'square', size: '80', measureUnit: 'rem' },
      });
      const skeleton = wrapper.find('.skeleton-loader');
      expect(skeleton.attributes('style')).toContain('width: 80rem;');
      expect(skeleton.attributes('style')).toContain('height: 80rem;');
    });

    it('should use the CSS unit passed in `size` over `measureUnit` attribute', () => {
      const wrapper = mount(VueSkeletonContentLoader, {
        props: { appearance: 'square', size: '10em', measureUnit: 'rem' },
      });
      const skeleton = wrapper.find('.skeleton-loader');
      expect(skeleton.attributes('style')).toContain('width: 10em;');
      expect(skeleton.attributes('style')).toContain('height: 10em;');
    });

    it('should keep decimal values passed in `size`', () => {
      const wrapper = mount(VueSkeletonContentLoader, {
        props: { appearance: 'square', size: '1.5', measureUnit: 'rem' },
      });
      expect(wrapper.find('.skeleton-loader').attributes('style')).toContain('width: 1.5rem;');
    });

    it('should NOT add width and height styles if `size` is invalid', () => {
      const wrapper = mount(VueSkeletonContentLoader, {
        // @ts-expect-error testing invalid values
        props: { appearance: 'square', size: 'abc' },
      });
      expect(wrapper.find('.skeleton-loader').attributes('style')).not.toMatch(/width|height/);
    });

    it('should NOT add width and height styles if appearance is not `square`', () => {
      const wrapper = mount(VueSkeletonContentLoader, {
        props: { appearance: 'circle', size: 50 },
      });
      expect(wrapper.find('.skeleton-loader').attributes('style')).not.toMatch(/width|height/);
    });
  });

  describe('When skeleton is created with theming', () => {
    it('should render skeleton with styles based on theme attribute', () => {
      const theme = { width: '70px', height: '70px', 'border-radius': '10px' };
      const wrapper = mount(VueSkeletonContentLoader, {
        props: { theme },
      });
      const skeleton = wrapper.find('.skeleton-loader');
      expect(skeleton.attributes('style')).toContain('width: 70px;');
      expect(skeleton.attributes('style')).toContain('height: 70px;');
      expect(skeleton.attributes('style')).toContain('border-radius: 10px;');
    });
  });
  describe('When skeleton receives attributes that are not props', () => {
    it('should add them in the root element', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => null);
      const wrapper = mount(VueSkeletonContentLoader, {
        props: { count: 2 },
        attrs: { class: 'my-skeleton', 'data-testid': 'skeleton', ariaLabel: 'user' },
      });
      expect(wrapper.classes()).toContain('my-skeleton');
      expect(wrapper.attributes('data-testid')).toBe('skeleton');
      expect(wrapper.findAll('.skeleton-loader').length).toBe(2);
      expect(warn).not.toHaveBeenCalled();
    });
  });

  describe('When skeleton is created with appearance and animation', () => {
    it('should add a single class for each of them', () => {
      const wrapper = mount(VueSkeletonContentLoader, {
        props: { appearance: 'circle', animation: 'pulse-dark' },
      });
      expect(wrapper.find('.skeleton-loader').classes()).toEqual([
        'skeleton-loader',
        'circle',
        'pulse-dark',
      ]);
    });

    it.each(['line', ''] as const)(
      'should NOT add appearance class if appearance is %j',
      (appearance) => {
        const wrapper = mount(VueSkeletonContentLoader, {
          props: { appearance, animation: false },
        });
        expect(wrapper.find('.skeleton-loader').classes()).toEqual(['skeleton-loader']);
      },
    );
  });

  describe('When skeleton is themed via CSS custom properties', () => {
    it('should add them as item styles via `theme` prop', () => {
      const wrapper = mount(VueSkeletonContentLoader, {
        props: { theme: { '--vue-skeleton-content-loader-base-color': 'red' } },
      });
      expect(wrapper.find('.skeleton-loader').attributes('style')).toContain(
        '--vue-skeleton-content-loader-base-color: red;',
      );
    });
  });
  describe('When skeleton is created using `wave` as animation', () => {
    it('should add wave animation class on the skeleton components', () => {
      const wrapper = mount(VueSkeletonContentLoader, {
        props: { animation: 'wave' },
      });
      expect(wrapper.find('.skeleton-loader').classes()).toEqual(['skeleton-loader', 'wave']);
    });
  });

  describe('When skeleton is created using a custom animation', () => {
    it('should add the animation class with `animation-` prefix', () => {
      const wrapper = mount(VueSkeletonContentLoader, {
        // @ts-expect-error custom animations need to be registered via declaration merging
        props: { animation: 'my-wave' },
      });
      expect(wrapper.find('.skeleton-loader').classes()).toEqual([
        'skeleton-loader',
        'animation-my-wave',
      ]);
    });

    it.each([false, 'false'] as const)(
      'should NOT add any animation class if animation is %j',
      (animation) => {
        const wrapper = mount(VueSkeletonContentLoader, {
          props: { animation },
        });
        expect(wrapper.find('.skeleton-loader').classes()).toEqual(['skeleton-loader']);
      },
    );
  });

  describe('When skeleton is created with multiple items', () => {
    it('should expose the index of each item via `--vue-skeleton-content-loader-index`', () => {
      const wrapper = mount(VueSkeletonContentLoader, {
        props: { count: 3 },
      });
      const indexes = wrapper
        .findAll('.skeleton-loader')
        .map((skeleton) =>
          (skeleton.element as HTMLElement).style.getPropertyValue(
            '--vue-skeleton-content-loader-index',
          ),
        );
      expect(indexes).toEqual(['0', '1', '2']);
    });
  });

  describe('When skeleton is created with color scheme', () => {
    it.each([
      ['auto', 'light dark'],
      ['dark', 'dark'],
    ] as const)('should add `color-scheme` style if color scheme is %j', (colorScheme, value) => {
      const wrapper = mount(VueSkeletonContentLoader, {
        props: { colorScheme },
      });
      expect(wrapper.find('.skeleton-loader').attributes('style')).toContain(
        `color-scheme: ${value};`,
      );
    });

    it('should NOT add `color-scheme` style by default (light)', () => {
      const wrapper = mount(VueSkeletonContentLoader);
      expect(wrapper.find('.skeleton-loader').attributes('style')).not.toContain('color-scheme');
    });
  });
});
