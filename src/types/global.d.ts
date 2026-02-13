declare global {
  interface Window {
    mcp?: {
      callTool(name: string, args: any): Promise<any>;
    };
  }
}

export {};
