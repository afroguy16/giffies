import { GifT } from 'src/app/components/giffy/types';
import { PaginationT } from 'src/app/services/types';

export type SaveGiffiesPayloadT = {
  pagination: PaginationT;
  data: GifT[];
};
