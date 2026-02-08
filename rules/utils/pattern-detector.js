const REACT_SUSPENSE_APIS = new Set(['use', 'lazy']);

function isSuspensePattern({ hookName, node, additionalTriggers = new Set() }) {
  if (!hookName) return false;

  if (REACT_SUSPENSE_APIS.has(hookName)) {
    return true;
  }

  if (/Suspense/i.test(hookName)) {
    return true;
  }

  if (hookName === 'useSWR') {
    return hasSuspenseOption(node);
  }

  if (additionalTriggers.has(hookName)) {
    return true;
  }

  return false;
}

function hasSuspenseOption(node) {
  if (!node || !node.arguments) return false;

  const optionsArg = node.arguments[2];

  if (!optionsArg || optionsArg.type !== 'ObjectExpression') {
    return false;
  }

  const suspenseProp = optionsArg.properties.find((prop) => {
    return (
      prop.type === 'Property' &&
      prop.key.type === 'Identifier' &&
      prop.key.name === 'suspense'
    );
  });

  if (!suspenseProp) return false;

  return (
    suspenseProp.value.type === 'Literal' && suspenseProp.value.value === true
  );
}

function extractHookName(node) {
  if (node.callee.type === 'Identifier') {
    return node.callee.name;
  }

  if (node.callee.type === 'MemberExpression') {
    return node.callee.property.name;
  }

  return null;
}

function isHookName(name) {
  return /^use/.test(name);
}

function isComponentName(name) {
  return /^[A-Z]/.test(name);
}

/**
 * ✨ HOC 이름인지 확인 (with로 시작)
 * @param {string} name
 * @returns {boolean}
 */
function isHOCName(name) {
  return /^with[A-Z]/.test(name);
}

function hasCorrectSuspenseHookNaming(name) {
  return /^useSuspense/.test(name);
}

function hasCorrectSuspenseComponentNaming(name) {
  return /^Suspense/.test(name);
}

/**
 * ✨ HOC 이름이 올바른 Suspense 네이밍인지 확인
 * @param {string} name
 * @returns {boolean}
 */
function hasCorrectSuspenseHOCNaming(name) {
  return /^withSuspense/.test(name);
}

function suggestHookName(hookName) {
  return hookName.replace(/^use/, 'useSuspense');
}

/**
 * ✨ HOC 이름에서 추천 이름 생성
 * @param {string} hocName - 원본 HOC 이름 (예: withUser)
 * @returns {string} - 추천 이름 (예: withSuspenseUser)
 */
function suggestHOCName(hocName) {
  return hocName.replace(/^with/, 'withSuspense');
}

module.exports = {
  REACT_SUSPENSE_APIS,
  isSuspensePattern,
  hasSuspenseOption,
  extractHookName,
  isHookName,
  isComponentName,
  isHOCName,
  hasCorrectSuspenseHookNaming,
  hasCorrectSuspenseComponentNaming,
  hasCorrectSuspenseHOCNaming,
  suggestHookName,
  suggestHOCName,
};
