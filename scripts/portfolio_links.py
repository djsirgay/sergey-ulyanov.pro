"""Apply the professional portfolio's browsing policy to authored HTML links."""
from html import escape
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit


class PortfolioLinks(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=False)
        self.offsets = [0]
        for line in source.splitlines(keepends=True):
            self.offsets.append(self.offsets[-1] + len(line))
        self.edits = []
        self.feed(source)
        self.close()

    def handle_starttag(self, tag, attrs):
        if tag != 'a':
            return
        attributes = dict(attrs)
        href = attributes.get('href') or ''
        if 'download' in attributes:
            return
        url = urlsplit(href)
        if url.scheme not in ('', 'http', 'https'):
            return
        external = url.hostname and url.hostname not in ('sergey-ulyanov.pro', 'www.sergey-ulyanov.pro')
        # The live professional artifact redirects the legacy research subtree to a different site.
        research_redirect = url.path.startswith('/research/') and not url.query.startswith('stay=1')
        pdf = url.path.lower().endswith('.pdf')
        if not (external or research_redirect or pdf):
            return
        rel = (attributes.get('rel') or '').split()
        if attributes.get('target') == '_blank' and 'noopener' in rel:
            return
        rel = list(dict.fromkeys([*filter(lambda value: value != 'opener', rel), 'noopener']))
        updated = [(name, value) for name, value in attrs if name not in ('rel', 'target')]
        updated.extend((('target', '_blank'), ('rel', ' '.join(rel))))
        rendered = '<a' + ''.join(
            f' {name}' if value is None else f' {name}="{escape(value, quote=True)}"'
            for name, value in updated
        ) + '>'
        row, column = self.getpos()
        start = self.offsets[row - 1] + column
        self.edits.append((start, start + len(self.get_starttag_text()), rendered))


def mark_outbound(source):
    for start, end, new in reversed(PortfolioLinks(source).edits):
        source = source[:start] + new + source[end:]
    return source


def professional_pages(root):
    """Research builds and the actor archive remain independently maintained."""
    yield from sorted(root.glob('*.html'))
    for route in ('work', 'hire', 'press', 'evidence', 'case-studies', 'privacy',
                  'insight-cards', 'joyofphonetics', 'palacio-study', 'community'):
        yield from sorted((root / route).rglob('*.html'))


if __name__ == '__main__':
    root = Path(__file__).resolve().parents[1]
    for path in [*professional_pages(root), *sorted((root / 'site-fragments').glob('*.html'))]:
        source = path.read_text(encoding='utf-8')
        updated = mark_outbound(source)
        if updated != source:
            path.write_text(updated, encoding='utf-8')
