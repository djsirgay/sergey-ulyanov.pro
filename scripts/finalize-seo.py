#!/usr/bin/env python3
"""Finalize SEO on a disposable Pages artifact, never on the source repository.

GitHub Pages has no per-path HTTP redirect configuration here. Use Google's
supported zero-delay HTML redirect, a matching canonical, and a visible link.
"""
import argparse
import html
import json
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import xml.etree.ElementTree as ET

PROFESSIONAL = 'https://sergey-ulyanov.pro'
ACTOR = 'https://heyitissergey.com/'
ACTOR_ROUTES = ('actor-final', 'actor-final-preview', 'actor-preview', 'actor-preview-v2')
PART_ANCHORS = {'part-1.html': 'top', 'part-2.html': 'work', 'part-3.html': 'profile', 'part-4.html': 'contact'}
NS = 'http://www.sitemaps.org/schemas/sitemap/0.9'

class Metadata(HTMLParser):
    def __init__(self):
        super().__init__()
        self.canonicals = []
        self.noindex = False
        self.redirect = False
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'link' and 'canonical' in a.get('rel', '').lower().split():
            self.canonicals.append(a.get('href', ''))
        if tag == 'meta':
            if a.get('name', '').lower() in ('robots', 'googlebot'):
                self.noindex |= 'noindex' in a.get('content', '').lower()
            self.redirect |= a.get('http-equiv', '').lower() == 'refresh'

def redirect_page(anchor=''):
    destination = ACTOR + ('#' + anchor if anchor else '')
    safe = html.escape(destination, quote=True)
    script = ('const target=new URL(' + json.dumps(destination) + ');'
              'const aliases={"#credits":"#work","#headshots":"#materials","#about":"#profile"};'
              'target.search=location.search;'
              'if(location.hash)target.hash=aliases[location.hash]||location.hash;'
              'location.replace(target.href);')
    return ('<!doctype html>\n<html lang="en"><head><meta charset="utf-8">\n'
            '<meta name="viewport" content="width=device-width,initial-scale=1">\n'
            '<title>Sergéy Ulyanov — Actor website moved</title>\n'
            '<link rel="canonical" href="' + ACTOR + '">\n'
            '<script>' + script + '</script>\n'
            '<meta http-equiv="refresh" content="0;url=' + safe + '">\n'
            '</head><body><p>The actor website is now at '
            '<a href="' + safe + '">heyitissergey.com</a>.</p></body></html>\n')

def finalize(artifact):
    root = artifact.resolve()
    source = Path(__file__).resolve().parent.parent
    if root == source or not root.is_dir():
        raise ValueError('Refusing to modify source repository or missing artifact directory')
    sitemap = root / 'sitemap.xml'
    # Parse before making changes: invalid XML must not leave half-finalized output.
    tree = ET.parse(sitemap)
    rewritten = []
    for route in ACTOR_ROUTES:
        directory = root / route
        if not directory.is_dir():
            continue
        for page in directory.rglob('*.html'):
            if page.is_symlink():
                raise ValueError('Refusing symlink: ' + str(page))
            page.write_text(redirect_page(PART_ANCHORS.get(page.name, '')), encoding='utf-8')
            rewritten.append(str(page.relative_to(root)))
    removed = []
    for entry in list(tree.getroot()):
        loc = entry.find('{' + NS + '}loc')
        value = (loc.text or '').strip() if loc is not None else ''
        url = urlsplit(value)
        keep = url.scheme == 'https' and url.netloc == 'sergey-ulyanov.pro' and not url.query and not url.fragment
        file = (root / unquote(url.path).lstrip('/')).resolve()
        if not file.is_relative_to(root):
            keep = False
        if file.is_dir():
            file = file / 'index.html'
        if not file.is_file() or file.suffix != '.html':
            keep = False
        if keep:
            meta = Metadata()
            meta.feed(file.read_text(encoding='utf-8'))
            keep = meta.canonicals == [value] and not meta.noindex and not meta.redirect
        if not keep:
            tree.getroot().remove(entry)
            removed.append(value)
    if not list(tree.getroot()):
        raise ValueError('Refusing to publish an empty professional sitemap')
    ET.register_namespace('', NS)
    ET.indent(tree, space='  ')
    tree.write(sitemap, encoding='utf-8', xml_declaration=True)
    print(json.dumps({'actorRedirects': rewritten, 'removedFromSitemap': removed,
                      'sitemapUrls': len(list(tree.getroot()))}))

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--artifact', required=True, type=Path)
    finalize(parser.parse_args().artifact)
