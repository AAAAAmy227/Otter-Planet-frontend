import otterImg from '/assets/initial_character.png';

const DEFAULT_OTTER_NAME = '小浪花';

type ClaimOtterStepOnePayload = {
  name: string;
  accessories: string[];
  gearSelections: Record<string, string>;
};

type ClaimOtterStepOneOptions = {
  onNext?: (payload: ClaimOtterStepOnePayload) => void;
};

type AccessoryOption = {
  id: string;
  label: string;
  emoji: string;
};

type AccessoryGroup = {
  id: string;
  label: string;
  bx: number;
  by: number;
  options: AccessoryOption[];
};

const ACCESSORY_GROUPS: AccessoryGroup[] = [
  {
    id: 'headwear',
    label: '头饰',
    bx: 50,
    by: 3,
    options: [
      { id: 'star-cap',    label: '星星帽',   emoji: '⭐' },
      { id: 'headphones',  label: '小耳机',   emoji: '🎧' },
      { id: 'moon-clip',   label: '月亮发夹', emoji: '🌙' },
    ],
  },
  {
    id: 'back',
    label: '背饰',
    bx: 92,
    by: 42,
    options: [
      { id: 'backpack',    label: '小背包',   emoji: '🎒' },
      { id: 'cape',        label: '披风',     emoji: '🦸' },
      { id: 'bubble-ring', label: '气泡环',   emoji: '🫧' },
    ],
  },
  {
    id: 'hand',
    label: '手持',
    bx: 15,
    by: 88,
    options: [
      { id: 'magic-wand',  label: '魔法棒',   emoji: '🪄' },
      { id: 'book',        label: '小书',     emoji: '📖' },
      { id: 'shell',       label: '发光贝壳', emoji: '🐚' },
    ],
  },
];

function requireElement<T extends Element>(root: ParentNode, selector: string): T {
  const element = root.querySelector<T>(selector);

  if (!element) {
    throw new Error(`Expected element not found for selector: ${selector}`);
  }

  return element;
}

export function createClaimOtterStepOne({ onNext = () => {} }: ClaimOtterStepOneOptions = {}): { element: HTMLElement } {
  let isSummoned = false;
  let otterName = DEFAULT_OTTER_NAME;

  // cycleIndex per group: 0 = none, 1..n = option index
  const groupCycleIndex: Record<string, number> = Object.fromEntries(
    ACCESSORY_GROUPS.map((g) => [g.id, 0]),
  );

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
      <div class="otter-stage" data-stage>
        <img class="otter-shell" data-otter src="${otterImg}" alt="${DEFAULT_OTTER_NAME}" />
        <div class="otter-accessory-layer" data-accessory-layer aria-hidden="true"></div>
      </div>
      <div class="otter-name-badge" data-otter-name>${DEFAULT_OTTER_NAME}</div>
      <div class="step-two-selection-badge" data-selection-badge aria-live="polite">快来穿搭吧！</div>
      ${ACCESSORY_GROUPS.map(
        (g) =>
          `<button
            class="otter-bubble"
            type="button"
            data-bubble-group="${g.id}"
            aria-pressed="false"
            aria-label="${g.label}"
            style="--bx:${g.bx};--by:${g.by}"
          >＋</button>`,
      ).join('')}
    </div>

    <div class="otter-name-input-wrap">
      <input
        class="otter-field__input"
        type="text"
        maxlength="12"
        value="${DEFAULT_OTTER_NAME}"
        placeholder="给你的水獭取个名字吧~"
        data-name-input
      />
    </div>

    <footer class="claim-step-one__footer">
      <button class="magic-btn" type="button" data-summon>挥挥魔法棒</button>
      <button class="step-two-random-btn" type="button" data-random>随机一下 🎲</button>
      <button class="next-btn" type="button" data-next disabled>继续下一步</button>
    </footer>
  `;

  const summonButton = requireElement<HTMLButtonElement>(element, '[data-summon]');
  const nextButton = requireElement<HTMLButtonElement>(element, '[data-next]');
  const otter = requireElement<HTMLImageElement>(element, '[data-otter]');
  const otterNameBadge = requireElement<HTMLElement>(element, '[data-otter-name]');
  const nameInput = requireElement<HTMLInputElement>(element, '[data-name-input]');
  const selectionBadge = requireElement<HTMLElement>(element, '[data-selection-badge]');
  const randomButton = requireElement<HTMLButtonElement>(element, '[data-random]');
  const bubbleButtons = Array.from(element.querySelectorAll<HTMLButtonElement>('[data-bubble-group]'));

  function syncOtterName(): void {
    const nextName = nameInput.value.trim() || DEFAULT_OTTER_NAME;

    otterName = nextName;
    otterNameBadge.textContent = nextName;
    otter.alt = `${nextName}的形象`;
  }

  function updateSelectionBadge(): void {
    const labels = ACCESSORY_GROUPS.flatMap((g) => {
      const idx = groupCycleIndex[g.id] ?? 0;
      if (idx === 0) return [];
      const opt = g.options[idx - 1]!;
      return [`${opt.emoji}${opt.label}`];
    });

    selectionBadge.textContent = labels.length > 0 ? labels.join('  ') : '快来穿搭吧！';
  }

  function cycleGroup(groupId: string): void {
    const group = ACCESSORY_GROUPS.find((g) => g.id === groupId);
    if (!group) return;

    const nextIdx = ((groupCycleIndex[groupId] ?? 0) + 1) % (group.options.length + 1);
    groupCycleIndex[groupId] = nextIdx;

    const bubble = bubbleButtons.find((b) => b.dataset.bubbleGroup === groupId);
    if (!bubble) return;

    const isEmpty = nextIdx === 0;
    const currentOpt = isEmpty ? undefined : group.options[nextIdx - 1];
    bubble.textContent = isEmpty ? '＋' : currentOpt!.emoji;
    bubble.setAttribute('aria-pressed', String(!isEmpty));
    bubble.setAttribute('aria-label', isEmpty ? group.label : currentOpt!.label);
    bubble.classList.toggle('is-selected', !isEmpty);

    updateSelectionBadge();
  }

  function randomize(): void {
    ACCESSORY_GROUPS.forEach((group) => {
      const randomIdx = Math.floor(Math.random() * group.options.length) + 1;
      groupCycleIndex[group.id] = randomIdx;
      const bubble = bubbleButtons.find((b) => b.dataset.bubbleGroup === group.id);
      if (bubble) {
        const opt = group.options[randomIdx - 1]!;
        bubble.textContent = opt.emoji;
        bubble.setAttribute('aria-pressed', 'true');
        bubble.setAttribute('aria-label', opt.label);
        bubble.classList.add('is-selected');
      }
    });
    updateSelectionBadge();
  }

  function summon(): void {
    if (isSummoned) {
      return;
    }

    isSummoned = true;
    element.classList.add('is-summoned');
    otter.classList.add('is-visible');

    summonButton.textContent = '召唤成功！';
    summonButton.disabled = true;
    nextButton.disabled = false;
  }

  syncOtterName();

  summonButton.addEventListener('click', summon);
  nameInput.addEventListener('input', syncOtterName);
  bubbleButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const groupId = button.dataset.bubbleGroup;
      if (groupId) cycleGroup(groupId);
    });
  });
  randomButton.addEventListener('click', randomize);
  nextButton.addEventListener('click', () => {
    onNext({
      name: otterName,
      accessories: [],
      gearSelections: Object.fromEntries(
        ACCESSORY_GROUPS.map((g) => {
          const idx = groupCycleIndex[g.id] ?? 0;
          return [g.id, idx === 0 ? '' : g.options[idx - 1]!.id];
        }),
      ),
    });
  });

  return { element };
}