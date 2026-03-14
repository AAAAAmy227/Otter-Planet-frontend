import './modules/otter-claim/step1/claimOtterStepOne.css';
import { createClaimOtterStepOne } from './modules/otter-claim/step1/createClaimOtterStepOne.js';

const app = document.querySelector('#app');

const stepOneModule = createClaimOtterStepOne({
  onNext() {
    window.alert('已完成第一步：水獭召唤。下一步可进入配件选择模块。');
  },
});

app.append(stepOneModule.element);
