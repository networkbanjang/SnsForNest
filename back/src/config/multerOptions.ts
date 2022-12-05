import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

const createFolder = (folder: string) => {
  try {
    fs.readdirSync(folder);
  } catch (error) {
    console.error(`${folder} 폴더가 없어 생성합니다.`);
    fs.mkdirSync(folder);
  }
};

const storage = (folder: string): multer.StorageEngine => {
  return multer.diskStorage({
    //디스크에
    destination(req, file, cb) {
      //어디에 저장할지
      cb(null, folder);
    },
    filename(req, file, cb) {
      //어떤이름으로 올릴지
      const ext = path.extname(file.originalname); //확장자
      const basename = path.basename(file.originalname, ext); //오리지널네임+확장자
      cb(null, basename + '_' + new Date().getTime() + ext); //에러처리, 파일명항목(베이스네임+날짜+확장자)
    },
  });
};

export const multerOptions = (folder: string) => {
  createFolder(folder);
  const result: MulterOptions = {
    storage: storage(folder),
    limits: { fileSize: 20 * 1024 * 1024 }, //20MB
  };
  return result;
};
