export function createClaimOtterStepOne({ onNext = () => {} } = {}) {
  let isSummoned = false;

  const element = document.createElement('section');
  element.className = 'claim-step-one';
  element.innerHTML = `
    <div class="claim-step-one__bg-orb claim-step-one__bg-orb--left"></div>
    <div class="claim-step-one__bg-orb claim-step-one__bg-orb--right"></div>

    <header class="claim-step-one__header">
      <h1>你的水獭正在赶来！</h1>
      <p>挥动魔法棒，唤醒新伙伴（第一步）</p>
    </header>

    <div class="claim-step-one__scene" aria-live="polite">
      <div class="floating-island"></div>
      <div class="summon-ring" data-ring></div>
      <div class="otter-shell" data-otter>
        <div class="otter-ear otter-ear--left"></div>
        <div class="otter-ear otter-ear--right"></div>
        <div class="otter-face">
          <span class="otter-eye"></span>
          <span class="otter-eye"></span>
          <span class="otter-nose"></span>
        </div>
      </div>
      <div class="sparkles" data-sparkles aria-hidden="true"></div>
    </div>

    <footer class="claim-step-one__footer">
      <button class="magic-btn" type="button" data-summon>挥挥魔法棒</button>
      <button class="next-btn" type="button" data-next disabled>继续下一步</button>
    </footer>
  `;

  const summonButton = element.querySelector('[data-summon]');
  const nextButton = element.querySelector('[data-next]');
  const otter = element.querySelector('[data-otter]');
  const ring = element.querySelector('[data-ring]');
  const sparkles = element.querySelector('[data-sparkles]');

  function summon() {
    if (isSummoned) return;

    isSummoned = true;
    element.classList.add('is-summoned');
    otter.classList.add('is-visible');
    ring.classList.add('is-active');
    sparkles.classList.add('is-active');

    summonButton.textContent = '召唤成功！';
    summonButton.disabled = true;
    nextButton.disabled = false;
  }

  summonButton.addEventListener('click', summon);
  nextButton.addEventListener('click', () => onNext());

  return { element };
}
