type ClaimOtterStepTwoOptions = {
  onNext?: () => void;
  onBack?: () => void;
};

export function createClaimOtterStepTwo({
  onNext = () => {},
  onBack = () => {},
}: ClaimOtterStepTwoOptions = {}): { element: HTMLElement } {
  const element = document.createElement('section');
  element.className = 'claim-step-two';

  element.innerHTML = `
    <img class="claim-step-two__bg" src="/assets/planet_background.png" alt="" aria-hidden="true" />
    <div class="claim-step-two__content">
      <footer class="claim-step-two__footer">
        <button class="step-two-back-btn" type="button" data-back>← 返回</button>
        <button class="step-two-next-btn" type="button" data-next>继续下一步 →</button>
      </footer>
    </div>
  `;

  const backButton = element.querySelector<HTMLButtonElement>('[data-back]')!;
  const nextButton = element.querySelector<HTMLButtonElement>('[data-next]')!;

  backButton.addEventListener('click', () => onBack());
  nextButton.addEventListener('click', () => onNext());

  return { element };
}
