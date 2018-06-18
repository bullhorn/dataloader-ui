export enum ILevel {
  Log,
  Warning,
  Error,
}

// Message that is passed from the main process to the renderer process for user notifications
export interface IMessage {
  level: ILevel;
  title?: string;
  message: string;
}
