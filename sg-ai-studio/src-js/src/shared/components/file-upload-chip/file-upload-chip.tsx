import { Chip } from "@siteground/styleguide";
import "./styles.scss";

const FileUploadChip = ({ file }: { file?: File }) => {
  if (!file) {
    return null;
  }

  return (
    <div className="message-box__file-upload-wrapper">
      <Chip onDelete={() => alert("TODO")}>{file.name}</Chip>
    </div>
  );
};

export default FileUploadChip;
