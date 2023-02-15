const dataStore = {
  compressImageBakList: [] as {
    originalFileBuffer: Buffer | null;
    originalFilePath: string;
    sourcePath: string;
    destinationPath: string;
  }[],
};

export default dataStore;
