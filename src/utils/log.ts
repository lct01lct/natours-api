export const redLog = (str: string) => {
  console.log('\x1B[31m%s\x1B[0m', str);
};

export const greenLog = (str: string) => {
  console.log('\x1B[32m%s\x1B[0m', str);
};
