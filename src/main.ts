import './modules/otter-claim/step1/claimOtterStepOne.css';
import './modules/otter-claim/step2/claimOtterStepTwo.css';
import { createClaimOtterStepOne } from './modules/otter-claim/step1/createClaimOtterStepOne';
import { createClaimOtterStepTwo } from './modules/otter-claim/step2/createClaimOtterStepTwo';

const app = document.querySelector<HTMLElement>('#app');

if (!app) {
  throw new Error('App root element #app was not found.');
}

function showStep(incoming: HTMLElement): void {
  const current = app.firstElementChild as HTMLElement | null;

  if (current) {
    current.remove();
  }

  app.append(incoming);
}

const stepOneModule = createClaimOtterStepOne({
  onNext({ name, accessories }) {
    const stepTwoModule = createClaimOtterStepTwo({
      name,
      step1Accessories: accessories,
      onBack() {
        showStep(stepOneModule.element);
      },
      onNext({ name: otterName, step2Accessories }) {
        const selected = Object.values(step2Accessories).join('、') || '暂无';

        window.alert(`已完成第二步：${otterName} 的冒险装备已选好！\n装备：${selected}`);
      },
    });

    showStep(stepTwoModule.element);
  },
});

showStep(stepOneModule.element);