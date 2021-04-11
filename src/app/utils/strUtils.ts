export const bankNameToUniqueNumber = (name: string) => {
    const abc = 'abcdefghijklmnopqrstuvwxyz';
    let array = name.toLowerCase().replace(" ", "").split('');
    let acc = 0;
    array.forEach( (letra) => {
        acc += abc.indexOf(letra.toLowerCase());
      });
    return acc;
}