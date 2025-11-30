const detectSuspenseHook = require('./rules/detect-suspense-hook');

module.exports = {
  rules: {
    // 규칙 이름을 'detect-suspense-hook'으로 정함
    'detect-suspense-hook': detectSuspenseHook,
  },
};
