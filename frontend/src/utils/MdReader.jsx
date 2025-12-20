import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function MdReader({ text }) {
  return (
    <ReactMarkdown  remarkPlugins={[remarkGfm]}>
      {text}
    </ReactMarkdown>
  );
}

export default MdReader;
