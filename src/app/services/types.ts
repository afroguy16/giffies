import { GifT } from '../components/giffy/types';
import { LocaleE, RatingE } from './enums';

type FixedDimensionT = {
  webp: string;
};

type ResponseImagesT = {
  fixed_height: FixedDimensionT;
  fixed_width: FixedDimensionT;
};

type ResponseMetaT = {
  msg: string;
  status: number;
  response_id: string;
};

export type PaginationT = {
  offset: number;
  total_count: number;
  count: number;
};

export type ResponseDataT = Array<
  Omit<GifT, 'url'> & { images: ResponseImagesT }
>;

export type GiffiesResponseT = {
  data: ResponseDataT;
  pagination: PaginationT;
  meta: ResponseMetaT;
};
