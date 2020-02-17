function isPalindrome(word)
{
    let m = word.length % 2;
    let halfLen = (word.length - m) / 2;
    let s1 = word.substr(0, halfLen).toLocaleLowerCase();
    let s2 = word.substr(halfLen + m).toLocaleLowerCase();
    // s2 = s2.split('').reverse().join('');
    s2 = [...s2].reverse().join('');
    return s1 === s2;
}
var word = 'Deleveled2';
console.log(isPalindrome(word));
