import otterImg from '/assets/initial_character.png';

type ClaimOtterStepTwoPayload = {
  name: string;
  step1Accessories: string[];
  step2Accessories: Record<string, string>;
};

type ClaimOtterStepTwoOptions = {
  name?: string;
  step1Accessories?: string[];
  onNext?: (payload: ClaimOtterStepTwoPayload) => void;
  onBack?: () => void;
};

type AccessoryOption = {
  id: string;
  label: string;
  emoji: string;
};

type AccessoryGroup = {
  id: string;
  label: string;
  options: AccessoryOption[];
};

const ACCESSORY_GROUPS: AccessoryGroup[] = [
  {
    id: 'headwear',
    label: '头饰',
    options: [
      { id: 'star-cap', label: '星星帽', emoji: '⭐' },
      { id: 'headphones', label: '小耳机', emoji: '🎧' },
      { id: 'moon-clip', label: '月亮发夹', emoji: '🌙' },
    ],
  },
  {
    id: 'back',
    label: '背饰',
    options: [
      { id: 'backpack', label: '小背包', emoji: '🎒' },
      { id: 'cape', label: '披风', emoji: '🦸' },
      { id: 'bubble-ring', label: '气泡环', emoji: '🫧' },
    ],
  },
  {
    id: 'hand',
    label: '手持',
    options: [
      { id: 'magic-wand', label: '魔法棒', emoji: '🪄' },
      { id: 'book', label: '小书', emoji: '📖' },
      { id: 'shell', label: '发光贝壳', emoji: '🐚' },
    ],
  },
];

function requireElement<T extends Element>(root: ParentNode, selector: string): T {
  const el = root.querySelector<T>(selector);

  if (!el) {
    throw new Error(`Expected element not found: ${selector}`);
  }

  return el;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

export function createClaimOtterStepTwo({
  name = '小浪花',
  step1Accessories = [],
  onNext = () => {},
  onBack = () => {},
}: ClaimOtterStepTwoOptions = {}): { element: HTMLElement } {
  const selections: Record<string, string> = {};

  const element = document.createElement('section');
  element.className = 'claim-step-two';

  element.innerHTML = `
    <img class="claim-step-two__bg" src="/assets/planet_background.png" alt="" aria-hidden="true" />

    <div class="claim-step-two__content">
      <header class="claim-step-two__header">
        <h1>选一选它今天的冒险装备吧～</h1>
        <p>为 <strong data-otter-name>${name}</strong> 挑选专属配件（第二步）</p>
      </header>

      <div class="claim-step-two__scene">
        <div class="step-two-otter-stage">
          <img class="step-two-otter-shell" src="${otterImg}" alt="${name}" />
          <div class="step-two-selection-badge" data-selection-badge aria-live="polite">快来穿搭吧！</div>
        </div>
      </div>

      <div class="claim-step-two__groups" data-groups>
        ${ACCESSORY_GROUPS.map(
          (group) => `
          <div class="step-two-group" data-group-id="${group.id}">
            <span class="step-two-group__label">${group.label}</span>
            <div class="step-two-group__options">
              ${group.options
                .map(
                  (opt) => `
                <button
                  class="step-two-option-card"
                  type="button"
                  data-group="${group.id}"
                  data-option="${opt.id}"
                  aria-pressed="false"
                >
                  <span class="step-two-option-card__emoji">${opt.emoji}</span>
                  <span class="step-two-option-card__label">${opt.label}</span>
                </button>
              `,
                )
                .join('')}
            </div>
          </div>
        `,
        ).join('')}
      </div>

      <footer class="claim-step-two__footer">
        <button class="step-two-back-btn" type="button" data-back>← 返回</button>
        <button class="step-two-random-btn" type="button" data-random>随机一下 🎲</button>
        <button class="step-two-next-btn" type="button" data-next>继续下一步 →</button>
      </footer>
    </div>
  `;

  const selectionBadge = requireElement<HTMLElement>(element, '[data-selection-badge]');
  const nextButton = requireElement<HTMLButtonElement>(element, '[data-next]');
  const randomButton = requireElement<HTMLButtonElement>(element, '[data-random]');
  const backButton = requireElement<HTMLButtonElement>(element, '[data-back]');
  const allOptionCards = Array.from(element.querySelectorAll<HTMLButtonElement>('[data-option]'));

  function updateSelectionBadge(): void {
    const labels = ACCESSORY_GROUPS.filter((g) => selections[g.id]).map((g) => {
      const opt = g.options.find((o) => o.id === selections[g.id]);

      return opt ? `${opt.emoji}${opt.label}` : '';
    });

    selectionBadge.textContent = labels.length > 0 ? labels.join('  ') : '快来穿搭吧！';
  }

  function selectOption(groupId: string, optionId: string): void {
    selections[groupId] = optionId;

    allOptionCards.forEach((card) => {
      if (card.dataset.group === groupId) {
        const isSelected = card.dataset.option === optionId;
        card.setAttribute('aria-pressed', String(isSelected));
        card.classList.toggle('is-selected', isSelected);
      }
    });

    updateSelectionBadge();
  }

  function randomize(): void {
    ACCESSORY_GROUPS.forEach((group) => {
      const picked = pickRandom(group.options);
      selectOption(group.id, picked.id);
    });
  }

  allOptionCards.forEach((card) => {
    card.addEventListener('click', () => {
      const { group, option } = card.dataset;

      if (group && option) {
        selectOption(group, option);
      }
    });
  });

  randomButton.addEventListener('click', randomize);

  backButton.addEventListener('click', () => onBack());

  nextButton.addEventListener('click', () => {
    onNext({
      name,
      step1Accessories,
      step2Accessories: { ...selections },
    });
  });

  return { element };
}
