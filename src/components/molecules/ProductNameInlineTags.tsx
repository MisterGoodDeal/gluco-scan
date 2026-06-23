import { type FC } from "react";
import { Text } from "react-native";

import { FaIcon } from "@/components/atoms/FaIcon";
import type { ProductTag } from "@/types/productTag";
import { getTagMetadata } from "@/utils/tags/getTagMetadata";
import { sortProductTags } from "@/utils/tags/sortProductTags";
import { textLineClamp } from "@/utils/text";

type ProductNameInlineTagsProps = {
  name: string;
  tags: ProductTag[];
  lines?: number;
  className?: string;
  iconSize?: number;
};

export const ProductNameInlineTags: FC<ProductNameInlineTagsProps> = ({
  name,
  tags,
  lines = 2,
  className = "text-foreground text-base font-semibold",
  iconSize = 16,
}) => {
  const sortedTags = sortProductTags(tags);

  return (
    <Text className={className} {...textLineClamp(lines)}>
      {name}
      {"  "}
      {sortedTags.map((tag) => {
        const metadata = getTagMetadata(tag);
        return (
          <Text key={tag}>
            {" "}
            <FaIcon
              name={metadata.icon}
              size={iconSize}
              color={metadata.color}
            />
          </Text>
        );
      })}
    </Text>
  );
};
