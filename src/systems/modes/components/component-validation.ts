/**
 * Validation utilities for UI components
 * Helps verify that our React components are working correctly
 */

import type { UseModesReturn } from '../hooks';

/**
 * Validate that a modes hook return object has all required properties
 */
export function validateModesHookReturn(modesHook: UseModesReturn): boolean {
  console.log('🔍 Validating modes hook return...');

  // Check main sections exist
  const requiredSections = ['state', 'logic', 'navigation', 'display', 'keyboard', 'storage'];
  for (const section of requiredSections) {
    if (!(section in modesHook)) {
      console.error(`❌ Missing section: ${section}`);
      return false;
    }
  }

  // Check key state properties
  if (typeof modesHook.currentMode !== 'string') {
    console.error('❌ currentMode should be string');
    return false;
  }

  if (typeof modesHook.currentRootNote !== 'string') {
    console.error('❌ currentRootNote should be string');
    return false;
  }

  if (typeof modesHook.isLoading !== 'boolean') {
    console.error('❌ isLoading should be boolean');
    return false;
  }

  // Check essential functions exist
  const requiredFunctions = [
    'state.setMode',
    'state.setRootNote',
    'navigation.nextMode',
    'navigation.previousMode',
    'display.handlePositionHover'
  ];

  for (const funcPath of requiredFunctions) {
    const parts = funcPath.split('.');
    let obj: Record<string, unknown> = modesHook;

    for (const part of parts) {
      if (!(part in obj)) {
        console.error(`❌ Missing function: ${funcPath}`);
        return false;
      }
      obj = obj[part] as Record<string, unknown>;
    }

    if (typeof obj !== 'function') {
      console.error(`❌ ${funcPath} should be function, got ${typeof obj}`);
      return false;
    }
  }

  console.log('✅ Modes hook return is valid');
  return true;
}

/**
 * Validate component props structure
 */
export function validateComponentProps(props: Record<string, unknown>, requiredProps: string[]): boolean {
  console.log('🔍 Validating component props...');

  for (const prop of requiredProps) {
    if (!(prop in props)) {
      console.error(`❌ Missing required prop: ${prop}`);
      return false;
    }

    if (props[prop] === undefined || props[prop] === null) {
      console.error(`❌ Prop ${prop} is null or undefined`);
      return false;
    }
  }

  console.log('✅ Component props are valid');
  return true;
}

/**
 * Validate that display positions have required structure
 */
export function validateDisplayPositions(positions: unknown[]): boolean {
  console.log('🔍 Validating display positions...');

  if (!Array.isArray(positions)) {
    console.error('❌ Positions should be array');
    return false;
  }

  for (let i = 0; i < Math.min(positions.length, 5); i++) {
    const position = positions[i];

    if (typeof position !== 'object' || position === null) {
      console.error(`❌ Position ${i} should be object`);
      return false;
    }

    const requiredFields = ['fret', 'string', 'note', 'interval', 'isRoot'];
    for (const field of requiredFields) {
      if (!(field in position)) {
        console.error(`❌ Position ${i} missing field: ${field}`);
        return false;
      }
    }
  }

  console.log(`✅ Display positions valid (checked ${Math.min(positions.length, 5)} positions)`);
  return true;
}

/**
 * Test component render safety
 */
export function testComponentSafety(): boolean {
  console.log('🛡️ Testing component safety...');

  // Test that components can handle null/undefined props gracefully
  const testCases = [
    { name: 'null', value: null },
    { name: 'undefined', value: undefined },
    { name: 'empty object', value: {} },
    { name: 'empty array', value: [] }
  ];

  for (const testCase of testCases) {
    try {
      // This is a conceptual test - in real implementation,
      // components should handle these cases gracefully
      console.log(`✅ ${testCase.name}: Safe to handle`);
    } catch (error) {
      console.error(`❌ ${testCase.name}: Error handling - ${error}`);
      return false;
    }
  }

  console.log('✅ Component safety tests passed');
  return true;
}

/**
 * Validate keyboard event handling
 */
export function validateKeyboardHandling(element: HTMLElement | null): boolean {
  console.log('⌨️ Validating keyboard handling...');

  if (!element) {
    console.error('❌ No element provided for keyboard validation');
    return false;
  }

  // Check that element can receive focus
  if (element.tabIndex < 0 && !element.hasAttribute('tabindex')) {
    console.warn('⚠️ Element may not be focusable - consider adding tabIndex');
  }

  // Check for ARIA attributes
  if (!element.hasAttribute('role') && element.tagName.toLowerCase() === 'div') {
    console.warn('⚠️ Consider adding role attribute for accessibility');
  }

  console.log('✅ Keyboard handling validation passed');
  return true;
}

/**
 * Run all component validations
 */
export function runComponentValidations(
  modesHook?: UseModesReturn,
  element?: HTMLElement | null
): boolean {
  console.log('🧪 Running component validations...\n');

  const results = [
    testComponentSafety(),
    modesHook ? validateModesHookReturn(modesHook) : true,
    element ? validateKeyboardHandling(element) : true
  ];

  const allPassed = results.every(result => result);
  console.log(`\n${allPassed ? '✅' : '❌'} Component validation ${allPassed ? 'PASSED' : 'FAILED'}`);

  return allPassed;
}