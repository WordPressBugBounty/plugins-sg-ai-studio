import * as React from "react";
import Text from "@siteground/styleguide/lib/components/text/text";
import { Chip } from "@siteground/styleguide";
import { translate } from "i18n-calypso";

interface DeletedMediaChipProps {
  mediaType: "image" | "file";
}

export const DeletedMediaChip: React.FC<DeletedMediaChipProps> = ({ mediaType }) => {
  const icon = mediaType === "image" ? "material/image" : "material/description";
  const message = mediaType === "image"
    ? translate("Image had been deleted")
    : translate("File has been deleted");

  return (
    <Chip leadingIcon={icon} size="medium" color="secondary" className="override-icon" disabled>
      <Text italic color="typography-tertiary" className="chip__text">
        {message}
      </Text>
    </Chip>
  );
};
