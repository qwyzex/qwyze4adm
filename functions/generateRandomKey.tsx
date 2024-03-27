// Generate Key
function generateRandomKey(length: number): string {
    const characters =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+";
    const charactersLength = characters.length;
    let key = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charactersLength);
        key += characters.charAt(randomIndex);
    }
    return key;
}

export default generateRandomKey;
