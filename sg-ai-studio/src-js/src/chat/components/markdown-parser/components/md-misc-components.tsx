import { Link } from "@siteground/styleguide";
import { Components } from "react-markdown";

interface Props {
  className?: string;
}

export const MDMiscComponents = ({ className }: Props): Partial<Components> => {
  return {
    a: ({ children, href }) => (
      <Link href={href} target="_blank" className={className}>
        {children}
      </Link>
    ),
    blockquote: ({ children }) => <div className="sg-blockquote">{children}</div>,
    hr: () => <hr className="sg-horizontal-line" />,
    img: ({ src, alt }) => <img src={src} alt={alt} className="sg-markdown-image" />,
    br: () => <br />,
    input: (props) => <input {...props} />,
  };
};
