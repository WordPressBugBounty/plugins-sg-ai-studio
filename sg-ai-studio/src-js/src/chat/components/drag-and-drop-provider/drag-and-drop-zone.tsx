import { Flex, Grid } from "@siteground/styleguide";
import "./styles.scss";
import { FC } from "react";
import { cn } from "@siteground/styleguide/lib";
import { getSupportedFileFormats } from "../chat-message-files/types";
import { translate } from "i18n-calypso";
import { LargeUploadCard } from "./uploading-card";

interface Props {
  className?: string;
}
export const DragAndDropZone: FC<Props> = ({ className }) => {
  const supportedFormats = getSupportedFileFormats();
  return (
    <Grid align="center">
      <Flex
        direction="column"
        align="center"
        className={cn("md-drag-and-drop", "md-drag-and-drop__content", className)}
      >
        <LargeUploadCard
          dndTextCta={translate("Drop Your Files Here To Upload")}
          upperSubtitle={translate("File Size up to: 20MB")}
          lowerSubtitle={translate("Supported Formats: ").concat(supportedFormats)}
          icon="material/place_item"
        />
      </Flex>
    </Grid>
  );
};
