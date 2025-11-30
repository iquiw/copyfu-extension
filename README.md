<p align="center">
  <picture style="vertical-align: bottom;">
    <img src="./src/assets/icon.png" height="64">
  </picture>
</p>

# CopyFU

[![Firefox Add-on](https://img.shields.io/amo/v/copyfu?style=for-the-badge)](https://addons.mozilla.org/ja/firefox/addon/copyfu/)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/egakkoaaohhnfppfhccbklamlcdfabff?style=for-the-badge&color=blue)](https://chromewebstore.google.com/detail/copyfu/egakkoaaohhnfppfhccbklamlcdfabff)

CopyFU is a Web Extension to copy URL and title of the current tab.  
URL and title can be formatted using user-defined [LiquidJS](https://liquidjs.com) templates.

## Feature

- Copy URL and title of the current tab with customizable templates
- Copy URL and title of RSS/Atom feeds
- User-defined LiquidJS templates for advanced formatting
- Keyboard shortcuts for quick access
- Export/import templates for backup and sharing
- Drag-and-drop sorting for template management
- Context menu support

## Usage

### Popup

By clicking CopyFU icon on the toolbar, popup window is shown.  
Then clicking one of the template buttons copied formatted URL and title to clipboard.

#### Available keyboard shortcuts

##### Global keyboard shortcuts

| Shortcut                | Action               |
| ---                     | ---                  |
| <kbd>Ctrl+Shift+U</kbd> | Open CopyFU popup    |
| _Unassigned_            | Copy with template 1 |
| _Unassigned_            | Copy with template 2 |
| _Unassigned_            | Copy with template 3 |

##### Shortcuts on Popup

| Shortcut                    | Action                                                      |
| ---                         | ---                                                         |
| <kbd>1</kbd> ~ <kbd>9</kbd> | Copy formatted URL and title with template indexed by 1 ~ 9 |

### Options

By clicking Options icon on CopyFU popup, options tab is shown.  
Then you can defined custom templates in [LiquidJS](https://liquidjs.com).

#### Variables

The following variables are defined when formatting templates.

| Variable | Type                                                         | Description                                                        |
| ---      | ---                                                          | ---                                                                |
| `url`    | string                                                       | URL of the current tab.                                            |
| `title`  | string                                                       | Title of the current tab.                                          |
| `feeds`  | array of type `{ url: string, title: string, type: string }` | Feeds URL/Title if available.<br>`type` is either `rss` or `atom`. |

#### Filters

In addition to LiquidJS bultin filters, the following 3 filters can be used.

| Filter  | Arguments                         | Return value type | Description                                                          |
| ---     | ---                               | ---               | ---                                                                  |
| `sub`   | regexp string, replacement string | string            | substitute a text that matches the regexp with the replacement       |
| `gsub`  | regexp string, replacement string | string            | globally substitute texts that match the regexp with the replacement |
| `match` | regexp string                     | boolean           | judge whether there is any text that matches the regexp              |

##### `sub`

Input

```mustache
{{ "https://some.company.example.com" | sub: "\\.com$", ".jp" }}
```

Output

```
https://some.company.example.jp
```

##### `gsub`

Input

```mustache
{{ "https://some.company.example.com" | gsub: "com[a-z]*", "jp" }}
```

Output

```
https://some.jp.example.jp
```

##### `match`

Input

```mustache
{{ "https://some.company.example.com" | match: "//.*example.com$" }}
```

Output

```
true
```

#### Templates

##### Example: Simple Markdown

Simple template for Markdown link.

```mustache
[{{title}}]({{url}})
```

##### Example: Amazon

Template to simplify Amazon pages and output Markdown link.

```mustache
{%- assign url = url | sub: "(https://[^/]*amazon.(?:com|co\.[a-z]{2}))/.*(/dp/[^/?]+).*", "$1$2" -%}
[{{title}}]({{url}})
```

It translates the following URL

```
https://www.amazon.co.jp/%E3%80%90Amazon-co-jp-%E9%99%90%E5%AE%9A%E3%80%91Kensington-K72084JP-Bluetooth%E3%83%BB2-4GHz%E3%83%AF%E3%82%A4%E3%83%A4%E3%83%AC%E3%82%B9%E3%83%BB%E6%9C%89%E7%B7%9A%E6%8E%A5%E7%B6%9A%E5%AF%BE%E5%BF%9C-%E5%86%8D%E7%94%9F%E3%83%97%E3%83%A9%E3%82%B9%E3%83%81%E3%83%83%E3%82%AF%E4%BD%BF%E7%94%A8/dp/B0DM5BJFLR/ref=sr_1_4?dib_tag=se&qid=1754959361&refinements=p_123%3A314147&rnid=23341432051&s=computers&sr=1-4&th=1
```

into

```
https://www.amazon.co.jp/dp/B0DM5BJFLR
```

and other URLs are unchanged.

##### Example: Box

Template to convert Box URL to shared one and output Markdown link.

```mustache
{%- assign is_box = url | match: "https://app.box.com/.*\\?s=.*" -%}
{%- if is_box -%}
[{{title}}]({{ url | sub: "https://.*\\?s=(.*)", "$1" | prepend: "https://<Custom Subdomain>.box.com/s/" }})
{%- endif -%}
```

It translates the following URL

```
https://app.box.com/folder/nnnnnnnnnnnn?s=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

into

```
https://<Custom Subdomain>.box.com/s/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

and no output is produced for other URLs.

##### Feeds example

Template for the first feed URL.

```mustache
{{ feeds | first | map: "url" }}
```

Template to prefer Atom feed URL.

```mustache
{%- assign feed = feeds | find_exp: "item", "item.type == 'atom'" -%}
{%- if feed -%}
  {{ feed.url }}
{%- else -%}
  {{ feeds | first | map: "url" }}
{%- endif -%}
```

## Development

### Prerequisites

[bun](https://bun.sh) needs to be installed.  
Then, install dependencies.

```console
$ bun i
```

### Build

```console
$ bun run zip             # for Chrome
$ bun run zip:firefox     # for Firefox
```

### TODO

- [x] Copy formatted template
- [x] Save format templates
- [x] Sort format templates by DnD
- [x] Shortcut for popup
- [x] Shortcuts for copy
- [x] App icon
- [x] Icon font
- [x] Liquid filter `sub`, `gsub`
- [x] Liquid filter `match`
- [x] Export
- [x] Import
- [x] I18N
- [x] Preset
- [x] Visual effect at copy
- [x] RSS/Atom feeds
