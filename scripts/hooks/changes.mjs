export function getChangeFlat(result, target, modifierType, value, actor) {
    if (target.startsWith("aksh"))
        result.push(`system.akasha.${target.slice(4)}`);
    else
        return result;
}