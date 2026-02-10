const MOBILE_MAX_WIDTH = 960;

export function getResponsiveMetrics(scene) {
  const { width, height } = scene.scale;
  const shortest = Math.min(width, height);
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isMobile = isTouch && width <= MOBILE_MAX_WIDTH;
  const baseScale = Phaser.Math.Clamp(shortest / 720, 0.75, 1.45);
  const uiScale = isMobile ? Math.max(baseScale, 1.05) : baseScale;

  return {
    width,
    height,
    shortest,
    isMobile,
    uiScale,
    font: (size) => `${Math.round(size * uiScale)}px`,
    value: (size) => Math.round(size * uiScale),
  };
}
