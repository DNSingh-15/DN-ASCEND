import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ReactNode } from "react";
import { localImageSize } from "@/lib/image-size";
import Flow from "./Flow";
import Uml from "./Uml";

function textOf(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(textOf).join("");
  return "";
}

export default function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // Same image, but fetched only when it is about to scroll into view. Local images also get their width and height,
        // so the space is reserved before they load (no layout shift).
        img({ node: _node, alt, ...props }) {
          const size = typeof props.src === "string" && !props.width && !props.height ? localImageSize(props.src) : null;
          // eslint-disable-next-line @next/next/no-img-element
          return <img alt={alt ?? ""} loading="lazy" decoding="async" {...(size ?? {})} {...props} />;
        },
        // A topic's notes start at ### (the topic itself is the page's h1), so headings move up one level for a correct
        // outline: ### -> h2, #### -> h3, ##### -> h4. The md-h* classes keep each one looking exactly as before.
        h3({ node: _node, className, ...props }) {
          return <h2 className={`md-h3 ${className ?? ""}`.trim()} {...props} />;
        },
        h4({ node: _node, className, ...props }) {
          return <h3 className={`md-h4 ${className ?? ""}`.trim()} {...props} />;
        },
        h5({ node: _node, className, ...props }) {
          return <h4 className={`md-h5 ${className ?? ""}`.trim()} {...props} />;
        },
        // ```flow blocks become step-by-step charts and ```uml blocks class diagrams; everything else stays a normal code block.
        pre({ children: kids, ...props }) {
          const child = Array.isArray(kids) ? kids[0] : kids;
          const el = child as { props?: { className?: string; children?: ReactNode } } | undefined;
          if (el?.props?.className?.includes("language-flow")) {
            return <Flow source={textOf(el.props.children)} />;
          }
          if (el?.props?.className?.includes("language-uml")) {
            return <Uml source={textOf(el.props.children)} />;
          }
          return <pre {...props}>{kids}</pre>;
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
