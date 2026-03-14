import otterImg from '/assets/initial_character.png';

const DEFAULT_OTTER_NAME = '小浪花';

type ClaimOtterStepOnePayload = {
  name: string;
  accessories: string[];
};

type ClaimOtterStepOneOptions = {
  onNext?: (payload: ClaimOtterStepOnePayload) => void;
};

type AccessoryDefinition = {
  id: string;
  label: string;
  assetPath: string;
  anchorX: number;
  anchorY: number;
  width: number;
  rotation: number;
};

const ACCESSORY_CATALOG: AccessoryDefinition[] = [
  {
    id: 'cap',
    label: '小帽子',
    assetPath: '/assets/accessories/otter-cap.png',
    anchorX: 51,
    anchorY: 18,
    width: 24,
    rotation: -3,
  },
  {
    id: 'glasses',
    label: '圆眼镜',
    assetPath: '/assets/accessories/otter-glasses.png',
    anchorX: 50,
    anchorY: 31,
    width: 30,
    rotation: 0,
  },
  {
    id: 'scarf',
    label: '围巾',
    assetPath: '/assets/accessories/otter-scarf.png',
    anchorX: 50,
    anchorY: 58,
    width: 36,
    rotation: 0,
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
  const selectedAccessoryIds = new Set<string>();

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
      <div class="otter-stage" data-stage>
        <img class="otter-shell" data-otter src="${otterImg}" alt="${DEFAULT_OTTER_NAME}" />
        <div class="otter-accessory-layer" data-accessory-layer aria-hidden="true"></div>
      </div>
      <div class="otter-name-badge" data-otter-name>${DEFAULT_OTTER_NAME}</div>
      <div class="sparkles" data-sparkles aria-hidden="true"></div>
    </div>

    <section class="claim-step-one__controls" aria-label="水獭设置">
      <label class="otter-field">
        <span class="otter-field__label">给水獭取名</span>
        <input
          class="otter-field__input"
          type="text"
          maxlength="12"
          value="${DEFAULT_OTTER_NAME}"
          placeholder="请输入水獭名字"
          data-name-input
        />
      </label>

      <div class="otter-field">
        <span class="otter-field__label">选择配饰</span>
        <div class="otter-accessory-picker" data-accessory-picker>
          ${ACCESSORY_CATALOG.map(
            (item) => `
              <button
                class="otter-accessory-chip"
                type="button"
                data-accessory-id="${item.id}"
                aria-pressed="false"
              >
                ${item.label}
              </button>
            `,
          ).join('')}
        </div>
      </div>
    </section>

    <footer class="claim-step-one__footer">
      <button class="magic-btn" type="button" data-summon>挥挥魔法棒</button>
      <button class="next-btn" type="button" data-next disabled>继续下一步</button>
    </footer>
  `;

  const summonButton = requireElement<HTMLButtonElement>(element, '[data-summon]');
  const nextButton = requireElement<HTMLButtonElement>(element, '[data-next]');
  const otter = requireElement<HTMLImageElement>(element, '[data-otter]');
  const otterNameBadge = requireElement<HTMLElement>(element, '[data-otter-name]');
  const nameInput = requireElement<HTMLInputElement>(element, '[data-name-input]');
  const sparkles = requireElement<HTMLElement>(element, '[data-sparkles]');
  const accessoryLayer = requireElement<HTMLElement>(element, '[data-accessory-layer]');
  const accessoryButtons = Array.from(element.querySelectorAll<HTMLButtonElement>('[data-accessory-id]'));

  function getSelectedAccessoryLabels(): string[] {
    return ACCESSORY_CATALOG.filter(({ id }) => selectedAccessoryIds.has(id)).map(({ label }) => label);
  }

  function syncOtterName(): void {
    const nextName = nameInput.value.trim() || DEFAULT_OTTER_NAME;

    otterName = nextName;
    otterNameBadge.textContent = nextName;
    otter.alt = `${nextName}的形象`;
  }

  function renderAccessoryLayer(): void {
    accessoryLayer.replaceChildren();

    ACCESSORY_CATALOG.filter(({ id }) => selectedAccessoryIds.has(id)).forEach((item) => {
      const accessory = document.createElement('div');
      accessory.className = 'otter-accessory';
      accessory.style.setProperty('--anchor-x', String(item.anchorX));
      accessory.style.setProperty('--anchor-y', String(item.anchorY));
      accessory.style.setProperty('--anchor-width', String(item.width));
      accessory.style.setProperty('--anchor-rotation', `${item.rotation}deg`);

      const image = document.createElement('img');
      image.className = 'otter-accessory__image';
      image.src = item.assetPath;
      image.alt = item.label;
      image.loading = 'lazy';

      const fallback = document.createElement('span');
      fallback.className = 'otter-accessory__fallback';
      fallback.textContent = `${item.label} 待素材`;

      image.addEventListener('load', () => {
        accessory.classList.add('is-ready');
      });

      image.addEventListener('error', () => {
        accessory.classList.remove('is-ready');
      });

      accessory.append(image, fallback);
      accessoryLayer.append(accessory);
    });
  }

  function toggleAccessory(id: string): void {
    if (selectedAccessoryIds.has(id)) {
      selectedAccessoryIds.delete(id);
    } else {
      selectedAccessoryIds.add(id);
    }

    accessoryButtons.forEach((button) => {
      const accessoryId = button.dataset.accessoryId ?? '';
      const isPressed = selectedAccessoryIds.has(accessoryId);
      button.setAttribute('aria-pressed', String(isPressed));
      button.classList.toggle('is-selected', isPressed);
    });

    renderAccessoryLayer();
  }

  function summon(): void {
    if (isSummoned) {
      return;
    }

    isSummoned = true;
    element.classList.add('is-summoned');
    otter.classList.add('is-visible');
    sparkles.classList.add('is-active');

    summonButton.textContent = '召唤成功！';
    summonButton.disabled = true;
    nextButton.disabled = false;
  }

  syncOtterName();
  renderAccessoryLayer();

  summonButton.addEventListener('click', summon);
  nameInput.addEventListener('input', syncOtterName);
  accessoryButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const accessoryId = button.dataset.accessoryId;

      if (!accessoryId) {
        return;
      }

      toggleAccessory(accessoryId);
    });
  });
  nextButton.addEventListener('click', () => {
    onNext({
      name: otterName,
      accessories: getSelectedAccessoryLabels(),
    });
  });

  return { element };
}