export const Schemas = {
  fileResourceProtocol: 'local-file',
};

export function getLocalImagePath(path: string) {
  return `${Schemas.fileResourceProtocol}://${path}`;
}
