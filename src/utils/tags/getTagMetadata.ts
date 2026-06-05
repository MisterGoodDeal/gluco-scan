import { PRODUCT_TAGS, type ProductTagMetadata } from '@/constants/product-tags';
import type { ProductTag } from '@/types/productTag';

const TAG_METADATA_MAP = new Map<ProductTag, ProductTagMetadata>(
  PRODUCT_TAGS.map((metadata) => [metadata.tag, metadata]),
);

export const getTagMetadata = (tag: ProductTag): ProductTagMetadata =>
  TAG_METADATA_MAP.get(tag) ?? TAG_METADATA_MAP.get('other')!;
