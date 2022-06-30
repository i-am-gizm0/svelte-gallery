/**
 * @param child the element whose parents to check
 * @param parent the element to find
 * @returns whether `child` is parented by `parent`, no matter how high
 */
export function hasParent(child: HTMLElement, parent: HTMLElement): boolean {
    let comparisonElement = child;
    while (comparisonElement) {
        if (comparisonElement === parent) {
            return true;
        }
        comparisonElement = comparisonElement.parentElement;
    }
    return false;
}
