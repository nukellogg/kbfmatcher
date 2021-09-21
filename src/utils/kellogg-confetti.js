import confetti from 'canvas-confetti';

function kelloggConfetti(seconds) {
  const end = Date.now() + seconds * 1000;
  // Northwestern Purple: https://www.northwestern.edu/brand/visual-identity/color-palettes/
  // Pink because June's favorite colors are pink and purple
  const kelloggPurple = '#4E2A84';
  const pink = '#f8bbd0';
  const colors = [pink, kelloggPurple];
  (function frame() {
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors
    });
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

export default kelloggConfetti;
