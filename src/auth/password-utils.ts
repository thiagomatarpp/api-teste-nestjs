import * as bcrypt from "bcrypt";
export const getPasswordHash = async (password) => await bcrypt.hash(password, await bcrypt.genSalt());
export const verifyPasswordHash = async (password, hash) => await bcrypt.compare(password, hash);