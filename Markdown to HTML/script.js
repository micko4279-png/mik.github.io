const markdownInputEl = document.getElementById("markdown-input");
const rawHTMLOutputEl = document.getElementById("html-output");
const htmlPreviewEl = document.getElementById("preview");

function convertMarkdown() {
  let md = markdownInputEl.value;

  const normalizeLineRegex = /\r\n/g;
  //block-level transform
  const headingRegex = /^(#+)\s?(.*)$/gm;
  const quoteRegex = /^>\s?(.*)$/gm;
  const horizontalRuleRegex = /^\s*-{3,}|\*{3,}|_{3,}\s*$/gm;
  //inline transform
  const inlineCodeRegex = /`([^`]+)`/g;
  const imgRegex = /!\[(.*?)\]\((.*?)\)/gm;
  const linkRegex = /\[(.*?)\]\((.*?)\)/gm;
  const strikeThroughRegex = /~~(.*?)~~/gm;
  const strongRegex = /(\*\*|__)(.*?)\1/gm;
  const italicRegex = /(\*|_)(.*?)\1/gm;

  //normalize line endings
  md = md.replace(normalizeLineRegex, "\n");

  // handle headingRegex
  md = md.replace(headingRegex, (match, hashes, content) => {
    const level = hashes.length;
    if (level >= 1 && level <= 6) {
      return `<h${level}>${content}</h${level}>`;
    } else {
      return match;
    }
  });

  //handle inlineCodeRegex
  md = md.replace(inlineCodeRegex, "<code>$1</code>");

  //handle imgRegex
  md = md.replace(imgRegex, '<img alt="$1" src="$2" />');

  //handle linkRegex
  md = md.replace(linkRegex, '<a href="$2">$1</a>');

  // handle strikeThroughRegex
  md = md.replace(strikeThroughRegex, "<s>$1</s>");

  // handle strongRegex
  md = md.replace(strongRegex, "<strong>$2</strong>");

  // handle italicRegex
  md = md.replace(italicRegex, "<em>$2</em>");

  //handle quoteRegex
  md = md.replace(quoteRegex, "<blockquote>$1</blockquote>");

  //handle horizontalRuleRegex
  md = md.replace(horizontalRuleRegex, "<hr>");

  //render raw html output
  rawHTMLOutputEl.textContent = md;

  //render HTML preview
  if (typeof DOMPurify !== "undefined") {
    const cleanedHTML = DOMPurify.sanitize(md);
    htmlPreviewEl.innerHTML = cleanedHTML;
  } else {
    htmlPreviewEl.innerHTML = md;
  }

  return md;
}

markdownInputEl.addEventListener("input", () => convertMarkdown());
