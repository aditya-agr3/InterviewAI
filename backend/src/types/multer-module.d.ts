// Type declaration for multer module
declare module 'multer' {
  import { Request } from 'express';
  
  export interface FileFilterCallback {
    (error: Error | null, acceptFile: boolean): void;
  }

  export interface StorageEngine {
    _handleFile(req: Request, file: Express.Multer.File, callback: (error?: Error, info?: Partial<Express.Multer.File>) => void): void;
    _removeFile(req: Request, file: Express.Multer.File, callback: (error: Error | null) => void): void;
  }

  export interface Options {
    dest?: string;
    storage?: StorageEngine;
    fileFilter?: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => void;
    limits?: {
      fieldNameSize?: number;
      fieldSize?: number;
      fields?: number;
      fileSize?: number;
      files?: number;
      headerPairs?: number;
      parts?: number;
    };
  }

  export interface Multer {
    (options?: Options): {
      single(fieldname: string): any;
      array(fieldname: string, maxCount?: number): any;
      fields(fields: Array<{ name: string; maxCount?: number }>): any;
      none(): any;
      any(): any;
    };
    diskStorage(options: {
      destination?: string | ((req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => void);
      filename?: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => void;
    }): StorageEngine;
  }

  const multer: Multer;
  export default multer;
}
