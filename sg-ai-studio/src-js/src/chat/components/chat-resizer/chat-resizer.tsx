import { Fragment } from "react/jsx-runtime";

const ChatResizer = () => {
  return (
    <Fragment>
      <div
        className="wp-ai-studio-chat__resizer wp-ai-studio-chat__resizer--left"
        data-resizer="resize-left"
      />
      <div
        className="wp-ai-studio-chat__resizer wp-ai-studio-chat__resizer--right"
        data-resizer="resize-right"
      />
      <div
        className="wp-ai-studio-chat__resizer wp-ai-studio-chat__resizer--bottom"
        data-resizer="resize-bottom"
      />
      <div
        className="wp-ai-studio-chat__resizer wp-ai-studio-chat__resizer--top"
        data-resizer="resize-top"
      />

      <div
        className="wp-ai-studio-chat__resizer wp-ai-studio-chat__resizer--top-left"
        data-resizer="resize-top-left"
      />
      <div
        className="wp-ai-studio-chat__resizer wp-ai-studio-chat__resizer--top-right"
        data-resizer="resize-top-right"
      />
      <div
        className="wp-ai-studio-chat__resizer wp-ai-studio-chat__resizer--bottom-left"
        data-resizer="resize-bottom-left"
      />
      <div
        className="wp-ai-studio-chat__resizer wp-ai-studio-chat__resizer--bottom-right"
        data-resizer="resize-bottom-right"
      />
    </Fragment>
  );
};

export default ChatResizer;
