import { GifT } from '../components/giffy/types';

export type PaginationT = {
  offset: number;
  total_count: number;
  count: number;
};

type ResponseMetaT = {
  msg: string;
  status: number;
  response_id: string;
};

export type GiffiesResponseT = {
  data: GifT[];
  pagination: PaginationT;
  meta: ResponseMetaT;
};
