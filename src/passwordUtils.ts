import bcrypt from "bcrypt";


export function hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, function (error, hashedPassword) {
            if (error) {
                reject(error);
            } else {
                resolve(hashedPassword);
            }
        });
    });
}

export function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hashedPassword, function (error, result) {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}