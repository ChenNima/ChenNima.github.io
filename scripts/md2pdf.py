#!/usr/bin/env python3
"""Convert resume Markdown files to styled PDFs using WeasyPrint."""

import sys
import re
from pathlib import Path
from markdown import markdown
from weasyprint import HTML, CSS
from weasyprint.text.fonts import FontConfiguration

RESUME_DIR = Path(__file__).parent.parent / "src" / "resume"

CSS_STYLE = """
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700&family=Inter:wght@400;600;700&display=swap');

@page {
    size: A4;
    margin: 1.4cm 1.7cm;
}

body {
    font-family: 'Inter', 'Noto Sans SC', sans-serif;
    font-size: 9.8pt;
    line-height: 1.5;
    color: #1a1a1a;
}

h1 {
    font-size: 14.5pt;
    font-weight: 700;
    color: #0d47a1;
    border-bottom: 2px solid #0d47a1;
    padding-bottom: 3px;
    margin-top: 12px;
    margin-bottom: 6px;
}

h2 {
    font-size: 12pt;
    font-weight: 700;
    color: #1565c0;
    margin-top: 10px;
    margin-bottom: 3px;
}

h3 {
    font-size: 10.5pt;
    font-weight: 600;
    color: #333;
    margin-top: 8px;
    margin-bottom: 3px;
}

h3 small {
    font-weight: 400;
    color: #666;
}

a {
    color: #1565c0;
    text-decoration: none;
}

ul {
    margin: 3px 0;
    padding-left: 20px;
}

li {
    margin-bottom: 2px;
}

code {
    font-family: 'Menlo', 'Consolas', monospace;
    font-size: 9pt;
    background-color: #f0f4f8;
    padding: 1px 4px;
    border-radius: 3px;
    color: #d63384;
}

p {
    margin: 4px 0;
}

.d-none {
    display: none;
}

.d-flex {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.d-flex span {
    width: 72px !important;
}

.d-flex img, .d-flex image {
    width: 72px !important;
    height: auto;
}

h2, h3 {
    page-break-after: avoid;
}

li {
    page-break-inside: avoid;
}
"""


def convert_resume(md_path: Path, pdf_path: Path):
    """Convert a single markdown resume to PDF."""
    content = md_path.read_text(encoding="utf-8")

    # Remove frontmatter
    content = re.sub(r"^---\n.*?---\n", "", content, flags=re.DOTALL)

    # Convert image tags to standard HTML img
    content = content.replace("<image ", "<img ")

    # Fix nested list indentation: Python markdown requires 4-space indent
    # for nested lists, but our files use 2-space indent
    lines = content.split("\n")
    fixed_lines = []
    for line in lines:
        # Match lines starting with spaces followed by a list marker (- or *)
        m = re.match(r"^( +)([-*] )", line)
        if m:
            indent = m.group(1)
            # Double the indentation to convert 2-space to 4-space nesting
            line = indent * 2 + line[len(indent):]
        fixed_lines.append(line)
    content = "\n".join(fixed_lines)

    # Convert markdown to HTML
    html_body = markdown(
        content,
        extensions=["extra", "sane_lists"],
        output_format="html5",
    )

    html_string = f"""<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body>
{html_body}
</body>
</html>"""

    font_config = FontConfiguration()
    css = CSS(string=CSS_STYLE, font_config=font_config)

    HTML(string=html_string, base_url=str(md_path.parent)).write_pdf(
        str(pdf_path),
        stylesheets=[css],
        font_config=font_config,
    )
    print(f"Generated: {pdf_path}")


def main():
    files = {
        "Resume.md": "Resume.pdf",
        "Resum-en.md": "Resum-en.pdf",
    }

    targets = sys.argv[1:] if len(sys.argv) > 1 else files.keys()

    for md_name in targets:
        if md_name not in files:
            print(f"Unknown file: {md_name}", file=sys.stderr)
            continue
        md_path = RESUME_DIR / md_name
        pdf_path = RESUME_DIR / files[md_name]
        if not md_path.exists():
            print(f"Not found: {md_path}", file=sys.stderr)
            continue
        convert_resume(md_path, pdf_path)


if __name__ == "__main__":
    main()
