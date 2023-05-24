export const errorLog = (str: string) => {
  console.log('\x1B[31m%s\x1B[0m', str);
};

export const successLog = (str: string) => {
  console.log('\x1B[32m%s\x1B[0m', str);
};

export const logger = {
  success: successLog,
  error: errorLog,
};
