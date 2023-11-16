export const replaceExceedingLetters = (str, maxLength = 16) => {
    const firstPart = str.slice(0, maxLength);
    const remainingDots = Array.from({ length: str.length - maxLength }, () => '.').join('');
    return `${firstPart}${str.length > maxLength ? remainingDots : ''}`;
};