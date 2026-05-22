import { colors, spacing, radii, fontSizes } from '@/constants/tokens';

describe('Design tokens', () => {
  it('brand primary is correct', () => {
    expect(colors.brand.primary).toBe('#71639e');
  });

  it('has all odoo gray shades', () => {
    const expected = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
    expected.forEach((shade) => {
      expect(colors.odoo[shade as keyof typeof colors.odoo]).toBeDefined();
    });
  });

  it('has all required status colors', () => {
    expect(colors.status.success).toBeDefined();
    expect(colors.status.danger).toBeDefined();
    expect(colors.status.warning).toBeDefined();
    expect(colors.status.info).toBeDefined();
  });

  it('spacing md is 16', () => {
    expect(spacing.md).toBe(16);
  });

  it('radii full is large enough to be circular', () => {
    expect(radii.full).toBeGreaterThan(100);
  });

  it('fontSizes base is readable', () => {
    expect(fontSizes.base).toBeGreaterThanOrEqual(14);
  });
});
