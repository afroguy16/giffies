import { GifT } from 'src/app/components/giffy/types';
import { LocaleE, RatingE } from 'src/app/services/enums';
import { PaginationT } from 'src/app/services/types';

export type SaveGiffiesPayloadT = {
  pagination: PaginationT;
  data: GifT[];
};

export type RequestPayloadT = {
  query: string;
  limit: number;
  offset: number;
  rating: RatingE.G;
  lang: LocaleE.EN;
};
