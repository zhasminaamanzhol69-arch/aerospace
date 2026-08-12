declare module 'mammoth/mammoth.browser' {
  type ExtractRawTextResult = { value: string; messages: Array<{ message: string }> };

  const mammoth: {
    extractRawText(input: { arrayBuffer: ArrayBuffer }): Promise<ExtractRawTextResult>;
  };

  export default mammoth;
}
