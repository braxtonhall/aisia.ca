const START_TIME = performance.now();
const START_DATE = Date.now();

const clockNow = () => START_DATE + (performance.now() - START_TIME);

const getTime = () => Math.floor(clockNow());
