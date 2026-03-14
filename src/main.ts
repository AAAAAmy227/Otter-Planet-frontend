import './modules/otter-claim/step1/claimOtterStepOne.css';
import { createClaimOtterStepOne } from './modules/otter-claim/step1/createClaimOtterStepOne';

const app = document.querySelector<HTMLElement>('#app');

if (!app) {
  throw new Error('App root element #app was not found.');
}

const stepOneModule = createClaimOtterStepOne({
  onNext({ name, accessories }) {
    const accessoryText = accessories.length > 0 ? accessories.join('、') : '暂无';

    window.alert(`已完成第一步：${name} 已就位，当前配饰：${accessoryText}。`);
  },
});

app.append(stepOneModule.element);