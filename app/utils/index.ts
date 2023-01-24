/**
 * @returns an array of all the keys in the given object except for the given key
 */
export function getAllOtherKeys(key: string, obj: any) {
  return Object.keys(obj).filter((objKey) => objKey !== key);
}

export function lockOtherSkillsForIndex(
  keys: string[],
  skills: any,
  indexToLock: number
) {
  keys.forEach((key) => {
    skills[key][indexToLock] = {
      toggled: false,
      locked: true
    };
  });
}

export function checkAbilityMaxed(ability: string, abilityCount: number) {
  return (
    (ability === "r" && abilityCount >= 3) ||
    (ability !== "r" && abilityCount >= 5)
  );
}

export function urlParametize(parameter: string) {
  return parameter.toLowerCase().replaceAll(" ", "-");
}
