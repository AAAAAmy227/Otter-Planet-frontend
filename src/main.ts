import './modules/otter-claim/step1/claimOtterStepOne.css';
import './modules/otter-claim/step2/claimOtterStepTwo.css';
import { createClaimOtterStepOne } from './modules/otter-claim/step1/createClaimOtterStepOne';
import { createClaimOtterStepTwo } from './modules/otter-claim/step2/createClaimOtterStepTwo';

const app = document.querySelector<HTMLElement>('#app');

if (!app) {
  throw new Error('App root element #app was not found.');
}

function showStep(incoming: HTMLElement): void {
  const current = app!.firstElementChild as HTMLElement | null;

  if (current) {
    current.remove();
  }

  app!.append(incoming);
}

const stepOneModule = createClaimOtterStepOne({
  onNext({ name, accessories, gearSelections }) {
    const stepTwoModule = createClaimOtterStepTwo({
      onBack() {
        showStep(stepOneModule.element);
      },
      onNext() {
        const gearText = Object.values(gearSelections).join('、') || '暂无';
        const accessoryText = accessories.length > 0 ? accessories.join('、') : '暂无';

        window.alert(`${name} 已就位！配饰：${accessoryText}，装备：${gearText}。`);
      },
    });

    showStep(stepTwoModule.element);
  },
});

showStep(stepOneModule.element);